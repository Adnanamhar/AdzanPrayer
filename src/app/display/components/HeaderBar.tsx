'use client';

import { useMosqueData } from '@/hooks/useMosqueData';
import { useClock } from '@/hooks/useClock';
import { useHijriDate } from '@/hooks/useHijriDate';
import { notificationSound } from '@/lib/notification-sound';

import { fontPresets } from '@/lib/font-scaler';

export function HeaderBar() {
  const { mosqueData } = useMosqueData();
  const { now } = useClock();
  const hijri = useHijriDate(now, mosqueData.hijriOffset || 0);

  const days = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  let masehiDate = '';
  if (now) {
    masehiDate = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
  }

  let hijriDate = '';
  if (hijri) {
    hijriDate = `${hijri.day} ${hijri.monthName} ${hijri.year} H`;
  }

  const nameFontSize = fontPresets.mosqueName(mosqueData.mosqueName || '');
  const addressFontSize = fontPresets.mosqueAddress(mosqueData.address || '');

  return (
    <header className="header-bar">
      <div className="header-left">
        {mosqueData.logo ? (
          <img 
            id="mosque-logo" 
            src={mosqueData.logo} 
            alt="Logo" 
            style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'contain', background: 'rgba(255,255,255,0.1)', padding: '4px' }} 
          />
        ) : (
          <div className="mosque-icon-wrap">🕌</div>
        )}
        <div className="mosque-text-wrap">
          <h1 id="mosque-name" style={{ fontSize: `${nameFontSize}px` }}>{mosqueData.mosqueName}</h1>
          <p id="mosque-address" style={{ fontSize: `${addressFontSize}px` }}>{mosqueData.address}</p>
        </div>
      </div>
      <div className="header-right">
        <div id="masehi-date" className="date-masehi">{masehiDate}</div>
        <div id="hijri-date" className="date-hijri">{hijriDate}</div>
      </div>
    </header>
  );
}
