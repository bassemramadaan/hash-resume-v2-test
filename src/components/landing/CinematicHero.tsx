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
          className={`text-[clamp(38px,10vw,52px)] sm:text-6xl md:text-7xl lg:text-8xl text-[#001639] hero-reveal hero-reveal-title ${
            isAr ? 'hero-headline-ar' : 'hero-headline-en'
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

        {/* Main Focused CTA Bar (Full-width on mobile, 12px gap, min 52px CTA height) */}
        <div
          className="flex flex-col items-center justify-center gap-3 max-w-xl mx-auto w-full pt-3 sm:pt-4 hero-reveal hero-reveal-cta"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
            <div className="relative w-full sm:flex-1">
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                placeholder={isAr ? 'مسمّاك الوظيفي (اختياري)...' : 'Job title (optional)...'}
                className="w-full px-4 sm:px-5 py-3.5 sm:py-4 bg-white border border-[#E2E8F0] text-[#001639] rounded-xl sm:rounded-2xl text-base font-semibold placeholder:text-[#8793A6] focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral shadow-2xs transition-all text-center sm:text-start min-h-[50px]"
              />
            </div>
            <button
              onClick={handleStart}
              className="w-full sm:w-auto px-7 sm:px-9 min-h-[52px] h-[52px] bg-[#FF4D2D] hover:bg-[#E5431F] text-white rounded-xl sm:rounded-2xl text-base font-extrabold shadow-md shadow-coral/25 flex items-center justify-center gap-2.5 transition-all active:scale-98 shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FF4D2D]"
            >
              <span>{isAr ? 'ابدأ إنشاء سيرتي' : 'Build My Resume'}</span>
              <ArrowIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Quick 1-Click Role Suggestions (Desktop only to prevent mobile clutter) */}
          <div className="hidden sm:flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-1">
            <span className="text-[11px] text-slate-400 font-medium me-1">
              {isAr ? 'أو اختر مجالك مباشرة:' : 'Or pick a role:'}
            </span>
            {[
              { en: 'Frontend Developer', ar: 'Frontend Developer' },
              { en: 'Accountant', ar: 'محاسب (Accountant)' },
              { en: 'Customer Service', ar: 'خدمة عملاء (Customer Service)' },
              { en: 'Sales Representative', ar: 'مندوب مبيعات (Sales Rep)' },
              { en: 'Fresh Graduate', ar: 'حديث تخرج (Fresh Graduate)' },
            ].map((item) => (
              <button
                key={item.en}
                type="button"
                onClick={() => {
                  setRole(isAr ? item.ar : item.en);
                  setPersonalInfo({ jobTitle: isAr ? item.ar : item.en });
                  navigate('/builder');
                }}
                className="px-2.5 py-1 text-[11px] sm:text-xs font-semibold bg-slate-50 hover:bg-orange-50/80 text-slate-600 hover:text-[#FF4D2D] border border-slate-200 hover:border-orange-200 rounded-lg transition active:scale-95 cursor-pointer"
              >
                {isAr ? item.ar : item.en}
              </button>
            ))}
          </div>
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
