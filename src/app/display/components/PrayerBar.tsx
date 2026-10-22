'use client';

import { useMosqueData } from '@/hooks/useMosqueData';
import { useClock } from '@/hooks/useClock';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import type { PrayerKey } from '@/types/prayer';

const prayerKeys: PrayerKey[] = ['imsak', 'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
const prayerNames: Record<PrayerKey, string> = {
  imsak: 'Imsak', fajr: 'Shubuh', sunrise: 'Syuruq',
  dhuhr: 'Dzuhur', asr: 'Ashar', maghrib: 'Maghrib', isha: 'Isya'
};
const iqamahPrayers: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

function fmt(d: Date | undefined) {
    if (!d) return '--:--';
    return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}

export function PrayerBar() {
  const { mosqueData } = useMosqueData();
  const { now } = useClock();
  const times = usePrayerTimes(mosqueData, now);

  // Find next prayer for highlighting
  let nextKey: PrayerKey | null = null;
  if (times && now) {
    const adzanEntries = iqamahPrayers
      .filter(k => times[k] && !isNaN(times[k].getTime()))
      .map(k => ({ key: k, time: times[k] }))
      .sort((a,b) => a.time.getTime() - b.time.getTime());

    for (let i = 0; i < adzanEntries.length; i++) {
        if (now < adzanEntries[i].time) {
            nextKey = adzanEntries[i].key;
            break;
        }
    }
    if (!nextKey) nextKey = 'fajr'; // Tomorrow's fajr
  }

  return (
    <div className="prayer-bar" id="prayer-bar">
      {prayerKeys.map(k => {
        const isIqamah = iqamahPrayers.includes(k);
        const isActive = nextKey === k;
        
        let iqamahTimeStr = '--:--';
        if (isIqamah && times) {
            const delay = mosqueData.iqamahDelays[k as keyof typeof mosqueData.iqamahDelays] || 10;
            const iqTime = new Date(times[k].getTime() + delay * 60000);
            iqamahTimeStr = fmt(iqTime);
        }

        return (
          <div key={k} className={`prayer-box ${isActive ? 'active' : ''}`} id={`box-${k}`}>
            <div className="prayer-label">{prayerNames[k]}</div>
            <div className="prayer-time" id={`time-${k}`}>
                {times ? fmt(times[k]) : '--:--'}
            </div>
            <div className="prayer-iqamah">
                {isIqamah ? (
                    <>IQAMAH <span>{iqamahTimeStr}</span></>
                ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
