import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../../../store/useResumeStore';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface PersonalSubStepProps {
  onNextMainStep: () => void;
  onPrevMainStep?: () => void;
  onSubStepChange?: (subIndex: number, totalSubs: number) => void;
  isAr?: boolean;
}

export const PersonalSubStep: React.FC<PersonalSubStepProps> = ({
  onNextMainStep,
  onPrevMainStep,
  onSubStepChange,
  isAr = true,
}) => {
  const { resumeData, setPersonalInfo } = useResumeStore();
  const info = resumeData.personalInfo || {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    summary: '',
  };

  const updateField = (field: keyof typeof info, value: string) => {
    setPersonalInfo({ [field]: value });
  };

  // 4 Sub-stages inside Personal Step
  // 0: Full Name & Job Title
  // 1: Email & Phone
  // 2: Location & Professional Links (LinkedIn, GitHub, Portfolio)
  // 3: Professional Summary (2-3 lines focus)
  const [subStage, setSubStage] = useState<number>(0);
  const [showExtraLinks, setShowExtraLinks] = useState<boolean>(Boolean(info.github || info.website));
  const TOTAL_SUB_STAGES = 4;

  const handleSubStageChange = (newStage: number) => {
    setSubStage(newStage);
    if (onSubStepChange) {
      onSubStepChange(newStage, TOTAL_SUB_STAGES);
    }
  };

  const handleNext = () => {
    if (subStage < TOTAL_SUB_STAGES - 1) {
      handleSubStageChange(subStage + 1);
    } else {
      onNextMainStep();
    }
  };

  const handlePrev = () => {
    if (subStage > 0) {
      handleSubStageChange(subStage - 1);
    } else if (onPrevMainStep) {
      onPrevMainStep();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault();
      handleNext();
    }
  };

  // Calm sliding transitions
  const slideVariants = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' as const } },
    exit: { opacity: 0, y: -12, transition: { duration: 0.18 } },
  };

  return (
    <div className="w-full max-w-xl mx-auto" onKeyDown={handleKeyDown}>
      <AnimatePresence mode="wait">
        {/* SUB-STAGE 0: Full Name & Job Title */}
        {subStage === 0 && (
          <motion.div
            key="personal-stage-0"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-6"
          >
            <div>
              <span className="text-xs sm:text-sm font-bold tracking-wide text-[#FF4D2D] block mb-2">
                {isAr ? 'خلينا نبدأ ببياناتك' : "Let's start with the basics"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#001639] tracking-tight mb-2">
                {isAr ? 'اسمك ومسماك الوظيفي إيه؟' : 'What is your name and target job title?'}
              </h1>
              <p className="text-sm text-[#7a8093]">
                {isAr
                  ? 'اكتب اسمك الثلاثي ومسماك الوظيفي المستهدف بدقة كما سيظهر في رأس سيرتك الذاتية.'
                  : 'Enter your full name and exact target role as you want recruiters and ATS systems to see it.'}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="personal-fullName" className="block text-[11px] sm:text-xs font-bold text-[#12141a] mb-1 sm:mb-1.5">
                  {isAr ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <input
                  id="personal-fullName"
                  type="text"
                  autoFocus
                  placeholder={isAr ? 'مثال: باسم رمضان' : 'e.g., Alex Morgan'}
                  value={info.fullName || ''}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-[#12141a] bg-white border-2 border-[#e8e5de] focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 rounded-xl sm:rounded-2xl outline-none transition-all placeholder:text-[#9099ac]"
                />
              </div>

              <div>
                <label htmlFor="personal-jobTitle" className="block text-[11px] sm:text-xs font-bold text-[#12141a] mb-1 sm:mb-1.5">
                  {isAr ? 'المسمى الوظيفي المستهدف' : 'Target Job Title'}
                </label>
                <input
                  id="personal-jobTitle"
                  type="text"
                  placeholder={isAr ? 'مثال: مهندس برمجيات أول' : 'e.g., Senior Software Engineer'}
                  value={info.jobTitle || ''}
                  onChange={(e) => updateField('jobTitle', e.target.value)}
                  className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 text-sm sm:text-base font-medium text-[#12141a] bg-white border-2 border-[#e8e5de] focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 rounded-xl sm:rounded-2xl outline-none transition-all placeholder:text-[#9099ac]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-4 px-6 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-base rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isAr ? 'التالي' : 'Continue'}</span>
                {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="text-xs text-[#7a8093] hover:text-[#001639] transition font-medium underline-offset-4 hover:underline cursor-pointer"
              >
                {isAr ? 'أكمل من غير المعلومة دي دلوقتي' : 'Skip for now'}
              </button>
            </div>
          </motion.div>
        )}

        {/* SUB-STAGE 1: Email & Phone */}
        {subStage === 1 && (
          <motion.div
            key="personal-stage-1"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-6"
          >
            <div>
              <span className="text-xs sm:text-sm font-bold tracking-wide text-[#FF4D2D] block mb-2">
                {isAr ? 'معلومات التواصل' : 'Contact Information'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#001639] tracking-tight mb-2">
                {isAr ? 'إزاي مسؤولي التوظيف يتواصلوا معاك؟' : 'How can recruiters reach you?'}
              </h1>
              <p className="text-sm text-[#7a8093]">
                {isAr
                  ? 'بريد إلكتروني احترافي ورقم هاتف مع كود الدولة يضمن سرعة الرد.'
                  : 'A professional email and phone number ensure quick recruiter callbacks.'}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="personal-email" className="block text-xs font-bold text-[#12141a] mb-1.5">
                  {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <input
                  id="personal-email"
                  type="email"
                  autoFocus
                  dir="ltr"
                  placeholder="name@example.com"
                  value={info.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full px-4 py-3.5 sm:py-4 text-base font-medium text-[#12141a] bg-white border-2 border-[#e8e5de] focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 rounded-2xl outline-none transition-all placeholder:text-[#9099ac]"
                />
              </div>

              <div>
                <label htmlFor="personal-phone" className="block text-xs font-bold text-[#12141a] mb-1.5">
                  {isAr ? 'رقم الهاتف (مع كود الدولة)' : 'Phone Number'}
                </label>
                <input
                  id="personal-phone"
                  type="tel"
                  dir="ltr"
                  placeholder="+20 10 1234 5678"
                  value={info.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full px-4 py-3.5 sm:py-4 text-base font-medium text-[#12141a] bg-white border-2 border-[#e8e5de] focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 rounded-2xl outline-none transition-all placeholder:text-[#9099ac]"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-3 pt-2">
              <div className="w-full flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="py-4 px-5 bg-white border-2 border-[#e8e5de] text-[#001639] hover:bg-[#f4f1e9] font-bold text-sm rounded-2xl transition cursor-pointer"
                >
                  {isAr ? 'السابق' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-4 px-6 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-base rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isAr ? 'التالي' : 'Continue'}</span>
                  {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="text-xs text-[#7a8093] hover:text-[#001639] transition font-medium underline-offset-4 hover:underline cursor-pointer"
              >
                {isAr ? 'أكمل من غير المعلومة دي دلوقتي' : 'Skip for now'}
              </button>
            </div>
          </motion.div>
        )}

        {/* SUB-STAGE 2: Location & Professional Links (LinkedIn + Optional GitHub & Website) */}
        {subStage === 2 && (
          <motion.div
            key="personal-stage-2"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-6"
          >
            <div>
              <span className="text-xs sm:text-sm font-bold tracking-wide text-[#FF4D2D] block mb-2">
                {isAr ? 'الموقع والتواجد المهني' : 'Location & Professional Links'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#001639] tracking-tight mb-2">
                {isAr ? 'أنت متواجد فين ورابط لينكد إن إيه؟' : 'Where are you based and LinkedIn profile?'}
              </h1>
              <p className="text-sm text-[#7a8093]">
                {isAr
                  ? 'المدينة والدولة فقط مطلوبة (مثال: القاهرة، مصر). رابط لينكد إن يرفع ثقة مسؤولي التوظيف.'
                  : 'City & Country are sufficient (e.g., Cairo, Egypt). LinkedIn profile boosts credibility.'}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="personal-location" className="block text-xs font-bold text-[#12141a] mb-1.5">
                  {isAr ? 'الموقع (المدينة، الدولة فقط)' : 'Location (City, Country only)'}
                </label>
                <input
                  id="personal-location"
                  type="text"
                  autoFocus
                  placeholder={isAr ? 'مثال: القاهرة، مصر أو الرياض، السعودية' : 'e.g., Cairo, Egypt or Riyadh, Saudi Arabia'}
                  value={info.location || ''}
                  onChange={(e) => updateField('location', e.target.value)}
                  className="w-full px-4 py-3.5 sm:py-4 text-base font-medium text-[#12141a] bg-white border-2 border-[#e8e5de] focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 rounded-2xl outline-none transition-all placeholder:text-[#9099ac]"
                />
              </div>

              <div>
                <label htmlFor="personal-linkedin" className="block text-xs font-bold text-[#12141a] mb-1.5">
                  {isAr ? 'رابط حساب LinkedIn (اختياري لكن مفضل)' : 'LinkedIn Profile (Optional but recommended)'}
                </label>
                <input
                  id="personal-linkedin"
                  type="url"
                  dir="ltr"
                  placeholder="https://linkedin.com/in/username"
                  value={info.linkedin || ''}
                  onChange={(e) => updateField('linkedin', e.target.value)}
                  className="w-full px-4 py-3.5 sm:py-4 text-base font-medium text-[#12141a] bg-white border-2 border-[#e8e5de] focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 rounded-2xl outline-none transition-all placeholder:text-[#9099ac]"
                />
              </div>

              {/* Collapsible / Optional GitHub & Portfolio Website */}
              {!showExtraLinks ? (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowExtraLinks(true)}
                    className="text-xs font-bold text-[#FF4D2D] hover:text-[#001639] transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>+ {isAr ? 'إضافة رابط GitHub أو موقع شخصي (اختياري)' : 'Add GitHub or Portfolio link (Optional)'}</span>
                  </button>
                </div>
              ) : (
                <div className="p-3.5 bg-[#f4f1e9]/60 border border-[#e8e5de] rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#001639]">
                      {isAr ? 'روابط تقنية إضافية (للمطورين والمصممين):' : 'Additional Technical Links:'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowExtraLinks(false)}
                      className="text-[11px] text-[#7a8093] hover:text-rose-600 transition"
                    >
                      {isAr ? 'إخفاء' : 'Hide'}
                    </button>
                  </div>
                  <div>
                    <label htmlFor="personal-github" className="block text-[11px] font-bold text-[#7a8093] mb-1">
                      {isAr ? 'رابط GitHub' : 'GitHub URL'}
                    </label>
                    <input
                      id="personal-github"
                      type="url"
                      dir="ltr"
                      placeholder="https://github.com/username"
                      value={info.github || ''}
                      onChange={(e) => updateField('github', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm font-medium text-[#12141a] bg-white border border-[#e8e5de] focus:border-[#FF4D2D] rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="personal-website" className="block text-[11px] font-bold text-[#7a8093] mb-1">
                      {isAr ? 'الموقع الشخصي أو Portfolio' : 'Portfolio Website URL'}
                    </label>
                    <input
                      id="personal-website"
                      type="url"
                      dir="ltr"
                      placeholder="https://yourportfolio.com"
                      value={info.website || ''}
                      onChange={(e) => updateField('website', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm font-medium text-[#12141a] bg-white border border-[#e8e5de] focus:border-[#FF4D2D] rounded-xl outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-3 pt-2">
              <div className="w-full flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="py-4 px-5 bg-white border-2 border-[#e8e5de] text-[#001639] hover:bg-[#f4f1e9] font-bold text-sm rounded-2xl transition cursor-pointer"
                >
                  {isAr ? 'السابق' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-4 px-6 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-base rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isAr ? 'التالي' : 'Continue'}</span>
                  {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="text-xs text-[#7a8093] hover:text-[#001639] transition font-medium underline-offset-4 hover:underline cursor-pointer"
              >
                {isAr ? 'أكمل من غير المعلومة دي دلوقتي' : 'Skip for now'}
              </button>
            </div>
          </motion.div>
        )}

        {/* SUB-STAGE 3: Professional Summary (2-3 lines optimal ATS length) */}
        {subStage === 3 && (
          <motion.div
            key="personal-stage-3"
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col gap-6"
          >
            <div>
              <span className="text-xs sm:text-sm font-bold tracking-wide text-[#FF4D2D] block mb-2">
                {isAr ? 'الملخص المهني (2 إلى 3 أسطر فقط)' : 'Professional Summary (2-3 lines)'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#001639] tracking-tight mb-2">
                {isAr ? 'لخص خبرتك وقيمتك في 2 إلى 3 أسطر' : 'Briefly summarize your experience in 2-3 lines'}
              </h1>
              <p className="text-sm text-[#7a8093]">
                {isAr
                  ? 'خبراء التوظيف والـ ATS يفضلون ملخصاً قصيراً ومركزاً (2-3 أسطر) يوضح سنوات الخبرة وأهم المهارات المحورية، دون حشو إنشائي.'
                  : 'Recruiters prefer a concise 2-3 line snapshot highlighting years of experience and top domain skills.'}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="personal-summary" className="sr-only">
                {isAr ? 'الملخص المهني' : 'Professional Summary'}
              </label>
              <textarea
                id="personal-summary"
                autoFocus
                rows={4}
                placeholder={
                  isAr
                    ? 'مثال: مهندس برمجيات بخبرة 4+ سنوات في تطوير تطبيقات React و Node.js، قاد تحسين سرعة التحميل بنسبة 35% وخفض تكاليف الاستضافة في بيئات سحابية سريعة النمو.'
                    : 'e.g., Software Engineer with 4+ years building responsive web apps with React and TypeScript, optimizing system performance by 35% in high-traffic production.'
                }
                value={info.summary || ''}
                onChange={(e) => updateField('summary', e.target.value)}
                className="w-full p-4 text-base font-medium text-[#12141a] bg-white border-2 border-[#e8e5de] focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 rounded-2xl outline-none transition-all placeholder:text-[#9099ac] resize-y"
              />

              <div className="flex items-center justify-between text-xs text-[#7a8093] px-1">
                <span>
                  {isAr ? '💡 نصيحة ATS: اجعل الملخص بين 150 و 350 حرفاً كحد أقصى.' : '💡 ATS Tip: Keep summary between 150 - 350 characters.'}
                </span>
                <span className="font-mono">
                  {(info.summary || '').length} {isAr ? 'حرف' : 'chars'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-3 pt-2">
              <div className="w-full flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="py-4 px-5 bg-white border-2 border-[#e8e5de] text-[#001639] hover:bg-[#f4f1e9] font-bold text-sm rounded-2xl transition cursor-pointer"
                >
                  {isAr ? 'السابق' : 'Back'}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-4 px-6 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-base rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isAr ? 'إنهاء الخطوة الأولى والانتقال للخبرات' : 'Finish & Go to Experience'}</span>
                  {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="text-xs text-[#7a8093] hover:text-[#001639] transition font-medium underline-offset-4 hover:underline cursor-pointer"
              >
                {isAr ? 'أكمل من غير المعلومة دي دلوقتي' : 'Skip for now'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
