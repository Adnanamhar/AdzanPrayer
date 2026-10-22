import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import type { MosqueData } from "../types/mosque";

const SETTINGS_DOC_ID = "display";
const COLLECTION_NAME = "settings";

export const defaultMosqueData: MosqueData = {
  mosqueName: "Masjid Nurul Himmah",
  address: "Kp. Duren Seribu, Bojongsari, Kota Depok",
  logo: "",
  timezone: "WIB",
  adminPin: "1234",
  coords: { lat: -7.9167, lng: 112.6000 },
  locationName: "Kabupaten Malang",
  calculationMethod: "MuslimWorldLeague",
  kemenagCityId: "1614",
  offsets: { imsak: 0, fajr: 0, sunrise: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 },
  hijriOffset: 0,
  preAdzanSec: 60,
  adzanDelaySec: 180,
  iqamahDelays: { fajr: 10, dhuhr: 10, asr: 10, maghrib: 5, isha: 10 },
  shalatDurationMin: 15,
  fridayMode: true,
  slides: [
      "/assets/img/slide-1.png",
      "/assets/img/kajian-poster.png",
      "/assets/img/qris-placeholder.png"
  ],
  slideDurationSec: 15,
  slideOrder: ["images", "kajian", "keuangan", "qris"],
  showKajianSlide: true,
  showKeuanganSlide: true,
  showQrisSlide: true,
  qris: {
      image: "",
      bankName: "BSI",
      accountNo: "7123456789",
      accountName: "Masjid Nurul Himmah"
  },
  kajianList: [],
  keuangan: {
      periode: "",
      pemasukan: [],
      pengeluaran: []
  },
  runningText: "Lurus dan rapatkan shaf demi kesempurnaan serta keutamaan sholat berjamaah ✦ Mohon menonaktifkan HP saat khutbah",
  hadithArabic: "ظِلُّ الْمُؤْمِنِ يَوْمَ الْقِيَامَةِ صَدَقَتُهُ",
  hadithTranslate: "Naungan bagi seorang mukmin pada hari kiamat adalah amalan sedekahnya.",
  hadithSource: "HR. Ahmad No. 17333",
  hadithList: [
    {
      id: "hadith-subuh",
      prayer: "subuh",
      arabic: "مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ",
      translate: "Barangsiapa shalat Subuh berjamaah, maka ia berada dalam jaminan perlindungan Allah.",
      source: "HR. Muslim No. 657"
    },
    {
      id: "hadith-dzuhur",
      prayer: "dzuhur",
      arabic: "صَلاَةُ الْجَمَاعَةِ تَفْضُلُ صَلاَةَ الْفَذِّ بِسَبْعٍ وَعِشْرِينَ دَرَجَةً",
      translate: "Shalat berjamaah lebih utama daripada shalat sendirian dengan dua puluh tujuh derajat kemuliaan.",
      source: "HR. Bukhari No. 645 & Muslim No. 650"
    },
    {
      id: "hadith-ashar",
      prayer: "ashar",
      arabic: "مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ",
      translate: "Barangsiapa shalat pada dua waktu yang dingin (Subuh dan Ashar), maka ia akan masuk surga.",
      source: "HR. Bukhari No. 574 & Muslim No. 635"
    },
    {
      id: "hadith-maghrib",
      prayer: "maghrib",
      arabic: "ظِلُّ الْمُؤْمِنِ يَوْمَ الْقِيَامَةِ صَدَقَتُهُ",
      translate: "Naungan bagi seorang mukmin pada hari kiamat adalah amalan sedekahnya.",
      source: "HR. Ahmad No. 17333"
    },
    {
      id: "hadith-isya",
      prayer: "isya",
      arabic: "مَنْ صَلَّى الْعِشَاءَ فِي جَمَاعَةٍ فَكَأَنَّمَا قَامَ نِصْفَ اللَّيْلِ",
      translate: "Barangsiapa shalat Isya berjamaah, maka seolah-olah ia telah shalat separuh malam penuh.",
      source: "HR. Muslim No. 656"
    }
  ],
  theme: {
      c1: "#1C1D37",
      c2: "#445A79",
      c3: "#84A2C9",
      c4: "#D6E0EA",
      c5: "#FFFFFF"
  },
  restMode: { enabled: false, start: "22:00", end: "03:00" }
};

export async function getMosqueData(): Promise<MosqueData | null> {
  try {
      const res = await fetch('/api/mosquedata', { cache: 'no-store' });
      if (res.ok) {
          const data = await res.json();
          return { ...defaultMosqueData, ...data } as MosqueData;
      }
  } catch (e) {
      console.warn("API fetch error:", e);
  }
  return null;
}

export async function saveMosqueData(data: Partial<MosqueData>): Promise<void> {
  try {
      await fetch('/api/mosquedata', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
      });
  } catch (e) {
      console.warn("API save error:", e);
  }
}

export function onMosqueDataSnapshot(callback: (data: MosqueData) => void): () => void {
  // Since we replaced Firebase with a local API, we'll use a polling mechanism for the TV display.
  // This ensures that any device on the local network (e.g., Admin on laptop, TV on mini PC) gets updates.
  let isCancelled = false;
  
  const poll = async () => {
      if (isCancelled) return;
      const data = await getMosqueData();
      if (data && !isCancelled) {
          callback(data);
      }
  };

  // Initial fetch
  poll();

  // Poll every 3 seconds for updates
  const interval = setInterval(poll, 3000);

  return () => {
      isCancelled = true;
      clearInterval(interval);
  };
}
