import React, { useState, useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { parseResumeFile, ParseResult } from '../../services/resumeParser';
import { ImportResumeModal } from './ImportResumeModal';
import { ResumeData } from '../../types/resume';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Sparkles,
  Image,
  UploadCloud,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
  X,
  Globe,
} from 'lucide-react';

export const PersonalInfoForm: React.FC = () => {
  const { resumeData, setPersonalInfo, setResumeData, settings, openAiModal } = useResumeStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';
  const info = resumeData.personalInfo;

  const [isUploading, setIsUploading] = useState(false);
  const [loadingText, setLoadingText] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Optional fields expansion state
  const [showLinkedIn, setShowLinkedIn] = useState(Boolean(info.linkedin?.trim()));
  const [showGithub, setShowGithub] = useState(Boolean(info.github?.trim()));
  const [showPhoto, setShowPhoto] = useState(Boolean(info.photoUrl?.trim()));

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Email format validation helper
  const isEmailTouched = Boolean(info.email?.trim());
  const isEmailValid =
    !isEmailTouched ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.email?.trim() || '');

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadStatus(null);

    const fileName = file.name.toLowerCase();
    const isPdf = fileName.endsWith('.pdf') || file.type.includes('pdf');
    const isJson = fileName.endsWith('.json') || file.type.includes('json');

    if (!isPdf && !isJson) {
      setUploadError(
        isAr
          ? 'يرجى رفع ملف سيرة ذاتية بصيغة PDF أو JSON.'
          : 'Please upload a PDF or JSON resume file.'
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError(
        isAr ? 'يجب ألا يتجاوز حجم الملف 10 ميجابايت.' : 'The file must be 10 MB or smaller.'
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    setLoadingText(
      isPdf
        ? isAr
          ? 'جاري قراءة السيرة الذاتية (PDF)...'
          : 'Reading your CV…'
        : isAr
        ? 'جاري استيراد السيرة الذاتية...'
        : 'Importing resume…'
    );

    try {
      const result = await parseResumeFile(file, settings.language);
      setParseResult(result);
      setIsConfirmModalOpen(true);
    } catch (err: any) {
      setUploadError(
        err.message ||
          (isAr
            ? 'فشل استيراد السيرة الذاتية. يرجى تجربة ملف آخر أو إدخال البيانات يدوياً.'
            : 'Import failed. Please try another file or fill in the form manually.')
      );
    } finally {
      setIsUploading(false);
      setLoadingText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleConfirmImport = (finalData: ResumeData) => {
    setResumeData(finalData);
    setIsConfirmModalOpen(false);
    setParseResult(null);
    if (finalData.personalInfo.linkedin) setShowLinkedIn(true);
    if (finalData.personalInfo.github) setShowGithub(true);
    if (finalData.personalInfo.photoUrl) setShowPhoto(true);
    setUploadStatus(
      isAr
        ? 'تم استيراد السيرة الذاتية بنجاح. يرجى مراجعة بياناتك وتدقيقها.'
        : 'CV imported successfully. Please review your information.'
    );
    setTimeout(() => {
      setUploadStatus(null);
    }, 6000);
  };

  const SUMMARY_PRESETS = [
    {
      labelAr: '💼 مهني خبير (Experienced)',
      labelEn: '💼 Experienced Pro',
      textAr:
        'مهندس ومطور برمجيات ذو خبرة تفوق 5 سنوات في بناء وتوسيع الأنظمة السحابية والحلول فائقة الأداء، قُدت مشاريع تقنية نجحت في تقليص التكاليف وزيادة كفاءة وسرعة الاستجابة.',
      textEn:
        'Results-driven Professional with 5+ years of experience spearheading scalable product development, optimizing operations, and boosting team velocity through industry-standard agile practices.',
    },
    {
      labelAr: '🎓 خريج جديد / بداية المسار',
      labelEn: '🎓 Entry Level / Graduate',
      textAr:
        'خريج طموح ومتميز أكاديمياً أمتلك أساساً قوياً في المهارات التقنية وحل المشكلات، أبحث عن فرصة لتطبيق المعرفة والمساهمة في تحقيق أهداف المؤسسة بروح الفريق والمبادرة.',
      textEn:
        'Motivated and detail-oriented Graduate with a solid foundation in modern technologies, eager to contribute innovative solutions and collaborate with high-impact teams.',
    },
    {
      labelAr: '🚀 قيادي ومدير فريق (Leadership)',
      labelEn: '🚀 Leadership / Manager',
      textAr:
        'قائد استراتيجي متخصص في إدارة الفرق وتوجيه المشاريع المعقدة لتحقيق مؤشرات الأداء المستهدفة، أجمع بين الرؤية التشغيلية والقدرة على تمكين المواهب لتحقيق نمو مستدام.',
      textEn:
        'Strategic Leader with proven track record in cross-functional team management, delivering high-stakes initiatives on budget, and driving sustainable business growth.',
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 text-slate-800">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b pb-3 border-slate-100">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#001639] flex items-center gap-2">
            <User className="w-4 h-4 text-[#FF4D2D]" />
            <span>{t.tabPersonal}</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            {isAr
              ? 'البيانات الشخصية ومعلومات الاتصال الأساسية'
              : 'Personal details and primary contact information'}
          </p>
        </div>
      </div>

      {/* CV File Upload & Auto-Fill Compact Card */}
      <div
        id="import-cv-section"
        className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 sm:p-3.5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#001639] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <UploadCloud className="w-4 h-4 text-[#FF4D2D]" />
            </div>
            <div>
              <h3 className="font-semibold text-xs text-[#001639] flex items-center gap-1.5">
                <span>{isAr ? 'استيراد من سيرة ذاتية سابقة' : 'Import from existing CV'}</span>
                <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 text-[10px] font-bold rounded">
                  PDF / JSON
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                {isAr
                  ? 'يدعم PDF أو JSON لتعبئة البيانات تلقائياً'
                  : 'Supports PDF or JSON to auto-fill fields'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="import-cv-button"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full sm:w-auto px-4 py-2 bg-white hover:bg-slate-100 text-[#001639] font-bold text-xs rounded-lg border border-slate-200 shadow-2xs transition flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-60 min-h-[40px]"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF4D2D]" />
                  <span>{loadingText}</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 text-[#FF4D2D]" />
                  <span>{isAr ? 'رفع واختيار ملف' : 'Upload CV File'}</span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf,.json,application/json"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>
        </div>

        {uploadStatus && (
          <div
            id="import-success-banner"
            className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-medium text-xs flex items-center gap-2 animate-in fade-in"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{uploadStatus}</span>
          </div>
        )}

        {uploadError && (
          <div
            id="import-error-banner"
            className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 font-medium text-xs flex items-start gap-2 animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{uploadError}</span>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation & Preview Modal */}
      <ImportResumeModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setParseResult(null);
        }}
        parseResult={parseResult}
        currentResume={resumeData}
        onConfirmImport={handleConfirmImport}
        language={settings.language}
      />

      {/* Main Core Form Fields (Single-Column on Mobile, 2-Col on Tablet/Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label htmlFor="pi-fullname" className="block text-xs font-semibold text-slate-700">
            {t.fullName} <span className="text-rose-500 font-bold">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5 pointer-events-none" />
            <input
              id="pi-fullname"
              type="text"
              autoComplete="name"
              value={info.fullName}
              onChange={(e) => setPersonalInfo({ fullName: e.target.value })}
              placeholder={isAr ? 'أحمد محمود الفقي' : 'Ahmed Mahmoud'}
              className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 min-h-[44px] h-11 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
            />
          </div>
        </div>

        {/* Target Job Title */}
        <div className="space-y-1">
          <label htmlFor="pi-jobtitle" className="block text-xs font-semibold text-slate-700">
            {t.jobTitle} <span className="text-rose-500 font-bold">*</span>
          </label>
          <input
            id="pi-jobtitle"
            type="text"
            value={info.jobTitle}
            onChange={(e) => setPersonalInfo({ jobTitle: e.target.value })}
            placeholder={isAr ? 'مهندس برمجيات أول' : 'Senior Software Engineer'}
            className="w-full px-3.5 min-h-[44px] h-11 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
          />
        </div>

        {/* Email Address */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="pi-email" className="block text-xs font-semibold text-slate-700">
              {t.email} <span className="text-rose-500 font-bold">*</span>
            </label>
            {!isEmailValid && (
              <span className="text-[11px] font-semibold text-rose-600">
                {isAr ? 'بريد إلكتروني غير صالح' : 'Invalid email address'}
              </span>
            )}
          </div>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5 pointer-events-none" />
            <input
              id="pi-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              value={info.email}
              onChange={(e) => setPersonalInfo({ email: e.target.value })}
              placeholder="ahmed@example.com"
              className={`w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 min-h-[44px] h-11 bg-slate-50/60 hover:bg-white focus:bg-white border ${
                !isEmailValid
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500'
                  : 'border-slate-200 focus:border-[#001639] focus:ring-[#001639]'
              } rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition`}
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-1">
          <label htmlFor="pi-phone" className="block text-xs font-semibold text-slate-700">
            {t.phone} <span className="text-rose-500 font-bold">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5 pointer-events-none" />
            <input
              id="pi-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={info.phone}
              onChange={(e) => setPersonalInfo({ phone: e.target.value })}
              placeholder="+20 100 123 4567"
              className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 min-h-[44px] h-11 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition text-left rtl:text-right"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1 md:col-span-2">
          <label htmlFor="pi-location" className="block text-xs font-semibold text-slate-700">
            {t.location}
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5 pointer-events-none" />
            <input
              id="pi-location"
              type="text"
              autoComplete="address-level2"
              value={info.location}
              onChange={(e) => setPersonalInfo({ location: e.target.value })}
              placeholder={isAr ? 'القاهرة، مصر' : 'Cairo, Egypt'}
              className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 min-h-[44px] h-11 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
            />
          </div>
        </div>

        {/* Optional Fields Expanded Section */}
        {showLinkedIn && (
          <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between">
              <label htmlFor="pi-linkedin" className="block text-xs font-semibold text-slate-700">
                {t.linkedin}
              </label>
              <button
                type="button"
                onClick={() => {
                  setPersonalInfo({ linkedin: '' });
                  setShowLinkedIn(false);
                }}
                className="text-[11px] text-slate-400 hover:text-rose-600 transition flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>{isAr ? 'إخفاء' : 'Remove'}</span>
              </button>
            </div>
            <div className="relative">
              <Linkedin className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5 pointer-events-none" />
              <input
                id="pi-linkedin"
                type="url"
                inputMode="url"
                autoCapitalize="none"
                value={info.linkedin}
                onChange={(e) => setPersonalInfo({ linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 min-h-[44px] h-11 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
              />
            </div>
          </div>
        )}

        {showGithub && (
          <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between">
              <label htmlFor="pi-github" className="block text-xs font-semibold text-slate-700">
                {t.github}
              </label>
              <button
                type="button"
                onClick={() => {
                  setPersonalInfo({ github: '' });
                  setShowGithub(false);
                }}
                className="text-[11px] text-slate-400 hover:text-rose-600 transition flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>{isAr ? 'إخفاء' : 'Remove'}</span>
              </button>
            </div>
            <div className="relative">
              <Github className="w-4 h-4 text-slate-800 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5 pointer-events-none" />
              <input
                id="pi-github"
                type="url"
                inputMode="url"
                autoCapitalize="none"
                value={info.github || ''}
                onChange={(e) => setPersonalInfo({ github: e.target.value })}
                placeholder="https://github.com/username"
                className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 min-h-[44px] h-11 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
              />
            </div>
          </div>
        )}

        {showPhoto && (
          <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="flex items-center justify-between">
              <label htmlFor="pi-photo" className="block text-xs font-semibold text-slate-700">
                {t.photoUrl}
              </label>
              <button
                type="button"
                onClick={() => {
                  setPersonalInfo({ photoUrl: '' });
                  setShowPhoto(false);
                }}
                className="text-[11px] text-slate-400 hover:text-rose-600 transition flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                <span>{isAr ? 'إخفاء' : 'Remove'}</span>
              </button>
            </div>
            <div className="relative">
              <Image className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5 pointer-events-none" />
              <input
                id="pi-photo"
                type="url"
                inputMode="url"
                autoCapitalize="none"
                value={info.photoUrl || ''}
                onChange={(e) => setPersonalInfo({ photoUrl: e.target.value })}
                placeholder="https://example.com/photo.jpg"
                className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 min-h-[44px] h-11 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
              />
            </div>
          </div>
        )}
      </div>

      {/* Add Optional Fields Quick Buttons */}
      {(!showLinkedIn || !showGithub || !showPhoto) && (
        <div className="pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">
              {isAr ? 'روابط إضافية اختياري:' : 'Optional links:'}
            </span>
            {!showLinkedIn && (
              <button
                type="button"
                onClick={() => setShowLinkedIn(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#001639] text-xs font-semibold rounded-full border border-slate-200 transition cursor-pointer active:scale-95"
              >
                <Plus className="w-3 h-3 text-[#FF4D2D]" />
                <span>{isAr ? '+ إضافة LinkedIn' : '+ Add LinkedIn'}</span>
              </button>
            )}
            {!showGithub && (
              <button
                type="button"
                onClick={() => setShowGithub(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#001639] text-xs font-semibold rounded-full border border-slate-200 transition cursor-pointer active:scale-95"
              >
                <Plus className="w-3 h-3 text-[#FF4D2D]" />
                <span>{isAr ? '+ إضافة GitHub' : '+ Add GitHub'}</span>
              </button>
            )}
            {!showPhoto && (
              <button
                type="button"
                onClick={() => setShowPhoto(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-[#001639] text-xs font-semibold rounded-full border border-slate-200 transition cursor-pointer active:scale-95"
              >
                <Plus className="w-3 h-3 text-[#FF4D2D]" />
                <span>{isAr ? '+ إضافة صورة' : '+ Add Photo'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Professional Summary Group */}
      <div className="pt-2 space-y-2.5" aria-live="polite">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="pi-summary" className="block text-xs font-semibold text-slate-700">
            {t.summary}
          </label>
          <button
            type="button"
            onClick={() => openAiModal('summary')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#001639] bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition cursor-pointer shrink-0 min-h-[34px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D]" />
            <span>{t.aiGenerateSummary}</span>
          </button>
        </div>

        {/* Quick Summary Templates */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-medium">
            {isAr ? 'نماذج سريعة:' : 'Templates:'}
          </span>
          {SUMMARY_PRESETS.map((preset, pIdx) => (
            <button
              key={pIdx}
              type="button"
              onClick={() => setPersonalInfo({ summary: isAr ? preset.textAr : preset.textEn })}
              className="px-2.5 py-1 text-[11px] font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition cursor-pointer"
            >
              {isAr ? preset.labelAr : preset.labelEn}
            </button>
          ))}
        </div>

        <textarea
          id="pi-summary"
          rows={3}
          value={info.summary}
          onChange={(e) => setPersonalInfo({ summary: e.target.value })}
          placeholder={t.summaryPlaceholder}
          className="w-full p-3.5 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 outline-none transition min-h-[100px]"
        />
      </div>
    </div>
  );
};

