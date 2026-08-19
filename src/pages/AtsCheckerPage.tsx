import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { getTranslation } from '../i18n/translations';
import { analyzeResumeAts, AtsAnalysisResult } from '../services/atsAnalyzer';
import { parseResumeFile } from '../services/resumeParser';
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
  const { settings, targetJobDescription, setTargetJobDescription, setResumeData } = useResumeStore();
  const navigate = useNavigate();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
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

  const handleImportToBuilder = async () => {
    if (!uploadedFile) return;
    setIsImporting(true);
    setFileError(null);
    try {
      const extractedData = await parseResumeFile(uploadedFile, settings.language);
      setResumeData(extractedData);
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
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-xs text-[#52627A]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isAr ? 'أداة فحص التوافق مع أنظمة ATS' : 'ATS Compatibility Checker'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B1120]">
          {isAr ? 'اختبر سيرتك الذاتية مقابل الوصف الوظيفي' : 'Test Your CV Against Target Job Description'}
        </h1>
        <p className="text-xs sm:text-sm text-[#52627A]">
          {isAr
            ? 'احصل على تقييم لدرجة الجاهزية والتوافق التقريبي واستخرج الكلمات المفتاحية الناقصة فوراً.'
            : 'Get an estimated ATS compatibility score and identify missing keyword gaps instantly.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: File Upload & Job Description */}
        <div className="lg:col-span-6 space-y-6">
          {/* 1. PDF Upload Card */}
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-[#0B1120] text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#001639]" />
              <span>{isAr ? '1. رفع ملف السيرة الذاتية (PDF)' : '1. Upload Resume PDF'}</span>
            </h3>

            {/* Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 ${
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
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <div className="font-extrabold text-[#0B1120] text-xs">{uploadedFile.name}</div>
                  <div className="text-[10px] text-slate-500">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB • PDF Document
                  </div>

                  {/* Actions for uploaded file */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImportToBuilder();
                      }}
                      disabled={isImporting}
                      className="w-full sm:w-auto px-4 py-2 bg-[#001639] hover:bg-[#00245E] text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isImporting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>{isAr ? 'جاري الاستخراج والتعبئة...' : 'Extracting CV Data...'}</span>
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-3.5 h-3.5 text-[#FF4D2D]" />
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
                      className="text-[11px] text-rose-600 font-bold hover:underline px-2 py-1 cursor-pointer"
                    >
                      {isAr ? 'إزالة الملف' : 'Remove File'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-[#E8EEF7] text-[#001639] flex items-center justify-center mx-auto">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="font-bold text-[#0B1120] text-xs">
                    {isAr ? 'اسحب ملف الـ PDF هنا، أو اضغط للرفع' : 'Drag & Drop PDF here, or Tap to Upload'}
                  </div>
                  <p className="text-[10px] text-[#52627A]">
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
          <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs space-y-4">
            <h3 className="font-extrabold text-[#0B1120] text-sm flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-[#001639]" />
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
              className="w-full p-3.5 bg-[#F8FAFC] border border-slate-300 rounded-xl text-slate-900 font-normal outline-none focus:ring-2 focus:ring-[#001639] focus:bg-white text-xs leading-relaxed"
            />

            <button
              type="button"
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="w-full py-3.5 bg-[#FF4D2D] hover:bg-[#E5431F] active:bg-[#CC3A1A] text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[48px]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{isAr ? 'جاري الفحص واستخراج المؤشرات...' : 'Analyzing Compatibility...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-white" />
                  <span>{isAr ? 'بدء فحص التوافق المباشر' : 'Run ATS Scan Now'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Analysis Results Display */}
        <div className="lg:col-span-6 space-y-6">
          {analysisResult ? (
            <div className="bg-[#001639] text-white rounded-3xl p-6 shadow-xl border border-[#000F27] space-y-6 animate-in fade-in duration-200">
              {/* Score Badge */}
              <div className="flex items-center justify-between border-b border-slate-700 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {isAr ? 'مؤشر الجاهزية والربط' : 'ESTIMATED COMPATIBILITY SCORE'}
                  </span>
                  <h3 className="text-base font-black text-emerald-400 mt-1">
                    {analysisResult.verdict}
                  </h3>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={analysisResult.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-emerald-500 font-black text-2xl text-emerald-400 flex items-center justify-center shadow-inner shrink-0"
                >
                  {analysisResult.score}%
                </div>
              </div>

              {/* Issues & Strengths */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-300">
                  {isAr ? 'نتائج الفحص الهيكلي:' : 'Structural Audit Results:'}
                </h4>
                <div className="space-y-2">
                  {(analysisResult.issues || []).map((issue) => (
                    <div
                      key={issue.id}
                      className="p-3 bg-slate-900/80 border border-slate-700 rounded-xl space-y-1"
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
                      <p className="text-[11px] text-slate-300 leading-relaxed pl-6 rtl:pl-0 rtl:pr-6">
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
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? 'الكلمات المفتاحية المقترحة للإضافة:' : 'Suggested Keywords To Include:'}</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(analysisResult.missingKeywords || []).map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-amber-500/20 text-amber-200 border border-amber-500/30 rounded-lg font-bold text-[11px]"
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
                  className="w-full py-3 px-5 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <span>{isAr ? 'فتح المحرر وتطبيق التحسينات' : 'Open Builder & Apply Fixes'}</span>
                  <ArrowIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-[#001639] flex items-center justify-center mx-auto border border-slate-200 shadow-2xs">
                <ShieldCheck className="w-7 h-7 text-[#FF4D2D]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-900 text-sm">
                  {isAr ? 'لوحة تقرير توافق الـ ATS' : 'ATS Compliance Audit Output'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  {isAr
                    ? 'ارفع ملف السيرة الذاتية (PDF) وأدخل متطلبات الوظيفة للحصول على فحص دقيق لمعدل التوافق والكلمات المفتاحية الناقصة.'
                    : 'Upload your PDF resume and target job requirements to get a granular compatibility score and keyword breakdown.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
