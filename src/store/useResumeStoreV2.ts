// src/store/useResumeStoreV2.ts
import { create } from 'zustand';
import { createResumeDataSlice, ResumeDataSlice } from './slices/resumeDataSlice';
import { createSettingsSlice, SettingsSlice } from './slices/settingsSlice';
import { createUiSlice, UiSlice } from './slices/uiSlice';
import { createActivationSlice, ActivationSlice } from './slices/activationSlice';
import { loadSavedResume, loadSavedSettings, loadSavedActivation } from '@/utils/resumeStorage';
import { validateResumeLockState, clearDownloadCompletionFlags } from '@/utils/resumeFingerprint';

const initialResume = loadSavedResume(createResumeDataSlice(() => {}, () => {}).createEmptyResume?.() || {
  personalInfo: { fullName: '', jobTitle: '', email: '', phone: '', location: '', linkedin: '', github: '', website: '', photoUrl: '', summary: '' },
  experiences: [], education: [], skills: [], projects: [], certifications: [], languages: [], customSections: [],
}).data;

const initialSettings = loadSavedSettings(createSettingsSlice(() => {}).settings || {
  language: 'ar', documentDirection: 'rtl', templateId: 'bassux', primaryColor: '#001639',
  fontFamily: 'Tajawal', fontSize: 'md', spacing: 'normal', showPhoto: false, showIcons: true,
  sectionOrder: ['personalInfo', 'summary', 'experiences', 'education', 'skills', 'projects', 'certifications', 'languages'],
  headerLayout: 'centered', careerFocus: 'experienced',
});

const initialActivation = loadSavedActivation(initialResume, createActivationSlice(() => {}, () => {}).activation || {
  isActivated: false, activatedCode: null, remainingDownloads: 0, planType: 'free_preview', activatedAt: null,
});

export type ResumeStoreState = ResumeDataSlice & SettingsSlice & UiSlice & ActivationSlice & {
  isHydrated: boolean;
};

export const useResumeStore = create<ResumeStoreState>((set, get) => ({
  isHydrated: true,
  ...createResumeDataSlice(set, get),
  ...createSettingsSlice(set),
  ...createUiSlice(set),
  ...createActivationSlice(set, get),
  
  // Override settings initial state
  settings: initialSettings,
  
  // Override resumeData initial state
  resumeData: initialResume,
  
  // Override activation initial state
  activation: initialActivation,
}));

export default useResumeStore;
