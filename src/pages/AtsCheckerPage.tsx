import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../store/useResumeStore';
import { getTranslation } from '../i18n/translations';
import { analyzeResumeAts, AtsAnalysisResult } from '../services/atsAnalyzer';
import { parseResumeFile } from '../services/resumeParser';
import { isResumeBlank } from '../utils/resumeFingerprint';
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  FileText,
  FileSearch,
  Check,
  Info,
  Loader2,
  Edit3,
} from 'lucide-react';

export const AtsCheckerPage: React.FC = () => {
  const { resumeData, settings, targetJobDescription, setTargetJobDescription, setResumeData } = useResumeStore();
  const navigate = useNavigate();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [isImportConfirmModalOpen, setIsImportConfirmModalOpen] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AtsAnalysisResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Drag & Drop / File Selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file: File) => {
    setFileError(null);
    // Check if PDF
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setFileError(
        isAr
          ? 'نوع الملف غير مقبول. يرجى رفع ملف بصيغة PDF حصراً.'
          : 'Invalid file format. Please upload a PDF resume file.'
      );
      return;
    }

    // Check size limit (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError(
        isAr
          ? 'حجم الملف يتجاوز الحد الأقصى المسموح (5 ميجابايت).'
          : 'File size exceeds the 5MB maximum limit.'
      );
      return;
    }

    setUploadedFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    setFileError(null);
    try {
      const result = await analyzeResumeAts(uploadedFile, targetJobDescription, settings.language);
      setAnalysisResult(result);
    } catch (err) {
      console.error('ATS Analysis Error:', err);
      setFileError(
        isAr
          ? 'حدث خطأ أثناء فحص الملف. يرجى المحاولة مرة أخرى.'
          : 'Error analyzing file. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImportToBuilder = () => {
    if (!uploadedFile) return;
    if (isResumeBlank(resumeData)) {
      executeImport();
    } else {
      setIsImportConfirmModalOpen(true);
    }
  };

  const executeImport = async () => {
    if (!uploadedFile) return;
    setIsImporting(true);
    setFileError(null);
    try {
      const result = await parseResumeFile(uploadedFile, settings.language);
      setResumeData(result.resumeData);
      navigate('/builder');
    } catch (err: any) {
      console.error('Import Error:', err);
      setFileError(
        isAr
          ? 'تعذر استخراج البيانات من الملف. يرجى المحاولة مرة أخرى.'
          : 'Failed to extract CV data. Please try again.'
      );
    } finally {
      setIsImporting(false);
    }
  };

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 text-xs text-[#52627A]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{isAr ? 'أداة فحص التوافق مع أنظمة ATS' : 'ATS Compatibility Checker'}</span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0B1120] tracking-tight leading-tight">
          {isAr ? 'اختبر سيرتك الذاتية مقابل الوصف الوظيفي' : 'Test Your CV Against Target Job Description'}
        </h1>
        <p className="text-xs sm:text-sm text-[#52627A] leading-relaxed">
          {isAr
            ? 'احصل على تقييم لدرجة الجاهزية والتوافق واستخرج الكلمات المفتاحية الناقصة فوراً.'
            : 'Get an estimated ATS compatibility score and identify missing keyword gaps instantly.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column: File Upload & Job Description */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-6">
          {/* 1. PDF Upload Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E2E8F0] p-4.5 sm:p-6 shadow-xs space-y-3.5">
            <h3 className="font-extrabold text-[#0B1120] text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#001639] shrink-0" />
              <span>{isAr ? '1. رفع ملف السيرة الذاتية (PDF)' : '1. Upload Resume PDF'}</span>
            </h3>

            {/* Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2.5 sm:gap-3 ${
                uploadedFile
                  ? 'border-emerald-300 bg-emerald-50/50'
                  : 'border-slate-300 hover:border-[#001639] bg-[#F8FAFC]'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,application/pdf"
                className="hidden"
              />

              {uploadedFile ? (
                <div className="space-y-2 w-full">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div className="font-extrabold text-[#0B1120] text-xs break-all sm:break-normal">{uploadedFile.name}</div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                  </div>

                  {/* Actions for uploaded file */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2 w-full">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImportToBuilder();
                      }}
                      disabled={isImporting}
                      className="w-full sm:w-auto px-4 py-2.5 bg-[#001639] hover:bg-[#00245E] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 min-h-[42px]"
                    >
                      {isImporting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                          <span>{isAr ? 'جاري الاستخراج والتعبئة...' : 'Extracting CV Data...'}</span>
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-3.5 h-3.5 text-[#FF4D2D] shrink-0" />
                          <span>{isAr ? 'استيراد وتعبئة البيانات في المحرر' : 'Import CV Data to Builder'}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFile(null);
                      }}
                      className="text-xs text-rose-600 font-bold hover:underline px-3 py-1.5 cursor-pointer min-h-[36px] flex items-center justify-center"
                    >
                      {isAr ? 'إزالة الملف' : 'Remove File'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#E8EEF7] text-[#001639] flex items-center justify-center mx-auto shrink-0">
                    <UploadCloud className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
                  </div>
                  <div className="font-bold text-[#0B1120] text-xs sm:text-sm">
                    {isAr ? 'اسحب ملف الـ PDF هنا، أو اضغط للرفع' : 'Drag & Drop PDF here, or Tap to Upload'}
                  </div>
                  <p className="text-[11px] text-[#52627A]">
                    {isAr ? 'يُقبل ملفات PDF فقط (بحد أقصى 5 ميجابايت)' : 'PDF format only (Max 5MB)'}
                  </p>
                </div>
              )}
            </div>

            {fileError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}
          </div>

          {/* 2. Job Description Input */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E2E8F0] p-4.5 sm:p-6 shadow-xs space-y-3.5 sm:space-y-4">
            <h3 className="font-extrabold text-[#0B1120] text-sm flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-[#001639] shrink-0" />
              <span>
                {isAr ? '2. الوصف الوظيفي المستهدف (Job Description)' : '2. Target Job Description'}
              </span>
            </h3>

            <textarea
              rows={5}
              value={targetJobDescription}
              onChange={(e) => setTargetJobDescription(e.target.value)}
              placeholder={
                isAr
                  ? 'الصق متطلبات وشروط الوظيفة هنا (مثال: متطلبات الخبرة، لغات البرمجة، والمهارات المطلوبة)...'
                  : 'Paste the target job requirements, skills, and qualifications here...'
              }
              className="w-full p-3 sm:p-3.5 bg-[#F8FAFC] border border-slate-300 rounded-xl text-slate-900 font-normal outline-none focus:ring-2 focus:ring-[#001639] focus:bg-white text-xs sm:text-sm leading-relaxed"
            />

            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="btn-folded-corner w-full py-3 sm:py-3.5 bg-[#FF4D2D] hover:bg-[#E5431F] active:bg-[#CC3A1A] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[48px]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>{isAr ? 'جارِ تحليل السيرة الذاتية...' : 'Analyzing your resume...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-white shrink-0" />
                  <span>{isAr ? 'بدء فحص التوافق المباشر' : 'Run ATS Scan Now'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Analysis Results Display */}
        <div className="lg:col-span-6 space-y-4 sm:space-y-6">
          {analysisResult ? (
            <div className="bg-[#001639] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl border border-[#000F27] space-y-5 sm:space-y-6 animate-in fade-in duration-200">
              {/* Score Badge */}
              <div className="flex items-center justify-between border-b border-slate-700 pb-4 ats-result-card gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    {isAr ? 'مؤشر الجاهزية والربط' : 'ESTIMATED COMPATIBILITY SCORE'}
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-emerald-400 mt-1">
                    {analysisResult.verdict}
                  </h3>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={analysisResult.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-900 border-2 border-emerald-500 font-black text-xl sm:text-2xl text-emerald-400 flex items-center justify-center shadow-inner shrink-0"
                >
                  {analysisResult.score}%
                </div>
              </div>

              {/* Issues & Strengths */}
              <div className="space-y-3 ats-result-card">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-300">
                  {isAr ? 'نتائج الفحص الهيكلي:' : 'Structural Audit Results:'}
                </h4>
                <div className="space-y-2">
                  {(analysisResult.issues || []).map((issue) => (
                    <div
                      key={issue.id}
                      className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl space-y-1 ats-result-card"
                    >
                      <div className="flex items-center gap-2 font-bold text-xs">
                        {issue.type === 'success' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {issue.type === 'warning' && (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        {issue.type === 'error' && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                        <span className="text-slate-100">{issue.title}</span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed pl-6 rtl:pl-0 rtl:pr-6">
                        {issue.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              {(analysisResult.missingKeywords?.length || 0) > 0 && (
                <div className="space-y-2 border-t border-slate-700 pt-4">
                  <h4 className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{isAr ? 'الكلمات المفتاحية المقترحة للإضافة:' : 'Suggested Keywords To Include:'}</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(analysisResult.missingKeywords || []).map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-amber-500/20 text-amber-200 border border-amber-500/30 rounded-lg font-bold text-xs"
                      >
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action to Builder */}
              <div className="pt-2 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/builder')}
                  className="w-full py-3 px-5 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer min-h-[46px]"
                >
                  <span>{isAr ? 'فتح المحرر وتطبيق التحسينات' : 'Open Builder & Apply Fixes'}</span>
                  <ArrowIcon className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-6 sm:p-8 text-center space-y-3.5 sm:space-y-4 shadow-2xs">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-slate-100 text-[#001639] flex items-center justify-center mx-auto border border-slate-200 shadow-2xs shrink-0">
                <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF4D2D] shrink-0" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  {isAr ? 'لوحة تقرير توافق الـ ATS' : 'ATS Compliance Audit Output'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                  {isAr
                    ? 'ارفع ملف السيرة الذاتية (PDF) وأدخل متطلبات الوظيفة للحصول على فحص دقيق لمعدل التوافق والكلمات المفتاحية الناقصة.'
                    : 'Upload your PDF resume and target job requirements to get a granular compatibility score and keyword breakdown.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Smart Confirmation Modal for ATS File Import */}
      <AnimatePresence>
        {isImportConfirmModalOpen && (
          <motion.div
            key="import-confirm-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          >
            <motion.div
              key="import-confirm-card"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-5 sm:p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {t.importConfirmTitle || 'استيراد بيانات السيرة الذاتية إلى المحرر'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                    {t.importConfirmDesc || 'لديك مسودة حالية في المحرر، هل تريد استبدالها ببيانات هذا الملف، أم فتح المسودة الحالية؟'}
                  </p>
                </div>

                <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-right text-xs text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    {isAr
                      ? 'اختيارك لاستبدال البيانات سيؤدي لتعبئة المحرر ببيانات الملف الجديد بدلاً من المسودة الحالية.'
                      : 'Replacing will overwrite your current builder draft with data extracted from this PDF.'}
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  {/* 1. Replace with imported data */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsImportConfirmModalOpen(false);
                      executeImport();
                    }}
                    disabled={isImporting}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#001639] hover:bg-[#00245E] text-white text-xs sm:text-sm font-bold transition shadow-xs flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                  >
                    <Edit3 className="w-4 h-4 text-amber-400" />
                    <span>{t.importReplaceBtn || 'استبدال بالبيانات المستوردة'}</span>
                  </button>

                  {/* 2. Open current draft */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsImportConfirmModalOpen(false);
                      navigate('/builder');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                  >
                    <FileText className="w-4 h-4 text-slate-600" />
                    <span>{t.importKeepCurrentBtn || 'فتح المسودة الحالية'}</span>
                  </button>

                  {/* 3. Cancel */}
                  <button
                    type="button"
                    onClick={() => setIsImportConfirmModalOpen(false)}
                    className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold transition cursor-pointer"
                  >
                    {t.importCancelBtn || 'إلغاء'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};
