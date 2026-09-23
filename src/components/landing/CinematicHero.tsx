import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, Flag } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';

export const CinematicHero: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const { setPersonalInfo, settings } = useResumeStore();

  const currentLang = settings?.language || (isAr ? 'ar' : 'en');
  const isFrench = currentLang === 'fr';
  const isArabic = currentLang === 'ar';

  const handleStart = () => {
    if (role.trim()) {
      setPersonalInfo({ jobTitle: role.trim() });
    }
    navigate('/builder');
  };

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center pt-6 sm:pt-16 md:pt-20 pb-10 sm:pb-16 px-4 sm:px-6 overflow-hidden bg-white">
      {/* Editorial Background Elements */}
      <div className="absolute top-0 inset-x-0 h-32 sm:h-40 bg-gradient-to-b from-[#F8FAFC] to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] sm:w-[70vw] h-[85vw] sm:h-[70vw] max-w-[800px] max-h-[800px] bg-coral-soft rounded-full blur-[100px] sm:blur-[120px] opacity-40 pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-4 sm:space-y-6 md:space-y-8">
        {/* Hero Headline */}
        <h1
          className={`text-[#001639] hero-reveal hero-reveal-title tracking-tight font-black ${
            isAr
              ? 'hero-headline-ar text-3xl sm:text-5xl md:text-7xl lg:text-8xl leading-[1.2]'
              : 'hero-headline-en text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15]'
          }`}
        >
          {isAr ? (
            <>سيرتك الذاتية.<br />بدون <span className="text-coral">أي تعقيد.</span></>
          ) : (
            <>Your Resume.<br />Zero <span className="text-coral">Friction.</span></>
          )}
        </h1>

        {/* Hero Body Text */}
        <p
          className="text-sm sm:text-lg md:text-xl text-[#52627A] max-w-2xl mx-auto font-medium leading-relaxed px-2 hero-reveal hero-reveal-desc"
        >
          {isFrench
            ? 'Nous avons conçu Hash Resume pour être le seul outil de concentration dont vous avez besoin. Créez un CV clair, professionnel et optimisé pour les systèmes ATS.'
            : isAr
            ? 'صممنا Hash Resume ليكون أداة التركيز الوحيدة التي تحتاجها. ابدأ ببناء سيرة ذاتية هيكليتها منظمة وتتوافق تماماً مع أنظمة الفرز الآلي (ATS).'
            : 'We designed Hash Resume to be the only focus tool you need. Build an ATS-friendly resume with a clean structure recruiters can read.'}
        </p>

        {/* Founder Signature (Fine-tip pen handwriting in English: Bassem Ramadan) */}
        <div
          className="flex flex-col items-center justify-center pt-0.5 select-none hero-reveal hero-reveal-desc"
        >
          <div className="relative inline-flex flex-col items-center">
            <span
              className="text-lg sm:text-2xl md:text-3xl text-slate-700 block leading-none font-normal"
              style={{
                fontFamily: "'Caveat', cursive, sans-serif",
                transform: 'rotate(-2.5deg)',
                letterSpacing: '0.02em',
              }}
            >
              Bassem Ramadan
            </span>
            {/* Fine pen signature line */}
            <svg
              className="w-20 sm:w-28 md:w-32 h-2 text-slate-400/80 mx-auto mt-0.5 pointer-events-none"
              viewBox="0 0 100 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 5.5C28 2 72 2 98 4.5"
                stroke="currentColor"
                strokeWidth="0.75"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Main Direct Hero CTA Button */}
        <div
          className="flex flex-col items-center justify-center gap-3 max-w-sm sm:max-w-md mx-auto w-full pt-2 sm:pt-4 hero-reveal hero-reveal-cta"
        >
          <button
            type="button"
            onClick={() => navigate('/builder')}
            className="btn-folded-corner w-full sm:w-auto px-6 sm:px-10 min-h-[50px] sm:min-h-[54px] bg-[#FF4D2D] hover:bg-[#E5431F] text-white rounded-2xl text-sm sm:text-base md:text-lg font-extrabold shadow-md hover:shadow-lg shadow-coral/25 flex items-center justify-center gap-2.5 sm:gap-3 transition-all active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF4D2D]"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 fill-white/20 shrink-0" />
            <span>{isAr ? 'ابدأ الآن مجاناً' : 'Build My Resume Now'}</span>
            <ArrowIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          </button>
        </div>

        {/* Small Trust Row below CTA (No account required • ATS-friendly • Pay once to download) */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-1.5 pt-2 sm:pt-3 text-xs sm:text-sm font-semibold text-[#8793A6] hero-reveal hero-reveal-footer"
        >
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 sm:hidden" />{isAr ? 'بدون إنشاء حساب' : 'No account required'}</span>
          <span className="text-slate-300 select-none hidden sm:inline">•</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 sm:hidden" />{isAr ? 'متوافق مع ATS' : 'ATS-friendly'}</span>
          <span className="text-slate-300 select-none hidden sm:inline">•</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 sm:hidden" />{isAr ? 'دفع لمرة واحدة عند التحميل' : 'Pay once to download'}</span>
        </div>
      </div>
    </section>
  );
};
