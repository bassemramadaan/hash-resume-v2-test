import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Type,
  Layers,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';
import { usePdfExportProgressStore, ExportStep } from '../../store/usePdfExportProgressStore';
import { useResumeStore } from '../../store/useResumeStore';

interface StepDefinition {
  key: ExportStep;
  titleAr: string;
  titleEn: string;
  icon: React.ElementType;
}

const STEPS: StepDefinition[] = [
  {
    key: 'preparing_fonts',
    titleAr: 'تجهيز الخطوط والأصول...',
    titleEn: 'Preparing fonts & assets...',
    icon: Type,
  },
  {
    key: 'rendering_canvas',
    titleAr: 'رسم وتنسيق القالب بدقة ATS...',
    titleEn: 'Rendering ATS-compliant layout...',
    icon: Layers,
  },
  {
    key: 'slicing_pages',
    titleAr: 'تقسيم الصفحات وتوليد المستند (PDF)...',
    titleEn: 'Slicing pages & building PDF...',
    icon: FileText,
  },
  {
    key: 'saving_file',
    titleAr: 'حفظ وتحميل الملف...',
    titleEn: 'Saving & downloading file...',
    icon: Download,
  },
];

export const PdfExportProgressModal: React.FC = () => {
  const { isOpen, step, progressPercent, errorMessage, closeExportProgress } =
    usePdfExportProgressStore();
  const { settings } = useResumeStore();
  const isAr = (settings?.language || 'ar') === 'ar';

  if (!isOpen) return null;

  const getStepIndex = (currentStep: ExportStep) => {
    if (currentStep === 'completed') return STEPS.length;
    if (currentStep === 'error') return -1;
    const index = STEPS.findIndex((s) => s.key === currentStep);
    return index >= 0 ? index : 0;
  };

  const currentStepIdx = getStepIndex(step);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="pdf-progress-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs"
        >
          <motion.div
            key="pdf-progress-card"
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 350 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Header Banner */}
            <div className="bg-[#001639] p-5 sm:p-6 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FF4D2D]/15 rounded-full blur-2xl pointer-events-none" />

              {step === 'error' && (
                <button
                  type="button"
                  onClick={closeExportProgress}
                  className="absolute top-4 left-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                  title={isAr ? 'إغلاق' : 'Close'}
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <div className="relative z-10 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto shadow-inner">
                  {step === 'error' ? (
                    <AlertCircle className="w-6 h-6 text-rose-400" />
                  ) : step === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white">
                  {step === 'error'
                    ? isAr
                      ? 'تعذر تصدير الملف'
                      : 'Export Failed'
                    : step === 'completed'
                    ? isAr
                      ? 'تم تصدير السيرة الذاتية بنجاح!'
                      : 'Resume Exported Successfully!'
                    : isAr
                    ? 'جاري تصدير السيرة الذاتية (PDF)'
                    : 'Exporting Your Resume (PDF)'}
                </h3>

                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  {step === 'error'
                    ? isAr
                      ? 'حدث خطأ أثناء معالجة المستند.'
                      : 'An error occurred while preparing the PDF.'
                    : step === 'completed'
                    ? isAr
                      ? 'تم تنزيل المستند عالي الدقة على جهازك.'
                      : 'High-res document downloaded to your device.'
                    : isAr
                    ? 'يرجى الانتظار لحظات لمعالجة التنسيق وتقسيم الصفحات بدقة ATS'
                    : 'Please wait while we render your ATS-friendly layout'}
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 space-y-5">
              {step === 'error' ? (
                <div className="space-y-4">
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 leading-relaxed font-medium flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMessage || (isAr ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred')}</span>
                  </div>
                  <button
                    type="button"
                    onClick={closeExportProgress}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition shadow-xs cursor-pointer"
                  >
                    {isAr ? 'إغلاق والمحاولة مرة أخرى' : 'Close & Retry'}
                  </button>
                </div>
              ) : (
                <>
                  {/* Progress Bar with Percentage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                      <span>{isAr ? 'نسبة الإنجاز' : 'Progress'}</span>
                      <span className="text-[#FF4D2D]">{Math.round(progressPercent)}%</span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                      <motion.div
                        className={`h-full rounded-full transition-all duration-300 ${
                          step === 'completed'
                            ? 'bg-emerald-500'
                            : 'bg-linear-to-r from-amber-400 via-[#FF4D2D] to-rose-500'
                        }`}
                        initial={{ width: '0%' }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ ease: 'easeOut', duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Phased Steps Checklist */}
                  <div className="space-y-2.5 pt-1">
                    {STEPS.map((s, idx) => {
                      const isPast = step === 'completed' || currentStepIdx > idx;
                      const isCurrent = step !== 'completed' && currentStepIdx === idx;
                      const isPending = currentStepIdx < idx;
                      const IconComponent = s.icon;

                      return (
                        <div
                          key={s.key}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 transition-all duration-200 ${
                            isCurrent
                              ? 'bg-amber-50/70 border-amber-300 text-slate-900 shadow-2xs'
                              : isPast
                              ? 'bg-slate-50/80 border-slate-200/80 text-slate-500'
                              : 'bg-white border-transparent text-slate-400 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isCurrent
                                  ? 'bg-amber-100 text-amber-700'
                                  : isPast
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-400'
                              }`}
                            >
                              <IconComponent className="w-3.5 h-3.5" />
                            </div>
                            <span
                              className={`text-xs font-semibold truncate ${
                                isCurrent ? 'text-slate-900 font-bold' : isPast ? 'text-slate-700' : 'text-slate-400'
                              }`}
                            >
                              {isAr ? s.titleAr : s.titleEn}
                            </span>
                          </div>

                          <div className="shrink-0">
                            {isPast ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : isCurrent ? (
                              <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-slate-300" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
