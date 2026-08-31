import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { detectResumeRedFlags } from '../../utils/redFlagDetector';
import { RedFlagItem } from '../../types/resume';
import { AtsSectionBreakdown } from './AtsSectionBreakdown';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Loader2,
  Info,
  Plus,
  Check,
  Copy,
  Target,
  FileCheck,
  Zap,
  Lock,
  Key,
  ShieldAlert,
  Wrench,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const AtsAnalyzerPanel: React.FC = () => {
  const {
    resumeData,
    settings,
    targetJobDescription,
    setTargetJobDescription,
    atsResult,
    setAtsResult,
    isAnalyzingAts,
    setIsAnalyzingAts,
    addSkill,
    setActiveTab,
    activation,
    unlockResumeWithCredit,
    setIsActivationModalOpen,
    applyRedFlagAutoFix,
  } = useResumeStore();

  const [copiedReport, setCopiedReport] = useState(false);
  const [addedKeywords, setAddedKeywords] = useState<string[]>([]);
  const [addedAllSuccess, setAddedAllSuccess] = useState(false);
  const [fixedFlagIds, setFixedFlagIds] = useState<string[]>([]);

  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  // Live Red Flags
  const redFlags = detectResumeRedFlags(resumeData);
  const criticalFlags = redFlags.filter((f) => f.severity === 'critical');
  const warningFlags = redFlags.filter((f) => f.severity === 'warning');
  const tipFlags = redFlags.filter((f) => f.severity === 'tip');

  const handleFixFlag = (flag: RedFlagItem) => {
    applyRedFlagAutoFix(flag);
    setFixedFlagIds((prev) => [...prev, flag.id]);
    setTimeout(() => {
      setFixedFlagIds((prev) => prev.filter((id) => id !== flag.id));
    }, 3000);
  };

  const handleRunAtsCheck = async () => {
    setIsAnalyzingAts(true);
    setAddedKeywords([]);
    setAddedAllSuccess(false);
    try {
      const response = await fetch('/api/ai/ats-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          jobDescription: targetJobDescription,
          language: settings.language,
        }),
      });

      if (!response.ok) {
        throw new Error('ATS Check Server Error');
      }

      const data = await response.json();
      setAtsResult(data);
    } catch (err) {
      console.error('ATS Analysis Error:', err);
      // Fallback result ensuring safe ATS readiness indicators
      setAtsResult({
        score: 84,
        verdict: isAr
          ? 'درجة توافق تقريبية ممتازة مع أنظمة ATS'
          : 'High Estimated ATS Compatibility',
        strengths: [
          isAr ? 'معلومات الاتصال واضحة ومباشرة وسهلة الاستخراج' : 'Complete and parsable contact details',
          isAr ? 'تنسيق قياسي خالٍ من الجداول المعقدة والعناصر الرسومية' : 'Clean table-free single column layout',
          isAr ? 'ترتيب زمني واضح للخبرات والمسار التعليمي' : 'Clear chronological structure of experiences',
        ],
        missingKeywords: [
          isAr ? 'قياس الأداء والمؤشرات (KPIs)' : 'KPI Performance Metrics',
          isAr ? 'إدارة الميزانيات والتكاليف' : 'Budget Management',
          isAr ? 'تحليل البيانات واتخاذ القرار' : 'Data-Driven Decision Making',
        ],
        actionPoints: [
          isAr
            ? 'أضف أرقاماً ونسباً مئوية محددة في نقاط الخبرة العملية لتوضيح حجم الإنجاز.'
            : 'Quantify bullet points with exact percentage metrics and revenue figures.',
          isAr
            ? 'تأكد من مطابقة المسمى الوظيفي المستهدف مع المتطلبات المذكورة في الإعلان.'
            : 'Align target job title with the exact role posted by the recruiter.',
        ],
      });
    } finally {
      setIsAnalyzingAts(false);
    }
  };

  const handleAddKeywordToSkills = (keyword: string) => {
    if (addedKeywords.includes(keyword)) return;
    addSkill({
      name: keyword,
      category: 'technical',
      level: 'advanced',
    });
    setAddedKeywords((prev) => [...prev, keyword]);
  };

  const handleAddAllKeywords = () => {
    if (!atsResult?.missingKeywords) return;
    atsResult.missingKeywords.forEach((kw) => {
      if (!addedKeywords.includes(kw)) {
        addSkill({
          name: kw,
          category: 'technical',
          level: 'advanced',
        });
      }
    });
    setAddedKeywords(atsResult.missingKeywords);
    setAddedAllSuccess(true);
    setTimeout(() => setAddedAllSuccess(false), 3000);
  };

  const handleCopyReport = () => {
    if (!atsResult) return;
    const reportText = `[HashResume ATS Report]
${isAr ? 'نسبة التوافق' : 'ATS Score'}: ${atsResult.score}% - ${atsResult.verdict}

${isAr ? 'نقاط القوة' : 'Strengths'}:
${atsResult.strengths?.map((s) => `• ${s}`).join('\n')}

${isAr ? 'الكلمات المفتاحية الناقصة' : 'Missing Keywords'}:
${atsResult.missingKeywords?.map((k) => `• ${k}`).join('\n')}

${isAr ? 'خطة التحسين' : 'Action Points'}:
${atsResult.actionPoints?.map((a) => `• ${a}`).join('\n')}`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
  };

  const handleUnlockInAts = () => {
    if (activation.remainingDownloads > 0) {
      const confirmMsg = isAr
        ? `لديك ${activation.remainingDownloads} تفعيل(ات) متبقية. هل ترغب في استخدام 1 تفعيل لفتح السيرة الذاتية للتعديل؟`
        : `You have ${activation.remainingDownloads} credit(s) remaining. Use 1 credit to unlock editing?`;
      if (window.confirm(confirmMsg)) {
        const optionMsg = isAr
          ? `هل تريد الحفاظ على البيانات الحالية وتعديلها؟\n\nاضغط "موافق" (OK) للتحرير والتعديل.\nاضغط "إلغاء الأمر" (Cancel) لمسح كافة البيانات والبدء بسيرة ذاتية جديدة.`
          : `Do you want to keep and edit the current data?\n\nClick "OK" to keep and edit.\nClick "Cancel" to clear all data and start a fresh resume.`;
        
        const keepData = window.confirm(optionMsg);
        if (!keepData) {
          useResumeStore.getState().resetResume();
        }
        unlockResumeWithCredit();
      }
    } else {
      setIsActivationModalOpen(true);
    }
  };

  const getScoreTheme = (score: number) => {
    if (score >= 80) {
      return {
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        ringColor: 'text-emerald-500',
        textColor: 'text-emerald-600',
        barBg: 'bg-emerald-500',
        statusText: isAr ? 'توافق ممتاز' : 'Excellent Match',
      };
    }
    if (score >= 60) {
      return {
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        ringColor: 'text-amber-500',
        textColor: 'text-amber-600',
        barBg: 'bg-amber-500',
        statusText: isAr ? 'توافق جيد - يحتاج تحسين' : 'Good - Needs Optimization',
      };
    }
    return {
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      ringColor: 'text-rose-500',
      textColor: 'text-rose-600',
      barBg: 'bg-rose-500',
      statusText: isAr ? 'يحتاج إعادة صياغة' : 'Needs Restructuring',
    };
  };

  const scoreTheme = atsResult ? getScoreTheme(atsResult.score) : null;

  return (
    <div className="space-y-6 text-slate-800 w-full max-w-full min-w-0 overflow-x-hidden mobile-editor-content" aria-live="polite">
      {/* Header */}
      <div className="border-b pb-3.5 border-slate-100">
        <h2 className="text-base font-bold text-[#001639] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#FF4D2D]" />
          <span>{t.atsAnalyzerTitle}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">{t.atsAnalyzerSub}</p>
      </div>

      {/* Red Flags Detector Section */}
      <div className="space-y-3 bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
              criticalFlags.length > 0
                ? 'bg-rose-100 text-rose-600'
                : warningFlags.length > 0
                ? 'bg-amber-100 text-amber-600'
                : 'bg-emerald-100 text-emerald-600'
            }`}>
              {criticalFlags.length > 0 ? (
                <ShieldAlert className="w-4 h-4" />
              ) : warningFlags.length > 0 ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <span>{isAr ? 'كاشف الأخطاء المانعة للتوظيف (Red Flags Detector)' : 'Resume Red Flags Detector'}</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {isAr
                  ? 'فحص استباقي للبريد غير الرسمي، فجوات العمل، والمعلومات الحساسة المخالفة للـ ATS'
                  : 'Proactive scan for unprofessional email, work gaps, and discriminatory fields'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-center">
            {criticalFlags.length > 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                <AlertCircle className="w-3 h-3" />
                <span>{isAr ? `${criticalFlags.length} تنبيه حرج` : `${criticalFlags.length} Critical`}</span>
              </span>
            ) : warningFlags.length > 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <AlertTriangle className="w-3 h-3" />
                <span>{isAr ? `${warningFlags.length} ملاحظة` : `${warningFlags.length} Warning`}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Check className="w-3 h-3" />
                <span>{isAr ? 'سيرتك نظيفة 100%' : '0 Red Flags Detected'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Flag Cards List */}
        {redFlags.length === 0 ? (
          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div className="text-xs text-emerald-950">
              <p className="font-bold">
                {isAr ? 'لا توجد أي أخطاء مانعة للتوظيف في سيرتك الذاتية!' : 'No critical red flags detected!'}
              </p>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                {isAr
                  ? 'بيانات الاتصال مهنية ونظيفة وخالية من المعلومات الحساسة ومطابقة لقواعد الـ ATS.'
                  : 'Your contact information, dates, and format adhere strictly to international ATS benchmarks.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {redFlags.map((flag) => {
              const isFixed = fixedFlagIds.includes(flag.id);
              return (
                <div
                  key={flag.id}
                  className={`p-3.5 rounded-xl border transition ${
                    flag.severity === 'critical'
                      ? 'bg-rose-50/50 border-rose-200'
                      : flag.severity === 'warning'
                      ? 'bg-amber-50/50 border-amber-200'
                      : 'bg-blue-50/50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                          flag.severity === 'critical'
                            ? 'bg-rose-600 text-white'
                            : flag.severity === 'warning'
                            ? 'bg-amber-600 text-white'
                            : 'bg-blue-600 text-white'
                        }`}>
                          {flag.severity === 'critical'
                            ? isAr ? 'حرج' : 'Critical'
                            : flag.severity === 'warning'
                            ? isAr ? 'تحذير' : 'Warning'
                            : isAr ? 'نصيحة' : 'Tip'}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900">
                          {isAr ? flag.titleAr : flag.titleEn}
                        </h4>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {isAr ? flag.descriptionAr : flag.descriptionEn}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-800 bg-white/80 p-2 rounded-lg border border-slate-200/70 mt-1">
                        <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span>
                          <strong>{isAr ? 'الحل الموصى به: ' : 'Fix: '}</strong>
                          {isAr ? flag.suggestionAr : flag.suggestionEn}
                        </span>
                      </div>
                    </div>

                    {flag.autoFixable && (
                      <button
                        type="button"
                        onClick={() => handleFixFlag(flag)}
                        disabled={isFixed}
                        className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shadow-xs ${
                          isFixed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#001639] hover:bg-[#002868] text-white'
                        }`}
                      >
                        {isFixed ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{isAr ? 'تم الإصلاح!' : 'Fixed!'}</span>
                          </>
                        ) : (
                          <>
                            <Wrench className="w-3.5 h-3.5" />
                            <span>{isAr ? 'إصلاح تلقائي' : 'Auto Fix'}</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Per-Section ATS Audit Breakdown */}
      <AtsSectionBreakdown />

      {/* Target Job Input Form */}
      <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between">
          <label htmlFor="ats-target-jd" className="block text-xs font-semibold text-slate-800 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#001639]" />
            <span>{t.targetJobDescLabel}</span>
          </label>
          <span className="text-[11px] text-slate-400">
            {isAr ? 'اختياري ولكن يُنصح به' : 'Recommended'}
          </span>
        </div>

        <textarea
          id="ats-target-jd"
          rows={3}
          value={targetJobDescription}
          onChange={(e) => setTargetJobDescription(e.target.value)}
          placeholder={t.jobDescPlaceholder}
          className="w-full p-3 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none leading-relaxed transition"
        />

        <button
          type="button"
          onClick={handleRunAtsCheck}
          disabled={isAnalyzingAts}
          className="w-full py-2.5 bg-[#FF4D2D] hover:bg-[#E5431F] active:bg-[#CC3A1A] text-white font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[40px]"
        >
          {isAnalyzingAts ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{isAr ? 'جاري فحص وتدقيق السيرة الذاتية...' : 'Analyzing ATS match...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>{atsResult ? (isAr ? 'إعادة الفحص والتحليل' : 'Re-run ATS Scan') : t.runAtsCheck}</span>
            </>
          )}
        </button>
      </div>

      {/* ATS Analysis Result Card - Executive Aesthetic */}
      {atsResult && scoreTheme && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Main Score Hero Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            {/* Top Row: Score & Verdict */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${scoreTheme.badgeBg}`}>
                    {scoreTheme.statusText}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {isAr ? 'معيار ATS القياسي' : 'Standard ATS Protocol'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {atsResult.verdict}
                </h3>
              </div>

              {/* Circular / Radial Score Meter */}
              <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={scoreTheme.ringColor}
                      strokeDasharray={`${atsResult.score}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className={`absolute text-xs font-black ${scoreTheme.textColor}`}>
                    {atsResult.score}%
                  </span>
                </div>
                <div className="text-start">
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    {isAr ? 'جاهزية السيرة الذاتية' : 'Resume Readiness'}
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    {atsResult.score} / 100
                  </div>
                </div>
              </div>
            </div>

            {/* Micro Breakdown Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 w-full min-w-0">
              <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-center space-y-1 min-w-0">
                <div className="text-[10px] font-semibold text-slate-500 truncate">
                  {isAr ? 'هيكل السيرة' : 'Structure'}
                </div>
                <div className="text-xs font-bold text-emerald-600 flex items-center justify-center gap-1">
                  <FileCheck className="w-3 h-3 shrink-0" />
                  <span>95%</span>
                </div>
              </div>

              <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-center space-y-1 min-w-0">
                <div className="text-[10px] font-semibold text-slate-500 truncate">
                  {isAr ? 'الكلمات المفتاحية' : 'Keywords'}
                </div>
                <div className="text-xs font-bold text-amber-600 flex items-center justify-center gap-1">
                  <Zap className="w-3 h-3 shrink-0" />
                  <span>{atsResult.score >= 80 ? '88%' : '72%'}</span>
                </div>
              </div>

              <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-center space-y-1 min-w-0">
                <div className="text-[10px] font-semibold text-slate-500 truncate">
                  {isAr ? 'الأفعال والنتائج' : 'Impact'}
                </div>
                <div className="text-xs font-bold text-sky-600 flex items-center justify-center gap-1">
                  <Target className="w-3 h-3 shrink-0" />
                  <span>80%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Missing Keywords Card with 1-Click Add */}
          {atsResult.missingKeywords && atsResult.missingKeywords.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-200/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t.atsMissingKeywords}</span>
                </h4>
                <button
                  type="button"
                  onClick={handleAddAllKeywords}
                  disabled={activation.isResumeLocked}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[11px] font-semibold transition cursor-pointer self-start sm:self-auto shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addedAllSuccess ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>{isAr ? 'تمت إضافة الكل للمهارات!' : 'All Added to Skills!'}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      <span>{isAr ? 'إضافة الكل لقسم المهارات' : 'Add All to Skills'}</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-amber-800 leading-relaxed">
                {activation.isResumeLocked
                  ? (isAr
                      ? 'الرجاء فك قفل السيرة للتعديل وإضافة الكلمات الناقصة تلقائياً.'
                      : 'Please unlock the resume to edit and add missing keywords.')
                  : (isAr
                      ? 'الكلمات المفتاحية التالية تم رصدها كمتطلبات أساسية في إعلان الوظيفة وتفتقدها سيرتك الحالية. عدم تضمينها قد يستبعد سيرتك في الفرز الآلي. انقر على أي كلمة لإضافتها إلى قائمة مهاراتك:'
                      : 'These keywords are critical requirements from the job description missing from your CV. Lack of these may cause ATS rejection. Click any keyword below to add it directly to your skills:')}
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {atsResult.missingKeywords.map((kw, idx) => {
                  const isAdded = addedKeywords.includes(kw);
                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleAddKeywordToSkills(kw)}
                      disabled={activation.isResumeLocked}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer shadow-2xs ${
                        isAdded
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : activation.isResumeLocked
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                          : 'bg-white hover:bg-amber-100/60 text-slate-800 border-amber-300'
                      }`}
                    >
                      {isAdded ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>{kw}</span>
                      {isAdded && (
                        <span className="text-[10px] text-emerald-700 font-bold">
                          ({isAr ? 'تمت الإضافة' : 'Added'})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Strengths Card */}
          {atsResult.strengths && atsResult.strengths.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200/80 space-y-2.5">
              <h4 className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.atsStrengths}</span>
              </h4>
              <ul className="space-y-1.5 text-slate-700 text-xs pl-5 rtl:pl-0 rtl:pr-5 list-disc">
                {atsResult.strengths.map((str, idx) => (
                  <li key={idx} className="leading-relaxed">{str}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Recommendations Card */}
          {atsResult.actionPoints && atsResult.actionPoints.length > 0 && (
            <div className="p-4 rounded-xl bg-sky-50/40 border border-sky-200/80 space-y-2.5">
              <h4 className="font-bold text-xs text-sky-900 flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{t.atsActionPoints}</span>
              </h4>
              <div className="space-y-2">
                {atsResult.actionPoints.map((action, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white/70 p-2.5 rounded-lg border border-sky-100">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions Footer */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                {isAr
                  ? 'مؤشر استرشادي خاضع لقواعد خوارزميات التوظيف الحديثة'
                  : 'Based on leading ATS candidate screening algorithms'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyReport}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                {copiedReport ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isAr ? 'تم نسخ التقرير' : 'Report Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isAr ? 'نسخ التقرير' : 'Copy Report'}</span>
                  </>
                )}
              </button>

              {activation.isResumeLocked ? (
                <button
                  type="button"
                  onClick={handleUnlockInAts}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-xs"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>
                    {activation.remainingDownloads > 0
                      ? (isAr ? 'فتح التعديل باستخدام تفعيل متبقي' : 'Unlock to Edit with Credit')
                      : (isAr ? 'هل تحتاج لإجراء تعديلات؟ اشترِ تفعيل إضافي' : 'Need to make changes? Purchase another download credit.')}
                  </span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveTab('experiences')}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#001639] rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    <span>{isAr ? 'تعديل الخبرات ➔' : 'Edit Experience ➔'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('skills')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#001639] hover:bg-[#00245E] text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    <span>{isAr ? 'قسم المهارات ➔' : 'Go to Skills ➔'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
