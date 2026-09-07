import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Edit3, FilePlus, X, KeyRound, Sparkles } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';

export const UnlockConfirmModal: React.FC = () => {
  const isUnlockModalOpen = useResumeStore((state) => state.isUnlockModalOpen);
  const setIsUnlockModalOpen = useResumeStore((state) => state.setIsUnlockModalOpen);
  const settings = useResumeStore((state) => state.settings);
  const activation = useResumeStore((state) => state.activation);
  const unlockResumeWithCredit = useResumeStore((state) => state.unlockResumeWithCredit);
  const resetResume = useResumeStore((state) => state.resetResume);

  if (!isUnlockModalOpen) return null;

  const isAr = settings.language === 'ar';

  const handleKeepAndEdit = () => {
    unlockResumeWithCredit();
    setIsUnlockModalOpen(false);
  };

  const handleStartFresh = () => {
    resetResume();
    unlockResumeWithCredit();
    setIsUnlockModalOpen(false);
  };

  const handleClose = () => {
    setIsUnlockModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        dir={isAr ? 'rtl' : 'ltr'}
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Decorative Header */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-brand-navy to-emerald-500" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            aria-label={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Icon & Title */}
          <div className="flex items-start gap-4 mb-5">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-200 shrink-0">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                {isAr ? 'فتح السيرة الذاتية للتعديل' : 'Unlock Resume for Editing'}
              </h3>
              <p className="text-sm text-slate-600 mt-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                {isAr
                  ? `لديك ${activation.remainingDownloads} تفعيل(ات) متبقية يمكنك استخدام أحدها الآن.`
                  : `You have ${activation.remainingDownloads} credit(s) remaining.`}
              </p>
            </div>
          </div>

          {/* Explanation */}
          <p className="text-sm text-slate-600 mb-6 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 leading-relaxed">
            {isAr
              ? 'اختر كيف ترغب في فتح السيرة الذاتية المقفلة:'
              : 'Choose how you would like to proceed with editing your locked resume:'}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {/* Option 1: Keep Data & Edit */}
            <button
              onClick={handleKeepAndEdit}
              className="w-full text-right rtl:text-right ltr:text-left flex items-start gap-3.5 p-4 rounded-xl border-2 border-brand-navy/20 hover:border-brand-navy bg-brand-navy-soft/30 hover:bg-brand-navy-soft/60 transition-all group"
            >
              <div className="p-2.5 rounded-lg bg-brand-navy text-white shrink-0 group-hover:scale-105 transition-transform">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-semibold text-slate-900 text-base">
                  {isAr ? 'الحفاظ على البيانات الحالية وتعديلها' : 'Keep current data and edit'}
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">
                  {isAr
                    ? 'سيتم الاحتفاظ بكافة المعلومات والخبرات المكتوبة وإتاحتها للتعديل المباشر.'
                    : 'Keep all current sections and details populated for further editing.'}
                </span>
              </div>
            </button>

            {/* Option 2: Start Fresh */}
            <button
              onClick={handleStartFresh}
              className="w-full text-right rtl:text-right ltr:text-left flex items-start gap-3.5 p-4 rounded-xl border border-slate-200 hover:border-amber-500/50 hover:bg-amber-50/40 transition-all group"
            >
              <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                <FilePlus className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-semibold text-slate-900 text-base">
                  {isAr ? 'مسح كافة البيانات والبدء بسيرة جديدة' : 'Clear all data and start fresh'}
                </span>
                <span className="block text-xs text-slate-500 mt-0.5">
                  {isAr
                    ? 'إعادة تعيين الحقول وإنشاء سيرة ذاتية فارغة ببيانات جديدة.'
                    : 'Reset all fields to blank and begin creating a brand new resume.'}
                </span>
              </div>
            </button>
          </div>

          {/* Actions Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
