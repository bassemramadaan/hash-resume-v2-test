import { create } from 'zustand';
import i18n from '../../i18n/i18n';
import {
  ResumeData,
  ResumeSettings,
  Language,
  DocumentDirection,
  TemplateId,
  WorkExperience,
  Education,
  SkillItem,
  Project,
  Certification,
  LanguageItem,
  HeaderLayout,
  CareerFocus,
  RedFlagItem,
} from '../../types/resume';
import { sanitizeSensitiveText } from '../../utils/redFlagDetector';
import { generateId } from '../../utils/idGenerator';
import {
  validateResumeLockState,
  clearDownloadCompletionFlags,
} from '../../utils/resumeFingerprint';
import {
  LOCAL_STORAGE_KEY_SETTINGS,
  loadSavedResume,
  loadSavedSettings,
  saveResumeDirectly,
  saveSettingsDirectly,
  saveActivationDirectly,
  initAutosaveLifecycleListeners,
} from '../../utils/resumeStorage';
import { useActivationStore } from './useActivationStore';

export const defaultSettings: ResumeSettings = {
  language: 'ar',
  documentDirection: 'rtl',
  templateId: 'bassux',
  primaryColor: '#001639',
  fontFamily: 'Tajawal',
  fontSize: 'md',
  spacing: 'normal',
  showPhoto: false,
  showIcons: true,
  sectionOrder: ['personalInfo', 'summary', 'experiences', 'education', 'skills', 'projects', 'certifications', 'languages'],
  headerLayout: 'centered',
  careerFocus: 'experienced',
};

export const createEmptyResume = (): ResumeData => ({
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    photoUrl: '',
    summary: '',
  },
  experiences: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
});

if (typeof window !== 'undefined') {
  initAutosaveLifecycleListeners();
}

const initialResumeResult = loadSavedResume(createEmptyResume());
export const initialResume = initialResumeResult.data;
export const initialSettings = loadSavedSettings(defaultSettings);

export interface ResumeDataState {
  isHydrated: boolean;
  resumeData: ResumeData;
  settings: ResumeSettings;

  setPersonalInfo: (data: Partial<ResumeData['personalInfo']>) => void;
  addExperience: (exp: Omit<WorkExperience, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<WorkExperience>) => void;
  removeExperience: (id: string) => void;
  reorderExperiences: (fromIndex: number, toIndex: number) => void;

  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (fromIndex: number, toIndex: number) => void;

  addSkill: (skill: Omit<SkillItem, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<SkillItem>) => void;
  removeSkill: (id: string) => void;
  reorderSkills: (fromIndex: number, toIndex: number) => void;

  addProject: (proj: Omit<Project, 'id'>) => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (fromIndex: number, toIndex: number) => void;

  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  reorderCertifications: (fromIndex: number, toIndex: number) => void;

  addLanguage: (lang: Omit<LanguageItem, 'id'>) => void;
  updateLanguage: (id: string, lang: Partial<LanguageItem>) => void;
  removeLanguage: (id: string) => void;

  setLanguage: (lang: Language) => void;
  setDocumentDirection: (dir: DocumentDirection) => void;
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

  setResumeData: (data: ResumeData) => void;
  resetResume: () => void;
}

export const createResumeDataSlice = (set: any, get: any): ResumeDataState => ({
  isHydrated: true,
  resumeData: initialResume,
  settings: initialSettings,

  setPersonalInfo: (info) => {
    set((state: any) => {
      const updated = {
        ...state.resumeData,
        personalInfo: { ...state.resumeData.personalInfo, ...info },
      };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  addExperience: (exp) => {
    set((state: any) => {
      const newExp: WorkExperience = { ...exp, id: generateId('exp') };
      const updated = {
        ...state.resumeData,
        experiences: [...state.resumeData.experiences, newExp],
      };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  updateExperience: (id, exp) => {
    set((state: any) => {
      const updatedExps = (state.resumeData.experiences || []).map((item: WorkExperience) =>
        item.id === id ? { ...item, ...exp } : item
      );
      const updated = { ...state.resumeData, experiences: updatedExps };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  removeExperience: (id) => {
    set((state: any) => {
      const updatedExps = state.resumeData.experiences.filter((item: WorkExperience) => item.id !== id);
      const updated = { ...state.resumeData, experiences: updatedExps };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  reorderExperiences: (fromIndex, toIndex) => {
    set((state: any) => {
      const items = [...state.resumeData.experiences];
      if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) return {};
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      const updated = { ...state.resumeData, experiences: items };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  addEducation: (edu) => {
    set((state: any) => {
      const newEdu: Education = { ...edu, id: generateId('edu') };
      const updated = {
        ...state.resumeData,
        education: [...state.resumeData.education, newEdu],
      };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  updateEducation: (id, edu) => {
    set((state: any) => {
      const updatedEdu = (state.resumeData.education || []).map((item: Education) =>
        item.id === id ? { ...item, ...edu } : item
      );
      const updated = { ...state.resumeData, education: updatedEdu };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  removeEducation: (id) => {
    set((state: any) => {
      const updatedEdu = state.resumeData.education.filter((item: Education) => item.id !== id);
      const updated = { ...state.resumeData, education: updatedEdu };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  reorderEducation: (fromIndex, toIndex) => {
    set((state: any) => {
      const items = [...state.resumeData.education];
      if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) return {};
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      const updated = { ...state.resumeData, education: items };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  addSkill: (skill) => {
    set((state: any) => {
      const newSkill: SkillItem = { ...skill, id: generateId('sk') };
      const updated = {
        ...state.resumeData,
        skills: [...state.resumeData.skills, newSkill],
      };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  updateSkill: (id, skill) => {
    set((state: any) => {
      const updatedSkills = (state.resumeData.skills || []).map((item: SkillItem) =>
        item.id === id ? { ...item, ...skill } : item
      );
      const updated = { ...state.resumeData, skills: updatedSkills };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  removeSkill: (id) => {
    set((state: any) => {
      const updatedSkills = state.resumeData.skills.filter((item: SkillItem) => item.id !== id);
      const updated = { ...state.resumeData, skills: updatedSkills };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  reorderSkills: (fromIndex, toIndex) => {
    set((state: any) => {
      const items = [...state.resumeData.skills];
      if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) return {};
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      const updated = { ...state.resumeData, skills: items };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  addProject: (proj) => {
    set((state: any) => {
      const newProj: Project = { ...proj, id: generateId('proj') };
      const updated = {
        ...state.resumeData,
        projects: [...state.resumeData.projects, newProj],
      };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  updateProject: (id, proj) => {
    set((state: any) => {
      const updatedProjs = (state.resumeData.projects || []).map((item: Project) =>
        item.id === id ? { ...item, ...proj } : item
      );
      const updated = { ...state.resumeData, projects: updatedProjs };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  removeProject: (id) => {
    set((state: any) => {
      const updatedProjs = state.resumeData.projects.filter((item: Project) => item.id !== id);
      const updated = { ...state.resumeData, projects: updatedProjs };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  reorderProjects: (fromIndex, toIndex) => {
    set((state: any) => {
      const items = [...state.resumeData.projects];
      if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) return {};
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      const updated = { ...state.resumeData, projects: items };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  addCertification: (cert) => {
    set((state: any) => {
      const newCert: Certification = { ...cert, id: generateId('cert') };
      const updated = {
        ...state.resumeData,
        certifications: [...state.resumeData.certifications, newCert],
      };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  updateCertification: (id, cert) => {
    set((state: any) => {
      const updatedCerts = (state.resumeData.certifications || []).map((item: Certification) =>
        item.id === id ? { ...item, ...cert } : item
      );
      const updated = { ...state.resumeData, certifications: updatedCerts };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  removeCertification: (id) => {
    set((state: any) => {
      const updatedCerts = state.resumeData.certifications.filter((item: Certification) => item.id !== id);
      const updated = { ...state.resumeData, certifications: updatedCerts };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  reorderCertifications: (fromIndex, toIndex) => {
    set((state: any) => {
      const items = [...state.resumeData.certifications];
      if (fromIndex < 0 || fromIndex >= items.length || toIndex < 0 || toIndex >= items.length) return {};
      const [moved] = items.splice(fromIndex, 1);
      items.splice(toIndex, 0, moved);
      const updated = { ...state.resumeData, certifications: items };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  addLanguage: (lang) => {
    set((state: any) => {
      const newLang: LanguageItem = { ...lang, id: generateId('lang') };
      const updated = {
        ...state.resumeData,
        languages: [...state.resumeData.languages, newLang],
      };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  updateLanguage: (id, lang) => {
    set((state: any) => {
      const updatedLangs = (state.resumeData.languages || []).map((item: LanguageItem) =>
        item.id === id ? { ...item, ...lang } : item
      );
      const updated = { ...state.resumeData, languages: updatedLangs };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  removeLanguage: (id) => {
    set((state: any) => {
      const updatedLangs = state.resumeData.languages.filter((item: LanguageItem) => item.id !== id);
      const updated = { ...state.resumeData, languages: updatedLangs };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  setLanguage: (lang) => {
    i18n.changeLanguage(lang);
    set((state: any) => {
      const updatedSettings = {
        ...state.settings,
        language: lang,
        fontFamily: lang === 'ar' ? 'Tajawal' : 'Inter',
        documentDirection: lang === 'ar' ? ('rtl' as DocumentDirection) : ('ltr' as DocumentDirection),
      };
      saveSettingsDirectly(updatedSettings);
      return { settings: updatedSettings };
    });
  },

  setDocumentDirection: (dir) => {
    set((state: any) => {
      const updatedSettings = {
        ...state.settings,
        documentDirection: dir,
      };
      saveSettingsDirectly(updatedSettings);
      return { settings: updatedSettings };
    });
  },

  setTemplate: (templateId) => {
    set((state: any) => {
      const updatedSettings = { ...state.settings, templateId };
      saveSettingsDirectly(updatedSettings);
      return { settings: updatedSettings };
    });
  },

  setPrimaryColor: (color) => {
    set((state: any) => {
      const updatedSettings = { ...state.settings, primaryColor: color };
      saveSettingsDirectly(updatedSettings);
      return { settings: updatedSettings };
    });
  },

  setFontFamily: (fontFamily) => {
    set((state: any) => {
      const updatedSettings = { ...state.settings, fontFamily };
      saveSettingsDirectly(updatedSettings);
      return { settings: updatedSettings };
    });
  },

  setFontSize: (fontSize) => {
    set((state: any) => {
      const updatedSettings = { ...state.settings, fontSize };
      saveSettingsDirectly(updatedSettings);
      return { settings: updatedSettings };
    });
  },

  setSpacing: (spacing) => {
    set((state: any) => {
      const updatedSettings = { ...state.settings, spacing };
      saveSettingsDirectly(updatedSettings);
      return { settings: updatedSettings };
    });
  },

  setShowPhoto: (showPhoto) => {
    set((state: any) => {
      const updatedSettings = { ...state.settings, showPhoto };
      saveSettingsDirectly(updatedSettings);
      return { settings: updatedSettings };
    });
  },

  setHeaderLayout: (headerLayout) => {
    set((state: any) => {
      const updatedSettings = { ...state.settings, headerLayout };
      saveSettingsDirectly(updatedSettings);
      return { settings: updatedSettings };
    });
  },

  setCareerFocus: (careerFocus) => {
    set((state: any) => {
      const isFresh = careerFocus === 'fresh-grad';
      const newSectionOrder = isFresh
        ? ['personalInfo', 'summary', 'education', 'projects', 'skills', 'certifications', 'experiences', 'languages']
        : ['personalInfo', 'summary', 'experiences', 'education', 'skills', 'projects', 'certifications', 'languages'];

      const updatedSettings = {
        ...state.settings,
        careerFocus,
        sectionOrder: newSectionOrder,
      };
      saveSettingsDirectly(updatedSettings);
      return { settings: updatedSettings };
    });
  },

  setSectionOrder: (sectionOrder) => {
    set((state: any) => {
      const updatedSettings = { ...state.settings, sectionOrder };
      saveSettingsDirectly(updatedSettings);
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

  setResumeData: (data) => {
    set((state: any) => {
      saveResumeDirectly(data);
      let updatedActivation = state.activation;
      if (state.activation?.isResumeLocked) {
        const { isValid } = validateResumeLockState(state.activation, data);
        if (!isValid) {
          clearDownloadCompletionFlags();
          updatedActivation = {
            ...state.activation,
            isResumeLocked: false,
            lockedResumeFingerprint: null,
          };
          saveActivationDirectly(updatedActivation);
        }
      }
      return { resumeData: data, ...(updatedActivation ? { activation: updatedActivation } : {}) };
    });
  },

  resetResume: () => {
    const emptyResume = createEmptyResume();
    clearDownloadCompletionFlags();
    saveResumeDirectly(emptyResume);
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('hash_resume_data');
      }
    } catch {
      // ignore
    }
    set((state: any) => {
      const updatedActivation = state.activation ? {
        ...state.activation,
        isResumeLocked: false,
        lockedResumeFingerprint: null,
      } : null;
      if (updatedActivation) {
        saveActivationDirectly(updatedActivation);
      }
      return {
        resumeData: emptyResume,
        ...(updatedActivation ? { activation: updatedActivation } : {}),
      };
    });
  },
});

export const useResumeDataStore = create<ResumeDataState>((set, get) =>
  createResumeDataSlice(set, get)
);
