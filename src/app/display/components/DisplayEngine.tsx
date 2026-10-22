'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useMosqueData } from '@/hooks/useMosqueData';
import { useClock } from '@/hooks/useClock';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { notificationSound } from '@/lib/notification-sound';
import { HeaderBar } from './HeaderBar';
import { ClockCard } from './ClockCard';
import { HaditsBox } from './HaditsBox';
import { Slideshow } from './Slideshow';
import { PrayerBar } from './PrayerBar';
import { RunningText } from './RunningText';
import { AdzanOverlay } from './AdzanOverlay';
import { IqamahOverlay } from './IqamahOverlay';
import { ShalatOverlay } from './ShalatOverlay';

import type { PrayerKey } from '@/types/prayer';

const iqamahPrayers: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const prayerNames: Record<PrayerKey, string> = {
  imsak: 'Imsak', fajr: 'Shubuh', sunrise: 'Syuruq',
  dhuhr: 'Dzuhur', asr: 'Ashar', maghrib: 'Maghrib', isha: 'Isya'
};

function fmt(d: Date | undefined) {
    if (!d) return '--:--';
    return String(d.getHours()).padStart(2,'0') + ':' + String(d.getMinutes()).padStart(2,'0');
}

// State machine phases
type DisplayPhase = 'NORMAL' | 'PRE_ADZAN' | 'ADZAN' | 'IQAMAH' | 'SHALAT';

export default function DisplayEngine() {
  const { mosqueData, loading } = useMosqueData();
  const { now } = useClock();
  const times = usePrayerTimes(mosqueData, now);

  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [isRestMode, setIsRestMode] = useState(false);
  const [hideCountdown, setHideCountdown] = useState(false);

  // Stable callback for Slideshow
  const handleSlideChange = useCallback((isCustom: boolean) => {
    setHideCountdown(prev => (prev !== isCustom ? isCustom : prev));
  }, []);

  // State machine
  const [phase, setPhase] = useState<DisplayPhase>('NORMAL');
  const [activePrayer, setActivePrayer] = useState({ name: '', timeString: '', key: '' });

  // Countdown State (for normal mode)
  const [nextPrayerName, setNextPrayerName] = useState('Dzuhur');
  const [countdownText, setCountdownText] = useState('-00:00:00');
  
  // Pre-adzan countdown text
  const [preAdzanTimer, setPreAdzanTimer] = useState('00:00');

  // Adzan countdown text
  const [adzanTimer, setAdzanTimer] = useState('00:00');

  // Iqamah countdown text
  const [iqamahTimer, setIqamahTimer] = useState('00:00');

  // Shalat friday mode
  const [isFridayShalat, setIsFridayShalat] = useState(false);

  // Refs for timers
  const adzanTriggeredRef = useRef(false);
  const preAdzanBeeped = useRef(false);
  const adzanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const iqamahIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const shalatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const testTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const testIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isTestModeRef = useRef<boolean>(false);

  // Cleanup all timers
  const clearAllTimers = useCallback(() => {
    if (adzanIntervalRef.current) { clearInterval(adzanIntervalRef.current); adzanIntervalRef.current = null; }
    if (iqamahIntervalRef.current) { clearInterval(iqamahIntervalRef.current); iqamahIntervalRef.current = null; }
    if (shalatTimeoutRef.current) { clearTimeout(shalatTimeoutRef.current); shalatTimeoutRef.current = null; }
    if (testTimeoutRef.current) { clearTimeout(testTimeoutRef.current); testTimeoutRef.current = null; }
    if (testIntervalRef.current) { clearInterval(testIntervalRef.current); testIntervalRef.current = null; }
  }, []);

  // Scaling logic: Mengisi 100% layar secara pas tanpa celah di atas/bawah/samping
  useEffect(() => {
    function scaleViewport() {
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;
      setScale({ x: scaleX, y: scaleY });
    }
    scaleViewport();
    window.addEventListener('resize', scaleViewport);
    return () => window.removeEventListener('resize', scaleViewport);
  }, []);

  // Theme logic
  useEffect(() => {
    if (mosqueData.theme) {
        document.documentElement.style.setProperty('--c-1', mosqueData.theme.c1 || '#1C1D37');
        document.documentElement.style.setProperty('--c-2', mosqueData.theme.c2 || '#445A79');
        document.documentElement.style.setProperty('--c-3', mosqueData.theme.c3 || '#84A2C9');
        document.documentElement.style.setProperty('--c-4', mosqueData.theme.c4 || '#D6E0EA');
        document.documentElement.style.setProperty('--c-5', mosqueData.theme.c5 || '#FFFFFF');
    }
  }, [mosqueData.theme]);

  // Audio unlock on user interaction (remote control keypress, touch, or click)
  useEffect(() => {
    const handleUnlock = () => {
      notificationSound.unlock();
      window.removeEventListener('pointerdown', handleUnlock);
      window.removeEventListener('keydown', handleUnlock);
    };
    window.addEventListener('pointerdown', handleUnlock);
    window.addEventListener('keydown', handleUnlock);
    return () => {
      window.removeEventListener('pointerdown', handleUnlock);
      window.removeEventListener('keydown', handleUnlock);
    };
  }, []);

  // Screen Wake Lock API: Mencegah layar Smart TV / Monitor mati atau sleep
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) {}
    };
    requestWakeLock();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (wakeLock) wakeLock.release().catch(() => {});
    };
  }, []);

  // Auto-hide cursor setelah 3 detik tidak digerakkan
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleMouseMove = () => {
      document.body.style.cursor = 'default';
      clearTimeout(timer);
      timer = setTimeout(() => {
        document.body.style.cursor = 'none';
      }, 3000);
    };
    window.addEventListener('mousemove', handleMouseMove);
    timer = setTimeout(() => {
      document.body.style.cursor = 'none';
    }, 3000);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timer);
      document.body.style.cursor = 'default';
    };
  }, []);

  // ========== PHASE TRIGGERS ==========

  const startShalat = useCallback((isFriday: boolean, customDurationMin?: number) => {
    clearAllTimers();
    setPhase('SHALAT');
    setIsFridayShalat(isFriday);

    // Beeps announcing start of shalat / khutbah
    notificationSound.beep(600, 200, 200);
    setTimeout(() => notificationSound.beep(600, 200, 600), 400);

    const shalatMin = customDurationMin !== undefined ? customDurationMin : (mosqueData.shalatDurationMin || 15);
    shalatTimeoutRef.current = setTimeout(() => {
        setPhase('NORMAL');
        adzanTriggeredRef.current = false;
    }, shalatMin * 60 * 1000);
  }, [mosqueData.shalatDurationMin, clearAllTimers]);

  const startIqamah = useCallback((prayerName: string, timeString: string, prayerKey: string, customDurationSec?: number) => {
    const isFriday = new Date().getDay() === 5;
    const isDhuhr = prayerKey === 'dhuhr';
    const skipIqamah = mosqueData.fridayMode && isFriday && isDhuhr;

    if (skipIqamah) {
        startShalat(true);
        return;
    }

    clearAllTimers();
    const iqMin = mosqueData.iqamahDelays[prayerKey as keyof typeof mosqueData.iqamahDelays] || 10;
    let remaining = customDurationSec !== undefined ? customDurationSec : iqMin * 60;

    setPhase('IQAMAH');
    setActivePrayer({ name: prayerName, timeString, key: prayerKey });
    setIqamahTimer(`${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`);

    iqamahIntervalRef.current = setInterval(() => {
        remaining--;
        
        // Final countdown beeps (5, 4, 3, 2, 1)
        if (remaining <= 5 && remaining > 0) {
            notificationSound.beep(550, 100, 150);
        }

        if (remaining <= 0) {
            if (iqamahIntervalRef.current) {
                clearInterval(iqamahIntervalRef.current);
                iqamahIntervalRef.current = null;
            }
            startShalat(false);
            return;
        }
        setIqamahTimer(`${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`);
    }, 1000);
  }, [mosqueData.iqamahDelays, mosqueData.fridayMode, clearAllTimers, startShalat]);

  const startAdzan = useCallback((prayerName: string, timeString: string, prayerKey: string, customDurationSec?: number) => {
    clearAllTimers();
    setPhase('ADZAN');
    setActivePrayer({ name: prayerName, timeString, key: prayerKey });

    // Sound alert for Adzan
    notificationSound.playAdzan();

    const adzanSec = customDurationSec !== undefined ? customDurationSec : (mosqueData.adzanDelaySec || 180);
    let remaining = adzanSec;
    const m = String(Math.floor(remaining / 60)).padStart(2, '0');
    const s = String(remaining % 60).padStart(2, '0');
    setAdzanTimer(`${m}:${s}`);

    adzanIntervalRef.current = setInterval(() => {
        remaining--;
        if (remaining <= 0) {
            if (adzanIntervalRef.current) {
                clearInterval(adzanIntervalRef.current);
                adzanIntervalRef.current = null;
            }
            startIqamah(prayerName, timeString, prayerKey);
            return;
        }
        const rm = String(Math.floor(remaining / 60)).padStart(2, '0');
        const rs = String(remaining % 60).padStart(2, '0');
        setAdzanTimer(`${rm}:${rs}`);
    }, 1000);
  }, [mosqueData.adzanDelaySec, clearAllTimers, startIqamah]);

  // ========== TEST / SIMULATION LISTENER ==========
  useEffect(() => {
    const processTestAction = (action: { phase: string; duration?: number }) => {
      const dur = action.duration || 10;
      clearAllTimers();

      if (action.phase === 'PRE_ADZAN') {
        isTestModeRef.current = true;
        setPhase('PRE_ADZAN');
        setActivePrayer({ name: 'Maghrib (Tes)', timeString: '17:45', key: 'maghrib' });
        let rem = dur;
        setPreAdzanTimer(`00:${String(rem).padStart(2, '0')}`);
        notificationSound.beep(500, 100, 200);

        testIntervalRef.current = setInterval(() => {
          rem--;
          if (rem <= 0) {
            clearAllTimers();
            setPhase('NORMAL');
            isTestModeRef.current = false;
          } else {
            setPreAdzanTimer(`00:${String(rem).padStart(2, '0')}`);
          }
        }, 1000);
      } else if (action.phase === 'ADZAN') {
        isTestModeRef.current = true;
        setPhase('ADZAN');
        setActivePrayer({ name: 'Maghrib (Tes)', timeString: '17:45', key: 'maghrib' });
        notificationSound.playAdzan();
        let rem = dur;
        setAdzanTimer(`00:${String(rem).padStart(2, '0')}`);

        testIntervalRef.current = setInterval(() => {
          rem--;
          if (rem <= 0) {
            clearAllTimers();
            setPhase('NORMAL');
            isTestModeRef.current = false;
          } else {
            setAdzanTimer(`00:${String(rem).padStart(2, '0')}`);
          }
        }, 1000);
      } else if (action.phase === 'IQAMAH') {
        isTestModeRef.current = true;
        setPhase('IQAMAH');
        setActivePrayer({ name: 'Maghrib (Tes)', timeString: '17:45', key: 'maghrib' });
        let rem = dur;
        setIqamahTimer(`00:${String(rem).padStart(2, '0')}`);

        testIntervalRef.current = setInterval(() => {
          rem--;
          if (rem <= 5 && rem > 0) {
            notificationSound.beep(550, 100, 150);
          }
          if (rem <= 0) {
            clearAllTimers();
            setPhase('NORMAL');
            isTestModeRef.current = false;
          } else {
            setIqamahTimer(`00:${String(rem).padStart(2, '0')}`);
          }
        }, 1000);
      } else if (action.phase === 'SHALAT') {
        isTestModeRef.current = true;
        setPhase('SHALAT');
        setIsFridayShalat(false);
        notificationSound.beep(600, 200, 200);
        setTimeout(() => notificationSound.beep(600, 200, 600), 400);

        testTimeoutRef.current = setTimeout(() => {
          clearAllTimers();
          setPhase('NORMAL');
          isTestModeRef.current = false;
        }, dur * 1000);
      } else if (action.phase === 'NORMAL') {
        clearAllTimers();
        isTestModeRef.current = false;
        setPhase('NORMAL');
        adzanTriggeredRef.current = false;
      } else if (action.phase === 'BEEP') {
        notificationSound.playAdzan();
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'adzan_test_action' && e.newValue) {
        try {
          processTestAction(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };

    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        bc = new BroadcastChannel('adzan_sync');
        bc.onmessage = (e) => {
          if (e.data && e.data.type === 'adzan_test_action') {
            processTestAction(e.data.payload);
          }
        };
      } catch (err) {}
    }

    // Check initial test action from localStorage if still valid
    const saved = localStorage.getItem('adzan_test_action');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.ts && (Date.now() - parsed.ts) < ((parsed.duration || 10) * 1000)) {
          const remainingSec = Math.max(1, (parsed.duration || 10) - Math.floor((Date.now() - parsed.ts) / 1000));
          processTestAction({ ...parsed, duration: remainingSec });
        }
      } catch (err) {}
    }

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      if (bc) bc.close();
    };
  }, [clearAllTimers]);

  // ========== MAIN CLOCK LOOP ==========
  useEffect(() => {
    if (!now) return;
    if (isTestModeRef.current) return; // Lindungi pengujian agar tidak di-overwrite jam asli!

    // Rest Mode
    if (mosqueData.restMode?.enabled) {
        const currentMins = now.getHours() * 60 + now.getMinutes();
        const parseMins = (str: string) => { const p = str.split(':'); return parseInt(p[0])*60 + parseInt(p[1]); };
        const startMins = parseMins(mosqueData.restMode.start);
        const endMins = parseMins(mosqueData.restMode.end);
        let rest = false;
        if (startMins > endMins) {
            if (currentMins >= startMins || currentMins < endMins) rest = true;
        } else {
            if (currentMins >= startMins && currentMins < endMins) rest = true;
        }
        setIsRestMode(rest);
    } else {
        setIsRestMode(false);
    }

    // Only process prayer logic if in NORMAL or PRE_ADZAN phase
    if (phase !== 'NORMAL' && phase !== 'PRE_ADZAN') return;

    if (times) {
        const adzanEntries = iqamahPrayers.map(k => ({ key: k, name: prayerNames[k], time: times[k] })).sort((a,b) => a.time.getTime() - b.time.getTime());
        
        // Find the next prayer that hasn't been fully processed yet
        let next: typeof adzanEntries[0] | null = null;
        for (const entry of adzanEntries) {
            const diffMs = entry.time.getTime() - now.getTime();
            const diffSec = Math.floor(diffMs / 1000);
            
            // If prayer time hasn't passed yet, this is the next one
            if (diffSec > 0) {
                next = entry;
                break;
            }
            
            // If prayer time just passed (within 5 seconds) and we haven't triggered adzan yet
            if (diffSec >= -5 && !adzanTriggeredRef.current) {
                next = entry;
                break;
            }
        }

        if (!next) {
            // All prayers for today have passed -> countdown to tomorrow's Shubuh
            const tomorrowFajr = new Date(times.fajr.getTime() + 24 * 60 * 60 * 1000);
            const diffMs = tomorrowFajr.getTime() - now.getTime();
            const absDiffSec = Math.max(0, Math.floor(diffMs / 1000));
            const h = String(Math.floor(absDiffSec / 3600)).padStart(2, '0');
            const m = String(Math.floor((absDiffSec % 3600) / 60)).padStart(2, '0');
            const s = String(absDiffSec % 60).padStart(2, '0');

            setNextPrayerName('Shubuh');
            setCountdownText(`-${h}:${m}:${s}`);
            if (phase === 'PRE_ADZAN') setPhase('NORMAL');
            return;
        }

        const diffMs = next.time.getTime() - now.getTime();
        const diffSec = Math.floor(diffMs / 1000);
        
        setNextPrayerName(next.name);

        // Calculate countdown text
        const absDiffSec = Math.max(0, diffSec);
        const h = String(Math.floor(absDiffSec / 3600)).padStart(2, '0');
        const m = String(Math.floor((absDiffSec % 3600) / 60)).padStart(2, '0');
        const s = String(absDiffSec % 60).padStart(2, '0');
        setCountdownText(`-${h}:${m}:${s}`);

        // === 1. PRE_ADZAN: X detik sebelum adzan (default 60s / 1 menit) ===
        const preAdzanSec = mosqueData.preAdzanSec || 60;
        if (diffSec > 0 && diffSec <= preAdzanSec) {
            if (phase !== 'PRE_ADZAN') {
                setPhase('PRE_ADZAN');
                setActivePrayer({ name: next.name, timeString: fmt(next.time), key: next.key });
            }
            setPreAdzanTimer(`${m}:${s}`);
            
            // Beep once when entering pre-adzan warning
            if (!preAdzanBeeped.current) {
                preAdzanBeeped.current = true;
                notificationSound.beep(500, 100, 150);
            }
        } else if (diffSec > preAdzanSec) {
            // Normal mode, not yet pre-adzan
            if (phase === 'PRE_ADZAN') setPhase('NORMAL');
            preAdzanBeeped.current = false;
        }

        // === 2. Waktu sholat tiba → Mulai Layar ADZAN (default 180s / 3 menit) ===
        if (diffSec <= 0 && !adzanTriggeredRef.current) {
            adzanTriggeredRef.current = true;
            preAdzanBeeped.current = false;
            startAdzan(next.name, fmt(next.time), next.key);
        }
    }
  }, [now, mosqueData, times, phase, startAdzan]);

  if (loading) return null;

  const containerStyle = {
    transform: `scale(${scale.x}, ${scale.y})`,
    transformOrigin: 'top left',
    width: '1920px',
    height: '1080px',
    position: 'absolute' as const,
    top: 0,
    left: 0
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `body { ${isRestMode ? 'background: #000 !important; color: #000 !important;' : ''} }`}} />
      <div 
        id="normal-mode" 
        className={`app-container ${isRestMode ? 'rest-mode' : ''}`} 
        style={containerStyle}
      >
        <HeaderBar />

        <main className="body-content">
            <div className="left-col">
                <ClockCard 
                  nextPrayerName={nextPrayerName} 
                  countdownText={countdownText} 
                  isPreAdzan={phase === 'PRE_ADZAN'} 
                />
                <HaditsBox nextPrayerName={nextPrayerName} />
            </div>
            <div className="right-col">
                <Slideshow onSlideChange={handleSlideChange} />
                <div className="countdown-float" style={{ display: hideCountdown ? 'none' : 'flex' }}>
                    <div className="countdown-label">Menuju <span id="next-prayer-name-float">{nextPrayerName}</span></div>
                    <div id="countdown-float" className={`countdown-value ${phase === 'PRE_ADZAN' ? 'pre-adzan-blink' : ''}`}>
                        {countdownText}
                    </div>
                </div>
            </div>
        </main>

        <PrayerBar />
        <RunningText />
      </div>

      {/* 1. Pre-Adzan: Hitung mundur menuju adzan */}
      <IqamahOverlay 
        show={phase === 'PRE_ADZAN'}
        mosqueName={mosqueData.mosqueName}
        title="Menuju Adzan"
        prayerName={activePrayer.name}
        timeString=""
        timezone={mosqueData.timezone || 'WIB'}
        timerText={preAdzanTimer}
        subtitle="Bersiaplah untuk menunaikan ibadah shalat"
      />

      {/* 2. Adzan: Layar Peringatan Adzan */}
      <AdzanOverlay 
        show={phase === 'ADZAN'}
        mosqueName={mosqueData.mosqueName}
        prayerName={activePrayer.name}
        timeString={activePrayer.timeString}
        timezone={mosqueData.timezone || 'WIB'}
        timerText={adzanTimer}
      />

      {/* 3. Iqamah: Hitung mundur menuju iqamah */}
      <IqamahOverlay 
        show={phase === 'IQAMAH'}
        mosqueName={mosqueData.mosqueName}
        title="Menuju Iqomah"
        prayerName={activePrayer.name}
        timeString={activePrayer.timeString}
        timezone={mosqueData.timezone || 'WIB'}
        timerText={iqamahTimer}
        subtitle="Luruskan dan rapatkan shaf"
      />

      {/* 4. Shalat: Layar hitam harap tenang */}
      <ShalatOverlay 
        show={phase === 'SHALAT'}
        isFriday={isFridayShalat}
      />
    </>
  );
}
