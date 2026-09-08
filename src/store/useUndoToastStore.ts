import { create } from 'zustand';

export interface UndoToastItem {
  id: string;
  messageAr: string;
  messageEn: string;
  onUndo: () => void;
  timestamp: number;
}

interface UndoToastState {
  currentToast: UndoToastItem | null;
  showUndoToast: (toast: { messageAr: string; messageEn: string; onUndo: () => void }) => void;
  dismissUndoToast: () => void;
  triggerUndo: () => void;
}

export const useUndoToastStore = create<UndoToastState>((set, get) => ({
  currentToast: null,

  showUndoToast: ({ messageAr, messageEn, onUndo }) => {
    const id = Date.now().toString();
    set({
      currentToast: {
        id,
        messageAr,
        messageEn,
        onUndo,
        timestamp: Date.now(),
      },
    });
  },

  dismissUndoToast: () => {
    set({ currentToast: null });
  },

  triggerUndo: () => {
    const toast = get().currentToast;
    if (toast) {
      toast.onUndo();
      set({ currentToast: null });
    }
  },
}));
