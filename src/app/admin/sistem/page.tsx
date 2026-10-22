'use client';

import { useAdminStore } from '@/stores/adminStore';
import { defaultMosqueData } from '@/lib/firestore';
import { useState } from 'react';

export default function SistemPage() {
  const { data, updateData, isLoading, saveData } = useAdminStore();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (isLoading) return <div>Memuat data...</div>;

  const handleReset = () => {
    updateData(defaultMosqueData);
    setMsg('Data berhasil di-reset ke setelan awal! Jangan lupa klik "Simpan Perubahan" di pojok kanan bawah.');
    setConfirmOpen(false);
    setTimeout(() => setMsg(''), 5000);
  };

  // 1. Ekspor / Download Backup JSON
  const handleExportBackup = () => {
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
      const downloadAnchor = document.createElement('a');
      const filename = `backup_tv_masjid_${new Date().toISOString().split('T')[0]}.json`;
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', filename);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setMsg('File backup JSON berhasil di-download!');
      setTimeout(() => setMsg(''), 4000);
    } catch (e) {
      setErrorMsg('Gagal membuat file backup.');
    }
  };

  // 2. Impor / Restore Backup JSON
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed.mosqueName || !parsed.offsets) {
          throw new Error('Format file backup tidak valid.');
        }

        updateData(parsed);
        await saveData();
        setMsg('Data berhasil dipulihkan dari file backup!');
        setErrorMsg('');
        setTimeout(() => setMsg(''), 5000);
      } catch (err: any) {
        setErrorMsg(err.message || 'File JSON rusak atau tidak sesuai format data masjid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div>
      {/* 1. BACKUP & RESTORE DATA */}
      <div className="card">
        <div className="card-title">Cadangkan & Pulihkan Data (Backup & Restore)</div>
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '20px' }}>
          Simpan seluruh konfigurasi masjid, jadwal kajian berulang, laporan keuangan, dan pengaturan audio ke file lokal.
          Sangat berguna jika ganti TV atau ingin memindahkan konfigurasi ke perangkat lain.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn" style={{ background: '#2563EB', color: '#FFFFFF', padding: '10px 20px', fontWeight: 600 }} onClick={handleExportBackup}>
            📥 Download Backup Data (.json)
          </button>

          <div style={{ position: 'relative' }}>
            <input 
              type="file" 
              accept=".json" 
              onChange={handleImportBackup} 
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
            <button className="btn" style={{ background: '#E2E8F0', color: '#0F172A', padding: '10px 20px', fontWeight: 600, pointerEvents: 'none' }}>
              📤 Pulihkan dari File Backup
            </button>
          </div>
        </div>

        {msg && <div style={{ marginTop: '16px', color: '#16A34A', fontWeight: 600, fontSize: '14px' }}>✅ {msg}</div>}
        {errorMsg && <div style={{ marginTop: '16px', color: '#DC2626', fontWeight: 600, fontSize: '14px' }}>❌ {errorMsg}</div>}
      </div>

      {/* 2. FITUR PENGHEMAT LAYAR */}
      <div className="card">
        <div className="card-title">Fitur Penghemat Layar (Screen Rest)</div>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
          Mematikan tampilan TV (layar hitam) pada jam-jam sepi (misalnya tengah malam) untuk menghemat listrik dan umur panel TV.
        </p>
        
        <div className="form-group" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
            <input 
                type="checkbox" 
                id="restEnabled"
                checked={data.restMode.enabled} 
                onChange={(e) => updateData({ restMode: { ...data.restMode, enabled: e.target.checked } })}
                style={{ width: '20px', height: '20px' }}
            />
            <label htmlFor="restEnabled" style={{ fontWeight: 600, cursor: 'pointer' }}>Aktifkan Screen Rest Otomatis</label>
        </div>

        {data.restMode.enabled && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                    <label className="form-label">Mulai Layar Hitam Jam</label>
                    <input 
                        type="time" 
                        className="form-control" 
                        value={data.restMode.start} 
                        onChange={(e) => updateData({ restMode: { ...data.restMode, start: e.target.value } })}
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Layar Hidup Kembali Jam</label>
                    <input 
                        type="time" 
                        className="form-control" 
                        value={data.restMode.end} 
                        onChange={(e) => updateData({ restMode: { ...data.restMode, end: e.target.value } })}
                    />
                </div>
            </div>
        )}
      </div>

      {/* 3. KEAMANAN & PIN ADMIN */}
      <div className="card">
        <div className="card-title">Keamanan & PIN Akses Admin</div>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>
          PIN digunakan untuk melindungi menu Admin agar tidak diubah sembarangan oleh jamaah yang terhubung ke Wi-Fi masjid.
        </p>

        <div className="form-group" style={{ maxWidth: '300px', marginBottom: 0 }}>
            <label className="form-label">PIN Admin (4-8 Digit)</label>
            <input 
                type="text" 
                maxLength={8}
                className="form-control" 
                value={data.adminPin || '1234'} 
                onChange={(e) => updateData({ adminPin: e.target.value })}
                placeholder="1234"
            />
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
              PIN default: 1234. Klik &quot;Simpan Perubahan&quot; di pojok bawah setelah mengubah PIN.
            </p>
        </div>
      </div>

      {/* 4. DANGER ZONE */}
      <div className="card" style={{ borderColor: '#fecaca', background: '#fef2f2' }}>
        <div className="card-title" style={{ color: '#991b1b', borderBottomColor: '#fecaca' }}>Danger Zone</div>
        <p style={{ fontSize: '14px', color: '#7f1d1d', marginBottom: '16px' }}>Pengaturan ulang sistem ke setelan awal pabrik.</p>
        
        {!confirmOpen ? (
            <button className="btn" style={{ background: '#dc2626', color: 'white' }} onClick={() => setConfirmOpen(true)}>
                ⚠️ Reset ke Setelan Awal Pabrik
            </button>
        ) : (
            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', padding: '16px', borderRadius: '12px' }}>
                <div style={{ fontWeight: 600, color: '#991B1B', marginBottom: '16px' }}>Apakah Anda yakin? Seluruh data jadwal, timer, dan slide akan di-reset.</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn" style={{ background: '#DC2626', color: 'white' }} onClick={handleReset}>Ya, Reset Sekarang</button>
                    <button className="btn" style={{ background: '#E2E8F0', color: '#0F172A' }} onClick={() => setConfirmOpen(false)}>Batal</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
