// src/store/slices/activationSlice.ts
import { ActivationState } from '../../types/resume';
import { saveActivationDirectly } from '../../utils/resumeStorage';
import {
  calculateResumeFingerprint,
  isResumeBlank,
  STORAGE_KEY_RESUME_FINGERPRINT,
  clearDownloadCompletionFlags,
  validateResumeLockState,
} from '../../utils/resumeFingerprint';

export interface ActivationSlice {
  activation: ActivationState;
  activatePlan: (code: string, planType: ActivationState['planType'], downloads: number, keepModalOpen?: boolean) => void;
  addDownloads: (count: number) => void;
  useDownloadQuota: () => boolean;
  lockResume: (reference?: string) => void;
  lockResumeForEdits: () => void;
  unlockResumeWithCredit: () => boolean;
  unlockResumeWithNewApproval: () => void;
}

export const defaultActivation: ActivationState = {
  isActivated: false,
  activatedCode: null,
  remainingDownloads: 0,
  planType: 'free_preview',
  activatedAt: null,
};

export const createActivationSlice = (set: any, get: any): ActivationSlice => ({
  activation: defaultActivation,

  activatePlan: (code, planType, downloads, keepModalOpen = false) => {
    set((state: any) => {
      const updated: ActivationState = {
        ...state.activation,
        isActivated: true,
        activatedCode: code,
        remainingDownloads: downloads,
        planType,
        activatedAt: new Date().toISOString(),
      };
      saveActivationDirectly(updated);
      return { activation: updated, isActivationModalOpen: keepModalOpen ? true : false };
    });
  },

  addDownloads: (count) => {
    set((state: any) => {
      const currentDownloads = state.activation.isActivated ? state.activation.remainingDownloads : 0;
      const updated: ActivationState = {
        ...state.activation,
        isActivated: true,
        activatedCode: state.activation.activatedCode || 'PURCHASED-CREDITS',
        remainingDownloads: currentDownloads + count,
        planType: count > 1 ? 'bundle_3' : 'single',
        activatedAt: state.activation.activatedAt || new Date().toISOString(),
      };
      saveActivationDirectly(updated);
      return { activation: updated };
    });
  },

  useDownloadQuota: () => {
    const state = get();
    if (!state.activation?.isActivated) return false;
    if (state.activation.remainingDownloads > 0) {
      const newRemaining = state.activation.remainingDownloads - 1;
      const updated: ActivationState = { ...state.activation, remainingDownloads: newRemaining };
      saveActivationDirectly(updated);
      set({ activation: updated });
      return true;
    }
    return false;
  },

  lockResume: (reference?: string) => {
    const state = get();
    const fingerprint = calculateResumeFingerprint(state.resumeData);
    if (!fingerprint || isResumeBlank(state.resumeData)) {
      clearDownloadCompletionFlags();
      return;
    }
    const currentRef = reference || state.activation.verifiedReference || 
      (typeof window !== 'undefined' ? sessionStorage.getItem('verified_reference') || localStorage.getItem('verified_reference') || localStorage.getItem('payment_reference') : null);

    set((s: any) => {
      const updated: ActivationState = {
        ...s.activation,
        isResumeLocked: true,
        lockedResumeFingerprint: fingerprint,
        verifiedReference: currentRef || s.activation.verifiedReference || null,
      };
      saveActivationDirectly(updated);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('resume_download_completed', 'true');
        localStorage.setItem('resume_download_completed', 'true');
        sessionStorage.setItem(STORAGE_KEY_RESUME_FINGERPRINT, fingerprint);
        localStorage.setItem(STORAGE_KEY_RESUME_FINGERPRINT, fingerprint);
        if (currentRef) {
          sessionStorage.setItem('verified_reference', currentRef);
          localStorage.setItem('verified_reference', currentRef);
        }
      }
      return { activation: updated };
    });
  },

  lockResumeForEdits: () => {
    const state = get();
    const resumeData = state.resumeData;
    if (!resumeData) return;
    const { isValid } = validateResumeLockState(state.activation, resumeData);
    if (isValid) {
      const fingerprint = calculateResumeFingerprint(resumeData);
      if (
        !state.activation.isResumeLocked ||
        state.activation.lockedResumeFingerprint !== fingerprint
      ) {
        get().lockResume();
      }
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
      const updated: ActivationState = {
        ...state.activation,
        remainingDownloads: newRemaining,
        isResumeLocked: false,
        lockedResumeFingerprint: null,
      };
      saveActivationDirectly(updated);
      set({ activation: updated });
      return true;
    }
    return false;
  },

  unlockResumeWithNewApproval: () => {
    clearDownloadCompletionFlags();
    set((state: any) => {
      const updated: ActivationState = {
        ...state.activation,
        isResumeLocked: false,
        lockedResumeFingerprint: null,
      };
      saveActivationDirectly(updated);
      return { activation: updated };
    });
  },
});
