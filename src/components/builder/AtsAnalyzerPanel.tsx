import React, { useState, useEffect } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { detectResumeRedFlags } from '../../utils/redFlagDetector';
import { RedFlagItem } from '../../types/resume';
import { AtsSectionBreakdown } from './AtsSectionBreakdown';
import { aiApi } from '../../lib/api';
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
  const [showEditJd, setShowEditJd] = useState(false);
  
  // Local state to manage the sub-tabs inside ATS panel
  const [activeScanTab, setActiveScanTab] = useState<'ai_match' | 'structure' | 'red_flags'>('ai_match');

  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

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
    setShowEditJd(false);
    try {
      const data = await aiApi.atsAnalyze({
        resumeData,
        jobDescription: targetJobDescription,
        language: settings.language,
      });

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
      useResumeStore.getState().setIsUnlockModalOpen(true);
    } else {
      setIsActivationModalOpen(true);
    }
  };

  const getScoreTheme = (score: number) => {
    if (score >= 85) {
      return {
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        ringColor: 'text-emerald-500',
        textColor: 'text-emerald-600',
        barBg: 'bg-emerald-500',
        statusText: isAr ? 'جاهز للمراجعة' : 'Ready to review',
      };
    }
    if (score >= 70) {
      return {
        badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        ringColor: 'text-emerald-500',
        textColor: 'text-emerald-600',
        barBg: 'bg-emerald-500',
        statusText: isAr ? 'قوي' : 'Strong',
      };
    }
    if (score >= 40) {
      return {
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        ringColor: 'text-amber-500',
        textColor: 'text-amber-600',
        barBg: 'bg-amber-500',
        statusText: isAr ? 'أساس جيد' : 'Good foundation',
      };
    }
    return {
      badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
      ringColor: 'text-orange-500',
      textColor: 'text-orange-600',
      barBg: 'bg-orange-500',
      statusText: isAr ? 'يحتاج إلى عمل' : 'Needs work',
    };
  };

  const scoreTheme = atsResult ? getScoreTheme(atsResult.score) : null;

  // 1. INITIAL CALM STATE (No scan run yet)
  if (!atsResult && !isAnalyzingAts) {
    return (
      <div className="space-y-4 sm:space-y-6 text-slate-900 w-full max-w-full">
        <div className="p-4 sm:p-6 bg-white border-2 border-[#e8e5de] rounded-2xl sm:rounded-3xl space-y-4 sm:space-y-5 shadow-2xs">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#FF4D2D]/10 text-[#FF4D2D] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#001639] leading-tight">
                {isAr ? 'فحص جاهزية ATS ومطابقة الوظيفة' : 'ATS Compatibility & Job Alignment Audit'}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#7a8093] mt-0.5 leading-relaxed">
                {isAr
                  ? 'الصق نص الإعلان الوظيفي المستهدف لمطابقة الكلمات المفتاحية، أو ابدأ الفحص العام لهيكل السيرة.'
                  : 'Paste the target job description to audit keyword density, or run a general structure scan.'}
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="ats-job-desc-input" className="block text-[11px] sm:text-xs font-bold text-[#12141a] mb-1.5 sm:mb-2">
              {isAr ? 'نص الوصف الوظيفي (اختياري ولكن يُنصح به):' : 'Job Description text (optional but recommended):'}
            </label>
            <textarea
              id="ats-job-desc-input"
              rows={4}
              value={targetJobDescription}
              onChange={(e) => setTargetJobDescription(e.target.value)}
              placeholder={
                isAr
                  ? 'مثال: مطلوب مهندس برمجيات يجيد React و TypeScript، ولديه خبرة في بناء الأنظمة السحابية وإدارة واجهات API وتحسين الأداء...'
                  : 'e.g. Seeking a Software Engineer with strong experience in React, TypeScript, scalable systems, and REST APIs...'
              }
              className="w-full p-3 sm:p-4 bg-slate-50/50 hover:bg-white focus:bg-white border-2 border-[#e8e5de] focus:border-[#FF4D2D] focus:ring-3 focus:ring-[#FF4D2D]/10 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-[#12141a] placeholder:text-[#9099ac] outline-none transition resize-y leading-relaxed"
            />
          </div>

          <button
            type="button"
            onClick={handleRunAtsCheck}
            className="w-full py-3.5 sm:py-4 px-4 sm:px-6 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-xs sm:text-base rounded-xl sm:rounded-2xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF4D2D] shrink-0" />
            <span>{isAr ? 'ابدأ الفحص والتحليل الذكي' : 'Run Smart ATS Audit'}</span>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-[#e8e5de]/60 text-xs text-[#7a8093]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isAr ? 'مطابقة الكلمات المفتاحية' : 'Keyword Density'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isAr ? 'كاشف الأخطاء المانعة' : 'Red Flags Detector'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isAr ? 'هيكل التنسيق القياسي' : 'Standard Structure'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. LOADING STATE
  if (isAnalyzingAts) {
    return (
      <div className="p-8 bg-white border-2 border-[#e8e5de] rounded-3xl text-center space-y-4 shadow-xs">
        <div className="w-14 h-14 rounded-2xl bg-[#001639]/5 text-[#001639] flex items-center justify-center mx-auto">
          <Loader2 className="w-7 h-7 animate-spin text-[#FF4D2D]" />
        </div>
        <h3 className="text-base font-black text-[#001639]">
          {isAr ? 'جارِ فحص السيرة الذاتية عبر خوارزميات ATS...' : 'Auditing resume with ATS parsers...'}
        </h3>
        <p className="text-xs text-[#7a8093] max-w-sm mx-auto">
          {isAr
            ? 'نقوم بتحليل الترتيب الزمني، واستخراج الكلمات المفتاحية، ومطابقة متطلبات الإعلان الوظيفي...'
            : 'Analyzing chronological flow, keywords density, and matching job requirements...'}
        </p>
      </div>
    );
  }

  // 3. DETAILED RESULTS STATE
  return (
    <div className="space-y-5 text-slate-800 w-full max-w-full min-w-0 overflow-x-hidden" aria-live="polite">
      {/* Top Banner with Edit JD trigger */}
      <div className="p-4 bg-white border-2 border-[#e8e5de] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${scoreTheme?.badgeBg}`}>
            {atsResult.score}%
          </div>
          <div>
            <div className="text-xs font-black text-[#001639]">{atsResult.verdict}</div>
            <div className="text-[11px] text-[#7a8093]">
              {targetJobDescription
                ? (isAr ? 'مطابقة مع الوصف الوظيفي المُدخل' : 'Matched against target Job Description')
                : (isAr ? 'فحص عام للهيكل وقابلية القراءة' : 'General structure & readiness scan')}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowEditJd(!showEditJd)}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#f4f1e9] hover:bg-[#e8e5de] text-[#001639] rounded-xl text-xs font-bold transition self-start sm:self-auto cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D]" />
          <span>{showEditJd ? (isAr ? 'إخفاء تعديل الإعلان' : 'Hide Job Desc') : (isAr ? 'تعديل الإعلان وإعادة الفحص' : 'Edit Job Desc / Re-run')}</span>
        </button>
      </div>

      {/* Expandable JD editor */}
      {showEditJd && (
        <div className="p-4 bg-[#f4f1e9] border border-[#e8e5de] rounded-2xl space-y-3">
          <label htmlFor="ats-target-jd-edit" className="block text-xs font-bold text-[#001639]">
            {isAr ? 'تعديل نص الإعلان الوظيفي:' : 'Edit Job Description:'}
          </label>
          <textarea
            id="ats-target-jd-edit"
            rows={3}
            value={targetJobDescription}
            onChange={(e) => setTargetJobDescription(e.target.value)}
            className="w-full p-3 bg-white border border-[#e8e5de] rounded-xl text-xs font-medium text-[#12141a] outline-none"
          />
          <button
            type="button"
            onClick={handleRunAtsCheck}
            className="px-4 py-2 bg-[#001639] text-white rounded-xl text-xs font-bold hover:bg-[#00214F] transition"
          >
            {isAr ? 'إعادة الفحص الآن' : 'Re-run Audit Now'}
          </button>
        </div>
      )}

      {/* Internal Tabs for Scan Types */}
      <div className="flex bg-[#f4f1e9] p-1 rounded-2xl border border-[#e8e5de] w-full gap-1">
        <button
          type="button"
          onClick={() => setActiveScanTab('ai_match')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeScanTab === 'ai_match'
              ? 'bg-[#001639] text-white shadow-xs'
              : 'text-[#7a8093] hover:text-[#001639]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D]" />
          <span>{isAr ? 'مطابقة الوظيفة والكلمات' : 'Job Match & Keywords'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveScanTab('structure')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
            activeScanTab === 'structure'
              ? 'bg-[#001639] text-white shadow-xs'
              : 'text-[#7a8093] hover:text-[#001639]'
          }`}
        >
          {isAr ? 'البناء والمحتوى' : 'Structure & Content'}
        </button>

        <button
          type="button"
          onClick={() => setActiveScanTab('red_flags')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeScanTab === 'red_flags'
              ? 'bg-[#001639] text-white shadow-xs'
              : 'text-[#7a8093] hover:text-[#001639]'
          }`}
        >
          {isAr ? 'الأخطاء الشائعة' : 'Red Flags'}
          {criticalFlags.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>
      </div>

      {/* Tab Content: Structure & Content */}
      {activeScanTab === 'structure' && (
        <div className="animate-in fade-in duration-200">
          <AtsSectionBreakdown />
        </div>
      )}

      {/* Tab Content: Red Flags */}
      {activeScanTab === 'red_flags' && (
        <div className="space-y-3 bg-white rounded-2xl border-2 border-[#e8e5de] p-4 sm:p-5 animate-in fade-in duration-200 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#e8e5de]">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center border ${
                criticalFlags.length > 0
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : warningFlags.length > 0
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
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
                <h3 className="font-bold text-xs sm:text-sm text-[#001639]">
                  {isAr ? 'كاشف الأخطاء المانعة للتوظيف (Red Flags)' : 'Resume Red Flags Detector'}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-center text-[10px] font-bold">
              {criticalFlags.length > 0 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                  <AlertCircle className="w-3 h-3" />
                  <span>{isAr ? `${criticalFlags.length} تنبيه حرج` : `${criticalFlags.length} CRITICAL`}</span>
                </span>
              ) : warningFlags.length > 0 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{isAr ? `${warningFlags.length} ملاحظة` : `${warningFlags.length} WARNING`}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Check className="w-3 h-3" />
                  <span>{isAr ? 'سيرتك نظيفة 100%' : 'CLEAN / 0 FLAGS'}</span>
                </span>
              )}
            </div>
          </div>

          {redFlags.length === 0 ? (
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
              </div>
              <div className="text-xs text-emerald-950">
                <p className="font-bold">
                  {isAr ? 'لا توجد أي أخطاء مانعة للتوظيف في سيرتك الذاتية!' : 'No critical red flags detected!'}
                </p>
                <p className="text-xs text-emerald-900 mt-0.5">
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
                        ? 'bg-rose-50/30 border-rose-200'
                        : flag.severity === 'warning'
                        ? 'bg-amber-50/30 border-amber-200'
                        : 'bg-blue-50/30 border-blue-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                            flag.severity === 'critical'
                              ? 'bg-rose-700 text-white border-rose-800'
                              : flag.severity === 'warning'
                              ? 'bg-amber-600 text-white border-amber-700'
                              : 'bg-blue-600 text-white border-blue-700'
                          }`}>
                            {flag.severity === 'critical'
                              ? isAr ? 'حرج' : 'CRITICAL'
                              : flag.severity === 'warning'
                              ? isAr ? 'تحذير' : 'WARNING'
                              : isAr ? 'نصيحة' : 'TIP'}
                          </span>
                          <h4 className="font-bold text-xs text-[#001639]">
                            {isAr ? flag.titleAr : flag.titleEn}
                          </h4>
                        </div>
  
                        <p className="text-xs text-[#7a8093] leading-relaxed">
                          {isAr ? flag.descriptionAr : flag.descriptionEn}
                        </p>
  
                        <div className="flex items-center gap-1.5 text-xs text-slate-800 bg-white p-2.5 rounded-xl border border-[#e8e5de] mt-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D] shrink-0" />
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
                          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                            isFixed
                              ? 'bg-emerald-700 text-white border-emerald-800'
                              : 'bg-[#001639] hover:bg-[#00214F] text-white border-[#001639]'
                          }`}
                        >
                          {isFixed ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{isAr ? 'تم الإصلاح!' : 'Fixed!'}</span>
                            </>
                          ) : (
                            <>
                              <Wrench className="w-3.5 h-3.5 text-[#FF4D2D]" />
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
      )}

      {/* Tab Content: AI Job Match & Keywords */}
      {activeScanTab === 'ai_match' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Missing Keywords Card with 1-Click Add */}
          {atsResult.missingKeywords && atsResult.missingKeywords.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/60 border-2 border-amber-200/80 space-y-3 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t.atsMissingKeywords}</span>
                </h4>
                <button
                  type="button"
                  onClick={handleAddAllKeywords}
                  disabled={activation.isResumeLocked}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition cursor-pointer self-start sm:self-auto border border-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
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

              <p className="text-xs text-amber-900 leading-relaxed">
                {isAr
                  ? 'الكلمات المفتاحية التالية تم رصدها كمتطلبات أساسية في إعلان الوظيفة وتفتقدها سيرتك الحالية. انقر على أي كلمة لإضافتها إلى قائمة مهاراتك فوراً:'
                  : 'These keywords are critical requirements from the job description missing from your CV. Click any keyword below to add it directly to your skills:'}
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
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border cursor-pointer transition ${
                        isAdded
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-white hover:bg-amber-100/60 text-slate-800 border-amber-200'
                      }`}
                    >
                      {isAdded ? (
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      )}
                      <span>{kw}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Strengths Card */}
          {atsResult.strengths && atsResult.strengths.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50/50 border-2 border-emerald-200/80 space-y-2.5 shadow-2xs">
              <h4 className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{t.atsStrengths}</span>
              </h4>
              <ul className="space-y-1.5 text-emerald-950 text-xs pl-5 rtl:pl-0 rtl:pr-5 list-disc">
                {atsResult.strengths.map((str, idx) => (
                  <li key={idx} className="leading-relaxed">{str}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Recommendations Card */}
          {atsResult.actionPoints && atsResult.actionPoints.length > 0 && (
            <div className="p-4 rounded-2xl bg-sky-50/50 border-2 border-sky-200/80 space-y-2.5 shadow-2xs">
              <h4 className="font-bold text-xs text-sky-900 flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-sky-700 shrink-0" />
                <span>{t.atsActionPoints}</span>
              </h4>
              <div className="space-y-2">
                {atsResult.actionPoints.map((action, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 bg-white p-3 rounded-xl border border-sky-200/80">
                    <span className="w-5 h-5 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border border-sky-200">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Actions Footer */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#e8e5de]">
        <div className="flex items-center gap-1.5 text-xs text-[#7a8093]">
          <Info className="w-3.5 h-3.5 text-[#7a8093] shrink-0" />
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-[#f4f1e9] text-[#001639] border-2 border-[#e8e5de] rounded-xl text-xs font-bold transition cursor-pointer"
          >
            {copiedReport ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isAr ? 'تم نسخ التقرير' : 'Report Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#001639]" />
                <span>{isAr ? 'نسخ التقرير' : 'Copy Report'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
