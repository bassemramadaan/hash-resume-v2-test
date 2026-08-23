import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../../store/useResumeStore';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PostDownloadSuccessModal: React.FC = () => {
  const { isPostDownloadModalOpen, setIsPostDownloadModalOpen, settings } = useResumeStore();
  const isAr = settings.language === 'ar';
  const [countdown, setCountdown] = useState(3);
  const hasRedirectedRef = useRef(false);

  const performRedirect = () => {
    if (hasRedirectedRef.current) return;
    hasRedirectedRef.current = true;
    setIsPostDownloadModalOpen(false);
    window.location.assign('/hash-hunt#apply-now');
  };

  useEffect(() => {
    if (isPostDownloadModalOpen) {
      hasRedirectedRef.current = false;

      // Trigger small celebration confetti on mount
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore if canvas-confetti fails
      }

      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const redirectTimeout = setTimeout(() => {
        performRedirect();
      }, 2800);

      return () => {
        clearInterval(timer);
        clearTimeout(redirectTimeout);
      };
    }
  }, [isPostDownloadModalOpen]);

  if (!isPostDownloadModalOpen) return null;

  const handleStayHere = () => {
    hasRedirectedRef.current = true;
    setIsPostDownloadModalOpen(false);
  };

  const handleImmediateNavigate = () => {
    performRedirect();
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
        >
          <motion.div
            key="post-download-modal-card"
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            dir={isAr ? 'rtl' : 'ltr'}
            className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800 my-auto flex flex-col relative"
          >
            {/* Header / Celebration Banner */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 p-6 pt-7 text-center relative overflow-hidden border-b border-slate-100">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mb-3 shadow-inner ring-4 ring-emerald-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h2 className="font-extrabold text-lg sm:text-xl text-slate-900 leading-snug">
                {isAr ? 'تم تحميل سيرتك الذاتية بنجاح! 🎉' : 'Your resume has been downloaded! 🎉'}
              </h2>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 space-y-4 text-center">
              <div className="space-y-2 text-sm text-slate-600 leading-relaxed font-medium">
                <p>
                  {isAr
                    ? 'ربنا يوفقك وإن شاء الله تلاقي الفرصة المناسبة.'
                    : 'We wish you the best of luck finding the right opportunity.'}
                </p>
                <p className="text-emerald-700 font-bold animate-pulse">
                  {isAr ? 'يتم الآن نقلك إلى Apply Now...' : 'Taking you to Apply Now...'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <motion.div
                  className="bg-emerald-500 h-full rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2.8, ease: 'linear' }}
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <button
                  onClick={handleImmediateNavigate}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#001639] hover:bg-[#00245a] text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <span>{isAr ? 'الانتقال الآن' : 'Go now'}</span>
                  {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleStayHere}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition cursor-pointer"
                >
                  {isAr ? 'البقاء هنا' : 'Stay here'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

