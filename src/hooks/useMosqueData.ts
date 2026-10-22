'use client';

import { useState, useEffect } from 'react';
import { onMosqueDataSnapshot, defaultMosqueData } from '../lib/firestore';
import type { MosqueData } from '../types/mosque';

export function useMosqueData() {
  const [mosqueData, setMosqueData] = useState<MosqueData>(defaultMosqueData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const cached = localStorage.getItem('mosqueData_v2');
      if (cached) {
        setMosqueData(JSON.parse(cached));
        setLoading(false);
      }
    } catch (e) {
      // ignore
    }

    // Fallback: if Firebase is totally offline and we have no cache, still show default after 2s
    const fallbackTimeout = setTimeout(() => {
        setLoading(false);
    }, 2000);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'mosqueData_v2' && e.newValue) {
        setMosqueData(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);

    const unsubscribe = onMosqueDataSnapshot((data) => {
      setMosqueData((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(data)) {
          return prev;
        }
        return data;
      });
      setLoading(false);
      try {
        localStorage.setItem('mosqueData_v2', JSON.stringify(data));
      } catch (e) {}
    });

    return () => {
        clearTimeout(fallbackTimeout);
        unsubscribe();
        window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return { mosqueData, loading };
}
