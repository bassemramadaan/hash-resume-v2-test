import React from 'react';
import { Eye, Download, Sparkles } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';

interface MobileBottomNavProps {
  onOpenPreview: () => void;
  onOpenDownload: () => void;
  isDownloadActive?: boolean;
  isReadyForExport?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenPreview,
  onOpenDownload,
  isDownloadActive = false,
  isReadyForExport = false,
}) => {
  const { settings } = useResumeStore();
  const isAr = settings.language === 'ar';

  return (
    <nav
      aria-label={isAr ? 'شريط التنقل السفلي' : 'Mobile Bottom Navigation'}
      className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 py-2.5 pb-[max(10px,env(safe-area-inset-bottom))] md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Preview Button */}
        <button
          type="button"
          onClick={onOpenPreview}
          className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition active:scale-98 min-h-[46px] cursor-pointer"
          aria-label={isAr ? 'معاينة السيرة الذاتية' : 'Preview Resume'}
        >
          <Eye className="w-4 h-4 text-[#FF4D2D]" />
          <span>{isAr ? 'معاينة السيرة' : 'Preview CV'}</span>
        </button>

        {/* Action Button: "Review & Export" when incomplete, "Download PDF" when complete */}
        <button
          type="button"
          onClick={onOpenDownload}
          className={`flex-1 px-4 py-2.5 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 transition active:scale-98 min-h-[46px] cursor-pointer shadow-xs ${
            isDownloadActive
              ? 'bg-[#001639] text-white'
              : isReadyForExport
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              : 'bg-[#FF4D2D] hover:bg-[#E5431F] text-white shadow-[#FF4D2D]/20'
          }`}
          aria-label={
            isReadyForExport
              ? isAr
                ? 'تحميل ملف PDF'
                : 'Download PDF'
              : isAr
              ? 'مراجعة وتصدير'
              : 'Review & Export'
          }
        >
          {isReadyForExport ? (
            <Download className="w-4 h-4 text-white" />
          ) : (
            <Sparkles className="w-4 h-4 text-white" />
          )}
          <span>
            {isReadyForExport
              ? isAr
                ? 'تحميل PDF'
                : 'Download PDF'
              : isAr
              ? 'مراجعة وتصدير'
              : 'Review & Export'}
          </span>
        </button>
      </div>
    </nav>
  );
};


