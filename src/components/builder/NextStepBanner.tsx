import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface NextStepBannerProps {
  stepTextAr: string;
  stepTextEn: string;
  isAr: boolean;
  actionTextAr?: string;
  actionTextEn?: string;
  onAction?: () => void;
  className?: string;
  variant?: 'subtle' | 'highlight' | 'section';
}

export const NextStepBanner: React.FC<NextStepBannerProps> = ({
  stepTextAr,
  stepTextEn,
  isAr,
  actionTextAr,
  actionTextEn,
  onAction,
  className = '',
  variant = 'subtle',
}) => {
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  if (variant === 'section') {
    return (
      <aside
        aria-label={isAr ? 'الإجراء التالي المقترح' : 'Recommended next step'}
        className={`px-3.5 py-2.5 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-center justify-between gap-3 text-xs text-blue-950 shadow-2xs ${className}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D2D] shrink-0" />
          <span className="text-[11px] font-bold text-blue-900/70 shrink-0 uppercase tracking-wider">
            {isAr ? 'الخطوة التالية:' : 'Next step:'}
          </span>
          <span className="font-semibold text-blue-950 truncate">
            {isAr ? stepTextAr : stepTextEn}
          </span>
        </div>

        {onAction && (actionTextAr || actionTextEn) && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1 font-bold text-[#001639] hover:text-[#FF4D2D] transition shrink-0 cursor-pointer text-[11px]"
          >
            <span>{isAr ? actionTextAr : actionTextEn}</span>
            <Arrow className="w-3 h-3" />
          </button>
        )}
      </aside>
    );
  }

  return (
    <aside
      aria-label={isAr ? 'الإجراء التالي المقترح' : 'Recommended next step'}
      className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
        variant === 'highlight'
          ? 'bg-gradient-to-r from-orange-50/90 via-amber-50/70 to-blue-50/60 border-orange-200/90 text-slate-900 shadow-2xs'
          : 'bg-slate-50 border-slate-200/90 text-slate-900 shadow-2xs'
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#FF4D2D]/10 text-[#FF4D2D] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#FF4D2D]">
                {isAr ? 'ماذا أفعل الآن؟' : 'WHAT TO DO NEXT?'}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#001639] leading-snug truncate mt-0.5">
              <span className="text-slate-500 font-medium">
                {isAr ? 'الإجراء التالي المقترح: ' : 'Recommended next step: '}
              </span>
              <span>{isAr ? stepTextAr : stepTextEn}</span>
            </p>
          </div>
        </div>

        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#001639] hover:bg-[#00245E] text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs active:scale-98 shrink-0 self-end sm:self-auto"
          >
            <span>{isAr ? actionTextAr || 'ابدأ الآن' : actionTextEn || 'Start now'}</span>
            <Arrow className="w-3.5 h-3.5 text-[#FF4D2D]" />
          </button>
        )}
      </div>
    </aside>
  );
};
