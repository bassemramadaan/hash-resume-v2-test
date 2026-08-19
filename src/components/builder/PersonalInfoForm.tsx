import React, { useState, useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { parseResumeFile } from '../../services/resumeParser';
import { User, Mail, Phone, MapPin, Linkedin, Github, Sparkles, Image, UploadCloud, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const PersonalInfoForm: React.FC = () => {
  const { resumeData, setPersonalInfo, setResumeData, settings, openAiModal } = useResumeStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';
  const info = resumeData.personalInfo;

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadStatus(isAr ? 'جاري قراءة واستخراج بيانات الملف...' : 'Extracting CV data...');

    try {
      const extractedResume = await parseResumeFile(file, settings.language);
      setResumeData(extractedResume);
      setUploadStatus(
        isAr
          ? 'تم استخراج وتعبئة جميع البيانات بنجاح في المحرر! 🎉'
          : 'All CV fields extracted and filled successfully! 🎉'
      );
      setTimeout(() => setUploadStatus(null), 5000);
    } catch (err: any) {
      console.error('File Upload & Extraction Error:', err);
      setUploadError(
        isAr
          ? 'تعذر استخراج البيانات من هذا الملف. يرجى التأكد من اختيار ملف PDF أو JSON صالح.'
          : 'Failed to parse file. Please select a valid PDF or JSON resume file.'
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
    <div className="space-y-6 text-slate-800">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b pb-3.5 border-slate-100">
        <div>
          <h2 className="text-base font-bold text-[#001639] flex items-center gap-2">
            <User className="w-4 h-4 text-[#FF4D2D]" />
            <span>{t.tabPersonal}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAr
              ? 'البيانات الشخصية ومعلومات الاتصال الأساسية'
              : 'Personal details and primary contact information'}
          </p>
        </div>
      </div>

      {/* CV File Upload & Auto-Fill Compact Card */}
      <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 sm:p-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#001639] text-white flex items-center justify-center shrink-0">
              <UploadCloud className="w-3.5 h-3.5 text-[#FF4D2D]" />
            </div>
            <div>
              <h3 className="font-semibold text-xs text-[#001639]">
                {isAr ? 'استيراد من سيرة ذاتية سابقة' : 'Import from existing CV'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isAr ? 'يدعم PDF أو JSON لتعبئة البيانات تلقائياً' : 'Supports PDF or JSON to auto-fill fields'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full sm:w-auto px-3.5 py-1.5 bg-white hover:bg-slate-100 text-[#001639] font-semibold text-xs rounded-lg border border-slate-200 shadow-2xs transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50 min-h-[34px]"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF4D2D]" />
                <span>{isAr ? 'جاري الاستخراج...' : 'Extracting...'}</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                <span>{isAr ? 'رفع ملف' : 'Upload File'}</span>
              </>
            )}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.json,application/pdf,application/json"
            className="hidden"
          />
        </div>

        {uploadStatus && (
          <div className="mt-2.5 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-medium text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{uploadStatus}</span>
          </div>
        )}

        {uploadError && (
          <div className="mt-2.5 p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 font-medium text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* Main Form Fields Grouping */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label htmlFor="pi-fullname" className="block text-xs font-semibold text-slate-700 mb-1.5">
            {t.fullName} <span className="text-rose-500 font-bold">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5 pointer-events-none" />
            <input
              id="pi-fullname"
              type="text"
              value={info.fullName}
              onChange={(e) => setPersonalInfo({ fullName: e.target.value })}
              placeholder={isAr ? 'أحمد محمود الفقي' : 'Ahmed Mahmoud'}
              className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 h-10 sm:h-11 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
            />
          </div>
        </div>

        {/* Job Title */}
        <div>
          <label htmlFor="pi-jobtitle" className="block text-xs font-semibold text-slate-700 mb-1.5">
            {t.jobTitle} <span className="text-rose-500 font-bold">*</span>
          </label>
          <input
            id="pi-jobtitle"
            type="text"
            value={info.jobTitle}
            onChange={(e) => setPersonalInfo({ jobTitle: e.target.value })}
            placeholder={isAr ? 'مهندس برمجيات أول' : 'Senior Software Engineer'}
            className="w-full px-3.5 h-10 sm:h-11 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="pi-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
            {t.email} <span className="text-rose-500 font-bold">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5 pointer-events-none" />
            <input
              id="pi-email"
              type="email"
              value={info.email}
              onChange={(e) => setPersonalInfo({ email: e.target.value })}
              placeholder="ahmed@example.com"
              className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 h-10 sm:h-11 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="pi-phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
            {t.phone} <span className="text-rose-500 font-bold">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5 pointer-events-none" />
            <input
              id="pi-phone"
              type="text"
              value={info.phone}
              onChange={(e) => setPersonalInfo({ phone: e.target.value })}
              placeholder="+20 100 123 4567"
              className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 h-10 sm:h-11 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="pi-location" className="block text-xs font-semibold text-slate-700 mb-1.5">
            {t.location}
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5 pointer-events-none" />
            <input
              id="pi-location"
              type="text"
              value={info.location}
              onChange={(e) => setPersonalInfo({ location: e.target.value })}
              placeholder={isAr ? 'القاهرة، مصر' : 'Cairo, Egypt'}
              className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 h-10 sm:h-11 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
            />
          </div>
        </div>

        {/* LinkedIn */}
        <div>
          <label htmlFor="pi-linkedin" className="block text-xs font-semibold text-slate-700 mb-1.5">
            {t.linkedin}
          </label>
          <div className="relative">
            <Linkedin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5 pointer-events-none" />
            <input
              id="pi-linkedin"
              type="text"
              value={info.linkedin}
              onChange={(e) => setPersonalInfo({ linkedin: e.target.value })}
              placeholder="linkedin.com/in/username"
              className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 h-10 sm:h-11 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
            />
          </div>
        </div>

        {/* GitHub */}
        <div>
          <label htmlFor="pi-github" className="block text-xs font-semibold text-slate-700 mb-1.5">
            {t.github}
          </label>
          <div className="relative">
            <Github className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5 pointer-events-none" />
            <input
              id="pi-github"
              type="text"
              value={info.github || ''}
              onChange={(e) => setPersonalInfo({ github: e.target.value })}
              placeholder="github.com/username"
              className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 h-10 sm:h-11 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
            />
          </div>
        </div>

        {/* Photo URL */}
        <div>
          <label htmlFor="pi-photo" className="block text-xs font-semibold text-slate-700 mb-1.5">
            {t.photoUrl}
          </label>
          <div className="relative">
            <Image className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3.5 pointer-events-none" />
            <input
              id="pi-photo"
              type="text"
              value={info.photoUrl || ''}
              onChange={(e) => setPersonalInfo({ photoUrl: e.target.value })}
              placeholder="https://example.com/photo.jpg"
              className="w-full pl-10 rtl:pl-3.5 rtl:pr-10 pr-3.5 h-10 sm:h-11 bg-slate-50/60 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Professional Summary Group */}
      <div className="pt-2 space-y-2.5" aria-live="polite">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="pi-summary" className="block text-xs font-semibold text-slate-700">
            {t.summary}
          </label>
          <button
            type="button"
            onClick={() => openAiModal('summary')}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-[#001639] bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition cursor-pointer shrink-0"
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
