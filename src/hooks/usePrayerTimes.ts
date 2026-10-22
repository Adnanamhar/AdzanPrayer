'use client';

import { useState, useEffect, useRef } from 'react';
import { PrayerCalculator } from '../lib/prayer-calculator';
import type { MosqueData } from '../types/mosque';
import type { PrayerTimes } from '../types/prayer';

export function usePrayerTimes(mosqueData: MosqueData, now: Date | null) {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const calculatorRef = useRef<PrayerCalculator | null>(null);

  useEffect(() => {
    if (!calculatorRef.current) {
      calculatorRef.current = new PrayerCalculator(mosqueData);
    } else {
      calculatorRef.current.updateConfig(mosqueData);
    }

    if (!now) return;

    // Trigger update if it's midnight or if times are not initialized
    const isMidnight = now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0;
    
    if (!times || isMidnight) {
      let isMounted = true;
      calculatorRef.current.init(now).then(newTimes => {
        if (isMounted) setTimes(newTimes);
      });
      return () => { isMounted = false; };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mosqueData, now?.getFullYear(), now?.getMonth(), now?.getDate(), now?.getHours(), now?.getMinutes(), now?.getSeconds() === 0]);

  return times;
}
