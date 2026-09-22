import React, { useState, useEffect } from 'react';
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
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // Detect virtual keyboard on mobile via focusin/focusout on editable inputs
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        setIsKeyboardOpen(true);
      }
    };

    const handleFocusOut = () => {
      setIsKeyboardOpen(false);
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);

    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  return (
    <nav
      aria-label={isAr ? 'شريط التنقل السفلي' : 'Mobile Bottom Navigation'}
      className={`fixed bottom-0 inset-x-0 z-40 bg-paper border-t-2 border-line-strong px-4 py-2.5 pb-[max(12px,env(safe-area-inset-bottom))] md:hidden shadow-lg transition-all duration-200 ${
        isKeyboardOpen
          ? 'translate-y-full opacity-0 pointer-events-none'
          : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Preview Button */}
        <button
          type="button"
          onClick={onOpenPreview}
          className="flex-1 px-4 py-2.5 bg-white hover:bg-paper-2 text-ink font-ibm-sans font-bold text-xs sm:text-sm rounded-none border border-line flex items-center justify-center gap-2 transition active:scale-98 min-h-[44px] cursor-pointer"
          aria-label={isAr ? 'معاينة السيرة الذاتية' : 'Preview Resume'}
        >
          <Eye className="w-4 h-4 text-orange" />
          <span>{isAr ? 'معاينة السيرة' : 'Preview CV'}</span>
        </button>

        {/* Action Button: "Review & Export" when incomplete, "Download PDF" when complete */}
        <button
          type="button"
          onClick={onOpenDownload}
          className={`flex-1 px-4 py-2.5 font-ibm-sans font-bold text-xs sm:text-sm rounded-none border flex items-center justify-center gap-2 transition active:scale-98 min-h-[44px] cursor-pointer ${
            isDownloadActive
              ? 'bg-ink text-white border-ink'
              : isReadyForExport
              ? 'bg-ink hover:bg-ink/90 text-white border-ink'
              : 'bg-orange hover:bg-orange/90 text-white border-orange'
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
            <Download className="w-4 h-4 text-orange" />
          ) : (
            <Sparkles className="w-4 h-4 text-white" />
          )}
          <span>
            {isReadyForExport
              ? isAr
                ? 'تحميل PDF ↓'
                : 'Download PDF ↓'
              : isAr
              ? 'التالي (المراجعة)'
              : 'Next (Review)'}
          </span>
        </button>
      </div>
    </nav>
  );
};


