import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Eye, X, Maximize2, Download, Sparkles, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../../store/useResumeStore';
import { ResumePreview } from '../preview/ResumePreview';
import { MobilePreviewSheet } from '../mobile/MobilePreviewSheet';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface FloatingPreviewCardProps {
  onExportPdf?: () => void;
  isExporting?: boolean;
}

export const FloatingPreviewCard: React.FC<FloatingPreviewCardProps> = ({
  onExportPdf,
  isExporting = false,
}) => {
  const { resumeData, settings } = useResumeStore();
  const isAr = settings?.language !== 'en' && settings?.language !== 'fr';
  const isMobile = useMediaQuery('(max-width: 979px)');

  const [isExpandedModalOpen, setIsExpandedModalOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);

  if (isDismissed) {
    return null;
  }

  const fullName = resumeData.personalInfo?.fullName || (isAr ? 'اسمك هنا' : 'Your Name');
  const skillsCount = resumeData.skills?.length || 0;

  // On mobile screens, the preview button in FocusedTopBar is the primary, non-intrusive access point
  if (isMobile) {
    return (
      <MobilePreviewSheet
        isOpen={mobileSheetOpen}
        onClose={() => setMobileSheetOpen(false)}
      />
    );
  }

  // Desktop Floating Preview: compact and collapsible so it never eats screen real estate
  return (
    <>
      <aside
        aria-label={isAr ? 'معاينة مصغرة للسيرة الذاتية' : 'Mini Resume Preview'}
        className="fixed bottom-6 start-6 z-30 hidden lg:block"
      >
        {isMinimized ? (
          // Compact, sleek floating pill that never blocks the screen
          <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#e8e5de] shadow-sm hover:shadow-md transition-all group">
            <button
              type="button"
              onClick={() => setIsExpandedModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#001639] hover:text-[#FF4D2D] transition cursor-pointer"
              title={isAr ? 'معاينة السيرة الذاتية' : 'Preview Resume'}
            >
              <Eye className="w-3.5 h-3.5 text-[#FF4D2D]" />
              <span>{isAr ? 'معاينة سريعة' : 'Quick Preview'}</span>
            </button>

            <span className="w-px h-3.5 bg-slate-200 mx-0.5" />

            <button
              type="button"
              onClick={() => setIsMinimized(false)}
              className="p-0.5 text-slate-400 hover:text-slate-600 rounded transition cursor-pointer"
              title={isAr ? 'إظهار البطاقة المصغرة' : 'Expand thumbnail'}
              aria-label={isAr ? 'إظهار البطاقة المصغرة' : 'Expand thumbnail'}
            >
              <Maximize2 className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={() => setIsDismissed(true)}
              className="p-0.5 text-slate-400 hover:text-rose-500 rounded transition cursor-pointer"
              title={isAr ? 'إغلاق المعاينة العائمة' : 'Dismiss preview'}
              aria-label={isAr ? 'إغلاق' : 'Close'}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          // Expanded Thumbnail (only on wide screens >= 2xl, with easy minimize and close buttons)
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#e8e5de] shadow-lg p-2.5 w-40 transition-all">
            {/* Header controls */}
            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-100">
              <span className="text-[10px] font-bold text-[#7a8093]">
                {isAr ? 'معاينة حية' : 'Snapshot'}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded transition cursor-pointer"
                  title={isAr ? 'تصغير' : 'Minimize'}
                  aria-label={isAr ? 'تصغير' : 'Minimize'}
                >
                  <Minimize2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsDismissed(true)}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded transition cursor-pointer"
                  title={isAr ? 'إغلاق' : 'Close'}
                  aria-label={isAr ? 'إغلاق' : 'Close'}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Thumbnail Box */}
            <button
              type="button"
              onClick={() => setIsExpandedModalOpen(true)}
              className="relative w-full h-44 bg-slate-50 rounded-xl border border-slate-200 hover:border-[#FF4D2D] p-2 overflow-hidden text-start cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#FF4D2D] transition-colors"
            >
              {/* Mock Miniature Header */}
              <div className="border-b border-slate-200 pb-1 mb-1.5">
                <div className="h-1.5 w-3/4 bg-[#001639] rounded-xs font-semibold text-[6px] text-white px-1 leading-1.5 overflow-hidden truncate">
                  {fullName}
                </div>
                <div className="h-1 w-1/2 bg-[#FF4D2D]/30 rounded-xs mt-0.5" />
              </div>

              {/* Mock Miniature Content Lines */}
              <div className="space-y-1 opacity-70">
                <div className="space-y-0.5">
                  <div className="h-1 w-1/3 bg-slate-300 rounded-xs" />
                  <div className="h-0.5 w-full bg-slate-200 rounded-xs" />
                  <div className="h-0.5 w-5/6 bg-slate-200 rounded-xs" />
                </div>

                <div className="space-y-0.5">
                  <div className="h-1 w-2/5 bg-slate-300 rounded-xs" />
                  <div className="h-0.5 w-full bg-slate-200 rounded-xs" />
                  <div className="h-0.5 w-4/5 bg-slate-200 rounded-xs" />
                </div>

                <div className="pt-0.5 flex flex-wrap gap-0.5">
                  {Array.from({ length: Math.min(skillsCount || 3, 4) }).map((_, i) => (
                    <div key={i} className="h-1 w-3 bg-slate-300 rounded-xs" />
                  ))}
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#001639]/50 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                <Eye className="w-4 h-4 text-white" />
                <span className="text-[10px] font-bold">
                  {isAr ? 'اضغط للمعاينة' : 'Preview'}
                </span>
              </div>
            </button>
          </div>
        )}
      </aside>

      {/* Expanded Fullscreen A4 Preview Modal */}
      <AnimatePresence>
        {isExpandedModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md"
            role="dialog"
            aria-modal="true"
            aria-label={isAr ? 'معاينة السيرة الذاتية بالحجم الكامل' : 'Full Resume Preview'}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl h-[90vh] bg-slate-50 rounded-3xl border border-[#e8e5de] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-white border-b border-[#e8e5de] flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-[#FF4D2D]/10 text-[#FF4D2D]">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#001639]">
                      {isAr ? 'معاينة السيرة الذاتية (A4)' : 'Resume Preview (A4 Standard)'}
                    </h2>
                    <p className="text-xs text-[#7a8093]">
                      {isAr ? 'مطابقة تماماً للملف الذي سيتم تنزيله' : 'Exact match to the generated PDF'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {onExportPdf && (
                    <button
                      type="button"
                      onClick={onExportPdf}
                      disabled={isExporting}
                      className="btn-folded-corner flex items-center gap-2 px-4 py-2 bg-[#FF4D2D] hover:bg-[#E5431F] text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isAr ? 'تحميل PDF' : 'Download PDF'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsExpandedModalOpen(false)}
                    className="p-2 text-[#7a8093] hover:text-[#001639] hover:bg-slate-100 rounded-xl transition cursor-pointer"
                    aria-label={isAr ? 'إغلاق' : 'Close'}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body: Direct A4 Resume Preview Canvas */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-start justify-center bg-[#f4f1e9]">
                <div className="w-full max-w-[210mm] shadow-lg rounded-sm overflow-hidden bg-white">
                  <ResumePreview />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
