import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { useResumeExport } from '../../hooks/useResumeExport';
import { ShareModal } from '../common/ShareModal';
import { isResumeBlank } from '../../utils/resumeFingerprint';

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

  // Compute key checklist items and readiness score
  const { readinessScore, issues, completedCount, totalChecks } = useMemo(() => {
    const foundIssues: IssueItem[] = [];
    const p = resumeData.personalInfo;
    let score = 100;
    const total = 5;

    // 1. Name & Email
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

    const finalScore = Math.max(20, Math.min(100, score));
    const completed = total - foundIssues.filter((i) => i.isCritical || i.descAr).length;

    return {
      readinessScore: finalScore,
      issues: foundIssues,
      completedCount: Math.max(0, completed),
      totalChecks: total,
    };
  }, [resumeData]);

  const handleExport = () => {
    const isBlank = isResumeBlank(resumeData) || !resumeData.personalInfo?.fullName?.trim();
    if (isBlank) {
      setEmptyWarning(
        isAr
          ? 'يرجى إكمال بياناتك الشخصية قبل تحميل السيرة الذاتية.'
          : 'Complete your Personal Information before downloading your CV.'
      );
      setTimeout(() => setEmptyWarning(null), 5000);
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
    <div className="space-y-4 max-w-3xl mx-auto" aria-label="Download & Export Section">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-base font-bold text-[#001639] flex items-center gap-2">
            <Download className="w-5 h-5 text-[#FF4D2D]" />
            <span>{isAr ? 'تصدير وتحميل السيرة الذاتية' : 'Export & Download Resume'}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAr
              ? 'ملف PDF متجهي عالي الدقة، متوافق 100% مع أنظمة فرز السير ATS وجاهز للتقديم.'
              : 'High-definition vector PDF, 100% ATS compliant and ready for job applications.'}
          </p>
        </div>

        {/* Lock status pill if locked */}
        {activation.isResumeLocked && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-900 rounded-full text-xs font-semibold self-start sm:self-auto">
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

      {/* 1. Main Hero Download & Export Card */}
      <div className="bg-gradient-to-br from-[#001639] to-[#00245E] text-white rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
        {/* Candidate & Format Snapshot */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 text-[10px] font-semibold tracking-wide">
              <FileCheck className="w-3 h-3 text-[#FF4D2D]" />
              <span>A4 PDF Document</span>
              <span className="text-white/40">•</span>
              <span>{templateName}</span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">{candidateName}</h3>
            <p className="text-xs text-slate-300 font-medium">{targetTitle}</p>
          </div>

          {/* Readiness Score Chip */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2">
            <span className="text-[10px] text-slate-300 font-medium">
              {isAr ? 'توافق ATS' : 'ATS Score'}
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-base font-black ${
                  readinessScore >= 80
                    ? 'text-emerald-400'
                    : readinessScore >= 50
                    ? 'text-amber-400'
                    : 'text-[#FF4D2D]'
                }`}
              >
                {readinessScore}%
              </span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

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
            <span>{isAr ? 'ملف PDF متجهي فائق الدقة' : 'Vector High-Res PDF'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{isAr ? 'متوافق 100% مع أنظمة ATS' : '100% ATS Compatible'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{isAr ? 'بدون أي علامة مائية' : 'No Watermarks'}</span>
          </div>
        </div>
      </div>

      {/* 2. Compact Quality & Improvement Tips (Uncluttered) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                issues.length === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}
            >
              {issues.length === 0 ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#001639]">
                {issues.length === 0
                  ? isAr
                    ? 'كافة الأقسام مكتملة بنجاح'
                    : 'All key sections are complete'
                  : isAr
                  ? `ملاحظات مقترحة قبل التقديم (${issues.length})`
                  : `Suggestions before applying (${issues.length})`}
              </h4>
              <p className="text-[11px] text-slate-500">
                {issues.length === 0
                  ? isAr
                    ? 'سيرتك الذاتية في جاهزية ممتازة للفرز الآلي والمقابلات.'
                    : 'Your resume is in great shape for ATS scans and hiring teams.'
                  : isAr
                  ? 'تحسينات اختيارية لزيادة قوة سيرتك وتوافقها مع خوارزميات التوظيف.'
                  : 'Optional adjustments to further boost your hiring chances.'}
              </p>
            </div>
          </div>

          {issues.length > 0 && (
            <button
              type="button"
              onClick={() => setShowImprovements((prev) => !prev)}
              className="px-2.5 py-1.5 text-xs font-semibold text-[#001639] bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition cursor-pointer"
            >
              <span>{showImprovements ? (isAr ? 'إخفاء' : 'Hide') : isAr ? 'عرض' : 'Show'}</span>
              {showImprovements ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Collapsible Suggestion Items */}
        {issues.length > 0 && showImprovements && (
          <div className="pt-2 border-t border-slate-100 space-y-2">
            {issues.map((issue, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <span className="font-bold text-[#001639] block truncate">
                    {isAr ? issue.titleAr : issue.titleEn}
                  </span>
                  <span className="text-[11px] text-slate-500 block truncate">
                    {isAr ? issue.descAr : issue.descEn}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab(issue.id as any)}
                  className="px-3 py-1 bg-white hover:bg-slate-100 text-[#001639] border border-slate-200 font-semibold rounded-lg text-[11px] flex items-center gap-1 shrink-0 transition cursor-pointer shadow-2xs"
                >
                  <Edit3 className="w-3 h-3 text-[#FF4D2D]" />
                  <span>{isAr ? 'تعديل' : 'Edit'}</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Quick Tweaks / Next Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {/* Customize style card */}
        <button
          type="button"
          onClick={() => setActiveTab('customize')}
          className="p-3.5 bg-white border border-slate-200 hover:border-[#001639]/40 rounded-2xl text-start transition flex items-center justify-between gap-3 shadow-2xs group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#001639] group-hover:bg-[#001639] group-hover:text-white flex items-center justify-center shrink-0 transition">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#001639]">
                {isAr ? 'تخصيص القالب والمظهر' : 'Template & Colors'}
              </h4>
              <p className="text-[11px] text-slate-500">
                {isAr ? 'تغيير التصميم والألوان والخطوط' : 'Change theme, font, and layout'}
              </p>
            </div>
          </div>
          <span className="text-slate-400 group-hover:text-[#001639] text-xs font-bold transition">
            {isAr ? '←' : '→'}
          </span>
        </button>

        {/* ATS match scan card */}
        <button
          type="button"
          onClick={() => setActiveTab('ats' as any)}
          className="p-3.5 bg-white border border-slate-200 hover:border-[#001639]/40 rounded-2xl text-start transition flex items-center justify-between gap-3 shadow-2xs group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF4D2D] group-hover:bg-[#FF4D2D] group-hover:text-white flex items-center justify-center shrink-0 transition">
              <FileSearch className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#001639]">
                {isAr ? 'فحص الكلمات المفتاحية ATS' : 'ATS Keyword Match'}
              </h4>
              <p className="text-[11px] text-slate-500">
                {isAr ? 'مطابقة السيرة مع إعلان وظيفة' : 'Match resume with job description'}
              </p>
            </div>
          </div>
          <span className="text-slate-400 group-hover:text-[#001639] text-xs font-bold transition">
            {isAr ? '←' : '→'}
          </span>
        </button>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={resumeData}
        settings={settings}
      />
    </div>
  );
};
