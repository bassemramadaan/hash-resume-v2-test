import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, X, Trash2 } from 'lucide-react';
import { useUndoToastStore } from '../../store/useUndoToastStore';
import { useResumeStore } from '../../store/useResumeStore';

export const GlobalUndoToast: React.FC = () => {
  const { currentToast, dismissUndoToast, triggerUndo } = useUndoToastStore();
  const { settings } = useResumeStore();
  const isAr = settings.language === 'ar';
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!currentToast) return;

    setProgress(100);
    const duration = 5000; // 5 seconds
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(progressInterval);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    const dismissTimeout = setTimeout(() => {
      dismissUndoToast();
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(dismissTimeout);
    };
  }, [currentToast?.id, dismissUndoToast]);

  return (
    <AnimatePresence>
      {currentToast && (
        <motion.div
          key={currentToast.id}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] sm:w-auto min-w-[320px] max-w-md shadow-2xl pointer-events-auto"
          role="alert"
          aria-live="assertive"
        >
          <div className="relative overflow-hidden rounded-2xl bg-[#0B1120] text-white border border-slate-700/80 shadow-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3">
            {/* Top / Bottom Progress countdown line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
              <motion.div
                className="h-full bg-amber-400"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* Icon and Message */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white truncate">
                {isAr ? currentToast.messageAr : currentToast.messageEn}
              </span>
            </div>

            {/* Actions: Undo Button + Dismiss Button */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={triggerUndo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-xs transition active:scale-95 cursor-pointer"
                title={isAr ? 'تراجع عن الحذف' : 'Undo deletion'}
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-950 shrink-0" />
                <span>{isAr ? 'تراجع' : 'Undo'}</span>
              </button>

              <button
                type="button"
                onClick={dismissUndoToast}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
