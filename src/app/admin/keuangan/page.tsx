'use client';

import { useAdminStore } from '@/stores/adminStore';

function formatRupiah(angka: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
}

export default function KeuanganPage() {
  const { data, updateData, isLoading } = useAdminStore();

  if (isLoading) return <div>Memuat data...</div>;

  const k = data.keuangan;

  const handlePemasukanChange = (idx: number, field: string, val: any) => {
    const newPem = [...k.pemasukan];
    newPem[idx] = { ...newPem[idx], [field]: val };
    updateData({ keuangan: { ...k, pemasukan: newPem } });
  };

  const handlePengeluaranChange = (idx: number, field: string, val: any) => {
    const newPeng = [...k.pengeluaran];
    newPeng[idx] = { ...newPeng[idx], [field]: val };
    updateData({ keuangan: { ...k, pengeluaran: newPeng } });
  };

  const addPemasukan = () => {
    updateData({ keuangan: { ...k, pemasukan: [...k.pemasukan, { desc: '', amount: 0 }] } });
  };
  const addPengeluaran = () => {
    updateData({ keuangan: { ...k, pengeluaran: [...k.pengeluaran, { desc: '', amount: 0 }] } });
  };

  const delPemasukan = (idx: number) => {
    const newPem = [...k.pemasukan];
    newPem.splice(idx, 1);
    updateData({ keuangan: { ...k, pemasukan: newPem } });
  };
  const delPengeluaran = (idx: number) => {
    const newPeng = [...k.pengeluaran];
    newPeng.splice(idx, 1);
    updateData({ keuangan: { ...k, pengeluaran: newPeng } });
  };

  // Kalkulasi total
  let totalMasuk = 0;
  let totalKeluar = 0;
  (k.pemasukan || []).forEach(item => totalMasuk += Number(item.amount) || 0);
  (k.pengeluaran || []).forEach(item => totalKeluar += Number(item.amount) || 0);
  const saldoAkhir = totalMasuk - totalKeluar;

  return (
    <div>
      {/* CARD 1: LIVE TV SLIDE PREVIEW */}
      <div className="card" style={{ background: '#0F172A', borderColor: '#1E293B', color: '#fff' }}>
        <div className="card-title" style={{ color: '#F8FAFC', borderBottomColor: '#1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>📺 Live Preview Slide Keuangan di TV</span>
          <span style={{ fontSize: '12px', background: '#334155', color: '#94A3B8', padding: '4px 10px', borderRadius: '6px' }}>
            Otomatis Bergulir di TV
          </span>
        </div>

        <div style={{ maxWidth: '720px', margin: '0 auto', background: '#FFFFFF', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', border: '1px solid #CBD5E1' }}>
          {/* Header Slide */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#1C1D37' }}>Laporan Keuangan Kas Masjid</div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Periode: {k.periode || 'Belum diisi'}</div>
            </div>
            <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '6px' }}>
              TRANSPARAN
            </span>
          </div>

          {/* 2-Column Body */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '20px 24px' }}>
            {/* Kolom Pemasukan */}
            <div style={{ background: '#F0FDF4', borderRadius: '12px', padding: '14px', border: '1px solid #BBF7D0' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#166534', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span>PEMASUKAN</span>
                <span>{formatRupiah(totalMasuk)}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                {k.pemasukan.length === 0 ? (
                  <div style={{ fontSize: '12px', color: '#64748B', fontStyle: 'italic' }}>Belum ada data</div>
                ) : (
                  k.pemasukan.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#1F2937', padding: '4px 0', borderBottom: '1px dashed #DCFCE7' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{item.desc || '-'}</span>
                      <span style={{ fontWeight: 600 }}>{formatRupiah(item.amount)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Kolom Pengeluaran */}
            <div style={{ background: '#FEF2F2', borderRadius: '12px', padding: '14px', border: '1px solid #FECACA' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#991B1B', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span>PENGELUARAN</span>
                <span>{formatRupiah(totalKeluar)}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                {k.pengeluaran.length === 0 ? (
                  <div style={{ fontSize: '12px', color: '#64748B', fontStyle: 'italic' }}>Belum ada data</div>
                ) : (
                  k.pengeluaran.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#1F2937', padding: '4px 0', borderBottom: '1px dashed #FEE2E2' }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{item.desc || '-'}</span>
                      <span style={{ fontWeight: 600 }}>{formatRupiah(item.amount)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer Saldo Akhir */}
          <div style={{
            background: '#1C1D37',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#FFFFFF'
          }}>
            <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.5px' }}>Saldo Kas Saat Ini</span>
            <span style={{ fontSize: '20px', fontWeight: 900, color: saldoAkhir >= 0 ? '#4ADE80' : '#F87171' }}>
              {formatRupiah(saldoAkhir)}
            </span>
          </div>
        </div>
      </div>

      {/* CARD 2: PENGATURAN PERIODE */}
      <div className="card">
        <div className="card-title">Pengaturan Laporan</div>
        <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Periode Laporan Keuangan</label>
            <input 
                type="text" 
                className="form-control" 
                value={k.periode} 
                onChange={(e) => updateData({ keuangan: { ...k, periode: e.target.value } })}
                placeholder="Misal: Oktober 2026 (Pekan ke-3)"
            />
            <p style={{ fontSize: '13px', color: '#64748B', marginTop: '8px' }}>
              Pemasukan & pengeluaran akan ditampilkan otomatis saat jadwal bergulir di layar TV.
            </p>
        </div>
      </div>

      {/* CARD 3: INPUT PEMASUKAN & PENGELUARAN */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card" style={{ background: '#F0FDF4', borderColor: '#BBF7D0', padding: '24px' }}>
            <div className="card-title" style={{ color: '#166534', borderBottomColor: '#BBF7D0', display: 'flex', justifyContent: 'space-between' }}>
              <span>Pemasukan Saldo</span>
              <span style={{ fontSize: '14px' }}>Total: {formatRupiah(totalMasuk)}</span>
            </div>
            {k.pemasukan.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
                    <input 
                        type="text" className="form-control" placeholder="Deskripsi (Misal: Kotak Amal Jumat)" 
                        value={p.desc} onChange={(e) => handlePemasukanChange(idx, 'desc', e.target.value)} 
                        style={{ flex: 1, background: '#fff' }}
                    />
                    <div style={{ position: 'relative', width: '160px' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontWeight: 600 }}>Rp</span>
                        <input 
                            type="number" className="form-control" placeholder="0" 
                            value={p.amount || ''} onChange={(e) => handlePemasukanChange(idx, 'amount', parseInt(e.target.value) || 0)} 
                            style={{ width: '100%', background: '#fff', paddingLeft: '40px' }}
                        />
                    </div>
                    <button className="btn" style={{ background: '#FEE2E2', color: '#DC2626', padding: '0', width: '40px', height: '40px', borderRadius: '10px' }} onClick={() => delPemasukan(idx)}>✕</button>
                </div>
            ))}
            <button className="btn" style={{ width: '100%', background: '#DCFCE7', color: '#15803D', border: '1px dashed #22C55E' }} onClick={addPemasukan}>
                + Tambah Pemasukan Baru
            </button>
        </div>

        <div className="card" style={{ background: '#FEF2F2', borderColor: '#FECACA', padding: '24px' }}>
            <div className="card-title" style={{ color: '#991B1B', borderBottomColor: '#FECACA', display: 'flex', justifyContent: 'space-between' }}>
              <span>Pengeluaran Saldo</span>
              <span style={{ fontSize: '14px' }}>Total: {formatRupiah(totalKeluar)}</span>
            </div>
            {k.pengeluaran.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
                    <input 
                        type="text" className="form-control" placeholder="Deskripsi (Misal: Bayar Listrik / Kebersihan)" 
                        value={p.desc} onChange={(e) => handlePengeluaranChange(idx, 'desc', e.target.value)} 
                        style={{ flex: 1, background: '#fff' }}
                    />
                    <div style={{ position: 'relative', width: '160px' }}>
                        <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B', fontWeight: 600 }}>Rp</span>
                        <input 
                            type="number" className="form-control" placeholder="0" 
                            value={p.amount || ''} onChange={(e) => handlePengeluaranChange(idx, 'amount', parseInt(e.target.value) || 0)} 
                            style={{ width: '100%', background: '#fff', paddingLeft: '40px' }}
                        />
                    </div>
                    <button className="btn" style={{ background: '#FEE2E2', color: '#DC2626', padding: '0', width: '40px', height: '40px', borderRadius: '10px' }} onClick={() => delPengeluaran(idx)}>✕</button>
                </div>
            ))}
            <button className="btn" style={{ width: '100%', background: '#FEE2E2', color: '#B91C1C', border: '1px dashed #EF4444' }} onClick={addPengeluaran}>
                + Tambah Pengeluaran Baru
            </button>
        </div>
      </div>
    </div>
  );
}
