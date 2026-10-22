'use client';

import { useMosqueData } from '@/hooks/useMosqueData';

export function RunningText() {
  const { mosqueData } = useMosqueData();
  const rawText = mosqueData.runningText || '';

  // Format pemisah (✦, •, |) agar memiliki jarak yang sangat lega dan tidak dempet
  const spacedText = rawText
    .replace(/\s*(✦|•|\|)\s*/g, ' \u00A0\u00A0\u00A0\u00A0 $1 \u00A0\u00A0\u00A0\u00A0 ')
    .trim();

  // Tambahkan jeda lapang di akhir pesan sebelum loop kembali ke awal
  const displayText = spacedText 
    ? `${spacedText} \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0✦\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0` 
    : '';

  // Durasi dinamis berbasis panjang karakter agar teks tidak bergerak terlalu cepat
  const duration = Math.max(25, Math.round(displayText.length * 0.18));

  return (
    <footer className="running-bar">
      <div className="running-badge">INFO</div>
      <div className="marquee-wrap">
        <div 
          className="marquee-text" 
          id="running-text"
          style={{ animationDuration: `${duration}s` }}
        >
          {displayText}
        </div>
      </div>
    </footer>
  );
}
