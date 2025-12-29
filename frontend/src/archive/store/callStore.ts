import { create } from 'zustand';
import type { CallDataResponse } from '../types/call.types';

interface CallStore {
  callData: CallDataResponse | null;
  isLoading: boolean;
  error: string | null;
  lastUpdate: Date | null;

  setCallData: (data: CallDataResponse) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLastUpdate: (date: Date) => void;
  reset: () => void;
}

export const useCallStore = create<CallStore>((set) => ({
  callData: null,
  isLoading: false,
  error: null,
  lastUpdate: null,

  setCallData: (data) => set({ callData: data, error: null }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  setLastUpdate: (date) => set({ lastUpdate: date }),
  reset: () => set({ callData: null, isLoading: false, error: null, lastUpdate: null }),
}));
