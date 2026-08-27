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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="import-resume-modal-container"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-[#001639] text-white p-4 sm:p-5 flex items-start justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF4D2D]/20 text-[#FF4D2D] border border-[#FF4D2D]/30 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                {isAr
                  ? 'وجدنا معلومات في سيرتك الذاتية'
                  : 'Information Found in Your CV'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
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
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Information Notice */}
          <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {isAr
                ? 'يرجى مراجعة وتدقيق الحقول بعد الاستيراد للتأكد من دقة الصياغة وتوافقها التام مع محركات الفرز ATS.'
                : 'Please review and verify all fields in the editor after importing to ensure optimal ATS readability.'}
            </p>
          </div>

          {/* Extracted Breakdown Summary */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {isAr ? 'ملخص البيانات المستخرجة' : 'Extracted Data Overview'}
            </h4>

            {/* Personal Info summary */}
            {(summary.detectedName || summary.detectedJobTitle) && (
              <div className="flex items-center gap-2.5 text-xs text-slate-800 pb-2.5 border-b border-slate-200/60">
                <User className="w-4 h-4 text-[#FF4D2D] shrink-0" />
                <span className="font-semibold">{summary.detectedName || (isAr ? 'الاسم' : 'Name')}</span>
                {summary.detectedJobTitle && (
                  <span className="text-slate-500 font-normal">
                    • {summary.detectedJobTitle}
                  </span>
                )}
              </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    {summary.experienceCount}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {isAr ? 'خبرات مهنية' : 'Experiences'}
                  </div>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    {summary.educationCount}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {isAr ? 'مؤهلات تعليمية' : 'Education'}
                  </div>
                </div>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    {summary.skillCount}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {isAr ? 'مهارات مستخرجة' : 'Skills'}
                  </div>
                </div>
              </div>

              {summary.projectCount > 0 && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      {summary.projectCount}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {isAr ? 'مشاريع' : 'Projects'}
                    </div>
                  </div>
                </div>
              )}

              {summary.certificationCount > 0 && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      {summary.certificationCount}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {isAr ? 'شهادات' : 'Certifications'}
                    </div>
                  </div>
                </div>
              )}

              {summary.languageCount > 0 && (
                <div className="bg-white p-2.5 rounded-lg border border-slate-200/60 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-teal-600 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      {summary.languageCount}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {isAr ? 'لغات' : 'Languages'}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Skills chips preview */}
            {resumeData.skills.length > 0 && (
              <div className="pt-2">
                <div className="text-[11px] text-slate-500 mb-1.5 font-medium">
                  {isAr ? 'معاينة المهارات المستخرجة:' : 'Preview Skills:'}
                </div>
                <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                  {resumeData.skills.slice(0, 10).map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white border border-slate-200 text-slate-700 text-[11px] rounded-md"
                    >
                      {s.name}
                    </span>
                  ))}
                  {resumeData.skills.length > 10 && (
                    <span className="px-1.5 py-0.5 text-slate-500 text-[10px]">
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
              <label className="block text-xs font-bold text-slate-700">
                {isAr ? 'طريقة التطبيق في المحرر:' : 'How to apply in Editor:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setImportMode('replace')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                    isAr ? 'text-right' : 'text-left'
                  } ${
                    importMode === 'replace'
                      ? 'border-[#FF4D2D] bg-[#FF4D2D]/5 ring-2 ring-[#FF4D2D]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-bold text-xs text-[#001639]">
                    {isAr ? 'استبدال السيرة الحالية' : 'Replace Current Resume'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {isAr
                      ? 'تعبئة النموذج بالبيانات المستوردة بالكامل'
                      : 'Overwrite form with the imported data'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setImportMode('merge')}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                    isAr ? 'text-right' : 'text-left'
                  } ${
                    importMode === 'merge'
                      ? 'border-[#FF4D2D] bg-[#FF4D2D]/5 ring-2 ring-[#FF4D2D]/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="font-bold text-xs text-[#001639]">
                    {isAr ? 'دمج مع السيرة الحالية' : 'Merge with Current'}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
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
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
          >
            {isAr ? 'إلغاء' : 'Cancel'}
          </button>

          <button
            type="button"
            onClick={handleImport}
            className="px-5 py-2.5 bg-[#001639] hover:bg-[#00245E] text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-[#FF4D2D]" />
            <span>{isAr ? 'استيراد إلى السيرة الذاتية' : 'Import to Resume'}</span>
            {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
