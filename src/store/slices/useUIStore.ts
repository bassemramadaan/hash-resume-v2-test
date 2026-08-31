import { create } from 'zustand';
import { AtsScoreResult } from '../../types/resume';

export interface UIState {
  activeTab: 'personal' | 'experiences' | 'education' | 'skills' | 'projects' | 'certifications' | 'customize' | 'ats' | 'pricing';
  isAiModalOpen: boolean;
  aiModalType: 'bullet' | 'summary' | 'skills' | null;
  activeExperienceIdForAi: string | null;
  isAtsPanelOpen: boolean;
  isActivationModalOpen: boolean;
  isPostDownloadModalOpen: boolean;
  isUnlockModalOpen: boolean;
  targetJobDescription: string;
  atsResult: AtsScoreResult | null;
  isAnalyzingAts: boolean;
  isSidebarCollapsed: boolean;
  focusedSection: string | null;

  setActiveTab: (tab: UIState['activeTab']) => void;
  openAiModal: (type: 'bullet' | 'summary' | 'skills', expId?: string) => void;
  closeAiModal: () => void;
  setIsAtsPanelOpen: (open: boolean) => void;
  setIsActivationModalOpen: (open: boolean) => void;
  setIsPostDownloadModalOpen: (open: boolean) => void;
  setIsUnlockModalOpen: (open: boolean) => void;
  setTargetJobDescription: (desc: string) => void;
  setAtsResult: (result: AtsScoreResult | null) => void;
  setIsAnalyzingAts: (analyzing: boolean) => void;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  setFocusedSection: (section: string | null) => void;
}

export const createUISlice = (set: any): UIState => ({
  activeTab: 'personal',
  isAiModalOpen: false,
  aiModalType: null,
  activeExperienceIdForAi: null,
  isAtsPanelOpen: false,
  isActivationModalOpen: false,
  isPostDownloadModalOpen: false,
  isUnlockModalOpen: false,
  targetJobDescription: '',
  atsResult: null,
  isAnalyzingAts: false,
  isSidebarCollapsed: false,
  focusedSection: null,

  setActiveTab: (tab) => set({ activeTab: tab }),
  openAiModal: (type, expId) => set({ isAiModalOpen: true, aiModalType: type, activeExperienceIdForAi: expId || null }),
  closeAiModal: () => set({ isAiModalOpen: false, aiModalType: null, activeExperienceIdForAi: null }),
  setIsAtsPanelOpen: (open) => set({ isAtsPanelOpen: open }),
  setIsActivationModalOpen: (open) => set({ isActivationModalOpen: open }),
  setIsPostDownloadModalOpen: (open) => set({ isPostDownloadModalOpen: open }),
  setIsUnlockModalOpen: (open) => set({ isUnlockModalOpen: open }),
  setTargetJobDescription: (desc) => set({ targetJobDescription: desc }),
  setAtsResult: (result) => set({ atsResult: result }),
  setIsAnalyzingAts: (analyzing) => set({ isAnalyzingAts: analyzing }),
  setIsSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  setFocusedSection: (section) => set({ focusedSection: section }),
});

export const useUIStore = create<UIState>((set) => createUISlice(set));
