'use client';

import React from 'react';
import { IslamicStar, CornerOrnament, CrestOrnament } from './IqamahOverlay';

export function AdzanOverlay({
    show,
    mosqueName,
    prayerName,
    timeString,
    timezone = 'WIB',
    timerText,
}: {
    show: boolean;
    mosqueName: string;
    prayerName: string;
    timeString: string;
    timezone?: string;
    timerText?: string;
}) {
  // Format timer consistently (e.g. -03:00 atau -02:59)
  const displayTimer = timerText 
    ? (timerText.startsWith('-') ? timerText : `-${timerText}`)
    : '-00:00';

  return (
    <div id="adzan-mode" className={`iqamah-overlay adzan-overlay-unified ${show ? '' : 'hidden'}`}>
      {/* Seamless Islamic Geometric Tessellation Background SVG Pattern */}
      <svg className="iqamah-pattern-bg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="islamic-grid-adzan" width="80" height="80" patternUnits="userSpaceOnUse">
            <path 
              d="M 40 10 L 50 30 L 70 40 L 50 50 L 40 70 L 30 50 L 10 40 L 30 30 Z" 
              fill="none" 
              stroke="var(--c-2)" 
              strokeWidth="1.2" 
              strokeOpacity="0.12" 
            />
            <path 
              d="M 0 0 L 10 20 L 30 20 L 20 0 Z" 
              fill="none" 
              stroke="var(--c-3)" 
              strokeWidth="1" 
              strokeOpacity="0.08" 
            />
            <path 
              d="M 80 0 L 70 20 L 50 20 L 60 0 Z" 
              fill="none" 
              stroke="var(--c-3)" 
              strokeWidth="1" 
              strokeOpacity="0.08" 
            />
            <circle cx="40" cy="40" r="3" fill="var(--c-2)" fillOpacity="0.1" />
            <circle cx="0" cy="0" r="4" fill="var(--c-3)" fillOpacity="0.08" />
            <circle cx="80" cy="0" r="4" fill="var(--c-3)" fillOpacity="0.08" />
            <circle cx="0" cy="80" r="4" fill="var(--c-3)" fillOpacity="0.08" />
            <circle cx="80" cy="80" r="4" fill="var(--c-3)" fillOpacity="0.08" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-grid-adzan)" />
      </svg>

      {/* Corner Ornaments */}
      <CornerOrnament position="top-left" />
      <CornerOrnament position="top-right" />
      <CornerOrnament position="bottom-left" />
      <CornerOrnament position="bottom-right" />

      {/* Top & Bottom Crests */}
      <CrestOrnament position="top" />
      <CrestOrnament position="bottom" />

      {/* Floating 8-pointed Gold Stars */}
      <div className="iqamah-floating-star top-star">
        <IslamicStar size={32} color="#D4AF37" />
      </div>
      <div className="iqamah-floating-star bottom-star">
        <IslamicStar size={32} color="#D4AF37" />
      </div>

      {/* Central Content matching luxury Islamic card design */}
      <div className="iqamah-content">
        {/* Mosque Name at Top */}
        <div className="iqamah-mosque">
          {mosqueName}
        </div>

        {/* Title: "ADZAN TELAH TIBA" */}
        <div className="iqamah-title-label" style={{ color: '#059669', letterSpacing: '4px' }}>
          ADZAN TELAH TIBA
        </div>

        {/* Rounded Timer Box matching the reference design */}
        <div className="iqamah-timer-badge">
          <span className="iqamah-timer-digits">
            {displayTimer}
          </span>
        </div>

        {/* Active Prayer Info (e.g. SHALAT MAGHRIB — 17:45 WIB) */}
        {prayerName && (
          <div className="iqamah-info-badge">
            <span className="iqamah-info-icon">🕌</span>
            <span className="iqamah-info-text">
              WAKTU SHALAT {prayerName.toUpperCase()} {timeString ? `— ${timeString} ${timezone}` : ''}
            </span>
          </div>
        )}

        {/* Subtitle / Hint */}
        <div className="iqamah-hint-msg">
          Hayya &apos;alas shalah — Hayya &apos;alal falah • Dengarkan & jawablah seruan adzan
        </div>
      </div>
    </div>
  );
}
