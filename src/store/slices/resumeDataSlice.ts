// src/store/slices/resumeDataSlice.ts
import { ResumeData, WorkExperience, Education, SkillItem, Project, Certification, LanguageItem, RedFlagItem, Language } from '../../types/resume';
import { saveResumeDirectly, saveActivationDirectly } from '../../utils/resumeStorage';
import { sanitizeSensitiveText } from '../../utils/redFlagDetector';
import { clearDownloadCompletionFlags, validateResumeLockState } from '../../utils/resumeFingerprint';
import { getSampleResumeByLanguage } from '../../data/sampleResume';

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

export interface ResumeDataSlice {
  resumeData: ResumeData;
  setPersonalInfo: (data: Partial<ResumeData['personalInfo']>) => void;
  addExperience: (exp: Omit<WorkExperience, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<WorkExperience>) => void;
  removeExperience: (id: string) => void;
  reorderExperiences: (fromIndex: number, toIndex: number) => void;
  insertExperienceAtIndex: (index: number, exp: WorkExperience) => void;

  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  reorderEducation: (fromIndex: number, toIndex: number) => void;
  insertEducationAtIndex: (index: number, edu: Education) => void;

  addSkill: (skill: Omit<SkillItem, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<SkillItem>) => void;
  removeSkill: (id: string) => void;
  reorderSkills: (fromIndex: number, toIndex: number) => void;
  insertSkillAtIndex: (index: number, skill: SkillItem) => void;

  addProject: (proj: Omit<Project, 'id'>) => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (fromIndex: number, toIndex: number) => void;
  insertProjectAtIndex: (index: number, proj: Project) => void;

  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  reorderCertifications: (fromIndex: number, toIndex: number) => void;
  insertCertificationAtIndex: (index: number, cert: Certification) => void;

  addLanguage: (lang: Omit<LanguageItem, 'id'>) => void;
  updateLanguage: (id: string, lang: Partial<LanguageItem>) => void;
  removeLanguage: (id: string) => void;
  insertLanguageAtIndex: (index: number, lang: LanguageItem) => void;

  applyRedFlagAutoFix: (flag: RedFlagItem) => void;
  loadSampleResume: (lang?: Language) => void;

  setResumeData: (data: ResumeData) => void;
  resetResume: () => void;
  createEmptyResume?: () => ResumeData;
}

export const createResumeDataSlice = (set: any, get: any): ResumeDataSlice => ({
  resumeData: createEmptyResume(),
  createEmptyResume,

  setPersonalInfo: (info) => {
    set((state: any) => {
      const updated = { ...state.resumeData, personalInfo: { ...state.resumeData.personalInfo, ...info } };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  addExperience: (exp) => {
    set((state: any) => {
      const newExp: WorkExperience = { ...exp, id: `exp-${Date.now()}` };
      const updated = { ...state.resumeData, experiences: [...state.resumeData.experiences, newExp] };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  updateExperience: (id, exp) => {
    set((state: any) => {
      const updatedExps = state.resumeData.experiences.map((item: WorkExperience) =>
        item.id === id ? { ...item, ...exp } : item
      );
      const updated = { ...state.resumeData, experiences: updatedExps };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  removeExperience: (id) => {
    set((state: any) => {
      const updated = { ...state.resumeData, experiences: state.resumeData.experiences.filter((e: WorkExperience) => e.id !== id) };
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

  insertExperienceAtIndex: (index, exp) => {
    set((state: any) => {
      const items = [...(state.resumeData.experiences || [])];
      const validIndex = Math.max(0, Math.min(index, items.length));
      items.splice(validIndex, 0, exp);
      const updated = { ...state.resumeData, experiences: items };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  addEducation: (edu) => {
    set((state: any) => {
      const newEdu: Education = { ...edu, id: `edu-${Date.now()}` };
      const updated = { ...state.resumeData, education: [...state.resumeData.education, newEdu] };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  updateEducation: (id, edu) => {
    set((state: any) => {
      const updatedEdu = state.resumeData.education.map((item: Education) =>
        item.id === id ? { ...item, ...edu } : item
      );
      const updated = { ...state.resumeData, education: updatedEdu };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  removeEducation: (id) => {
    set((state: any) => {
      const updated = { ...state.resumeData, education: state.resumeData.education.filter((e: Education) => e.id !== id) };
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

  insertEducationAtIndex: (index, edu) => {
    set((state: any) => {
      const items = [...(state.resumeData.education || [])];
      const validIndex = Math.max(0, Math.min(index, items.length));
      items.splice(validIndex, 0, edu);
      const updated = { ...state.resumeData, education: items };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  addSkill: (skill) => {
    set((state: any) => {
      const newSkill: SkillItem = { ...skill, id: `sk-${Date.now()}` };
      const updated = { ...state.resumeData, skills: [...state.resumeData.skills, newSkill] };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  updateSkill: (id, skill) => {
    set((state: any) => {
      const updatedSkills = state.resumeData.skills.map((item: SkillItem) =>
        item.id === id ? { ...item, ...skill } : item
      );
      const updated = { ...state.resumeData, skills: updatedSkills };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  removeSkill: (id) => {
    set((state: any) => {
      const updated = { ...state.resumeData, skills: state.resumeData.skills.filter((s: SkillItem) => s.id !== id) };
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

  insertSkillAtIndex: (index, skill) => {
    set((state: any) => {
      const items = [...(state.resumeData.skills || [])];
      const validIndex = Math.max(0, Math.min(index, items.length));
      items.splice(validIndex, 0, skill);
      const updated = { ...state.resumeData, skills: items };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  addProject: (proj) => {
    set((state: any) => {
      const newProj: Project = { ...proj, id: `proj-${Date.now()}` };
      const updated = { ...state.resumeData, projects: [...state.resumeData.projects, newProj] };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  updateProject: (id, proj) => {
    set((state: any) => {
      const updatedProjs = state.resumeData.projects.map((item: Project) =>
        item.id === id ? { ...item, ...proj } : item
      );
      const updated = { ...state.resumeData, projects: updatedProjs };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  removeProject: (id) => {
    set((state: any) => {
      const updated = { ...state.resumeData, projects: state.resumeData.projects.filter((p: Project) => p.id !== id) };
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

  insertProjectAtIndex: (index, proj) => {
    set((state: any) => {
      const items = [...(state.resumeData.projects || [])];
      const validIndex = Math.max(0, Math.min(index, items.length));
      items.splice(validIndex, 0, proj);
      const updated = { ...state.resumeData, projects: items };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  addCertification: (cert) => {
    set((state: any) => {
      const newCert: Certification = { ...cert, id: `cert-${Date.now()}` };
      const updated = { ...state.resumeData, certifications: [...state.resumeData.certifications, newCert] };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  updateCertification: (id, cert) => {
    set((state: any) => {
      const updatedCerts = state.resumeData.certifications.map((item: Certification) =>
        item.id === id ? { ...item, ...cert } : item
      );
      const updated = { ...state.resumeData, certifications: updatedCerts };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  removeCertification: (id) => {
    set((state: any) => {
      const updated = { ...state.resumeData, certifications: state.resumeData.certifications.filter((c: Certification) => c.id !== id) };
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

  insertCertificationAtIndex: (index, cert) => {
    set((state: any) => {
      const items = [...(state.resumeData.certifications || [])];
      const validIndex = Math.max(0, Math.min(index, items.length));
      items.splice(validIndex, 0, cert);
      const updated = { ...state.resumeData, certifications: items };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  addLanguage: (lang) => {
    set((state: any) => {
      const newLang: LanguageItem = { ...lang, id: `lang-${Date.now()}` };
      const updated = { ...state.resumeData, languages: [...state.resumeData.languages, newLang] };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  updateLanguage: (id, lang) => {
    set((state: any) => {
      const updatedLangs = state.resumeData.languages.map((item: LanguageItem) =>
        item.id === id ? { ...item, ...lang } : item
      );
      const updated = { ...state.resumeData, languages: updatedLangs };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  removeLanguage: (id) => {
    set((state: any) => {
      const updated = { ...state.resumeData, languages: state.resumeData.languages.filter((l: LanguageItem) => l.id !== id) };
      saveResumeDirectly(updated);
      return { resumeData: updated };
    });
  },

  insertLanguageAtIndex: (index, lang) => {
    set((state: any) => {
      const items = [...(state.resumeData.languages || [])];
      const validIndex = Math.max(0, Math.min(index, items.length));
      items.splice(validIndex, 0, lang);
      const updated = { ...state.resumeData, languages: items };
      saveResumeDirectly(updated);
      return { resumeData: updated };
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
    const empty = createEmptyResume();
    clearDownloadCompletionFlags();
    saveResumeDirectly(empty);
    set((state: any) => {
      const updatedActivation = state.activation ? {
        ...state.activation,
        isResumeLocked: false,
        lockedResumeFingerprint: null,
      } : null;
      if (updatedActivation) {
        saveActivationDirectly(updatedActivation);
      }
      return { resumeData: empty, ...(updatedActivation ? { activation: updatedActivation } : {}) };
    });
  },

  loadSampleResume: (lang?: Language) => {
    const currentLang = lang || get().settings?.language || 'ar';
    const sample = getSampleResumeByLanguage(currentLang);
    clearDownloadCompletionFlags();
    saveResumeDirectly(sample);
    set((state: any) => {
      const updatedActivation = state.activation ? {
        ...state.activation,
        isResumeLocked: false,
        lockedResumeFingerprint: null,
      } : null;
      if (updatedActivation) {
        saveActivationDirectly(updatedActivation);
      }
      return { resumeData: sample, ...(updatedActivation ? { activation: updatedActivation } : {}) };
    });
  },
});
