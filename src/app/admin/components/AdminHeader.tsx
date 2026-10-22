'use client';

import { usePathname } from 'next/navigation';

const titleMap: Record<string, string> = {
  '/admin/profil': 'Profil Masjid',
  '/admin/jadwal': 'Jadwal Sholat & Lokasi',
  '/admin/iqamah': 'Pengaturan Jeda & Iqamah',
  '/admin/media': 'Media & Slideshow',
  '/admin/teks': 'Running Text & Hadits',
  '/admin/keuangan': 'Laporan Keuangan',
  '/admin/tema': 'Tema & Warna',
  '/admin/sistem': 'Pengaturan Sistem',
};

export function AdminHeader() {
  const pathname = usePathname();
  const title = titleMap[pathname || ''] || 'Dashboard Admin';

  const handleLock = () => {
    sessionStorage.removeItem('admin_authenticated');
    window.location.reload();
  };

  const toggleMobileSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar?.classList.toggle('mobile-open');
  };

  return (
    <div className="content-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          className="mobile-toggle-btn"
          onClick={toggleMobileSidebar}
          aria-label="Toggle Menu"
        >
          ☰
        </button>
        <div id="active-menu-title">{title}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/display" target="_blank" rel="noopener noreferrer" style={{
          textDecoration: 'none', color: '#1F6FB2', fontWeight: 600, fontSize: '14px',
          display: 'flex', alignItems: 'center', gap: '6px', background: '#EFF6FF',
          padding: '6px 14px', borderRadius: '8px', border: '1px solid #BFDBFE'
        }}>
          Lihat TV ↗
        </a>
        <button 
          onClick={handleLock}
          style={{
            background: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5',
            padding: '6px 14px', borderRadius: '8px', cursor: 'pointer',
            fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px'
          }}
          title="Kunci sesi admin"
        >
          🔒 Kunci
        </button>
      </div>
    </div>
  );
}
