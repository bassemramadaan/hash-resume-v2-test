import React from 'react';
import { Eye, Download } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';

interface MobileBottomNavProps {
  onOpenPreview: () => void;
  onOpenDownload: () => void;
  isDownloadActive?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  onOpenPreview,
  onOpenDownload,
  isDownloadActive = false,
}) => {
  const { settings } = useResumeStore();
  const isAr = settings.language === 'ar';

  return (
    <nav
      aria-label={isAr ? 'شريط التنقل السفلي' : 'Mobile Bottom Navigation'}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3.5 pt-2.5 shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'max(12px, calc(env(safe-area-inset-bottom) + 8px))' }}
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

        {/* Download Button */}
        <button
          type="button"
          onClick={onOpenDownload}
          className={`flex-1 px-4 py-2.5 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition active:scale-98 min-h-[46px] cursor-pointer shadow-xs ${
            isDownloadActive
              ? 'bg-[#001639] text-white border border-[#001639]'
              : 'bg-[#FF4D2D] hover:bg-[#E5431F] text-white'
          }`}
          aria-label={isAr ? 'تحميل السيرة الذاتية' : 'Download Resume'}
        >
          <Download className="w-4 h-4" />
          <span>{isAr ? 'تحميل ومراجعة' : 'Download & Export'}</span>
        </button>
      </div>
    </nav>
  );
};
