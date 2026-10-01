import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, FileText, Check, ShieldCheck } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';

export const CinematicHero: React.FC<{ isAr: boolean }> = ({ isAr }) => {
  const navigate = useNavigate();
  const { settings } = useResumeStore();
  const [activeLangPreview, setActiveLangPreview] = useState<'ar' | 'en'>(isAr ? 'ar' : 'en');

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center pt-10 sm:pt-16 md:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden bg-[#FAF9F6]">
      {/* Subtle Peaceful Ambient Background */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[650px] max-h-[650px] bg-[#FF4D2D]/3 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
        {/* 1. Calm Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200/60 text-xs text-slate-500 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D2D]" />
          <span className="font-normal">
            {isAr ? 'متوافق مع أنظمة ATS • بدون تسجيل' : 'ATS-friendly • No sign-up required'}
          </span>
        </div>

        {/* 2. Hero Headline - Soft & Light (عنوان ناعم وخفيف) */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-[#001639] tracking-tight leading-[1.25]">
          {isAr ? (
            <>
              سيرتك الذاتية..<br />
              <span className="text-[#FF4D2D] font-normal">بهدوء</span> وبدون أي تعقيد.
            </>
          ) : (
            <>
              Your Resume..<br />
              <span className="text-[#FF4D2D] font-normal">Calm</span> & Zero Friction.
            </>
          )}
        </h1>

        {/* 3. Hero Body Text */}
        <p className="text-xs sm:text-sm md:text-base text-slate-500 max-w-2xl mx-auto font-normal leading-relaxed px-2">
          {isAr
            ? 'مساحات بيضاء واسعة، خطوط رقيقة وهادئة، وإحساس فوري بالسكينة. صممنا Hash Resume لتمنحك سيرة ذاتية قياسية مقروءة بأعلى دقة لدى مديري التوظيف وخوارزميات الفرز.'
            : 'Generous whitespace, quiet typography, and instant peace of mind. Build an ATS-friendly resume recruiters and algorithms can read effortlessly.'}
        </p>

        {/* 4. Action Buttons (زران هادئان: زر كورال هادئ ومريح ابدأ الآن بجانبه زر أبيض بإطار خفيف استكشف النماذج) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 max-w-sm sm:max-w-md mx-auto w-full">
          <button
            type="button"
            onClick={() => navigate('/builder')}
            className="w-full sm:w-auto px-7 py-3 bg-[#FF4D2D] hover:bg-[#E5431F] text-white rounded-xl text-xs sm:text-sm font-medium shadow-xs hover:shadow-sm transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isAr ? 'ابدأ الآن' : 'Start Now'}</span>
            <ArrowIcon className="w-3.5 h-3.5 shrink-0" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/templates')}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50/80 border border-slate-200 text-slate-600 rounded-xl text-xs sm:text-sm font-normal transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{isAr ? 'استكشف النماذج' : 'Explore Templates'}</span>
          </button>
        </div>

        {/* 5. The Zen Paper Studio (ورقة A4 بيضاء واحدة تستقر بنعومة على خلفية عاجية مريحة مع ظل طبيعي خافت جداً) */}
        <div className="pt-6 sm:pt-10 w-full max-w-3xl mx-auto">
          {/* Subtle Language Preview Switcher */}
          <div className="flex items-center justify-between pb-3 px-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-slate-400 text-[11px] font-normal">
                {isAr ? 'معاينة حية هادئة' : 'Live serene preview'}
              </span>
            </div>

            <div className="inline-flex p-0.5 rounded-lg bg-slate-200/60 border border-slate-200/60 text-[11px]">
              <button
                type="button"
                onClick={() => setActiveLangPreview('ar')}
                className={`px-2.5 py-1 rounded-md transition font-normal cursor-pointer ${
                  activeLangPreview === 'ar'
                    ? 'bg-white text-slate-800 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                العربية
              </button>
              <button
                type="button"
                onClick={() => setActiveLangPreview('en')}
                className={`px-2.5 py-1 rounded-md transition font-normal cursor-pointer ${
                  activeLangPreview === 'en'
                    ? 'bg-white text-slate-800 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* The Pristine A4 Paper Document with soft, natural ambient shadow and gentle breathing & rotation animation */}
          <motion.div
            onClick={() => navigate('/builder')}
            animate={{
              y: [0, -5, 0],
              rotate: [-0.9, 0.9, -0.9],
              boxShadow: [
                '0 12px 35px -10px rgba(0,0,0,0.04)',
                '0 20px 48px -12px rgba(0,0,0,0.065)',
                '0 12px 35px -10px rgba(0,0,0,0.04)',
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            whileHover={{
              y: -7,
              rotate: 0,
              boxShadow: '0 24px 55px -12px rgba(0,0,0,0.08)',
              transition: { duration: 0.35, ease: 'easeOut' },
            }}
            className="group relative bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-10 text-start cursor-pointer select-none will-change-transform transform-gpu origin-center"
            title={isAr ? 'انقر للبدء في إنشاء سيرتك الذاتية' : 'Click to start creating your resume'}
          >
            {/* نقطة خضراء صغيرة هادئة في الزاوية: معتمد لأنظمة ATS مع نبض بطيء ناعم */}
            <div className="absolute top-4 sm:top-6 end-4 sm:end-6 flex items-center gap-1.5 text-[11px] font-normal text-slate-500 bg-slate-50/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-slate-200/60">
              <motion.span
                animate={{
                  opacity: [0.55, 1, 0.55],
                  scale: [0.92, 1.08, 0.92],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"
              />
              <span>{isAr ? 'معتمد لأنظمة ATS' : 'ATS-Compliant'}</span>
            </div>

            {/* Resume Content Body */}
            {activeLangPreview === 'ar' ? (
              <div className="space-y-5 text-slate-800" dir="rtl">
                {/* Header Section */}
                <div className="border-b border-slate-200 pb-4 pe-24">
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                    باسم رمضان
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-[#FF4D2D] mt-0.5">
                    مدير مشروعات تقنية وتطوير واجهات
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1 flex flex-wrap gap-x-3 gap-y-0.5 font-normal">
                    <span>القاهرة، مصر</span>
                    <span>•</span>
                    <span>bassem@example.com</span>
                    <span>•</span>
                    <span>+20 100 000 0000</span>
                    <span>•</span>
                    <span>linkedin.com/in/profile</span>
                  </p>
                </div>

                {/* Professional Summary */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1">
                    الملخص المهني
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    متخصص في قيادة المنتجات الرقمية وتصميم أنظمة الواجهات المتقدمة. خبرة في تسريع دورة تسليم البرمجيات ورفع الكفاءة التشغيلية بنسبة 35% بالتعاون مع فرق عمل متعددة التخصصات.
                  </p>
                </div>

                {/* Experience Section */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1">
                    الخبرات المهنية
                  </h3>
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-semibold text-slate-800">قائد فريق تطوير المنتجات | شركة التقنية العالمية</span>
                      <span className="text-[11px] text-slate-600 font-normal">2021 – حتى الآن</span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 font-normal ps-1">
                      <li>إدارة وتطوير المنصة السحابية الرئيسية لتخدم أكثر من 120,000 مستخدم نشط.</li>
                      <li>تحسين سرعة معالجة البيانات بنسبة 40% وتطبيق معايير الكود النظيف.</li>
                    </ul>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1">
                    المهارات والقدرات الرئيسية
                  </h3>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {['إدارة المشروعات Agile', 'هندسة الواجهات React', 'تصميم النظم System Design', 'تحسين أداء ATS', 'حل المشكلات التقنية'].map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 bg-slate-100/90 text-slate-700 rounded-md text-[11px] font-normal border border-slate-200/80"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-5 text-slate-800" dir="ltr">
                {/* English Header */}
                <div className="border-b border-slate-200 pb-4 pe-24">
                  <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                    BASSEM RAMADAN
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-[#FF4D2D] mt-0.5">
                    Senior Technical Product Lead
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1 flex flex-wrap gap-x-3 gap-y-0.5 font-normal">
                    <span>Cairo, Egypt</span>
                    <span>•</span>
                    <span>bassem@example.com</span>
                    <span>•</span>
                    <span>+20 100 000 0000</span>
                    <span>•</span>
                    <span>linkedin.com/in/profile</span>
                  </p>
                </div>

                {/* English Summary */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1">
                    PROFESSIONAL SUMMARY
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    Results-driven Product & Technical Lead with 7+ years of experience engineering high-scale web platforms. Proven track record of improving operational velocity by 35% across cross-functional teams.
                  </p>
                </div>

                {/* English Experience */}
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1">
                    EXPERIENCE
                  </h3>
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-semibold text-slate-800">Lead Product Engineer | Global Tech Solutions</span>
                      <span className="text-[11px] text-slate-600 font-normal">2021 – Present</span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 font-normal ps-1">
                      <li>Architected cloud-based core portals serving over 120,000 monthly active users.</li>
                      <li>Accelerated data processing throughput by 40% with strict ATS formatting standards.</li>
                    </ul>
                  </div>
                </div>

                {/* English Skills */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-1">
                    CORE SKILLS
                  </h3>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {['Product Strategy', 'Agile & Scrum', 'React & TypeScript', 'System Architecture', 'ATS Keyword Alignment'].map((sk) => (
                      <span
                        key={sk}
                        className="px-2 py-0.5 bg-slate-100/90 text-slate-700 rounded-md text-[11px] font-normal border border-slate-200/80"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Hover Prompt Overlay Button */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {isAr ? 'نموذج مطابق لمعايير Taleo و Workday' : 'Matches Taleo & Workday corporate parsers'}
              </span>
              <span className="text-[#FF4D2D] font-medium group-hover:underline flex items-center gap-1">
                {isAr ? 'انقر لتخصيص بياناتك' : 'Click to customize your CV'}
                <ArrowIcon className="w-3 h-3" />
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

