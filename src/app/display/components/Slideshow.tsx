'use client';

import { useState, useEffect } from 'react';
import { useMosqueData } from '@/hooks/useMosqueData';
import type { KajianItem } from '@/types/kajian';
import { fontPresets } from '@/lib/font-scaler';

const daysOfWeek = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function formatRupiah(angka: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}

export function Slideshow({ onSlideChange }: { onSlideChange: (isCustom: boolean) => void }) {
  const { mosqueData: d } = useMosqueData();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);

  useEffect(() => {
    // 1. KAJIAN SLIDES (FILTER AKTIF & BELUM TERLEWAT)
    const kajianSlidesArr: any[] = [];
    if (d.showKajianSlide !== false && d.kajianList && d.kajianList.length > 0) {
      const now = new Date();
      const validKajians: { item: KajianItem; dateLabel: string }[] = [];

      d.kajianList.forEach(k => {
        if (k.isActive === false) return;

        const rec = k.recurrence || 'none';

        if (rec === 'daily') {
          validKajians.push({ item: k, dateLabel: 'Setiap Hari (Rutin)' });
        } else if (rec === 'weekly') {
          const dayName = daysOfWeek[k.recurringDay ?? 0];
          validKajians.push({ item: k, dateLabel: `Setiap Hari ${dayName}` });
        } else if (rec === 'monthly') {
          const dayName = daysOfWeek[k.recurringDay ?? 0];
          const wLabel = k.recurringWeek ? `Pekan ke-${k.recurringWeek}` : 'Setiap Pekan';
          validKajians.push({ item: k, dateLabel: `Bulanan (${wLabel} ${dayName})` });
        } else {
          // Event Sekali Saja: Auto-hide jika tanggal sudah terlewat
          if (!k.date) return;
          const parts = k.date.split('-');
          if (parts.length === 3) {
            const kDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 23, 59, 59);
            if (kDate.getTime() < now.getTime()) {
              return; // Otomatis disembunyikan dari TV jika sudah terlewat
            }

            const dObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            const dateStr = dObj.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            validKajians.push({ item: k, dateLabel: dateStr });
          }
        }
      });

      validKajians.sort((a, b) => (a.item.priority || 99) - (b.item.priority || 99));

      validKajians.forEach(({ item: topKajian, dateLabel }, i) => {
        const titleFontSize = fontPresets.kajianTitle(topKajian.title);
        const speakerFontSize = fontPresets.kajianSpeaker(topKajian.ustadz);
        const dateFontSize = fontPresets.kajianInfoVal(dateLabel);
        const timeFontSize = fontPresets.kajianInfoVal(topKajian.startTime || '');
        const noteFontSize = fontPresets.kajianInfoVal(topKajian.note || '');

        const audienceMap: Record<string, { label: string; icon: string }> = {
          ikhwan: { label: 'Khusus Ikhwan', icon: '🧔' },
          akhwat: { label: 'Khusus Akhwat', icon: '🧕' },
          all: { label: 'Ikhwan & Akhwat', icon: '👥' }
        };
        const aud = audienceMap[topKajian.audience || 'all'] || { label: 'Ikhwan & Akhwat', icon: '👥' };
        const isPublic = topKajian.isPublic !== false;
        const publicLabel = isPublic ? '✨ Terbuka Untuk Umum' : '🔒 Khusus Jamaah Masjid';

        kajianSlidesArr.push({
          type: 'kajian',
          id: `kajian-${topKajian.id || i}`,
          content: (
            <div className="slide-custom slide-kajian-poster">
              {/* HEADER */}
              <div className="kaj-poster-header">
                <div className="kaj-gold-badge">
                  <span>🕌</span> KAJIAN RUTIN MASJID
                </div>
                <div className="kaj-poster-tagline">
                  <span>✦</span> {d.mosqueName || 'Majelis Taklim'}
                </div>
              </div>

              {/* 1. TEMA & JUDUL KAJIAN (FULL WIDTH) */}
              <div className="kaj-title-block">
                <div className="kaj-hero-badge">
                  <span>✦</span> TEMA / JUDUL KAJIAN
                </div>
                <div 
                  className="kaj-hero-title"
                  style={{
                    fontSize: `${titleFontSize}px`,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {topKajian.title}
                </div>
                <div className="kaj-hero-pills">
                  <span className="kaj-pill-item">{aud.icon} {aud.label}</span>
                  <span className={`kaj-pill-item ${isPublic ? 'gold' : 'internal'}`}>{publicLabel}</span>
                </div>
              </div>

              {/* 2. NARASUMBER / PEMATERI (FULL WIDTH STRIP DI BAWAH JUDUL) */}
              <div className="kaj-speaker-row-full">
                <div className="kaj-speaker-left">
                  <div className="kaj-speaker-avatar">
                    <span>🎙️</span>
                  </div>
                  <div className="kaj-speaker-info">
                    <span className="kaj-speaker-label">NARASUMBER / PEMATERI</span>
                    <span className="kaj-speaker-name" style={{ fontSize: `${speakerFontSize}px` }}>
                      {topKajian.ustadz}
                    </span>
                  </div>
                </div>
                <div className="kaj-speaker-role-pill">
                  Pengisi Majelis Taklim
                </div>
              </div>

              {/* 3. SCHEDULE CARDS: 3 EQUAL COLUMNS (HARI, WAKTU, LOKASI) */}
              <div className="kaj-schedule-grid">
                <div className="kaj-grid-card">
                  <div className="kaj-card-icon-wrap">
                    <span>📅</span>
                  </div>
                  <div className="kaj-card-body">
                    <span className="kaj-card-label">HARI / TANGGAL</span>
                    <span className="kaj-card-value" style={{ fontSize: `${dateFontSize}px` }}>{dateLabel}</span>
                  </div>
                </div>

                <div className="kaj-grid-card">
                  <div className="kaj-card-icon-wrap">
                    <span>⏰</span>
                  </div>
                  <div className="kaj-card-body">
                    <span className="kaj-card-label">WAKTU PELAKSANAAN</span>
                    <span className="kaj-card-value" style={{ fontSize: `${timeFontSize}px` }}>
                      {topKajian.startTime || '-'} {topKajian.endTime ? `- ${topKajian.endTime}` : '- Selesai'}
                    </span>
                  </div>
                </div>

                <div className="kaj-grid-card">
                  <div className="kaj-card-icon-wrap">
                    <span>📍</span>
                  </div>
                  <div className="kaj-card-body">
                    <span className="kaj-card-label">LOKASI / TEMPAT</span>
                    <span className="kaj-card-value" style={{ fontSize: `${noteFontSize}px` }}>
                      {d.mosqueName || 'Ruang Utama Masjid'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. NOTES / PERSIAPAN JAMAAH BANNER (HANYA TEKS YANG DIINPUTKAN) */}
              <div className="kaj-notes-banner">
                <div className="kaj-notes-icon-wrap">
                  <span>📝</span>
                </div>
                <div className="kaj-notes-body">
                  <span className="kaj-notes-label">CATATAN &amp; PERSIAPAN JAMAAH</span>
                  <span className="kaj-notes-text">
                    {topKajian.note || 'Silakan hadir tepat waktu mengajak keluarga & kerabat untuk menuntut ilmu bersama.'}
                  </span>
                </div>
              </div>

              {/* 5. FOOTER (QUOTE HADITS BERSIH TANPA DUPLIKASI BADGE) */}
              <div className="kaj-poster-footer">
                <span className="kaj-footer-quote">
                  &ldquo;Barangsiapa menempuh jalan untuk menuntut ilmu, Allah mudahkan baginya jalan ke surga.&rdquo; (HR. Muslim)
                </span>
              </div>
            </div>
          )
        });
      });
    }

    // 2. KEUANGAN SLIDE
    const keuanganSlidesArr: any[] = [];
    const allowKeuangan = d.showKeuanganSlide !== false;
    const hasPemasukan = d.keuangan && d.keuangan.pemasukan && d.keuangan.pemasukan.length > 0;
    const hasPengeluaran = d.keuangan && d.keuangan.pengeluaran && d.keuangan.pengeluaran.length > 0;
    if (allowKeuangan && (hasPemasukan || hasPengeluaran)) {
      let totalIn = 0, totalOut = 0;
      (d.keuangan.pemasukan || []).forEach(i => totalIn += Number(i.amount) || 0);
      (d.keuangan.pengeluaran || []).forEach(i => totalOut += Number(i.amount) || 0);

      keuanganSlidesArr.push({
        type: 'keuangan',
        id: 'keuangan',
        content: (
          <div className="slide-custom slide-keuangan-card">
            <div className="keu-header">
              <div className="keu-title">Laporan Keuangan Kas Masjid</div>
              <div className="keu-period-badge">
                <span>📅</span> Periode: {d.keuangan.periode || 'Bulan Ini'}
              </div>
            </div>

            <div className="keu-body-grid">
              <div className="keu-column">
                <div className="keu-col-header">
                  <span className="keu-col-title in">Pemasukan</span>
                  <span className="keu-col-total in">{formatRupiah(totalIn)}</span>
                </div>
                <div className="keu-list">
                  {(d.keuangan.pemasukan || []).slice(0, 5).map((i, idx) => {
                    const descFontSize = fontPresets.keuanganItemTitle(i.desc);
                    return (
                      <div className="keu-row" key={`in-${idx}`}>
                        <span className="keu-row-desc" style={{ fontSize: `${descFontSize}px` }}>{i.desc}</span>
                        <span className="keu-row-val">{formatRupiah(i.amount)}</span>
                      </div>
                    );
                  })}
                  {(d.keuangan.pemasukan || []).length > 5 && (
                    <div style={{ fontSize: '12px', color: '#059669', textAlign: 'center', marginTop: '2px' }}>
                      + {(d.keuangan.pemasukan || []).length - 5} transaksi lainnya
                    </div>
                  )}
                </div>
              </div>

              <div className="keu-column">
                <div className="keu-col-header">
                  <span className="keu-col-title out">Pengeluaran</span>
                  <span className="keu-col-total out">{formatRupiah(totalOut)}</span>
                </div>
                <div className="keu-list">
                  {(d.keuangan.pengeluaran || []).slice(0, 5).map((i, idx) => {
                    const descFontSize = fontPresets.keuanganItemTitle(i.desc);
                    return (
                      <div className="keu-row" key={`out-${idx}`}>
                        <span className="keu-row-desc" style={{ fontSize: `${descFontSize}px` }}>{i.desc}</span>
                        <span className="keu-row-val">{formatRupiah(i.amount)}</span>
                      </div>
                    );
                  })}
                  {(d.keuangan.pengeluaran || []).length > 5 && (
                    <div style={{ fontSize: '12px', color: '#DC2626', textAlign: 'center', marginTop: '2px' }}>
                      + {(d.keuangan.pengeluaran || []).length - 5} transaksi lainnya
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="keu-footer-banner">
              <span className="keu-footer-label">
                <span>💰</span> Saldo Akhir Kas Masjid
              </span>
              <span className="keu-footer-val">{formatRupiah(totalIn - totalOut)}</span>
            </div>
          </div>
        )
      });
    }

    // 3. QRIS SLIDE
    const qrisSlidesArr: any[] = [];
    const allowQris = d.showQrisSlide !== false;
    if (allowQris && d.qris && d.qris.image && d.qris.image.trim() !== "") {
      const qrisAccountFontSize = fontPresets.qrisAccountName(d.qris.accountName || d.mosqueName || '');

      qrisSlidesArr.push({
        type: 'qris',
        id: 'qris',
        content: (
          <div className="slide-custom slide-qris-card">
            <div className="qris-left-wrap">
              <div className="qris-box-frame">
                <img src={d.qris.image} alt="QRIS Masjid" />
              </div>
              <div className="qris-scan-hint">
                <span>📱</span> Pindai dengan m-Banking / E-Wallet
              </div>
            </div>

            <div className="qris-right-wrap">
              <div className="qris-heading-box">
                <div className="qris-top-badge">
                  <span>🕌</span> Infaq &amp; Shadaqah Digital
                </div>
                <div className="qris-main-title">
                  Salurkan Infaq &amp; Sedekah
                </div>
                <div className="qris-subtitle">
                  Untuk Kemakmuran {d.mosqueName || 'Masjid'}
                </div>
              </div>

              <div className="qris-bank-card">
                <div className="qris-bank-badge">REKENING RESMI MASJID</div>
                <div className="qris-bank-name">{d.qris.bankName || 'Bank Rekening Masjid'}</div>
                <div className="qris-account-no">{d.qris.accountNo || '-'}</div>
                <div className="qris-account-holder" style={{ fontSize: `${qrisAccountFontSize}px` }}>
                  a.n. {d.qris.accountName || d.mosqueName || 'DKM Masjid'}
                </div>
              </div>

              <div className="qris-steps-row">
                <div className="qris-step-item"><span className="qris-step-num">1</span> Buka m-Banking / E-Wallet</div>
                <div className="qris-step-arrow">➔</div>
                <div className="qris-step-item"><span className="qris-step-num">2</span> Pindai Kode QR</div>
                <div className="qris-step-arrow">➔</div>
                <div className="qris-step-item"><span className="qris-step-num">3</span> Konfirmasi Nominal</div>
              </div>

              <div className="qris-quote-banner">
                &ldquo;Sedekah tidaklah mengurangi harta, dan Allah tidak menambah bagi seorang hamba yang memaafkan melainkan kemuliaan.&rdquo; (HR. Muslim No. 2588)
              </div>
            </div>
          </div>
        )
      });
    }

    // 4. IMAGE SLIDES
    const formatSrc = (src: string) => {
      if (!src) return '';
      if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('/')) return src;
      return `/${src}`;
    };

    const validImages = (d.slides || []).filter((src: string) => src && src.trim() !== "");
    const imageSlidesArr = validImages.map((rawSrc, idx) => {
      const src = formatSrc(rawSrc);
      return {
        type: 'image',
        id: `img-${idx}`,
        content: (
          <>
            <div className="slide-bg" style={{ backgroundImage: `url('${src}')` }}></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              className="slide-fg" 
              src={src} 
              alt="Slide" 
              onLoad={(e) => {
                const img = e.currentTarget;
                if (img.naturalWidth >= img.naturalHeight) img.style.objectFit = 'cover';
                else img.style.objectFit = 'contain';
              }} 
            />
          </>
        )
      };
    });

    // 5. ASSEMBLE ALL ACTIVE SLIDES IN ORDER
    // Menampilkan SEMUA slide yang aktif bergantian secara menyeluruh
    const customSlidesArr = [...kajianSlidesArr, ...keuanganSlidesArr, ...qrisSlidesArr];
    let finalSlides: any[] = [];

    if (imageSlidesArr.length === 0) {
      finalSlides = customSlidesArr;
    } else if (customSlidesArr.length === 0) {
      finalSlides = imageSlidesArr;
    } else {
      // Interleave bersih: Setiap slide (gambar maupun kajian/keuangan/qris) masuk tepat 1 kali
      const maxCount = Math.max(imageSlidesArr.length, customSlidesArr.length);
      for (let i = 0; i < maxCount; i++) {
        if (i < imageSlidesArr.length) {
          finalSlides.push(imageSlidesArr[i]);
        }
        if (i < customSlidesArr.length) {
          finalSlides.push(customSlidesArr[i]);
        }
      }
    }

    // 6. FALLBACK SLIDE JIKA SEMUA SLIDE KOSONG
    if (finalSlides.length === 0) {
      finalSlides.push({
        type: 'fallback',
        id: 'fallback-welcome',
        content: (
          <div className="slide-custom" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '40px', background: 'radial-gradient(ellipse at center, #FFFFFF 0%, #F1F5F9 100%)' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>🕌</div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#1C1D37', marginBottom: '8px' }}>Selamat Datang</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#445A79' }}>{d.mosqueName}</div>
            <div style={{ fontSize: '16px', color: '#84A2C9', marginTop: '12px' }}>{d.address}</div>
          </div>
        )
      });
    }

    setSlides(finalSlides);
    // Jangan reset ke 0 secara membabi buta agar transisi slide tidak terpotong tiba-tiba
    setCurrentSlide(prev => (prev < finalSlides.length ? prev : 0));
  }, [d]);

  // Notifikasi perubahan tipe slide ke parent (DisplayEngine) secara aman di luar fase render
  useEffect(() => {
    if (slides.length > 0 && currentSlide < slides.length) {
      const isCustom = slides[currentSlide]?.type !== 'image';
      onSlideChange(isCustom);
    }
  }, [currentSlide, slides, onSlideChange]);

  // Timer rotasi slide otomatis dengan durasi yang nyaman dibaca
  useEffect(() => {
    if (slides.length <= 1) return;

    // Durasi tampil per slide (default 12 detik atau dari settings d.slideDurationSec)
    const duration = Math.max(8, d.slideDurationSec || 12) * 1000;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, duration);

    return () => clearInterval(interval);
  }, [slides.length, d.slideDurationSec]);

  return (
    <div className="slideshow" id="slideshow">
      {slides.map((s, idx) => (
        <div key={s.id} className={`slide ${idx === currentSlide ? 'active' : ''}`}>
          {s.content}
        </div>
      ))}
    </div>
  );
}
