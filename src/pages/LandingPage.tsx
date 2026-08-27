import React from 'react';
import { Link } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { CinematicHero } from '../components/landing/CinematicHero';
import { SocialProofSection } from '../components/landing/SocialProofSection';
import { BentoFeatures } from '../components/landing/BentoFeatures';
import { PremiumCta } from '../components/landing/PremiumCta';
import { Sparkles, ArrowLeft, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { settings } = useResumeStore();
  const isAr = settings.language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <main className="bg-white min-h-screen pb-16 lg:pb-0">
      <CinematicHero isAr={isAr} />
      <SocialProofSection isAr={isAr} />
      <BentoFeatures isAr={isAr} />
      <PremiumCta isAr={isAr} />

      {/* Mobile Sticky Action Bar */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 8px) + 8px)' }}
      >
        <div className="flex flex-col">
          <span className="text-xs font-black text-[#001639]">
            {isAr ? 'سيرة ذاتية احترافية' : 'Professional CV'}
          </span>
          <span className="text-[10px] font-bold text-[#FF4D2D]">
            {isAr ? 'دفع لمرة واحدة 50 ج.م فقط' : 'One-time 50 EGP only'}
          </span>
        </div>

        <Link
          to="/builder"
          className="px-5 py-2.5 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1.5 active:scale-95 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isAr ? 'ابدأ إنشاء سيرتي' : 'Build My Resume'}</span>
          <ArrowIcon className="w-3.5 h-3.5" />
        </Link>
      </div>
    </main>
  );
};

