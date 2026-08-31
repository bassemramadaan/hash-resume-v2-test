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
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-8 sm:pt-20 pb-12 sm:pb-16 px-5 sm:px-6 overflow-hidden bg-white">
      {/* Editorial Background Elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#F8FAFC] to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-coral-soft rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-5 sm:space-y-8">
        
        {/* Header Badges & Slogan Flag */}
        <div className="flex flex-col items-center gap-2 hero-reveal hero-reveal-badge">
          <div
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border border-[#E2E8F0] text-[#001639] text-[11px] sm:text-xs font-bold shadow-xs hover:border-[#CBD5E1] transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-coral shrink-0" />
            <span>
              {isFrench
                ? 'Nouvelle Version 2.0 | Plus épurée & Plus rapide'
                : isArabic
                ? 'النسخة الجديدة 2.0 | أنقى وأسرع'
                : 'New Version 2.0 | Cleaner & Faster'}
            </span>
          </div>

          {/* Slogan Flag Banner */}
          <div
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-orange-50 via-amber-50 to-rose-50 border border-orange-200/90 text-[#001639] text-xs sm:text-sm font-extrabold shadow-xs"
          >
            <Flag className="w-3.5 h-3.5 text-[#FF4D2D] fill-[#FF4D2D]/20 shrink-0" />
            <span className="tracking-tight">
              {isFrench
                ? 'Sans inscription. Créez. Téléchargez. Postulez.'
                : isArabic
                ? 'بدون إنشاء حساب. أنشئ سيرتك. حمّلها. وقدّم بها.'
                : 'No sign-up. Build. Download. Apply.'}
            </span>
          </div>
        </div>

        {/* Hero Headline */}
        <h1
          className={`text-[#001639] hero-reveal hero-reveal-title ${
            isAr
              ? 'hero-headline-ar text-[clamp(44px,11.5vw,60px)] sm:text-7xl md:text-8xl lg:text-[5.5rem] leading-[1.2]'
              : 'hero-headline-en text-[clamp(38px,10vw,52px)] sm:text-6xl md:text-7xl lg:text-8xl'
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
          className="text-[16px] sm:text-xl md:text-2xl text-[#52627A] max-w-2xl mx-auto font-medium leading-[1.6] px-1 sm:px-2 hero-reveal hero-reveal-desc"
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
              className="text-xl sm:text-3xl text-slate-700 block leading-none font-normal"
              style={{
                fontFamily: "'Caveat', 'Alex Brush', cursive, sans-serif",
                transform: 'rotate(-2.5deg)',
                letterSpacing: '0.02em',
              }}
            >
              Bassem Ramadan
            </span>
            {/* Fine pen signature line */}
            <svg
              className="w-24 sm:w-32 h-2 text-slate-400/80 mx-auto mt-0.5 pointer-events-none"
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
          className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto w-full pt-3 sm:pt-4 hero-reveal hero-reveal-cta"
        >
          <button
            type="button"
            onClick={() => navigate('/builder')}
            className="w-full sm:w-auto px-8 sm:px-12 min-h-[54px] h-[54px] bg-[#FF4D2D] hover:bg-[#E5431F] text-white rounded-2xl text-base sm:text-lg font-extrabold shadow-lg shadow-coral/30 flex items-center justify-center gap-3 transition-all active:scale-98 cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF4D2D]"
          >
            <Sparkles className="w-5 h-5 fill-white/20" />
            <span>{isAr ? 'ابدأ الآن مجاناً' : 'Build My Resume Now'}</span>
            <ArrowIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Small Trust Row below CTA (No account required • ATS-friendly • Pay once to download) */}
        <div
          className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-1 pt-2 sm:pt-3 text-xs sm:text-sm font-semibold text-[#8793A6] hero-reveal hero-reveal-footer"
        >
          <span>{isAr ? 'بدون إنشاء حساب' : 'No account required'}</span>
          <span className="text-slate-300 select-none">•</span>
          <span>{isAr ? 'متوافق مع ATS' : 'ATS-friendly'}</span>
          <span className="text-slate-300 select-none">•</span>
          <span>{isAr ? 'دفع لمرة واحدة عند التحميل' : 'Pay once to download'}</span>
        </div>
      </div>
    </section>
  );
};
