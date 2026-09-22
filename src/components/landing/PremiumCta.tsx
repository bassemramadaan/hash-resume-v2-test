import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export const PremiumCta: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const navigate = useNavigate();
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-[#001639] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#FF4D2D]/20 rounded-full blur-[100px] sm:blur-[120px] mix-blend-screen pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4 sm:space-y-6 md:space-y-8">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight"
        >
          {isAr ? 'مستعد للحصول على وظيفتك القادمة؟' : 'Ready to land your next job?'}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-sm sm:text-lg md:text-xl text-[#8793A6] font-medium max-w-2xl mx-auto leading-relaxed"
        >
          {isAr 
            ? 'انضم لآلاف المحترفين الذين بنوا سيرهم الذاتية بسهولة تامة.' 
            : 'Join thousands of professionals who built their resumes with ease.'}
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="pt-4 sm:pt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto w-full"
        >
          <button
            onClick={() => navigate('/builder')}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] sm:min-h-[52px] bg-[#FF4D2D] hover:bg-[#E5431F] text-white rounded-xl sm:rounded-2xl text-sm sm:text-base font-extrabold shadow-lg shadow-coral/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <span>{isAr ? 'ابدأ إنشاء سيرتي' : 'Build My Resume'}</span>
            <ArrowIcon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          </button>
          
          <button
            onClick={() => navigate('/templates')}
            className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 min-h-[48px] sm:min-h-[52px] bg-[#00214F] hover:bg-[#002F6C] text-white rounded-xl sm:rounded-2xl text-sm sm:text-base font-bold border border-[#002F6C] transition-all active:scale-95 cursor-pointer"
          >
            {isAr ? 'تصفح القوالب' : 'Browse Templates'}
          </button>
        </motion.div>
      </div>
    </section>
  );
};
