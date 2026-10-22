'use client';

import { useState, useEffect } from 'react';

export function useClock() {
  const [time, setTime] = useState<{ hours: string; minutes: string; seconds: string } | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    function updateClock() {
      const date = new Date();
      setTime({
        hours: String(date.getHours()).padStart(2, '0'),
        minutes: String(date.getMinutes()).padStart(2, '0'),
        seconds: String(date.getSeconds()).padStart(2, '0'),
      });
      setNow(date);
      
      const msUntilNextSecond = 1000 - date.getMilliseconds();
      timeoutId = setTimeout(updateClock, msUntilNextSecond);
    }
    
    let timeoutId = setTimeout(updateClock, 1000 - new Date().getMilliseconds());
    updateClock(); // Initial call
    
    return () => clearTimeout(timeoutId);
  }, []);

  return { time, now };
}
