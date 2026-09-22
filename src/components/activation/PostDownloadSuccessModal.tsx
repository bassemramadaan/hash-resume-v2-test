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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm transition-opacity"
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
            className="w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden text-slate-800 my-auto flex flex-col relative"
          >
            {/* Top Accent Gradient Bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#001639] via-[#FF4D2D] to-[#001639] shrink-0" />

            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 end-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition cursor-pointer z-10"
              aria-label={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Celebration Banner */}
            <div className="p-6 pt-8 text-center relative overflow-hidden">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/80 mb-3 shadow-xs ring-6 ring-emerald-50/50">
                <FileCheck2 className="w-8 h-8 text-emerald-600" />
              </div>

              <h2 className="font-tajawal font-black text-xl sm:text-2xl text-[#001639] leading-snug">
                {isAr ? 'تم تحميل سيرتك الذاتية بنجاح!' : 'Your resume is downloaded!'}
              </h2>
            </div>

            {/* Content Body */}
            <div className="px-6 pb-6 space-y-5 text-center">
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  {isAr
                    ? 'تم حفظ ملف الـ PDF عالي الجودة على جهازك بنجاح. نتمنى لك التوفيق في كل خطواتك القادمة!'
                    : 'Your high-quality PDF has been saved to your device. We wish you the best of luck in your career!'}
                </p>
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isAr ? 'جاهزة 100% للتقديم على أنظمة ATS' : '100% ATS Ready'}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2.5">
                {/* Stay in editor - Primary */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#FF4D2D] to-[#FF6B4A] hover:from-[#E5431F] hover:to-[#FF4D2D] text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-orange-500/20 active:scale-[0.98] min-h-[44px]"
                >
                  <span>{isAr ? 'البقاء في محرر السيرة الذاتية' : 'Back to Resume Editor'}</span>
                </button>

                {/* Explore Hash Hunt Jobs - Secondary Client-Side Navigate */}
                <button
                  type="button"
                  onClick={handleGoToJobs}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#001639] font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] min-h-[42px]"
                >
                  <Briefcase className="w-4 h-4 text-[#FF4D2D]" />
                  <span>{isAr ? 'تصفح الوظائف المتاحة (Hash Hunt)' : 'Explore Jobs (Hash Hunt)'}</span>
                  {isAr ? <ArrowLeft className="w-3.5 h-3.5 text-slate-500" /> : <ArrowRight className="w-3.5 h-3.5 text-slate-500" />}
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
