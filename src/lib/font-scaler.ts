/**
 * font-scaler.ts
 * Utilitas cerdas untuk menghitung ukuran font adaptif secara dinamis
 * berdasarkan panjang teks/karakter yang ditampilkan.
 *
 * Karakter sedikit  => Ukuran font membesar (mengisi ruang, tidak kopong)
 * Karakter banyak   => Ukuran font mengecil proporsional
 * Batas [minPx, maxPx] dipatuhi secara ketat agar tidak pernah overflow atau terlalu kecil.
 */

export interface FontScalerOptions {
  minPx: number;
  maxPx: number;
  shortThreshold?: number; // Batas karakter minimum di mana ukuran maxPx digunakan
  longThreshold?: number;  // Batas karakter maksimum di mana ukuran minPx digunakan
}

export function getAdaptiveFontSize(
  text: string | undefined | null,
  options: FontScalerOptions
): number {
  if (!text) return options.maxPx;
  const len = text.trim().length;
  const shortLen = options.shortThreshold ?? 30;
  const longLen = options.longThreshold ?? 120;

  if (len <= shortLen) return options.maxPx;
  if (len >= longLen) return options.minPx;

  const ratio = (len - shortLen) / (longLen - shortLen);
  const size = options.maxPx - ratio * (options.maxPx - options.minPx);
  return Math.round(size);
}

// Preset spesifik untuk komponen TV Display (1920x1080)
export const fontPresets = {
  // Hadits: Teks Arab
  hadithArabic: (text: string) =>
    getAdaptiveFontSize(text, { minPx: 28, maxPx: 46, shortThreshold: 35, longThreshold: 110 }),

  // Hadits: Terjemahan Indonesia
  hadithTranslation: (text: string) =>
    getAdaptiveFontSize(text, { minPx: 18, maxPx: 28, shortThreshold: 60, longThreshold: 150 }),

  // Hadits: Sumber / Perawi
  hadithSource: (text: string) =>
    getAdaptiveFontSize(text, { minPx: 14, maxPx: 18, shortThreshold: 20, longThreshold: 50 }),

  // Header: Nama Masjid
  mosqueName: (text: string) =>
    getAdaptiveFontSize(text, { minPx: 26, maxPx: 38, shortThreshold: 18, longThreshold: 40 }),

  // Header: Alamat Masjid
  mosqueAddress: (text: string) =>
    getAdaptiveFontSize(text, { minPx: 14, maxPx: 19, shortThreshold: 35, longThreshold: 80 }),

  // Kajian: Judul Kajian
  kajianTitle: (text: string) =>
    getAdaptiveFontSize(text, { minPx: 36, maxPx: 58, shortThreshold: 22, longThreshold: 55 }),

  // Kajian: Nama Pemateri / Ustadz
  kajianSpeaker: (text: string) =>
    getAdaptiveFontSize(text, { minPx: 24, maxPx: 36, shortThreshold: 16, longThreshold: 35 }),

  // Kajian: Keterangan / Tempat
  kajianInfoVal: (text: string) =>
    getAdaptiveFontSize(text, { minPx: 18, maxPx: 26, shortThreshold: 15, longThreshold: 35 }),

  // QRIS: Nama Rekening
  qrisAccountName: (text: string) =>
    getAdaptiveFontSize(text, { minPx: 18, maxPx: 24, shortThreshold: 20, longThreshold: 45 }),

  // Laporan Keuangan: Judul Baris
  keuanganItemTitle: (text: string) =>
    getAdaptiveFontSize(text, { minPx: 16, maxPx: 22, shortThreshold: 18, longThreshold: 35 }),
};
