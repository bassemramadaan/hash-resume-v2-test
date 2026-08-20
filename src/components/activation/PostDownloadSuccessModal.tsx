import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../../store/useResumeStore';
import { CheckCircle2, Sparkles, Search, X, Edit3, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

export const PostDownloadSuccessModal: React.FC = () => {
  const {
    isPostDownloadModalOpen,
    setIsPostDownloadModalOpen,
    settings,
    resumeData,
  } = useResumeStore();

  const isAr = settings.language === 'ar';

  // Review & Edit State
  const [showReviewStep, setShowReviewStep] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Prefilled search fields
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [experience, setExperience] = useState('');
  const [skillsStr, setSkillsStr] = useState('');

  useEffect(() => {
    if (isPostDownloadModalOpen) {
      // Trigger small celebration confetti on mount
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore if canvas-confetti fails
      }

      // Initialize prefilled values from resume data
      const info = resumeData?.personalInfo;
      setJobTitle(info?.jobTitle || '');
      setLocation(info?.location || '');
      setExperience(settings.careerFocus === 'fresh-grad' ? (isAr ? 'حديث تخرج' : 'Fresh Graduate') : (isAr ? 'خبرة متوسطة' : 'Mid-Level'));
      const topSkills = (resumeData.skills || []).slice(0, 5).map((s) => s.name).join(', ');
      setSkillsStr(topSkills);
      setShowReviewStep(false);
      setIsEditing(false);
    }
  }, [isPostDownloadModalOpen, resumeData, settings.careerFocus, isAr]);

  if (!isPostDownloadModalOpen) return null;

  const handleClose = () => {
    setIsPostDownloadModalOpen(false);
  };

  const handlePrimaryClick = () => {
    if (!showReviewStep) {
      setShowReviewStep(true);
    } else {
      executeSearchRedirect();
    }
  };

  const executeSearchRedirect = () => {
    const params = new URLSearchParams();
    if (jobTitle.trim()) params.set('jobTitle', jobTitle.trim());
    if (location.trim()) params.set('location', location.trim());
    if (experience.trim()) params.set('experience', experience.trim());
    if (skillsStr.trim()) params.set('skills', skillsStr.trim());

    const url = `/hash-hunt?${params.toString()}`;
    window.open(url, '_blank');
    handleClose();
  };

  return (
    <AnimatePresence>
      {isPostDownloadModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            dir={isAr ? 'rtl' : 'ltr'}
            className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-800 my-auto flex flex-col relative"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 left-4 border-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-full transition cursor-pointer z-10"
              style={{ [isAr ? 'left' : 'right']: '1rem', [isAr ? 'right' : 'left']: 'auto' }}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Celebration Banner */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-slate-50 p-6 pt-7 text-center relative overflow-hidden border-b border-slate-100">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mb-3 shadow-inner ring-4 ring-emerald-50">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h2 className="font-extrabold text-lg sm:text-xl text-slate-900 leading-snug">
                {isAr ? 'تم تحميل سيرتك الذاتية بنجاح! 🎉' : 'Your resume is ready! 🎉'}
              </h2>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 space-y-4">
              {!showReviewStep ? (
                <>
                  <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <p>
                      {isAr
                        ? 'أحسنت—أخذت خطوة مهمة نحو فرصتك القادمة.'
                        : 'Great job — you just took an important step toward your next opportunity.'}
                    </p>
                    <p>
                      {isAr
                        ? 'نتمنى لك التوفيق، وإن شاء الله تلاقي الفرصة المناسبة.'
                        : 'We wish you the best of luck in finding the right role.'}
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#001639]">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>{isAr ? 'جاهز تبدأ التقديم؟' : 'Ready to start applying?'}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isAr
                        ? 'خلّي Hash Hunt يساعدك تلاقي وظائف تناسب خبرتك واهتماماتك.'
                        : 'Let Hash Hunt help you discover jobs that match your experience and interests.'}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col gap-2">
                    <button
                      onClick={handlePrimaryClick}
                      className="w-full py-3 px-4 rounded-xl bg-[#001639] hover:bg-[#00245a] text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <Search className="w-4 h-4 text-emerald-400" />
                      <span>{isAr ? 'ابدأ البحث عن فرص مناسبة' : 'Find matching jobs'}</span>
                    </button>

                    <button
                      onClick={handleClose}
                      className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 font-semibold text-xs sm:text-sm transition cursor-pointer"
                    >
                      {isAr ? 'لاحقًا' : 'Maybe later'}
                    </button>
                  </div>
                </>
              ) : (
                /* Review / Edit Prefill Step */
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <p className="text-xs font-bold text-slate-800">
                      {isAr ? 'سنبحث عن وظائف بناءً على:' : 'Searching for jobs based on:'}
                    </p>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isEditing ? (isAr ? 'حفظ' : 'Done') : (isAr ? 'تعديل البيانات' : 'Edit details')}</span>
                    </button>
                  </div>

                  {!isEditing ? (
                    <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3.5 text-xs space-y-1.5 text-slate-700">
                      <p>
                        <strong className="text-slate-900">{isAr ? 'المسمى: ' : 'Title: '}</strong>
                        {jobTitle || (isAr ? 'غير محدد' : 'Not specified')}
                      </p>
                      <p>
                        <strong className="text-slate-900">{isAr ? 'الموقع: ' : 'Location: '}</strong>
                        {location || (isAr ? 'غير محدد' : 'Not specified')}
                      </p>
                      {skillsStr && (
                        <p>
                          <strong className="text-slate-900">{isAr ? 'المهارات: ' : 'Skills: '}</strong>
                          {skillsStr}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">{isAr ? 'المسمى الوظيفي' : 'Job Title'}</label>
                        <input
                          type="text"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">{isAr ? 'الموقع / المدينة' : 'Location'}</label>
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-medium mb-1">{isAr ? 'أهم المهارات' : 'Key Skills'}</label>
                        <input
                          type="text"
                          value={skillsStr}
                          onChange={(e) => setSkillsStr(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 text-xs"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => setShowReviewStep(false)}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold text-xs transition cursor-pointer"
                    >
                      {isAr ? 'رجوع' : 'Back'}
                    </button>
                    <button
                      onClick={executeSearchRedirect}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Search className="w-4 h-4" />
                      <span>{isAr ? 'ابدأ البحث' : 'Start Search'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
