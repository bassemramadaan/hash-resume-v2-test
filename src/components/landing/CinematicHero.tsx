import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';

export const CinematicHero: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const { setPersonalInfo } = useResumeStore();

  const handleStart = () => {
    if (role.trim()) {
      setPersonalInfo({ jobTitle: role.trim() });
    }
    navigate('/builder');
  };

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden bg-white">
      {/* Editorial Background Elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#F8FAFC] to-transparent"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-coral-soft rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E2E8F0] text-[#001639] text-xs font-bold shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-coral" />
          <span>{isAr ? 'النسخة الجديدة 2.0 | أنقى وأسرع' : 'New Version 2.0 | Cleaner & Faster'}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#001639] leading-[1.05] tracking-tight font-brand"
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
          className="text-lg sm:text-xl md:text-2xl text-[#52627A] max-w-2xl mx-auto font-medium leading-relaxed"
        >
          {isAr
            ? 'صممنا Hash Resume ليكون أداة التركيز الوحيدة التي تحتاجها. ابدأ ببناء سيرة ذاتية تقبلها أنظمة الشركات فوراً.'
            : 'We designed Hash Resume to be the only focus tool you need. Build a resume that company systems accept instantly.'}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto w-full pt-8"
        >
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleStart()}
            placeholder={isAr ? 'ما هو مسماك الوظيفي؟' : 'What is your job title?'}
            className="w-full sm:w-72 px-6 py-4 bg-white border border-[#E2E8F0] text-[#001639] rounded-2xl text-base font-semibold placeholder:text-[#8793A6] focus:outline-none focus:ring-2 focus:ring-coral/20 focus:border-coral shadow-sm transition-all text-center sm:text-start"
          />
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-8 py-4 bg-coral hover:bg-coral-hover text-white rounded-2xl text-base font-bold shadow-lg shadow-coral/20 flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0"
          >
            <span>{isAr ? 'ابدأ الآن' : 'Start Building'}</span>
            <ArrowIcon className="w-5 h-5" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm font-semibold text-[#8793A6]"
        >
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#16A36A]" /> {isAr ? 'لا يحتاج حساب' : 'No account required'}</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#16A36A]" /> {isAr ? 'متوافق مع ATS' : 'ATS Compliant'}</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#16A36A]" /> {isAr ? 'مجاني تماماً' : '100% Free'}</span>
        </motion.div>
      </div>
    </section>
  );
};
