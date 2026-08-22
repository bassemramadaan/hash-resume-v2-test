import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumePreview } from '../preview/ResumePreview';
import { Eye, X } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';

interface MobilePreviewSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToExport?: () => void;
}

export const MobilePreviewSheet: React.FC<MobilePreviewSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings } = useResumeStore();
  const isAr = settings.language === 'ar';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-preview-sheet-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/80 backdrop-blur-xs md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={isAr ? 'معاينة السيرة الذاتية' : 'Resume Preview'}
        >
          {/* Backdrop dismiss */}
          <div
            className="absolute inset-0"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            key="mobile-preview-sheet-content"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="relative bg-white rounded-t-3xl max-h-[94vh] h-[92vh] flex flex-col overflow-hidden shadow-2xl z-10"
          >
            {/* Header */}
            <div className="pt-2.5 pb-2 px-4 border-b border-slate-200 bg-slate-50 flex flex-col gap-1.5 shrink-0">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto" />
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#001639] text-white flex items-center justify-center">
                    <Eye className="w-4 h-4 text-[#FF4D2D]" />
                  </div>
                  <div>
                    <h2 className="font-bold text-xs sm:text-sm text-[#001639]">
                      {isAr ? 'معاينة السيرة الذاتية (A4)' : 'Resume Preview (A4)'}
                    </h2>
                    <p className="text-[10px] text-slate-500">
                      {isAr ? 'عرض مباشر لملف الـPDF' : 'Live preview of your PDF'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-slate-600 hover:text-slate-900 bg-slate-200/80 hover:bg-slate-300 rounded-full transition cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
                  aria-label={isAr ? 'إغلاق المعاينة' : 'Close preview'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Preview Canvas */}
            <div className="flex-1 overflow-auto p-2 sm:p-4 bg-slate-100 touch-pan-y">
              <ResumePreview />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
