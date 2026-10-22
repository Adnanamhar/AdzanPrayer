export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';
export type KajianAudience = 'all' | 'ikhwan' | 'akhwat';

export interface KajianItem {
  id: string;
  title: string;
  ustadz: string;
  date: string;       // "YYYY-MM-DD" for one-off or start date
  startTime: string;   // "HH:mm" or "Ba'da Maghrib"
  endTime?: string;
  note?: string;
  priority?: number;
  recurrence?: RecurrenceType;
  recurringDay?: number; // 0 = Ahad, 1 = Senin, 2 = Selasa, 3 = Rabu, 4 = Kamis, 5 = Jumat, 6 = Sabtu
  recurringWeek?: number; // 0 = Setiap pekan, 1 = Pekan ke-1, 2 = Pekan ke-2, dst.
  isActive?: boolean;
  audience?: KajianAudience; // 'all' = Ikhwan & Akhwat, 'ikhwan' = Khusus Ikhwan, 'akhwat' = Khusus Akhwat
  isPublic?: boolean;        // true = Terbuka Untuk Umum, false = Khusus Internal / Jamaah Masjid
}


