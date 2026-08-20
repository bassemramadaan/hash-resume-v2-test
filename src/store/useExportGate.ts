import { create } from 'zustand';

export type ExportIntent = {
  execute: () => Promise<void> | void;
  source: string;
};

type ExportGateState = {
  pendingIntent: ExportIntent | null;
  isAuthorized: boolean;
  authorizationToken: string | null;
  requestExport: (intent: ExportIntent) => void;
  grantAndConsumeExport: () => Promise<void>;
  cancelExport: () => void;
  verifyAuthorization: () => boolean;
};

export const useExportGate = create<ExportGateState>((set, get) => ({
  pendingIntent: null,
  isAuthorized: false,
  authorizationToken: null,
  requestExport: (intent) => {
    set({ pendingIntent: intent, isAuthorized: false, authorizationToken: null });
  },
  grantAndConsumeExport: async () => {
    const { pendingIntent } = get();
    if (pendingIntent) {
      const token = `AUTH_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      set({ isAuthorized: true, authorizationToken: token });
      try {
        await pendingIntent.execute();
      } catch (err) {
        console.error('Export failed:', err);
      } finally {
        set({ pendingIntent: null, isAuthorized: false, authorizationToken: null });
      }
    }
  },
  cancelExport: () => {
    set({ pendingIntent: null, isAuthorized: false, authorizationToken: null });
  },
  verifyAuthorization: () => {
    const { isAuthorized, authorizationToken } = get();
    return isAuthorized && !!authorizationToken;
  }
}));
