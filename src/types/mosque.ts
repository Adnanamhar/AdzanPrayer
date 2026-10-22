import type { KajianItem } from './kajian';
import type { KeuanganData } from './keuangan';

export interface Coords {
  lat: number;
  lng: number;
}

export interface PrayerOffsets {
  imsak: number;
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface IqamahDelays {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface QrisData {
  image: string;      // Base64
  bankName: string;
  accountNo: string;
  accountName: string;
}

export interface ThemeColors {
  c1: string;  // Paling Gelap
  c2: string;  // Aksen Gelap
  c3: string;  // Aksen Tengah
  c4: string;  // Terang
  c5: string;  // Paling Terang
}

export interface RestMode {
  enabled: boolean;
  start: string;  // "HH:mm"
  end: string;    // "HH:mm"
}

export interface PrayerHadithItem {
  id: string;
  prayer: 'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya' | 'umum';
  arabic: string;
  translate: string;
  source: string;
}

export interface MosqueData {
  // 1. Profil
  mosqueName: string;
  address: string;
  logo: string;
  timezone?: 'WIB' | 'WITA' | 'WIT';
  adminPin?: string;

  // 2. Jadwal Sholat
  coords: Coords;
  locationName: string;
  calculationMethod: string;
  kemenagCityId: string;
  offsets: PrayerOffsets;
  hijriOffset?: number;

  // 3. Waktu & Jeda
  preAdzanSec: number;
  adzanDelaySec: number;
  iqamahDelays: IqamahDelays;
  shalatDurationMin: number;
  fridayMode: boolean;

  // 4. Media
  slides: string[];           // Base64 array
  slideDurationSec: number;
  slideOrder: string[];
  showKajianSlide?: boolean;
  showKeuanganSlide?: boolean;
  showQrisSlide?: boolean;

  // 5. QRIS
  qris: QrisData;

  // 6. Kajian
  kajianList: KajianItem[];

  // 7. Keuangan
  keuangan: KeuanganData;

  // 8. Teks & Hadits
  runningText: string;
  hadithArabic: string;
  hadithTranslate: string;
  hadithSource: string;
  hadithList?: PrayerHadithItem[];

  // 9. Tema
  theme: ThemeColors;

  // 10. Sistem
  restMode: RestMode;
}
