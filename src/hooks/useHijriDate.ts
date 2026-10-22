'use client';

import { useState, useEffect } from 'react';
import { getHijriDate, type HijriDateData } from '../lib/hijri-converter';

export function useHijriDate(now: Date | null, offset: number = 0) {
  const [hijri, setHijri] = useState<HijriDateData | null>(null);

  useEffect(() => {
    if (!now) return;
    const target = new Date(now.getTime() + (offset || 0) * 86400000);
    
    let isMounted = true;
    getHijriDate(target).then((res) => {
      if (isMounted) setHijri(res);
    });
    
    return () => { isMounted = false; };
  }, [now?.getFullYear(), now?.getMonth(), now?.getDate(), offset]);

  return hijri;
}
