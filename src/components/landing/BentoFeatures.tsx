import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Cpu, Globe, Target } from 'lucide-react';

export const BentoFeatures: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 md:space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#001639] tracking-tight">
            {isAr ? 'كل ما تحتاجه في مكان واحد' : 'Everything you need in one place'}
          </h2>
          <p className="text-[#52627A] font-medium text-sm sm:text-base md:text-lg leading-relaxed">
            {isAr ? 'تصميم ذكي يختصر عليك ساعات من العمل ويضمن وصول سيرتك لمديري التوظيف.' : 'Smart design that saves you hours and ensures your resume reaches hiring managers.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 auto-rows-auto md:auto-rows-[240px]">
          
          {/* Main Large Feature */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-[#F8FAFC] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-9 border border-[#E2E8F0] flex flex-col justify-between relative overflow-hidden group hover:border-[#C8D5E8] transition-colors"
          >
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-coral-soft rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity pointer-events-none"></div>
            <div className="relative z-10 space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex items-center justify-center text-[#FF4D2D] shrink-0">
                <Target className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-[#001639]">{isAr ? 'مُحسّن لأنظمة ATS' : 'ATS Optimized'}</h3>
              <p className="text-[#52627A] font-medium text-xs sm:text-sm md:text-base max-w-sm leading-relaxed">
                {isAr 
                  ? 'قوالب مبنية برمجياً لتمر بسلام من أنظمة الفلترة الآلية دون فقدان أي بيانات.' 
                  : 'Templates built programmatically to pass safely through automated filtering systems without losing data.'}
              </p>
            </div>
            <div className="relative z-10 mt-5 sm:mt-6 inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs w-fit font-bold text-xs sm:text-sm text-[#001639]">
              <span className="w-2 h-2 rounded-full bg-[#16A36A] animate-pulse shrink-0"></span>
              <span>98% ATS Parse Rate</span>
            </div>
          </motion.div>

          {/* AI Assistant */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#001639] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 border border-[#00214F] flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF4D2D]/10 to-transparent pointer-events-none"></div>
            <div className="relative z-10 space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#00214F] flex items-center justify-center text-[#FF4D2D] shrink-0">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-white">{isAr ? 'مساعد ذكي' : 'AI Assistant'}</h3>
              <p className="text-[#8793A6] font-medium text-xs sm:text-sm md:text-base leading-relaxed">
                {isAr 
                  ? 'صغ إنجازاتك بطريقة احترافية بضغطة زر باستخدام Gemini.' 
                  : 'Draft your achievements professionally with one click using Gemini.'}
              </p>
            </div>
          </motion.div>

          {/* Bilingual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-[#F8FAFC] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 border border-[#E2E8F0] flex flex-col justify-between hover:border-[#C8D5E8] transition-colors"
          >
            <div className="space-y-3 sm:space-y-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex items-center justify-center text-[#001639] shrink-0">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#001639]">{isAr ? 'عربي وإنجليزي' : 'Bilingual'}</h3>
              <p className="text-[#52627A] font-medium text-xs sm:text-sm leading-relaxed">
                {isAr 
                  ? 'دعم كامل للكتابة من اليمين لليسار، بضغطة زر واحدة.' 
                  : 'Full RTL support and seamless translation with one click.'}
              </p>
            </div>
          </motion.div>

          {/* Privacy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 bg-[#F8FAFC] rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 border border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6 hover:border-[#C8D5E8] transition-colors"
          >
            <div className="space-y-3 sm:space-y-4 max-w-lg">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white shadow-2xs border border-slate-200/60 flex items-center justify-center text-[#001639] shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              </div>
              <h3 className="text-lg sm:text-2xl font-black text-[#001639]">{isAr ? 'خصوصية بياناتك 100%' : '100% Data Privacy'}</h3>
              <p className="text-[#52627A] font-medium text-xs sm:text-sm md:text-base leading-relaxed">
                {isAr 
                  ? 'بياناتك لا تغادر متصفحك. لا نقوم بتخزين معلوماتك الشخصية على خوادمنا نهائياً.' 
                  : 'Your data never leaves your browser. We never store your personal info on our servers.'}
              </p>
            </div>
            <div className="w-full sm:w-auto px-5 sm:px-6 py-3.5 sm:py-4 bg-white rounded-xl sm:rounded-2xl border border-[#E2E8F0] shadow-2xs text-center shrink-0">
              <div className="text-2xl sm:text-3xl font-black text-[#16A36A]">100%</div>
              <div className="text-[11px] sm:text-xs font-bold text-[#8793A6] uppercase mt-0.5">Local Storage</div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
