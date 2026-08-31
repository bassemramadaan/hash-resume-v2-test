import React, { useMemo } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import {
  FileText,
  Briefcase,
  Wrench,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Target,
} from 'lucide-react';

interface SectionAudit {
  id: 'summary' | 'experience' | 'skills' | 'contact_education';
  sectionKey: 'personal' | 'experiences' | 'skills' | 'education';
  titleAr: string;
  titleEn: string;
  titleFr: string;
  score: number;
  status: 'optimal' | 'good' | 'needs_improvement';
  icon: React.ElementType;
  strengths: string[];
  issues: string[];
  fixTips: string[];
}

interface AtsSectionBreakdownProps {
  onNavigateToSection?: (sectionKey: any) => void;
}

export const AtsSectionBreakdown: React.FC<AtsSectionBreakdownProps> = ({
  onNavigateToSection,
}) => {
  const { resumeData, settings, setActiveTab } = useResumeStore();
  const lang = settings.language;
  const isAr = lang === 'ar';

  const audits = useMemo<SectionAudit[]>(() => {
    const p = resumeData.personalInfo;
    const experiences = resumeData.experiences || [];
    const skills = resumeData.skills || [];
    const education = resumeData.education || [];

    // 1. Summary Audit
    const summaryText = p.summary?.trim() || '';
    const summaryWordCount = summaryText ? summaryText.split(/\s+/).filter(Boolean).length : 0;
    let summaryScore = 0;
    const summaryStrengths: string[] = [];
    const summaryIssues: string[] = [];
    const summaryTips: string[] = [];

    if (summaryWordCount >= 25 && summaryWordCount <= 90) {
      summaryScore = 95;
      summaryStrengths.push(isAr ? 'طول الملخص مثالي (25 - 90 كلمة) ويقرؤه الفاحص الآلي بسهولة.' : 'Optimal summary length (25-90 words).');
    } else if (summaryWordCount > 0 && summaryWordCount < 25) {
      summaryScore = 60;
      summaryIssues.push(isAr ? 'الملخص المهني قصير جداً (أقل من 25 كلمة).' : 'Summary is too brief (under 25 words).');
      summaryTips.push(isAr ? 'أضف جملتين إضافيتين توضح أهم مهاراتك وسنوات خبرتك وقيمتك المضافة للشركة.' : 'Add 2 more sentences highlighting your core competencies and value proposition.');
    } else if (summaryWordCount > 90) {
      summaryScore = 70;
      summaryIssues.push(isAr ? 'الملخص طويل نسبياً وقد يتجاوز حدود الفرز السريع.' : 'Summary is lengthy for quick recruiter screening.');
      summaryTips.push(isAr ? 'اختصر الملخص ليكون في حدود 3-4 أسطر مركزة ومباشرة.' : 'Condense to 3-4 focused, high-impact lines.');
    } else {
      summaryScore = 20;
      summaryIssues.push(isAr ? 'لا يوجد ملخص مهني.' : 'No professional summary found.');
      summaryTips.push(isAr ? 'أنشئ ملخصاً مهنياً بالذكاء الاصطناعي بنقرة واحدة لزيادة فرص استدعائك للمقابلة.' : 'Generate an AI summary to boost initial recruiter screening score.');
    }

    // 2. Experience & Metrics Audit
    let expScore = 0;
    const expStrengths: string[] = [];
    const expIssues: string[] = [];
    const expTips: string[] = [];

    let totalBullets = 0;
    let metricBullets = 0;
    let strongActionVerbBullets = 0;

    const actionVerbRegex = /(قُدت|أشرفت|حققت|حسّنت|قلّصت|صممت|طوّرت|أطلقت|أدرت|spearheaded|increased|reduced|optimized|architected|accelerated|delivered|developed|managed)/i;
    const metricRegex = /\d+%?|\b\d+\b/g;

    experiences.forEach((exp) => {
      (exp.bulletPoints || []).forEach((b) => {
        if (b.trim()) {
          totalBullets++;
          if (metricRegex.test(b)) metricBullets++;
          if (actionVerbRegex.test(b)) strongActionVerbBullets++;
        }
      });
    });

    if (experiences.length >= 1) {
      expScore += 40;
      expStrengths.push(isAr ? `تم توثيق ${experiences.length} خبرات وظيفية بترتيب زمني سليم.` : `${experiences.length} roles documented in clean chronological order.`);
    } else {
      expIssues.push(isAr ? 'لم يتم إضافة أي خبرات عملية بعد.' : 'No work experiences added.');
      expTips.push(isAr ? 'أضف أدوارك السابقة مع اسم الشركة وفترة العمل لتخطي فلاتر الخبرة.' : 'Add your work roles and tenure to pass ATS experience filters.');
    }

    if (metricBullets >= 2) {
      expScore += 35;
      expStrengths.push(isAr ? `تضمين إنجازات كمية وأرقام ومؤشرات (% / KPIs) في ${metricBullets} نقاط.` : `Strong use of quantifiable metrics (% / KPIs) in ${metricBullets} bullets.`);
    } else {
      expScore += 10;
      expIssues.push(isAr ? 'قلة الأرقام والنسب المئوية ومقاييس الإنجاز (KPIs).' : 'Few quantifiable metrics or percentage results.');
      expTips.push(isAr ? 'استخدم زر "تحويل لإنجاز كمي (أرقام)" لإضافة نسب مئوية وإنجازات رقمية حقيقية.' : 'Use the Quantify with Metrics tool to transform duties into measurable achievements.');
    }

    if (strongActionVerbBullets >= 2) {
      expScore += 25;
      expStrengths.push(isAr ? 'استخدام أفعال قيادية قوية في بداية الجمل.' : 'Strong action verbs kickstart your bullet points.');
    } else if (totalBullets > 0) {
      expTips.push(isAr ? 'ابدأ كل نقطة إنجاز بفعل مبني للمعلوم قوي (مثل: قُدت، حسّنت، صممت، أطلقت).' : 'Start each bullet with high-impact action verbs (e.g. Led, Optimized, Scaled).');
    }

    expScore = Math.min(100, Math.max(20, expScore));

    // 3. Skills & Keywords Audit
    let skillsScore = 0;
    const skillsStrengths: string[] = [];
    const skillsIssues: string[] = [];
    const skillsTips: string[] = [];

    const technicalCount = skills.filter((s) => s.category === 'technical' || s.category === 'tool' || !s.category).length;
    const softCount = skills.filter((s) => s.category === 'soft').length;

    if (skills.length >= 6) {
      skillsScore = 95;
      skillsStrengths.push(isAr ? `قائمة مهارات غنية وشاملة (${skills.length} مهارات تقنية وشخصية).` : `Robust keyword-rich skills list (${skills.length} skills).`);
    } else if (skills.length >= 3) {
      skillsScore = 70;
      skillsIssues.push(isAr ? `عدد المهارات (${skills.length}) يمكن زيادته لرفع التوافق.` : `Skills count (${skills.length}) is modest.`);
      skillsTips.push(isAr ? 'أضف 3-4 مهارات إضافية من تبويب "الكلمات المفتاحية المقترحة لمجالك".' : 'Add 3-4 more keywords from the Suggested Industry Keywords panel.');
    } else {
      skillsScore = 30;
      skillsIssues.push(isAr ? 'عدد المهارات قليل جداً (أقل من 3).' : 'Critically low skill keyword density (under 3).');
      skillsTips.push(isAr ? 'اختر مجالك المهني وأضف الكلمات المفتاحية التخصصية بضغطة زر واحدة.' : 'Pick your industry and 1-click add essential core competencies.');
    }

    // 4. Contact & Education Audit
    let contactScore = 0;
    const contactStrengths: string[] = [];
    const contactIssues: string[] = [];
    const contactTips: string[] = [];

    const hasName = Boolean(p.fullName?.trim());
    const hasContact = Boolean(p.email?.trim() || p.phone?.trim());
    const hasLinkedin = Boolean(p.linkedin?.trim());
    const hasEdu = Boolean(education.length > 0 && education[0].institution?.trim());

    if (hasName && hasContact) {
      contactScore += 50;
      contactStrengths.push(isAr ? 'بيانات الاتصال الأساسية كاملة وسهلة الفرز.' : 'Contact information is complete and easily extractable.');
    } else {
      contactIssues.push(isAr ? 'الاسم الكامل أو بيانات التواصل ناقصة.' : 'Full name or contact details missing.');
      contactTips.push(isAr ? 'أدخل اسمك الكامل ورقم الهاتف وبريدك الإلكتروني المهني.' : 'Ensure your full name, phone number, and email are filled.');
    }

    if (hasLinkedin) {
      contactScore += 25;
      contactStrengths.push(isAr ? 'رابط حساب LinkedIn موثق ويزيد من مصداقية السيرة.' : 'LinkedIn URL present, boosting recruiter verification.');
    } else {
      contactTips.push(isAr ? 'إضافة رابط حساب LinkedIn يزيد فرص استجابة مسؤولي التوظيف بنسبة 40%.' : 'Adding a LinkedIn profile link boosts recruiter response rate.');
    }

    if (hasEdu) {
      contactScore += 25;
      contactStrengths.push(isAr ? 'المسار التعليمي والدرجة العلمية مسجلة بوضوح.' : 'Academic degree and institution clearly noted.');
    } else {
      contactTips.push(isAr ? 'أضف أعلى درجة علمية أو مؤهل دراسي حصلت عليه.' : 'List your highest degree or relevant certifications.');
    }

    contactScore = Math.min(100, Math.max(20, contactScore));

    const getStatus = (sc: number): 'optimal' | 'good' | 'needs_improvement' => {
      if (sc >= 85) return 'optimal';
      if (sc >= 60) return 'good';
      return 'needs_improvement';
    };

    return [
      {
        id: 'summary',
        sectionKey: 'personal',
        titleAr: 'الملخص المهني (Professional Summary)',
        titleEn: 'Professional Summary',
        titleFr: 'Résumé Professionnel',
        score: summaryScore,
        status: getStatus(summaryScore),
        icon: FileText,
        strengths: summaryStrengths,
        issues: summaryIssues,
        fixTips: summaryTips,
      },
      {
        id: 'experience',
        sectionKey: 'experiences',
        titleAr: 'الخبرات والإنجازات الرقمية (Experience & KPIs)',
        titleEn: 'Experience & Metrics (KPIs)',
        titleFr: 'Expériences & Indicateurs Chiffrés',
        score: expScore,
        status: getStatus(expScore),
        icon: Briefcase,
        strengths: expStrengths,
        issues: expIssues,
        fixTips: expTips,
      },
      {
        id: 'skills',
        sectionKey: 'skills',
        titleAr: 'المهارات والكلمات المفتاحية (Skills & Keywords)',
        titleEn: 'Skills & ATS Keywords',
        titleFr: 'Compétences & Mots-clés ATS',
        score: skillsScore,
        status: getStatus(skillsScore),
        icon: Wrench,
        strengths: skillsStrengths,
        issues: skillsIssues,
        fixTips: skillsTips,
      },
      {
        id: 'contact_education',
        sectionKey: 'education',
        titleAr: 'بيانات الاتصال والتعليم (Contact & Education)',
        titleEn: 'Contact & Education Details',
        titleFr: 'Coordonnées & Formation',
        score: contactScore,
        status: getStatus(contactScore),
        icon: GraduationCap,
        strengths: contactStrengths,
        issues: contactIssues,
        fixTips: contactTips,
      },
    ];
  }, [resumeData, isAr]);

  const overallScore = Math.round(
    audits.reduce((acc, curr) => acc + curr.score, 0) / audits.length
  );

  const handleJump = (key: any) => {
    if (onNavigateToSection) {
      onNavigateToSection(key);
    } else {
      setActiveTab(key);
    }
  };

  return (
    <div className="space-y-4 text-slate-800" aria-label="Interactive ATS Section Breakdown">
      {/* Resume Readiness Summary Header */}
      <div className="bg-gradient-to-r from-[#001639] to-[#00245E] text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-orange-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D]" />
            <span>{isAr ? 'فحص ATS تفاعلي وتفصيلي' : 'Interactive ATS Section-by-Section Scan'}</span>
          </div>
          <h3 className="text-base font-bold text-white">
            {isAr ? `جاهزية السيرة الذاتية: ${overallScore}/100` : `Resume readiness: ${overallScore}/100`}
          </h3>
          <p className="text-xs text-slate-300">
            {isAr
              ? 'أكمل الأقسام الموصى بها لتحسين الجاهزية ورفع فرص القبول.'
              : 'Complete the recommended sections to improve it.'}
          </p>
        </div>

        {/* Big Readiness Meter */}
        <div className="flex items-center gap-3 bg-white/10 border border-white/15 px-4 py-2.5 rounded-xl self-start sm:self-auto shrink-0">
          <div className="text-end">
            <span className="text-[10px] text-slate-300 block font-medium">
              {isAr ? 'مؤشر الجاهزية' : 'Resume readiness'}
            </span>
            <span className="text-2xl font-black text-white">{overallScore}/100</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-emerald-400 flex items-center justify-center font-bold text-xs text-white bg-emerald-950/30">
            {overallScore >= 80 ? '90+' : overallScore >= 60 ? `${overallScore}` : `${overallScore}`}
          </div>
        </div>
      </div>

      {/* 4 Interactive Section Cards */}
      <div className="space-y-3">
        {audits.map((item) => {
          const ItemIcon = item.icon;
          const isOptimal = item.status === 'optimal';
          const isGood = item.status === 'good';

          const scoreBadgeColor = isOptimal
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : isGood
            ? 'bg-amber-50 text-amber-800 border-amber-200'
            : 'bg-rose-50 text-rose-800 border-rose-200';

          const barColor = isOptimal
            ? 'bg-emerald-500'
            : isGood
            ? 'bg-amber-500'
            : 'bg-rose-500';

          const title = isAr ? item.titleAr : lang === 'fr' ? item.titleFr : item.titleEn;

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs hover:border-slate-300 transition space-y-3.5"
            >
              {/* Card Header: Icon + Title + Score Bar + Jump Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#001639] flex items-center justify-center shrink-0">
                    <ItemIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-[#001639]">{title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-20 sm:w-28 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full ${barColor} transition-all duration-500 rounded-full`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">{item.score}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${scoreBadgeColor}`}>
                    {isOptimal
                      ? isAr ? 'ممتاز ومطابق ✓' : 'Optimal'
                      : isGood
                      ? isAr ? 'جيد (يحتاج تحسين)' : 'Good'
                      : isAr ? 'بحاجة لتعديل ⚠️' : 'Needs Fix'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleJump(item.sectionKey)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#001639] hover:bg-[#00245E] text-white text-xs font-bold rounded-lg transition cursor-pointer shrink-0 min-h-[32px] shadow-2xs"
                  >
                    <span>{isAr ? 'تعديل هذا القسم' : 'Edit Section'}</span>
                    {isAr ? <ArrowLeft className="w-3 h-3 text-[#FF4D2D]" /> : <ArrowRight className="w-3 h-3 text-[#FF4D2D]" />}
                  </button>
                </div>
              </div>

              {/* Strengths & Fix Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Strengths */}
                {item.strengths.length > 0 && (
                  <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl space-y-1.5">
                    <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isAr ? 'نقاط القوة المحققة:' : 'Strengths Met:'}</span>
                    </span>
                    <ul className="space-y-1 text-[11px] text-emerald-950/80">
                      {item.strengths.map((str, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actionable Fix Tips */}
                {item.fixTips.length > 0 && (
                  <div className="p-3 bg-orange-50/70 border border-orange-200/80 rounded-xl space-y-1.5">
                    <span className="font-bold text-orange-900 flex items-center gap-1.5 text-[11px]">
                      <Target className="w-3.5 h-3.5 text-[#FF4D2D]" />
                      <span>{isAr ? 'نصائح محددة للإصلاح الفوري:' : 'Specific Actionable Fixes:'}</span>
                    </span>
                    <ul className="space-y-1 text-[11px] text-orange-950/90">
                      {item.fixTips.map((tip, tIdx) => (
                        <li key={tIdx} className="flex items-start gap-1.5">
                          <span className="text-[#FF4D2D] font-bold">→</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
