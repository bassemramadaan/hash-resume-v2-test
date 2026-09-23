import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { Eye, CheckCircle2, Cloud, Sparkles } from 'lucide-react';
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
        {/* Logo & Brand */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            to="/"
            className="flex items-center gap-1.5 sm:gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#001639] rounded-xl p-0.5 transition shrink-0"
            aria-label="Hash Resume"
          >
            <div className="p-1 sm:p-1.5 rounded-lg bg-white shadow-2xs border border-[#e2dec9] group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
              <Logo
                variant="icon"
                size="sm"
                className="h-5 sm:h-6 w-auto object-contain rounded-md shrink-0"
              />
            </div>
            <span className="font-bold text-sm sm:text-lg tracking-tight text-[#001639] flex items-center gap-0.5 sm:gap-1 shrink-0">
              Hash <span className="text-[#FF4D2D]">Resume</span>
            </span>
          </Link>

          {/* Hashtag square dot marker */}
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-xs bg-[#FF4D2D]/60 shrink-0" />

          {/* Autosave Status indicator: compact dot on mobile, full label on desktop */}
          <div
            className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-[#7a8093] bg-white/80 px-2 sm:px-2.5 py-1 sm:py-1 rounded-full border border-[#e8e5de] shrink-0"
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

        {/* Right Actions: Quick preview button (44px touch) + subtle language switcher (44px touch) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setLanguage(isAr ? 'en' : 'ar')}
            className="min-h-[44px] min-w-[36px] sm:min-w-0 sm:min-h-0 flex items-center justify-center text-xs font-semibold text-[#7a8093] hover:text-[#001639] px-2 py-1.5 rounded-lg transition active:scale-95"
            title={isAr ? 'Switch to English' : 'التحويل للعربية'}
            aria-label={isAr ? 'Switch to English' : 'التحويل للعربية'}
          >
            {isAr ? 'EN' : 'عربي'}
          </button>

          <button
            type="button"
            onClick={onOpenPreview}
            className="min-h-[44px] flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-1.5 text-xs sm:text-sm font-semibold text-[#001639] bg-white hover:bg-[#f4f1e9] border border-[#e2dec9] rounded-xl shadow-2xs hover:shadow-xs transition active:scale-95 shrink-0"
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
