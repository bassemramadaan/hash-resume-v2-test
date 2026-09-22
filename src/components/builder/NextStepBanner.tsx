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
        className={`px-3.5 py-2.5 bg-paper border border-line rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 text-xs text-ink w-full min-w-0 next-step-banner ${className}`}
      >
        <div className="flex items-start gap-2 min-w-0 flex-1 overflow-hidden">
          <span className="w-1.5 h-1.5 bg-orange shrink-0 mt-1.5" />
          <p className="font-ibm-sans text-xs text-ink leading-relaxed break-words whitespace-normal min-w-0 flex-1">
            <span className="font-ibm-mono text-[10px] font-bold text-orange uppercase tracking-wider me-1.5 inline-block">
              {isAr ? 'الخطوة التالية:' : 'NEXT STEP:'}
            </span>
            <span className="font-semibold">
              {isAr ? stepTextAr : stepTextEn}
            </span>
          </p>
        </div>

        {onAction && (actionTextAr || actionTextEn) && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-1 font-ibm-sans font-bold text-ink hover:text-orange transition shrink-0 cursor-pointer text-xs self-end sm:self-auto"
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
      className={`p-3.5 sm:p-4 rounded-none border border-line bg-paper text-ink w-full min-w-0 next-step-banner ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <div className="w-7 h-7 rounded-none border border-line bg-white text-orange flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-ibm-mono text-[10px] font-bold uppercase tracking-wider text-orange">
                {isAr ? 'الإجراء التالي المقترح' : 'RECOMMENDED ACTION'}
              </span>
            </div>
            <p className="font-tajawal text-xs sm:text-sm font-bold text-ink leading-relaxed break-words whitespace-normal mt-0.5">
              <span>{isAr ? stepTextAr : stepTextEn}</span>
            </p>
          </div>
        </div>

        {onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-ink hover:bg-ink-soft text-white text-xs font-ibm-sans font-bold rounded-none transition cursor-pointer active:scale-98 shrink-0 self-end sm:self-auto min-h-[36px]"
          >
            <span>{isAr ? actionTextAr || 'ابدأ الآن' : actionTextEn || 'Start now'}</span>
            <Arrow className="w-3 h-3 text-orange" />
          </button>
        )}
      </div>
    </aside>
  );
};
