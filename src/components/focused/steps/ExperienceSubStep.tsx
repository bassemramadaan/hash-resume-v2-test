import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../../../store/useResumeStore';
import { useUndoToastStore } from '../../../store/useUndoToastStore';
import { aiApi } from '../../../lib/api';
import {
  Briefcase,
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
} from 'lucide-react';

interface ExperienceSubStepProps {
  onNextMainStep: () => void;
  onPrevMainStep: () => void;
  onSubStepChange?: (subIndex: number, totalSubs: number) => void;
  isAr?: boolean;
}

export const ExperienceSubStep: React.FC<ExperienceSubStepProps> = ({
  onNextMainStep,
  onPrevMainStep,
  onSubStepChange,
  isAr = true,
}) => {
  const {
    resumeData,
    addExperience,
    updateExperience,
    removeExperience,
    insertExperienceAtIndex,
    settings,
    openAiModal,
  } = useResumeStore();
  const { showUndoToast } = useUndoToastStore();

  const experiences = resumeData.experiences || [];
  const [activeIndex, setActiveIndex] = useState<number>(0);
  // subStage 0: Role & Company basics | subStage 1: Key Achievements & Bullet Points
  const [subStage, setSubStage] = useState<number>(0);

  // AI Quantify modal state
  const [quantifyTarget, setQuantifyTarget] = useState<{
    expId: string;
    bIdx: number;
    text: string;
    jobTitle: string;
  } | null>(null);
  const [quantifyOptions, setQuantifyOptions] = useState<string[]>([]);
  const [isQuantifying, setIsQuantifying] = useState<boolean>(false);

  // Safe active experience
  const currentExp = experiences[activeIndex] || null;

  // Sync sub-step progress (total = experiences.length * 2, current = activeIndex * 2 + subStage)
  React.useEffect(() => {
    if (onSubStepChange) {
      const totalStages = Math.max(1, experiences.length * 2);
      const currentProgress = experiences.length > 0 ? activeIndex * 2 + subStage : 0;
      onSubStepChange(currentProgress, totalStages);
    }
  }, [activeIndex, subStage, experiences.length, onSubStepChange]);

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
    // Jump to the newly added item at subStage 0
    setTimeout(() => {
      const currentList = useResumeStore.getState().resumeData.experiences || [];
      if (currentList.length > 0) {
        setActiveIndex(currentList.length - 1);
        setSubStage(0);
      }
    }, 40);
  };

  const handleDeleteCurrent = () => {
    if (!currentExp) return;
    const deletedExp = { ...currentExp };
    const deletedIdx = activeIndex;

    removeExperience(currentExp.id);

    showUndoToast({
      messageAr: deletedExp.company ? `تم حذف خبرة "${deletedExp.company}"` : 'تم حذف الخبرة المهنية',
      messageEn: deletedExp.company ? `Deleted "${deletedExp.company}"` : 'Experience entry deleted',
      onUndo: () => {
        insertExperienceAtIndex(deletedIdx, deletedExp);
        setActiveIndex(deletedIdx);
        setSubStage(0);
      },
    });

    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      setSubStage(0);
    } else {
      setActiveIndex(0);
      setSubStage(0);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    if (!currentExp) return;
    updateExperience(currentExp.id, { [field]: value });
  };

  const handleBulletChange = (bIdx: number, val: string) => {
    if (!currentExp) return;
    const nextBullets = [...(currentExp.bulletPoints || [])];
    nextBullets[bIdx] = val;
    updateExperience(currentExp.id, { bulletPoints: nextBullets });
  };

  const handleAddBullet = () => {
    if (!currentExp) return;
    const nextBullets = [...(currentExp.bulletPoints || []), ''];
    updateExperience(currentExp.id, { bulletPoints: nextBullets });
  };

  const handleRemoveBullet = (bIdx: number) => {
    if (!currentExp) return;
    const nextBullets = (currentExp.bulletPoints || []).filter((_, idx) => idx !== bIdx);
    updateExperience(currentExp.id, { bulletPoints: nextBullets.length > 0 ? nextBullets : [''] });
  };

  // AI Quantify handler
  const handleStartQuantify = async (bIdx: number, text: string) => {
    if (!currentExp) return;
    setQuantifyTarget({ expId: currentExp.id, bIdx, text, jobTitle: currentExp.position });
    setIsQuantifying(true);
    setQuantifyOptions([]);

    try {
      const data = await aiApi.quantifyAchievement({
        text: text || (isAr ? 'مسؤول عن تطوير وتحسين العمليات' : 'Responsible for improving systems'),
        jobTitle: currentExp.position || (isAr ? 'محترف' : 'Professional'),
        language: settings.language,
      });

      if (data && Array.isArray(data.options) && data.options.length > 0) {
        setQuantifyOptions(data.options);
      } else {
        setQuantifyOptions([
          isAr
            ? `${text || 'طوّرت وحسّنت العمليات'}، مما حقق زيادة في الكفاءة والإنتاجية بنسبة 35%.`
            : `${text || 'Optimized operational workflows'}, delivering a 35% increase in team performance.`
        ]);
      }
    } catch {
      setQuantifyOptions([
        isAr
          ? `${text || 'طوّرت وحسّنت العمليات'}، مما حقق زيادة في الكفاءة والإنتاجية بنسبة 35%.`
          : `${text || 'Optimized operational workflows'}, delivering a 35% increase in team performance.`
      ]);
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

  // Slide animations
  const slideVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.18 } },
  };

  // 1. EMPTY STATE (No experiences added yet)
  if (experiences.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto space-y-6 text-center py-4">
        <div className="w-16 h-16 rounded-3xl bg-[#FF4D2D]/10 text-[#FF4D2D] flex items-center justify-center mx-auto shadow-xs">
          <Briefcase className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs sm:text-sm font-bold tracking-wide text-[#FF4D2D] block mb-2">
            {isAr ? 'الخطوة 02: مسارك المهني' : 'Step 02: Work Experience'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#001639] tracking-tight mb-2">
            {isAr ? 'إيه أهم المحطات في مسارك المهني؟' : 'Add your professional experience'}
          </h1>
          <p className="text-sm text-[#7a8093] max-w-md mx-auto">
            {isAr
              ? 'أضف خبراتك السابقة أو الحالية. لو كنت خريج جديد وبدون خبرات عملية، تقدر تتخطى الخطوة دي مباشرة.'
              : 'Add your current or past work roles. If you are a fresh graduate, you can skip this step.'}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 pt-4">
          <button
            type="button"
            onClick={handleAddNewExperience}
            className="w-full py-4 px-6 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-base rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5 text-[#FF4D2D]" />
            <span>{isAr ? 'إضافة أول خبرة مهنية' : 'Add First Experience'}</span>
          </button>

          <div className="flex items-center justify-between w-full pt-2">
            <button
              type="button"
              onClick={onPrevMainStep}
              className="text-xs text-[#7a8093] hover:text-[#001639] font-medium transition cursor-pointer"
            >
              {isAr ? '← رجوع للبيانات الشخصية' : '← Back to Personal Info'}
            </button>
            <button
              type="button"
              onClick={onNextMainStep}
              className="text-xs text-[#7a8093] hover:text-[#001639] font-medium transition underline-offset-4 hover:underline cursor-pointer"
            >
              {isAr ? 'تخطي إلى التعليم والمؤهلات' : 'Skip to Education'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. FOCUSED SINGLE EXPERIENCE VIEW (Split into Sub-Stage 0 and Sub-Stage 1)
  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Top Experience Header: Simple single-row pagination + quiet actions */}
      <div className="flex items-center justify-between gap-2 mb-6 pb-3 border-b border-[#e8e5de]">
        {/* Left / Start: Compact arrows + counter like photo carousel */}
        <div className="flex items-center gap-2 min-w-0">
          {experiences.length > 1 ? (
            <div className="flex items-center gap-0.5 bg-[#f4f1e9] px-1.5 py-1 rounded-xl border border-[#e2dec9] shrink-0">
              <button
                type="button"
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                className="p-1 text-[#001639] hover:text-[#FF4D2D] disabled:opacity-25 rounded-lg transition cursor-pointer"
                title={isAr ? 'الخبرة السابقة' : 'Previous role'}
                aria-label={isAr ? 'الخبرة السابقة' : 'Previous role'}
              >
                {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              <span className="text-xs font-black text-[#001639] px-1 tracking-tight">
                {activeIndex + 1} / {experiences.length}
              </span>
              <button
                type="button"
                disabled={activeIndex === experiences.length - 1}
                onClick={() => setActiveIndex((prev) => Math.min(experiences.length - 1, prev + 1))}
                className="p-1 text-[#001639] hover:text-[#FF4D2D] disabled:opacity-25 rounded-lg transition cursor-pointer"
                title={isAr ? 'الخبرة التالية' : 'Next role'}
                aria-label={isAr ? 'الخبرة التالية' : 'Next role'}
              >
                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <span className="text-xs font-black text-[#7a8093] bg-[#f4f1e9] px-2.5 py-1 rounded-lg shrink-0">
              {isAr ? 'خبرة 1' : 'Role 1'}
            </span>
          )}

          {currentExp.company && (
            <span className="text-xs font-bold text-[#7a8093] truncate max-w-[120px] sm:max-w-[180px]">
              {currentExp.company}
            </span>
          )}
        </div>

        {/* Right / End: Subtle tabs & quiet icon-only buttons with safe >=8px spacing */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Substage tabs toggle */}
          <div className="inline-flex p-0.5 bg-[#f4f1e9] rounded-xl border border-[#e2dec9] me-1">
            <button
              type="button"
              onClick={() => setSubStage(0)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                subStage === 0 ? 'bg-[#001639] text-white shadow-2xs' : 'text-[#7a8093] hover:text-[#001639]'
              }`}
            >
              {isAr ? 'البيانات' : 'Basics'}
            </button>
            <button
              type="button"
              onClick={() => setSubStage(1)}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                subStage === 1 ? 'bg-[#001639] text-white shadow-2xs' : 'text-[#7a8093] hover:text-[#001639]'
              }`}
            >
              {isAr ? 'الإنجازات' : 'Points'}
            </button>
          </div>

          {/* Add Another Experience (Quiet icon with >=8px safe separation) */}
          <button
            type="button"
            onClick={handleAddNewExperience}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-[#7a8093] hover:text-[#001639] hover:bg-[#f4f1e9] rounded-lg transition cursor-pointer active:scale-95"
            title={isAr ? 'إضافة خبرة أخرى' : 'Add another role'}
            aria-label={isAr ? 'إضافة خبرة أخرى' : 'Add another role'}
          >
            <Plus className="w-4 h-4 text-[#FF4D2D]" />
          </button>

          {/* Delete Button (Quiet icon with safe distance from Add) */}
          <button
            type="button"
            onClick={handleDeleteCurrent}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-[#7a8093] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer active:scale-95 ms-1"
            title={isAr ? 'حذف هذه الخبرة' : 'Delete this role'}
            aria-label={isAr ? 'حذف هذه الخبرة' : 'Delete this role'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Form: Sub-Stage 0 (Basics) OR Sub-Stage 1 (Achievements) */}
      <AnimatePresence mode="wait">
        {subStage === 0 && (
          <motion.div
            key={`exp-${currentExp.id}-stage-0`}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-5"
          >
            {/* Header */}
            <div>
              <span className="text-xs sm:text-sm font-bold tracking-wide text-[#FF4D2D] block mb-1">
                {isAr ? 'بيانات الوظيفة والشركة' : 'Role & Company Basics'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#001639] tracking-tight mb-2">
                {isAr ? 'أين عملت وما كان دورك؟' : 'Where did you work & what was your title?'}
              </h2>
              <p className="text-sm text-[#7a8093]">
                {isAr
                  ? 'اكتب اسم الشركة والمسمى الوظيفي وفترة العمل.'
                  : 'Specify company name, job title, and employment dates.'}
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`exp-company-${currentExp.id}`} className="block text-xs font-bold text-[#12141a] mb-1.5">
                  {isAr ? 'اسم الشركة / المؤسسة' : 'Company / Organization'}
                </label>
                <input
                  id={`exp-company-${currentExp.id}`}
                  type="text"
                  autoFocus
                  placeholder={isAr ? 'مثال: فودافون أو أرامكو' : 'e.g., Google or Acme Inc.'}
                  value={currentExp.company || ''}
                  onChange={(e) => handleFieldChange('company', e.target.value)}
                  className="w-full px-4 py-3 text-sm font-medium text-[#12141a] bg-white border-2 border-[#e8e5de] focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 rounded-2xl outline-none transition-all placeholder:text-[#9099ac]"
                />
              </div>

              <div>
                <label htmlFor={`exp-position-${currentExp.id}`} className="block text-xs font-bold text-[#12141a] mb-1.5">
                  {isAr ? 'المسمى الوظيفي' : 'Job Title / Position'}
                </label>
                <input
                  id={`exp-position-${currentExp.id}`}
                  type="text"
                  placeholder={isAr ? 'مثال: مهندس برمجيات أول' : 'e.g., Senior Software Engineer'}
                  value={currentExp.position || ''}
                  onChange={(e) => handleFieldChange('position', e.target.value)}
                  className="w-full px-4 py-3 text-sm font-medium text-[#12141a] bg-white border-2 border-[#e8e5de] focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 rounded-2xl outline-none transition-all placeholder:text-[#9099ac]"
                />
              </div>

              <div>
                <label htmlFor={`exp-location-${currentExp.id}`} className="block text-xs font-bold text-[#12141a] mb-1.5">
                  {isAr ? 'الموقع (المدينة أو العمل عن بعد)' : 'Location'}
                </label>
                <input
                  id={`exp-location-${currentExp.id}`}
                  type="text"
                  placeholder={isAr ? 'مثال: الرياض، السعودية (أو عن بُعد)' : 'e.g., Cairo, Egypt / Remote'}
                  value={currentExp.location || ''}
                  onChange={(e) => handleFieldChange('location', e.target.value)}
                  className="w-full px-4 py-3 text-sm font-medium text-[#12141a] bg-white border-2 border-[#e8e5de] focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 rounded-2xl outline-none transition-all placeholder:text-[#9099ac]"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={`exp-start-${currentExp.id}`} className="block text-xs font-bold text-[#12141a] mb-1.5">
                    {isAr ? 'تاريخ البدء' : 'Start Date'}
                  </label>
                  <input
                    id={`exp-start-${currentExp.id}`}
                    type="text"
                    dir="ltr"
                    placeholder={isAr ? '01/2021' : 'Jan 2021'}
                    value={currentExp.startDate || ''}
                    onChange={(e) => handleFieldChange('startDate', e.target.value)}
                    className="w-full px-3 py-3 text-sm font-medium text-[#12141a] bg-white border-2 border-[#e8e5de] focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 rounded-2xl outline-none transition-all placeholder:text-[#9099ac]"
                  />
                </div>

                <div>
                  <label htmlFor={`exp-end-${currentExp.id}`} className="block text-xs font-bold text-[#12141a] mb-1.5">
                    {isAr ? 'تاريخ الانتهاء' : 'End Date'}
                  </label>
                  <input
                    id={`exp-end-${currentExp.id}`}
                    type="text"
                    dir="ltr"
                    disabled={currentExp.current}
                    placeholder={currentExp.current ? (isAr ? 'حتى الآن' : 'Present') : isAr ? '12/2023' : 'Dec 2023'}
                    value={currentExp.current ? '' : currentExp.endDate || ''}
                    onChange={(e) => handleFieldChange('endDate', e.target.value)}
                    className={`w-full px-3 py-3 text-sm font-medium text-[#12141a] bg-white border-2 border-[#e8e5de] focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 rounded-2xl outline-none transition-all placeholder:text-[#9099ac] ${
                      currentExp.current ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Current role checkbox */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id={`exp-current-${currentExp.id}`}
                type="checkbox"
                checked={Boolean(currentExp.current)}
                onChange={(e) => handleFieldChange('current', e.target.checked)}
                className="w-4 h-4 text-[#FF4D2D] rounded border-[#e8e5de] focus:ring-[#FF4D2D] cursor-pointer"
              />
              <label htmlFor={`exp-current-${currentExp.id}`} className="text-xs font-bold text-[#12141a] cursor-pointer">
                {isAr ? 'أعمل هنا حالياً (الوظيفة الحالية)' : 'I currently work here'}
              </label>
            </div>

            {/* Action Footer for Sub-Stage 0 */}
            <div className="pt-4 border-t border-[#e8e5de] flex items-center justify-between gap-3 sticky bottom-0 bg-[#fbfaf7]/95 backdrop-blur-xs py-3 z-10">
              <button
                type="button"
                onClick={() => {
                  if (activeIndex > 0) {
                    setActiveIndex(activeIndex - 1);
                    setSubStage(1);
                  } else {
                    onPrevMainStep();
                  }
                }}
                className="min-h-[44px] py-3 px-4 sm:px-5 bg-white border-2 border-[#e8e5de] text-[#001639] hover:bg-[#f4f1e9] font-bold text-sm rounded-2xl transition cursor-pointer active:scale-95"
              >
                {activeIndex > 0 ? (isAr ? 'الخبرة السابقة' : 'Prev Role') : isAr ? 'السابق' : 'Back'}
              </button>

              <button
                type="button"
                onClick={() => setSubStage(1)}
                className="min-h-[48px] flex-1 max-w-sm py-3 px-6 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-sm sm:text-base rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>{isAr ? 'التالي: كتابة الإنجازات' : 'Next: Key Achievements'}</span>
                {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        )}

        {subStage === 1 && (
          <motion.div
            key={`exp-${currentExp.id}-stage-1`}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-5"
          >
            {/* Header */}
            <div>
              <span className="text-xs sm:text-sm font-bold tracking-wide text-[#FF4D2D] block mb-1">
                {isAr ? 'المسؤوليات والإنجازات' : 'Responsibilities & Achievements'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#001639] tracking-tight mb-2">
                {currentExp.position || currentExp.company
                  ? `${currentExp.position || ''} ${currentExp.company ? `(${currentExp.company})` : ''}`
                  : isAr
                  ? 'إنجازاتك في هذا الدور'
                  : 'Your Key Achievements'}
              </h2>
              <p className="text-sm text-[#7a8093]">
                {isAr
                  ? 'اكتب نقاط إنجاز قوية مدعومة بأرقام ونسب مئوية لرفع نسبة قبولك في الـ ATS.'
                  : 'Describe measurable impact and results using strong action verbs.'}
              </p>
            </div>

            {/* Bullet Points / Achievements Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#12141a]">
                    {isAr ? 'نقاط الإنجاز والمسؤوليات' : 'Bullet Points'}
                  </span>
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                      (currentExp.bulletPoints || []).length >= 3 && (currentExp.bulletPoints || []).length <= 5
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : (currentExp.bulletPoints || []).length > 5
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {(currentExp.bulletPoints || []).length} / 5 {isAr ? 'نقاط (الموصى به 3-5)' : 'points (Recommended: 3-5)'}
                  </span>
                </div>

                {openAiModal && (
                  <button
                    type="button"
                    onClick={() => openAiModal('bullet', currentExp.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#FF4D2D]/10 to-[#001639]/10 text-[#001639] hover:text-[#FF4D2D] text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D]" />
                    <span>{isAr ? 'اقتراح نقاط بالذكاء' : 'AI Generate'}</span>
                  </button>
                )}
              </div>

              {/* Guidance tip banner */}
              <p className="text-[11px] text-[#7a8093] bg-[#fbfaf7] p-2.5 rounded-xl border border-[#e8e5de]">
                {isAr
                  ? '💡 معيار التوظيف و ATS: من الأفضل كتابة بين 3 إلى 5 نقاط إنجاز لكل دور وظيفي لتفادي الحشو أو الاختصار المخل، مع التركيز على النتائج والأرقام.'
                  : '💡 Recruiter & ATS Guideline: 3 to 5 bullet points per role is the sweet spot for maximum impact without overwhelming the reader.'}
              </p>

              <div className="space-y-2.5">
                {(currentExp.bulletPoints || []).map((bullet, bIdx) => (
                  <div key={`bullet-${bIdx}`} className="space-y-1.5">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold text-slate-400 pt-3 shrink-0 select-none">
                        •
                      </span>
                      <textarea
                        id={`exp-bullet-${currentExp.id}-${bIdx}`}
                        rows={2}
                        placeholder={
                          isAr
                            ? 'مثال: قدت فريقاً من 6 مهندسين لتسريع أداء التطبيق بنسبة 35% مما وفر 120 ساعة شهرياً...'
                            : 'e.g., Led a team of 6 engineers to optimize load times by 35%, saving 120 hours monthly...'
                        }
                        value={bullet || ''}
                        onChange={(e) => handleBulletChange(bIdx, e.target.value)}
                        className="flex-1 p-3 text-sm font-medium text-[#12141a] bg-white border-2 border-[#e8e5de] focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 rounded-2xl outline-none transition-all placeholder:text-[#9099ac] resize-y"
                      />

                      <div className="flex flex-col gap-1 shrink-0 pt-1">
                        {/* AI Quantify button */}
                        <button
                          type="button"
                          onClick={() => handleStartQuantify(bIdx, bullet)}
                          disabled={isQuantifying && quantifyTarget?.bIdx === bIdx}
                          className="p-2 text-[#001639] hover:bg-[#f4f1e9] hover:text-[#FF4D2D] rounded-xl transition cursor-pointer"
                          title={isAr ? 'تحويل لإنجاز رقمي بالأرقام' : 'Quantify achievement'}
                        >
                          {isQuantifying && quantifyTarget?.bIdx === bIdx ? (
                            <Loader2 className="w-4 h-4 animate-spin text-[#FF4D2D]" />
                          ) : (
                            <TrendingUp className="w-4 h-4" />
                          )}
                        </button>

                        {/* Remove Bullet */}
                        <button
                          type="button"
                          onClick={() => handleRemoveBullet(bIdx)}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                          title={isAr ? 'حذف هذه النقطة' : 'Remove bullet point'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Quantify Options Tray */}
                    {quantifyTarget && quantifyTarget.bIdx === bIdx && quantifyOptions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2 mt-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                            <TrendingUp className="w-3.5 h-3.5 text-amber-700" />
                            {isAr ? 'اختر صياغة رقمية محسنة:' : 'Select a quantified enhancement:'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantifyOptions([])}
                            className="text-amber-800 hover:text-amber-950 p-1 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          {quantifyOptions.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleApplyQuantified(opt)}
                              className="w-full text-right p-2.5 bg-white hover:bg-amber-100/60 border border-amber-200/80 rounded-xl text-xs font-medium text-slate-900 transition flex items-start justify-between gap-2 cursor-pointer"
                            >
                              <span className="flex-1">{opt}</span>
                              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddBullet}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#001639] hover:text-[#FF4D2D] bg-[#f4f1e9] hover:bg-[#e8e5de] rounded-xl transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? '+ إضافة نقطة إنجاز أخرى' : '+ Add another bullet point'}</span>
                </button>
              </div>
            </div>

            {/* Action Footer for Sub-Stage 1 */}
            <div className="pt-4 border-t border-[#e8e5de] flex flex-col items-center gap-3 sticky bottom-0 bg-[#fbfaf7]/95 backdrop-blur-xs py-3 z-10">
              <div className="w-full flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSubStage(0)}
                  className="min-h-[44px] py-3 px-4 sm:px-5 bg-white border-2 border-[#e8e5de] text-[#001639] hover:bg-[#f4f1e9] font-bold text-sm rounded-2xl transition cursor-pointer active:scale-95"
                >
                  {isAr ? 'السابق: بيانات الشركة' : 'Back to Basics'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (activeIndex < experiences.length - 1) {
                      setActiveIndex(activeIndex + 1);
                      setSubStage(0);
                    } else {
                      onNextMainStep();
                    }
                  }}
                  className="min-h-[48px] flex-1 py-3 px-6 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-sm sm:text-base rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>
                    {activeIndex < experiences.length - 1
                      ? isAr
                        ? 'الخبرة التالية'
                        : 'Next Experience'
                      : isAr
                      ? 'إنهاء الخبرات والانتقال للتعليم'
                      : 'Finish & Go to Education'}
                  </span>
                  {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center justify-between w-full">
                <button
                  type="button"
                  onClick={handleAddNewExperience}
                  className="text-xs text-[#FF4D2D] hover:underline font-bold transition cursor-pointer"
                >
                  {isAr ? '+ إضافة خبرة عمل أخرى' : '+ Add another role'}
                </button>
                <button
                  type="button"
                  onClick={onNextMainStep}
                  className="text-xs text-[#7a8093] hover:text-[#001639] transition font-medium underline-offset-4 hover:underline cursor-pointer"
                >
                  {isAr ? 'تخطي مباشرة للتعليم' : 'Skip to Education'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
