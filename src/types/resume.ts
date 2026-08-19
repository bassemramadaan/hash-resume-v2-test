export type TemplateId =
  | 'modern-ats'
  | 'classic-professional'
  | 'minimal-exec'
  | 'technical-clean'
  | 'creative-compact';

export type Language = 'ar' | 'en' | 'fr';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github?: string;
  website?: string;
  photoUrl?: string;
  summary: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bulletPoints: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'tool' | 'language' | 'general';
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: 'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic';
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description: string;
}

export interface CustomSection {
  id: string;
  sectionTitle: string;
  items: CustomSectionItem[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: WorkExperience[];
  education: Education[];
  skills: SkillItem[];
  projects: Project[];
  certifications: Certification[];
  languages: LanguageItem[];
  customSections?: CustomSection[];
}

export interface ResumeSettings {
  language: Language;
  templateId: TemplateId;
  primaryColor: string;
  fontFamily: string;
  fontSize: 'sm' | 'md' | 'lg';
  spacing: 'compact' | 'normal' | 'spacious';
  showPhoto: boolean;
  showIcons: boolean;
  sectionOrder: string[];
}

export interface ActivationState {
  isActivated: boolean;
  activatedCode: string | null;
  remainingDownloads: number;
  planType: 'single' | 'bundle_3' | 'unlimited_dev' | 'free_preview';
  activatedAt: string | null;
  isResumeLocked?: boolean;
}

export interface AtsScoreResult {
  score: number;
  verdict: string;
  strengths: string[];
  missingKeywords: string[];
  actionPoints: string[];
}
