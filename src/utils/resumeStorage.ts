import { ResumeData, ResumeSettings, ActivationState } from '../types/resume';
import {
  validateResumeLockState,
  clearDownloadCompletionFlags,
} from './resumeFingerprint';

export const LOCAL_STORAGE_KEY_RESUME = 'hash_resume_data_v2';
export const LOCAL_STORAGE_KEY_SETTINGS = 'hash_resume_settings_v2';
export const LOCAL_STORAGE_KEY_ACTIVATION = 'hash_resume_activation_v2';
export const LOCAL_STORAGE_KEY_CORRUPT_BACKUP = 'hash_resume_data_corrupt_backup';

let pendingResumeData: ResumeData | null = null;
let saveDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let isLifecycleInitialized = false;

/**
 * Checks whether an object structure resembles valid ResumeData
 */
export function isValidResumeStructure(obj: any): obj is ResumeData {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    typeof obj.personalInfo === 'object' &&
    Array.isArray(obj.experiences) &&
    Array.isArray(obj.education) &&
    Array.isArray(obj.skills)
  );
}

/**
 * Loads the saved resume from localStorage.
 * If data is corrupt, backs it up safely before falling back.
 * Never deletes or resets user data based on content.
 */
export function loadSavedResume(fallback: ResumeData): { data: ResumeData; loadedFromStorage: boolean } {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedRaw = localStorage.getItem(LOCAL_STORAGE_KEY_RESUME);
      if (savedRaw && savedRaw.trim()) {
        try {
          const parsed = JSON.parse(savedRaw);
          if (parsed && typeof parsed === 'object' && parsed.personalInfo) {
            // Ensure array fields exist even if partially structured
            const normalized: ResumeData = {
              personalInfo: {
                fullName: parsed.personalInfo?.fullName || '',
                jobTitle: parsed.personalInfo?.jobTitle || '',
                email: parsed.personalInfo?.email || '',
                phone: parsed.personalInfo?.phone || '',
                location: parsed.personalInfo?.location || '',
                linkedin: parsed.personalInfo?.linkedin || '',
                github: parsed.personalInfo?.github || '',
                website: parsed.personalInfo?.website || '',
                photoUrl: parsed.personalInfo?.photoUrl || '',
                summary: parsed.personalInfo?.summary || '',
              },
              experiences: Array.isArray(parsed.experiences) ? parsed.experiences : [],
              education: Array.isArray(parsed.education) ? parsed.education : [],
              skills: Array.isArray(parsed.skills) ? parsed.skills : [],
              projects: Array.isArray(parsed.projects) ? parsed.projects : [],
              certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
              languages: Array.isArray(parsed.languages) ? parsed.languages : [],
              customSections: Array.isArray(parsed.customSections) ? parsed.customSections : [],
            };
            return { data: normalized, loadedFromStorage: true };
          }
        } catch (parseErr) {
          console.error('[ResumeStorage] Corrupt JSON detected. Creating backup...', parseErr);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY_CORRUPT_BACKUP, savedRaw);
          } catch {
            // storage quota fallback
          }
        }
      }
    }
  } catch (e) {
    console.warn('[ResumeStorage] Failed to read localStorage', e);
  }
  return { data: fallback, loadedFromStorage: false };
}

/**
 * Saves ResumeData immediately to localStorage
 */
export function saveResumeDirectly(data: ResumeData): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(data));
    pendingResumeData = null;
    if (saveDebounceTimer) {
      clearTimeout(saveDebounceTimer);
      saveDebounceTimer = null;
    }
  } catch (e) {
    console.error('[ResumeStorage] Failed to write resume to localStorage', e);
  }
}

/**
 * Schedules a debounced save of ResumeData, and guarantees pending data is ready to flush on unload.
 */
export function scheduleResumeSave(data: ResumeData, delayMs = 150): void {
  pendingResumeData = data;
  if (saveDebounceTimer) {
    clearTimeout(saveDebounceTimer);
  }
  saveDebounceTimer = setTimeout(() => {
    saveResumeDirectly(data);
  }, delayMs);
}

/**
 * Flushes any pending debounced resume data to localStorage immediately.
 */
export function flushPendingResumeSave(): void {
  if (pendingResumeData) {
    saveResumeDirectly(pendingResumeData);
  }
}

/**
 * Initializes browser lifecycle handlers:
 * - visibilitychange (when hidden)
 * - pagehide
 * - beforeunload
 */
export function initAutosaveLifecycleListeners(): void {
  if (typeof window === 'undefined' || isLifecycleInitialized) return;
  isLifecycleInitialized = true;

  const flush = () => {
    flushPendingResumeSave();
  };

  window.addEventListener('beforeunload', flush);
  window.addEventListener('pagehide', flush);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flush();
    }
  });
}

/**
 * Loads saved settings from localStorage
 */
export function loadSavedSettings(defaultSettings: ResumeSettings): ResumeSettings {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
      if (saved) {
        return JSON.parse(saved);
      }
    }
  } catch (e) {
    console.warn('[ResumeStorage] Failed to load saved settings', e);
  }
  return defaultSettings;
}

/**
 * Saves settings to localStorage
 */
export function saveSettingsDirectly(settings: ResumeSettings): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('[ResumeStorage] Failed to save settings', e);
  }
}

/**
 * Loads saved activation and validates against the resume
 */
export function loadSavedActivation(initialResume: ResumeData, defaultActivation: ActivationState): ActivationState {
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ACTIVATION);
      if (saved) {
        const parsed: ActivationState = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          // If stored state claims to be locked, validate it against initialResume
          if (parsed.isResumeLocked) {
            const { isValid, fingerprint } = validateResumeLockState(parsed, initialResume);
            if (!isValid) {
              parsed.isResumeLocked = false;
              parsed.lockedResumeFingerprint = null;
              clearDownloadCompletionFlags();
              localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVATION, JSON.stringify(parsed));
            } else {
              parsed.lockedResumeFingerprint = fingerprint;
            }
          }
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('[ResumeStorage] Failed to load saved activation', e);
  }
  return defaultActivation;
}

/**
 * Saves activation state to localStorage
 */
export function saveActivationDirectly(activation: ActivationState): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVATION, JSON.stringify(activation));
  } catch (e) {
    console.error('[ResumeStorage] Failed to save activation', e);
  }
}
