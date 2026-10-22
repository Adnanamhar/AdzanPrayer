'use client';

import { useState } from 'react';
import { useAdminStore } from '@/stores/adminStore';

export default function TeksPage() {
  const { data, updateData, isLoading } = useAdminStore();
  const [speed, setSpeed] = useState<number>(30);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  if (isLoading) return <div>Memuat data...</div>;

  // Format teks untuk preview agar jarak antar pesan lapang
  const rawText = data.runningText || '';
  const spacedPreview = rawText
    .replace(/\s*(✦|•|\|)\s*/g, ' \u00A0\u00A0\u00A0\u00A0 $1 \u00A0\u00A0\u00A0\u00A0 ')
    .trim();
  const displayPreview = spacedPreview 
    ? `${spacedPreview} \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0✦\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0` 
    : 'Teks berjalan masih kosong. Silakan ketik di bawah ini.';

  const insertSeparator = (symbol: string) => {
    const spaceSymbol = `   ${symbol}   `;
    updateData({ runningText: (data.runningText || '').trimEnd() + spaceSymbol });
  };

  const autoFormatSpacing = () => {
    const formatted = (data.runningText || '')
      .replace(/\s*(✦|•|\|)\s*/g, '   $1   ')
      .trim();
    updateData({ runningText: formatted });
  };

  return (
    <div>
      {/* CARD 1: RUNNING TEXT (MARQUEE) */}
      <div className="card">
        <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Running Text (Marquee Display)</span>
          <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>
            Tampil di bagian bawah TV
          </span>
        </div>

        {/* LIVE SIMULATOR PREVIEW BAR */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isPaused ? '#EAB308' : '#22C55E', display: 'inline-block' }}></span>
              Live Preview Marquee TV:
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Kecepatan:</span>
              <button 
                type="button"
                className="btn" 
                style={{ padding: '4px 10px', fontSize: '12px', background: speed === 45 ? '#2563EB' : '#E2E8F0', color: speed === 45 ? '#fff' : '#0F172A' }}
                onClick={() => setSpeed(45)}
              >
                Lambat
              </button>
              <button 
                type="button"
                className="btn" 
                style={{ padding: '4px 10px', fontSize: '12px', background: speed === 30 ? '#2563EB' : '#E2E8F0', color: speed === 30 ? '#fff' : '#0F172A' }}
                onClick={() => setSpeed(30)}
              >
                Normal
              </button>
              <button 
                type="button"
                className="btn" 
                style={{ padding: '4px 10px', fontSize: '12px', background: speed === 15 ? '#2563EB' : '#E2E8F0', color: speed === 15 ? '#fff' : '#0F172A' }}
                onClick={() => setSpeed(15)}
              >
                Cepat
              </button>
              <button 
                type="button"
                className="btn" 
                style={{ padding: '4px 10px', fontSize: '12px', background: '#F1F5F9', color: '#0F172A', marginLeft: '6px' }}
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? '▶ Play' : '⏸ Jeda'}
              </button>
            </div>
          </div>

          {/* Marquee Simulated Display */}
          <div style={{ 
            height: '54px', 
            background: 'linear-gradient(90deg, #1C1D37, #292a4a)', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(28,29,55,0.2)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ 
              background: '#445A79', 
              color: '#FFFFFF', 
              fontSize: '15px', 
              fontWeight: 900, 
              padding: '0 20px', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              letterSpacing: '1.5px',
              flexShrink: 0,
              boxShadow: '2px 0 8px rgba(0,0,0,0.2)'
            }}>
              INFO
            </div>
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
              <div 
                style={{ 
                  whiteSpace: 'nowrap', 
                  fontSize: '18px', 
                  fontWeight: 500, 
                  color: '#FFFFFF', 
                  position: 'absolute',
                  animationName: 'previewMarquee',
                  animationDuration: `${speed}s`,
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                  animationPlayState: isPaused ? 'paused' : 'running',
                  paddingLeft: '20px'
                }}
              >
                {displayPreview}
              </div>
            </div>
          </div>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes previewMarquee {
              0% { transform: translateX(100%); }
              100% { transform: translateX(-100%); }
            }
          `}} />
        </div>

        {/* TOOLBAR SISIPKAN PEMISAH BERJARAK */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Sisipkan Pemisah Berjarak Lega:</span>
          <button 
            type="button" 
            className="btn" 
            style={{ padding: '4px 10px', fontSize: '12px', background: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1' }}
            onClick={() => insertSeparator('✦')}
          >
            + Simbol Bintang ( ✦ )
          </button>
          <button 
            type="button" 
            className="btn" 
            style={{ padding: '4px 10px', fontSize: '12px', background: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1' }}
            onClick={() => insertSeparator('|')}
          >
            + Simbol Garis ( | )
          </button>
          <button 
            type="button" 
            className="btn" 
            style={{ padding: '4px 10px', fontSize: '12px', background: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1' }}
            onClick={() => insertSeparator('•')}
          >
            + Simbol Titik ( • )
          </button>
          <button 
            type="button" 
            className="btn" 
            style={{ padding: '4px 12px', fontSize: '12px', background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #93C5FD', fontWeight: 600 }}
            onClick={autoFormatSpacing}
          >
            ✨ Rapikan Semua Jarak Spasi
          </button>
        </div>

        {/* INPUT TEXTAREA */}
        <div className="form-group" style={{ marginBottom: 0 }}>
            <textarea 
                className="form-control" 
                rows={3}
                maxLength={600}
                value={data.runningText} 
                onChange={(e) => updateData({ runningText: e.target.value })}
                placeholder="Ketik pengumuman, himbauan sholat, atau agenda..."
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <p style={{ fontSize: '13px', color: '#64748B' }}>
                    Tip: Sistem otomatis memberikan jarak ekstra lapang antar kalimat di layar TV agar tidak dempet.
                </p>
                <span style={{ fontSize: '12px', fontWeight: 600, color: (data.runningText || '').length >= 580 ? '#DC2626' : '#94A3B8' }}>
                    {(data.runningText || '').length} / 600 karakter
                </span>
            </div>
        </div>
      </div>

      {/* CARD 2: HADITS PER WAKTU SHOLAT DENGAN ROTASI OTOMATIS */}
      <HadithManager 
        data={data} 
        updateData={updateData} 
      />
    </div>
  );
}

const DEFAULT_HADITHS = [
  {
    id: 'hadith-subuh',
    prayer: 'subuh' as const,
    arabic: 'مَنْ صَلَّى الصُّبْحَ فَهُوَ فِي ذِمَّةِ اللَّهِ',
    translate: 'Barangsiapa yang shalat Subuh berjamaah, maka ia berada dalam jaminan perlindungan Allah.',
    source: 'HR. Muslim No. 657'
  },
  {
    id: 'hadith-dzuhur',
    prayer: 'dzuhur' as const,
    arabic: 'أَحَبُّ الأَعْمَالِ إِلَى اللَّهِ الصَّلاةُ لِوَقْتِهَا',
    translate: 'Amalan yang paling dicintai oleh Allah adalah shalat tepat pada waktunya.',
    source: 'HR. Bukhari No. 527'
  },
  {
    id: 'hadith-ashar',
    prayer: 'ashar' as const,
    arabic: 'مَنْ صَلَّى الْبَرْدَيْنِ دَخَلَ الْجَنَّةَ',
    translate: 'Barangsiapa shalat pada dua waktu yang dingin (Subuh dan Ashar), maka ia akan masuk surga.',
    source: 'HR. Bukhari No. 574 & Muslim No. 635'
  },
  {
    id: 'hadith-maghrib',
    prayer: 'maghrib' as const,
    arabic: 'ظِلُّ الْمُؤْمِنِ يَوْمَ الْقِيَامَةِ صَدَقَتُهُ',
    translate: 'Naungan bagi seorang mukmin pada hari kiamat adalah amalan sedekahnya.',
    source: 'HR. Ahmad No. 17333'
  },
  {
    id: 'hadith-isya',
    prayer: 'isya' as const,
    arabic: 'مَنْ صَلَّى الْعِشَاءَ فِي جَمَاعَةٍ فَكَأَنَّمَا قَامَ نِصْفَ اللَّيْلِ',
    translate: 'Barangsiapa shalat Isya berjamaah, maka seolah-olah ia telah shalat separuh malam penuh.',
    source: 'HR. Muslim No. 656'
  }
];

const PRAYER_TABS = [
  { key: 'subuh', label: '🌅 Subuh' },
  { key: 'dzuhur', label: '☀️ Dzuhur' },
  { key: 'ashar', label: '🌤️ Ashar' },
  { key: 'maghrib', label: '🌇 Maghrib' },
  { key: 'isya', label: '🌙 Isya' },
  { key: 'umum', label: '📖 Umum' },
];

function HadithManager({ data, updateData }: { data: any; updateData: (partial: any) => void }) {
  const [selectedPrayer, setSelectedPrayer] = useState<'subuh' | 'dzuhur' | 'ashar' | 'maghrib' | 'isya' | 'umum'>('subuh');

  // Ambil list hadits atau inisialisasi dari default
  const hadithList = (data.hadithList && data.hadithList.length > 0)
    ? data.hadithList
    : DEFAULT_HADITHS;

  // Hadits yang sesuai dengan tab yang dipilih saat ini
  const activeItem = hadithList.find((h: any) => h.prayer === selectedPrayer) || {
    id: `hadith-${selectedPrayer}`,
    prayer: selectedPrayer,
    arabic: '',
    translate: '',
    source: ''
  };

  const handleUpdateActive = (field: 'arabic' | 'translate' | 'source', val: string) => {
    const exists = hadithList.some((h: any) => h.prayer === selectedPrayer);
    let updatedList;
    if (exists) {
      updatedList = hadithList.map((h: any) => {
        if (h.prayer === selectedPrayer) {
          return { ...h, [field]: val };
        }
        return h;
      });
    } else {
      updatedList = [...hadithList, { ...activeItem, [field]: val }];
    }

    // Juga update field hadith utama untuk kompatibilitas
    const partialUpdate: any = {
      hadithList: updatedList
    };
    if (field === 'arabic') partialUpdate.hadithArabic = val;
    if (field === 'translate') partialUpdate.hadithTranslate = val;
    if (field === 'source') partialUpdate.hadithSource = val;

    updateData(partialUpdate);
  };

  const handleResetToDefaults = () => {
    if (confirm('Kembalikan kumpulan hadits ke daftar bawaan shahih lengkap untuk seluruh 5 waktu shalat?')) {
      updateData({
        hadithList: DEFAULT_HADITHS,
        hadithArabic: DEFAULT_HADITHS[0].arabic,
        hadithTranslate: DEFAULT_HADITHS[0].translate,
        hadithSource: DEFAULT_HADITHS[0].source
      });
    }
  };

  return (
    <div className="card">
      <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <span>Koleksi Hadits per Waktu Shalat</span>
          <p style={{ fontSize: '13px', fontWeight: 500, color: '#64748B', marginTop: '4px' }}>
            Hadits akan otomatis berganti mengikuti jadwal waktu shalat berikutnya di TV, atau berotasi berkala.
          </p>
        </div>
        <button 
          type="button" 
          className="btn" 
          style={{ padding: '6px 14px', fontSize: '12px', background: '#F1F5F9', color: '#1E293B', border: '1px solid #CBD5E1' }}
          onClick={handleResetToDefaults}
        >
          🔄 Muat Ulang Hadits Sahih
        </button>
      </div>

      {/* TABS SELECTOR WAKTU SHALAT */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px', borderBottom: '1.5px solid #E2E8F0', paddingBottom: '12px' }}>
        {PRAYER_TABS.map(tab => {
          const isActive = selectedPrayer === tab.key;
          const hasContent = hadithList.some((h: any) => h.prayer === tab.key && h.translate);
          return (
            <button
              key={tab.key}
              type="button"
              className="btn"
              style={{
                padding: '8px 18px',
                fontSize: '13px',
                fontWeight: 700,
                borderRadius: '9999px',
                background: isActive ? '#1C1D37' : '#F8FAFC',
                color: isActive ? '#FFFFFF' : '#475569',
                border: isActive ? '1.5px solid #1C1D37' : '1px solid #CBD5E1',
                boxShadow: isActive ? '0 4px 12px rgba(28,29,55,0.2)' : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onClick={() => setSelectedPrayer(tab.key as any)}
            >
              {tab.label}
              {hasContent && (
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isActive ? '#34D399' : '#10B981', display: 'inline-block' }}></span>
              )}
            </button>
          );
        })}
      </div>

      {/* LIVE PREVIEW BOX HADITS DI TV */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <span>Live Preview Hadits di TV ({selectedPrayer.toUpperCase()}):</span>
          <span style={{ fontSize: '12px', color: '#64748B' }}>Aktif otomatis saat menuju waktu {selectedPrayer}</span>
        </div>
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 16px rgba(28,29,55,0.08)',
          border: '1px solid rgba(28,29,55,0.08)',
          borderTop: '5px solid #1C1D37',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: '2px solid #D6E0EA'
          }}>
            <span style={{
              fontSize: '13px',
              fontWeight: 800,
              color: '#445A79',
              textTransform: 'uppercase',
              letterSpacing: '2px'
            }}>
              📖 HADITS WAKTU {selectedPrayer.toUpperCase()}
            </span>
            <span style={{ fontSize: '12px', color: '#84A2C9', fontWeight: 700, background: '#D6E0EA', padding: '2px 10px', borderRadius: '10px' }}>
              TV Preview
            </span>
          </div>

          {activeItem.arabic && (
            <div style={{
              fontFamily: 'Amiri, "Times New Roman", serif',
              fontSize: '24px',
              textAlign: 'right',
              direction: 'rtl',
              lineHeight: 1.6,
              color: '#1C1D37',
              marginBottom: '12px'
            }}>
              {activeItem.arabic}
            </div>
          )}

          <div style={{
            fontSize: '15px',
            fontWeight: 500,
            color: '#1C1D37',
            fontStyle: 'italic',
            lineHeight: 1.5,
            marginBottom: '10px'
          }}>
            &ldquo;{activeItem.translate || 'Ketik terjemahan hadits untuk waktu ini...'}&rdquo;
          </div>

          {activeItem.source && (
            <div style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#445A79',
              textAlign: 'right',
              borderTop: '1px dashed #D6E0EA',
              paddingTop: '6px'
            }}>
              — {activeItem.source}
            </div>
          )}
        </div>
      </div>

      {/* INPUT FORM PER WAKTU SHALAT */}
      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Teks Bahasa Arab ({selectedPrayer.toUpperCase()})</span>
          <span style={{ fontSize: '12px', color: '#64748B' }}>Opsional</span>
        </label>
        <textarea 
          className="form-control" 
          rows={2}
          dir="rtl"
          maxLength={300}
          style={{ fontSize: '22px', fontFamily: 'Amiri, "Times New Roman", serif', lineHeight: 1.6 }}
          value={activeItem.arabic} 
          onChange={(e) => handleUpdateActive('arabic', e.target.value)}
          placeholder="Ketik lafadz hadits dalam bahasa Arab..."
        />
        <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 600, color: (activeItem.arabic || '').length >= 280 ? '#DC2626' : '#94A3B8', marginTop: '4px' }}>
          {(activeItem.arabic || '').length} / 300
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Terjemahan Bahasa Indonesia</label>
        <textarea 
          className="form-control" 
          rows={3}
          maxLength={300}
          value={activeItem.translate} 
          onChange={(e) => handleUpdateActive('translate', e.target.value)}
          placeholder="Ketik terjemahan hadits dalam bahasa Indonesia..."
        />
        <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 600, color: (activeItem.translate || '').length >= 280 ? '#DC2626' : '#94A3B8', marginTop: '4px' }}>
          {(activeItem.translate || '').length} / 300
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Sumber Riwayat / Sanad</label>
        <input 
          type="text" 
          className="form-control" 
          maxLength={100}
          value={activeItem.source} 
          onChange={(e) => handleUpdateActive('source', e.target.value)}
          placeholder="Misal: HR. Bukhari No. 527 atau HR. Muslim No. 657"
        />
        <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 600, color: (activeItem.source || '').length >= 90 ? '#DC2626' : '#94A3B8', marginTop: '4px' }}>
          {(activeItem.source || '').length} / 100
        </div>
      </div>
    </div>
  );
}
