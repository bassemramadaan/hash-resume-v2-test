import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X, ArrowLeft, ArrowRight, User, Briefcase, CheckCircle2 } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { ResumeValidationResult } from '../../utils/resumeValidation';

interface ResumeValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  validationResult: ResumeValidationResult;
  onNavigateSection?: (sectionKey: 'personal' | 'experiences' | 'education' | 'skills') => void;
}

export const ResumeValidationModal: React.FC<ResumeValidationModalProps> = ({
  isOpen,
  onClose,
  validationResult,
  onNavigateSection,
}) => {
  const { settings, setActiveTab } = useResumeStore();
  const isAr = settings.language === 'ar';
  const isFr = settings.language === 'fr';

  if (!isOpen) return null;

  const missingList = isAr
    ? validationResult.missingItemsAr
    : isFr
    ? validationResult.missingItemsFr
    : validationResult.missingItemsEn;

  const titleText = isAr
    ? validationResult.summaryMessageAr
    : isFr
    ? validationResult.summaryMessageFr
    : validationResult.summaryMessageEn;

  const handleFixPersonal = () => {
    onClose();
    if (onNavigateSection) {
      onNavigateSection('personal');
    } else {
      setActiveTab('personal');
    }
  };

  const handleFixSection = () => {
    onClose();
    if (onNavigateSection) {
      onNavigateSection('experiences');
    } else {
      setActiveTab('experiences');
    }
  };

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-amber-500/10 border-b border-amber-200 p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {titleText}
                </h3>
                <p className="text-xs text-amber-900 font-medium">
                  {isAr
                    ? 'يرجى إكمال البيانات الأساسية قبل التحميل والدفع'
                    : 'Please fill in key details before downloading or proceeding'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Missing items list */}
          <div className="p-5 space-y-4">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isAr
                ? 'لحماية جودة سيرتك الذاتية وتجنب التصدير ببيانات افتراضية (مثل YOUR NAME)، يرجى استكمال الحقول التالية:'
                : 'To ensure high quality and prevent placeholder text like "YOUR NAME", please complete:'}
            </p>

            <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {missingList.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 font-semibold">
                  <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Direct action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleFixPersonal}
                className="w-full py-2.5 px-4 bg-[#001639] hover:bg-[#00245E] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs min-h-[44px]"
              >
                <User className="w-4 h-4 text-[#FF4D2D]" />
                <span>{isAr ? 'تعبئة البيانات الأساسية' : 'Edit Personal Info'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleFixSection}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 flex items-center justify-center gap-2 transition cursor-pointer min-h-[44px]"
              >
                <Briefcase className="w-4 h-4 text-slate-600" />
                <span>{isAr ? 'إضافة خبرات أو تعليم' : 'Add Experience / Edu'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
