import React from 'react';
import { motion } from 'motion/react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Layout,
  FileText,
  Download,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Lock,
  Key,
  Save,
  Eye,
} from 'lucide-react';

import { PersonalInfoForm } from '../builder/PersonalInfoForm';
import { ExperienceForm } from '../builder/ExperienceForm';
import { EducationForm } from '../builder/EducationForm';
import { SkillsForm } from '../builder/SkillsForm';
import { CertificationsForm } from '../builder/CertificationsForm';
import { ProjectsForm } from '../builder/ProjectsForm';
import { CustomizeForm } from '../builder/CustomizeForm';
import { AtsAnalyzerPanel } from '../builder/AtsAnalyzerPanel';
import { DownloadSection } from '../builder/DownloadSection';

export type MobileSectionKey =
  | 'personal'
  | 'experiences'
  | 'education'
  | 'skills'
  | 'certifications'
  | 'projects'
  | 'customize'
  | 'ats'
  | 'download';

interface MobileSectionEditorProps {
  sectionKey: MobileSectionKey;
  onBack: () => void;
  onNavigateSection: (nextKey: MobileSectionKey) => void;
  onOpenPreview?: () => void;
  saveStatus: 'saved' | 'saving';
}

export const MobileSectionEditor: React.FC<MobileSectionEditorProps> = ({
  sectionKey,
  onBack,
  onNavigateSection,
  onOpenPreview,
  saveStatus,
}) => {
  const { settings, activation, unlockResumeWithCredit, resetResume, setIsActivationModalOpen } =
    useResumeStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const [isDraftSavedFeedback, setIsDraftSavedFeedback] = React.useState(false);

  const handleSaveDraft = () => {
    setIsDraftSavedFeedback(true);
    setTimeout(() => {
      setIsDraftSavedFeedback(false);
    }, 2000);
  };

  const sectionMeta: Record<
    MobileSectionKey,
    {
      titleAr: string;
      titleEn: string;
      subtitleAr: string;
      subtitleEn: string;
      icon: any;
      nextSection?: MobileSectionKey;
      prevSection?: MobileSectionKey;
    }
  > = {
    personal: {
      titleAr: 'البيانات الشخصية',
      titleEn: 'Personal Information',
      subtitleAr: 'الاسم ومعلومات الاتصال والمسمى الوظيفي',
      subtitleEn: 'Full name, contact info, and summary',
      icon: User,
      nextSection: 'experiences',
    },
    experiences: {
      titleAr: 'الخبرات المهنية',
      titleEn: 'Work Experience',
      subtitleAr: 'المناصب والشركات وتفاصيل المهام',
      subtitleEn: 'Positions, companies, and achievements',
      icon: Briefcase,
      nextSection: 'education',
      prevSection: 'personal',
    },
    education: {
      titleAr: 'المؤهلات التعليمية',
      titleEn: 'Education',
      subtitleAr: 'الدرجات العلمية والجامعات',
      subtitleEn: 'Degrees, universities, and graduation years',
      icon: GraduationCap,
      nextSection: 'skills',
      prevSection: 'experiences',
    },
    skills: {
      titleAr: 'المهارات والقدرات',
      titleEn: 'Skills',
      subtitleAr: 'المهارات التقنية والشخصية واللغات',
      subtitleEn: 'Technical, soft skills, and languages',
      icon: Wrench,
      nextSection: 'certifications',
      prevSection: 'education',
    },
    certifications: {
      titleAr: 'الشهادات والدورات',
      titleEn: 'Certifications',
      subtitleAr: 'الشهادات المعتمدة والدورات التدريبية',
      subtitleEn: 'Accredited certificates and licenses',
      icon: Award,
      nextSection: 'projects',
      prevSection: 'skills',
    },
    projects: {
      titleAr: 'المشاريع العملية',
      titleEn: 'Projects',
      subtitleAr: 'المشاريع والأعمال البارزة',
      subtitleEn: 'Notable projects and applications',
      icon: FolderGit2,
      nextSection: 'customize',
      prevSection: 'certifications',
    },
    customize: {
      titleAr: 'القالب والتنسيق',
      titleEn: 'Template & Style',
      subtitleAr: 'اختيار القالب والألوان والخطوط',
      subtitleEn: 'Pick template, typography, and accent colors',
      icon: Layout,
      nextSection: 'ats',
      prevSection: 'projects',
    },
    ats: {
      titleAr: 'فحص جودة ATS',
      titleEn: 'ATS Quality Scan',
      subtitleAr: 'مطابقة السيرة الذاتية مع الوصف الوظيفي والتحسين',
      subtitleEn: 'Match your resume with a job description',
      icon: FileText,
      nextSection: 'download',
      prevSection: 'customize',
    },
    download: {
      titleAr: 'المراجعة والتصدير',
      titleEn: 'Review & Export',
      subtitleAr: 'معاينة نهائية وتحميل ملف الـPDF',
      subtitleEn: 'Final review and PDF export options',
      icon: Download,
      prevSection: 'ats',
    },
  };

  const current = sectionMeta[sectionKey];
  const Icon = current?.icon || User;
  const BackIcon = isAr ? ArrowRight : ArrowLeft;
  const ArrowNext = isAr ? ChevronLeft : ChevronRight;
  const ArrowPrev = isAr ? ChevronRight : ChevronLeft;

  const setIsUnlockModalOpen = useResumeStore((state) => state.setIsUnlockModalOpen);

  const handleUnlockRequest = () => {
    if (activation.remainingDownloads > 0) {
      setIsUnlockModalOpen(true);
    } else {
      setIsActivationModalOpen(true);
    }
  };

  const renderSectionForm = () => {
    switch (sectionKey) {
      case 'personal':
        return <PersonalInfoForm />;
      case 'experiences':
        return <ExperienceForm />;
      case 'education':
        return <EducationForm />;
      case 'skills':
        return <SkillsForm />;
      case 'certifications':
        return <CertificationsForm />;
      case 'projects':
        return <ProjectsForm />;
      case 'customize':
        return <CustomizeForm />;
      case 'ats':
        return <AtsAnalyzerPanel />;
      case 'download':
      default:
        return <DownloadSection />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4 pb-28 mobile-section-editor mobile-editor-content w-full max-w-full min-w-0 overflow-x-hidden section-enter"
    >
      {/* Floating Mid-Screen Navigation Arrows */}
      {current?.prevSection && (
        <button
          type="button"
          onClick={() => onNavigateSection(current.prevSection!)}
          className={`fixed top-1/2 -translate-y-1/2 z-40 w-8 h-8 flex items-center justify-center bg-white border border-slate-200/90 shadow-md rounded-full text-slate-400 hover:text-[#001639] transition active:scale-95 cursor-pointer ${
            isAr ? 'right-1' : 'left-1'
          }`}
          aria-label={isAr ? 'القسم السابق' : 'Previous Section'}
        >
          <ArrowPrev className="w-4 h-4" />
        </button>
      )}

      {current?.nextSection && (
        <button
          type="button"
          onClick={() => onNavigateSection(current.nextSection!)}
          className={`fixed top-1/2 -translate-y-1/2 z-40 w-8 h-8 flex items-center justify-center bg-white border border-slate-200/90 shadow-md rounded-full text-slate-400 hover:text-[#FF4D2D] transition active:scale-95 cursor-pointer ${
            isAr ? 'left-1' : 'right-1'
          }`}
          aria-label={isAr ? 'القسم التالي' : 'Next Section'}
        >
          <ArrowNext className="w-4 h-4" />
        </button>
      )}

      {/* Top Section Navigation Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-20 px-3.5 py-2.5 shadow-2xs w-full max-w-full min-w-0">
        <div className="flex items-center justify-between gap-2 w-full min-w-0">
          {/* Back Button to Dashboard */}
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer min-h-[38px] active:scale-95 shrink-0"
            aria-label={isAr ? 'الرجوع للأقسام' : 'Back to Sections'}
          >
            <BackIcon className="w-4 h-4 text-[#FF4D2D]" />
            <span className="text-xs">{isAr ? 'الأقسام' : 'Back'}</span>
          </button>

          {/* Section Title & Icon */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1 justify-center px-1 overflow-hidden">
            <div className="w-6 h-6 rounded-lg bg-[#001639] text-white flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-[#FF4D2D]" />
            </div>
            <h1 className="font-bold text-xs sm:text-sm text-slate-900 truncate text-center min-w-0">
              {isAr ? current?.titleAr : current?.titleEn}
            </h1>
          </div>

          {/* Actions: Autosave status & Quick Preview Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Autosave Status Minimal Indicator */}
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600 px-2 py-1 rounded-full bg-slate-100/80">
              {saveStatus === 'saving' ? (
                <>
                  <Loader2 className="w-3 h-3 text-amber-600 animate-spin" />
                  <span className="text-amber-700 hidden xxs:inline">
                    {isAr ? 'حفظ...' : 'Saving...'}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span className="hidden xxs:inline">{isAr ? 'محفوظ' : 'Saved'}</span>
                </>
              )}
            </div>

            {/* Quick Preview Button */}
            {onOpenPreview && (
              <button
                type="button"
                onClick={onOpenPreview}
                className="w-9 h-9 flex items-center justify-center text-[#001639] bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer active:scale-95 shrink-0"
                title={isAr ? 'معاينة السيرة' : 'Preview Resume'}
                aria-label={isAr ? 'معاينة السيرة' : 'Preview Resume'}
              >
                <Eye className="w-4 h-4 text-[#FF4D2D]" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lock Banner if Resume is Locked */}
      {activation.isResumeLocked && (
        <div className="px-3">
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col gap-3 text-amber-950 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <Lock className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-amber-950">
                  {isAr ? 'السيرة الذاتية مقفلة' : 'Resume is locked'}
                </h4>
                <p className="text-xs text-amber-950 font-medium leading-relaxed">
                  {isAr
                    ? 'تم تنزيل الـPDF وقفل الحقول لمنع التعديل غير المقصود.'
                    : 'Download complete. Resume locked to protect finalized version.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleUnlockRequest}
              className="w-full py-2.5 bg-[#001639] hover:bg-[#00245E] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer min-h-[44px] active:scale-98"
            >
              <Key className="w-4 h-4 text-amber-400" />
              <span>
                {activation.remainingDownloads > 0
                  ? isAr
                    ? 'فتح التعديل برصيد متبقي'
                    : 'Unlock with remaining credit'
                  : isAr
                  ? 'شراء تفعيل إضافي'
                  : 'Purchase unlock credit'}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="px-3 w-full max-w-full min-w-0 overflow-x-hidden">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs w-full max-w-full min-w-0 overflow-x-hidden mobile-form-card">
          <fieldset
            disabled={activation.isResumeLocked}
            className={`w-full min-w-0 max-w-full border-none p-0 m-0 block ${
              activation.isResumeLocked
                ? 'pointer-events-none opacity-75 select-none'
                : ''
            }`}
          >
            {renderSectionForm()}
          </fieldset>
        </div>
      </div>
    </motion.div>
  );
};
