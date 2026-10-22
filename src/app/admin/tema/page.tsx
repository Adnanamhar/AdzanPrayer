'use client';

import { useAdminStore } from '@/stores/adminStore';

export default function TemaPage() {
  const { data, updateData, isLoading } = useAdminStore();

  if (isLoading) return <div>Memuat data...</div>;

  const t = data.theme;

  const handleColorChange = (key: string, val: string) => {
    updateData({ theme: { ...t, [key]: val } as any });
  };

  const setPreset = (c1: string, c2: string, c3: string, c4: string, c5: string) => {
    updateData({ theme: { c1, c2, c3, c4, c5 } });
  };

  const presets = [
    { name: 'Night Blue (Default)', c1: '#1C1D37', c2: '#445A79', c3: '#84A2C9', c4: '#D6E0EA', c5: '#FFFFFF' },
    { name: 'Emerald Green', c1: '#064E3B', c2: '#047857', c3: '#34D399', c4: '#A7F3D0', c5: '#ECFDF5' },
    { name: 'Desert Brown', c1: '#451A03', c2: '#78350F', c3: '#D97706', c4: '#FDE68A', c5: '#FFFBEB' },
    { name: 'Dark Graphite', c1: '#0F172A', c2: '#334155', c3: '#64748B', c4: '#CBD5E1', c5: '#F8FAFC' },
    { name: 'Royal Purple', c1: '#312E81', c2: '#4F46E5', c3: '#818CF8', c4: '#C7D2FE', c5: '#EEF2FF' },
  ];

  return (
    <div>
      {/* LIVE MINI TV MOCKUP PREVIEW */}
      <div className="card" style={{ background: '#0F172A', borderColor: '#1E293B', color: '#F8FAFC' }}>
        <div className="card-title" style={{ color: '#F8FAFC', borderBottomColor: '#1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>📺 Live Mini TV Mockup (Preview Hasil Warna)</span>
          <span style={{ fontSize: '12px', background: '#334155', color: '#94A3B8', padding: '4px 10px', borderRadius: '6px' }}>
            Skala Simulasi TV 16:9
          </span>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', background: t.c4, borderRadius: '14px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: `2px solid ${t.c2}` }}>
          {/* Header Bar */}
          <div style={{
            background: `linear-gradient(135deg, ${t.c1} 0%, ${t.c2} 100%)`,
            borderRadius: '10px',
            padding: '10px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: t.c5,
            borderBottom: `3px solid ${t.c3}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>🕌</span>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 900, letterSpacing: '1px' }}>{data.mosqueName || 'Nama Masjid'}</div>
                <div style={{ fontSize: '10px', color: t.c3 }}>{data.address || 'Alamat Masjid'}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: 700 }}>Senin, 20 Oktober 2026</div>
              <div style={{ fontSize: '9px', color: t.c3, fontWeight: 600 }}>09 Rabiul Akhir 1448 H</div>
            </div>
          </div>

          {/* Body Content */}
          <div style={{ display: 'flex', gap: '10px', height: '140px' }}>
            {/* Clock Mini Card */}
            <div style={{
              width: '240px',
              background: `linear-gradient(160deg, ${t.c1} 0%, #252646 100%)`,
              borderRadius: '10px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
              border: `1px solid ${t.c2}`
            }}>
              <div style={{ fontSize: '32px', fontWeight: 900, color: t.c5, letterSpacing: '2px', lineHeight: 1 }}>
                12:45<span style={{ fontSize: '18px', color: t.c3, marginLeft: '2px' }}>:30</span>
              </div>
              <div style={{ fontSize: '9px', fontWeight: 800, color: t.c3, letterSpacing: '1.5px', marginTop: '6px' }}>
                WAKTU INDONESIA {data.timezone === 'WITA' ? 'TENGAH' : data.timezone === 'WIT' ? 'TIMUR' : 'BARAT'}
              </div>
            </div>

            {/* Slide Area Simulation */}
            <div style={{
              flex: 1,
              background: '#FFFFFF',
              borderRadius: '10px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: `1px solid ${t.c4}`,
              position: 'relative'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: t.c2, marginBottom: '4px' }}>INFO KAJIAN RUTIN</div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: t.c1, textAlign: 'center' }}>Kajian Kitab Riyadhus Shalihin</div>
              <div style={{ fontSize: '11px', color: t.c3, marginTop: '4px' }}>🎙️ Ustadz Dr. Abdullah</div>
            </div>
          </div>

          {/* Prayer Bar Mini */}
          <div style={{
            display: 'flex',
            background: t.c5,
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            border: `1px solid ${t.c4}`,
            borderBottom: `3px solid ${t.c1}`
          }}>
            {['Shubuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'].map((sholat, idx) => {
              const isActive = sholat === 'Dzuhur';
              return (
                <div key={sholat} style={{
                  flex: 1,
                  padding: '8px 4px',
                  textAlign: 'center',
                  borderRight: idx < 4 ? `1px solid ${t.c4}` : 'none',
                  background: isActive ? `linear-gradient(180deg, ${t.c2}22 0%, ${t.c3}11 100%)` : 'transparent',
                  borderTop: isActive ? `3px solid ${t.c2}` : '3px solid transparent'
                }}>
                  <div style={{ fontSize: '9px', fontWeight: 800, color: isActive ? t.c2 : t.c3, textTransform: 'uppercase' }}>{sholat}</div>
                  <div style={{ fontSize: '14px', fontWeight: 900, color: t.c1 }}>{['04:15', '11:45', '15:02', '17:48', '19:01'][idx]}</div>
                </div>
              );
            })}
          </div>

          {/* Running Text Mini Bar */}
          <div style={{
            height: '28px',
            background: `linear-gradient(90deg, ${t.c1}, ${t.c2})`,
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            overflow: 'hidden',
            padding: '0 8px'
          }}>
            <span style={{ background: t.c2, color: t.c5, fontSize: '9px', fontWeight: 900, padding: '2px 6px', borderRadius: '4px', marginRight: '8px' }}>INFO</span>
            <span style={{ fontSize: '10px', color: t.c5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {data.runningText || 'Lurus dan rapatkan shaf demi keutamaan sholat berjamaah...'}
            </span>
          </div>
        </div>
      </div>

      {/* PRESETS */}
      <div className="card">
        <div className="card-title">Pilih Preset Tema (1x Klik)</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {presets.map((p, idx) => (
                <button 
                    key={idx} 
                    style={{ 
                        background: '#fff', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '16px', 
                        cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s',
                        boxShadow: (t.c1 === p.c1 && t.c2 === p.c2) ? '0 0 0 3px #2563EB' : '0 2px 4px rgba(0,0,0,0.02)' 
                    }}
                    onClick={() => setPreset(p.c1, p.c2, p.c3, p.c4, p.c5)}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                    <div style={{ fontWeight: 600, fontSize: '15px', color: '#1E293B', marginBottom: '12px' }}>{p.name}</div>
                    <div style={{ display: 'flex', height: '24px', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{ flex: 1, background: p.c1 }}></div>
                        <div style={{ flex: 1, background: p.c2 }}></div>
                        <div style={{ flex: 1, background: p.c3 }}></div>
                        <div style={{ flex: 1, background: p.c4 }}></div>
                        <div style={{ flex: 1, background: p.c5, borderLeft: '1px solid #e2e8f0' }}></div>
                    </div>
                </button>
            ))}
        </div>
      </div>

      {/* MANUAL COLOR PICKERS */}
      <div className="card">
        <div className="card-title">Kustomisasi Manual Tampilan TV</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
            {[
                { k: 'c1', l: 'Paling Gelap (Header & Jam)' },
                { k: 'c2', l: 'Aksen Gelap (Border & Badge)' },
                { k: 'c3', l: 'Aksen Tengah (Label & Glow)' },
                { k: 'c4', l: 'Latar Belakang Layar' },
                { k: 'c5', l: 'Paling Terang (Kartu & Angka)' }
            ].map(c => (
                <div key={c.k} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>{c.l}</label>
                    <div style={{ position: 'relative', width: '100%', height: '60px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #E2E8F0', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}>
                        <input 
                            type="color" 
                            style={{ position: 'absolute', top: '-10px', left: '-10px', width: '150%', height: '150%', cursor: 'pointer', border: 'none', padding: 0 }}
                            value={t[c.k as keyof typeof t]} 
                            onChange={(e) => handleColorChange(c.k, e.target.value)}
                        />
                    </div>
                    <div style={{ fontSize: '14px', textAlign: 'center', fontFamily: 'monospace', fontWeight: 700, color: '#1E293B' }}>{t[c.k as keyof typeof t].toUpperCase()}</div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
