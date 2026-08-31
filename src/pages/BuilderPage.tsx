import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../store/useResumeStore';
import { getTranslation } from '../i18n/translations';
import { useMediaQuery } from '../hooks/useMediaQuery';
import {
  clearDownloadCompletionFlags,
  validateResumeLockState,
} from '../utils/resumeFingerprint';

// Mobile Components
import { MobileResumeDashboard } from '../components/mobile/MobileResumeDashboard';
import { MobileSectionEditor, MobileSectionKey } from '../components/mobile/MobileSectionEditor';
import { MobileBottomNav } from '../components/mobile/MobileBottomNav';
import { MobilePreviewSheet } from '../components/mobile/MobilePreviewSheet';

// Form Components
import { PersonalInfoForm } from '../components/builder/PersonalInfoForm';
import { ExperienceForm } from '../components/builder/ExperienceForm';
import { EducationForm } from '../components/builder/EducationForm';
import { SkillsForm } from '../components/builder/SkillsForm';
import { ProjectsForm } from '../components/builder/ProjectsForm';
import { CertificationsForm } from '../components/builder/CertificationsForm';
import { CustomizeForm } from '../components/builder/CustomizeForm';
import { AtsAnalyzerPanel } from '../components/builder/AtsAnalyzerPanel';
import { DownloadSection } from '../components/builder/DownloadSection';
import { ResumePreview } from '../components/preview/ResumePreview';
import { LiveAtsMeter } from '../components/builder/LiveAtsMeter';
import { BuilderProgressBar } from '../components/builder/BuilderProgressBar';
import { NextStepBanner } from '../components/builder/NextStepBanner';
import { ResumeValidationModal } from '../components/common/ResumeValidationModal';
import { validateResumeMinimumRequirements, ResumeValidationResult } from '../utils/resumeValidation';

import {
  Layout,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  Globe,
  FolderGit2,
  Award,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Sparkles,
  CheckCircle2,
  Save,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Lock,
  Key,
} from 'lucide-react';

export const BuilderPage: React.FC = () => {
  const {
    settings,
    activeTab,
    setActiveTab,
    resetResume,
    resumeData,
    activation,
    lockResumeForEdits,
    unlockResumeWithCredit,
    setIsActivationModalOpen,
  } = useResumeStore();

  const isMobile = useMediaQuery('(max-width: 767px)');
  const [mobileActiveSection, setMobileActiveSection] = useState<MobileSectionKey | null>(null);

  // Desktop active section: null = Dashboard view, or a specific section key for focused editing
  const [desktopActiveSection, setDesktopActiveSection] = useState<
    | 'personal'
    | 'experiences'
    | 'education'
    | 'skills'
    | 'certifications'
    | 'projects'
    | 'customize'
    | 'ats'
    | 'pricing'
    | null
  >(null);

  // Tablet view mode switcher (768px - 1023px)
  const [tabletViewTab, setTabletViewTab] = useState<'editor' | 'preview'>('editor');

  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  // Start New Resume Confirmation Modal state
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [showResetToast, setShowResetToast] = useState(false);

  useEffect(() => {
    const handlePageShow = () => {
      const { isValid } = validateResumeLockState(activation, resumeData);
      if (isValid) {
        lockResumeForEdits();
      } else {
        clearDownloadCompletionFlags();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    handlePageShow();

    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [lockResumeForEdits, activation, resumeData]);

  // Mobile Bottom Sheet Preview State
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  // Resume Validation Modal for missing requirements
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationResult, setValidationResult] = useState<ResumeValidationResult | null>(null);

  // Auto-save notification feedback state
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving'>('saved');

  // Trigger auto-save visual indicator on resume data changes
  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      setSaveStatus('saved');
    }, 600);
    return () => clearTimeout(timer);
  }, [resumeData, settings]);

  // Handle ESC key to close desktop editor panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && desktopActiveSection !== null) {
        setDesktopActiveSection(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [desktopActiveSection]);

  // Dynamic section completion checkers
  const isPersonalInfoCompleted = Boolean(
    resumeData.personalInfo.fullName?.trim() &&
      (resumeData.personalInfo.email?.trim() || resumeData.personalInfo.phone?.trim())
  );
  const experiencesCount = resumeData.experiences?.length || 0;
  const isExperienceCompleted = Boolean(
    experiencesCount > 0 &&
      resumeData.experiences.some((e) => e.position?.trim() && e.company?.trim())
  );
  const educationCount = resumeData.education?.length || 0;
  const isEducationCompleted = Boolean(
    educationCount > 0 &&
      resumeData.education.some((e) => e.institution?.trim() && e.degree?.trim())
  );
  const skillsCount = resumeData.skills?.length || 0;
  const isSkillsCompleted = skillsCount > 0;
  const projectsCount = resumeData.projects?.length || 0;
  const isProjectsCompleted = projectsCount > 0;
  const certsCount = resumeData.certifications?.length || 0;
  const isCertificationsCompleted = certsCount > 0;

  // Dynamic completion percentage calculator
  const completionScore = React.useMemo(() => {
    let score = 0;
    if (resumeData.personalInfo.fullName?.trim()) score += 15;
    if (resumeData.personalInfo.email?.trim() || resumeData.personalInfo.phone?.trim()) score += 15;
    if (resumeData.personalInfo.summary?.trim()) score += 10;
    if (resumeData.experiences && resumeData.experiences.length > 0 && resumeData.experiences.some((e) => e.position?.trim())) score += 25;
    if (resumeData.education && resumeData.education.length > 0 && resumeData.education.some((e) => e.institution?.trim())) score += 15;
    if (resumeData.skills && resumeData.skills.length >= 2) score += 10;
    if ((resumeData.projects && resumeData.projects.length > 0) || (resumeData.certifications && resumeData.certifications.length > 0)) score += 10;
    return Math.min(100, score);
  }, [resumeData]);

  // Desktop sections configuration
  const DESKTOP_SECTIONS: Array<{
    id: 'personal' | 'experiences' | 'education' | 'skills' | 'certifications' | 'projects' | 'customize' | 'ats' | 'pricing';
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    icon: any;
    statusLabelAr: string;
    statusLabelEn: string;
    isComplete: boolean;
    isOptional?: boolean;
    accentColor: string;
  }> = [
    {
      id: 'personal',
      titleAr: 'البيانات الشخصية',
      titleEn: 'Personal Information',
      descriptionAr: resumeData.personalInfo.fullName?.trim()
        ? `${resumeData.personalInfo.fullName} ${resumeData.personalInfo.jobTitle ? `• ${resumeData.personalInfo.jobTitle}` : ''}`
        : 'الاسم، معلومات الاتصال، المسمى الوظيفي والملخص',
      descriptionEn: resumeData.personalInfo.fullName?.trim()
        ? `${resumeData.personalInfo.fullName} ${resumeData.personalInfo.jobTitle ? `• ${resumeData.personalInfo.jobTitle}` : ''}`
        : 'Full name, contact details, job title & summary',
      icon: User,
      statusLabelAr: isPersonalInfoCompleted ? 'مكتمل' : resumeData.personalInfo.fullName?.trim() ? 'قيد الإدخال' : 'لم تبدأ بعد',
      statusLabelEn: isPersonalInfoCompleted ? 'Complete' : resumeData.personalInfo.fullName?.trim() ? 'In Progress' : 'Not started',
      isComplete: isPersonalInfoCompleted,
      accentColor: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      id: 'experiences',
      titleAr: 'الخبرات المهنية',
      titleEn: 'Work Experience',
      descriptionAr: experiencesCount > 0
        ? `${experiencesCount} ${experiencesCount === 1 ? 'خبرة مسجلة' : 'خبرات مسجلة'}`
        : 'المناصب السابقة، الشركات والإنجازات المهنية',
      descriptionEn: experiencesCount > 0
        ? `${experiencesCount} ${experiencesCount === 1 ? 'role added' : 'roles added'}`
        : 'Previous positions, companies & achievements',
      icon: Briefcase,
      statusLabelAr: experiencesCount > 0 ? `${experiencesCount} خبرة` : 'لم تُضف بعد',
      statusLabelEn: experiencesCount > 0 ? `${experiencesCount} added` : 'Not added yet',
      isComplete: isExperienceCompleted,
      accentColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      id: 'education',
      titleAr: 'المؤهلات التعليمية',
      titleEn: 'Education',
      descriptionAr: educationCount > 0
        ? `${educationCount} ${educationCount === 1 ? 'مؤهل مضاف' : 'مؤهلات مضافة'}`
        : 'الدرجات الأكاديمية، الجامعات وسنوات التخرج',
      descriptionEn: educationCount > 0
        ? `${educationCount} ${educationCount === 1 ? 'degree added' : 'degrees added'}`
        : 'Academic degrees, universities & graduation years',
      icon: GraduationCap,
      statusLabelAr: educationCount > 0 ? `${educationCount} مؤهل` : 'لم تُضف بعد',
      statusLabelEn: educationCount > 0 ? `${educationCount} added` : 'Not added yet',
      isComplete: isEducationCompleted,
      accentColor: 'text-teal-600 bg-teal-50 border-teal-200',
    },
    {
      id: 'skills',
      titleAr: 'المهارات واللغات',
      titleEn: 'Skills & Languages',
      descriptionAr: skillsCount > 0
        ? `${skillsCount} ${skillsCount === 1 ? 'مهارة مسجلة' : 'مهارات مسجلة'}`
        : 'المهارات التقنية والشخصية، اللغات ومستويات الإتقان',
      descriptionEn: skillsCount > 0
        ? `${skillsCount} ${skillsCount === 1 ? 'skill added' : 'skills added'}`
        : 'Technical & soft skills, languages & proficiency',
      icon: Wrench,
      statusLabelAr: skillsCount > 0 ? `${skillsCount} مهارة` : 'لم تُضف بعد',
      statusLabelEn: skillsCount > 0 ? `${skillsCount} added` : 'Not added yet',
      isComplete: isSkillsCompleted,
      accentColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'certifications',
      titleAr: 'الشهادات والدورات',
      titleEn: 'Certifications',
      descriptionAr: certsCount > 0
        ? `${certsCount} ${certsCount === 1 ? 'شهادة مسجلة' : 'شهادات مسجلة'}`
        : 'الشهادات الاحترافية والدورات التدريبية المعتمدة',
      descriptionEn: certsCount > 0
        ? `${certsCount} ${certsCount === 1 ? 'cert added' : 'certs added'}`
        : 'Professional certificates & accredited licenses',
      icon: Award,
      statusLabelAr: certsCount > 0 ? `${certsCount} شهادة` : 'اختياري',
      statusLabelEn: certsCount > 0 ? `${certsCount} added` : 'Optional',
      isComplete: isCertificationsCompleted,
      isOptional: true,
      accentColor: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      id: 'projects',
      titleAr: 'المشاريع العملية',
      titleEn: 'Projects',
      descriptionAr: projectsCount > 0
        ? `${projectsCount} ${projectsCount === 1 ? 'مشروع مضاف' : 'مشاريع مضافة'}`
        : 'المشاريع التطبيقية والأعمال البارزة وروابطها',
      descriptionEn: projectsCount > 0
        ? `${projectsCount} ${projectsCount === 1 ? 'project added' : 'projects added'}`
        : 'Key applications, portfolios & practical projects',
      icon: FolderGit2,
      statusLabelAr: projectsCount > 0 ? `${projectsCount} مشروع` : 'اختياري',
      statusLabelEn: projectsCount > 0 ? `${projectsCount} added` : 'Optional',
      isComplete: isProjectsCompleted,
      isOptional: true,
      accentColor: 'text-violet-600 bg-violet-50 border-violet-200',
    },
    {
      id: 'customize',
      titleAr: 'القالب والتنسيق',
      titleEn: 'Template & Style',
      descriptionAr: `القالب الحالي: ${settings.templateId || 'BASSUX ATS'} • التخصيص والألوان`,
      descriptionEn: `Current template: ${settings.templateId || 'BASSUX ATS'} • Fonts & colors`,
      icon: Layout,
      statusLabelAr: 'محدد',
      statusLabelEn: 'Ready',
      isComplete: true,
      accentColor: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      id: 'ats',
      titleAr: 'فحص جودة ATS',
      titleEn: 'ATS Quality Scan',
      descriptionAr: 'مطابقة سيرتك الذاتية مع الوصف الوظيفي والتحسين',
      descriptionEn: 'Match your resume with a job description',
      icon: FileText,
      statusLabelAr: isPersonalInfoCompleted && isExperienceCompleted ? 'جاهز للفحص' : 'يتطلب البيانات',
      statusLabelEn: isPersonalInfoCompleted && isExperienceCompleted ? 'Ready to scan' : 'Needs info',
      isComplete: isPersonalInfoCompleted && isExperienceCompleted,
      accentColor: 'text-cyan-600 bg-cyan-50 border-cyan-200',
    },
    {
      id: 'pricing',
      titleAr: 'المراجعة والتصدير',
      titleEn: 'Review & Export',
      descriptionAr: 'افحص محتواك وتوافق الـ ATS وحمّل سيرتك الذاتية النهائية',
      descriptionEn: 'Check your content, ATS readiness, and download your final resume.',
      icon: Download,
      statusLabelAr: completionScore >= 40 ? 'جاهز للتحميل' : 'قيد الإنشاء',
      statusLabelEn: completionScore >= 40 ? 'Ready to Export' : 'In draft',
      isComplete: completionScore >= 40,
      accentColor: 'text-emerald-700 bg-emerald-50 border-emerald-300',
    },
  ];

  const currentSectionIndex = desktopActiveSection
    ? DESKTOP_SECTIONS.findIndex((s) => s.id === desktopActiveSection)
    : -1;

  const [isDraftSavedFeedback, setIsDraftSavedFeedback] = useState(false);

  const handleSaveDraft = () => {
    setIsDraftSavedFeedback(true);
    setTimeout(() => {
      setIsDraftSavedFeedback(false);
    }, 2200);
  };

  const handleOpenSection = (sectionId: typeof desktopActiveSection) => {
    if (!sectionId) return;
    setDesktopActiveSection(sectionId);
    setActiveTab(sectionId);
  };

  const handleNextSection = () => {
    if (currentSectionIndex >= 0 && currentSectionIndex < DESKTOP_SECTIONS.length - 1) {
      const nextId = DESKTOP_SECTIONS[currentSectionIndex + 1].id;
      setDesktopActiveSection(nextId);
      setActiveTab(nextId);
    } else {
      setDesktopActiveSection(null);
    }
  };

  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      const prevId = DESKTOP_SECTIONS[currentSectionIndex - 1].id;
      setDesktopActiveSection(prevId);
      setActiveTab(prevId);
    } else {
      setDesktopActiveSection(null);
    }
  };

  const handleUnlockRequest = () => {
    if (activation.remainingDownloads > 0) {
      const confirmMsg = isAr
        ? `لديك ${activation.remainingDownloads} تفعيل(ات) متبقية. هل ترغب في استخدام 1 تفعيل لفتح السيرة الذاتية للتعديل الآن؟`
        : `You have ${activation.remainingDownloads} credit(s) remaining. Use 1 credit to unlock editing for a new version?`;
      if (window.confirm(confirmMsg)) {
        const optionMsg = isAr
          ? `هل تريد الحفاظ على البيانات الحالية وتعديلها؟\n\nاضغط "موافق" (OK) للتحرير والتعديل.\nاضغط "إلغاء الأمر" (Cancel) لمسح كافة البيانات والبدء بسيرة ذاتية جديدة.`
          : `Do you want to keep and edit the current data?\n\nClick "OK" to keep and edit.\nClick "Cancel" to clear all data and start a fresh resume.`;
        
        const keepData = window.confirm(optionMsg);
        if (!keepData) {
          resetResume();
        }
        unlockResumeWithCredit();
      }
    } else {
      setIsActivationModalOpen(true);
    }
  };

  const renderSectionForm = (sectionId: string) => {
    switch (sectionId) {
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
      case 'pricing':
      default:
        return <DownloadSection />;
    }
  };

  const ArrowPrev = isAr ? ChevronRight : ChevronLeft;
  const ArrowNext = isAr ? ChevronLeft : ChevronRight;
  const ChevronIcon = isAr ? ChevronLeft : ChevronRight;

  const renderResetModal = () => (
    <AnimatePresence>
      {isResetModalOpen && (
        <motion.div
          key="reset-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
        >
          <motion.div
            key="reset-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="p-5 sm:p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {t.startNewResumeTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {t.startNewResumeDesc}
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-right text-xs text-amber-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'رصيد التحميل والخطط المفعلة ستبقى كما هي دون أي مساس.'
                    : 'Your activation credits and purchased plans remain intact.'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 transition cursor-pointer min-h-[44px]"
                >
                  {t.startNewResumeCancelBtn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetResume();
                    setIsResetModalOpen(false);
                    setActiveTab('personal');
                    setDesktopActiveSection(null);
                    setMobileActiveSection(null);
                    setShowResetToast(true);
                    setTimeout(() => setShowResetToast(false), 4000);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer min-h-[44px]"
                >
                  {t.startNewResumeConfirmBtn}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderResetToast = () => (
    <AnimatePresence>
      {showResetToast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 md:bottom-6 end-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-700 flex items-center gap-2.5 text-xs sm:text-sm font-medium"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{t.startNewResumeSuccessMsg}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Check if minimum resume requirements are completed
  const resumeValidation = React.useMemo(() => {
    return validateResumeMinimumRequirements(resumeData);
  }, [resumeData]);

  const isResumeReady = resumeValidation.isValid;

  const handleMobileDownloadClick = () => {
    // If not valid, show missing requirements modal immediately
    if (!resumeValidation.isValid) {
      setValidationResult(resumeValidation);
      setIsValidationModalOpen(true);
      return;
    }
    // If valid, navigate to download/export section
    setMobileActiveSection('download');
  };

  // ==========================================
  // MOBILE APP DASHBOARD (< 768px)
  // ==========================================
  if (isMobile) {
    return (
      <main className="bg-[#F8FAFC] min-h-screen page-content mobile-editor-page w-full max-w-full min-w-0 overflow-x-hidden" aria-label="Mobile Resume Builder">
        <AnimatePresence mode="wait">
          {mobileActiveSection ? (
            <MobileSectionEditor
              key={mobileActiveSection}
              sectionKey={mobileActiveSection}
              onBack={() => setMobileActiveSection(null)}
              onNavigateSection={(nextKey) => setMobileActiveSection(nextKey)}
              saveStatus={saveStatus}
            />
          ) : (
            <MobileResumeDashboard
              key="mobile-dashboard"
              onSelectSection={(key) => setMobileActiveSection(key)}
              onOpenResetModal={() => setIsResetModalOpen(true)}
              saveStatus={saveStatus}
            />
          )}
        </AnimatePresence>

        {/* Mobile Sticky Bottom Navigation */}
        <MobileBottomNav
          onOpenPreview={() => setIsMobilePreviewOpen(true)}
          onOpenDownload={handleMobileDownloadClick}
          isDownloadActive={mobileActiveSection === 'download'}
          isReadyForExport={isResumeReady}
        />

        {/* Fullscreen Mobile Preview Bottom Sheet */}
        <MobilePreviewSheet
          isOpen={isMobilePreviewOpen}
          onClose={() => setIsMobilePreviewOpen(false)}
          onGoToExport={handleMobileDownloadClick}
        />

        {/* Missing Requirements Validation Modal */}
        {validationResult && (
          <ResumeValidationModal
            isOpen={isValidationModalOpen}
            onClose={() => setIsValidationModalOpen(false)}
            validationResult={validationResult}
            onNavigateSection={(sectionKey) => {
              setIsValidationModalOpen(false);
              setMobileActiveSection(sectionKey);
            }}
          />
        )}

        {/* Start New Resume Confirmation Modal */}
        {renderResetModal()}

        {/* Reset Confirmation Toast */}
        {renderResetToast()}
      </main>
    );
  }

  // ==========================================
  // DESKTOP WORKSPACE DASHBOARD (>= 768px)
  // ==========================================
  const activeSectionData = desktopActiveSection
    ? DESKTOP_SECTIONS.find((s) => s.id === desktopActiveSection)
    : null;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* 1. Compact Sticky Workspace Header */}
      <header
        id="desktop-workspace-header"
        className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-14 sm:top-16 lg:top-[72px] z-30 shadow-2xs"
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Title & Active Path Breadcrumb */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#001639] text-white flex items-center justify-center font-bold text-xs shadow-2xs shrink-0">
                <Sparkles className="w-4 h-4 text-[#FF4D2D]" />
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <button
                  type="button"
                  onClick={() => setDesktopActiveSection(null)}
                  className={`font-black text-sm sm:text-base text-[#001639] hover:text-[#FF4D2D] transition cursor-pointer truncate ${
                    desktopActiveSection ? 'text-slate-500 font-bold hover:text-[#001639]' : ''
                  }`}
                >
                  {isAr ? 'محرر السيرة الذاتية' : 'Resume Builder'}
                </button>

                {activeSectionData && (
                  <>
                    <span className="text-slate-300 font-medium">/</span>
                    <span className="font-extrabold text-sm sm:text-base text-[#001639] truncate flex items-center gap-1.5">
                      <activeSectionData.icon className="w-4 h-4 text-slate-600 shrink-0" />
                      {isAr ? activeSectionData.titleAr : activeSectionData.titleEn}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Middle: Single Unified Progress Indicator */}
            <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200/80">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-medium">
                  {isAr ? 'اكتمال السيرة الذاتية:' : 'Resume completeness:'}
                </span>
                <span
                  className={`font-extrabold ${
                    completionScore >= 80
                      ? 'text-emerald-600'
                      : completionScore >= 50
                      ? 'text-amber-600'
                      : 'text-[#FF4D2D]'
                  }`}
                >
                  {completionScore}%
                </span>
              </div>
              <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    completionScore >= 80
                      ? 'bg-emerald-500'
                      : completionScore >= 50
                      ? 'bg-amber-500'
                      : 'bg-[#FF4D2D]'
                  }`}
                  style={{ width: `${completionScore}%` }}
                />
              </div>
            </div>

            {/* Actions: Autosave status & Start New Resume */}
            <div className="flex items-center gap-2">
              {/* Tablet View Switcher (768px - 1023px) */}
              <div className="flex lg:hidden bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setTabletViewTab('editor')}
                  className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                    tabletViewTab === 'editor' ? 'bg-white text-[#001639] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {isAr ? 'المحرر' : 'Editor'}
                </button>
                <button
                  type="button"
                  onClick={() => setTabletViewTab('preview')}
                  className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                    tabletViewTab === 'preview' ? 'bg-white text-[#001639] shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {isAr ? 'المعاينة' : 'Preview'}
                </button>
              </div>

              {/* Autosave Status Badge */}
              <div
                id="desktop-autosave-badge"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                  saveStatus === 'saving'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-200/80 shadow-2xs'
                }`}
                title={
                  isAr
                    ? 'يتم حفظ كافة تعديلاتك تلقائياً في ذاكرة المتصفح'
                    : 'All changes saved automatically in local browser storage'
                }
              >
                {saveStatus === 'saving' ? (
                  <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin shrink-0" />
                ) : (
                  <span className="saved-check">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </span>
                )}
                <span className="font-semibold whitespace-nowrap text-[11px] sm:text-xs">
                  {saveStatus === 'saving'
                    ? isAr
                      ? 'جارِ الحفظ...'
                      : 'Saving...'
                    : isAr
                    ? 'محفوظ'
                    : 'Saved'}
                </span>
              </div>

              {/* Start New Resume Action - Subtle Secondary Link */}
              <button
                type="button"
                id="btn-start-new-resume"
                onClick={() => setIsResetModalOpen(true)}
                className="inline-flex items-center gap-1 text-slate-400 hover:text-slate-700 hover:underline text-[11px] font-medium transition cursor-pointer ms-1 shrink-0"
                title={t.startNewResume}
              >
                <RotateCcw className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="hidden sm:inline">{t.startNewResume}</span>
                <span className="sm:hidden">{isAr ? 'جديد' : 'New'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Two-Column Desktop Workspace Area */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* Global Resume Locked Alert if Downloaded */}
        {activation.isResumeLocked && (
          <div className="mb-5 p-4 bg-amber-50/90 border border-amber-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-950 shadow-xs animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-200/80 rounded-xl text-amber-900 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-xs sm:text-sm text-amber-950">
                  {isAr
                    ? 'تم تنزيل الـPDF — تم إقفال السيرة الذاتية لمنع التعديل'
                    : 'Download complete — your resume is locked for editing.'}
                </h4>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  {isAr
                    ? 'لحماية نسختك المعتمدة وتجنب التعديلات غير المقصودة، تم قفل الحقول.'
                    : 'To protect your downloaded version and prevent accidental changes, fields are locked.'}
                </p>
                {activation.remainingDownloads > 0 && (
                  <p className="text-[11px] font-bold text-emerald-800">
                    {isAr
                      ? `لديك رصيد متبقي: ${activation.remainingDownloads} تفعيل(ات)`
                      : `Remaining credits: ${activation.remainingDownloads} activation(s)`}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleUnlockRequest}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#001639] hover:bg-[#00245E] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition shrink-0 cursor-pointer shadow-xs active:scale-98"
            >
              <Key className="w-4 h-4 text-amber-400" />
              <span>
                {activation.remainingDownloads > 0
                  ? isAr
                    ? 'فتح التعديل باستخدام تفعيل متبقي'
                    : 'Unlock to Edit with Credit'
                  : isAr
                  ? 'هل تحتاج لإجراء تعديلات؟ اشترِ تفعيل إضافي'
                  : 'Need to make changes? Purchase another download credit.'}
              </span>
            </button>
          </div>
        )}

        {/* Dynamic 5-Step Visual Progress Bar */}
        <div className="mb-5">
          <BuilderProgressBar
            currentSection={desktopActiveSection || activeTab}
            onSelectSection={(sec) => {
              setDesktopActiveSection(sec as any);
              setActiveTab(sec as any);
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Workspace Dashboard OR Focused Section Editor */}
          {/* ========================================================= */}
          <div
            className={`w-full ${
              tabletViewTab === 'preview' ? 'hidden lg:block' : 'block'
            } lg:col-span-6 xl:col-span-6 space-y-4`}
          >
            <AnimatePresence mode="wait">
              {desktopActiveSection ? (
                /* ------------------------------------------- */
                /* A. Focused Section Editor Panel             */
                /* ------------------------------------------- */
                <motion.div
                  key={`editor-panel-${desktopActiveSection}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden section-enter"
                >
                  {/* Editor Panel Header */}
                  <div className="p-4 sm:p-5 border-b border-slate-200/80 bg-slate-50/70 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {activeSectionData && (
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`p-2 rounded-xl border shrink-0 ${activeSectionData.accentColor}`}>
                            <activeSectionData.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                          </div>
                          <div className="truncate">
                            <h2 className="font-extrabold text-sm sm:text-base text-[#001639] truncate">
                              {isAr ? activeSectionData.titleAr : activeSectionData.titleEn}
                            </h2>
                            <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                              {isAr ? activeSectionData.descriptionAr : activeSectionData.descriptionEn}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setDesktopActiveSection(null)}
                        className="p-2 rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer shadow-2xs active:scale-95"
                        title={isAr ? 'إغلاق والعودة للأقسام' : 'Close and return to sections'}
                        aria-label={isAr ? 'إغلاق' : 'Close'}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Editor Panel Form Body */}
                  <div className="p-4 sm:p-6 lg:p-7 text-[#0B1120]">
                    <fieldset
                      disabled={activation.isResumeLocked}
                      className={
                        activation.isResumeLocked
                          ? 'pointer-events-none opacity-75 select-none relative border-none p-0 m-0'
                          : 'border-none p-0 m-0'
                      }
                    >
                      {renderSectionForm(desktopActiveSection)}
                    </fieldset>
                  </div>

                  {/* Editor Panel Footer Actions */}
                  <div className="p-4 sm:p-5 border-t border-slate-200/80 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
                    {/* 1. Back to sections */}
                    <button
                      type="button"
                      onClick={() => setDesktopActiveSection(null)}
                      className="px-3.5 sm:px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer shadow-2xs flex items-center gap-1.5 active:scale-98"
                    >
                      <ArrowPrev className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isAr ? 'الرجوع للأقسام' : 'Back to sections'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {/* 2. Save draft */}
                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 active:scale-98 ${
                          isDraftSavedFeedback
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 shadow-2xs'
                        }`}
                      >
                        {isDraftSavedFeedback ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            <span>{isAr ? 'تم حفظ المسودة' : 'Draft saved'}</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5 text-slate-500" />
                            <span>{isAr ? 'حفظ المسودة' : 'Save draft'}</span>
                          </>
                        )}
                      </button>

                      {/* 3. Next: [Section Name] */}
                      {currentSectionIndex < DESKTOP_SECTIONS.length - 1 && (
                        <button
                          type="button"
                          onClick={handleNextSection}
                          className="px-3.5 sm:px-4 py-2 bg-[#001639] hover:bg-[#00245E] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs cursor-pointer active:scale-98"
                        >
                          <span>
                            {isAr
                              ? `التالي: ${DESKTOP_SECTIONS[currentSectionIndex + 1]?.titleAr}`
                              : `Next: ${DESKTOP_SECTIONS[currentSectionIndex + 1]?.titleEn}`}
                          </span>
                          <ArrowNext className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* ------------------------------------------- */
                /* B. Desktop Sections Dashboard Cards         */
                /* ------------------------------------------- */
                <motion.div
                  key="dashboard-overview"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.12 }}
                  className="space-y-6"
                >
                  {/* Dashboard Welcome & Overview Card with Next Step Guidance */}
                  <div className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <div className="space-y-1">
                      <h2 className={`text-base sm:text-lg text-[#001639] ${
                        isAr ? 'builder-page-title-ar' : 'builder-page-title-en'
                      }`}>
                        {isAr ? 'أنشئ سيرتك الذاتية' : 'Build your resume'}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        {isAr
                          ? 'أضف محتواك، حسّنه باحترافية، وصدّره عندما تصبح جاهزاً.'
                          : 'Add your content, improve it, and export when ready.'}
                      </p>
                    </div>

                    {/* What to do now / Recommended Next Step */}
                    <NextStepBanner
                      variant="highlight"
                      isAr={isAr}
                      stepTextAr={
                        !resumeData.personalInfo.fullName?.trim()
                          ? 'أكمل البيانات الشخصية (الاسم الكامل والمسمى الوظيفي المستهدف).'
                          : experiencesCount === 0
                          ? 'أضف أحدث خبرة مهنية أو وظيفة سابقة لديك.'
                          : educationCount === 0
                          ? 'أضف مؤهلك التعليمي أو شهادتك الجامعية.'
                          : skillsCount < 3
                          ? 'أضف مهاراتك الأساسية المتوافقة مع متطلبات الوظيفة.'
                          : 'راجع سيرتك الذاتية وتأكد من توافقها مع الـ ATS قبل التصدير.'
                      }
                      stepTextEn={
                        !resumeData.personalInfo.fullName?.trim()
                          ? 'Complete Personal Information (full name & target job title).'
                          : experiencesCount === 0
                          ? 'Add your most recent work experience.'
                          : educationCount === 0
                          ? 'Add your education and qualifications.'
                          : skillsCount < 3
                          ? 'Add your key skills matching target job requirements.'
                          : 'Review your resume and check ATS readiness before export.'
                      }
                      actionTextAr={
                        !resumeData.personalInfo.fullName?.trim()
                          ? 'تعديل البيانات'
                          : experiencesCount === 0
                          ? 'إضافة خبرة'
                          : educationCount === 0
                          ? 'إضافة مؤهل'
                          : skillsCount < 3
                          ? 'إضافة مهارات'
                          : 'مراجعة وتصدير'
                      }
                      actionTextEn={
                        !resumeData.personalInfo.fullName?.trim()
                          ? 'Edit Info'
                          : experiencesCount === 0
                          ? 'Add Experience'
                          : educationCount === 0
                          ? 'Add Education'
                          : skillsCount < 3
                          ? 'Add Skills'
                          : 'Review & Export'
                      }
                      onAction={() => {
                        if (!resumeData.personalInfo.fullName?.trim()) {
                          handleOpenSection('personal');
                        } else if (experiencesCount === 0) {
                          handleOpenSection('experiences');
                        } else if (educationCount === 0) {
                          handleOpenSection('education');
                        } else if (skillsCount < 3) {
                          handleOpenSection('skills');
                        } else {
                          handleOpenSection('pricing');
                        }
                      }}
                    />
                  </div>

                  {/* Group 1: Your Content */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-1">
                      <span className="w-2 h-2 rounded-full bg-[#001639]"></span>
                      <h3 className="text-xs sm:text-sm font-extrabold text-[#001639] uppercase tracking-wider">
                        {isAr ? 'محتوى السيرة الذاتية' : 'Your content'}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5" id="desktop-content-sections-grid">
                      {DESKTOP_SECTIONS.filter((sec) =>
                        ['personal', 'experiences', 'education', 'skills', 'certifications', 'projects'].includes(sec.id)
                      ).map((sec) => {
                        const Icon = sec.icon;

                        return (
                          <button
                            key={sec.id}
                            type="button"
                            id={`desktop-section-card-${sec.id}`}
                            onClick={() => handleOpenSection(sec.id)}
                            className="w-full text-start p-4 rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-all duration-180 flex flex-col justify-between gap-3 group cursor-pointer bg-white hover:bg-slate-50/90 shadow-2xs hover:shadow-xs relative overflow-hidden focus-visible:ring-2 focus-visible:ring-[#001639] focus:outline-none"
                          >
                            <div className="flex items-start justify-between gap-2.5 w-full">
                              <div className="flex items-start gap-3 min-w-0 flex-1">
                                <div
                                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${sec.accentColor}`}
                                >
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-bold text-sm text-[#001639] group-hover:text-[#FF4D2D] transition leading-snug break-words line-clamp-2">
                                    {isAr ? sec.titleAr : sec.titleEn}
                                  </h3>
                                  <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug mt-0.5">
                                    {isAr ? sec.descriptionAr : sec.descriptionEn}
                                  </p>
                                </div>
                              </div>

                              {/* Section Status Badge */}
                              <div className="shrink-0 flex items-center gap-1.5 mt-0.5">
                                {sec.isComplete ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap section-complete">
                                    <Check className="w-3 h-3" />
                                    <span>{isAr ? sec.statusLabelAr : sec.statusLabelEn}</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
                                    {isAr ? sec.statusLabelAr : sec.statusLabelEn}
                                  </span>
                                )}
                                <ChevronIcon className="w-4 h-4 text-slate-400 group-hover:text-[#001639] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform shrink-0" />
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Group 2: Improve & Export */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 px-1">
                      <span className="w-2 h-2 rounded-full bg-[#FF4D2D]"></span>
                      <h3 className="text-xs sm:text-sm font-extrabold text-[#001639] uppercase tracking-wider">
                        {isAr ? 'التحسين والتصدير' : 'Improve & export'}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5" id="desktop-tools-sections-grid">
                      {DESKTOP_SECTIONS.filter((sec) =>
                        ['customize', 'ats', 'pricing'].includes(sec.id)
                      ).map((sec) => {
                        const Icon = sec.icon;

                        return (
                          <button
                            key={sec.id}
                            type="button"
                            id={`desktop-section-card-${sec.id}`}
                            onClick={() => handleOpenSection(sec.id)}
                            className={`w-full text-start p-4 rounded-2xl border transition-all duration-180 flex flex-col justify-between gap-3 group cursor-pointer shadow-2xs hover:shadow-xs relative overflow-hidden focus-visible:ring-2 focus-visible:ring-[#001639] focus:outline-none ${
                              sec.id === 'pricing'
                                ? 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/70 sm:col-span-2'
                                : 'border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50/90'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2.5 w-full">
                              <div className="flex items-start gap-3 min-w-0 flex-1">
                                <div
                                  className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${sec.accentColor}`}
                                >
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="font-bold text-sm text-[#001639] group-hover:text-[#FF4D2D] transition leading-snug break-words line-clamp-2">
                                    {isAr ? sec.titleAr : sec.titleEn}
                                  </h3>
                                  <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug mt-0.5">
                                    {isAr ? sec.descriptionAr : sec.descriptionEn}
                                  </p>
                                </div>
                              </div>

                              {/* Section Status Badge */}
                              <div className="shrink-0 flex items-center gap-1.5 mt-0.5">
                                {sec.isComplete ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 whitespace-nowrap section-complete">
                                    <Check className="w-3 h-3" />
                                    <span>{isAr ? sec.statusLabelAr : sec.statusLabelEn}</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 whitespace-nowrap">
                                    {isAr ? sec.statusLabelAr : sec.statusLabelEn}
                                  </span>
                                )}
                                <ChevronIcon className="w-4 h-4 text-slate-400 group-hover:text-[#001639] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform shrink-0" />
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Large Sticky Real-Time Live Preview         */}
          {/* ========================================================= */}
          <div
            id="desktop-preview-column"
            className={`w-full ${
              tabletViewTab === 'editor' ? 'hidden lg:block' : 'block'
            } lg:col-span-6 xl:col-span-6 sticky top-28 h-[calc(100vh-8.5rem)] min-h-[640px] transition-all duration-200`}
          >
            <div className="h-full bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col">
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>

      {/* Start New Resume Confirmation Modal */}
      {renderResetModal()}

      {/* Reset Confirmation Toast */}
      {renderResetToast()}

      {/* App Version Tag (Development Only) */}
      {import.meta.env.DEV && (
        <div id="editor-version-flag" className="text-center py-2 text-[10px] font-mono text-slate-400 select-none pb-20 sm:pb-4 mt-8">
          UPDATE VER 3.2
        </div>
      )}
    </main>
  );
};

