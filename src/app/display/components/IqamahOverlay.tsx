'use client';

import React from 'react';

// Islamic 8-Pointed Star (Rub El Hizb / Khatam)
export function IslamicStar({ size = 32, color = '#D4AF37' }: { size?: number; color?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.15))' }}
    >
      <defs>
        <linearGradient id="star-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
      {/* Outer 8-pointed star: two overlapping squares */}
      <rect x="22" y="22" width="56" height="56" rx="4" fill="url(#star-gold)" stroke="#FFFBEB" strokeWidth="1.5" />
      <rect x="22" y="22" width="56" height="56" rx="4" fill="url(#star-gold)" stroke="#FFFBEB" strokeWidth="1.5" transform="rotate(45 50 50)" />
      
      {/* Inner geometric ring and central jewel */}
      <circle cx="50" cy="50" r="16" fill="var(--c-5, #FFFFFF)" opacity="0.9" />
      <circle cx="50" cy="50" r="11" fill="url(#star-gold)" />
      <circle cx="50" cy="50" r="5" fill="var(--c-5, #FFFFFF)" />
    </svg>
  );
}

// Authentic Islamic Geometric Corner Medallion (Girih / Moroccan Mosaic style)
export function CornerOrnament({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  let style: React.CSSProperties = {
    position: 'absolute',
    width: '260px',
    height: '260px',
    pointerEvents: 'none',
    zIndex: 1,
    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.12))'
  };

  if (position === 'top-left') {
    style = { ...style, top: 0, left: 0 };
  } else if (position === 'top-right') {
    style = { ...style, top: 0, right: 0, transform: 'scaleX(-1)' };
  } else if (position === 'bottom-left') {
    style = { ...style, bottom: 0, left: 0, transform: 'scaleY(-1)' };
  } else if (position === 'bottom-right') {
    style = { ...style, bottom: 0, right: 0, transform: 'scale(-1, -1)' };
  }

  return (
    <svg style={style} viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="corner-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
      </defs>

      {/* Outer concentric decorative arcs */}
      <circle cx="0" cy="0" r="255" stroke="url(#corner-gold)" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.6" />
      <circle cx="0" cy="0" r="240" stroke="var(--c-3)" strokeWidth="2.5" opacity="0.7" />
      <circle cx="0" cy="0" r="222" stroke="url(#corner-gold)" strokeWidth="3" opacity="0.85" />
      <circle cx="0" cy="0" r="160" stroke="var(--c-3)" strokeWidth="1.5" opacity="0.5" />

      {/* Geometric Mosaic Facets radiating from corner (0,0) */}
      <g>
        {/* Base corner petal facets */}
        <polygon points="0,0 120,0 135,45 80,80 45,135 0,120" fill="var(--c-1)" opacity="0.9" />
        
        {/* Inner geometric diamond petals */}
        <polygon points="0,0 85,0 60,60 0,85" fill="var(--c-2)" opacity="0.95" />
        
        {/* Radiating Islamic interlaced bands */}
        <path d="M 0 50 L 50 50 L 50 0" stroke="url(#corner-gold)" strokeWidth="3" fill="none" />
        <path d="M 0 90 L 90 90 L 90 0" stroke="var(--c-5)" strokeWidth="2" strokeOpacity="0.8" fill="none" />
        <path d="M 0 130 L 75 130 L 130 75 L 130 0" stroke="url(#corner-gold)" strokeWidth="3.5" fill="none" />
        <path d="M 0 170 L 60 170 L 170 60 L 170 0" stroke="var(--c-3)" strokeWidth="2" fill="none" opacity="0.8" />
        
        {/* Facet filling for geometric visual depth */}
        <polygon points="50,50 90,50 90,90 50,90" fill="var(--c-4)" opacity="0.4" />
        <polygon points="75,130 130,130 130,75" fill="var(--c-2)" opacity="0.75" />
        
        {/* Corner 8-pointed star rosette medallion */}
        <g transform="translate(135, 135) scale(0.72)">
          {/* Gold 8-point star frame */}
          <rect x="-24" y="-24" width="48" height="48" rx="4" fill="url(#corner-gold)" stroke="var(--c-1)" strokeWidth="2" />
          <rect x="-24" y="-24" width="48" height="48" rx="4" fill="url(#corner-gold)" stroke="var(--c-1)" strokeWidth="2" transform="rotate(45)" />
          {/* Inner dark center */}
          <rect x="-15" y="-15" width="30" height="30" rx="2" fill="var(--c-1)" />
          <rect x="-15" y="-15" width="30" height="30" rx="2" fill="var(--c-1)" transform="rotate(45)" />
          <circle cx="0" cy="0" r="8" fill="var(--c-5)" />
          <circle cx="0" cy="0" r="4" fill="url(#corner-gold)" />
        </g>

        {/* Diagonal side star ornaments */}
        <g transform="translate(190, 42) scale(0.48)">
          <rect x="-20" y="-20" width="40" height="40" rx="3" fill="url(#corner-gold)" stroke="var(--c-2)" strokeWidth="2" />
          <rect x="-20" y="-20" width="40" height="40" rx="3" fill="url(#corner-gold)" stroke="var(--c-2)" strokeWidth="2" transform="rotate(45)" />
          <circle cx="0" cy="0" r="6" fill="var(--c-5)" />
        </g>
        <g transform="translate(42, 190) scale(0.48)">
          <rect x="-20" y="-20" width="40" height="40" rx="3" fill="url(#corner-gold)" stroke="var(--c-2)" strokeWidth="2" />
          <rect x="-20" y="-20" width="40" height="40" rx="3" fill="url(#corner-gold)" stroke="var(--c-2)" strokeWidth="2" transform="rotate(45)" />
          <circle cx="0" cy="0" r="6" fill="var(--c-5)" />
        </g>
      </g>
    </svg>
  );
}

// Center Top & Bottom Crest Ornament
export function CrestOrnament({ position }: { position: 'top' | 'bottom' }) {
  const isTop = position === 'top';
  const style: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    transform: isTop ? 'translateX(-50%)' : 'translateX(-50%) scaleY(-1)',
    top: isTop ? '0' : 'auto',
    bottom: isTop ? 'auto' : '0',
    width: '320px',
    height: '75px',
    pointerEvents: 'none',
    zIndex: 1,
    filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.08))'
  };

  return (
    <svg style={style} viewBox="0 0 320 75" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="crest-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
      {/* Outer arch crest */}
      <path 
        d="M 30 0 C 70 36 110 58 160 58 C 210 58 250 36 290 0 Z" 
        fill="var(--c-5)" 
        opacity="0.95"
        stroke="url(#crest-gold)" 
        strokeWidth="2.5" 
      />
      {/* Inner arch */}
      <path 
        d="M 60 0 C 95 26 125 44 160 44 C 195 44 225 26 260 0 Z" 
        fill="var(--c-4)" 
        opacity="0.6"
        stroke="var(--c-3)" 
        strokeWidth="1.5" 
      />
      {/* Center 8-point gold star */}
      <g transform="translate(160, 32) scale(0.55)">
        <rect x="-20" y="-20" width="40" height="40" rx="3" fill="url(#crest-gold)" />
        <rect x="-20" y="-20" width="40" height="40" rx="3" fill="url(#crest-gold)" transform="rotate(45)" />
        <circle cx="0" cy="0" r="7" fill="var(--c-5)" />
      </g>
    </svg>
  );
}

export function IqamahOverlay({
    show,
    mosqueName,
    prayerName,
    timeString,
    timerText,
    title,
    subtitle,
    timezone = 'WIB'
}: {
    show: boolean;
    mosqueName: string;
    prayerName: string;
    timeString: string;
    timerText: string;
    title?: string;
    subtitle?: string;
    timezone?: string;
}) {
  // Ensure timer starts with '-' (e.g. -09:57) exactly like the user's reference image
  const displayTimer = timerText 
    ? (timerText.startsWith('-') ? timerText : `-${timerText}`)
    : '-00:00';

  const displayTitle = title || 'Menuju Iqomah';

  return (
    <div id="iqamah-mode" className={`iqamah-overlay ${show ? '' : 'hidden'}`}>
      {/* Seamless Islamic Geometric Tessellation Background SVG Pattern */}
      <svg className="iqamah-pattern-bg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>
          <pattern id="islamic-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            {/* 8-pointed star geometry tile */}
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
        <rect width="100%" height="100%" fill="url(#islamic-grid)" />
      </svg>

      {/* Corner Ornaments */}
      <CornerOrnament position="top-left" />
      <CornerOrnament position="top-right" />
      <CornerOrnament position="bottom-left" />
      <CornerOrnament position="bottom-right" />

      {/* Top & Bottom Crests */}
      <CrestOrnament position="top" />
      <CrestOrnament position="bottom" />

      {/* Floating 8-pointed Gold Stars near top and bottom */}
      <div className="iqamah-floating-star top-star">
        <IslamicStar size={32} color="#D4AF37" />
      </div>
      <div className="iqamah-floating-star bottom-star">
        <IslamicStar size={32} color="#D4AF37" />
      </div>

      {/* Central Content */}
      <div className="iqamah-content">
        {/* Mosque Name at Top */}
        <div className="iqamah-mosque" id="iqamah-mosque-name">
          {mosqueName}
        </div>

        {/* Title: "Menuju Iqomah" */}
        <div className="iqamah-title-label">
          {displayTitle}
        </div>

        {/* Rounded Timer Box matching the reference image */}
        <div className="iqamah-timer-badge">
          <span id="iqamah-timer" className="iqamah-timer-digits">
            {displayTimer}
          </span>
        </div>

        {/* Active Prayer Info (e.g. SHALAT MAGHRIB — 17:45 WIB) */}
        {prayerName && (
          <div id="iqamah-info" className="iqamah-info-badge">
            <span className="iqamah-info-icon">🕌</span>
            <span className="iqamah-info-text">
              SHALAT {prayerName.toUpperCase()} {timeString ? `— ${timeString} ${timezone}` : ''}
            </span>
          </div>
        )}

        {/* Subtitle / Hint: "Luruskan dan rapatkan shaf" */}
        <div className="iqamah-hint-msg">
          {subtitle || 'Luruskan dan rapatkan shaf demi kesempurnaan shalat'}
        </div>
      </div>
    </div>
  );
}
