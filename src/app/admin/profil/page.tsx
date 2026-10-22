'use client';

import { useState } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { compressImage } from '@/lib/image-compressor';

export default function ProfilPage() {
  const { data, updateData, isLoading } = useAdminStore();
  const [uploadingLogo, setUploadingLogo] = useState(false);

  if (isLoading) return <div>Memuat data...</div>;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      // Kompres logo ke 512x512 PNG/JPEG agar ringan (< 100KB)
      const compressed = await compressImage(file, 512, 512, 0.9);
      updateData({ logo: compressed });
    } catch (err) {
      alert('Gagal memproses file logo.');
    } finally {
      setUploadingLogo(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      {/* CARD 1: LIVE TV HEADER PREVIEW */}
      <div className="card" style={{ background: '#0F172A', borderColor: '#1E293B', color: '#fff' }}>
        <div className="card-title" style={{ color: '#F8FAFC', borderBottomColor: '#1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>📺 Live Preview Header Bar TV</span>
          <span style={{ fontSize: '12px', background: '#334155', color: '#94A3B8', padding: '4px 10px', borderRadius: '6px' }}>
            Bagian Atas Layar Display
          </span>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #1C1D37 0%, #292a4a 50%, #445A79 100%)',
          borderRadius: '16px',
          padding: '20px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#FFFFFF',
          borderBottom: '4px solid #84A2C9',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: 0, flex: 1, marginRight: '20px' }}>
            {data.logo ? (
              <img 
                src={data.logo} 
                alt="Logo" 
                style={{ width: '56px', height: '56px', borderRadius: '12px', objectFit: 'contain', background: 'rgba(255,255,255,0.1)', padding: '4px', flexShrink: 0 }} 
              />
            ) : (
              <div style={{ fontSize: '40px', lineHeight: 1, flexShrink: 0 }}>🕌</div>
            )}
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {data.mosqueName || 'Nama Masjid Anda'}
              </div>
              <div style={{ fontSize: '13px', color: '#84A2C9', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {data.address || 'Alamat Lengkap Masjid'}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>Senin, 20 Oktober 2026</div>
            <div style={{ fontSize: '13px', color: '#84A2C9', fontWeight: 600, marginTop: '2px' }}>09 Rabiul Akhir 1448 H</div>
          </div>
        </div>
      </div>

      {/* CARD 2: INPUT PROFIL MASJID */}
      <div className="card">
        <div className="card-title">Profil & Identitas Masjid</div>
        
        <div className="form-group">
          <label className="form-label">Nama Masjid</label>
          <input 
            type="text" 
            className="form-control" 
            maxLength={60}
            value={data.mosqueName} 
            onChange={(e) => updateData({ mosqueName: e.target.value })}
            placeholder="Misal: Masjid Nurul Himmah"
          />
          <span style={{ fontSize: '12px', color: '#64748B', display: 'block', textAlign: 'right', marginTop: '4px' }}>
            {data.mosqueName.length} / 60 karakter
          </span>
        </div>

        <div className="form-group">
          <label className="form-label">Alamat Lengkap</label>
          <input 
            type="text" 
            className="form-control" 
            maxLength={100}
            value={data.address} 
            onChange={(e) => updateData({ address: e.target.value })}
            placeholder="Misal: Kp. Duren Seribu, Bojongsari, Kota Depok"
          />
          <span style={{ fontSize: '12px', color: '#64748B', display: 'block', textAlign: 'right', marginTop: '4px' }}>
            {data.address.length} / 100 karakter
          </span>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Logo Masjid</label>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ width: '84px', height: '84px', background: '#F8FAFC', borderRadius: '12px', border: '2px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {data.logo ? (
                <img src={data.logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              ) : (
                <span style={{ fontSize: '32px' }}>🕌</span>
              )}
            </div>

            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ position: 'relative', display: 'inline-block', marginRight: '10px' }}>
                <input 
                  type="file" 
                  accept="image/png, image/jpeg" 
                  onChange={handleLogoUpload} 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
                />
                <button className="btn btn-primary" style={{ pointerEvents: 'none' }}>
                  {uploadingLogo ? 'Mengompres...' : '📷 Pilih Logo Baru'}
                </button>
              </div>

              {data.logo && (
                <button className="btn" style={{ background: '#FEE2E2', color: '#DC2626' }} onClick={() => updateData({ logo: '' })}>
                  Hapus Logo
                </button>
              )}
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>
                Format transparan PNG disarankan. Otomatis dikompresi agar ringan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
