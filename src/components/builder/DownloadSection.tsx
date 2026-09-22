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

  const setIsUnlockModalOpen = useResumeStore((state) => state.setIsUnlockModalOpen);

  const handleUnlockRequest = () => {
    if (activation.remainingDownloads > 0) {
      setIsUnlockModalOpen(true);
    } else {
      setIsActivationModalOpen(true);
    }
  };

  const candidateName = resumeData.personalInfo.fullName?.trim() || (isAr ? 'سيرتك الذاتية' : 'Your Resume');
  const targetTitle = resumeData.personalInfo.jobTitle?.trim() || (isAr ? 'ملف مهني' : 'Professional Profile');
  const templateName = settings.templateId ? settings.templateId.toUpperCase() : 'MODERN';

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full max-w-full min-w-0 overflow-x-hidden mobile-editor-content text-ink" aria-label="Review & Export Section">
      {/* Header with Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
        <div>
          <h2 className="text-base font-tajawal font-bold text-ink flex items-center gap-2">
            <Download className="w-4 h-4 text-orange" />
            <span>{isAr ? 'المراجعة والتصدير' : 'Review & Export'}</span>
          </h2>
          <p className="text-xs font-ibm-sans text-ink-soft mt-0.5">
            {isAr
              ? 'افحص محتواك وتوافق الـ ATS وحمّل سيرتك الذاتية النهائية.'
              : 'Check your content, ATS readiness, and download your final resume.'}
          </p>
        </div>

        {/* Lock status pill if locked */}
        {activation.isResumeLocked && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-none text-xs font-ibm-mono font-bold self-start sm:self-auto">
            <Lock className="w-3.5 h-3.5 text-amber-700" />
            <span>{isAr ? 'النسخة مقفلة' : 'LOCKED'}</span>
          </div>
        )}
      </div>

      {/* Lock Banner Warning */}
      {activation.isResumeLocked && (
        <div className="p-3.5 bg-amber-50/50 border border-amber-300 rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-950">
          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-tajawal font-bold text-xs">
                {isAr ? 'تم تنزيل النسخة وقفل الحقول' : 'Resume locked after download'}
              </h4>
              <p className="text-xs font-ibm-sans text-amber-900/80 mt-0.5">
                {isAr
                  ? 'يمكنك فتح التعديل لإنشاء إصدار جديد في أي وقت باستخدام رصيدك المتبقي.'
                  : 'You can unlock fields to create a new revision using your remaining credits.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleUnlockRequest}
            className="px-3.5 py-2 bg-ink hover:bg-ink/90 text-white text-xs font-ibm-sans font-bold rounded-none border border-ink flex items-center justify-center gap-1.5 transition cursor-pointer min-h-[38px] shrink-0"
          >
            <Key className="w-3.5 h-3.5 text-orange" />
            <span>{isAr ? 'فتح التعديل الآن' : 'Unlock Editing'}</span>
          </button>
        </div>
      )}

      {/* 1. Main Hero Download & Export Card */}
      <div className="bg-white border border-line rounded-none p-5 sm:p-6 space-y-4">
        {/* Candidate & Format Snapshot */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-none bg-paper border border-line text-ink text-xs font-ibm-sans font-bold">
              <FileCheck className="w-3.5 h-3.5 text-orange" />
              <span>{isAr ? 'ملف PDF عالي الدقة • تنسيق متوافق مع ATS' : 'High-resolution PDF • ATS-friendly layout'}</span>
            </div>
            <h3 className="text-lg font-tajawal font-bold text-ink tracking-tight">{candidateName}</h3>
            <p className="text-xs font-ibm-sans text-ink-soft">{targetTitle}</p>
          </div>

          {/* Readiness Score Chip */}
          <div className="flex items-center justify-between sm:justify-center gap-3 bg-paper border border-line rounded-none px-4 py-2.5">
            <div className="flex flex-col sm:items-end">
              <span className="font-ibm-mono text-[10px] text-ink-soft font-bold uppercase tracking-wider">
                {isAr ? 'توافق ATS' : 'ATS READINESS'}
              </span>
              <span
                className={`font-ibm-mono text-sm sm:text-base font-black ${
                  readinessScore >= 80
                    ? 'text-emerald-700'
                    : readinessScore >= 60
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}
              >
                {readinessScore}/100 — {
                  readinessScore >= 80
                    ? isAr ? 'جاهز للمنافسة' : 'Strong Match'
                    : readinessScore >= 60
                    ? isAr ? 'جاهزية جيدة' : 'Good Readiness'
                    : isAr ? 'يحتاج تحسينات' : 'Needs Attention'
                }
              </span>
            </div>
            <ShieldCheck className={`w-5 h-5 shrink-0 ${
              readinessScore >= 80 ? 'text-emerald-700' : readinessScore >= 60 ? 'text-amber-700' : 'text-rose-700'
            }`} />
          </div>
        </div>

        {/* ATS Score Explanation & 3 Reasons when attention is needed */}
        {allWarnings.length > 0 && (
          <div className="p-3.5 rounded-none bg-paper border border-line space-y-2.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-ink font-tajawal font-bold">
                <AlertCircle className="w-4 h-4 text-orange shrink-0" />
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
                className="text-xs font-ibm-sans font-bold text-ink hover:text-orange underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isAr ? 'اكتشف ما يجب إصلاحه' : 'See what to fix'}</span>
                <ArrowRight className="w-3 h-3 rtl:rotate-180 text-orange" />
              </button>
            </div>

            {/* Up to 3 Key Reasons */}
            <ul className="space-y-1.5 text-xs font-ibm-sans text-ink-soft ps-1 font-medium">
              {allWarnings.slice(0, 3).map((w, idx) => (
                <li key={idx} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-none bg-orange shrink-0" />
                    <span className="truncate">{isAr ? w.titleAr : w.titleEn}</span>
                  </div>
                  {w.actionTab && (
                    <button
                      type="button"
                      onClick={() => setActiveTab(w.actionTab)}
                      className="text-xs text-ink hover:text-orange underline shrink-0 cursor-pointer font-bold"
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
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-none flex items-center gap-3 text-amber-900 text-xs font-ibm-sans font-bold animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <span className="flex-1">{emptyWarning}</span>
          </div>
        )}

        {/* Primary Download Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 py-3 px-5 bg-ink hover:bg-ink/90 text-white font-ibm-sans font-bold text-sm rounded-none border border-ink transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[44px]"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isAr ? 'جاري تجهيز السيرة...' : 'Preparing Resume...'}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-orange" />
                <span>{isAr ? 'تحميل السيرة الذاتية (PDF)' : 'Download Resume (PDF)'}</span>
                <Sparkles className="w-3.5 h-3.5 text-orange" />
              </>
            )}
          </button>
        </div>

        {/* Feature Guarantees Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-line text-xs font-ibm-sans text-ink-soft">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>{isAr ? 'ملف PDF عالي الجودة' : 'High-quality PDF'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>{isAr ? 'تنسيق صديق لأنظمة ATS' : 'Clean, ATS-friendly layout'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>{isAr ? 'بدون أي علامة مائية' : 'No Watermarks'}</span>
          </div>
        </div>
      </div>

      {/* 2. Actionable Quality & Improvement Warnings */}
      <div className="bg-white border border-line rounded-none p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 border ${
                allWarnings.length === 0
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-amber-50 text-amber-700 border-amber-300'
              }`}
            >
              {allWarnings.length === 0 ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-tajawal font-bold text-ink">
                {allWarnings.length === 0
                  ? isAr
                    ? 'جاهز للتصدير'
                    : 'Ready to export'
                  : isAr
                  ? 'أصلح هذه النقاط قبل التصدير'
                  : 'Fix these before exporting'}
              </h4>
              <p className="text-xs font-ibm-sans text-ink-soft">
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
          <div className="pt-2 border-t border-line space-y-2.5">
            {allWarnings.map((warn, idx) => (
              <div
                key={idx}
                className="p-3 rounded-none bg-paper border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 space-y-0.5">
                  <span className="font-tajawal font-bold text-ink block">
                    {isAr ? warn.titleAr : warn.titleEn}
                  </span>
                  <span className="text-xs font-ibm-sans text-ink-soft block leading-relaxed">
                    {isAr ? warn.descAr : warn.descEn}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab(warn.actionTab)}
                  className="px-3 py-1.5 bg-ink hover:bg-ink/90 text-white font-ibm-sans font-bold rounded-none text-xs flex items-center justify-center gap-1.5 shrink-0 transition cursor-pointer border border-ink min-h-[32px]"
                >
                  <Edit3 className="w-3.5 h-3.5 text-orange" />
                  <span>{isAr ? warn.actionLabelAr : warn.actionLabelEn}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* One-Time Payment Model Notice & Transparent Pricing Plans */}
      <div className="bg-white border border-line rounded-none p-5 sm:p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-none bg-paper border border-line text-ink flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-orange" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-xs sm:text-sm font-tajawal font-bold text-ink">
                {isAr ? 'نموذج الدفع: لمرة واحدة فقط عند التحميل' : 'One-Time Payment Model (No Recurring Fees)'}
              </h4>
              <span className="px-2 py-0.5 rounded-none bg-emerald-50 text-emerald-800 border border-emerald-300 font-ibm-mono text-[10px] font-bold">
                {isAr ? 'بدون أي اشتراك تلقائي' : 'ZERO SUBSCRIPTIONS'}
              </span>
            </div>
            <p className="text-xs font-ibm-sans text-ink-soft mt-1 leading-relaxed">
              {isAr
                ? 'أنشئ وعاين سيرتك الذاتية مجاناً. ادفع لمرة واحدة فقط عندما تصبح جاهزاً لتحميل ملف الـ PDF عالي الجودة بدون أي اشتراكات متكررة.'
                : 'Build and preview your resume for free. Pay once when you’re ready to download the high-quality PDF. No recurring subscriptions.'}
            </p>
          </div>
        </div>

        {/* Pricing Plans Table / Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Plan 1: Single Download */}
          <div className="border border-line rounded-none p-4 bg-paper hover:bg-paper-2 flex flex-col justify-between transition">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-tajawal font-bold text-ink">{isAr ? 'تحميل فردي' : 'Single Download'}</span>
                <span className="font-ibm-mono text-[10px] font-bold text-ink bg-white px-2 py-0.5 border border-line rounded-none">
                  {isAr ? 'سيرة واحدة' : '1 RESUME'}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-ibm-mono text-2xl font-black text-ink">50</span>
                <span className="font-ibm-sans text-xs font-bold text-ink-soft">{isAr ? 'ج.م' : 'EGP'}</span>
                <span className="font-ibm-sans text-xs text-ink-soft font-medium ms-1">
                  ({isAr ? 'دفعة لمرة واحدة' : 'one-time'})
                </span>
              </div>
              <ul className="text-xs font-ibm-sans text-ink-soft space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{isAr ? 'تحميل سيرة ذاتية واحدة عالية الجودة PDF' : '1 high-quality PDF download'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{isAr ? 'بدون أي علامة مائية' : 'No watermark'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{isAr ? 'تنسيق متوافق مع أنظمة ATS' : 'ATS-friendly layout'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{isAr ? 'دفع لمرة واحدة' : 'One-time payment'}</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => {
                useResumeStore.getState().setIsActivationModalOpen(true);
              }}
              className="mt-4 w-full py-2 px-3 bg-white hover:bg-paper text-ink border border-line font-ibm-sans font-bold text-xs rounded-none transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{isAr ? 'اشترِ الآن (50 ج.م)' : 'Buy Now (50 EGP)'}</span>
            </button>
          </div>

          {/* Plan 2: 3-Downloads Bundle */}
          <div className="border border-orange rounded-none p-4 bg-paper hover:bg-paper-2 flex flex-col justify-between transition relative">
            <span className="absolute -top-2.5 left-4 sm:left-auto sm:right-4 px-2 py-0.2 bg-orange text-white font-ibm-mono text-[9px] font-bold uppercase tracking-wider rounded-none">
              {isAr ? 'الأكثر توفيراً (توفير 30 ج.م)' : 'SAVE 30 EGP'}
            </span>
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-tajawal font-bold text-ink">{isAr ? 'باقة 3 تحميلات' : '3-Downloads Pack'}</span>
                <span className="font-ibm-mono text-[10px] font-bold text-orange bg-orange/10 px-2 py-0.5 border border-orange/30 rounded-none">
                  {isAr ? '3 سير ذاتية' : '3 RESUMES'}
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-ibm-mono text-2xl font-black text-ink">120</span>
                <span className="font-ibm-sans text-xs font-bold text-ink-soft">{isAr ? 'ج.م' : 'EGP'}</span>
                <span className="font-ibm-mono text-xs text-emerald-700 font-bold ms-1">
                  ({isAr ? '40 ج.م / سيرة' : '40 EGP / CV'})
                </span>
              </div>
              <ul className="text-xs font-ibm-sans text-ink-soft space-y-1.5 pt-1">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{isAr ? '3 تحميلات لنماذج أو نسخ سير ذاتية مختلفة' : '3 downloads for different resume versions'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{isAr ? 'استخدم الرصيد في أي وقت تحتاجه' : 'Use them whenever you need'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{isAr ? 'بدون علامة مائية ومعتمدة لـ ATS' : 'No watermark & ATS-friendly'}</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{isAr ? 'دفع لمرة واحدة' : 'One-time payment'}</span>
                </li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => {
                useResumeStore.getState().setIsActivationModalOpen(true);
              }}
              className="mt-4 w-full py-2 px-3 bg-ink hover:bg-ink/90 text-white font-ibm-sans font-bold text-xs rounded-none border border-ink transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{isAr ? 'اشترِ الآن (120 ج.م)' : 'Buy Now (120 EGP)'}</span>
            </button>
          </div>
        </div>

        {/* Local Storage & Data Privacy Banner */}
        <div className="p-3 bg-paper border border-line rounded-none flex items-start gap-2.5 text-xs text-ink-soft">
          <Lock className="w-4 h-4 text-ink shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-tajawal font-bold text-ink">
              {isAr ? 'خصوصية وأمان البيانات 100%:' : '100% Data Privacy & Security:'}
            </span>
            <p className="font-ibm-sans">
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
            className="p-4 bg-white border border-line hover:border-ink rounded-none text-start transition flex items-center justify-between gap-3 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-none bg-paper border border-line text-ink group-hover:bg-ink group-hover:text-white flex items-center justify-center shrink-0 transition">
                <FileSearch className="w-4 h-4 text-orange" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-tajawal font-bold text-ink">
                  {isAr ? 'فحص الكلمات المفتاحية ATS' : 'ATS Keyword Match'}
                </h4>
                <p className="text-xs font-ibm-sans text-ink-soft mt-0.5">
                  {isAr ? 'مطابقة السيرة مع إعلان وظيفتك واكتشاف الكلمات الناقصة' : 'Scan missing keywords & match job requirements'}
                </p>
              </div>
            </div>
            <span className="text-ink-soft group-hover:text-ink text-xs font-ibm-mono font-bold transition rtl:rotate-180">
              →
            </span>
          </button>

          {/* 2. Template & Colors card */}
          <button
            type="button"
            onClick={() => setActiveTab('customize')}
            className="p-4 bg-white border border-line hover:border-ink rounded-none text-start transition flex items-center justify-between gap-3 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-none bg-paper border border-line text-ink group-hover:bg-ink group-hover:text-white flex items-center justify-center shrink-0 transition">
                <Palette className="w-4 h-4 text-orange" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-tajawal font-bold text-ink">
                  {isAr ? 'تخصيص القالب والمظهر' : 'Template & Colors'}
                </h4>
                <p className="text-xs font-ibm-sans text-ink-soft mt-0.5">
                  {isAr ? 'تغيير التصميم والألوان والخطوط' : 'Change theme, font, and layout'}
                </p>
              </div>
            </div>
            <span className="text-ink-soft group-hover:text-ink text-xs font-ibm-mono font-bold transition rtl:rotate-180">
              →
            </span>
          </button>
        </div>
      </div>

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
