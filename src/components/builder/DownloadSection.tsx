import React, { useState, useMemo } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import {
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck2,
  Loader2,
  Edit3,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Info,
  Share2,
  MessageSquare,
  Mail,
  Copy,
} from 'lucide-react';
import { useResumeExport } from '../../hooks/useResumeExport';
import { ShareModal } from '../common/ShareModal';
import confetti from 'canvas-confetti';

interface SectionAudit {
  id: 'personal' | 'experiences' | 'education' | 'skills' | 'projects' | 'certifications';
  nameAr: string;
  nameEn: string;
  icon: React.ElementType;
  status: 'good' | 'warning' | 'critical';
  problemAr?: string;
  problemEn?: string;
  actionAr: string;
  actionEn: string;
}

export const DownloadSection: React.FC = () => {
  const { requestPdfExport } = useResumeExport();
  const {
    resumeData,
    settings,
    activation,
    useDownloadQuota,
    setIsActivationModalOpen,
    setActiveTab,
  } = useResumeStore();

  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Safe Section Readiness Auditor Logic
  const auditResults = useMemo(() => {
    const audits: SectionAudit[] = [];

    // 1. Personal & Contact Information
    const p = resumeData.personalInfo;
    const hasName = Boolean(p.fullName && p.fullName.trim().length > 0);
    const hasEmail = Boolean(p.email && p.email.trim().length > 0);
    const validEmail = !hasEmail || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email.trim());
    const hasPhone = Boolean(p.phone && p.phone.trim().length > 0);

    if (!hasName || !hasEmail || !validEmail) {
      audits.push({
        id: 'personal',
        nameAr: 'معلومات الاتصال والشخصية',
        nameEn: 'Contact Information',
        icon: User,
        status: !hasName ? 'critical' : 'warning',
        problemAr: !hasName
          ? 'اسمك غير مكتمل في السيرة'
          : !validEmail
          ? 'صيغة البريد الإلكتروني غير صحيحة'
          : 'من الأفضل إضافة رقم هاتف مباشر',
        problemEn: !hasName
          ? 'Full name is required'
          : !validEmail
          ? 'Invalid email format'
          : 'Adding a contact phone number is recommended',
        actionAr: 'تحديث البيانات الشخصية',
        actionEn: 'Update Contact Info',
      });
    } else {
      audits.push({
        id: 'personal',
        nameAr: 'معلومات الاتصال والشخصية',
        nameEn: 'Contact Information',
        icon: User,
        status: 'good',
        actionAr: 'مراجعة البيانات',
        actionEn: 'Review Details',
      });
    }

    // 2. Professional Summary
    const hasSummary = Boolean(p.summary && p.summary.trim().length >= 20);
    if (!hasSummary) {
      audits.push({
        id: 'personal',
        nameAr: 'الملخص المهني',
        nameEn: 'Professional Summary',
        icon: FileText,
        status: 'warning',
        problemAr: 'الملخص المهني قصير جداً أو فارغ. أضف ملخصاً من 2-3 أسطر لتعزيز توافق ATS.',
        problemEn: 'Summary is missing or too short. Add a 2-3 sentence overview.',
        actionAr: 'إضافة ملخص مهني',
        actionEn: 'Add Summary',
      });
    } else {
      audits.push({
        id: 'personal',
        nameAr: 'الملخص المهني',
        nameEn: 'Professional Summary',
        icon: FileText,
        status: 'good',
        actionAr: 'تعديل الملخص',
        actionEn: 'Edit Summary',
      });
    }

    // 3. Work Experience
    const exp = resumeData.experiences || [];
    const hasExp = exp.length > 0;
    const expComplete = exp.every(
      (e) => e.position && e.position.trim() && e.company && e.company.trim()
    );

    if (!hasExp) {
      audits.push({
        id: 'experiences',
        nameAr: 'الخبرات العملية',
        nameEn: 'Work Experience',
        icon: Briefcase,
        status: 'warning',
        problemAr: 'لم تقم بإضافة أي خبرة عملية بعد (اختياري وحديثو التخرج يمكنهم التخطي).',
        problemEn: 'No work experience added yet (Optional for fresh graduates).',
        actionAr: 'إضافة خبرة عملية',
        actionEn: 'Add Work Experience',
      });
    } else if (!expComplete) {
      audits.push({
        id: 'experiences',
        nameAr: 'الخبرات العملية',
        nameEn: 'Work Experience',
        icon: Briefcase,
        status: 'critical',
        problemAr: 'إحدى الخبرات المضافة تفتقر إلى المسمى الوظيفي أو اسم الشركة.',
        problemEn: 'One of your listed experiences is missing job title or company name.',
        actionAr: 'إكمال بيانات الخبرات',
        actionEn: 'Complete Experience Data',
      });
    } else {
      audits.push({
        id: 'experiences',
        nameAr: 'الخبرات العملية',
        nameEn: 'Work Experience',
        icon: Briefcase,
        status: 'good',
        actionAr: 'إدارة الخبرات',
        actionEn: 'Manage Experience',
      });
    }

    // 4. Education
    const edu = resumeData.education || [];
    const hasEdu = edu.length > 0;
    const eduComplete = edu.every(
      (e) => e.degree && e.degree.trim() && e.institution && e.institution.trim()
    );

    if (!hasEdu) {
      audits.push({
        id: 'education',
        nameAr: 'التعليم والمؤهلات',
        nameEn: 'Education',
        icon: GraduationCap,
        status: 'warning',
        problemAr: 'يفضل إضافة مؤهلك العلمي الأكاديمي لزيادة موثوقية السيرة.',
        problemEn: 'Adding your degree or high school education is recommended.',
        actionAr: 'إضافة المؤهل العلمي',
        actionEn: 'Add Education',
      });
    } else if (!eduComplete) {
      audits.push({
        id: 'education',
        nameAr: 'التعليم والمؤهلات',
        nameEn: 'Education',
        icon: GraduationCap,
        status: 'critical',
        problemAr: 'إحدى المؤهلات المضافة تفتقر للشهادة أو اسم المؤسسة التعليمية.',
        problemEn: 'Missing degree or institution name in your education entry.',
        actionAr: 'إكمال بيانات التعليم',
        actionEn: 'Complete Education',
      });
    } else {
      audits.push({
        id: 'education',
        nameAr: 'التعليم والمؤهلات',
        nameEn: 'Education',
        icon: GraduationCap,
        status: 'good',
        actionAr: 'تعديل التعليم',
        actionEn: 'Edit Education',
      });
    }

    // 5. Skills & Languages
    const skillsCount = (resumeData.skills || []).length;
    if (skillsCount < 3) {
      audits.push({
        id: 'skills',
        nameAr: 'المهارات واللغات',
        nameEn: 'Skills & Languages',
        icon: Wrench,
        status: skillsCount === 0 ? 'critical' : 'warning',
        problemAr: `أضفت ${skillsCount} مهارة فقط. ينصح بأن تحتوي السيرة على 5 مهارات على الأقل لمرور أنظمة ATS.`,
        problemEn: `Only ${skillsCount} skills added. At least 5 skills are recommended for ATS matching.`,
        actionAr: 'إضافة المزيد من المهارات',
        actionEn: 'Add More Skills',
      });
    } else {
      audits.push({
        id: 'skills',
        nameAr: 'المهارات واللغات',
        nameEn: 'Skills & Languages',
        icon: Wrench,
        status: 'good',
        actionAr: 'إدارة المهارات',
        actionEn: 'Manage Skills',
      });
    }

    // 6. Projects (Optional)
    const projectsCount = (resumeData.projects || []).length;
    audits.push({
      id: 'projects',
      nameAr: 'المشاريع والأعمال',
      nameEn: 'Projects',
      icon: FolderGit2,
      status: projectsCount > 0 ? 'good' : 'good',
      problemAr: projectsCount === 0 ? 'قسم اختياري: إضافة مشاريع مميزة تدعم خبراتك' : undefined,
      problemEn: projectsCount === 0 ? 'Optional section: Showcase key projects' : undefined,
      actionAr: 'تعديل المشاريع',
      actionEn: 'Edit Projects',
    });

    // 7. Certifications (Optional)
    const certsCount = (resumeData.certifications || []).length;
    audits.push({
      id: 'certifications',
      nameAr: 'الشهادات المعتمدة',
      nameEn: 'Certifications',
      icon: Award,
      status: 'good',
      actionAr: 'تعديل الشهادات',
      actionEn: 'Edit Certifications',
    });

    return audits;
  }, [resumeData]);

  // Overall Score Calculation based on exact audited standards
  const { overallScore, goodCount, warningCount, criticalCount, readinessLabelAr, readinessLabelEn } =
    useMemo(() => {
      let score = 100;

      let g = 0;
      let w = 0;
      let c = 0;

      auditResults.forEach((audit) => {
        if (audit.status === 'good') g++;
        if (audit.status === 'warning') {
          w++;
          score -= 10;
        }
        if (audit.status === 'critical') {
          c++;
          score -= 22;
        }
      });

      const finalScore = Math.max(30, Math.min(100, score));

      let labelAr = 'توافق ممتازة مع أنظمة ATS';
      let labelEn = 'Strong ATS readiness';

      if (finalScore < 85 && finalScore >= 65) {
        labelAr = 'تحتاج تحسينات بسيطة للجاهزية المكتملة';
        labelEn = 'Needs a few improvements';
      } else if (finalScore < 65) {
        labelAr = 'تتطلب معالجة بعض النقاط الأساسية قبل التصدير';
        labelEn = 'Requires fixing key sections';
      }

      return {
        overallScore: finalScore,
        goodCount: g,
        warningCount: w,
        criticalCount: c,
        readinessLabelAr: labelAr,
        readinessLabelEn: labelEn,
      };
    }, [auditResults]);

  const handleExport = () => {
    requestPdfExport('finish_step');
  };

  const ArrowNav = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-6 text-xs text-slate-800" aria-live="polite">
      {/* Header */}
      <div className="border-b pb-3 border-slate-200">
        <h2 className="text-base font-extrabold text-[#0B1120] flex items-center gap-2">
          <Download className="w-5 h-5 text-[#001639]" />
          <span>{isAr ? 'مراجعة السيرة الذاتية والتصدير' : 'Resume Review & Export'}</span>
        </h2>
        <p className="text-xs text-[#52627A]">
          {isAr
            ? 'فحص شامل لجاهزية السيرة الذاتية، التنسيق، وتوافق القراءة الآلية ATS قبل التحميل.'
            : 'Comprehensive completeness audit, layout review, and ATS parser readiness before export.'}
        </p>
      </div>

      {/* 1. Resume Readiness Score Card */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
              {isAr ? 'مؤشر الجاهزية والتوافق مع ATS' : 'ATS READINESS OVERALL SCORE'}
            </span>
            <h3 className="text-base font-extrabold text-[#0B1120]">
              {isAr ? readinessLabelAr : readinessLabelEn}
            </h3>
            <p className="text-xs text-[#52627A]">
              {isAr
                ? 'تقدير بناءً على اكتمال الحقول الهيكلية ووضوح بيانات التوافق الآلي.'
                : 'Estimated compatibility based on completed structural sections and readable data.'}
            </p>
          </div>

          {/* Radial score box */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              role="progressbar"
              aria-valuenow={overallScore}
              aria-valuemin={0}
              aria-valuemax={100}
              className={`w-16 h-16 rounded-2xl border-2 flex flex-col items-center justify-center font-black text-xl shadow-xs ${
                overallScore >= 85
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                  : overallScore >= 65
                  ? 'bg-amber-50 border-amber-500 text-amber-800'
                  : 'bg-rose-50 border-rose-500 text-rose-700'
              }`}
            >
              <span>{overallScore}%</span>
            </div>
          </div>
        </div>

        {/* Breakdown Stats Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold">
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {goodCount} {isAr ? 'أقسام مكتملة' : 'Complete'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              {warningCount} {isAr ? 'ملاحظات تحسين' : 'To Improve'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span>
              {criticalCount} {isAr ? 'حقول حرجة' : 'Critical'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Section Audit Items */}
      <div className="space-y-3">
        <h3 className="font-semibold text-xs text-[#0B1120] uppercase tracking-wider">
          {isAr ? 'نتائج فحص أقسام السيرة:' : 'Section Breakdown Audit:'}
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          {auditResults.map((audit) => {
            const Icon = audit.icon;
            const isGood = audit.status === 'good';
            const isWarn = audit.status === 'warning';

            return (
              <div
                key={audit.nameEn}
                className={`p-3.5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isGood
                    ? 'bg-slate-50/80 border-slate-200'
                    : isWarn
                    ? 'bg-amber-50/60 border-amber-200'
                    : 'bg-rose-50/60 border-rose-200'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      isGood
                        ? 'bg-emerald-100 text-emerald-700'
                        : isWarn
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-[#0B1120] text-xs">
                        {isAr ? audit.nameAr : audit.nameEn}
                      </span>
                      {isGood ? (
                        <span className="text-[10px] font-medium text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                          {isAr ? 'مكتمل' : 'Complete'}
                        </span>
                      ) : isWarn ? (
                        <span className="text-[10px] font-medium text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-full">
                          {isAr ? 'ملاحظة تحسين' : 'Needs attention'}
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-rose-800 bg-rose-100/90 px-2 py-0.5 rounded-full">
                          {isAr ? 'حقل مطلوب' : 'Required'}
                        </span>
                      )}
                    </div>

                    {(audit.problemAr || audit.problemEn) && (
                      <p className="text-[11px] text-slate-600 font-normal leading-relaxed">
                        {isAr ? audit.problemAr : audit.problemEn}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex sm:shrink-0 pt-1 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => setActiveTab(audit.id as any)}
                    className="w-full sm:w-auto px-4 py-1.5 bg-white hover:bg-slate-100 text-[#001639] border border-slate-300 hover:border-[#001639] rounded-xl font-medium text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs min-h-[36px]"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#FF4D2D]" />
                    <span>{isAr ? audit.actionAr : audit.actionEn}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Export CTA Card */}
      <div className="p-5 sm:p-6 bg-[#001639] text-white rounded-3xl space-y-5 shadow-lg border border-[#000F27]">
        <div className="flex items-center gap-3 border-b border-slate-700/80 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm text-white">
              {isAr ? 'تصدير السيرة الذاتية المهيأة للـ ATS' : 'Ready for ATS-Optimized Export'}
            </div>
            <div className="text-[11px] text-slate-300 font-normal">
              {isAr
                ? 'ملف PDF متجهي عالي الدقة بدون علامات مائية ومتوافق 100% مع أنظمة الفرز'
                : 'High-res vector PDF without watermarks, 100% compatible with scanners'}
            </div>
          </div>
        </div>

        {/* Primary Download CTA Button */}
        <div className="text-center space-y-3 pt-1">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#FF4D2D] hover:bg-[#E5431F] active:bg-[#CC3A1A] text-white font-bold text-sm rounded-full shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 min-h-[48px]"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{isAr ? 'جاري إنشاء ملف PDF التوافقية...' : 'Generating High-Res PDF...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>{isAr ? 'تحميل السيرة الذاتية بصيغة PDF' : 'Download PDF Resume'}</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </>
              )}
            </button>

            {/* Instant 1-Click Share Button */}
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-full border border-white/20 shadow-md transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              <Share2 className="w-4 h-4 text-orange-400" />
              <span>{isAr ? 'مشاركة سريعة (واتساب / إيميل)' : 'Instant 1-Click Share'}</span>
            </button>
          </div>

          {exportSuccess && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-200 text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {isAr
                  ? 'تم تجهيز وتنزيل ملف السيرة الذاتية بنجاح!'
                  : 'Resume PDF exported successfully!'}
              </span>
            </div>
          )}

          {exportError && (
            <div className="p-3 bg-rose-500/20 border border-rose-400/40 rounded-xl text-rose-200 text-xs font-bold flex items-center justify-center gap-2">
              <XCircle className="w-4 h-4 text-rose-400" />
              <span>{exportError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300 pt-2 text-start sm:text-center">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{isAr ? 'متوافق مع أنظمة الفلترة ATS' : 'ATS Parsable Format'}</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{isAr ? 'خطوط عربية وإنجليزية المتجهات' : 'Vector Typography'}</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{isAr ? 'تصدير بدون علامات مائية' : 'No Watermark'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Instant 1-Click Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={resumeData}
        settings={settings}
      />
    </div>
  );
};
