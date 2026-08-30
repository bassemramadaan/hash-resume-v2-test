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
      className="mobile-action-bar md:hidden shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Preview Button */}
        <button
          type="button"
          onClick={onOpenPreview}
          className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#001639] font-bold text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition active:scale-98 min-h-[46px] cursor-pointer shadow-2xs"
          aria-label={isAr ? 'معاينة السيرة الذاتية' : 'Preview Resume'}
        >
          <Eye className="w-4 h-4 text-[#FF4D2D]" />
          <span>{isAr ? 'معاينة السيرة' : 'Preview CV'}</span>
        </button>

        {/* Action Button: "Review & Export" when incomplete, "Download PDF" when complete */}
        <button
          type="button"
          onClick={onOpenDownload}
          className={`flex-1 px-4 py-2.5 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition active:scale-98 min-h-[46px] cursor-pointer shadow-xs ${
            isDownloadActive
              ? 'bg-[#001639] text-white border border-[#001639]'
              : isReadyForExport
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-[#001639] hover:bg-[#00245E] text-white'
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
            <Download className="w-4 h-4 text-emerald-200" />
          ) : (
            <Sparkles className="w-4 h-4 text-amber-300" />
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

