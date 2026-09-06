import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../../store/useResumeStore';
import { CheckCircle2, ArrowRight, ArrowLeft, Briefcase, X, FileCheck2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PostDownloadSuccessModal: React.FC = () => {
  const { isPostDownloadModalOpen, setIsPostDownloadModalOpen, settings } = useResumeStore();
  const navigate = useNavigate();
  const isAr = settings.language === 'ar';

  useEffect(() => {
    if (isPostDownloadModalOpen) {
      // Trigger subtle celebration confetti on mount
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore if canvas-confetti fails
      }
    }
  }, [isPostDownloadModalOpen]);

  if (!isPostDownloadModalOpen) return null;

  const handleClose = () => {
    setIsPostDownloadModalOpen(false);
  };

  const handleGoToJobs = () => {
    setIsPostDownloadModalOpen(false);
    navigate('/hash-hunt');
  };

  return (
    <AnimatePresence>
      {isPostDownloadModalOpen && (
        <motion.div
          key="post-download-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          onClick={handleClose}
        >
          <motion.div
            key="post-download-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            dir={isAr ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-800 my-auto flex flex-col relative"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 end-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition cursor-pointer z-10"
              aria-label={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Celebration Banner */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 p-6 pt-8 text-center relative overflow-hidden border-b border-slate-100">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mb-3 shadow-inner ring-4 ring-emerald-50">
                <FileCheck2 className="w-8 h-8" />
              </div>

              <h2 className="font-black text-xl sm:text-2xl text-slate-900 leading-snug">
                {isAr ? 'تم تحميل سيرتك الذاتية بنجاح! 🎉' : 'Your resume is downloaded! 🎉'}
              </h2>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 space-y-5 text-center">
              <div className="space-y-2 text-sm text-slate-600 font-medium leading-relaxed">
                <p>
                  {isAr
                    ? 'تم حفظ ملف الـ PDF عالي الجودة على جهازك بنجاح. نتمنى لك التوفيق في كل خطواتك القادمة!'
                    : 'Your high-quality PDF has been saved to your device. We wish you the best of luck in your career!'}
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full text-xs font-bold mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'جاهزة للتقديم على أنظمة ATS' : '100% ATS Ready'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2.5">
                {/* Stay in editor - Primary */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3 px-4 rounded-xl bg-[#001639] hover:bg-[#00245a] text-white font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
                >
                  <span>{isAr ? 'البقاء في محرر السيرة الذاتية' : 'Back to Resume Editor'}</span>
                </button>

                {/* Explore Hash Hunt Jobs - Secondary Client-Side Navigate */}
                <button
                  type="button"
                  onClick={handleGoToJobs}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm border border-slate-200 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Briefcase className="w-4 h-4 text-[#FF4D2D]" />
                  <span>{isAr ? 'تصفح الوظائف المتاحة (Hash Hunt)' : 'Explore Jobs (Hash Hunt)'}</span>
                  {isAr ? <ArrowLeft className="w-4 h-4 text-slate-400" /> : <ArrowRight className="w-4 h-4 text-slate-400" />}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostDownloadSuccessModal;
