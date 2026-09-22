import React, { useState } from 'react';
import { ResumeData, Language } from '../../types/resume';
import { ParseResult, isResumeEmpty, mergeResumeData } from '../../services/resumeParser';
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Layers,
  Award,
  Globe,
  CheckCircle2,
  X,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface ImportResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  parseResult: ParseResult | null;
  currentResume: ResumeData;
  onConfirmImport: (finalResume: ResumeData, isMerged: boolean) => void;
  language: Language;
}

export const ImportResumeModal: React.FC<ImportResumeModalProps> = ({
  isOpen,
  onClose,
  parseResult,
  currentResume,
  onConfirmImport,
  language,
}) => {
  const isAr = language === 'ar';
  const hasExistingData = !isResumeEmpty(currentResume);

  // If there's existing data, default to merge or replace
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');

  if (!isOpen || !parseResult) return null;

  const { resumeData, summary } = parseResult;

  const handleImport = () => {
    let finalData: ResumeData;
    if (hasExistingData && importMode === 'merge') {
      finalData = mergeResumeData(currentResume, resumeData);
      onConfirmImport(finalData, true);
    } else {
      finalData = resumeData;
      onConfirmImport(finalData, false);
    }
  };

  return (
    <div
      id="import-resume-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="import-resume-modal-container"
        className="bg-white rounded-none shadow-2xl border border-line w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] text-ink"
      >
        {/* Header */}
        <div className="bg-paper text-ink p-4 sm:p-5 flex items-start justify-between border-b border-line relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-none bg-white text-orange border border-line flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5 text-orange" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-tajawal font-bold text-ink leading-tight">
                {isAr
                  ? 'وجدنا معلومات في سيرتك الذاتية'
                  : 'Information Found in Your CV'}
              </h3>
              <p className="text-xs font-ibm-sans text-ink-soft mt-0.5">
                {isAr
                  ? 'هل ترغب في إضافة هذه البيانات إلى المحرر الآن؟'
                  : 'Do you want to add this data to your current resume?'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-ink-soft hover:text-ink p-1 rounded-none hover:bg-paper-2 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Information Notice */}
          <div className="p-3 bg-amber-50/60 border border-amber-300 rounded-none text-amber-950 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="font-ibm-sans leading-relaxed">
              {isAr
                ? 'يرجى مراجعة وتدقيق الحقول بعد الاستيراد للتأكد من دقة الصياغة وتوافقها التام مع محركات الفرز ATS.'
                : 'Please review and verify all fields in the editor after importing to ensure optimal ATS readability.'}
            </p>
          </div>

          {/* Extracted Breakdown Summary */}
          <div className="bg-paper rounded-none p-4 border border-line space-y-3">
            <h4 className="font-ibm-mono text-[10px] font-bold text-ink-soft uppercase tracking-wider">
              {isAr ? 'ملخص البيانات المستخرجة' : 'EXTRACTED DATA OVERVIEW'}
            </h4>

            {/* Personal Info summary */}
            {(summary.detectedName || summary.detectedJobTitle) && (
              <div className="flex items-center gap-2.5 text-xs text-ink pb-2.5 border-b border-line">
                <User className="w-4 h-4 text-orange shrink-0" />
                <span className="font-tajawal font-bold text-ink">{summary.detectedName || (isAr ? 'الاسم' : 'Name')}</span>
                {summary.detectedJobTitle && (
                  <span className="text-ink-soft font-ibm-sans">
                    • {summary.detectedJobTitle}
                  </span>
                )}
              </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              <div className="bg-white p-2.5 rounded-none border border-line flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-orange shrink-0" />
                <div>
                  <div className="font-ibm-mono text-xs font-bold text-ink">
                    {summary.experienceCount}
                  </div>
                  <div className="text-[10px] font-ibm-sans text-ink-soft">
                    {isAr ? 'خبرات مهنية' : 'Experiences'}
                  </div>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-none border border-line flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-orange shrink-0" />
                <div>
                  <div className="font-ibm-mono text-xs font-bold text-ink">
                    {summary.educationCount}
                  </div>
                  <div className="text-[10px] font-ibm-sans text-ink-soft">
                    {isAr ? 'مؤهلات تعليمية' : 'Education'}
                  </div>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-none border border-line flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange shrink-0" />
                <div>
                  <div className="font-ibm-mono text-xs font-bold text-ink">
                    {summary.skillCount}
                  </div>
                  <div className="text-[10px] font-ibm-sans text-ink-soft">
                    {isAr ? 'مهارات مستخرجة' : 'Skills'}
                  </div>
                </div>
              </div>

              {summary.projectCount > 0 && (
                <div className="bg-white p-2.5 rounded-none border border-line flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange shrink-0" />
                  <div>
                    <div className="font-ibm-mono text-xs font-bold text-ink">
                      {summary.projectCount}
                    </div>
                    <div className="text-[10px] font-ibm-sans text-ink-soft">
                      {isAr ? 'مشاريع' : 'Projects'}
                    </div>
                  </div>
                </div>
              )}

              {summary.certificationCount > 0 && (
                <div className="bg-white p-2.5 rounded-none border border-line flex items-center gap-2">
                  <Award className="w-4 h-4 text-orange shrink-0" />
                  <div>
                    <div className="font-ibm-mono text-xs font-bold text-ink">
                      {summary.certificationCount}
                    </div>
                    <div className="text-[10px] font-ibm-sans text-ink-soft">
                      {isAr ? 'شهادات' : 'Certifications'}
                    </div>
                  </div>
                </div>
              )}

              {summary.languageCount > 0 && (
                <div className="bg-white p-2.5 rounded-none border border-line flex items-center gap-2">
                  <Globe className="w-4 h-4 text-orange shrink-0" />
                  <div>
                    <div className="font-ibm-mono text-xs font-bold text-ink">
                      {summary.languageCount}
                    </div>
                    <div className="text-[10px] font-ibm-sans text-ink-soft">
                      {isAr ? 'لغات' : 'Languages'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Skills chips preview */}
            {resumeData.skills.length > 0 && (
              <div className="pt-2">
                <div className="font-ibm-mono text-[10px] text-ink-soft mb-1.5 font-bold uppercase tracking-wider">
                  {isAr ? 'معاينة المهارات المستخرجة:' : 'PREVIEW SKILLS:'}
                </div>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                  {resumeData.skills.slice(0, 10).map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white border border-line text-ink text-xs font-ibm-sans rounded-none"
                    >
                      {s.name}
                    </span>
                  ))}
                  {resumeData.skills.length > 10 && (
                    <span className="px-1.5 py-0.5 text-ink-soft text-xs font-ibm-mono">
                      +{resumeData.skills.length - 10} {isAr ? 'المزيد' : 'more'}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Merge vs Replace Options (if current resume has data) */}
          {hasExistingData && (
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-tajawal font-bold text-ink">
                {isAr ? 'طريقة التطبيق في المحرر:' : 'How to apply in Editor:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setImportMode('replace')}
                  className={`p-3 rounded-none border text-left cursor-pointer transition ${
                    isAr ? 'text-right' : 'text-left'
                  } ${
                    importMode === 'replace'
                      ? 'border-orange bg-orange/5'
                      : 'border-line hover:border-ink bg-white'
                  }`}
                >
                  <div className="font-tajawal font-bold text-xs text-ink">
                    {isAr ? 'استبدال السيرة الحالية' : 'Replace Current Resume'}
                  </div>
                  <div className="text-[11px] font-ibm-sans text-ink-soft mt-0.5">
                    {isAr
                      ? 'تعبئة النموذج بالبيانات المستوردة بالكامل'
                      : 'Overwrite form with the imported data'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setImportMode('merge')}
                  className={`p-3 rounded-none border text-left cursor-pointer transition ${
                    isAr ? 'text-right' : 'text-left'
                  } ${
                    importMode === 'merge'
                      ? 'border-orange bg-orange/5'
                      : 'border-line hover:border-ink bg-white'
                  }`}
                >
                  <div className="font-tajawal font-bold text-xs text-ink">
                    {isAr ? 'دمج مع السيرة الحالية' : 'Merge with Current'}
                  </div>
                  <div className="text-[11px] font-ibm-sans text-ink-soft mt-0.5">
                    {isAr
                      ? 'الاحتفاظ ببياناتك وإضافة الحقول الناقصة'
                      : 'Keep current entries & add new items'}
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-paper border-t border-line flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-ibm-sans font-bold text-ink-soft hover:text-ink hover:bg-paper-2 rounded-none transition cursor-pointer border border-transparent"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleImport}
            className="px-4 py-2 bg-ink hover:bg-ink/90 text-white text-xs font-ibm-sans font-bold rounded-none border border-ink transition flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-orange" />
            <span>{isAr ? 'استيراد إلى السيرة الذاتية' : 'Import to Resume'}</span>
            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
