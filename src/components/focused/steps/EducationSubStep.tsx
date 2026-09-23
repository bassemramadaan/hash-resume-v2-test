import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../../../store/useResumeStore';
import { useUndoToastStore } from '../../../store/useUndoToastStore';
import {
  GraduationCap,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

interface EducationSubStepProps {
  onNextMainStep: () => void;
  onPrevMainStep: () => void;
  onSubStepChange?: (subIndex: number, totalSubs: number) => void;
  isAr?: boolean;
}

export const EducationSubStep: React.FC<EducationSubStepProps> = ({
  onNextMainStep,
  onPrevMainStep,
  onSubStepChange,
  isAr = true,
}) => {
  const {
    resumeData,
    addEducation,
    updateEducation,
    removeEducation,
    insertEducationAtIndex,
  } = useResumeStore();
  const { showUndoToast } = useUndoToastStore();

  const educationList = resumeData.education || [];
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Degree Presets
  const degreePresets = isAr
    ? ['بكالوريوس', 'ماجستير', 'دبلوم عالي', 'ثانوية عامة', 'دكتوراه']
    : ["Bachelor's", "Master's", 'High Diploma', 'High School', 'PhD'];

  // Safe active education item
  const currentEdu = educationList[activeIndex] || null;

  // Sync sub-step progress if needed
  React.useEffect(() => {
    if (onSubStepChange) {
      onSubStepChange(activeIndex, Math.max(1, educationList.length));
    }
  }, [activeIndex, educationList.length, onSubStepChange]);

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
    // Jump to the newly added item
    setTimeout(() => {
      const currentList = useResumeStore.getState().resumeData.education || [];
      if (currentList.length > 0) {
        setActiveIndex(currentList.length - 1);
      }
    }, 40);
  };

  const handleDeleteCurrent = () => {
    if (!currentEdu) return;
    const deletedEdu = { ...currentEdu };
    const deletedIdx = activeIndex;

    removeEducation(currentEdu.id);

    showUndoToast({
      messageAr: deletedEdu.degree ? `تم حذف مؤهل "${deletedEdu.degree}"` : 'تم حذف المؤهل التعليمي',
      messageEn: deletedEdu.degree ? `Deleted "${deletedEdu.degree}"` : 'Education entry deleted',
      onUndo: () => {
        insertEducationAtIndex(deletedIdx, deletedEdu);
        setActiveIndex(deletedIdx);
      },
    });

    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    } else {
      setActiveIndex(0);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    if (!currentEdu) return;
    updateEducation(currentEdu.id, { [field]: value });
  };

  // Slide animations
  const slideVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.18 } },
  };

  // 1. EMPTY STATE (No education added yet)
  if (educationList.length === 0) {
    return (
      <div className="w-full max-w-xl mx-auto space-y-6 text-center py-4">
        <div className="w-16 h-16 rounded-3xl bg-[#FF4D2D]/10 text-[#FF4D2D] flex items-center justify-center mx-auto shadow-xs">
          <GraduationCap className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs sm:text-sm font-bold tracking-wide text-[#FF4D2D] block mb-2">
            {isAr ? 'الخطوة 03: مؤهلاتك العلمية' : 'Step 03: Education & Degrees'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#001639] tracking-tight mb-2">
            {isAr ? 'درست إيه وفين؟' : 'What is your educational background?'}
          </h1>
          <p className="text-sm text-[#7a8093] max-w-md mx-auto">
            {isAr
              ? 'أضف شهادتك الجامعية، كليتك، أو مدرستك لتعزيز مصداقية وتوازن سيرتك الذاتية.'
              : 'Add your university, college, or school credentials to complete your profile.'}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 pt-4">
          <button
            type="button"
            onClick={handleAddNewEducation}
            className="w-full py-4 px-6 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-base rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5 text-[#FF4D2D]" />
            <span>{isAr ? 'إضافة أول مؤهل تعليمي' : 'Add First Education Entry'}</span>
          </button>

          <div className="flex items-center justify-between w-full pt-2">
            <button
              type="button"
              onClick={onPrevMainStep}
              className="text-xs text-[#7a8093] hover:text-[#001639] font-medium transition"
            >
              {isAr ? '← رجوع للخبرات المهنية' : '← Back to Experience'}
            </button>
            <button
              type="button"
              onClick={onNextMainStep}
              className="text-xs text-[#7a8093] hover:text-[#001639] font-medium transition underline-offset-4 hover:underline"
            >
              {isAr ? 'تخطي إلى المهارات واللغات' : 'Skip to Skills'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. FOCUSED SINGLE EDUCATION VIEW
  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Top Education Header: Simple single-row pagination + quiet actions */}
      <div className="flex items-center justify-between gap-2 mb-6 pb-3 border-b border-[#e8e5de]">
        {/* Left / Start: Compact arrows + counter like photo carousel */}
        <div className="flex items-center gap-2 min-w-0">
          {educationList.length > 1 ? (
            <div className="flex items-center gap-0.5 bg-[#f4f1e9] px-1.5 py-1 rounded-xl border border-[#e2dec9] shrink-0">
              <button
                type="button"
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                className="p-1 text-[#001639] hover:text-[#FF4D2D] disabled:opacity-25 rounded-lg transition cursor-pointer"
                title={isAr ? 'المؤهل السابق' : 'Previous degree'}
                aria-label={isAr ? 'المؤهل السابق' : 'Previous degree'}
              >
                {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
              <span className="text-xs font-black text-[#001639] px-1 tracking-tight">
                {activeIndex + 1} / {educationList.length}
              </span>
              <button
                type="button"
                disabled={activeIndex === educationList.length - 1}
                onClick={() => setActiveIndex((prev) => Math.min(educationList.length - 1, prev + 1))}
                className="p-1 text-[#001639] hover:text-[#FF4D2D] disabled:opacity-25 rounded-lg transition cursor-pointer"
                title={isAr ? 'المؤهل التالي' : 'Next degree'}
                aria-label={isAr ? 'المؤهل التالي' : 'Next degree'}
              >
                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <span className="text-xs font-black text-[#7a8093] bg-[#f4f1e9] px-2.5 py-1 rounded-lg shrink-0">
              {isAr ? 'مؤهل 1' : 'Degree 1'}
            </span>
          )}

          {currentEdu.degree && (
            <span className="text-xs font-bold text-[#7a8093] truncate max-w-[140px] sm:max-w-[200px]">
              {currentEdu.degree}
            </span>
          )}
        </div>

        {/* Right / End: Subtle icon-only buttons with safe >=8px spacing */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Add Another Education (Quiet icon with >=8px safe separation) */}
          <button
            type="button"
            onClick={handleAddNewEducation}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-[#7a8093] hover:text-[#001639] hover:bg-[#f4f1e9] rounded-lg transition cursor-pointer active:scale-95"
            title={isAr ? 'إضافة مؤهل آخر' : 'Add another degree'}
            aria-label={isAr ? 'إضافة مؤهل آخر' : 'Add another degree'}
          >
            <Plus className="w-4 h-4 text-[#FF4D2D]" />
          </button>

          {/* Delete Button (Quiet icon with safe distance from Add) */}
          <button
            type="button"
            onClick={handleDeleteCurrent}
            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-[#7a8093] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer active:scale-95 ms-1"
            title={isAr ? 'حذف هذا المؤهل' : 'Delete this degree'}
            aria-label={isAr ? 'حذف هذا المؤهل' : 'Delete this degree'}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Single Education Form */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`edu-card-${currentEdu.id}`}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex flex-col gap-6"
        >
          {/* Header */}
          <div>
            <span className="text-xs sm:text-sm font-bold tracking-wide text-[#FF4D2D] block mb-1">
              {isAr ? 'المؤهل العلمي والمؤسسة' : 'Degree & Institution'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#001639] tracking-tight mb-2">
              {currentEdu.degree || currentEdu.institution
                ? `${currentEdu.degree || ''} ${currentEdu.institution ? `(${currentEdu.institution})` : ''}`
                : isAr
                ? 'بيانات المؤهل الدراسي'
                : 'Education Details'}
            </h2>
          </div>

          {/* Preset Degree Chips */}
          <div className="flex flex-wrap gap-2">
            {degreePresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleFieldChange('degree', preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  currentEdu.degree === preset
                    ? 'bg-[#001639] text-white shadow-xs'
                    : 'bg-[#f4f1e9] text-[#7a8093] hover:text-[#001639] hover:bg-[#e8e5de]'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Inputs Grid */}
          <div className="space-y-4">
            {/* Visually unified Degree + Field of Study block */}
            <div className="p-3.5 bg-white border-2 border-[#e8e5de] focus-within:border-[#FF4D2D] rounded-2xl transition-all shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-[#e8e5de]/60 pb-2">
                <span className="text-xs font-bold text-[#001639]">
                  {isAr ? 'المؤهل العلمي والتخصص' : 'Degree & Field of Study'}
                </span>
                <span className="text-[11px] text-[#7a8093]">
                  {isAr ? 'حقلان متكاملان' : 'Combined view'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor={`edu-degree-${currentEdu.id}`} className="block text-xs font-bold text-[#7a8093] mb-1">
                    {isAr ? 'الدرجة العلمية' : 'Degree / Level'}
                  </label>
                  <input
                    id={`edu-degree-${currentEdu.id}`}
                    type="text"
                    autoFocus
                    placeholder={isAr ? 'مثال: بكالوريوس' : "e.g., Bachelor's"}
                    value={currentEdu.degree || ''}
                    onChange={(e) => handleFieldChange('degree', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-medium text-[#12141a] bg-[#fbfaf7] border border-[#e8e5de] focus:bg-white focus:border-[#FF4D2D] rounded-xl outline-none transition-all placeholder:text-[#9099ac]"
                  />
                </div>
                <div>
                  <label htmlFor={`edu-field-${currentEdu.id}`} className="block text-xs font-bold text-[#7a8093] mb-1">
                    {isAr ? 'التخصص الدراسي' : 'Field / Major'}
                  </label>
                  <input
                    id={`edu-field-${currentEdu.id}`}
                    type="text"
                    placeholder={isAr ? 'مثال: هندسة البرمجيات' : 'e.g., Software Engineering'}
                    value={currentEdu.fieldOfStudy || ''}
                    onChange={(e) => handleFieldChange('fieldOfStudy', e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-medium text-[#12141a] bg-[#fbfaf7] border border-[#e8e5de] focus:bg-white focus:border-[#FF4D2D] rounded-xl outline-none transition-all placeholder:text-[#9099ac]"
                  />
                </div>
              </div>
            </div>

            {/* Institution / University */}
            <div>
              <label htmlFor={`edu-institution-${currentEdu.id}`} className="block text-xs font-bold text-[#12141a] mb-1.5">
                {isAr ? 'الجامعة أو المعهد أو المدرسة' : 'Institution / University'}
              </label>
              <input
                id={`edu-institution-${currentEdu.id}`}
                type="text"
                placeholder={isAr ? 'مثال: جامعة القاهرة' : 'e.g., Cairo University'}
                value={currentEdu.institution || ''}
                onChange={(e) => handleFieldChange('institution', e.target.value)}
                className="w-full px-4 py-3 text-sm font-medium text-[#12141a] bg-white border-2 border-[#e8e5de] focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 rounded-2xl outline-none transition-all placeholder:text-[#9099ac]"
              />
            </div>

            {/* Dates & Optional GPA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Dates */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor={`edu-start-${currentEdu.id}`} className="block text-xs font-bold text-[#12141a] mb-1.5">
                    {isAr ? 'سنة البدء' : 'Start Year'}
                  </label>
                  <input
                    id={`edu-start-${currentEdu.id}`}
                    type="text"
                    dir="ltr"
                    placeholder="2019"
                    value={currentEdu.startDate || ''}
                    onChange={(e) => handleFieldChange('startDate', e.target.value)}
                    className="w-full px-3 py-3 text-sm font-medium text-[#12141a] bg-white border-2 border-[#e8e5de] focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 rounded-2xl outline-none transition-all placeholder:text-[#9099ac]"
                  />
                </div>

                <div>
                  <label htmlFor={`edu-end-${currentEdu.id}`} className="block text-xs font-bold text-[#12141a] mb-1.5">
                    {isAr ? 'سنة التخرج' : 'Graduation Year'}
                  </label>
                  <input
                    id={`edu-end-${currentEdu.id}`}
                    type="text"
                    dir="ltr"
                    placeholder="2023"
                    value={currentEdu.endDate || ''}
                    onChange={(e) => handleFieldChange('endDate', e.target.value)}
                    className="w-full px-3 py-3 text-sm font-medium text-[#12141a] bg-white border-2 border-[#e8e5de] focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 rounded-2xl outline-none transition-all placeholder:text-[#9099ac]"
                  />
                </div>
              </div>

              {/* GPA (Optional) */}
              <div>
                <label htmlFor={`edu-gpa-${currentEdu.id}`} className="block text-xs font-bold text-[#12141a] mb-1.5">
                  {isAr ? 'التقدير أو المعدل (اختياري فقط للمتفوقين)' : 'GPA (Optional, only if high)'}
                </label>
                <input
                  id={`edu-gpa-${currentEdu.id}`}
                  type="text"
                  dir="ltr"
                  placeholder={isAr ? 'مثال: 3.8 / 4.0 أو ممتاز' : 'e.g., 3.8 / 4.0 or Magna Cum Laude'}
                  value={currentEdu.gpa || ''}
                  onChange={(e) => handleFieldChange('gpa', e.target.value)}
                  className="w-full px-4 py-3 text-sm font-medium text-[#12141a] bg-white border-2 border-[#e8e5de] focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 rounded-2xl outline-none transition-all placeholder:text-[#9099ac]"
                />
              </div>
            </div>
          </div>

          {/* Action Footer for Single Education Card */}
          <div className="pt-4 border-t border-[#e8e5de] flex flex-col items-center gap-3 sticky bottom-0 bg-white/95 backdrop-blur-xs py-3 z-10">
            <div className="w-full flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (activeIndex > 0) {
                    setActiveIndex(activeIndex - 1);
                  } else {
                    onPrevMainStep();
                  }
                }}
                className="min-h-[44px] py-3 px-4 sm:px-5 bg-white border-2 border-[#e8e5de] text-[#001639] hover:bg-[#f4f1e9] font-bold text-sm rounded-2xl transition cursor-pointer active:scale-95"
              >
                {activeIndex > 0 ? (isAr ? 'المؤهل السابق' : 'Prev Degree') : isAr ? 'السابق' : 'Back'}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (activeIndex < educationList.length - 1) {
                    setActiveIndex(activeIndex + 1);
                  } else {
                    onNextMainStep();
                  }
                }}
                className="btn-folded-corner min-h-[48px] flex-1 py-3 px-6 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-sm sm:text-base rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>
                  {activeIndex < educationList.length - 1
                    ? isAr
                      ? 'المؤهل التالي'
                      : 'Next Degree'
                    : isAr
                    ? 'إنهاء التعليم والانتقال للمهارات'
                    : 'Finish & Go to Skills'}
                </span>
                {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>
            </div>

            <button
              type="button"
              onClick={onNextMainStep}
              className="text-xs text-[#7a8093] hover:text-[#001639] transition font-medium underline-offset-4 hover:underline cursor-pointer"
            >
              {isAr ? 'الانتقال مباشرة للمهارات واللغات' : 'Skip directly to Skills'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
