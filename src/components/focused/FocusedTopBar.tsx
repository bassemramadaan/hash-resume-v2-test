import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { Eye, CheckCircle2 } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';

interface FocusedTopBarProps {
  onOpenPreview: () => void;
  isSaving?: boolean;
}

export const FocusedTopBar: React.FC<FocusedTopBarProps> = ({
  onOpenPreview,
  isSaving = false,
}) => {
  const { settings, setLanguage } = useResumeStore();
  const isAr = settings?.language !== 'en' && settings?.language !== 'fr';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#e8e5de] transition-colors">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Autosave Status indicator */}
        <div className="flex-1 flex items-center justify-start min-w-0">
          <div
            className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-[#7a8093] bg-white/80 px-2 sm:px-2.5 py-1 rounded-full border border-[#e8e5de] shrink-0"
            title={isSaving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'تم حفظ التعديلات تلقائياً' : 'All changes autosaved')}
          >
            {isSaving ? (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <span className="hidden sm:inline font-medium text-[#12141a]">{isAr ? 'جاري الحفظ...' : 'Saving...'}</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#1f8a5f] shrink-0" />
                <span className="hidden sm:inline font-medium text-[#12141a]">
                  {isAr ? 'محفوظة' : 'Autosaved'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Center: Logo & Brand */}
        <div className="flex items-center justify-center shrink-0">
          <Link
            to="/"
            className="flex items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001639] rounded-xl p-1 transition shrink-0"
            aria-label="Hash Resume"
          >
            <Logo
              variant="full"
              size="sm"
              className="h-6 sm:h-7 w-auto object-contain group-hover:scale-102 transition-transform shrink-0"
            />
          </Link>
        </div>

        {/* Right Actions: Quick preview button + subtle language switcher */}
        <div className="flex-1 flex items-center justify-end gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setLanguage(isAr ? 'en' : 'ar')}
            className="h-9 px-2 sm:px-2.5 flex items-center justify-center text-xs font-semibold text-[#7a8093] hover:text-[#001639] hover:bg-[#f4f1e9] rounded-xl transition active:scale-95 cursor-pointer shrink-0"
            title={isAr ? 'Switch to English' : 'التحويل للعربية'}
            aria-label={isAr ? 'Switch to English' : 'التحويل للعربية'}
          >
            {isAr ? 'EN' : 'عربي'}
          </button>

          <button
            type="button"
            onClick={onOpenPreview}
            className="h-9 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 text-xs sm:text-sm font-semibold text-[#001639] bg-white hover:bg-[#f4f1e9] border border-[#e2dec9] rounded-xl shadow-2xs hover:shadow-xs transition active:scale-95 shrink-0 cursor-pointer"
            aria-label={isAr ? 'المعاينة' : 'Preview'}
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF4D2D] shrink-0" />
            <span>{isAr ? 'المعاينة' : 'Preview'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
