import React, { useState, useMemo } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { ShieldCheck, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const LiveAtsMeter: React.FC = () => {
  const { resumeData, settings, setActiveTab } = useResumeStore();
  const [isOpen, setIsOpen] = useState(false);
  const isAr = settings.language === 'ar';

  const metrics = useMemo(() => {
    const p = resumeData.personalInfo;
    const hasName = Boolean(p.fullName?.trim());
    const hasTitle = Boolean(p.jobTitle?.trim());
    const hasEmail = Boolean(p.email?.trim());
    const hasPhone = Boolean(p.phone?.trim());
    const hasLinkedin = Boolean(p.linkedin?.trim());
    const summaryWords = p.summary ? p.summary.trim().split(/\s+/).filter(Boolean).length : 0;
    const hasGoodSummary = summaryWords >= 25;

    const experiences = resumeData.experiences || [];
    const hasExperiences = experiences.length > 0;
    
    // Check if bullets have quantifiable metrics like digits or %
    let bulletsWithMetrics = 0;
    let totalBullets = 0;
    experiences.forEach((exp) => {
      (exp.bulletPoints || []).forEach((b) => {
        if (b.trim()) {
          totalBullets++;
          if (/\d+%?|\b\d+\b/g.test(b)) {
            bulletsWithMetrics++;
          }
        }
      });
    });

    const hasMetrics = bulletsWithMetrics >= 2;
    const skills = resumeData.skills || [];
    const hasGoodSkills = skills.length >= 5;
    const education = resumeData.education || [];
    const hasEducation = education.length > 0 && Boolean(education[0].institution?.trim());

    // Score calculation
    let score = 0;
    if (hasName) score += 10;
    if (hasTitle) score += 10;
    if (hasEmail && hasPhone) score += 15;
    if (hasLinkedin) score += 10;
    if (hasGoodSummary) score += 15;
    if (hasExperiences) score += 15;
    if (hasMetrics) score += 10;
    if (hasGoodSkills) score += 10;
    if (hasEducation) score += 5;

    score = Math.min(100, score);

    const checklist = [
      {
        id: 'personal',
        passed: hasName && hasTitle && hasEmail && hasPhone,
        titleAr: 'بيانات الاتصال والمسمى الوظيفي',
        titleEn: 'Contact Info & Target Job Title',
        tipAr: 'تأكد من إدخال الاسم، المسمى المستهدف، البريد ورقم الهاتف بدقة.',
        tipEn: 'Ensure name, target job title, email, and phone are complete.',
      },
      {
        id: 'personal',
        passed: hasLinkedin,
        titleAr: 'رابط حساب LinkedIn',
        titleEn: 'LinkedIn Profile URL',
        tipAr: 'وجود رابط لينكد إن يرفع موثوقية السيرة لدى مسؤولي التوظيف بنسبة 40%.',
        tipEn: 'Adding LinkedIn profile link boosts recruiter trust significantly.',
      },
      {
        id: 'personal',
        passed: hasGoodSummary,
        titleAr: 'النبذة المهنية المركزة (25+ كلمة)',
        titleEn: 'Focused Summary (25+ words)',
        tipAr: 'اكتب ملخصاً يعكس أهم مهاراتك وخبراتك مستعيناً بمولد الذكاء الاصطناعي.',
        tipEn: 'Write a strong summary highlighting key strengths using AI.',
      },
      {
        id: 'experiences',
        passed: hasExperiences,
        titleAr: 'الخبرات والأدوار الوظيفية',
        titleEn: 'Work Experience Roles',
        tipAr: 'أضف خبرة عمل واحدة على الأقل مع تواريخ وتفاصيل واضحة.',
        tipEn: 'Add at least one professional work experience entry.',
      },
      {
        id: 'experiences',
        passed: hasMetrics,
        titleAr: 'إنجازات بالأرقام والمؤشرات (KPIs / %)',
        titleEn: 'Quantified Metrics & Achievements (%)',
        tipAr: 'استخدم الأرقام في نقاط الخبرة (مثل: زيادة المبيعات 30% أو إدارة فريق 5 أفراد).',
        tipEn: 'Add numbers & percentages in bullet points to pass advanced ATS filters.',
      },
      {
        id: 'skills',
        passed: hasGoodSkills,
        titleAr: 'قائمة المهارات التنافسية (5+ مهارات)',
        titleEn: 'Core Skills & Competencies (5+)',
        tipAr: 'أضف ما لا يقل عن 5 مهارات تقنية وشخصية مطلوبة في مجالك.',
        tipEn: 'Add at least 5 relevant technical and soft skills.',
      },
      {
        id: 'education',
        passed: hasEducation,
        titleAr: 'المؤهل الأكاديمي والتعليم',
        titleEn: 'Education & Degree Info',
        tipAr: 'أضف شهادتك الجامعية أو تخصصك الدراسي الأحدث.',
        tipEn: 'Include your university or college educational qualification.',
      },
    ];

    return { score, checklist };
  }, [resumeData]);

  const scoreColor =
    metrics.score >= 85
      ? 'text-emerald-700 bg-emerald-50 border-emerald-300'
      : metrics.score >= 60
      ? 'text-amber-700 bg-amber-50 border-amber-300'
      : 'text-rose-700 bg-rose-50 border-rose-300';

  const progressBg =
    metrics.score >= 85
      ? 'bg-emerald-500'
      : metrics.score >= 60
      ? 'bg-amber-500'
      : 'bg-rose-500';

  return (
    <div className="relative">
      {/* Live ATS Pill Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold shadow-2xs transition cursor-pointer hover:shadow-xs active:scale-98 ${scoreColor}`}
        title={isAr ? 'مؤشر فحص جودة ATS اللحظي' : 'Live Real-time ATS Scan Meter'}
      >
        <ShieldCheck className="w-4 h-4 shrink-0" />
        <span className="font-mono font-bold">ATS: {metrics.score}%</span>
        <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden hidden sm:block">
          <div
            className={`h-full ${progressBg} transition-all duration-500 rounded-full`}
            style={{ width: `${metrics.score}%` }}
          />
        </div>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* Dropdown Recommendations Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-full mt-2 ${
              isAr ? 'left-0 sm:left-auto sm:right-0' : 'right-0 sm:right-auto sm:left-0'
            } z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 space-y-3.5 text-slate-800 text-xs`}
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between border-b pb-2.5 border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#001639]" />
                <span className="font-bold text-[#0B1120]">
                  {isAr ? 'تحليل جودة السيرة لـ ATS' : 'Real-time ATS Readiness'}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${scoreColor}`}>
                {metrics.score}% {isAr ? 'جاهزية' : 'Ready'}
              </span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className={`h-full ${progressBg} transition-all duration-500 rounded-full`}
                  style={{ width: `${metrics.score}%` }}
                />
              </div>
              <p className="text-[10px] text-[#52627A]">
                {metrics.score >= 85
                  ? isAr
                    ? '🎉 سيرتك الذاتية مطابقة لمعايير الفرز الآلي بنسبة ممتازة!'
                    : '🎉 Your resume has exceptional ATS compatibility!'
                  : isAr
                  ? '⚡ اتبع التوصيات أدناه لرفع نسبة القبول وتخطي الفلترة الآلية:'
                  : '⚡ Follow the quick tips below to boost parser score:'}
              </p>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {(metrics.checklist || []).map((item, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border transition flex items-start justify-between gap-2 ${
                    item.passed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0">
                    {item.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-0.5 min-w-0">
                      <div className="font-semibold text-xs text-[#0B1120]">
                        {isAr ? item.titleAr : item.titleEn}
                      </div>
                      {!item.passed && (
                        <div className="text-[10px] text-slate-600 leading-snug">
                          {isAr ? item.tipAr : item.tipEn}
                        </div>
                      )}
                    </div>
                  </div>

                  {!item.passed && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setIsOpen(false);
                      }}
                      className="px-2 py-1 bg-white hover:bg-slate-100 text-[#001639] border border-slate-300 rounded-lg text-[10px] font-semibold shrink-0 cursor-pointer shadow-2xs"
                    >
                      {isAr ? 'تحسين' : 'Fix'}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Footer quick action */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('ats');
                  setIsOpen(false);
                }}
                className="text-[#001639] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D]" />
                <span>{isAr ? 'فحص ATS العميق مع إعلان الوظيفة' : 'Deep ATS Scan with Job Post'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-800 text-[10px] font-medium"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
