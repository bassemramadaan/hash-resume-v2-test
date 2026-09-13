import React, { useState } from 'react';
import { motion } from 'motion/react';
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
  Loader2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Check,
  Lock,
  Key,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { validateResumeMinimumRequirements } from '../../utils/resumeValidation';

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
  const {
    resumeData,
    settings,
    activation,
    unlockResumeWithCredit,
    resetResume,
    setIsActivationModalOpen,
  } = useResumeStore();
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
        titleAr: 'البيانات الشخصية',
        titleEn: 'Personal Information',
        hintAr: 'ابدأ بكتابة اسمك ومسماك الوظيفي المستهدف',
        hintEn: 'Add your name and target job title',
        icon: User,
      };
    }
    if (experiencesCount === 0) {
      return {
        key: 'experiences' as MobileSectionKey,
        titleAr: 'الخبرات المهنية',
        titleEn: 'Work Experience',
        hintAr: 'أضف أحدث وظيفة أو تدريب قمت به',
        hintEn: 'Add your most recent role or internship',
        icon: Briefcase,
      };
    }
    if (educationCount === 0) {
      return {
        key: 'education' as MobileSectionKey,
        titleAr: 'المؤهلات التعليمية',
        titleEn: 'Education',
        hintAr: 'أضف شهادتك الجامعية أو دراستك',
        hintEn: 'Add your university degree or study',
        icon: GraduationCap,
      };
    }
    if (skillsCount < 3) {
      return {
        key: 'skills' as MobileSectionKey,
        titleAr: 'المهارات واللغات',
        titleEn: 'Skills & Languages',
        hintAr: 'أضف 3 مهارات أساسية على الأقل',
        hintEn: 'Add at least 3 key skills',
        icon: Wrench,
      };
    }
    return {
      key: 'download' as MobileSectionKey,
      titleAr: 'المراجعة والتصدير',
      titleEn: 'Review & Export',
      hintAr: 'سيرتك جاهزة! راجعها الآن وحمّل ملف PDF',
      hintEn: 'Your resume is ready! Review & download PDF',
      icon: Download,
    };
  }, [resumeData, experiencesCount, educationCount, skillsCount]);

  const getSectionSubtitle = (key: MobileSectionKey): { text: string; isDone: boolean } => {
    switch (key) {
      case 'personal':
        if (isPersonalComplete) {
          const name = resumeData.personalInfo.fullName?.trim();
          const title = resumeData.personalInfo.jobTitle?.trim();
          return {
            text: title ? `${name} • ${title}` : name || (isAr ? 'مكتمل' : 'Complete'),
            isDone: true,
          };
        }
        return { text: '', isDone: false };

      case 'experiences':
        if (experiencesCount > 0) {
          return {
            text: isAr
              ? `${experiencesCount} ${experiencesCount === 1 ? 'خبرة مسجلة' : 'خبرات مسجلة'}`
              : `${experiencesCount} ${experiencesCount === 1 ? 'role added' : 'roles added'}`,
            isDone: true,
          };
        }
        return { text: '', isDone: false };

      case 'education':
        if (educationCount > 0) {
          return {
            text: isAr
              ? `${educationCount} ${educationCount === 1 ? 'مؤهل مضاف' : 'مؤهلات مضافة'}`
              : `${educationCount} ${educationCount === 1 ? 'degree added' : 'degrees added'}`,
            isDone: true,
          };
        }
        return { text: '', isDone: false };

      case 'skills':
        if (skillsCount > 0) {
          return {
            text: isAr
              ? `${skillsCount} ${skillsCount === 1 ? 'مهارة مسجلة' : 'مهارات مسجلة'}`
              : `${skillsCount} ${skillsCount === 1 ? 'skill added' : 'skills added'}`,
            isDone: true,
          };
        }
        return { text: '', isDone: false };

      case 'certifications':
        if (certsCount > 0) {
          return {
            text: isAr
              ? `${certsCount} ${certsCount === 1 ? 'شهادة مضافة' : 'شهادات مضافة'}`
              : `${certsCount} ${certsCount === 1 ? 'certificate' : 'certificates'}`,
            isDone: true,
          };
        }
        return { text: '', isDone: false };

      case 'projects':
        if (projectsCount > 0) {
          return {
            text: isAr
              ? `${projectsCount} ${projectsCount === 1 ? 'مشروع مسجل' : 'مشاريع مسجلة'}`
              : `${projectsCount} ${projectsCount === 1 ? 'project' : 'projects'}`,
            isDone: true,
          };
        }
        return { text: '', isDone: false };

      case 'customize':
        return {
          text: isAr
            ? `القالب الحالي: ${settings.templateId || 'كلاسيك'}`
            : `Template: ${settings.templateId || 'Classic'}`,
          isDone: true,
        };

      case 'ats':
        return {
          text: isPersonalComplete && experiencesCount > 0
            ? isAr ? 'جاهز للفحص' : 'Ready to scan'
            : '',
          isDone: isPersonalComplete && experiencesCount > 0,
        };

      case 'download': {
        const isReady = validateResumeMinimumRequirements(resumeData).isValid;
        return {
          text: isReady
            ? isAr ? 'جاهز للتصدير كملف PDF' : 'Ready for PDF export'
            : '',
          isDone: isReady,
        };
      }

      default:
        return { text: '', isDone: false };
    }
  };

  const Chevron = isAr ? ChevronLeft : ChevronRight;
  const NextArrow = isAr ? ArrowLeft : ArrowRight;

  const setIsUnlockModalOpen = useResumeStore((state) => state.setIsUnlockModalOpen);

  const handleUnlockRequest = () => {
    if (activation.remainingDownloads > 0) {
      setIsUnlockModalOpen(true);
    } else {
      setIsActivationModalOpen(true);
    }
  };

  // Section item renderer for grouped clean lists
  const renderListItem = (
    key: MobileSectionKey,
    title: string,
    Icon: any,
    isOptional = false
  ) => {
    const { text, isDone } = getSectionSubtitle(key);

    return (
      <button
        key={key}
        type="button"
        onClick={() => onSelectSection(key)}
        className="w-full py-3 px-4 flex items-center justify-between gap-3 text-start transition active:bg-slate-50 cursor-pointer focus-visible:outline-hidden focus-visible:bg-slate-50 group border-b border-slate-100 last:border-0"
        aria-label={`${title} ${text ? `- ${text}` : ''}`}
      >
        {/* Left: Icon & Text */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className={`w-6 h-6 flex items-center justify-center shrink-0 transition-colors ${
              isDone
                ? 'text-emerald-600'
                : 'text-slate-400 group-hover:text-[#001639]'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className={`font-bold text-sm truncate ${isDone ? 'text-slate-900' : 'text-slate-700'}`}>
                {title}
              </span>
              {isOptional && !isDone && (
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                  {isAr ? 'اختياري' : 'Optional'}
                </span>
              )}
            </div>
            {text && (
              <p className="text-[11px] text-slate-500 truncate mt-0.5 font-normal">
                {text}
              </p>
            )}
          </div>
        </div>

        {/* Right: Done Check or Subtle Chevron */}
        <div className="flex items-center gap-1.5 shrink-0">
          {isDone ? (
            <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </span>
          ) : (
            <Chevron className="w-4 h-4 text-slate-300 group-hover:text-[#FF4D2D] transition-colors" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="w-full max-w-full min-w-0 pb-24 bg-[#F8FAFC]">
      {/* 1. Ultra-Clean Minimal Top App Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="relative flex items-center justify-between px-3 py-3 h-14">
          {/* Left Controls: Menu Drawer Toggle */}
          <div className="flex items-center w-1/3">
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-[#001639] transition active:scale-95 cursor-pointer shrink-0 border border-slate-100"
              aria-label={isAr ? 'فتح خيارات السيرة' : 'Open resume menu'}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Center: Brand Mark (Absolutely Centered) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            <Logo variant="icon" size="sm" className="!h-6 w-auto shrink-0" />
            <span className="font-brand font-extrabold text-[13px] text-[#001639] tracking-tight">
              Hash <span className="text-[#FF4D2D]">Resume</span>
            </span>
          </div>

          {/* Right Controls: Save status */}
          <div className="flex items-center justify-end w-1/3">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-slate-600 px-1 py-1">
              {saveStatus === 'saving' ? (
                <>
                  <Loader2 className="w-3 h-3 text-amber-600 animate-spin shrink-0" />
                  <span className="text-amber-700 hidden xs:inline">{isAr ? 'حفظ...' : 'Saving...'}</span>
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-500 hidden xs:inline">{isAr ? 'محفوظ' : 'Saved'}</span>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Minimal Clean Progress Track right under the header */}
        <div className="w-full bg-slate-100 h-[3px] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${completionScore}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`h-full ${
              completionScore >= 80
                ? 'bg-emerald-500'
                : completionScore >= 40
                ? 'bg-amber-500'
                : 'bg-[#FF4D2D]'
            }`}
          />
        </div>
      </header>

      {/* Slide Drawer for Menu & Quick Tools */}
      <MobileMenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenResetModal={onOpenResetModal}
      />

      {/* Main Content Area */}
      <div className="p-4 space-y-4 max-w-lg mx-auto">
        {/* 2. Resume Lock Warning Banner (if finalized/locked) */}
        {activation.isResumeLocked && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col gap-2.5 text-amber-950">
            <div className="flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="font-bold text-xs text-amber-950">
                  {isAr ? 'السيرة الذاتية مقفلة بعد التحميل' : 'Resume Locked After Download'}
                </h4>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {isAr
                    ? 'لحماية نسختك المحملة، يمكنك فتح التعديل برصيدك المتبقي.'
                    : 'Fields locked to protect your download. Unlock with remaining credit.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleUnlockRequest}
              className="w-full py-2 bg-[#001639] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition active:scale-98 cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
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
        )}

        {/* 3. Primary Next Step Action (Action-Driven CTA) */}
        <div className="mb-6 pt-1">
          {completedSectionsCount === 0 ? (
            <div className="flex flex-col gap-3 p-4 bg-white border border-slate-200/90 rounded-2xl shadow-sm text-center">
              <div className="w-12 h-12 bg-orange-50 text-[#FF4D2D] rounded-full flex items-center justify-center mx-auto mb-1">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="font-bold text-slate-900 text-sm">
                {isAr ? 'مرحباً بك في هاش ريزيومي!' : 'Welcome to Hash Resume!'}
              </h2>
              <p className="text-[11px] text-slate-600 mb-1 leading-relaxed px-2">
                {isAr
                  ? 'يمكنك تعبئة بياناتك يدوياً للبدء، أو استخدام سيرة تجريبية جاهزة.'
                  : 'Start entering your details manually, or load a sample resume.'}
              </p>
              <div className="flex flex-col xs:flex-row gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => onSelectSection('personal')}
                  className="flex-1 px-4 py-3 bg-[#001639] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-800 transition active:scale-95"
                >
                  <User className="w-4 h-4" />
                  <span>{isAr ? 'إدخال بياناتي' : 'Start with My Info'}</span>
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onSelectSection(recommendedNextStep.key)}
              className="w-full bg-[#001639] text-white p-4 sm:p-5 rounded-2xl shadow-lg shadow-[#001639]/10 flex items-center justify-between group active:scale-[0.98] transition-transform cursor-pointer"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-white">
                  <recommendedNextStep.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0 text-start">
                  <span className="text-[10px] font-medium text-white/70 block uppercase tracking-wider mb-0.5">
                    {isAr ? 'الخطوة التالية' : 'Next Step'}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white block truncate">
                    {isAr ? recommendedNextStep.titleAr : recommendedNextStep.titleEn}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white shrink-0 group-hover:bg-[#FF4D2D] transition-colors">
                <NextArrow className="w-4 h-4" />
              </div>
            </button>
          )}
        </div>

        {/* 4. Group 1: Core Resume Content */}
        <div className="space-y-2">
          <h3 className="px-1 text-xs font-bold text-slate-900">
            {isAr ? 'البيانات الأساسية' : 'Essential Details'}
          </h3>
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
            {renderListItem('personal', isAr ? 'البيانات الشخصية' : 'Personal Information', User)}
            {renderListItem('experiences', isAr ? 'الخبرات المهنية' : 'Work Experience', Briefcase)}
            {renderListItem('education', isAr ? 'المؤهلات التعليمية' : 'Education', GraduationCap)}
            {renderListItem('skills', isAr ? 'المهارات واللغات' : 'Skills & Languages', Wrench)}
          </div>
        </div>

        {/* 5. Group 2: Additional / Optional Sections (Flat List) */}
        <div className="space-y-2 pt-2">
          <h3 className="px-1 text-xs font-bold text-slate-900">
            {isAr ? 'أقسام إضافية (اختياري)' : 'Additional Sections (Optional)'}
          </h3>
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
            {renderListItem('certifications', isAr ? 'الشهادات والدورات' : 'Certifications', Award, true)}
            {renderListItem('projects', isAr ? 'المشاريع والأعمال' : 'Projects', FolderGit2, true)}
          </div>
        </div>

        {/* 6. Group 3: Design, ATS & Final Export */}
        <div className="space-y-2 pt-2">
          <h3 className="px-1 text-xs font-bold text-slate-900">
            {isAr ? 'التصميم والتحميل' : 'Design & Export'}
          </h3>
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
            {renderListItem('customize', isAr ? 'القالب والألوان' : 'Template & Colors', Layout)}
            {renderListItem('ats', isAr ? 'فحص التوافق مع ATS' : 'ATS Scan', FileText)}
            {renderListItem('download', isAr ? 'المراجعة وتحميل PDF' : 'Review & PDF Export', Download)}
          </div>
        </div>

        {/* 7. Start Fresh / Reset Zone */}
        <div className="pt-2 pb-4">
          <div className="px-4 py-3 bg-white border border-rose-100 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-start">
            <div className="space-y-0.5 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {isAr ? 'تفريغ السيرة وبدء صفحة جديدة' : 'Start Fresh Resume'}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {isAr
                  ? 'مسح كافة الحقول المدخلة والبدء من الصفر'
                  : 'Clear all input fields and start from scratch'}
              </p>
            </div>
            <button
              type="button"
              id="mobile-start-fresh-bottom-btn"
              onClick={onOpenResetModal}
              className="w-full sm:w-auto px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/90 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span>{isAr ? 'بدء من جديد' : 'Start Fresh'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

