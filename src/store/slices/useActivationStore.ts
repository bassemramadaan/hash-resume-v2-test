import { create } from 'zustand';
import { ActivationState } from '../../types/resume';
import {
  calculateResumeFingerprint,
  validateResumeLockState,
  isResumeBlank,
  clearDownloadCompletionFlags,
  STORAGE_KEY_RESUME_FINGERPRINT,
} from '../../utils/resumeFingerprint';
import {
  loadSavedActivation,
  saveActivationDirectly,
} from '../../utils/resumeStorage';
import { initialResume } from './useResumeDataStore';

export const defaultActivation: ActivationState = {
  isActivated: false,
  activatedCode: null,
  remainingDownloads: 0,
  planType: 'free_preview',
  activatedAt: null,
};

export const initialActivation = loadSavedActivation(initialResume, defaultActivation);

export interface ActivationStoreState {
  activation: ActivationState;

  activatePlan: (
    code: string,
    planType: ActivationState['planType'],
    downloads: number,
    keepModalOpen?: boolean
  ) => void;
  addDownloads: (count: number) => void;
  useDownloadQuota: () => boolean;
  lockResume: (reference?: string) => void;
  lockResumeForEdits: () => void;
  unlockResumeWithCredit: () => boolean;
  unlockResumeWithNewApproval: () => void;
}

export const createActivationSlice = (set: any, get: any): ActivationStoreState => ({
  activation: initialActivation,

  activatePlan: (code, planType, downloads, keepModalOpen = false) => {
    set((state: any) => {
      const updatedActivation: ActivationState = {
        ...state.activation,
        isActivated: true,
        activatedCode: code,
        remainingDownloads: downloads,
        planType: planType,
        activatedAt: new Date().toISOString(),
      };
      saveActivationDirectly(updatedActivation);
      return { activation: updatedActivation, isActivationModalOpen: keepModalOpen ? true : false };
    });
  },

  addDownloads: (count) => {
    set((state: any) => {
      const currentDownloads = state.activation.isActivated ? state.activation.remainingDownloads : 0;
      const updatedActivation: ActivationState = {
        ...state.activation,
        isActivated: true,
        activatedCode: state.activation.activatedCode || 'PURCHASED-CREDITS',
        remainingDownloads: currentDownloads + count,
        planType: count > 1 ? 'bundle_3' : 'single',
        activatedAt: state.activation.activatedAt || new Date().toISOString(),
      };
      saveActivationDirectly(updatedActivation);
      return { activation: updatedActivation };
    });
  },

  useDownloadQuota: () => {
    const state = get();
    if (!state.activation || !state.activation.isActivated) {
      return false;
    }

    if (state.activation.remainingDownloads > 0) {
      const newRemaining = state.activation.remainingDownloads - 1;
      const updatedActivation: ActivationState = {
        ...state.activation,
        remainingDownloads: newRemaining,
      };
      saveActivationDirectly(updatedActivation);
      set({ activation: updatedActivation });
      return true;
    }

    return false;
  },

  lockResume: (reference?: string) => {
    const state = get();
    const resumeData = state.resumeData;
    if (!resumeData) return;
    const fingerprint = calculateResumeFingerprint(resumeData);
    if (!fingerprint || isResumeBlank(resumeData)) {
      clearDownloadCompletionFlags();
      return;
    }
    let currentRef = reference || state.activation.verifiedReference || null;
    if (!currentRef && typeof window !== 'undefined') {
      try {
        currentRef =
          (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('verified_reference') : null) ||
          (typeof localStorage !== 'undefined' ? localStorage.getItem('verified_reference') : null) ||
          (typeof localStorage !== 'undefined' ? localStorage.getItem('payment_reference') : null);
      } catch {
        // Storage restricted
      }
    }

    set((s: any) => {
      const updatedActivation: ActivationState = {
        ...s.activation,
        isResumeLocked: true,
        lockedResumeFingerprint: fingerprint,
        verifiedReference: currentRef || s.activation.verifiedReference || null,
      };
      saveActivationDirectly(updatedActivation);
      if (typeof window !== 'undefined') {
        try {
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem("resume_download_completed", "true");
            sessionStorage.setItem(STORAGE_KEY_RESUME_FINGERPRINT, fingerprint);
            if (currentRef) sessionStorage.setItem("verified_reference", currentRef);
          }
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem("resume_download_completed", "true");
            localStorage.setItem(STORAGE_KEY_RESUME_FINGERPRINT, fingerprint);
            if (currentRef) localStorage.setItem("verified_reference", currentRef);
          }
        } catch {
          // Storage restricted
        }
      }
      return { activation: updatedActivation };
    });
  },

  lockResumeForEdits: () => {
    const state = get();
    const resumeData = state.resumeData;
    if (!resumeData) return;
    const { isValid } = validateResumeLockState(state.activation, resumeData);
    if (isValid) {
      get().lockResume();
    } else {
      clearDownloadCompletionFlags();
      if (state.activation.isResumeLocked) {
        set((s: any) => {
          const updatedActivation: ActivationState = {
            ...s.activation,
            isResumeLocked: false,
            lockedResumeFingerprint: null,
          };
          saveActivationDirectly(updatedActivation);
          return { activation: updatedActivation };
        });
      }
    }
  },

  unlockResumeWithCredit: () => {
    const state = get();
    if (state.activation.remainingDownloads > 0) {
      const newRemaining = state.activation.remainingDownloads - 1;
      clearDownloadCompletionFlags();
      const updatedActivation: ActivationState = {
        ...state.activation,
        remainingDownloads: newRemaining,
        isResumeLocked: false,
        lockedResumeFingerprint: null,
      };
      saveActivationDirectly(updatedActivation);
      set({ activation: updatedActivation });
      return true;
    }
    return false;
  },

  unlockResumeWithNewApproval: () => {
    clearDownloadCompletionFlags();
    set((state: any) => {
      const updatedActivation: ActivationState = {
        ...state.activation,
        isResumeLocked: false,
        lockedResumeFingerprint: null,
      };
      saveActivationDirectly(updatedActivation);
      return { activation: updatedActivation };
    });
  },
});

export const useActivationStore = create<ActivationStoreState>((set, get) =>
  createActivationSlice(set, get)
);
