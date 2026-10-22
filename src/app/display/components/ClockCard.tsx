'use client';

import { useClock } from '@/hooks/useClock';
import { useMosqueData } from '@/hooks/useMosqueData';

interface ClockCardProps {
  nextPrayerName?: string;
  countdownText?: string;
  isPreAdzan?: boolean;
}

export function ClockCard({ nextPrayerName, countdownText, isPreAdzan }: ClockCardProps) {
  const { time } = useClock();
  const { mosqueData } = useMosqueData();

  const tz = mosqueData.timezone || 'WIB';
  const tzLabels: Record<string, string> = {
    WIB: 'WAKTU INDONESIA BARAT',
    WITA: 'WAKTU INDONESIA TENGAH',
    WIT: 'WAKTU INDONESIA TIMUR',
  };

  return (
    <div className="clock-card">
      <div className="clock-face">
        <span className="clock-digits">{time?.hours || '00'}</span>
        <span className="clock-colon">:</span>
        <span className="clock-digits">{time?.minutes || '00'}</span>
        <span className="clock-secs">:{time?.seconds || '00'}</span>
      </div>
      <div className="clock-wib">{tzLabels[tz] || 'WAKTU INDONESIA BARAT'}</div>
    </div>
  );
}
