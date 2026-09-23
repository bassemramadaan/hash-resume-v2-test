import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../../../store/useResumeStore';
import { useUndoToastStore } from '../../../store/useUndoToastStore';
import { aiApi } from '../../../lib/api';
import {
  Briefcase,
  GraduationCap,
  Plus,
  Trash2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Loader2,
  X,
  Check,
  CheckCircle2,
} from 'lucide-react';

interface ExperienceAndEducationStepProps {
  onNextMainStep: () => void;
  onPrevMainStep: () => void;
  onSubStepChange?: (subIndex: number, totalSubs: number) => void;
  targetSubStage?: string | null;
  onClearTargetSubStage?: () => void;
  isAr?: boolean;
}

type StageType = 'experience-decision' | 'experience-form' | 'education-form';

export const ExperienceAndEducationStep: React.FC<ExperienceAndEducationStepProps> = ({
  onNextMainStep,
  onPrevMainStep,
  onSubStepChange,
  targetSubStage,
  onClearTargetSubStage,
  isAr = true,
}) => {
  const {
    resumeData,
    addExperience,
    updateExperience,
    removeExperience,
    insertExperienceAtIndex,
    addEducation,
    updateEducation,
    removeEducation,
    insertEducationAtIndex,
    settings,
    openAiModal,
  } = useResumeStore();
  const { showUndoToast } = useUndoToastStore();

  const experiences = resumeData.experiences || [];
  const educationList = resumeData.education || [];

  // Determine initial stage based on targetSubStage or existing data
  const [stage, setStage] = useState<StageType>(() => {
    if (targetSubStage === 'education-form') return 'education-form';
    if (targetSubStage === 'experience-form') return 'experience-form';
    if (experiences.length > 0) return 'experience-form';
    if (educationList.length > 0) return 'education-form';
    return 'experience-decision';
  });

  // Track if user explicitly chose "no experience" in this session
  const [choseNoExperience, setChoseNoExperience] = useState<boolean>(false);

  // Sync with targetSubStage when passed externally (e.g. from Validation Modal)
  useEffect(() => {
    if (targetSubStage === 'education-form') {
      setStage('education-form');
      if (educationList.length === 0) {
        addEducation({
          degree: '',
          institution: '',
          fieldOfStudy: '',
          startDate: '',
          endDate: '',
          gpa: '',
          description: '',
        });
      }
      onClearTargetSubStage?.();
    } else if (targetSubStage === 'experience-form') {
      setStage('experience-form');
      if (experiences.length === 0) {
        addExperience({
          company: '',
          position: '',
          location: '',
          startDate: '',
          endDate: '',
          current: false,
          bulletPoints: [''],
        });
      }
      onClearTargetSubStage?.();
    }
  }, [targetSubStage]);

  // EXPERIENCE INTERNAL STATE
  const [expActiveIndex, setExpActiveIndex] = useState<number>(0);
  const [expSubStage, setExpSubStage] = useState<number>(0); // 0: Basics, 1: Bullet points
  const currentExp = experiences[expActiveIndex] || null;

  // AI Quantify modal state
  const [quantifyTarget, setQuantifyTarget] = useState<{
    expId: string;
    bIdx: number;
    text: string;
    jobTitle: string;
  } | null>(null);
  const [quantifyOptions, setQuantifyOptions] = useState<string[]>([]);
  const [isQuantifying, setIsQuantifying] = useState<boolean>(false);

  // EDUCATION INTERNAL STATE
  const [eduActiveIndex, setEduActiveIndex] = useState<number>(0);
  const currentEdu = educationList[eduActiveIndex] || null;

  const degreePresets = isAr
    ? ['بكالوريوس', 'ماجستير', 'دبلوم عالي', 'ثانوية عامة', 'دكتوراه']
    : ["Bachelor's", "Master's", 'High Diploma', 'High School', 'PhD'];

  // Sync sub-step progress: 2 major sub-stages (0: Experience, 1: Education)
  useEffect(() => {
    if (onSubStepChange) {
      if (stage === 'education-form') {
        onSubStepChange(1, 2);
      } else {
        onSubStepChange(0, 2);
      }
    }
  }, [stage, onSubStepChange]);

  // Decision Handlers
  const handleChooseHasExperience = () => {
    setChoseNoExperience(false);
    if (experiences.length === 0) {
      addExperience({
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        bulletPoints: [''],
      });
      setExpActiveIndex(0);
      setExpSubStage(0);
    }
    setStage('experience-form');
  };

  const handleChooseNoExperience = () => {
    setChoseNoExperience(true);
    if (educationList.length === 0) {
      addEducation({
        degree: '',
        institution: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: '',
      });
      setEduActiveIndex(0);
    }
    setStage('education-form');
  };

  // Experience handlers
  const handleAddNewExperience = () => {
    addExperience({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bulletPoints: [''],
    });
    setTimeout(() => {
      const currentList = useResumeStore.getState().resumeData.experiences || [];
      if (currentList.length > 0) {
        setExpActiveIndex(currentList.length - 1);
        setExpSubStage(0);
      }
    }, 40);
  };

  const handleDeleteCurrentExperience = () => {
    if (!currentExp) return;
    const deletedExp = { ...currentExp };
    const deletedIdx = expActiveIndex;

    removeExperience(currentExp.id);

    showUndoToast({
      messageAr: deletedExp.position ? `تم حذف خبرة "${deletedExp.position}"` : 'تم حذف الخبرة المهنية',
      messageEn: deletedExp.position ? `Deleted "${deletedExp.position}"` : 'Experience entry deleted',
      onUndo: () => {
        insertExperienceAtIndex(deletedIdx, deletedExp);
        setExpActiveIndex(deletedIdx);
      },
    });

    if (expActiveIndex > 0) {
      setExpActiveIndex(expActiveIndex - 1);
      setExpSubStage(0);
    } else {
      setExpActiveIndex(0);
      setExpSubStage(0);
    }
  };

  const handleExpFieldChange = (field: string, value: any) => {
    if (!currentExp) return;
    updateExperience(currentExp.id, { [field]: value });
  };

  const handleAddBullet = () => {
    if (!currentExp) return;
    const bullets = currentExp.bulletPoints || [];
    updateExperience(currentExp.id, { bulletPoints: [...bullets, ''] });
  };

  const handleUpdateBullet = (index: number, value: string) => {
    if (!currentExp) return;
    const bullets = [...(currentExp.bulletPoints || [])];
    bullets[index] = value;
    updateExperience(currentExp.id, { bulletPoints: bullets });
  };

  const handleRemoveBullet = (index: number) => {
    if (!currentExp) return;
    const bullets = [...(currentExp.bulletPoints || [])];
    if (bullets.length <= 1) {
      bullets[0] = '';
    } else {
      bullets.splice(index, 1);
    }
    updateExperience(currentExp.id, { bulletPoints: bullets });
  };

  const handleStartQuantify = async (bIdx: number, text: string) => {
    if (!text.trim() || !currentExp) return;
    setQuantifyTarget({
      expId: currentExp.id,
      bIdx,
      text,
      jobTitle: currentExp.position || 'Professional',
    });
    setIsQuantifying(true);
    try {
      const res = await aiApi.quantifyAchievement({
        text: text || (isAr ? 'مسؤول عن تطوير وتحسين العمليات' : 'Responsible for improving systems'),
        jobTitle: currentExp.position || (isAr ? 'محترف' : 'Professional'),
        language: settings?.language,
      });
      if (res && Array.isArray(res.options) && res.options.length > 0) {
        setQuantifyOptions(res.options);
      } else {
        setQuantifyOptions(
          isAr
            ? [
                `تحسين كفاءة العمل بنسبة 25% من خلال أتمتة الإجراءات والمهام اليومية.`,
                `قيادة تسليم المهام في موعدها مع خفض نسبة الأخطاء بنسبة 30%.`,
                `زيادة الإنتاجية التشغيلية وتحقيق الأهداف المحددة قبل موعدها بـ 15%.`,
              ]
            : [
                `Improved operational efficiency by 25% through workflow automation.`,
                `Delivered key project milestones on schedule, cutting defect rates by 30%.`,
                `Increased team output and surpassed quarterly goals by 15%.`,
              ]
        );
      }
    } catch {
      setQuantifyOptions(
        isAr
          ? [
              `تحسين كفاءة العمل بنسبة 25% من خلال أتمتة الإجراءات والمهام اليومية.`,
              `قيادة تسليم المهام في موعدها مع خفض نسبة الأخطاء بنسبة 30%.`,
              `زيادة الإنتاجية التشغيلية وتحقيق الأهداف المحددة قبل موعدها بـ 15%.`,
            ]
          : [
              `Improved operational efficiency by 25% through workflow automation.`,
              `Delivered key project milestones on schedule, cutting defect rates by 30%.`,
              `Increased team output and surpassed quarterly goals by 15%.`,
            ]
      );
    } finally {
      setIsQuantifying(false);
    }
  };

  const handleApplyQuantified = (selectedOption: string) => {
    if (!quantifyTarget || !currentExp) return;
    const next = [...(currentExp.bulletPoints || [])];
    next[quantifyTarget.bIdx] = selectedOption;
    updateExperience(quantifyTarget.expId, { bulletPoints: next });
    setQuantifyTarget(null);
    setQuantifyOptions([]);
  };

  // Education handlers
  const handleAddNewEducation = () => {
    addEducation({
      degree: '',
      institution: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
    });
    setTimeout(() => {
      const currentList = useResumeStore.getState().resumeData.education || [];
      if (currentList.length > 0) {
        setEduActiveIndex(currentList.length - 1);
      }
    }, 40);
  };

  const handleDeleteCurrentEducation = () => {
    if (!currentEdu) return;
    const deletedEdu = { ...currentEdu };
    const deletedIdx = eduActiveIndex;

    removeEducation(currentEdu.id);

    showUndoToast({
      messageAr: deletedEdu.degree ? `تم حذف مؤهل "${deletedEdu.degree}"` : 'تم حذف المؤهل التعليمي',
      messageEn: deletedEdu.degree ? `Deleted "${deletedEdu.degree}"` : 'Education entry deleted',
      onUndo: () => {
        insertEducationAtIndex(deletedIdx, deletedEdu);
        setEduActiveIndex(deletedIdx);
      },
    });

    if (eduActiveIndex > 0) {
      setEduActiveIndex(eduActiveIndex - 1);
    } else {
      setEduActiveIndex(0);
    }
  };

  const handleEduFieldChange = (field: string, value: any) => {
    if (!currentEdu) return;
    updateEducation(currentEdu.id, { [field]: value });
  };

  // Navigation between Experience & Education
  const handleContinueToEducation = () => {
    if (educationList.length === 0) {
      addEducation({
        degree: '',
        institution: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: '',
      });
      setEduActiveIndex(0);
    }
    setStage('education-form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromEducation = () => {
    if (choseNoExperience && experiences.length === 0) {
      setStage('experience-decision');
    } else {
      setStage('experience-form');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sub-step indicator component (Dual Dots / Pills)
  const renderSubStepIndicators = (activePart: 'exp' | 'edu') => (
    <div className="flex items-center gap-2 mb-4 sm:mb-6">
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
          activePart === 'exp'
            ? 'bg-[#FF4D2D]/10 text-[#FF4D2D] border border-[#FF4D2D]/20'
            : experiences.length > 0 || choseNoExperience
            ? 'bg-[#1f8a5f]/10 text-[#1f8a5f] border border-[#1f8a5f]/20'
            : 'bg-[#f4f1e9] text-[#7a8093] border border-[#e8e5de]'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        <span>{isAr ? '1. الخبرات المهنية' : '1. Experience'}</span>
        {activePart === 'edu' && (experiences.length > 0 || choseNoExperience) && (
          <Check className="w-3 h-3 ml-0.5" />
        )}
      </div>

      <span className="text-[#d6d2c4] text-xs">/</span>

      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
          activePart === 'edu'
            ? 'bg-[#FF4D2D]/10 text-[#FF4D2D] border border-[#FF4D2D]/20'
            : educationList.length > 0
            ? 'bg-[#1f8a5f]/10 text-[#1f8a5f] border border-[#1f8a5f]/20'
            : 'bg-[#f4f1e9] text-[#7a8093] border border-[#e8e5de]'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        <span>{isAr ? '2. المؤهلات والتعليم' : '2. Education'}</span>
      </div>
    </div>
  );

  // 1. STAGE: DECISION (Do you have prior work experience?)
  if (stage === 'experience-decision') {
    return (
      <div className="w-full max-w-xl mx-auto space-y-6 text-center py-2 sm:py-4">
        {renderSubStepIndicators('exp')}

        <div className="w-16 h-16 rounded-3xl bg-[#001639]/5 text-[#001639] flex items-center justify-center mx-auto shadow-2xs border border-[#e8e5de]">
          <Briefcase className="w-8 h-8 text-[#FF4D2D]" />
        </div>

        <div>
          <span className="text-xs sm:text-sm font-bold tracking-wide text-[#FF4D2D] block mb-2">
            {isAr ? 'الخطوة 02: مسارك المهني والتعليمي' : 'Step 02: Experience & Education'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#001639] tracking-tight mb-2">
            {isAr ? 'عندك خبرة عملية سابقة؟' : 'Do you have prior work experience?'}
          </h1>
          <p className="text-xs sm:text-sm text-[#7a8093] max-w-md mx-auto leading-relaxed">
            {isAr
              ? 'سواء وظائف سابقة، تدريب صيفي (Internship)، أو عمل حر — اختر المناسب لنساعدك في ترتيبها بالشكل المثالي.'
              : 'Whether internships, freelancing, or past jobs — choose what fits your background.'}
          </p>
        </div>

        {/* 2 Clear Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {/* Option 1: Yes, I have experience */}
          <button
            type="button"
            onClick={handleChooseHasExperience}
            className="p-5 bg-white border-2 border-[#e8e5de] hover:border-[#FF4D2D] rounded-2xl text-start transition-all group hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FF4D2D]/10 text-[#FF4D2D] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#001639] group-hover:text-[#FF4D2D] transition-colors mb-1">
                {isAr ? 'أيوه، عندي خبرة' : 'Yes, I have experience'}
              </h3>
              <p className="text-xs text-[#7a8093] leading-relaxed">
                {isAr
                  ? 'وظائف سابقة أو حالية، تدريبات عملية، أو مشاريع عمل حر.'
                  : 'Full-time, part-time, internships, or freelance work.'}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#FF4D2D]">
              <span>{isAr ? 'إدخال الخبرات' : 'Add experiences'}</span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </div>
          </button>

          {/* Option 2: Not yet, fresh graduate */}
          <button
            type="button"
            onClick={handleChooseNoExperience}
            className="p-5 bg-white border-2 border-[#e8e5de] hover:border-[#001639] rounded-2xl text-start transition-all group hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#001639]/5 text-[#001639] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-[#001639]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#001639] transition-colors mb-1">
                {isAr ? 'لسه لأ، خريج جديد' : 'Not yet, fresh graduate'}
              </h3>
              <p className="text-xs text-[#7a8093] leading-relaxed">
                {isAr
                  ? 'تخطي الخبرات والتركيز مباشرة على دراستك ومؤهلاتك العلمية.'
                  : 'Skip work experience and focus directly on education.'}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#001639]">
              <span>{isAr ? 'الانتقال للتعليم' : 'Continue to education'}</span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </div>
          </button>
        </div>

        {/* Back to Personal Info */}
        <div className="pt-4 border-t border-[#e8e5de]">
          <button
            type="button"
            onClick={onPrevMainStep}
            className="text-xs text-[#7a8093] hover:text-[#001639] font-medium transition cursor-pointer"
          >
            {isAr ? '← رجوع للبيانات الشخصية' : '← Back to Personal Info'}
          </button>
        </div>
      </div>
    );
  }

  // 2. STAGE: EXPERIENCE FORM (One item at a time)
  if (stage === 'experience-form') {
    // If experiences array is somehow empty, render a clean instant add state
    if (experiences.length === 0 || !currentExp) {
      return (
        <div className="w-full max-w-xl mx-auto space-y-6 text-center py-4">
          {renderSubStepIndicators('exp')}
          <div className="w-14 h-14 rounded-2xl bg-[#FF4D2D]/10 text-[#FF4D2D] flex items-center justify-center mx-auto">
            <Briefcase className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#001639]">
            {isAr ? 'أضف أول خبرة مهنية' : 'Add your first work experience'}
          </h2>
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={handleAddNewExperience}
              className="py-3 px-6 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-sm rounded-xl transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#FF4D2D]" />
              <span>{isAr ? 'إضافة خبرة الآن' : 'Add experience now'}</span>
            </button>
            <button
              type="button"
              onClick={handleContinueToEducation}
              className="text-xs text-[#7a8093] hover:text-[#001639] font-medium cursor-pointer"
            >
              {isAr ? 'تخطي إلى التعليم والمؤهلات ←' : 'Skip to Education →'}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-xl mx-auto">
        {renderSubStepIndicators('exp')}

        {/* Top Experience Header: Simple pagination + quiet actions */}
        <div className="flex items-center justify-between gap-2 mb-5 pb-3 border-b border-[#e8e5de]">
          <div className="flex items-center gap-2 min-w-0">
            {experiences.length > 1 ? (
              <div className="flex items-center gap-0.5 bg-[#f4f1e9] px-1.5 py-1 rounded-xl border border-[#e2dec9] shrink-0">
                <button
                  type="button"
                  disabled={expActiveIndex === 0}
                  onClick={() => {
                    setExpActiveIndex((prev) => Math.max(0, prev - 1));
                    setExpSubStage(0);
                  }}
                  className="p-1 text-[#001639] hover:text-[#FF4D2D] disabled:opacity-25 rounded-lg transition cursor-pointer"
                  title={isAr ? 'الخبرة السابقة' : 'Previous experience'}
                >
                  {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>

                <span className="px-1.5 text-xs font-bold text-[#001639]">
                  {expActiveIndex + 1} / {experiences.length}
                </span>

                <button
                  type="button"
                  disabled={expActiveIndex === experiences.length - 1}
                  onClick={() => {
                    setExpActiveIndex((prev) => Math.min(experiences.length - 1, prev + 1));
                    setExpSubStage(0);
                  }}
                  className="p-1 text-[#001639] hover:text-[#FF4D2D] disabled:opacity-25 rounded-lg transition cursor-pointer"
                  title={isAr ? 'الخبرة التالية' : 'Next experience'}
                >
                  {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-[#f4f1e9] text-[#001639] border border-[#e8e5de] shrink-0">
                {isAr ? 'الخبرة 1 من 1' : 'Role 1 of 1'}
              </span>
            )}

            <button
              type="button"
              onClick={handleAddNewExperience}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#001639] hover:text-[#FF4D2D] bg-white border border-[#e8e5de] hover:border-[#FF4D2D]/30 rounded-xl transition cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-[#FF4D2D]" />
              <span>{isAr ? 'خبرة أخرى' : 'Add another'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleDeleteCurrentExperience}
            className="p-1.5 text-[#7a8093] hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer shrink-0"
            title={isAr ? 'حذف هذه الخبرة' : 'Delete this role'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Part Sub-Stage Switcher (Basics vs Achievements) */}
        <div className="flex bg-[#f4f1e9] p-1 rounded-xl gap-1 mb-5 border border-[#e8e5de]">
          <button
            type="button"
            onClick={() => setExpSubStage(0)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              expSubStage === 0 ? 'bg-white text-[#001639] shadow-2xs' : 'text-[#7a8093] hover:text-[#001639]'
            }`}
          >
            {isAr ? '1. المسمى والشركة' : '1. Role & Company'}
          </button>
          <button
            type="button"
            onClick={() => setExpSubStage(1)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              expSubStage === 1 ? 'bg-white text-[#001639] shadow-2xs' : 'text-[#7a8093] hover:text-[#001639]'
            }`}
          >
            <span>{isAr ? '2. المهام والإنجازات' : '2. Key Achievements'}</span>
            <Sparkles className="w-3 h-3 text-[#FF4D2D]" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* SUB-STAGE 0: Role & Company basics */}
          {expSubStage === 0 && (
            <motion.div
              key="exp-substage-0"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#001639] tracking-tight mb-1">
                  {currentExp.position || (isAr ? 'ما هو مسماك الوظيفي؟' : 'What was your title?')}
                </h2>
                <p className="text-xs text-[#7a8093]">
                  {isAr
                    ? 'أدخل تفاصيل الوظيفة، الشركة، وفترة العمل.'
                    : 'Enter the job title, company name, and employment period.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#001639] mb-1">
                    {isAr ? 'المسمى الوظيفي' : 'Job Title'}
                    <span className="text-[#FF4D2D] mr-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentExp.position || ''}
                    onChange={(e) => handleExpFieldChange('position', e.target.value)}
                    placeholder={isAr ? 'مثال: مهندس برمجيات أول' : 'e.g. Senior Software Engineer'}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#e8e5de] focus:border-[#FF4D2D] rounded-xl text-sm outline-hidden transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#001639] mb-1">
                    {isAr ? 'اسم الشركة أو الجهة' : 'Company'}
                    <span className="text-[#FF4D2D] mr-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentExp.company || ''}
                    onChange={(e) => handleExpFieldChange('company', e.target.value)}
                    placeholder={isAr ? 'مثال: فودافون مصر' : 'e.g. Vodafone'}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#e8e5de] focus:border-[#FF4D2D] rounded-xl text-sm outline-hidden transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#001639] mb-1">
                    {isAr ? 'الموقع الجغرافي (اختياري)' : 'Location'}
                  </label>
                  <input
                    type="text"
                    value={currentExp.location || ''}
                    onChange={(e) => handleExpFieldChange('location', e.target.value)}
                    placeholder={isAr ? 'مثال: القاهرة، مصر (أو عن بُعد)' : 'e.g. Cairo, Egypt (or Remote)'}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#e8e5de] focus:border-[#FF4D2D] rounded-xl text-sm outline-hidden transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#001639] mb-1">
                    {isAr ? 'تاريخ البدء' : 'Start Date'}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={currentExp.startDate || ''}
                    onChange={(e) => handleExpFieldChange('startDate', e.target.value)}
                    placeholder="2022-01"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#e8e5de] focus:border-[#FF4D2D] rounded-xl text-sm outline-hidden transition font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#001639] mb-1">
                    {isAr ? 'تاريخ الانتهاء' : 'End Date'}
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    disabled={currentExp.current}
                    value={currentExp.current ? (isAr ? 'حتى الآن' : 'Present') : currentExp.endDate || ''}
                    onChange={(e) => handleExpFieldChange('endDate', e.target.value)}
                    placeholder="2024-05"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#e8e5de] focus:border-[#FF4D2D] disabled:bg-[#f4f1e9] disabled:text-[#7a8093] rounded-xl text-sm outline-hidden transition font-mono"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(currentExp.current)}
                    onChange={(e) => handleExpFieldChange('current', e.target.checked)}
                    className="w-4 h-4 rounded-sm text-[#FF4D2D] focus:ring-[#FF4D2D] border-[#d6d2c4]"
                  />
                  <span className="text-xs font-semibold text-[#001639]">
                    {isAr ? 'أنا أعمل هنا حالياً' : 'I currently work here'}
                  </span>
                </label>
              </div>

              {/* Advance to bullet points */}
              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setExpSubStage(1)}
                  className="py-2.5 px-5 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-xs rounded-xl shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isAr ? 'متابعة إلى المهام والإنجازات' : 'Next: Key Achievements'}</span>
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </motion.div>
          )}

          {/* SUB-STAGE 1: Key Achievements & Bullet Points */}
          {expSubStage === 1 && (
            <motion.div
              key="exp-substage-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#001639] tracking-tight mb-1">
                    {isAr ? 'أهم إنجازاتك ومهامك اليومية' : 'Key Responsibilities & Achievements'}
                  </h2>
                  <p className="text-xs text-[#7a8093]">
                    {isAr
                      ? 'أنظمة الـ ATS تبحث عن نقاط واضحة تحتوي على أرقام ونتائج ملموسة.'
                      : 'ATS parsers look for action-oriented bullets with quantified outcomes.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openAiModal('bullet', currentExp.id)}
                  className="px-3 py-1.5 bg-[#FF4D2D]/10 hover:bg-[#FF4D2D]/20 text-[#FF4D2D] font-bold text-xs rounded-xl border border-[#FF4D2D]/20 transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{isAr ? 'صياغة بالذكاء الاصطناعي' : 'AI Enhance'}</span>
                </button>
              </div>

              {/* Bullet Points List */}
              <div className="space-y-2.5">
                {(currentExp.bulletPoints || ['']).map((bullet, bIdx) => (
                  <div key={bIdx} className="space-y-1 bg-white p-3 rounded-xl border border-[#e8e5de]">
                    <div className="flex items-start gap-2">
                      <span className="text-[#FF4D2D] font-bold text-sm mt-1 select-none">•</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(bIdx, e.target.value)}
                        placeholder={
                          isAr
                            ? 'مثال: تطوير نظام فوترة جديد قلل وقت المعالجة بنسبة 30%...'
                            : 'e.g. Developed new billing system reducing latency by 30%...'
                        }
                        className="flex-1 bg-transparent text-xs sm:text-sm text-[#001639] outline-hidden resize-none leading-relaxed"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet(bIdx)}
                        className="text-[#7a8093] hover:text-red-600 p-1 transition cursor-pointer"
                        title={isAr ? 'حذف النقطة' : 'Remove bullet'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {bullet.trim().length > 10 && (
                      <div className="pt-1.5 border-t border-[#f4f1e9] flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleStartQuantify(bIdx, bullet)}
                          className="text-[11px] font-bold text-[#FF4D2D] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <TrendingUp className="w-3 h-3" />
                          <span>{isAr ? 'عزّز بالأرقام والنسب (Quantify)' : 'Quantify with numbers'}</span>
                        </button>
                        <span className="text-[10px] text-[#7a8093]">
                          {bullet.length} {isAr ? 'حرف' : 'chars'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddBullet}
                className="w-full py-2.5 border-2 border-dashed border-[#e8e5de] hover:border-[#FF4D2D] text-[#7a8093] hover:text-[#001639] font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer bg-white"
              >
                <Plus className="w-3.5 h-3.5 text-[#FF4D2D]" />
                <span>{isAr ? 'إضافة نقطة إنجاز أخرى' : 'Add another bullet'}</span>
              </button>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setExpSubStage(0)}
                  className="text-xs text-[#7a8093] hover:text-[#001639] font-semibold cursor-pointer"
                >
                  {isAr ? '← تعديل المسمى والشركة' : '← Edit Role & Company'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Actions for Experience */}
        <div className="pt-4 sm:pt-6 mt-6 border-t border-[#e8e5de] flex items-center justify-between gap-3 sticky bottom-0 bg-[#fbfaf7]/95 backdrop-blur-xs py-3 z-10">
          <button
            type="button"
            onClick={() => setStage('experience-decision')}
            className="py-3 px-4 bg-white border-2 border-[#e8e5de] text-[#001639] hover:bg-[#f4f1e9] font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
          >
            {isAr ? 'السابق' : 'Back'}
          </button>

          <button
            type="button"
            onClick={handleContinueToEducation}
            className="flex-1 max-w-sm py-3 px-5 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-xs sm:text-sm rounded-xl shadow-2xs hover:shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{isAr ? 'متابعة إلى التعليم والمؤهلات' : 'Continue to Education'}</span>
            {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

        {/* AI Quantify Modal */}
        <AnimatePresence>
          {quantifyTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001639]/40 backdrop-blur-xs"
            >
              <motion.div
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-xl border border-[#e8e5de] space-y-4"
                dir={isAr ? 'rtl' : 'ltr'}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#e8e5de]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#FF4D2D]/10 text-[#FF4D2D] flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#001639]">
                        {isAr ? 'تعزيز النقطة بأرقام ونسب ملموسة' : 'Quantify Achievement'}
                      </h3>
                      <p className="text-[11px] text-[#7a8093]">{quantifyTarget.jobTitle}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantifyTarget(null)}
                    className="p-1 text-[#7a8093] hover:text-[#001639] rounded-lg transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 bg-[#f4f1e9] rounded-xl text-xs text-[#001639] italic">
                  "{quantifyTarget.text}"
                </div>

                {isQuantifying ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2 text-[#7a8093]">
                    <Loader2 className="w-6 h-6 animate-spin text-[#FF4D2D]" />
                    <span className="text-xs font-semibold">
                      {isAr ? 'جاري صياغة مقترحات رقمية قوية...' : 'Generating impact-driven bullets...'}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-[#001639]">
                      {isAr ? 'اختر الصيغة الأكثر مطابقة لواقعك:' : 'Select the best matching bullet:'}
                    </p>
                    {quantifyOptions.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        type="button"
                        onClick={() => handleApplyQuantified(opt)}
                        className="w-full p-3 text-start bg-white border border-[#e8e5de] hover:border-[#FF4D2D] rounded-xl text-xs leading-relaxed text-[#001639] transition hover:shadow-2xs group flex items-start gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#7a8093] group-hover:text-[#FF4D2D] shrink-0 mt-0.5" />
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // 3. STAGE: EDUCATION FORM (One degree at a time with refined title: "كمّل ببيانات تعليمك")
  return (
    <div className="w-full max-w-xl mx-auto">
      {renderSubStepIndicators('edu')}

      {/* Top Education Header: Pagination + Add + Delete */}
      <div className="flex items-center justify-between gap-2 mb-5 pb-3 border-b border-[#e8e5de]">
        <div className="flex items-center gap-2 min-w-0">
          {educationList.length > 1 ? (
            <div className="flex items-center gap-0.5 bg-[#f4f1e9] px-1.5 py-1 rounded-xl border border-[#e2dec9] shrink-0">
              <button
                type="button"
                disabled={eduActiveIndex === 0}
                onClick={() => setEduActiveIndex((prev) => Math.max(0, prev - 1))}
                className="p-1 text-[#001639] hover:text-[#FF4D2D] disabled:opacity-25 rounded-lg transition cursor-pointer"
                title={isAr ? 'المؤهل السابق' : 'Previous degree'}
              >
                {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              <span className="px-1.5 text-xs font-bold text-[#001639]">
                {eduActiveIndex + 1} / {educationList.length}
              </span>

              <button
                type="button"
                disabled={eduActiveIndex === educationList.length - 1}
                onClick={() => setEduActiveIndex((prev) => Math.min(educationList.length - 1, prev + 1))}
                className="p-1 text-[#001639] hover:text-[#FF4D2D] disabled:opacity-25 rounded-lg transition cursor-pointer"
                title={isAr ? 'المؤهل التالي' : 'Next degree'}
              >
                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-[#f4f1e9] text-[#001639] border border-[#e8e5de] shrink-0">
              {isAr ? 'المؤهل 1 من 1' : 'Degree 1 of 1'}
            </span>
          )}

          <button
            type="button"
            onClick={handleAddNewEducation}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#001639] hover:text-[#FF4D2D] bg-white border border-[#e8e5de] hover:border-[#FF4D2D]/30 rounded-xl transition cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF4D2D]" />
            <span>{isAr ? 'مؤهل آخر' : 'Add another'}</span>
          </button>
        </div>

        {educationList.length > 1 && (
          <button
            type="button"
            onClick={handleDeleteCurrentEducation}
            className="p-1.5 text-[#7a8093] hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer shrink-0"
            title={isAr ? 'حذف هذا المؤهل' : 'Delete degree'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Intro Header: "كمّل ببيانات تعليمك" */}
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-[#001639] tracking-tight mb-1">
          {isAr ? 'كمّل ببيانات تعليمك' : 'Continue with your education'}
        </h2>
        <p className="text-xs text-[#7a8093]">
          {isAr
            ? 'المؤهلات الدراسية والجامعية والشهادات الأكاديمية تدعم ملفك التوظيفي.'
            : 'Add your university, college, or academic credentials.'}
        </p>
      </div>

      {/* Degree Preset Chips */}
      <div className="mb-4">
        <label className="block text-[11px] font-bold text-[#7a8093] mb-1.5">
          {isAr ? 'اختصارات سريعة للدرجة العلمية:' : 'Quick degree presets:'}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {degreePresets.map((preset) => {
            const isSelected = currentEdu?.degree === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => handleEduFieldChange('degree', preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#001639] text-white shadow-2xs'
                    : 'bg-white text-[#001639] border border-[#e8e5de] hover:border-[#FF4D2D]'
                }`}
              >
                {preset}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-bold text-[#001639] mb-1">
            {isAr ? 'الدرجة العلمية' : 'Degree / Certificate'}
            <span className="text-[#FF4D2D] mr-1">*</span>
          </label>
          <input
            type="text"
            value={currentEdu?.degree || ''}
            onChange={(e) => handleEduFieldChange('degree', e.target.value)}
            placeholder={isAr ? 'مثال: بكالوريوس هندسة حاسبات' : 'e.g. B.S. in Computer Science'}
            className="w-full px-3.5 py-2.5 bg-white border border-[#e8e5de] focus:border-[#FF4D2D] rounded-xl text-sm outline-hidden transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#001639] mb-1">
            {isAr ? 'الجامعة أو المؤسسة التعليمية' : 'Institution / University'}
            <span className="text-[#FF4D2D] mr-1">*</span>
          </label>
          <input
            type="text"
            value={currentEdu?.institution || ''}
            onChange={(e) => handleEduFieldChange('institution', e.target.value)}
            placeholder={isAr ? 'مثال: جامعة القاهرة' : 'e.g. Cairo University'}
            className="w-full px-3.5 py-2.5 bg-white border border-[#e8e5de] focus:border-[#FF4D2D] rounded-xl text-sm outline-hidden transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#001639] mb-1">
            {isAr ? 'التخصص أو الكلية (اختياري)' : 'Field of Study'}
          </label>
          <input
            type="text"
            value={currentEdu?.fieldOfStudy || ''}
            onChange={(e) => handleEduFieldChange('fieldOfStudy', e.target.value)}
            placeholder={isAr ? 'مثال: هندسة البرمجيات' : 'e.g. Software Engineering'}
            className="w-full px-3.5 py-2.5 bg-white border border-[#e8e5de] focus:border-[#FF4D2D] rounded-xl text-sm outline-hidden transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#001639] mb-1">
            {isAr ? 'التقدير أو المعدل (اختياري)' : 'GPA / Grade'}
          </label>
          <input
            type="text"
            value={currentEdu?.gpa || ''}
            onChange={(e) => handleEduFieldChange('gpa', e.target.value)}
            placeholder={isAr ? 'مثال: جيد جداً أو 3.8/4.0' : 'e.g. 3.8 / 4.0 or Very Good'}
            className="w-full px-3.5 py-2.5 bg-white border border-[#e8e5de] focus:border-[#FF4D2D] rounded-xl text-sm outline-hidden transition"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#001639] mb-1">
            {isAr ? 'سنة البدء' : 'Start Year'}
          </label>
          <input
            type="text"
            dir="ltr"
            value={currentEdu?.startDate || ''}
            onChange={(e) => handleEduFieldChange('startDate', e.target.value)}
            placeholder="2018"
            className="w-full px-3.5 py-2.5 bg-white border border-[#e8e5de] focus:border-[#FF4D2D] rounded-xl text-sm outline-hidden transition font-mono"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#001639] mb-1">
            {isAr ? 'سنة التخرج' : 'Graduation Year'}
          </label>
          <input
            type="text"
            dir="ltr"
            value={currentEdu?.endDate || ''}
            onChange={(e) => handleEduFieldChange('endDate', e.target.value)}
            placeholder="2022"
            className="w-full px-3.5 py-2.5 bg-white border border-[#e8e5de] focus:border-[#FF4D2D] rounded-xl text-sm outline-hidden transition font-mono"
          />
        </div>
      </div>

      {/* Bottom Actions for Education */}
      <div className="pt-4 sm:pt-6 mt-6 border-t border-[#e8e5de] flex items-center justify-between gap-3 sticky bottom-0 bg-[#fbfaf7]/95 backdrop-blur-xs py-3 z-10">
        <button
          type="button"
          onClick={handleBackFromEducation}
          className="py-3 px-4 bg-white border-2 border-[#e8e5de] text-[#001639] hover:bg-[#f4f1e9] font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer"
        >
          {isAr ? 'السابق' : 'Back'}
        </button>

        <button
          type="button"
          onClick={onNextMainStep}
          className="flex-1 max-w-sm py-3 px-5 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-xs sm:text-sm rounded-xl shadow-2xs hover:shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>{isAr ? 'متابعة إلى المهارات واللغات' : 'Continue to Skills'}</span>
          {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
