import React, { useEffect } from 'react';
import { Eye, X, Download, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../../store/useResumeStore';
import { ResumePreview } from '../preview/ResumePreview';

interface DesktopPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportPdf?: () => void;
  isExporting?: boolean;
}

export const DesktopPreviewModal: React.FC<DesktopPreviewModalProps> = ({
  isOpen,
  onClose,
  onExportPdf,
  isExporting = false,
}) => {
  const { settings } = useResumeStore();
  const isAr = settings?.language !== 'en' && settings?.language !== 'fr';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={isAr ? 'معاينة السيرة الذاتية وتحميلها' : 'Resume Preview and Download'}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl h-[92vh] bg-[#fbfaf7] rounded-3xl border border-[#e8e5de] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-white border-b border-[#e8e5de] flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#FF4D2D]/10 text-[#FF4D2D] shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-[#001639]">
                      {isAr ? 'معاينة السيرة الذاتية النهائية (A4)' : 'Final Resume Preview (A4 Standard)'}
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1f8a5f] bg-[#1f8a5f]/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      {isAr ? 'جاهزة للتحميل' : 'Ready to Download'}
                    </span>
                  </div>
                  <p className="text-xs text-[#7a8093] mt-0.5">
                    {isAr ? 'مطابقة تماماً للملف الذي سيتم تنزيله بصيغة PDF' : 'Exact match to the generated PDF file'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {onExportPdf && (
                  <button
                    type="button"
                    onClick={() => {
                      onExportPdf();
                    }}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#FF4D2D] hover:bg-[#E5431F] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow-md transition active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isAr ? 'تحميل السيرة الذاتية (PDF)' : 'Download Resume (PDF)'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-[#7a8093] hover:text-[#001639] hover:bg-slate-100 rounded-xl transition cursor-pointer"
                  aria-label={isAr ? 'إغلاق' : 'Close'}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: A4 Resume Preview Canvas */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-start justify-center bg-[#f4f1e9]">
              <div className="w-full max-w-[210mm] shadow-xl rounded-sm overflow-hidden bg-white">
                <ResumePreview />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
