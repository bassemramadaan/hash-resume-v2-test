import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Eye, X, Maximize2, Download, Sparkles } from 'lucide-react';
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

  const fullName = resumeData.personalInfo?.fullName || (isAr ? 'اسمك هنا' : 'Your Name');
  const jobTitle = resumeData.personalInfo?.jobTitle || (isAr ? 'المسمى الوظيفي' : 'Job Title');
  const expCount = resumeData.experiences?.length || 0;
  const skillsCount = resumeData.skills?.length || 0;

  // Mobile trigger - Portaled directly to document.body so position: fixed is always relative to the true browser viewport
  if (isMobile) {
    if (typeof document === 'undefined') return null;

    return createPortal(
      <>
        {/* Floating Action Button for Mobile: Strictly attached to bottom of true viewport */}
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className="fixed start-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] z-40 md:hidden pointer-events-auto"
          style={{
            position: 'fixed',
            bottom: 'calc(4.5rem + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <button
            type="button"
            onClick={() => setMobileSheetOpen(true)}
            className="w-12 h-12 rounded-full bg-[#001639] text-white shadow-xl hover:shadow-2xl active:scale-90 transition-all flex items-center justify-center border-2 border-white/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4D2D]"
            aria-label={isAr ? 'معاينة السيرة الذاتية' : 'Preview Resume'}
            title={isAr ? 'معاينة السيرة الذاتية' : 'Preview Resume'}
          >
            <Eye className="w-5 h-5 text-[#FF4D2D]" />
          </button>
        </div>

        {/* Mobile Preview Sheet */}
        <MobilePreviewSheet
          isOpen={mobileSheetOpen}
          onClose={() => setMobileSheetOpen(false)}
        />
      </>,
      document.body
    );
  }

  // Desktop Floating Mini Card
  return (
    <>
      {/* Mini Card Fixed in Bottom-Left (or Bottom-Right depending on RTL layout) */}
      <aside
        aria-label={isAr ? 'معاينة مصغرة للسيرة الذاتية' : 'Mini Resume Preview'}
        className="fixed bottom-6 left-6 z-30 group"
      >
        {/* Badge */}
        <div className="flex items-center justify-between px-2 mb-1.5">
          <span className="text-[11px] font-bold text-[#7a8093] bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md border border-[#e8e5de] shadow-2xs">
            {isAr ? 'شكلها كده ✨' : 'Live Snapshot ✨'}
          </span>
          <span className="text-[10px] text-[#7a8093] group-hover:text-[#FF4D2D] transition flex items-center gap-1">
            <Maximize2 className="w-3 h-3" />
            <span>{isAr ? 'تكبير' : 'Expand'}</span>
          </span>
        </div>

        {/* Thumbnail Box */}
        <button
          type="button"
          onClick={() => setIsExpandedModalOpen(true)}
          className="relative w-44 h-56 bg-white rounded-xl border-2 border-[#e8e5de] group-hover:border-[#FF4D2D] shadow-md group-hover:shadow-xl transition-all duration-300 p-2.5 overflow-hidden text-start transform group-hover:-translate-y-1 group-hover:rotate-0 rotate-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4D2D]"
        >
          {/* Mock Miniature Header */}
          <div className="border-b border-slate-100 pb-1.5 mb-2">
            <div className="h-2 w-3/4 bg-[#001639] rounded-xs font-black text-[7px] text-white px-1 leading-2 overflow-hidden truncate">
              {fullName}
            </div>
            <div className="h-1.5 w-1/2 bg-[#FF4D2D]/30 rounded-xs mt-1" />
          </div>

          {/* Mock Miniature Content Lines */}
          <div className="space-y-1.5 opacity-75">
            <div className="space-y-0.5">
              <div className="h-1 w-1/3 bg-slate-300 rounded-xs" />
              <div className="h-1 w-full bg-slate-100 rounded-xs" />
              <div className="h-1 w-5/6 bg-slate-100 rounded-xs" />
            </div>

            <div className="space-y-0.5">
              <div className="h-1 w-2/5 bg-slate-300 rounded-xs" />
              <div className="h-1 w-full bg-slate-100 rounded-xs" />
              <div className="h-1 w-4/5 bg-slate-100 rounded-xs" />
            </div>

            <div className="pt-1 flex flex-wrap gap-0.5">
              {Array.from({ length: Math.min(skillsCount || 3, 5) }).map((_, i) => (
                <div key={i} className="h-1.5 w-4 bg-slate-200 rounded-xs" />
              ))}
            </div>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-[#001639]/40 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 text-white">
            <Eye className="w-5 h-5 text-white" />
            <span className="text-[11px] font-bold">
              {isAr ? 'اضغط للمعاينة' : 'Click to preview'}
            </span>
          </div>
        </button>
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
              className="relative w-full max-w-4xl h-[90vh] bg-[#fbfaf7] rounded-3xl border border-[#e8e5de] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 bg-white border-b border-[#e8e5de] flex items-center justify-between gap-4">
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
                      className="flex items-center gap-2 px-4 py-2 bg-[#FF4D2D] hover:bg-[#E5431F] text-white text-xs font-bold rounded-xl shadow-xs transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isAr ? 'تحميل PDF' : 'Download PDF'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsExpandedModalOpen(false)}
                    className="p-2 text-[#7a8093] hover:text-[#001639] hover:bg-slate-100 rounded-xl transition"
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
