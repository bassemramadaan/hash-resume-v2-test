import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { calculateCompletionScore } from '../../utils/resumeCompletion';
import { Logo } from '../ui/Logo';
import { MobileMenuDrawer } from './MobileMenuDrawer';
import { MobileSectionKey } from './MobileSectionEditor';
import {
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Award,
  FolderGit2,
  Layout,
  FileText,
  Download,
  Menu,
  RotateCcw,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  Check,
  Lock,
  Key,
} from 'lucide-react';
import { validateResumeMinimumRequirements } from '../../utils/resumeValidation';
import { NextStepBanner } from '../builder/NextStepBanner';

interface MobileResumeDashboardProps {
  onSelectSection: (key: MobileSectionKey) => void;
  onOpenResetModal: () => void;
  saveStatus: 'saved' | 'saving';
}

export const MobileResumeDashboard: React.FC<MobileResumeDashboardProps> = ({
  onSelectSection,
  onOpenResetModal,
  saveStatus,
}) => {
  const { resumeData, settings, activation, unlockResumeWithCredit, resetResume, setIsActivationModalOpen } =
    useResumeStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Overall Completion Calculation (Strict 0% on clean state)
  const completionScore = useResumeStore((state) => calculateCompletionScore(state.resumeData));

  // Section completion checks
  const isPersonalComplete = Boolean(
    resumeData.personalInfo.fullName?.trim() &&
      (resumeData.personalInfo.email?.trim() || resumeData.personalInfo.phone?.trim())
  );
  const experiencesCount = resumeData.experiences?.length || 0;
  const educationCount = resumeData.education?.length || 0;
  const skillsCount = resumeData.skills?.length || 0;
  const certsCount = resumeData.certifications?.length || 0;
  const projectsCount = resumeData.projects?.length || 0;

  // Completed Core Sections Count (Out of 6)
  const completedSectionsCount = React.useMemo(() => {
    let count = 0;
    if (isPersonalComplete) count++;
    if (experiencesCount > 0) count++;
    if (educationCount > 0) count++;
    if (skillsCount > 0) count++;
    if (certsCount > 0) count++;
    if (projectsCount > 0) count++;
    return count;
  }, [isPersonalComplete, experiencesCount, educationCount, skillsCount, certsCount, projectsCount]);

  // Recommended Next Step calculation
  const recommendedNextStep = React.useMemo(() => {
    if (!resumeData.personalInfo.fullName?.trim()) {
      return {
        key: 'personal' as MobileSectionKey,
        textAr: 'أكمل البيانات الشخصية (الاسم والمسمى المستهدف).',
        textEn: 'Complete Personal Information (name & target title).',
        actionAr: 'تعديل البيانات الشخصية',
        actionEn: 'Fill Personal Info',
      };
    }
    if (experiencesCount === 0) {
      return {
        key: 'experiences' as MobileSectionKey,
        textAr: 'أضف أحدث خبرة مهنية أو وظيفة سابقة.',
        textEn: 'Add your most recent work experience.',
        actionAr: 'إضافة خبرة',
        actionEn: 'Add Experience',
      };
    }
    if (educationCount === 0) {
      return {
        key: 'education' as MobileSectionKey,
        textAr: 'أضف مؤهلك التعليمي أو شهادتك الجامعية.',
        textEn: 'Add your education and qualifications.',
        actionAr: 'إضافة مؤهل',
        actionEn: 'Add Education',
      };
    }
    if (skillsCount < 3) {
      return {
        key: 'skills' as MobileSectionKey,
        textAr: 'أضف مهاراتك الأساسية المتوافقة مع الوظيفة المستهدفة.',
        textEn: 'Add your key skills matching your target job.',
        actionAr: 'إضافة مهارات',
        actionEn: 'Add Skills',
      };
    }
    return {
      key: 'download' as MobileSectionKey,
      textAr: 'راجع سيرتك الذاتية وتأكد من توافقها مع الـ ATS قبل التصدير.',
      textEn: 'Review your resume and check ATS readiness before export.',
      actionAr: 'مراجعة وتصدير',
      actionEn: 'Review & Export',
    };
  }, [resumeData, experiencesCount, educationCount, skillsCount]);

  const getSectionStatus = (key: MobileSectionKey): { label: string; isComplete: boolean } => {
    switch (key) {
      case 'personal':
        if (isPersonalComplete) return { label: isAr ? 'مكتمل' : 'Complete', isComplete: true };
        if (resumeData.personalInfo.fullName?.trim())
          return { label: isAr ? 'قيد الإدخال' : 'In Progress', isComplete: false };
        return { label: isAr ? 'لم تُضف بعد' : 'Not added yet', isComplete: false };

      case 'experiences':
        if (experiencesCount > 0) {
          const text =
            experiencesCount === 1
              ? isAr
                ? 'خبرة واحدة مضافة'
                : '1 item added'
              : isAr
              ? `${experiencesCount} خبرات مضافة`
              : `${experiencesCount} items added`;
          return { label: text, isComplete: true };
        }
        return { label: isAr ? 'لم تُضف بعد' : 'Not added yet', isComplete: false };

      case 'education':
        if (educationCount > 0) {
          const text =
            educationCount === 1
              ? isAr
                ? 'مؤهل واحد مضاف'
                : '1 item added'
              : isAr
              ? `${educationCount} مؤهلات مضافة`
              : `${educationCount} items added`;
          return { label: text, isComplete: true };
        }
        return { label: isAr ? 'لم تُضف بعد' : 'Not added yet', isComplete: false };

      case 'skills':
        if (skillsCount > 0) {
          const text =
            skillsCount === 1
              ? isAr
                ? 'مهارة واحدة مضافة'
                : '1 skill added'
              : isAr
              ? `${skillsCount} مهارات مضافة`
              : `${skillsCount} skills added`;
          return { label: text, isComplete: true };
        }
        return { label: isAr ? 'لم تُضف بعد' : 'Not added yet', isComplete: false };

      case 'certifications':
        if (certsCount > 0) {
          const text =
            certsCount === 1
              ? isAr
                ? 'شهادة واحدة'
                : '1 cert added'
              : isAr
              ? `${certsCount} شهادات`
              : `${certsCount} certs added`;
          return { label: text, isComplete: true };
        }
        return { label: isAr ? 'اختياري' : 'Optional', isComplete: false };

      case 'projects':
        if (projectsCount > 0) {
          const text =
            projectsCount === 1
              ? isAr
                ? 'مشروع واحد'
                : '1 project added'
              : isAr
              ? `${projectsCount} مشاريع`
              : `${projectsCount} projects added`;
          return { label: text, isComplete: true };
        }
        return { label: isAr ? 'اختياري' : 'Optional', isComplete: false };

      case 'customize':
        return {
          label: isAr
            ? `القالب: ${settings.templateId || 'كلاسيك'}`
            : `Template: ${settings.templateId || 'Classic'}`,
          isComplete: true,
        };

      case 'ats':
        return {
          label: isPersonalComplete && experiencesCount > 0
            ? isAr ? 'جاهز للفحص' : 'Ready to scan'
            : isAr ? 'يتطلب البيانات' : 'Needs info',
          isComplete: isPersonalComplete && experiencesCount > 0,
        };

      case 'download': {
        const isReady = validateResumeMinimumRequirements(resumeData).isValid;
        return {
          label: isReady
            ? isAr ? 'جاهز لتحميل PDF' : 'Ready to download PDF'
            : isAr ? 'مراجعة وتصدير' : 'Review & export',
          isComplete: isReady,
        };
      }

      default:
        return { label: '', isComplete: false };
    }
  };

  const SECTIONS: Array<{
    key: MobileSectionKey;
    titleAr: string;
    titleEn: string;
    icon: any;
    accentColor?: string;
  }> = [
    { key: 'personal', titleAr: 'البيانات الشخصية', titleEn: 'Personal Information', icon: User },
    { key: 'experiences', titleAr: 'الخبرات المهنية', titleEn: 'Work Experience', icon: Briefcase },
    { key: 'education', titleAr: 'المؤهلات التعليمية', titleEn: 'Education', icon: GraduationCap },
    { key: 'skills', titleAr: 'المهارات واللغات', titleEn: 'Skills & Languages', icon: Wrench },
    { key: 'certifications', titleAr: 'الشهادات والدورات', titleEn: 'Certifications', icon: Award },
    { key: 'projects', titleAr: 'المشاريع العملية', titleEn: 'Projects', icon: FolderGit2 },
    { key: 'customize', titleAr: 'القالب والتنسيق', titleEn: 'Template & Style', icon: Layout },
    { key: 'ats', titleAr: 'فحص جودة ATS', titleEn: 'ATS Quality Scan', icon: FileText },
    { key: 'download', titleAr: 'المراجعة والتصدير', titleEn: 'Review & Export', icon: Download },
  ];

  const Arrow = isAr ? ChevronLeft : ChevronRight;

  const setIsUnlockModalOpen = useResumeStore((state) => state.setIsUnlockModalOpen);

  const handleUnlockRequest = () => {
    if (activation.remainingDownloads > 0) {
      setIsUnlockModalOpen(true);
    } else {
      setIsActivationModalOpen(true);
    }
  };

  return (
    <div className="space-y-4 pb-28 w-full max-w-full min-w-0 overflow-x-hidden mobile-editor-content">
      {/* Compact Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3.5 py-2.5 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          {/* Logo & Name */}
          <div className="flex items-center gap-2">
            <Logo variant="icon" size="sm" className="!h-8 w-auto shrink-0" />
            <div className="flex flex-col">
              <span className="font-brand font-extrabold text-sm text-[#001639] leading-tight">
                Hash <span className="text-[#FF4D2D]">Resume</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium leading-none">
                {isAr ? 'محرر السيرة الذاتية' : 'Resume Builder'}
              </span>
            </div>
          </div>

          {/* Autosave badge & actions */}
          <div className="flex items-center gap-1.5">
            {/* Autosave status indicator */}
            <div
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold border transition-all duration-200 ${
                saveStatus === 'saving'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
              }`}
            >
              {saveStatus === 'saving' ? (
                <Loader2 className="w-3 h-3 text-amber-600 animate-spin shrink-0" />
              ) : (
                <span className="saved-check">
                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                </span>
              )}
              <span>
                {saveStatus === 'saving'
                  ? isAr
                    ? 'جارِ الحفظ...'
                    : 'Saving...'
                  : isAr
                  ? 'محفوظ'
                  : 'Saved'}
              </span>
            </div>

            {/* Reset / Clear Button */}
            <button
              type="button"
              onClick={onOpenResetModal}
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl border border-slate-200 transition cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              title={isAr ? 'بدء سيرة جديدة' : 'Start New Resume'}
              aria-label={isAr ? 'بدء سيرة جديدة' : 'Start New Resume'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="p-2 text-[#001639] hover:bg-slate-100 rounded-xl border border-slate-200 transition min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer"
              aria-label={isAr ? 'فتح القائمة' : 'Open Menu'}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Lock Banner if Resume is Locked */}
      {activation.isResumeLocked && (
        <div className="px-3">
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col gap-2.5 text-amber-950 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <Lock className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-amber-950">
                  {isAr ? 'تم قفل السيرة الذاتية بعد التحميل' : 'Resume Locked After Download'}
                </h4>
                <p className="text-[11px] text-amber-900/90 leading-relaxed">
                  {isAr
                    ? 'لحماية نسختك المعتمدة، تم قفل الحقول لمنع التعديلات العشوائية.'
                    : 'Fields are locked to protect your finalized download.'}
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

      {/* Progress & Header Card */}
      <div className="px-3">
        <div className="bg-gradient-to-br from-[#001639] to-[#00245E] text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[#FF4D2D] text-[10px] font-extrabold tracking-wide uppercase">
                <Sparkles className="w-3 h-3" />
                <span>{isAr ? 'محرر السيرة الذاتية' : 'Resume Builder'}</span>
              </span>
              <h1 className="text-base sm:text-lg font-bold text-white mt-1">
                {isAr ? 'ابنِ سيرتك الذاتية' : 'Build your resume'}
              </h1>
              <p className="text-xs text-slate-300">
                {isAr ? 'أضف بياناتك لبناء سيرتك الذاتية' : 'Add your information to build your resume'}
              </p>
            </div>

            {/* Percentage Badge */}
            <div className="text-end shrink-0">
              <span
                className={`text-xl font-black ${
                  completionScore >= 80
                    ? 'text-emerald-400'
                    : completionScore >= 40
                    ? 'text-amber-400'
                    : 'text-[#FF4D2D]'
                }`}
              >
                {completionScore}%
              </span>
              <span className="block text-[10px] text-slate-300 font-semibold">
                {isAr ? 'مكتمل' : 'complete'}
              </span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionScore}%` }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className={`h-full rounded-full progress-fill ${
                completionScore >= 80
                  ? 'bg-emerald-400'
                  : completionScore >= 40
                  ? 'bg-amber-400'
                  : 'bg-[#FF4D2D]'
              }`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-0.5">
            <span className="font-semibold text-white">
              {isAr
                ? `اكتمل ${completedSectionsCount} من 6 أقسام`
                : `${completedSectionsCount} of 6 sections complete`}
            </span>
            <span className="font-bold text-white">
              {completionScore >= 80
                ? isAr ? 'ممتاز ⭐' : 'Excellent ⭐'
                : completionScore >= 40
                ? isAr ? 'جيد 👍' : 'Good 👍'
                : isAr ? 'غير مكتمل' : 'Incomplete'}
            </span>
          </div>
        </div>

        {/* Recommended Next Step Guidance */}
        <div className="mt-3">
          <NextStepBanner
            variant="highlight"
            isAr={isAr}
            stepTextAr={recommendedNextStep.textAr}
            stepTextEn={recommendedNextStep.textEn}
            actionTextAr={recommendedNextStep.actionAr}
            actionTextEn={recommendedNextStep.actionEn}
            onAction={() => onSelectSection(recommendedNextStep.key)}
          />
        </div>
      </div>

      {/* Section Cards List Grouped */}
      <div className="px-3 space-y-5" role="list">
        {/* Group 1: Your Content */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-full bg-[#001639]"></span>
            <h3 className="text-xs font-extrabold text-[#001639] uppercase tracking-wider">
              {isAr ? 'محتوى السيرة الذاتية' : 'Your content'}
            </h3>
          </div>

          <div className="space-y-2">
            {SECTIONS.filter((sec) =>
              ['personal', 'experiences', 'education', 'skills', 'certifications', 'projects'].includes(sec.key)
            ).map((sec, idx) => {
              const Icon = sec.icon;
              const status = getSectionStatus(sec.key);

              return (
                <motion.button
                  key={sec.key}
                  type="button"
                  onClick={() => onSelectSection(sec.key)}
                  whileTap={{ scale: 0.98 }}
                  role="listitem"
                  className="w-full min-h-[58px] p-3.5 bg-white border border-slate-200 hover:border-[#001639]/40 rounded-2xl shadow-2xs flex items-center justify-between gap-3 text-start transition cursor-pointer group active:bg-slate-50"
                  aria-label={`${isAr ? sec.titleAr : sec.titleEn} - ${status.label}`}
                >
                  {/* Left/Start: Icon & Titles */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition ${
                        status.isComplete
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                          : 'bg-slate-100 text-[#001639] group-hover:bg-[#001639] group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1 truncate">
                      <h4 className="font-bold text-xs sm:text-sm text-[#001639] truncate">
                        {isAr ? sec.titleAr : sec.titleEn}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        {status.label}
                      </p>
                    </div>
                  </div>

                  {/* Right/End: Status Pill & Arrow */}
                  <div className="flex items-center gap-2 shrink-0">
                    {status.isComplete ? (
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center section-complete">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-600 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 hidden xs:inline-block">
                        {idx + 1}
                      </span>
                    )}

                    <Arrow className="w-4 h-4 text-slate-500 group-hover:text-[#001639] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Group 2: Improve & Export */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2 px-1">
            <span className="w-2 h-2 rounded-full bg-[#FF4D2D]"></span>
            <h3 className="text-xs font-extrabold text-[#001639] uppercase tracking-wider">
              {isAr ? 'التحسين والتصدير' : 'Improve & export'}
            </h3>
          </div>

          <div className="space-y-2">
            {SECTIONS.filter((sec) =>
              ['customize', 'ats', 'download'].includes(sec.key)
            ).map((sec) => {
              const Icon = sec.icon;
              const status = getSectionStatus(sec.key);

              return (
                <motion.button
                  key={sec.key}
                  type="button"
                  onClick={() => onSelectSection(sec.key)}
                  whileTap={{ scale: 0.98 }}
                  role="listitem"
                  className={`w-full min-h-[58px] p-3.5 rounded-2xl shadow-2xs flex items-center justify-between gap-3 text-start transition cursor-pointer group active:bg-slate-50 border ${
                    sec.key === 'download'
                      ? 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50/70'
                      : 'bg-white border-slate-200 hover:border-[#001639]/40'
                  }`}
                  aria-label={`${isAr ? sec.titleAr : sec.titleEn} - ${status.label}`}
                >
                  {/* Left/Start: Icon & Titles */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition ${
                        status.isComplete
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                          : 'bg-slate-100 text-[#001639] group-hover:bg-[#001639] group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1 truncate">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs sm:text-sm text-[#001639] truncate">
                          {isAr ? sec.titleAr : sec.titleEn}
                        </h4>
                        {sec.key === 'ats' && (
                          <span className="px-1.5 py-0.5 rounded-md bg-orange-100 text-[#FF4D2D] text-[9px] font-extrabold shrink-0">
                            AI
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        {status.label}
                      </p>
                    </div>
                  </div>

                  {/* Right/End: Status Pill & Arrow */}
                  <div className="flex items-center gap-2 shrink-0">
                    {status.isComplete ? (
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center section-complete">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold text-slate-600 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 hidden xs:inline-block">
                        •
                      </span>
                    )}

                    <Arrow className="w-4 h-4 text-slate-500 group-hover:text-[#001639] group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
