'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { path: '/admin/profil', label: 'Profil Masjid', icon: '🕌' },
  { path: '/admin/jadwal', label: 'Jadwal Sholat', icon: '⏰' },
  { path: '/admin/iqamah', label: 'Timer Iqamah', icon: '⏳' },
  { path: '/admin/kajian', label: 'Jadwal Kajian', icon: '📚' },
  { path: '/admin/media', label: 'Media & Slide', icon: '🖼️' },
  { path: '/admin/teks', label: 'Running Text & Hadits', icon: '📜' },
  { path: '/admin/keuangan', label: 'Laporan Keuangan', icon: '💰' },
  { path: '/admin/tema', label: 'Tema Warna', icon: '🎨' },
  { path: '/admin/sistem', label: 'Sistem & Reset', icon: '⚙️' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span style={{ fontSize: '24px' }}>☪</span> Admin TV
      </div>
      <ul className="nav-list">
        {menuItems.map(item => (
          <li key={item.path}>
            <Link 
              href={item.path} 
              className={`nav-item ${pathname?.startsWith(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span> {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
