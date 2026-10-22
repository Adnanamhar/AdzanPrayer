'use client';

import { useState, useRef, useEffect } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { NumberStepper } from '../components/NumberStepper';
import { notificationSound } from '@/lib/notification-sound';

export default function IqamahPage() {
  const { data, updateData, isLoading } = useAdminStore();
  const [activeTest, setActiveTest] = useState<string>('');
  const [testCountdown, setTestCountdown] = useState<number>(0);
  const testTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (testTimerRef.current) clearInterval(testTimerRef.current);
    };
  }, []);

  if (isLoading) return <div>Memuat data...</div>;

  const handleIqamahChange = (prayer: string, value: number) => {
    updateData({
      iqamahDelays: {
        ...data.iqamahDelays,
        [prayer]: Math.max(0, value)
      }
    });
  };

  const triggerTest = (phase: string, durationSec = 10, label = '') => {
    if (testTimerRef.current) {
      clearInterval(testTimerRef.current);
      testTimerRef.current = null;
    }

    // Mainkan suara langsung di admin page untuk feedback instan
    if (phase === 'BEEP') {
      notificationSound.playAdzan();
      setActiveTest('Alarm Beep Berbunyi');
      setTimeout(() => setActiveTest(''), 3000);
    } else if (phase === 'PRE_ADZAN') {
      notificationSound.beep(500, 100, 200);
    } else if (phase === 'ADZAN') {
      notificationSound.playAdzan();
    } else if (phase === 'SHALAT') {
      notificationSound.beep(600, 200, 200);
      setTimeout(() => notificationSound.beep(600, 200, 600), 400);
    }

    // Broadcast ke layar TV via localStorage dan BroadcastChannel
    const payload = { phase, duration: durationSec, ts: Date.now() };
    localStorage.setItem('adzan_test_action', JSON.stringify(payload));
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('adzan_sync');
        bc.postMessage({ type: 'adzan_test_action', payload });
        bc.close();
      } catch (err) {}
    }

    if (phase === 'NORMAL') {
      setActiveTest('');
      setTestCountdown(0);
      return;
    }

    if (phase !== 'BEEP') {
      setActiveTest(label);
      setTestCountdown(durationSec);

      let rem = durationSec;
      testTimerRef.current = setInterval(() => {
        rem--;
        if (rem <= 0) {
          if (testTimerRef.current) clearInterval(testTimerRef.current);
          setActiveTest('');
          setTestCountdown(0);
        } else {
          setTestCountdown(rem);
        }
      }, 1000);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="card-title">Pengaturan Waktu & Jeda</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Peringatan Masuk Waktu (Pra-Adzan / Detik)</label>
            <div style={{ maxWidth: '200px' }}>
              <NumberStepper 
                value={data.preAdzanSec || 60} 
                onChange={(val) => updateData({ preAdzanSec: Math.max(10, val) })}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
              Hitung mundur dan bunyi beep sebelum adzan berkumandang (default: 60 detik / 1 menit).
            </p>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Durasi Waktu Adzan (Detik)</label>
            <div style={{ maxWidth: '200px' }}>
              <NumberStepper 
                value={data.adzanDelaySec || 180} 
                onChange={(val) => updateData({ adzanDelaySec: Math.max(30, val) })}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
              Lama layar peringatan adzan sebelum masuk ke hitung mundur iqamah (default: 180 detik / 3 menit).
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Jeda Waktu Menuju Iqamah (Menit)</div>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>Waktu jeda antara adzan selesai hingga iqamah dikumandangkan untuk setiap waktu shalat.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '24px' }}>
          {['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'].map((p) => {
            const labels: Record<string, string> = {
              fajr: 'Shubuh',
              dhuhr: 'Dzuhur',
              asr: 'Ashar',
              maghrib: 'Maghrib',
              isha: 'Isya'
            };
            return (
              <div className="form-group" style={{ marginBottom: 0 }} key={p}>
                <label className="form-label">{labels[p]}</label>
                <NumberStepper 
                  value={data.iqamahDelays[p as keyof typeof data.iqamahDelays] || 10} 
                  onChange={(val) => handleIqamahChange(p, val)}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Pengaturan Khusus Shalat</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Durasi Layar Gelap Shalat (Menit)</label>
            <div style={{ maxWidth: '200px' }}>
              <NumberStepper 
                value={data.shalatDurationMin || 15} 
                onChange={(val) => updateData({ shalatDurationMin: Math.max(5, val) })}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#64748B', marginTop: '6px' }}>
              Layar TV akan otomatis mati/gelap saat shalat berjamaah berlangsung.
            </p>
          </div>

          <div className="form-group" style={{ marginBottom: 0, display: 'flex', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginTop: '16px', fontWeight: 600 }}>
              <input 
                type="checkbox" 
                checked={data.fridayMode !== false}
                onChange={(e) => updateData({ fridayMode: e.target.checked })}
                style={{ width: '20px', height: '20px' }}
              />
              <span>Aktifkan Mode Khusus Sholat Jumat (Tanpa Iqamah saat Dzuhur)</span>
            </label>
          </div>
        </div>
      </div>

      {/* UJI COBA & SIMULASI CARD */}
      <div className="card" style={{ background: '#F8FAFC', border: '2px solid #E2E8F0' }}>
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <span>🧪 Uji Coba & Simulasi Layar TV Langsung</span>
          {activeTest ? (
            <span style={{ fontSize: '13px', background: '#DCFCE7', color: '#166534', padding: '4px 12px', borderRadius: '8px', fontWeight: 700, border: '1px solid #86EFAC' }}>
              ⏳ {activeTest} {testCountdown > 0 ? `(${testCountdown}s)` : ''}
            </span>
          ) : (
            <span style={{ fontSize: '12px', background: '#DBEAFE', color: '#1E40AF', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
              Sinkron Instan ke Layar TV
            </span>
          )}
        </div>
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
          Uji coba suara alarm beep dan tampilan fase layar TV (Pre-Adzan, Adzan, Iqamah, Shalat) selama 10 detik tanpa harus menunggu waktu shalat sebenarnya.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <button 
            type="button" 
            className="btn" 
            style={{ background: '#F3E8FF', color: '#7E22CE', border: '1px solid #D8B4FE', fontWeight: 600 }}
            onClick={() => triggerTest('BEEP', 0, 'Tes Alarm Beep')}
          >
            🔔 Tes Bunyi Alarm
          </button>

          <button 
            type="button" 
            className="btn" 
            style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #FCD34D', fontWeight: 600 }}
            onClick={() => triggerTest('PRE_ADZAN', 10, 'Tes Pra-Adzan')}
          >
            ⏳ Tes Pra-Adzan (10s)
          </button>

          <button 
            type="button" 
            className="btn" 
            style={{ background: '#DCFCE7', color: '#15803D', border: '1px solid #86EFAC', fontWeight: 600 }}
            onClick={() => triggerTest('ADZAN', 10, 'Tes Layar Adzan')}
          >
            🕌 Tes Layar Adzan (10s)
          </button>

          <button 
            type="button" 
            className="btn" 
            style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #93C5FD', fontWeight: 600 }}
            onClick={() => triggerTest('IQAMAH', 10, 'Tes Timer Iqamah')}
          >
            ⏲️ Tes Timer Iqamah (10s)
          </button>

          <button 
            type="button" 
            className="btn" 
            style={{ background: '#F1F5F9', color: '#334155', border: '1px solid #CBD5E1', fontWeight: 600 }}
            onClick={() => triggerTest('SHALAT', 10, 'Tes Layar Shalat')}
          >
            🕋 Tes Layar Shalat (10s)
          </button>

          <button 
            type="button" 
            className="btn" 
            style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FCA5A5', fontWeight: 600 }}
            onClick={() => triggerTest('NORMAL', 0, 'Reset Layar Normal')}
          >
            ⏹️ Reset Layar Normal
          </button>
        </div>
      </div>
    </div>
  );
}
