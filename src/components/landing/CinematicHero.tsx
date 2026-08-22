import React, { useState } from 'react';
import { motion } from 'motion/react';
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
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-10 sm:pt-20 pb-12 sm:pb-16 px-3.5 sm:px-6 overflow-hidden bg-white">
      {/* Editorial Background Elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#F8FAFC] to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-coral-soft rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-6 sm:space-y-10">
        
        {/* Header Badges & Slogan Flag */}
        <div className="flex flex-col items-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
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
          </motion.div>

          {/* Slogan Flag Banner */}
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-orange-50 via-amber-50 to-rose-50 border border-orange-200/90 text-[#001639] text-[11px] sm:text-sm font-extrabold shadow-xs"
          >
            <Flag className="w-3.5 h-3.5 text-[#FF4D2D] fill-[#FF4D2D]/20 shrink-0" />
            <span className="tracking-tight">
              {isFrench
                ? 'Sans inscription. Créez. Téléchargez. Postulez.'
                : isArabic
                ? 'بدون إنشاء حساب. أنشئ سيرتك. حمّلها. وقدّم بها.'
                : 'No sign-up. Build. Download. Apply.'}
            </span>
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#001639] leading-[1.1] sm:leading-[1.05] tracking-tight font-brand"
        >
          {isAr ? (
            <>سيرتك الذاتية.<br />بدون <span className="text-coral">أي تعقيد.</span></>
          ) : (
            <>Your Resume.<br />Zero <span className="text-coral">Friction.</span></>
          )}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
          className="text-sm sm:text-xl md:text-2xl text-[#52627A] max-w-2xl mx-auto font-medium leading-relaxed px-2"
        >
          {isFrench
            ? 'Nous avons conçu Hash Resume pour être le seul outil de concentration dont vous avez besoin. Créez un CV que les recruteurs acceptent instantanément.'
            : isAr
            ? 'صممنا Hash Resume ليكون أداة التركيز الوحيدة التي تحتاجها. ابدأ ببناء سيرة ذاتية تقبلها أنظمة الشركات فوراً.'
            : 'We designed Hash Resume to be the only focus tool you need. Build a resume that company systems accept instantly.'}
        </motion.p>

        {/* Founder Signature (Fine-tip pen handwriting in English: Bassem Ramadan) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: 'easeOut' }}
          className="flex flex-col items-center justify-center pt-1 select-none"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-lg mx-auto w-full pt-4 sm:pt-6"
        >
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            placeholder={isAr ? 'ما هو مسماك الوظيفي؟' : 'What is your job title?'}
            className="w-full sm:w-72 px-4 sm:px-6 py-3.5 sm:py-4 bg-white border border-[#E2E8F0] text-[#001639] rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold placeholder:text-[#8793A6] focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral shadow-2xs transition-all text-center sm:text-start"
          />
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-coral hover:bg-coral-hover text-white rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold shadow-md shadow-coral/20 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 cursor-pointer min-h-[46px]"
          >
            <span>{isAr ? 'ابدأ الآن' : 'Start Building'}</span>
            <ArrowIcon className="w-4 h-4 sm:w-5 h-5" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-3 sm:pt-6 text-xs sm:text-sm font-semibold text-[#8793A6]"
        >
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16A36A]" /> {isAr ? 'لا يحتاج حساب' : 'No account required'}</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16A36A]" /> {isAr ? 'متوافق مع ATS' : 'ATS Compliant'}</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#16A36A]" /> {isAr ? 'مجاني تماماً' : '100% Free'}</span>
        </motion.div>
      </div>
    </section>
  );
};
