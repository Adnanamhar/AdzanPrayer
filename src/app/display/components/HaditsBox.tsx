'use client';

import { useState, useEffect, useMemo } from 'react';
import { useMosqueData } from '@/hooks/useMosqueData';
import type { PrayerHadithItem } from '@/types/mosque';
import { fontPresets } from '@/lib/font-scaler';

export function HaditsBox({ nextPrayerName }: { nextPrayerName?: string }) {
  const { mosqueData } = useMosqueData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Daftar hadits: utamakan hadithList dari data masjid, atau fallback ke hadits default
  const list: PrayerHadithItem[] = useMemo(() => {
    if (mosqueData.hadithList && mosqueData.hadithList.length > 0) {
      return mosqueData.hadithList;
    }
    return [
      {
        id: 'default-1',
        prayer: 'maghrib',
        arabic: mosqueData.hadithArabic || 'ظِلُّ الْمُؤْمِنِ يَوْمَ الْقِيَامَةِ صَدَقَتُهُ',
        translate: mosqueData.hadithTranslate || 'Naungan bagi seorang mukmin pada hari kiamat adalah amalan sedekahnya.',
        source: mosqueData.hadithSource || 'HR. Ahmad No. 17333'
      }
    ];
  }, [mosqueData.hadithList, mosqueData.hadithArabic, mosqueData.hadithTranslate, mosqueData.hadithSource]);

  // Sinkronkan hadits dengan waktu sholat berikutnya jika nama sholat cocok
  useEffect(() => {
    if (!nextPrayerName || list.length <= 1) return;

    const pName = nextPrayerName.toLowerCase();
    const matchedIdx = list.findIndex(h => {
      if (pName.includes('subuh') || pName.includes('shubuh') || pName.includes('imsak')) return h.prayer === 'subuh';
      if (pName.includes('dzuhur') || pName.includes('jumat')) return h.prayer === 'dzuhur';
      if (pName.includes('ashar')) return h.prayer === 'ashar';
      if (pName.includes('maghrib')) return h.prayer === 'maghrib';
      if (pName.includes('isya')) return h.prayer === 'isya';
      return false;
    });

    if (matchedIdx !== -1) {
      setFade(false);
      const timer = setTimeout(() => {
        setCurrentIndex(matchedIdx);
        setFade(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [nextPrayerName, list]);

  // Rotasi otomatis berkala jika terdapat beberapa hadits (setiap 35 detik berganti halus)
  useEffect(() => {
    if (list.length <= 1) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % list.length);
        setFade(true);
      }, 400);
    }, 35000);

    return () => clearInterval(interval);
  }, [list.length]);

  const activeHadith = list[currentIndex] || list[0];

  // Label penanda waktu shalat
  const prayerLabel = activeHadith.prayer && activeHadith.prayer !== 'umum'
    ? `HADITS WAKTU ${activeHadith.prayer.toUpperCase()}`
    : 'MUTIARA HADITS HARI INI';

  // Ukuran font adaptif otomatis menyesuaikan panjang karakter dengan batas min/max
  const arabicFontSize = activeHadith.arabic ? fontPresets.hadithArabic(activeHadith.arabic) : 38;
  const translationFontSize = activeHadith.translate ? fontPresets.hadithTranslation(activeHadith.translate) : 24;
  const sourceFontSize = activeHadith.source ? fontPresets.hadithSource(activeHadith.source) : 16;

  return (
    <div className="hadits-box">
      <div className="hadits-header-row">
        <span className="hadits-header-badge">📖 {prayerLabel}</span>
        {list.length > 1 && (
          <span className="hadits-counter">
            {currentIndex + 1} / {list.length}
          </span>
        )}
      </div>

      <div 
        className="hadits-content-wrap"
        style={{
          opacity: fade ? 1 : 0,
          transition: 'opacity 0.4s ease-in-out',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'stretch',
          gap: '12px',
          padding: '6px 4px'
        }}
      >
        {activeHadith.arabic && (
          <div 
            className="hadits-arabic"
            style={{ 
              fontSize: `${arabicFontSize}px`,
              lineHeight: 1.55,
              marginBottom: 0
            }}
          >
            {activeHadith.arabic}
          </div>
        )}

        {/* Separator Islami elegan dan halus */}
        <div className="hadits-ornament-divider">
          <span>❖</span>
        </div>

        <div 
          className="hadits-translation"
          style={{ 
            fontSize: `${translationFontSize}px`,
            lineHeight: 1.5,
            marginBottom: 0
          }}
        >
          &ldquo;{activeHadith.translate}&rdquo;
        </div>

        <div 
          className="hadits-source"
          style={{ 
            fontSize: `${sourceFontSize}px`,
            marginTop: '2px'
          }}
        >
          — {activeHadith.source}
        </div>
      </div>
    </div>
  );
}
