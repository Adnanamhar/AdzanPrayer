# 🕌 Display TV Adzan & Signage Masjid

Aplikasi **Digital Signage TV Masjid Modern** berbasis web yang dirancang khusus untuk layar TV masjid, musholla, dan majelis taklim. Menampilkan jadwal sholat akurat tersinkronisasi, hitung mundur adzan & iqamah, poster kajian rutin, laporan kas masjid, running text, hadits pilihan, serta dashboard admin lengkap dengan kontrol interaktif.

---

## 🌟 Fitur Utama

### 1. 📺 Layar Display TV (`/display`)
- **Responsive Display Engine**: Menggunakan rasio skala otomatis (*auto-scaling*) sehingga tampilan presisi dan proporsional di segala ukuran layar (Full HD 1080p, 4K, 720p, maupun layar TV landscape).
- **Header & Kalender Ganda**: Menampilkan identitas masjid, jam digital realtime (disertai detik), tanggal Masehi, dan tanggal Hijriyah yang dilengkapi fitur koreksi hari (*hijri offset*).
- **Jadwal Waktu Shalat Presisi**:
  - Menghitung waktu shalat (Imsak, Shubuh, Syuruq, Dzuhur, Ashar, Maghrib, Isya) menggunakan standar astronomi **Adhan.js** yang disinkronisasi dengan **API Kemenag RI / Bimas Islam**.
  - Dilengkapi koreksi menit manual (*offsets*) per waktu sholat untuk penyesuaian lokal.
  - Kartu waktu aktif (*highlight*) otomatis menandai waktu sholat yang sedang berlangsung atau yang akan datang.
- **Slide Show Informasi Multifungsi**:
  - **Poster Flyer Kajian**: Desain flyer elegan dengan ornamen islami keemasan, penataan narasumber/pemateri full-lebar, 3 kolom jadwal (Hari/Tanggal, Waktu, Lokasi), badge sasaran peserta (`👥 Ikhwan & Akhwat`, `🧔 Khusus Ikhwan`, `🧕 Khusus Akhwat`), badge akses (`✨ Terbuka Untuk Umum` / `🔒 Khusus Jamaah Masjid`), dan catatan persiapan jamaah.
  - **Laporan Kas & Keuangan**: Transparansi keuangan kas masjid (pemasukan, pengeluaran, saldo akhir) dengan format mata uang Rupiah otomatis.
  - **Slide Media / Gambar**: Menampilkan poster pengumuman atau dokumentasi kegiatan masjid dalam format gambar yang diunggah takmir.
- **Hadits & Mutiara Hikmah**: Rotasi otomatis hadits tematik lengkap dengan tulisan Arab, terjemahan bahasa Indonesia, dan perawi/sumber riwayat hadits.
- **Running Text (Teks Berjalan)**: Pengumuman penting, himbauan ketertiban jamaah, dan pesan dakwah dengan kecepatan teks yang dapat diatur.
- **Sistem Fase Waktu Shalat (State Machine Overlays)**:
  - **Pre-Adzan Warning**: Peringatan hitung mundur beberapa menit menjelang masuknya waktu adzan disertai nada notifikasi lembut.
  - **Layar Masuk Waktu Adzan**: Tampilan fullscreen adzan berkumandang dengan audio adzan/beep.
  - **Hitung Mundur Iqamah (Iqamah Countdown)**: Timer countdown visual besar dengan progress bar dan durasi jeda yang dapat dikustomisasi per waktu shalat.
  - **Mode Shalat (Layar Gelap / Standby)**: Layar meredup/gelap otomatis saat shalat berjamaah berlangsung agar tidak menyilaukan dan tidak mengganggu kekhusyukan jamaah.
  - **Mode Khutbah Jumat**: Penyesuaian khusus otomatis untuk pelaksanaan shalat Jumat.

---

### 2. ⚙️ Dashboard Admin TV Masjid (`/admin`)
- **Keamanan PIN Terproteksi**: Dashboard dilindungi autentikasi PIN admin untuk mencegah akses tidak sah.
- **Live Preview Flyer Kajian**: Pratinjau langsung slide kajian yang identik 100% dengan apa yang tampil di layar TV.
- **iOS-Style Sliding Switches**: Kontrol on/off bergaya iPhone untuk aktivasi tayangan di TV dan pengaturan akses umum.
- **Menu Pengaturan Lengkap**:
  - **Profil Masjid (`/admin/profil`)**: Nama masjid, alamat, foto latar belakang, identitas pengurus, dan kontak.
  - **Jadwal Sholat (`/admin/jadwal`)**: Pemilihan kota/kabupaten di Indonesia, metode perhitungan, koordinat GPS (latitude/longitude), dan kalibrasi menit per waktu shalat.
  - **Timer Iqamah & Adzan (`/admin/iqamah`)**: Jeda waktu iqamah masing-masing shalat (Shubuh, Dzuhur, Ashar, Maghrib, Isya), durasi mode layar shalat, dan durasi hitung mundur pre-adzan.
  - **Jadwal Kajian (`/admin/kajian`)**: CRUD lengkap jadwal kajian rutin tematik, pemateri, frekuensi berulang (mingguan/bulanan/sekali), status TV, sasaran peserta, dan catatan jamaah.
  - **Laporan Keuangan (`/admin/keuangan`)**: Pencatatan transaksi kas masuk dan keluar, total saldo, dan periode kas.
  - **Media & Slide (`/admin/media`)**: Pengaturan urutan slide, durasi tayang per slide, dan kompresi gambar otomatis.
  - **Running Text & Hadits (`/admin/teks`)**: Manajemen teks berjalan dan hadits pilihan.
  - **Tema Warna (`/admin/tema`)**: Kustomisasi skema warna (Emerald Gold, Midnight Navy, Ruby Gold, Dark Monochrome) dan penyesuaian ukuran font dinamis (*auto font-scaler*).
  - **Sistem & Reset (`/admin/sistem`)**: Export/Import data konfigurasi (backup JSON), integrasi Firebase Firestore, dan reset data ke setelan awal.

---

## 🛠️ Arsitektur & Teknologi

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) (Strict Type-Safety)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Persistent LocalStorage + Realtime Synchronization)
- **Perhitungan Astronomi Shalat**: [Adhan.js](https://github.com/batoulapps/adhan-js) + Integrasi Sinkronisasi Kemenag API
- **Kalender Hijriyah**: Algoritma konversi hisab lokal dengan offset penyesuaian hilal
- **Database / Cloud Sync (Opsional)**: [Firebase Cloud Firestore](https://firebase.google.com/)
- **Styling**: Vanilla CSS modern murni (Glassmorphism, CSS Grid, Flexbox, Keyframes Animation, HSL-tailored palette) tanpa dependensi CSS berat luar

---

## 📁 Struktur Direktori

```plaintext
AdzanPrayer/
├── public/
│   └── assets/
│       ├── fonts/                # Web fonts
│       ├── icons/                # Ikon aplikasi & PWA
│       └── img/                  # Gambar latar, placeholder QRIS, slide default
├── src/
│   ├── app/
│   │   ├── admin/                # Halaman & Komponen Dashboard Admin
│   │   │   ├── components/       # AdminAuthGuard, AdminHeader, AdminSidebar, SaveButton, dll.
│   │   │   ├── iqamah/           # Pengaturan timer iqamah & adzan
│   │   │   ├── jadwal/           # Pengaturan jadwal sholat & kota
│   │   │   ├── kajian/           # Pengaturan jadwal kajian & live preview
│   │   │   ├── keuangan/         # Pencatatan kas & laporan keuangan
│   │   │   ├── media/            # Manajemen media slide
│   │   │   ├── profil/           # Profil & identitas masjid
│   │   │   ├── sistem/           # Backup/restore & konfigurasi cloud
│   │   │   ├── teks/             # Running text & hadits
│   │   │   ├── tema/             # Skema warna tampilan
│   │   │   └── admin.css         # Styling khusus dashboard admin
│   │   ├── api/
│   │   │   └── mosquedata/       # Endpoint API lokal data masjid
│   │   ├── display/              # Halaman Tampilan Signage TV Masjid
│   │   │   ├── components/       # HeaderBar, ClockCard, PrayerBar, Slideshow, Overlay, dll.
│   │   │   └── display.css       # Styling display signage TV & animasi flyer
│   │   ├── globals.css           # Styling global aplikasi
│   │   └── layout.tsx            # Root layout Next.js
│   ├── hooks/                    # Custom React hooks (useClock, usePrayerTimes, useHijriDate, dll.)
│   ├── lib/                      # Utilitas (prayer-calculator, hijri-converter, font-scaler, sound, dll.)
│   ├── stores/                   # Global state store (adminStore.ts)
│   └── types/                    # Definisi tipe data TypeScript (mosque, prayer, kajian, keuangan)
├── mosqueData.json               # Data konfigurasi default & cadangan masjid
├── next.config.ts                # Konfigurasi Next.js & routing redirects
├── package.json                  # Dependensi proyek & script runner
└── tsconfig.json                 # Konfigurasi TypeScript compiler
```

---

## 🚀 Panduan Instalasi & Menjalankan Proyek

### 1. Prasyarat Sistem
Pastikan perangkat Anda telah terinstal:
- **Node.js** versi `v18.x` atau lebih baru (direkomendasikan versi LTS `v20.x` / `v22.x`)
- **npm** (bawaan Node.js) atau **pnpm** / **yarn**
- Web browser modern (Google Chrome, Microsoft Edge, Chromium, atau Smart TV browser)

### 2. Kloning & Instalasi Dependensi
```bash
# 1. Buka terminal dan masuk ke direktori proyek
cd /Users/macbookpro/Documents/AdzanPrayer

# 2. Pasang semua dependensi
npm install
```

### 3. Konfigurasi Lingkungan (Opsional)
Jika Anda menggunakan sinkronisasi Cloud Firestore, buat atau periksa file `.env.local` pada root proyek:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```
*(Catatan: Aplikasi tetap berfungsi penuh secara lokal secara offline tanpa Firebase menggunakan LocalStorage bawaan browser).*

### 4. Menjalankan di Mode Pengembangan (Development)
```bash
npm run dev
```
Aplikasi akan aktif di:
- **Layar TV Display**: [http://localhost:3000/display](http://localhost:3000/display)
- **Dashboard Admin**: [http://localhost:3000/admin](http://localhost:3000/admin) *(PIN bawaan: `1234`)*

### 5. Membangun Bundle Produksi (Production Build)
Untuk performa maksimal dan stabilitas penayangan 24/7 di TV masjid:
```bash
# Kompilasi aplikasi untuk produksi
npm run build

# Menjalankan server produksi
npm run start
```

---

## 🖥️ Panduan Penggunaan di Layar TV Masjid

1. **Pengaturan TV / Mini PC / Android TV / Raspberry Pi**:
   - Hubungkan Mini PC / Android TV Box / STB ke layar TV menggunakan kabel HDMI.
   - Buka browser (disarankan Google Chrome berbasis Chromium) dan akses URL penayangan:
     ```plaintext
     http://<IP-KOMPUTER-SERVER>:3000/display
     ```
   - Tekan tombol **F11** pada keyboard (atau aktifkan opsi *Kiosk Mode / Fullscreen*) agar browser memenuhi seluruh layar tanpa menampilkan address bar atau tab.

2. **Koneksi Audio Speaker Masjid**:
   - Hubungkan output audio mini PC ke amplifier atau speaker masjid untuk memperdengarkan nada peringatan pre-adzan, kumandang adzan, dan peringatan iqamah.

3. **Cara Mengelola Konten via HP / Laptop DKM**:
   - Sambungkan HP atau laptop Takmir/DKM ke jaringan Wi-Fi yang sama dengan TV.
   - Buka browser di HP/laptop dan akses alamat:
     ```plaintext
     http://<IP-KOMPUTER-SERVER>:3000/admin
     ```
   - Masukkan PIN admin (default: `1234`).
   - Lakukan perubahan jadwal kajian, laporan keuangan, pengumuman running text, atau ubah waktu sholat.
   - Klik tombol **Simpan Perubahan** di pojok kanan bawah; tampilan di layar TV akan langsung tersinkronisasi secara otomatis!

---

## 💡 Tips & Panduan Pemeliharaan

- **Pencadangan Data**: Lakukan ekspor cadangan data konfigurasi secara berkala melalui menu **Sistem & Reset (`/admin/sistem`)** $\rightarrow$ **Download Backup JSON**.
- **Koreksi Waktu Shalat**: Jika terdapat selisih menit antara jam astronomi dengan jadwal ketetapan Kemenag daerah setempat, sesuaikan offset pada menu **Jadwal Sholat (`/admin/jadwal`)**.
- **Koreksi Kalender Hijriyah**: Jika terjadi perbedaan penetapan awal bulan hijriyah (misal: 1 Ramadhan / 1 Syawal), sesuaikan kolom *Koreksi Hijriyah (+/- Hari)* pada menu **Profil Masjid**.

---

## 📄 Lisensi
Hak Cipta © 2026 Pengembang Aplikasi Adzan Prayer TV Signage Masjid. Dikembangkan untuk kemaslahatan masjid dan kaum muslimin.
