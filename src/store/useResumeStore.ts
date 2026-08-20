import { create } from 'zustand';
import i18n from '../i18n/i18n';
import {
  ResumeData,
  ResumeSettings,
  ActivationState,
  Language,
  TemplateId,
  WorkExperience,
  Education,
  SkillItem,
  Project,
  Certification,
  LanguageItem,
  AtsScoreResult,
  HeaderLayout,
  CareerFocus,
  RedFlagItem,
} from '../types/resume';
import { sampleArabicSoftwareEngineer, sampleEnglishMarketingManager } from '../data/sampleResumes';
import { sanitizeSensitiveText } from '../utils/redFlagDetector';

const LOCAL_STORAGE_KEY_RESUME = 'hash_resume_data_v2';
const LOCAL_STORAGE_KEY_SETTINGS = 'hash_resume_settings_v2';
const LOCAL_STORAGE_KEY_ACTIVATION = 'hash_resume_activation_v2';

const defaultSettings: ResumeSettings = {
  language: 'ar',
  templateId: 'modern-ats',
  primaryColor: '#1e40af', // Deep Slate Blue
  fontFamily: 'Tajawal',
  fontSize: 'md',
  spacing: 'normal',
  showPhoto: false,
  showIcons: true,
  sectionOrder: ['personalInfo', 'summary', 'experiences', 'education', 'skills', 'projects', 'certifications', 'languages'],
  headerLayout: 'centered',
  careerFocus: 'experienced',
};

const defaultActivation: ActivationState = {
  isActivated: false,
  activatedCode: null,
  remainingDownloads: 0,
  planType: 'free_preview',
  activatedAt: null,
};

// Initial state loader from LocalStorage
const loadInitialResume = (): ResumeData => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_RESUME);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Failed to load saved resume from localStorage", e);
  }
  return sampleArabicSoftwareEngineer;
};

const loadInitialSettings = (): ResumeSettings => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Failed to load saved settings from localStorage", e);
  }
  return defaultSettings;
};

const loadInitialActivation = (): ActivationState => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ACTIVATION);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Failed to load saved activation from localStorage", e);
  }
  return defaultActivation;
};

interface ResumeStoreState {
  // Main Resume Data
  resumeData: ResumeData;
  settings: ResumeSettings;
  activation: ActivationState;

  // UI States
  activeTab: 'personal' | 'experiences' | 'education' | 'skills' | 'projects' | 'certifications' | 'customize' | 'ats' | 'pricing';
  isAiModalOpen: boolean;
  aiModalType: 'bullet' | 'summary' | 'skills' | null;
  activeExperienceIdForAi: string | null;
  isAtsPanelOpen: boolean;
  isActivationModalOpen: boolean;
  isPostDownloadModalOpen: boolean;
  targetJobDescription: string;
  atsResult: AtsScoreResult | null;
  isAnalyzingAts: boolean;
  isSidebarCollapsed: boolean;
  focusedSection: string | null;

  // Actions - Resume Data Updates
  setPersonalInfo: (data: Partial<ResumeData['personalInfo']>) => void;
  
  // Experience Actions
  addExperience: (exp: Omit<WorkExperience, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<WorkExperience>) => void;
  removeExperience: (id: string) => void;
  reorderExperiences: (fromIndex: number, toIndex: number) => void;
  
  // Education Actions
  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (fromIndex: number, toIndex: number) => void;
  
  // Skill Actions
  addSkill: (skill: Omit<SkillItem, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<SkillItem>) => void;
  removeSkill: (id: string) => void;
  reorderSkills: (fromIndex: number, toIndex: number) => void;

  // Project Actions
  addProject: (proj: Omit<Project, 'id'>) => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (fromIndex: number, toIndex: number) => void;

  // Certification Actions
  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  reorderCertifications: (fromIndex: number, toIndex: number) => void;

  // Language Actions
  addLanguage: (lang: Omit<LanguageItem, 'id'>) => void;
  updateLanguage: (id: string, lang: Partial<LanguageItem>) => void;
  removeLanguage: (id: string) => void;

  // Settings & Load/Reset
  setLanguage: (lang: Language) => void;
  setTemplate: (tpl: TemplateId) => void;
  setPrimaryColor: (color: string) => void;
  setFontFamily: (font: string) => void;
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  setSpacing: (spacing: 'compact' | 'normal' | 'spacious') => void;
  setShowPhoto: (show: boolean) => void;
  setHeaderLayout: (layout: HeaderLayout) => void;
  setCareerFocus: (focus: CareerFocus) => void;
  setSectionOrder: (order: string[]) => void;
  applyRedFlagAutoFix: (flag: RedFlagItem) => void;
  
  loadSampleResume: (type: 'arabic' | 'english') => void;
  setResumeData: (data: ResumeData) => void;
  resetResume: () => void;

  // UI Actions
  setActiveTab: (tab: ResumeStoreState['activeTab']) => void;
  openAiModal: (type: 'bullet' | 'summary' | 'skills', expId?: string) => void;
  closeAiModal: () => void;
  setIsAtsPanelOpen: (open: boolean) => void;
  setIsActivationModalOpen: (open: boolean) => void;
  setIsPostDownloadModalOpen: (open: boolean) => void;
  setTargetJobDescription: (desc: string) => void;
  setAtsResult: (result: AtsScoreResult | null) => void;
  setIsAnalyzingAts: (analyzing: boolean) => void;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
  setFocusedSection: (section: string | null) => void;

  // Activation Actions
  activatePlan: (
    code: string,
    planType: ActivationState['planType'],
    downloads: number,
    keepModalOpen?: boolean
  ) => void;
  addDownloads: (count: number) => void;
  useDownloadQuota: () => boolean;
  lockResume: () => void;
  unlockResumeWithCredit: () => boolean;
  unlockResumeWithNewApproval: () => void;
}

export const useResumeStore = create<ResumeStoreState>((set, get) => ({
  resumeData: loadInitialResume(),
  settings: loadInitialSettings(),
  activation: loadInitialActivation(),

  activeTab: 'personal',
  isAiModalOpen: false,
  aiModalType: null,
  activeExperienceIdForAi: null,
  isAtsPanelOpen: false,
  isActivationModalOpen: false,
  isPostDownloadModalOpen: false,
  targetJobDescription: '',
  atsResult: null,
  isAnalyzingAts: false,
  isSidebarCollapsed: false,
  focusedSection: null,

  // Helper function to persist state
  setPersonalInfo: (info) => {
    set((state) => {
      const updated = {
        ...state.resumeData,
        personalInfo: { ...state.resumeData.personalInfo, ...info },
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  addExperience: (exp) => {
    set((state) => {
      const newExp: WorkExperience = { ...exp, id: `exp-${Date.now()}` };
      const updated = {
        ...state.resumeData,
        experiences: [...state.resumeData.experiences, newExp],
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  updateExperience: (id, exp) => {
    set((state) => {
      const updatedExps = (state.resumeData.experiences || []).map((item) =>
        item.id === id ? { ...item, ...exp } : item
      );
      const updated = { ...state.resumeData, experiences: updatedExps };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  removeExperience: (id) => {
    set((state) => {
      const updatedExps = state.resumeData.experiences.filter((item) => item.id !== id);
      const updated = { ...state.resumeData, experiences: updatedExps };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  reorderExperiences: (fromIndex, toIndex) => {
    set((state) => {
      const items = [...state.resumeData.experiences];
      if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) return {};
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      const updated = { ...state.resumeData, experiences: items };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  addEducation: (edu) => {
    set((state) => {
      const newEdu: Education = { ...edu, id: `edu-${Date.now()}` };
      const updated = {
        ...state.resumeData,
        education: [...state.resumeData.education, newEdu],
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  updateEducation: (id, edu) => {
    set((state) => {
      const updatedEdu = (state.resumeData.education || []).map((item) =>
        item.id === id ? { ...item, ...edu } : item
      );
      const updated = { ...state.resumeData, education: updatedEdu };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  removeEducation: (id) => {
    set((state) => {
      const updatedEdu = state.resumeData.education.filter((item) => item.id !== id);
      const updated = { ...state.resumeData, education: updatedEdu };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  reorderEducation: (fromIndex, toIndex) => {
    set((state) => {
      const items = [...state.resumeData.education];
      if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) return {};
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      const updated = { ...state.resumeData, education: items };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  addSkill: (skill) => {
    set((state) => {
      const newSkill: SkillItem = { ...skill, id: `sk-${Date.now()}` };
      const updated = {
        ...state.resumeData,
        skills: [...state.resumeData.skills, newSkill],
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  updateSkill: (id, skill) => {
    set((state) => {
      const updatedSkills = (state.resumeData.skills || []).map((item) =>
        item.id === id ? { ...item, ...skill } : item
      );
      const updated = { ...state.resumeData, skills: updatedSkills };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  removeSkill: (id) => {
    set((state) => {
      const updatedSkills = state.resumeData.skills.filter((item) => item.id !== id);
      const updated = { ...state.resumeData, skills: updatedSkills };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  reorderSkills: (fromIndex, toIndex) => {
    set((state) => {
      const items = [...state.resumeData.skills];
      if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) return {};
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      const updated = { ...state.resumeData, skills: items };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  addProject: (proj) => {
    set((state) => {
      const newProj: Project = { ...proj, id: `proj-${Date.now()}` };
      const updated = {
        ...state.resumeData,
        projects: [...state.resumeData.projects, newProj],
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  updateProject: (id, proj) => {
    set((state) => {
      const updatedProjs = (state.resumeData.projects || []).map((item) =>
        item.id === id ? { ...item, ...proj } : item
      );
      const updated = { ...state.resumeData, projects: updatedProjs };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  removeProject: (id) => {
    set((state) => {
      const updatedProjs = state.resumeData.projects.filter((item) => item.id !== id);
      const updated = { ...state.resumeData, projects: updatedProjs };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  reorderProjects: (fromIndex, toIndex) => {
    set((state) => {
      const items = [...state.resumeData.projects];
      if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) return {};
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      const updated = { ...state.resumeData, projects: items };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  addCertification: (cert) => {
    set((state) => {
      const newCert: Certification = { ...cert, id: `cert-${Date.now()}` };
      const updated = {
        ...state.resumeData,
        certifications: [...state.resumeData.certifications, newCert],
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  updateCertification: (id, cert) => {
    set((state) => {
      const updatedCerts = (state.resumeData.certifications || []).map((item) =>
        item.id === id ? { ...item, ...cert } : item
      );
      const updated = { ...state.resumeData, certifications: updatedCerts };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  removeCertification: (id) => {
    set((state) => {
      const updatedCerts = state.resumeData.certifications.filter((item) => item.id !== id);
      const updated = { ...state.resumeData, certifications: updatedCerts };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  reorderCertifications: (fromIndex, toIndex) => {
    set((state) => {
      const items = [...state.resumeData.certifications];
      if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) return {};
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      const updated = { ...state.resumeData, certifications: items };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  addLanguage: (lang) => {
    set((state) => {
      const newLang: LanguageItem = { ...lang, id: `lang-${Date.now()}` };
      const updated = {
        ...state.resumeData,
        languages: [...state.resumeData.languages, newLang],
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  updateLanguage: (id, lang) => {
    set((state) => {
      const updatedLangs = (state.resumeData.languages || []).map((item) =>
        item.id === id ? { ...item, ...lang } : item
      );
      const updated = { ...state.resumeData, languages: updatedLangs };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  removeLanguage: (id) => {
    set((state) => {
      const updatedLangs = state.resumeData.languages.filter((item) => item.id !== id);
      const updated = { ...state.resumeData, languages: updatedLangs };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(updated));
      return { resumeData: updated };
    });
  },

  // Settings
  setLanguage: (lang) => {
    i18n.changeLanguage(lang);
    set((state) => {
      const updatedSettings = {
        ...state.settings,
        language: lang,
        fontFamily: lang === 'ar' ? 'Tajawal' : 'Inter',
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(updatedSettings));
      return { settings: updatedSettings };
    });
  },

  setTemplate: (templateId) => {
    set((state) => {
      const updatedSettings = { ...state.settings, templateId };
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(updatedSettings));
      return { settings: updatedSettings };
    });
  },

  setPrimaryColor: (color) => {
    set((state) => {
      const updatedSettings = { ...state.settings, primaryColor: color };
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(updatedSettings));
      return { settings: updatedSettings };
    });
  },

  setFontFamily: (fontFamily) => {
    set((state) => {
      const updatedSettings = { ...state.settings, fontFamily };
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(updatedSettings));
      return { settings: updatedSettings };
    });
  },

  setFontSize: (fontSize) => {
    set((state) => {
      const updatedSettings = { ...state.settings, fontSize };
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(updatedSettings));
      return { settings: updatedSettings };
    });
  },

  setSpacing: (spacing) => {
    set((state) => {
      const updatedSettings = { ...state.settings, spacing };
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(updatedSettings));
      return { settings: updatedSettings };
    });
  },

  setShowPhoto: (showPhoto) => {
    set((state) => {
      const updatedSettings = { ...state.settings, showPhoto };
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(updatedSettings));
      return { settings: updatedSettings };
    });
  },

  setHeaderLayout: (headerLayout) => {
    set((state) => {
      const updatedSettings = { ...state.settings, headerLayout };
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(updatedSettings));
      return { settings: updatedSettings };
    });
  },

  setCareerFocus: (careerFocus) => {
    set((state) => {
      const isFresh = careerFocus === 'fresh-grad';
      const newSectionOrder = isFresh
        ? ['personalInfo', 'summary', 'education', 'projects', 'skills', 'certifications', 'experiences', 'languages']
        : ['personalInfo', 'summary', 'experiences', 'education', 'skills', 'projects', 'certifications', 'languages'];

      const updatedSettings = {
        ...state.settings,
        careerFocus,
        sectionOrder: newSectionOrder,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(updatedSettings));
      return { settings: updatedSettings };
    });
  },

  setSectionOrder: (sectionOrder) => {
    set((state) => {
      const updatedSettings = { ...state.settings, sectionOrder };
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(updatedSettings));
      return { settings: updatedSettings };
    });
  },

  applyRedFlagAutoFix: (flag) => {
    const state = get();
    if (flag.fixAction === 'clean_email') {
      const cleanName = (state.resumeData.personalInfo.fullName || 'firstname.lastname')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '.')
        .replace(/\.+/g, '.');
      state.setPersonalInfo({ email: `${cleanName}@gmail.com` });
    } else if (flag.fixAction === 'remove_sensitive') {
      const cleanSummary = sanitizeSensitiveText(state.resumeData.personalInfo.summary || '');
      const cleanLocation = sanitizeSensitiveText(state.resumeData.personalInfo.location || '');
      state.setPersonalInfo({ summary: cleanSummary, location: cleanLocation });
    } else if (flag.fixAction === 'reorder_fresh_grad') {
      state.setCareerFocus('fresh-grad');
    }
  },

  loadSampleResume: (type) => {
    set((state) => {
      const sample = type === 'arabic' ? sampleArabicSoftwareEngineer : sampleEnglishMarketingManager;
      const updatedSettings = {
        ...state.settings,
        language: (type === 'arabic' ? 'ar' : 'en') as Language,
        fontFamily: type === 'arabic' ? 'Tajawal' : 'Inter',
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(sample));
      localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(updatedSettings));
      return { resumeData: sample, settings: updatedSettings };
    });
  },

  setResumeData: (data) => {
    set(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(data));
      return { resumeData: data };
    });
  },

  resetResume: () => {
    const emptyResume: ResumeData = {
      personalInfo: {
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        summary: '',
      },
      experiences: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
    };
    localStorage.setItem(LOCAL_STORAGE_KEY_RESUME, JSON.stringify(emptyResume));
    set({ resumeData: emptyResume });
  },

  // UI Actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  openAiModal: (type, expId) => set({ isAiModalOpen: true, aiModalType: type, activeExperienceIdForAi: expId || null }),
  closeAiModal: () => set({ isAiModalOpen: false, aiModalType: null, activeExperienceIdForAi: null }),
  setIsAtsPanelOpen: (open) => set({ isAtsPanelOpen: open }),
  setIsActivationModalOpen: (open) => set({ isActivationModalOpen: open }),
  setIsPostDownloadModalOpen: (open) => set({ isPostDownloadModalOpen: open }),
  setTargetJobDescription: (desc) => set({ targetJobDescription: desc }),
  setAtsResult: (result) => set({ atsResult: result }),
  setIsAnalyzingAts: (analyzing) => set({ isAnalyzingAts: analyzing }),
  setIsSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  setFocusedSection: (section) => set({ focusedSection: section }),

  // Activation Actions
  activatePlan: (code, planType, downloads, keepModalOpen = false) => {
    set((state) => {
      const updatedActivation: ActivationState = {
        isActivated: true,
        activatedCode: code,
        remainingDownloads: downloads,
        planType: planType,
        activatedAt: new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVATION, JSON.stringify(updatedActivation));
      return { activation: updatedActivation, isActivationModalOpen: keepModalOpen ? true : false };
    });
  },

  addDownloads: (count) => {
    set((state) => {
      const currentDownloads = state.activation.isActivated ? state.activation.remainingDownloads : 0;
      const updatedActivation: ActivationState = {
        isActivated: true,
        activatedCode: state.activation.activatedCode || 'PURCHASED-CREDITS',
        remainingDownloads: currentDownloads + count,
        planType: count > 1 ? 'bundle_3' : 'single',
        activatedAt: state.activation.activatedAt || new Date().toISOString(),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVATION, JSON.stringify(updatedActivation));
      return { activation: updatedActivation };
    });
  },

  useDownloadQuota: () => {
    const state = get();
    // Must be activated strictly
    if (!state.activation || !state.activation.isActivated) {
      return false;
    }

    if (state.activation.remainingDownloads > 0) {
      const newRemaining = state.activation.remainingDownloads - 1;
      const updatedActivation: ActivationState = {
        ...state.activation,
        remainingDownloads: newRemaining,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVATION, JSON.stringify(updatedActivation));
      set({ activation: updatedActivation });
      return true;
    }

    return false; // Quota reached or zero downloads left
  },

  lockResume: () => {
    set((state) => {
      const updatedActivation: ActivationState = {
        ...state.activation,
        isResumeLocked: true,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVATION, JSON.stringify(updatedActivation));
      return { activation: updatedActivation };
    });
  },

  unlockResumeWithCredit: () => {
    const state = get();
    if (state.activation.remainingDownloads > 0) {
      const newRemaining = state.activation.remainingDownloads - 1;
      const updatedActivation: ActivationState = {
        ...state.activation,
        remainingDownloads: newRemaining,
        isResumeLocked: false,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVATION, JSON.stringify(updatedActivation));
      set({ activation: updatedActivation });
      return true;
    }
    return false;
  },

  unlockResumeWithNewApproval: () => {
    set((state) => {
      const updatedActivation: ActivationState = {
        ...state.activation,
        isResumeLocked: false,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVATION, JSON.stringify(updatedActivation));
      return { activation: updatedActivation };
    });
  },
}));
