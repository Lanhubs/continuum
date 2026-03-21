import { create } from 'zustand';
import { medicalApi } from '../lib/api';
import type { MedicalRecord, ScanStatus, TrendPoint } from '../types/medical';

interface MedicalState {
  history: MedicalRecord[];
  prescriptions: MedicalRecord[];
  isLoading: boolean;
  error: string | null;
  activeScan: { id: string; status: ScanStatus } | null;
  trends: Record<string, TrendPoint[]>;

  // Actions
  fetchHistory: () => Promise<void>;
  fetchPrescriptions: () => Promise<void>;
  startInterpretation: (file: File, type?: string) => Promise<string>;
  pollScanStatus: (scanId: string) => Promise<void>;
  fetchTrends: (markerName: string) => Promise<void>;
  clearError: () => void;
}

export const useMedicalStore = create<MedicalState>((set, get) => ({
  history: [],
  prescriptions: [],
  isLoading: false,
  error: null,
  activeScan: null,
  trends: {},

  fetchHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const history = await medicalApi.getHistory();
      set({ history, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  fetchPrescriptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const prescriptions = await medicalApi.getPrescriptions();
      set({ prescriptions, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  startInterpretation: async (file, type) => {
    set({ isLoading: true, error: null });
    try {
      const { scan_id } = await medicalApi.interpret(file, type);
      set({ 
        activeScan: { id: scan_id, status: { progress: 10, status: 'Starting' } },
        isLoading: false 
      });
      return scan_id;
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
      throw err;
    }
  },

  pollScanStatus: async (scanId) => {
    try {
      const status = await medicalApi.getScanStatus(scanId);
      set({ activeScan: { id: scanId, status } });
      
      if (status.status === 'Ready' || status.status === 'Error') {
        if (status.status === 'Ready') await get().fetchHistory();
        // Clear active scan after it's finished or errored (optionally keep it for UI)
        // For now, we keep it so the UI can show the final state
      } else {
        // Continue polling if not ready
        setTimeout(() => get().pollScanStatus(scanId), 2000);
      }
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  fetchTrends: async (markerName) => {
    try {
      const { trends } = await medicalApi.getTrends(markerName);
      set((state) => ({
        trends: { ...state.trends, [markerName]: trends }
      }));
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  clearError: () => set({ error: null })
}));
