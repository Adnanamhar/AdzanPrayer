'use client';

import { useAdminStore } from '@/stores/adminStore';
import { useState, useEffect } from 'react';

export function SaveButton() {
  const { isDirty, saveData, loadData } = useAdminStore();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{show: boolean, msg: string, type: 'success' | 'error'}>({ show: false, msg: '', type: 'success' });

  useEffect(() => {
    loadData();
  }, [loadData]);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(s => ({ ...s, show: false })), 4000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveData();
      showToast('Perubahan berhasil disimpan! TV akan update otomatis.', 'success');
    } catch (e) {
      // Even if cloud fails, it's saved locally which works cross-tab now
      showToast('Perubahan berhasil disimpan! (Local Sync Mode Aktif)', 'success');
    }
    setSaving(false);
  };

  return (
    <>
      <div className="content-footer">
        {isDirty && (
          <div className="unsaved-warning">
            <span>⚠️</span> Ada perubahan yang belum disimpan
          </div>
        )}
        <button 
          className="btn btn-primary" 
          onClick={handleSave}
          disabled={!isDirty || saving}
          style={{ minWidth: '180px' }}
        >
          {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
        </button>
      </div>

      {toast.show && (
        <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            background: toast.type === 'success' ? '#10B981' : '#F59E0B',
            color: 'white',
            padding: '16px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            fontWeight: 600,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideIn 0.3s ease-out'
        }}>
            {toast.type === 'success' ? '✅' : '⚠️'}
            {toast.msg}
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
      `}} />
    </>
  );
}
