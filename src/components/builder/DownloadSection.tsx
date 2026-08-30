import React, { useState, useMemo, useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import {
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Edit3,
  Share2,
  Sparkles,
  Palette,
  FileSearch,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Lock,
  Key,
  FileJson,
  Upload,
  Check,
  AlertTriangle,
  FileText,
  CreditCard,
  Eye,
  Info,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useResumeExport } from '../../hooks/useResumeExport';
import { ShareModal } from '../common/ShareModal';
import { isResumeBlank } from '../../utils/resumeFingerprint';
import { detectResumeRedFlags } from '../../utils/redFlagDetector';
import { validateResumeMinimumRequirements, ResumeValidationResult } from '../../utils/resumeValidation';
import { ResumeValidationModal } from '../common/ResumeValidationModal';

interface IssueItem {
  id: 'personal' | 'experiences' | 'education' | 'skills' | 'projects' | 'certifications';
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  isCritical?: boolean;
}

export const DownloadSection: React.FC = () => {
  const { requestPdfExport } = useResumeExport();
  const {
    resumeData,
    settings,
    activation,
    targetJobDescription,
    atsResult,
    unlockResumeWithCredit,
    resetResume,
    setIsActivationModalOpen,
    setActiveTab,
  } = useResumeStore();

  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const [isExporting, setIsExporting] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showImprovements, setShowImprovements] = useState(false);
  const [emptyWarning, setEmptyWarning] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<ResumeValidationResult | null>(null);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [jsonSuccessMsg, setJsonSuccessMsg] = useState<string | null>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => {
    try {
      const backupPayload = {
        version: 1,
        exportedAt: new Date().toISOString(),
        resumeData,
        settings,
      };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(backupPayload, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      const candidateName = (resumeData.personalInfo.fullName || 'resume')
        .toLowerCase()
        .replace(/\s+/g, '_');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute(
        'download',
        `hash_resume_backup_${candidateName}_${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setJsonSuccessMsg(
        isAr ? 'تم تصدير النسخة الاحتياطية JSON بنجاح!' : 'JSON backup exported successfully!'
      );
      setTimeout(() => setJsonSuccessMsg(null), 4000);
    } catch (err) {
      console.error('Failed to export JSON:', err);
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        const dataToSet = parsed.resumeData || parsed;
        if (dataToSet && (dataToSet.personalInfo || dataToSet.experiences || dataToSet.skills)) {
          useResumeStore.getState().setResumeData(dataToSet);
          if (parsed.settings) {
            useResumeStore.getState().setTemplate(parsed.settings.templateId || 'modern-ats');
          }
          setJsonSuccessMsg(
            isAr ? 'تمت استعادة البيانات بنجاح من ملف JSON!' : 'Resume restored from JSON backup!'
          );
          setTimeout(() => setJsonSuccessMsg(null), 4000);
        } else {
          setEmptyWarning(
            isAr
              ? 'الملف المحدد لا يحتوي على بنية سيرة ذاتية صالحة.'
              : 'The selected file does not match a valid resume structure.'
          );
          setTimeout(() => setEmptyWarning(null), 4000);
        }
      } catch (err) {
        setEmptyWarning(
          isAr
            ? 'تعذر قراءة ملف JSON. تأكد من سلامة الملف.'
            : 'Failed to read JSON file. Please ensure it is valid.'
        );
        setTimeout(() => setEmptyWarning(null), 4000);
      }
    };
    reader.readAsText(file);
    if (jsonFileInputRef.current) jsonFileInputRef.current.value = '';
  };

  // Compute key checklist items, bullet metrics, red flags, and readiness score
  const {
    readinessScore,
    issues,
    sectionsNeedingAttentionCount,
    bulletsWithoutMetricCount,
    hasNoJobDescription,
    allWarnings,
  } = useMemo(() => {
    const foundIssues: IssueItem[] = [];
    const p = resumeData.personalInfo;
    let score = 100;

    // 1. Name & Contact
    if (!p.fullName?.trim()) {
      foundIssues.push({
        id: 'personal',
        titleAr: 'الاسم الكامل مفقود',
        titleEn: 'Full name missing',
        descAr: 'أدخل اسمك الكامل لظهوره في أعلى السيرة.',
        descEn: 'Add your full name for the resume header.',
        isCritical: true,
      });
      score -= 25;
    } else if (!p.email?.trim() && !p.phone?.trim()) {
      foundIssues.push({
        id: 'personal',
        titleAr: 'بيانات التواصل غير مكتملة',
        titleEn: 'Contact info incomplete',
        descAr: 'يُفضل إضافة بريد إلكتروني أو رقم هاتف مباشر.',
        descEn: 'Add an email or phone for employers to reach you.',
        isCritical: false,
      });
      score -= 10;
    }

    // 2. Summary
    if (!p.summary?.trim() || p.summary.trim().length < 25) {
      foundIssues.push({
        id: 'personal',
        titleAr: 'الملخص المهني قصير أو فارغ',
        titleEn: 'Summary too short or empty',
        descAr: 'أضف سطرين أو ثلاثة تلخص خبرتك وهدفك الوظيفي.',
        descEn: 'Add 2-3 lines summarizing your strengths.',
        isCritical: false,
      });
      score -= 10;
    }

    // 3. Experience
    const expCount = resumeData.experiences?.length || 0;
    if (expCount === 0) {
      foundIssues.push({
        id: 'experiences',
        titleAr: 'لم تتم إضافة خبرات عملية',
        titleEn: 'No work experience added',
        descAr: 'إذا كنت تمتلك خبرة سابقة، قم بإضافتها لرفع فرص القبول.',
        descEn: 'Add previous roles if applicable to boost ATS match.',
        isCritical: false,
      });
      score -= 15;
    }

    // 4. Education
    const eduCount = resumeData.education?.length || 0;
    if (eduCount === 0) {
      foundIssues.push({
        id: 'education',
        titleAr: 'المؤهل التعليمي غير مضاف',
        titleEn: 'Education not added',
        descAr: 'أضف آخر درجة علمية أو دراسة أكاديمية.',
        descEn: 'Add your highest degree or academic background.',
        isCritical: false,
      });
      score -= 10;
    }

    // 5. Skills
    const skillsCount = resumeData.skills?.length || 0;
    if (skillsCount < 3) {
      foundIssues.push({
        id: 'skills',
        titleAr: 'عدد المهارات قليل',
        titleEn: 'Few skills listed',
        descAr: `أضفت ${skillsCount} مهارة فقط. يُنصح بإضافة 4-6 مهارات أساسية.`,
        descEn: `Only ${skillsCount} skills added. 4-6 skills recommended.`,
        isCritical: false,
      });
      score -= 10;
    }

    // Calculate bullet points with no measurable result (% or numbers)
    let nonMeasurableBullets = 0;
    const metricRegex = /\b\d+(\.\d+)?%?|\b(\d+)\b|\b\$\d+/;

    (resumeData.experiences || []).forEach((exp) => {
      (exp.bulletPoints || []).forEach((b) => {
        if (b && b.trim().length > 10 && !metricRegex.test(b)) {
          nonMeasurableBullets++;
        }
      });
    });

    (resumeData.projects || []).forEach((proj) => {
      if (proj.description && proj.description.trim().length > 10 && !metricRegex.test(proj.description)) {
        nonMeasurableBullets++;
      }
    });

    const isJobDescMissing = !targetJobDescription || targetJobDescription.trim().length < 30;

    // Red flags (sensitive info, employment gaps)
    const redFlags = detectResumeRedFlags(resumeData);
    const criticalRedFlags = redFlags.filter((f) => f.severity === 'critical');

    // Sections needing attention
    const attentionSections = new Set<string>();
    foundIssues.forEach((i) => attentionSections.add(i.id));
    criticalRedFlags.forEach((f) => attentionSections.add(f.category));

    const finalScore = Math.max(20, Math.min(100, score));

    // Pre-Payment / Pre-Export Action Items categorized by priority level
    const warningsList: Array<{
      id: string;
      level: 'required' | 'recommended' | 'optional';
      titleAr: string;
      titleEn: string;
      descAr: string;
      descEn: string;
      actionTab: 'personal' | 'experiences' | 'education' | 'skills' | 'ats' | 'projects' | 'certifications';
      actionLabelAr: string;
      actionLabelEn: string;
    }> = [];

    // LEVEL 1: REQUIRED (Essential for generating a valid resume)
    const hasFullName = Boolean(p?.fullName?.trim());
    const hasEmail = Boolean(p?.email?.trim());
    const hasPhone = Boolean(p?.phone?.trim());

    if (!hasFullName || !hasEmail || !hasPhone) {
      warningsList.push({
        id: 'personal',
        level: 'required',
        titleAr: 'أضف اسمك الكامل، البريد الإلكتروني، ورقم الهاتف',
        titleEn: 'Add your full name, email, and phone number',
        descAr: 'الاسم والبريد ورقم الهاتف بيانات أساسية للتواصل وتصدير السيرة الذاتية.',
        descEn: 'Full name, email, and phone number are essential for recruiters and export.',
        actionTab: 'personal',
        actionLabelAr: 'إضافة البيانات',
        actionLabelEn: 'Add info',
      });
    }

    const missingSectionsCount = (expCount === 0 ? 1 : 0) + (eduCount === 0 ? 1 : 0) + (skillsCount === 0 ? 1 : 0);
    if (expCount === 0 && eduCount === 0 && skillsCount === 0) {
      warningsList.push({
        id: 'core_sections',
        level: 'required',
        titleAr: 'أضف قسماً رئيسياً (الخبرة، التعليم، أو المهارات)',
        titleEn: 'Add at least one core section',
        descAr: 'تحتاج السيرة الذاتية إلى محتوى أساسي لتصديرها.',
        descEn: 'Your resume needs core content to be complete.',
        actionTab: 'experiences',
        actionLabelAr: 'إضافة قسم',
        actionLabelEn: 'Add section',
      });
    }

    // LEVEL 2: RECOMMENDED (Improves hiring chances without blocking export)
    if (isJobDescMissing) {
      warningsList.push({
        id: 'job_desc',
        level: 'recommended',
        titleAr: 'أضف وصفاً وظيفياً لفحص مخصص',
        titleEn: 'Add a job description for a tailored scan',
        descAr: 'أدخل الوصف الوظيفي لحساب نسبة مطابقة ATS بدقة مع متطلبات الوظيفة.',
        descEn: 'Paste the target job description to match exact keywords and recruiter filters.',
        actionTab: 'ats',
        actionLabelAr: 'فحص مخصص',
        actionLabelEn: 'Tailor scan',
      });
    }

    if (nonMeasurableBullets > 0) {
      warningsList.push({
        id: 'bullets',
        level: 'recommended',
        titleAr: 'أضف أرقاماً أو نتائج ملموسة لنقاط إنجازاتك',
        titleEn: 'Add quantifiable metrics to your bullet points',
        descAr: 'إضافة نسب مئوية أو أرقام تضاعف معدل قبول مسؤولي التوظيف.',
        descEn: 'Quantifiable metrics (% or numbers) double recruiter callback rates.',
        actionTab: 'experiences',
        actionLabelAr: 'إضافة نتائج',
        actionLabelEn: 'Add metrics',
      });
    }

    if (skillsCount > 0 && skillsCount < 3) {
      warningsList.push({
        id: 'skills_count',
        level: 'recommended',
        titleAr: 'أضف 4–6 مهارات تخصصية أساسية',
        titleEn: 'Add 4–6 core industry skills',
        descAr: 'يعزز كثافة الكلمات المفتاحية لمطابقة نظام ATS.',
        descEn: 'Boosts keyword density for recruiter screening.',
        actionTab: 'skills',
        actionLabelAr: 'إضافة مهارات',
        actionLabelEn: 'Add skills',
      });
    }

    // LEVEL 3: OPTIONAL (Enhancements for standout applicants)
    const projectsCount = resumeData.projects?.length || 0;
    const certsCount = resumeData.certifications?.length || 0;
    if (projectsCount === 0 && certsCount === 0) {
      warningsList.push({
        id: 'projects_optional',
        level: 'optional',
        titleAr: 'أضف مشاريع أو شهادات لتقوية سيرتك الذاتية',
        titleEn: 'Add projects to strengthen your resume',
        descAr: 'إبراز المشاريع أو الشهادات التخصصية يمنحك ميزة تنافسية قوية.',
        descEn: 'Highlights practical achievements and continuous learning.',
        actionTab: 'projects',
        actionLabelAr: 'إضافة مشاريع',
        actionLabelEn: 'Add projects',
      });
    }

    return {
      readinessScore: finalScore,
      issues: foundIssues,
      sectionsNeedingAttentionCount: attentionSections.size,
      bulletsWithoutMetricCount: nonMeasurableBullets,
      hasNoJobDescription: isJobDescMissing,
      allWarnings: warningsList,
    };
  }, [resumeData, targetJobDescription]);

  const handleExport = () => {
    const val = validateResumeMinimumRequirements(resumeData);
    if (!val.isValid) {
      setValidationResult(val);
      setIsValidationModalOpen(true);
      setEmptyWarning(
        isAr
          ? 'أكمل الحقول المطلوبة للتحميل (الاسم، المسمى الوظيفي، البريد، وقسم محتوى واحد على الأقل).'
          : 'Complete required fields to download (Name, Job Title, Email, and 1+ section).'
      );
      setTimeout(() => setEmptyWarning(null), 6000);
      return;
    }

    setEmptyWarning(null);
    setIsExporting(true);
    try {
      requestPdfExport('finish_step');
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  const handleOpenPayment = () => {
    const val = validateResumeMinimumRequirements(resumeData);
    if (!val.isValid) {
      setValidationResult(val);
      setIsValidationModalOpen(true);
      setEmptyWarning(
        isAr
          ? 'يرجى إكمال البيانات الأساسية للسيرة الذاتية قبل التوجه للدفع والتفعيل.'
          : 'Please complete basic resume fields before proceeding to payment.'
      );
      setTimeout(() => setEmptyWarning(null), 6000);
      return;
    }
    setIsActivationModalOpen(true);
  };

  const handleUnlockRequest = () => {
    if (activation.remainingDownloads > 0) {
      const confirmMsg = isAr
        ? `لديك ${activation.remainingDownloads} تفعيل(ات) متبقية. هل ترغب في فتح السيرة للتعديل الآن؟`
        : `You have ${activation.remainingDownloads} credit(s) remaining. Unlock editing now?`;
      if (window.confirm(confirmMsg)) {
        unlockResumeWithCredit();
      }
    } else {
      setIsActivationModalOpen(true);
    }
  };

  const candidateName = resumeData.personalInfo.fullName?.trim() || (isAr ? 'سيرتك الذاتية' : 'Your Resume');
  const targetTitle = resumeData.personalInfo.jobTitle?.trim() || (isAr ? 'ملف مهني' : 'Professional Profile');
  const templateName = settings.templateId ? settings.templateId.toUpperCase() : 'MODERN';

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full max-w-full min-w-0 overflow-x-hidden mobile-editor-content" aria-label="Review & Export Section">
      {/* Header with Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-[#001639] flex items-center gap-2">
            <Download className="w-5 h-5 text-[#FF4D2D]" />
            <span>{isAr ? 'المراجعة والتصدير' : 'Review & Export'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {isAr
              ? 'افحص محتواك وتوافق الـ ATS وحمّل سيرتك الذاتية النهائية.'
              : 'Check your content, ATS readiness, and download your final resume.'}
          </p>
        </div>

        {/* Lock status pill if locked */}
        {activation.isResumeLocked && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-semibold self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>{isAr ? 'النسخة مقفلة' : 'Resume Locked'}</span>
          </div>
        )}
      </div>

      {/* Lock Banner Warning */}
      {activation.isResumeLocked && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950">
          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs">
                {isAr ? 'تم تنزيل النسخة وقفل الحقول' : 'Resume locked after download'}
              </h4>
              <p className="text-[11px] text-amber-900/80 mt-0.5">
                {isAr
                  ? 'يمكنك فتح التعديل لإنشاء إصدار جديد في أي وقت باستخدام رصيدك المتبقي.'
                  : 'You can unlock fields to create a new revision using your remaining credits.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleUnlockRequest}
            className="px-3.5 py-2 bg-[#001639] hover:bg-[#00245E] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[38px] shrink-0"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'فتح التعديل الآن' : 'Unlock Editing'}</span>
          </button>
        </div>
      )}

      {/* Step Pipeline Navigation Banner (3-Step Export Journey) */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 sm:p-4">
        <span className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
          {isAr ? 'خطوات التصدير والتنزيل الثلاثية' : '3-Step Export Process'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center text-xs font-bold">
          {/* Step 1: Review & ATS Scan */}
          <button
            type="button"
            onClick={() => setActiveTab('ats' as any)}
            className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
              sectionsNeedingAttentionCount === 0
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#001639]" />
              <FileSearch className="w-4 h-4 text-[#FF4D2D]" />
            </div>
            <span className="text-xs font-bold">1. {isAr ? 'Review (المراجعة وفحص ATS)' : '1. Review & ATS Scan'}</span>
          </button>

          {/* Step 2: Pay */}
          <button
            type="button"
            onClick={handleOpenPayment}
            className="p-3 rounded-xl border bg-white text-slate-700 border-slate-200 hover:border-slate-300 flex flex-col items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-bold">2. {isAr ? 'Pay (الدفع والتفعيل)' : '2. Pay'}</span>
          </button>

          {/* Step 3: Download */}
          <button
            type="button"
            onClick={handleExport}
            className="p-3 rounded-xl border bg-[#001639] text-white border-[#001639] flex flex-col items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs hover:bg-[#00245E]"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold">3. {isAr ? 'Download (تنزيل PDF)' : '3. Download'}</span>
          </button>
        </div>
      </div>

      {/* Action Items Before Export (Quality & Readiness Checklist) OR Ready to Export Banner */}
      {allWarnings.length > 0 ? (
        <div className="bg-slate-50 border-2 border-slate-300/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-[#001639]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-[#001639]">
                  {isAr
                    ? 'أصلح هذه الملاحظات قبل التصدير'
                    : 'Fix these before exporting'}
                </h4>
                <p className="text-[11px] font-semibold text-slate-500">
                  {isAr
                    ? `${allWarnings.length} عناصر تحتاج انتباهك`
                    : `${allWarnings.length} items need your attention`}
                </p>
              </div>
            </div>
          </div>

          {/* Categorized Action Items List */}
          <div className="space-y-2 pt-1 border-t border-slate-200">
            {allWarnings.map((w, idx) => {
              const isRequired = w.level === 'required';
              const isRecommended = w.level === 'recommended';
              return (
                <div
                  key={idx}
                  className={`warning-card p-3 bg-white rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs shadow-2xs w-full min-w-0 ${
                    isRequired
                      ? 'border-red-200 bg-red-50/20'
                      : isRecommended
                      ? 'border-amber-200/90 bg-amber-50/20'
                      : 'border-slate-200/90'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black shrink-0 mt-0.5 ${
                        isRequired
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : isRecommended
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {isRequired
                        ? isAr ? 'مطلوب' : 'Required'
                        : isRecommended
                        ? isAr ? 'موصى به' : 'Recommended'
                        : isAr ? 'اختياري' : 'Optional'}
                    </span>

                    <div className="flex flex-col min-w-0 flex-1">
                      <h4 className="font-black text-slate-800 leading-snug whitespace-normal break-words overflow-wrap-anywhere">
                        {isAr ? w.titleAr : w.titleEn}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5 whitespace-normal break-words overflow-wrap-anywhere">
                        {isAr ? w.descAr : w.descEn}
                      </p>
                    </div>
                  </div>

                  {w.actionTab && (
                    <button
                      type="button"
                      onClick={() => setActiveTab(w.actionTab as any)}
                      className={`self-end sm:self-auto px-3 py-1.5 font-bold rounded-lg text-[11px] flex items-center gap-1.5 shrink-0 transition cursor-pointer min-h-[32px] ${
                        isRequired
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : isRecommended
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-950'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                      }`}
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isAr ? w.actionLabelAr : w.actionLabelEn}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/90 border-2 border-emerald-300 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-sm font-black text-emerald-950">
              {isAr ? 'سيرتك الذاتية جاهزة للتصدير' : 'Your resume is ready to export'}
            </h4>
            <p className="text-xs font-semibold text-emerald-800/90 mt-0.5">
              {isAr ? 'جميع البيانات الأساسية مكتملة وجاهزة للتحميل الفوري.' : 'All required information is complete.'}
            </p>
          </div>
        </div>
      )}

      {/* 1. Main Hero Download & Export Card */}
      <div className="bg-gradient-to-br from-[#001639] to-[#00245E] text-white rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        {/* Candidate & Format Snapshot */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-semibold tracking-wide">
              <FileCheck className="w-3.5 h-3.5 text-[#FF4D2D]" />
              <span>{isAr ? 'ملف PDF عالي الدقة • تنسيق متوافق مع ATS' : 'High-resolution PDF • ATS-friendly layout'}</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">{candidateName}</h3>
            <p className="text-xs text-slate-300 font-medium">{targetTitle}</p>
          </div>

          {/* Readiness Score Chip */}
          <div className="flex items-center justify-between sm:justify-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
            <div className="flex flex-col sm:items-end">
              <span className="text-[10px] text-slate-300 font-semibold uppercase tracking-wider">
                {isAr ? 'توافق ATS' : 'ATS Readiness'}
              </span>
              <span
                className={`text-sm sm:text-base font-black ${
                  readinessScore >= 80
                    ? 'text-emerald-400'
                    : readinessScore >= 60
                    ? 'text-amber-400'
                    : 'text-[#FF4D2D]'
                }`}
              >
                {readinessScore}/100 — {
                  readinessScore >= 80
                    ? isAr ? 'جاهز للمنافسة' : 'strong match'
                    : readinessScore >= 60
                    ? isAr ? 'جاهزية جيدة' : 'good readiness'
                    : isAr ? 'يحتاج تحسينات' : 'needs attention'
                }
              </span>
            </div>
            <ShieldCheck className={`w-5 h-5 shrink-0 ${
              readinessScore >= 80 ? 'text-emerald-400' : readinessScore >= 60 ? 'text-amber-400' : 'text-[#FF4D2D]'
            }`} />
          </div>
        </div>

        {/* ATS Score Explanation & 3 Reasons when attention is needed */}
        {allWarnings.length > 0 && (
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {isAr
                    ? 'أسباب النتيجة ونقاط التحسين المباشرة:'
                    : 'Reasons for this score & quick fixes:'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const firstTab = allWarnings[0]?.actionTab || 'personal';
                  setActiveTab(firstTab);
                }}
                className="text-[11px] font-bold text-amber-300 hover:text-amber-200 underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isAr ? 'اكتشف ما يجب إصلاحه' : 'See what to fix'}</span>
                <ArrowRight className="w-3 h-3 rtl:rotate-180" />
              </button>
            </div>

            {/* Up to 3 Key Reasons */}
            <ul className="space-y-1.5 text-[11px] text-slate-200 ps-1">
              {allWarnings.slice(0, 3).map((w, idx) => (
                <li key={idx} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="truncate">{isAr ? w.titleAr : w.titleEn}</span>
                  </div>
                  {w.actionTab && (
                    <button
                      type="button"
                      onClick={() => setActiveTab(w.actionTab)}
                      className="text-[10px] text-slate-300 hover:text-white underline shrink-0 cursor-pointer"
                    >
                      {isAr ? w.actionLabelAr : w.actionLabelEn}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Empty Resume Warning Alert */}
        {emptyWarning && (
          <div className="p-3.5 bg-amber-500/20 border border-amber-400/50 rounded-xl flex items-center gap-3 text-amber-200 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="flex-1">{emptyWarning}</span>
          </div>
        )}

        {/* Primary Download & Share Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 py-3.5 px-5 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-bold text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[48px] active:scale-98"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isAr ? 'جاري تجهيز السيرة...' : 'Preparing Resume...'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{isAr ? 'تحميل السيرة الذاتية (PDF)' : 'Download Resume (PDF)'}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="py-3.5 px-4 bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/15 transition flex items-center justify-center gap-2 cursor-pointer min-h-[48px] active:scale-98"
            title={isAr ? 'مشاركة السيرة' : 'Share Resume'}
          >
            <Share2 className="w-4 h-4 text-slate-200" />
            <span>{isAr ? 'مشاركة سريعة' : 'Share'}</span>
          </button>
        </div>

        {/* Feature Guarantees Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-white/10 text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{isAr ? 'ملف PDF عالي الجودة' : 'High-quality PDF'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{isAr ? 'تنسيق صديق لأنظمة ATS' : 'Clean, ATS-friendly layout'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{isAr ? 'بدون أي علامة مائية' : 'No Watermarks'}</span>
          </div>
        </div>
      </div>

      {/* 2. Actionable Quality & Improvement Warnings */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                allWarnings.length === 0
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  : 'bg-amber-50 text-amber-600 border border-amber-200'
              }`}
            >
              {allWarnings.length === 0 ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#001639]">
                {allWarnings.length === 0
                  ? isAr
                    ? 'جاهز للتصدير'
                    : 'Ready to export'
                  : isAr
                  ? 'أصلح هذه النقاط قبل التصدير'
                  : 'Fix these before exporting'}
              </h4>
              <p className="text-xs text-slate-500">
                {allWarnings.length === 0
                  ? isAr
                    ? 'سيرتك الذاتية تحتوي على الأقسام المطلوبة وجاهزة للمراجعة والتصدير.'
                    : 'Your resume has the required sections and is ready to review.'
                  : isAr
                  ? 'تحسين هذه النقاط يؤدي لإجراء مباشر ويرفع توافق السيرة الذاتية.'
                  : 'Fixing these items gives you direct actions to boost your resume.'}
              </p>
            </div>
          </div>
        </div>

        {/* Actionable items with direct buttons */}
        {allWarnings.length > 0 && (
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            {allWarnings.map((warn, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 space-y-0.5">
                  <span className="font-bold text-[#001639] block">
                    {isAr ? warn.titleAr : warn.titleEn}
                  </span>
                  <span className="text-[11px] text-slate-600 block leading-relaxed">
                    {isAr ? warn.descAr : warn.descEn}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab(warn.actionTab)}
                  className="px-3.5 py-2 bg-[#001639] hover:bg-[#00245E] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shrink-0 transition cursor-pointer shadow-2xs active:scale-98 min-h-[36px]"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#FF4D2D]" />
                  <span>{isAr ? warn.actionLabelAr : warn.actionLabelEn}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* One-Time Payment Model Notice & Transparent Pricing Plans */}
      <div className="bg-white border-2 border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-black text-[#001639]">
                {isAr ? 'نموذج الدفع: لمرة واحدة فقط عند التحميل' : 'One-Time Payment Model (No Recurring Fees)'}
              </h4>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {isAr ? 'بدون أي اشتراك تلقائي' : 'Zero Subscriptions'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {isAr
                ? 'أنشئ وعاين سيرتك الذاتية مجاناً. ادفع لمرة واحدة فقط عندما تصبح جاهزاً لتحميل ملف الـ PDF عالي الجودة بدون أي اشتراكات متكررة.'
                : 'Build and preview your resume for free. Pay once when you’re ready to download the high-quality PDF. No recurring subscriptions.'}
            </p>
          </div>
        </div>

        {/* Pricing Plans Table / Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Plan 1: Single Download */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 hover:bg-slate-50 flex flex-col justify-between transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">{isAr ? 'تحميل فردي' : 'Single Download'}</span>
                <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {isAr ? 'سيرة واحدة' : '1 Resume'}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#001639]">50</span>
                <span className="text-xs font-bold text-slate-600">{isAr ? 'ج.م' : 'EGP'}</span>
                <span className="text-[10px] text-slate-500 font-medium ms-1">
                  ({isAr ? 'دفعة لمرة واحدة' : 'one-time payment'})
                </span>
              </div>
              <ul className="text-[11px] text-slate-600 space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{isAr ? 'تحميل سيرة ذاتية واحدة عالية الجودة PDF' : '1 high-quality PDF download'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{isAr ? 'بدون أي علامة مائية' : 'No watermark'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{isAr ? 'تنسيق متوافق مع أنظمة ATS' : 'ATS-friendly layout'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{isAr ? 'دفع لمرة واحدة' : 'One-time payment'}</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => {
                useResumeStore.getState().setIsActivationModalOpen(true);
              }}
              className="mt-3 w-full py-2.5 px-3 bg-white hover:bg-slate-100 text-[#001639] border border-slate-300 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
            >
              <span>{isAr ? 'اشترِ الآن (50 ج.م)' : 'Buy Now (50 EGP)'}</span>
            </button>
          </div>

          {/* Plan 2: 3-Downloads Bundle */}
          <div className="border-2 border-[#FF4D2D] rounded-xl p-4 bg-orange-50/30 hover:bg-orange-50/50 flex flex-col justify-between transition relative">
            <span className="absolute -top-2.5 left-4 sm:left-auto sm:right-4 px-2 py-0.5 bg-[#FF4D2D] text-white text-[9px] font-black rounded-full uppercase tracking-wider">
              {isAr ? 'الأكثر توفيراً (توفير 30 ج.م)' : 'Save 30 EGP'}
            </span>
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-orange-950">{isAr ? 'باقة 3 تحميلات' : '3-Downloads Pack'}</span>
                <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-2 py-0.5 rounded border border-orange-200">
                  {isAr ? '3 سير ذاتية' : '3 Resumes'}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#001639]">120</span>
                <span className="text-xs font-bold text-slate-600">{isAr ? 'ج.م' : 'EGP'}</span>
                <span className="text-[10px] text-emerald-700 font-bold ms-1">
                  ({isAr ? '40 ج.م للتحميل فقط' : 'Only 40 EGP/CV'})
                </span>
              </div>
              <ul className="text-[11px] text-slate-600 space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{isAr ? '3 تحميلات لنماذج أو نسخ سير ذاتية مختلفة' : '3 downloads for different resume versions'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{isAr ? 'استخدم الرصيد في أي وقت تحتاجه' : 'Use them whenever you need'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{isAr ? 'بدون علامة مائية ومعتمدة لـ ATS' : 'No watermark & ATS-friendly'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{isAr ? 'دفع لمرة واحدة' : 'One-time payment'}</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => {
                useResumeStore.getState().setIsActivationModalOpen(true);
              }}
              className="mt-3 w-full py-2.5 px-3 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98"
            >
              <span>{isAr ? 'اشترِ الآن (120 ج.م)' : 'Buy Now (120 EGP)'}</span>
            </button>
          </div>
        </div>

        {/* Local Storage & Data Privacy Banner */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-600">
          <Lock className="w-4 h-4 text-[#001639] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-800">
              {isAr ? 'خصوصية وأمان البيانات 100%:' : '100% Data Privacy & Security:'}
            </span>
            <p>
              {isAr
                ? 'بيانات سيرتك الذاتية مشفرة وتُخزن محلياً فقط على متصفح جهازك. لا يتم إرسال أي بيانات إلى الخادم إلا النصوص التي تختار تحسينها بالذكاء الاصطناعي.'
                : 'Your resume is encrypted and stored locally in your browser. No data is sent to our server except specific text snippets you request for AI enhancement.'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Pre-Export Quality & Settings (Ordered by Priority: 1. ATS Keywords, 2. Template & Colors, 3. Data Backup) */}
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* 1. ATS match scan card (Top Priority before exporting) */}
          <button
            type="button"
            onClick={() => setActiveTab('ats' as any)}
            className="p-4 bg-white border border-slate-200 hover:border-[#FF4D2D]/60 rounded-2xl text-start transition flex items-center justify-between gap-3 shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF4D2D] group-hover:bg-[#FF4D2D] group-hover:text-white flex items-center justify-center shrink-0 transition">
                <FileSearch className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#001639]">
                  {isAr ? 'فحص الكلمات المفتاحية ATS' : 'ATS Keyword Match'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isAr ? 'مطابقة السيرة مع إعلان وظيفتك واكتشاف الكلمات الناقصة' : 'Scan missing keywords & match job requirements'}
                </p>
              </div>
            </div>
            <span className="text-slate-400 group-hover:text-[#FF4D2D] text-xs font-bold transition rtl:rotate-180">
              →
            </span>
          </button>

          {/* 2. Template & Colors card */}
          <button
            type="button"
            onClick={() => setActiveTab('customize')}
            className="p-4 bg-white border border-slate-200 hover:border-[#001639]/50 rounded-2xl text-start transition flex items-center justify-between gap-3 shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#001639] group-hover:bg-[#001639] group-hover:text-white flex items-center justify-center shrink-0 transition">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#001639]">
                  {isAr ? 'تخصيص القالب والمظهر' : 'Template & Colors'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isAr ? 'تغيير التصميم والألوان والخطوط' : 'Change theme, font, and layout'}
                </p>
              </div>
            </div>
            <span className="text-slate-400 group-hover:text-[#001639] text-xs font-bold transition rtl:rotate-180">
              →
            </span>
          </button>
        </div>

        {/* 3. JSON Data Backup & Restore Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#001639] text-white flex items-center justify-center shrink-0">
                <FileJson className="w-4 h-4 text-[#FF4D2D]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#001639]">
                  {isAr ? 'النسخة الاحتياطية للبيانات (JSON Backup)' : 'Data Backup & Restore'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {isAr
                    ? 'احفظ نسخة من بيانات سيرتك الذاتية على جهازك للخصوصية أو استعدها في أي وقت.'
                    : 'Your backup is downloaded to your device. Keep it somewhere safe.'}
                </p>
              </div>
            </div>
          </div>

          {/* Success / Info Alert */}
          {jsonSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{jsonSuccessMsg}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-0.5">
            {/* Export JSON Button */}
            <button
              type="button"
              onClick={handleExportJson}
              className="w-full sm:flex-1 py-2.5 px-4 bg-white hover:bg-slate-100 text-[#001639] border border-slate-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs min-h-[40px] active:scale-98"
            >
              <Download className="w-3.5 h-3.5 text-[#001639]" />
              <span>{isAr ? 'تصدير نسخة احتياطية' : 'Download Backup (JSON)'}</span>
            </button>

            {/* Restore from Backup Button */}
            <input
              type="file"
              ref={jsonFileInputRef}
              onChange={handleImportJson}
              accept=".json,application/json"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => jsonFileInputRef.current?.click()}
              className="w-full sm:flex-1 py-2.5 px-4 bg-[#001639] hover:bg-[#00245E] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs min-h-[40px] active:scale-98"
            >
              <Upload className="w-3.5 h-3.5 text-[#FF4D2D]" />
              <span>{isAr ? 'استعادة من نسخة احتياطية' : 'Restore from backup'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={resumeData}
        settings={settings}
      />

      {/* Validation Modal */}
      {validationResult && (
        <ResumeValidationModal
          isOpen={isValidationModalOpen}
          onClose={() => setIsValidationModalOpen(false)}
          validationResult={validationResult}
          onNavigateSection={(sec) => setActiveTab(sec)}
        />
      )}
    </div>
  );
};
