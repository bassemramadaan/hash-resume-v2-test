import { create } from 'zustand';

export type ExportStep =
  | 'idle'
  | 'preparing_fonts'
  | 'rendering_canvas'
  | 'slicing_pages'
  | 'saving_file'
  | 'completed'
  | 'error';

interface PdfExportProgressState {
  isOpen: boolean;
  step: ExportStep;
  progressPercent: number;
  errorMessage: string | null;
  startExportProgress: () => void;
  setExportStep: (step: ExportStep, percent?: number) => void;
  setExportError: (msg: string) => void;
  completeExport: () => void;
  closeExportProgress: () => void;
}

export const usePdfExportProgressStore = create<PdfExportProgressState>((set) => ({
  isOpen: false,
  step: 'idle',
  progressPercent: 0,
  errorMessage: null,

  startExportProgress: () => {
    set({
      isOpen: true,
      step: 'preparing_fonts',
      progressPercent: 15,
      errorMessage: null,
    });
  },

  setExportStep: (step, percent) => {
    set((state) => ({
      step,
      progressPercent: percent !== undefined ? percent : state.progressPercent,
      errorMessage: null,
    }));
  },

  setExportError: (msg) => {
    set({
      step: 'error',
      errorMessage: msg,
    });
  },

  completeExport: () => {
    set({
      step: 'completed',
      progressPercent: 100,
      errorMessage: null,
    });
  },

  closeExportProgress: () => {
    set({
      isOpen: false,
      step: 'idle',
      progressPercent: 0,
      errorMessage: null,
    });
  },
}));
