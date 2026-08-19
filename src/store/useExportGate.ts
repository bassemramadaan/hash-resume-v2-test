import { create } from 'zustand';

export type ExportIntent = {
  execute: () => Promise<void> | void;
  source: string;
};

type ExportGateState = {
  pendingIntent: ExportIntent | null;
  requestExport: (intent: ExportIntent) => void;
  grantAndConsumeExport: () => Promise<void>;
  cancelExport: () => void;
};

export const useExportGate = create<ExportGateState>((set, get) => ({
  pendingIntent: null,
  requestExport: (intent) => {
    // We set the pending intent. The components that trigger this should also open the PaymentModal (ActivationModal), 
    // or we could trigger opening the modal from here. Let's just store the intent here.
    set({ pendingIntent: intent });
  },
  grantAndConsumeExport: async () => {
    const { pendingIntent } = get();
    if (pendingIntent) {
      try {
        await pendingIntent.execute();
      } catch (err) {
        console.error('Export failed:', err);
      } finally {
        set({ pendingIntent: null });
      }
    }
  },
  cancelExport: () => {
    set({ pendingIntent: null });
  }
}));
