// src/store/slices/settingsSlice.ts
import i18n from '../../i18n/i18n';
import { ResumeSettings, Language, DocumentDirection, TemplateId, HeaderLayout, CareerFocus } from '../../types/resume';
import { saveSettingsDirectly } from '../../utils/resumeStorage';

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

export interface SettingsSlice {
  settings: ResumeSettings;
  setLanguage: (lang: Language) => void;
  setDocumentDirection: (dir: DocumentDirection) => void;
  setTemplate: (tpl: TemplateId) => void;
  setPrimaryColor: (color: string) => void;
  setFontFamily: (font: string) => void;
  setHeadingFontFamily: (font: string) => void;
  setFontSize: (size: 'sm' | 'md' | 'lg') => void;
  setSpacing: (spacing: 'compact' | 'normal' | 'spacious') => void;
  setShowPhoto: (show: boolean) => void;
  setHeaderLayout: (layout: HeaderLayout) => void;
  setCareerFocus: (focus: CareerFocus) => void;
  setSectionOrder: (order: string[]) => void;
}

export const createSettingsSlice = (set: any): SettingsSlice => ({
  settings: defaultSettings,

  setLanguage: (lang) => {
    if (i18n && typeof i18n.changeLanguage === 'function') {
      i18n.changeLanguage(lang);
    }
    set((state: any) => {
      const updated = {
        ...state.settings,
        language: lang,
        fontFamily: lang === 'ar' ? 'Tajawal' : 'Inter',
        documentDirection: lang === 'ar' ? 'rtl' : 'ltr',
      };
      saveSettingsDirectly(updated);
      return { settings: updated };
    });
  },

  setDocumentDirection: (dir) => {
    set((state: any) => {
      const updated = { ...state.settings, documentDirection: dir };
      saveSettingsDirectly(updated);
      return { settings: updated };
    });
  },

  setTemplate: (templateId) => {
    set((state: any) => {
      const updated = { ...state.settings, templateId };
      saveSettingsDirectly(updated);
      return { settings: updated };
    });
  },

  setPrimaryColor: (color) => {
    set((state: any) => {
      const updated = { ...state.settings, primaryColor: color };
      saveSettingsDirectly(updated);
      return { settings: updated };
    });
  },

  setFontFamily: (fontFamily) => {
    set((state: any) => {
      const updated = { ...state.settings, fontFamily };
      saveSettingsDirectly(updated);
      return { settings: updated };
    });
  },

  setHeadingFontFamily: (headingFontFamily) => {
    set((state: any) => {
      const updated = { ...state.settings, headingFontFamily };
      saveSettingsDirectly(updated);
      return { settings: updated };
    });
  },

  setFontSize: (fontSize) => {
    set((state: any) => {
      const updated = { ...state.settings, fontSize };
      saveSettingsDirectly(updated);
      return { settings: updated };
    });
  },

  setSpacing: (spacing) => {
    set((state: any) => {
      const updated = { ...state.settings, spacing };
      saveSettingsDirectly(updated);
      return { settings: updated };
    });
  },

  setShowPhoto: (showPhoto) => {
    set((state: any) => {
      const updated = { ...state.settings, showPhoto };
      saveSettingsDirectly(updated);
      return { settings: updated };
    });
  },

  setHeaderLayout: (headerLayout) => {
    set((state: any) => {
      const updated = { ...state.settings, headerLayout };
      saveSettingsDirectly(updated);
      return { settings: updated };
    });
  },

  setCareerFocus: (careerFocus) => {
    set((state: any) => {
      const isFresh = careerFocus === 'fresh-grad';
      const newSectionOrder = isFresh
        ? ['personalInfo', 'summary', 'education', 'projects', 'skills', 'certifications', 'experiences', 'languages']
        : ['personalInfo', 'summary', 'experiences', 'education', 'skills', 'projects', 'certifications', 'languages'];

      const updated = { ...state.settings, careerFocus, sectionOrder: newSectionOrder };
      saveSettingsDirectly(updated);
      return { settings: updated };
    });
  },

  setSectionOrder: (sectionOrder) => {
    set((state: any) => {
      const updated = { ...state.settings, sectionOrder };
      saveSettingsDirectly(updated);
      return { settings: updated };
    });
  },
});
