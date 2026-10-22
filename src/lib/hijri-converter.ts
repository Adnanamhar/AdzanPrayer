// src/lib/hijri-converter.ts
// Hijri Date — AlAdhan API (Umm al-Qura) + Fallback Kuwaiti Algorithm

export interface HijriDateData {
  day: number;
  monthName: string;
  year: number;
}

const hijriCache: { date: string | null; hijri: HijriDateData | null } = {
  date: null,
  hijri: null,
};

function gmod(n: number, m: number): number {
  return ((n % m) + m) % m;
}

function kuwaitiCalendar(dateObj: Date) {
  const day = dateObj.getDate();
  let month = dateObj.getMonth() + 1;
  let year = dateObj.getFullYear();

  if (month < 3) {
    year--;
    month += 12;
  }

  let a = Math.floor(year / 100);
  let b = 2 - a + Math.floor(a / 4);
  if (year < 1583) b = 0;

  const jd = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524;

  const epochastro = 1948084;
  const iyear = 10631 / 30;
  const shift1 = 8.01 / 60;

  const z = jd - epochastro;
  const cyc = Math.floor(z / 10631);
  let zr = z - 10631 * cyc;
  const j = Math.floor((zr - shift1) / iyear);
  const iy = 30 * cyc + j;
  zr = zr - Math.floor(j * iyear + shift1);
  let im = Math.floor((zr + 28.5001) / 29.5);
  if (im === 13) im = 12;
  const id = zr - Math.floor(29.5001 * im - 29);

  return { day: id, month: im, year: iy };
}

async function fetchHijriFromAPI(date: Date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const url = `https://api.aladhan.com/v1/gToH?date=${dd}-${mm}-${yyyy}`;

  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);

  const json = await res.json();
  const h = json.data.hijri;

  return {
    day: parseInt(h.day),
    month: h.month.number,
    monthName: h.month.ar,
    year: parseInt(h.year),
  };
}

export const hijriMonthNames = [
  "Muharram", "Safar", "Rabi'ul Awwal", "Rabi'ul Akhir",
  "Jumadil Awwal", "Jumadil Akhir", "Rajab", "Sya'ban",
  "Ramadhan", "Syawal", "Dzulqa'dah", "Dzulhijjah"
];

export async function getHijriDate(dateObj: Date): Promise<HijriDateData> {
  const todayKey = `${dateObj.getFullYear()}-${dateObj.getMonth()}-${dateObj.getDate()}`;
  
  if (hijriCache.date === todayKey && hijriCache.hijri) {
    return hijriCache.hijri;
  }

  try {
    const h = await fetchHijriFromAPI(dateObj);
    const monthName = hijriMonthNames[h.month - 1] || h.monthName;
    const result = { day: h.day, monthName, year: h.year };

    hijriCache.date = todayKey;
    hijriCache.hijri = result;
    
    if (typeof window !== 'undefined') {
        localStorage.setItem('hijriDate', JSON.stringify({ key: todayKey, data: result }));
    }
    
    return result;
  } catch (err) {
    console.warn("[Hijri] API gagal, menggunakan fallback:", (err as Error).message);

    if (typeof window !== 'undefined') {
        const cached = localStorage.getItem('hijriDate');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.key === todayKey) {
            hijriCache.date = todayKey;
            hijriCache.hijri = parsed.data;
            return parsed.data;
          }
        }
    }

    const kw = kuwaitiCalendar(dateObj);
    const monthName = hijriMonthNames[kw.month - 1] || "?";
    const result = { day: kw.day, monthName, year: kw.year };

    hijriCache.date = todayKey;
    hijriCache.hijri = result;
    return result;
  }
}
