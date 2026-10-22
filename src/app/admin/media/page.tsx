'use client';

import { useState } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { compressImage } from '@/lib/image-compressor';

export default function MediaPage() {
  const { data, updateData, isLoading } = useAdminStore();
  const [uploadingSlide, setUploadingSlide] = useState(false);
  const [uploadingQris, setUploadingQris] = useState(false);

  if (isLoading) return <div>Memuat data...</div>;

  const handleSlideUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingSlide(true);
      // Kompres otomatis gambar ke FullHD 1920x1080 (kualitas 82%)
      const compressedBase64 = await compressImage(file, 1920, 1080, 0.82);
      updateData({ slides: [...data.slides, compressedBase64] });
    } catch (err) {
      alert('Gagal memproses gambar. Pastikan file berupa JPG/PNG.');
    } finally {
      setUploadingSlide(false);
      e.target.value = '';
    }
  };

  const removeSlide = (idx: number) => {
    const newSlides = [...data.slides];
    newSlides.splice(idx, 1);
    updateData({ slides: newSlides });
  };

  const handleQrisUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingQris(true);
      // Kompres QRIS ke 800x800 agar barcode tetap tajam tapi file ringan (< 150KB)
      const compressedBase64 = await compressImage(file, 800, 800, 0.85);
      updateData({ 
        qris: { ...data.qris, image: compressedBase64 } 
      });
    } catch (err) {
      alert('Gagal memproses gambar QRIS.');
    } finally {
      setUploadingQris(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      {/* CARD 1: PENGATURAN SLIDESHOW */}
      <div className="card">
        <div className="card-title">Pengaturan Slideshow Layar TV</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Durasi per Slide Tampil (Detik)</label>
              <input 
                  type="number" 
                  className="form-control" 
                  value={data.slideDurationSec} 
                  onChange={(e) => updateData({ slideDurationSec: parseInt(e.target.value) || 15 })}
              />
              <p style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>Waktu jeda sebelum berganti ke slide berikutnya.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
              <input 
                type="checkbox" 
                checked={data.showKajianSlide !== false}
                onChange={(e) => updateData({ showKajianSlide: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              Tampilkan Slide Info Kajian
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
              <input 
                type="checkbox" 
                checked={data.showKeuanganSlide !== false}
                onChange={(e) => updateData({ showKeuanganSlide: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              Tampilkan Slide Laporan Keuangan
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
              <input 
                type="checkbox" 
                checked={data.showQrisSlide !== false}
                onChange={(e) => updateData({ showQrisSlide: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              Tampilkan Slide QRIS Donasi
            </label>
          </div>
        </div>
      </div>

      {/* CARD 2: QRIS DENGAN LIVE PREVIEW */}
      <div className="card">
        <div className="card-title">QRIS Infaq & Shadaqah Digital</div>
        
        {/* LIVE TV SLIDE QRIS PREVIEW */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
            Live Preview Slide QRIS di TV:
          </div>
          <div style={{ maxWidth: '780px', margin: '0 auto', background: 'radial-gradient(circle at 75% 30%, #1E293B 0%, #0F172A 70%, #080E1A 100%)', borderRadius: '18px', padding: '24px 28px', color: '#F8FAFC', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 8px 30px rgba(0,0,0,0.3)', display: 'flex', gap: '24px', alignItems: 'center' }}>
            <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '180px', height: '180px', background: '#FFFFFF', borderRadius: '16px', padding: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {data.qris.image ? (
                  <img src={data.qris.image} alt="QRIS" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <span style={{ fontSize: '13px', color: '#94A3B8' }}>Belum ada QRIS</span>
                )}
              </div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#38BDF8', background: 'rgba(56, 189, 248, 0.12)', padding: '4px 10px', borderRadius: '20px' }}>
                📱 Pindai via m-Banking / E-Wallet
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '10px', fontWeight: 800, color: '#F59E0B', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '6px', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  🕌 INFAQ &amp; SHADAQAH DIGITAL
                </div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                  Salurkan Infaq &amp; Sedekah
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                  Untuk Kemakmuran {data.mosqueName || 'Masjid'}
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '12px', padding: '10px 14px' }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: '#38BDF8', letterSpacing: '0.8px' }}>REKENING RESMI MASJID</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#E2E8F0', marginTop: '2px' }}>{data.qris.bankName || 'Bank Rekening Masjid'}</div>
                <div style={{ fontSize: '17px', fontWeight: 900, color: '#38BDF8', letterSpacing: '1px', fontFamily: 'monospace', margin: '2px 0' }}>{data.qris.accountNo || '-'}</div>
                <div style={{ fontSize: '11px', color: '#CBD5E1' }}>a.n. {data.qris.accountName || data.mosqueName || 'DKM Masjid'}</div>
              </div>

              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '10px', color: '#94A3B8' }}>
                <span style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px' }}>1. Buka App</span>
                <span>➔</span>
                <span style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px' }}>2. Scan QR</span>
                <span>➔</span>
                <span style={{ background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '4px' }}>3. Konfirmasi</span>
              </div>
            </div>
          </div>
        </div>

        {/* INPUT FORM QRIS */}
        <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
            <div style={{ width: '200px' }}>
                <div style={{ width: '200px', height: '200px', background: '#F8FAFC', borderRadius: '16px', overflow: 'hidden', border: '2px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    {data.qris.image ? (
                        <img src={data.qris.image} alt="QRIS" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }} />
                    ) : (
                        <span style={{ color: '#94A3B8', fontWeight: 500, fontSize: '13px', textAlign: 'center', padding: '10px' }}>
                          {uploadingQris ? 'Mengompres...' : 'Klik untuk Upload QRIS'}
                        </span>
                    )}
                    
                    <input 
                        type="file" 
                        accept="image/png, image/jpeg" 
                        onChange={handleQrisUpload} 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    />
                </div>
                {data.qris.image && (
                    <button className="btn" style={{ background: '#FEE2E2', color: '#B91C1C', padding: '8px 12px', marginTop: '10px', width: '100%', border: '1px dashed #EF4444' }} onClick={() => updateData({ qris: { ...data.qris, image: '' } })}>
                      Hapus QRIS
                    </button>
                )}
            </div>
            
            <div style={{ flex: 1, minWidth: '280px' }}>
                <div className="form-group">
                    <label className="form-label">Nama Bank / Dompet Digital (E-Wallet)</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={data.qris.bankName} 
                        onChange={(e) => updateData({ qris: { ...data.qris, bankName: e.target.value } })}
                        placeholder="Misal: Bank Syariah Indonesia (BSI)"
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Nomor Rekening / Merchant ID</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={data.qris.accountNo} 
                        onChange={(e) => updateData({ qris: { ...data.qris, accountNo: e.target.value } })}
                        placeholder="Misal: 7123456789"
                    />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Atas Nama Rekening</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={data.qris.accountName} 
                        onChange={(e) => updateData({ qris: { ...data.qris, accountName: e.target.value } })}
                        placeholder="Misal: DKM Masjid Baiturrahman"
                    />
                </div>
            </div>
        </div>
      </div>

      {/* CARD 3: GAMBAR SLIDE PROMOSI */}
      <div className="card">
        <div className="card-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Gambar Slide Promosi / Poster Kegiatan</span>
            <div style={{ position: 'relative' }}>
                <input 
                    type="file" 
                    accept="image/png, image/jpeg" 
                    onChange={handleSlideUpload} 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                />
                <button className="btn btn-primary" style={{ pointerEvents: 'none' }}>
                  {uploadingSlide ? 'Mengompres...' : '+ Upload Gambar Slide'}
                </button>
            </div>
        </div>
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
          Otomatis dikompresi ke 1920x1080 Full HD agar TV tetap mulus dan hemat memori.
        </p>
        
        {data.slides.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#64748B', padding: '40px 0', background: '#F8FAFC', borderRadius: '16px', border: '2px dashed #E2E8F0' }}>
                Belum ada gambar slide promosi.<br/>Klik <strong>+ Upload Gambar Slide</strong> di atas.
            </div>
        ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
                {data.slides.map((s, idx) => (
                    <div key={idx} style={{ position: 'relative', borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', background: '#F1F5F9', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)' }}>
                        <div style={{ paddingBottom: '56.25%', position: 'relative' }}>
                            <img src={s} alt={`Slide ${idx}`} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <button 
                            onClick={() => removeSlide(idx)}
                            style={{ position: 'absolute', top: '10px', right: '10px', background: '#DC2626', color: 'white', border: 'none', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}
                        >
                          Hapus
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
