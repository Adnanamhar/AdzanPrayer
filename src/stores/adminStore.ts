import { create } from 'zustand';
import { defaultMosqueData, getMosqueData, saveMosqueData } from '../lib/firestore';
import type { MosqueData } from '../types/mosque';

interface AdminState {
  data: MosqueData;
  isDirty: boolean;
  isLoading: boolean;
  updateData: (newData: Partial<MosqueData>) => void;
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  data: defaultMosqueData,
  isDirty: false,
  isLoading: true,
  updateData: (newData) => {
    set((state) => ({
      data: { ...state.data, ...newData },
      isDirty: true
    }));
  },
  loadData: async () => {
    set({ isLoading: true });
    
    // Quick fallback from localStorage first
    try {
        const cached = localStorage.getItem('mosqueData_v2');
        if (cached) set({ data: JSON.parse(cached), isLoading: false });
    } catch (e) {}

    try {
      // Setup a race condition to prevent hanging if firestore fails silently
      const fetchedData = await Promise.race([
          getMosqueData(),
          new Promise<MosqueData | null>((_, reject) => setTimeout(() => reject(new Error('Timeout fetching data')), 5000))
      ]);
      
      if (fetchedData) {
          set({ data: fetchedData, isLoading: false, isDirty: false });
          try { localStorage.setItem('mosqueData_v2', JSON.stringify(fetchedData)); } catch (e) {}
      } else {
          // If firebase returns null (empty or error), rely completely on the cached data already set
          set({ isLoading: false, isDirty: false });
      }
    } catch (e) {
      console.warn("Using offline/cached data due to fetch error:", e);
      set({ isLoading: false }); // Fallback to cached
    }
  },
  saveData: async () => {
    const { data } = get();
    // 1. INSTANT LOCAL SAVE (This triggers the cross-tab sync instantly!)
    try { localStorage.setItem('mosqueData_v2', JSON.stringify(data)); } catch (err) {}
    set({ isDirty: false });

    // 2. FIRE AND FORGET CLOUD SAVE
    // We do not await this, so the UI never blocks.
    saveMosqueData(data).catch(e => {
        console.warn("Background cloud save failed:", e);
    });
  }
}));
