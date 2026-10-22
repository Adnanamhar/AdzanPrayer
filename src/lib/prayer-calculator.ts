import * as adhan from 'adhan';
import type { MosqueData } from '../types/mosque';
import type { PrayerTimes, PrayerKey } from '../types/prayer';

export class PrayerCalculator {
  times: PrayerTimes | null = null;
  private _apiCacheDate: string | null = null;
  private config: Pick<MosqueData, 'coords' | 'calculationMethod' | 'offsets' | 'iqamahDelays' | 'preAdzanSec' | 'fridayMode' | 'kemenagCityId'>;

  constructor(mosqueData: MosqueData) {
    this.config = {
      coords: mosqueData.coords,
      calculationMethod: mosqueData.calculationMethod,
      offsets: mosqueData.offsets,
      iqamahDelays: mosqueData.iqamahDelays,
      preAdzanSec: mosqueData.preAdzanSec,
      fridayMode: mosqueData.fridayMode,
      kemenagCityId: mosqueData.kemenagCityId || "1614"
    };
  }

  updateConfig(mosqueData: MosqueData) {
    this.config = {
      coords: mosqueData.coords,
      calculationMethod: mosqueData.calculationMethod,
      offsets: mosqueData.offsets,
      iqamahDelays: mosqueData.iqamahDelays,
      preAdzanSec: mosqueData.preAdzanSec,
      fridayMode: mosqueData.fridayMode,
      kemenagCityId: mosqueData.kemenagCityId || "1614"
    };
  }

  async init(date: Date = new Date()): Promise<PrayerTimes> {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('prayerTimesAPI');
    }
    const successKemenag = await this.fetchFromKemenag(date);
    if (!successKemenag) {
      const successAlAdhan = await this.fetchFromAlAdhan(date);
      if (!successAlAdhan) {
        this.calculateOffline(date);
      }
    }

    // Safety fallback: ensure times is defined and has valid timestamps
    const isValid = this.times && Object.values(this.times).every(d => d instanceof Date && !isNaN(d.getTime()));
    if (!isValid) {
      console.warn("[Prayer] Times tidak valid, menggunakan kalkulasi offline adhan");
      this.calculateOffline(date);
    }

    return this.times!;
  }

  private async fetchFromKemenag(date: Date): Promise<boolean> {
    try {
      const cityId = this.config.kemenagCityId;
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');

      const url = `https://api.myquran.com/v2/sholat/jadwal/${cityId}/${yyyy}/${mm}/${dd}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) throw new Error(`MyQuran API ${res.status}`);

      const json = await res.json();
      if (!json.status) throw new Error("MyQuran data tidak tersedia");
      const t = json.data.jadwal;

      const parse = (str: string) => {
        if (!str) return new Date(date);
        const clean = str.replace(/[^\d:]/g, '').trim();
        const parts = clean.split(':');
        const h = parseInt(parts[0] || '0', 10);
        const m = parseInt(parts[1] || '0', 10);
        const d = new Date(date);
        d.setHours(isNaN(h) ? 0 : h, isNaN(m) ? 0 : m, 0, 0);
        return d;
      };

      const off = this.config.offsets;
      const addMin = (d: Date, min: number) => new Date(d.getTime() + (min || 0) * 60000);

      const fajrDate = addMin(parse(t.subuh), off.fajr);
      // Imsak ALWAYS Subuh - 10 menit (ditambah offset imsak jika diatur)
      const imsakDate = new Date(fajrDate.getTime() - 10 * 60000 + (off.imsak || 0) * 60000);

      this.times = {
        imsak: imsakDate,
        fajr: fajrDate,
        sunrise: addMin(parse(t.terbit), off.sunrise),
        dhuhr: addMin(parse(t.dzuhur), off.dhuhr),
        asr: addMin(parse(t.ashar), off.asr),
        maghrib: addMin(parse(t.maghrib), off.maghrib),
        isha: addMin(parse(t.isya), off.isha)
      };

      this._apiCacheDate = `${yyyy}-${mm}-${dd}`;
      if (typeof window !== 'undefined') {
          localStorage.setItem('prayerTimesAPI', JSON.stringify({
            date: this._apiCacheDate,
            source: 'kemenag',
            timings: t
          }));
      }

      console.log(`[Prayer] Data dari Kemenag SIHAT (${json.data.lokasi})`);
      return true;
    } catch (err) {
      console.warn("[Prayer] Kemenag API gagal:", (err as Error).message);

      if (typeof window !== 'undefined') {
          const cached = localStorage.getItem('prayerTimesAPI');
          if (cached) {
            const parsed = JSON.parse(cached);
            const dd = String(date.getDate()).padStart(2, '0');
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const yyyy = date.getFullYear();
            if (parsed.date === `${yyyy}-${mm}-${dd}` && parsed.source === 'kemenag') {
              const t = parsed.timings;
              const parse = (str: string) => {
                if (!str) return new Date(date);
                const clean = str.replace(/[^\d:]/g, '').trim();
                const parts = clean.split(':');
                const h = parseInt(parts[0] || '0', 10);
                const m = parseInt(parts[1] || '0', 10);
                const d = new Date(date);
                d.setHours(isNaN(h) ? 0 : h, isNaN(m) ? 0 : m, 0, 0);
                return d;
              };
              const off = this.config.offsets;
              const addMin = (d: Date, min: number) => new Date(d.getTime() + (min || 0) * 60000);
              const fajrDate = addMin(parse(t.subuh), off.fajr);
              const imsakDate = new Date(fajrDate.getTime() - 10 * 60000 + (off.imsak || 0) * 60000);
              this.times = {
                imsak: imsakDate,
                fajr: fajrDate,
                sunrise: addMin(parse(t.terbit), off.sunrise),
                dhuhr: addMin(parse(t.dzuhur), off.dhuhr),
                asr: addMin(parse(t.ashar), off.asr),
                maghrib: addMin(parse(t.maghrib), off.maghrib),
                isha: addMin(parse(t.isya), off.isha)
              };
              console.log("[Prayer] Data dari cache Kemenag");
              return true;
            }
          }
      }
      return false;
    }
  }

  private async fetchFromAlAdhan(date: Date): Promise<boolean> {
    try {
      const lat = this.config.coords.lat || -7.9167;
      const lng = this.config.coords.lng || 112.6000;
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();

      const url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=20`;
      const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      if (!res.ok) throw new Error(`AlAdhan API ${res.status}`);

      const json = await res.json();
      const t = json.data.timings;

      const parse = (str: string) => {
        if (!str) return new Date(date);
        const clean = str.replace(/[^\d:]/g, '').trim();
        const parts = clean.split(':');
        const h = parseInt(parts[0] || '0', 10);
        const m = parseInt(parts[1] || '0', 10);
        const d = new Date(date);
        d.setHours(isNaN(h) ? 0 : h, isNaN(m) ? 0 : m, 0, 0);
        return d;
      };

      const off = this.config.offsets;
      const addMin = (d: Date, min: number) => new Date(d.getTime() + (min || 0) * 60000);

      const fajrDate = addMin(parse(t.Fajr), off.fajr);
      const imsakDate = new Date(fajrDate.getTime() - 10 * 60000 + (off.imsak || 0) * 60000);

      this.times = {
        imsak: imsakDate,
        fajr: fajrDate,
        sunrise: addMin(parse(t.Sunrise), off.sunrise),
        dhuhr: addMin(parse(t.Dhuhr), off.dhuhr),
        asr: addMin(parse(t.Asr), off.asr),
        maghrib: addMin(parse(t.Maghrib), off.maghrib),
        isha: addMin(parse(t.Isha), off.isha)
      };

      this._apiCacheDate = `${yyyy}-${mm}-${dd}`;
      if (typeof window !== 'undefined') {
          localStorage.setItem('prayerTimesAPI', JSON.stringify({
            date: this._apiCacheDate,
            source: 'aladhan',
            timings: t
          }));
      }

      console.log("[Prayer] Data dari AlAdhan API (Kemenag method=20)");
      return true;
    } catch (err) {
      console.warn("[Prayer] AlAdhan API gagal:", (err as Error).message);
      return false;
    }
  }

  private calculateOffline(date: Date) {
    let lat = this.config.coords.lat;
    let lng = this.config.coords.lng;
    if (isNaN(lat) || isNaN(lng)) { lat = -7.9167; lng = 112.6000; }

    const coords = new adhan.Coordinates(lat, lng);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let params: any;
    const method = this.config.calculationMethod;
    if (method === "MuslimWorldLeague") {
        params = adhan.CalculationMethod.MuslimWorldLeague();
        params.fajrAngle = 20; 
        params.ishaAngle = 18;
    } else {
        // Fallback
        params = adhan.CalculationMethod.MuslimWorldLeague();
    }
    
    params.adjustments = this.config.offsets;
    
    const pt = new adhan.PrayerTimes(coords, date, params);
    const imsakDate = new Date(pt.fajr.getTime() - 10 * 60000 + (this.config.offsets.imsak * 60000));

    this.times = {
      imsak: imsakDate,
      fajr: pt.fajr,
      sunrise: pt.sunrise,
      dhuhr: pt.dhuhr,
      asr: pt.asr,
      maghrib: pt.maghrib,
      isha: pt.isha
    };
    console.log("[Prayer] Data dari adhan (fallback offline)");
  }
}
