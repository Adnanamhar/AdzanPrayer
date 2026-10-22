'use client';

import { useState, useEffect } from 'react';
import { useAdminStore } from '@/stores/adminStore';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { data, loadData } = useAdminStore();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadData();
    const isAuth = sessionStorage.getItem('admin_authenticated');
    setAuthed(isAuth === 'true');
  }, [loadData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = data.adminPin || '1234';
    if (pinInput === correctPin) {
      sessionStorage.setItem('admin_authenticated', 'true');
      setAuthed(true);
      setErrorMsg('');
    } else {
      setErrorMsg('PIN salah. Default: 1234');
    }
  };

  if (authed === null) return null;

  if (!authed) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '20px'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '40px 32px',
          width: '100%',
          maxWidth: '400px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔐</div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
            Akses Admin TV Masjid
          </h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>
            Masukkan PIN Takmir untuk mengelola pengaturan dan jadwal masjid.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <input 
                type="password" 
                maxLength={10}
                placeholder="••••" 
                value={pinInput}
                autoFocus
                onChange={(e) => setPinInput(e.target.value)}
                style={{
                  width: '100%',
                  fontSize: '28px',
                  letterSpacing: '8px',
                  textAlign: 'center',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: errorMsg ? '2px solid #EF4444' : '2px solid #CBD5E1',
                  outline: 'none',
                  fontWeight: 700,
                  boxSizing: 'border-box'
                }}
              />
              {errorMsg && (
                <div style={{ color: '#DC2626', fontSize: '13px', marginTop: '8px', fontWeight: 600 }}>
                  {errorMsg}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '15px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700 }}
            >
              Buka Dashboard
            </button>
          </form>

          <div style={{ marginTop: '20px', fontSize: '12px', color: '#94A3B8' }}>
            PIN Bawaan: <strong>1234</strong> (Dapat diubah di menu Pengaturan)
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
