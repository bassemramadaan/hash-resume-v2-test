import React, { useState, useDeferredValue } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { BassuxAtsTemplate } from './templates/BassuxAtsTemplate';
import { ModernAtsTemplate } from './templates/ModernAtsTemplate';
import { ClassicProfessionalTemplate } from './templates/ClassicProfessionalTemplate';
import { MinimalExecTemplate } from './templates/MinimalExecTemplate';
import { TechnicalCleanTemplate } from './templates/TechnicalCleanTemplate';
import { CreativeCompactTemplate } from './templates/CreativeCompactTemplate';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Palette,
  Layout,
  Type,
  X,
  Share2,
} from 'lucide-react';
import { useResumeExport } from '../../hooks/useResumeExport';
import { ShareModal } from '../common/ShareModal';
import { getTranslation } from '../../i18n/translations';
import { TemplateId } from '../../types/resume';
import { isResumeBlank } from '../../utils/resumeFingerprint';
import { motion, AnimatePresence } from 'motion/react';

const QUICK_COLORS = [
  '#001639', // Navy
  '#1e40af', // Slate Blue
  '#0f766e', // Teal
  '#111827', // Charcoal
  '#4f46e5', // Indigo
  '#b91c1c', // Crimson
  '#047857', // Emerald
];

const TEMPLATES: { id: TemplateId; labelAr: string; labelEn: string }[] = [
  { id: 'bassux', labelAr: 'ATS Classic (BASSUX)', labelEn: 'ATS Classic' },
  { id: 'modern-ats', labelAr: 'Modern ATS', labelEn: 'Modern ATS' },
  { id: 'classic-professional', labelAr: 'Classic', labelEn: 'Classic' },
  { id: 'minimal-exec', labelAr: 'Minimal', labelEn: 'Minimal' },
  { id: 'technical-clean', labelAr: 'Technical', labelEn: 'Technical' },
  { id: 'creative-compact', labelAr: 'Compact', labelEn: 'Compact' },
];

interface ResumeSkeletonPreviewProps {
  isAr: boolean;
  primaryColor: string;
  fontFamily: string;
}

const ResumeSkeletonPreview: React.FC<ResumeSkeletonPreviewProps> = ({
  isAr,
  primaryColor,
  fontFamily,
}) => {
  return (
    <div
      className="p-8 sm:p-12 text-slate-800 space-y-6 select-none animate-in fade-in duration-200"
      style={{
        fontFamily: fontFamily === 'Tajawal' ? 'Tajawal, sans-serif' : 'Inter, sans-serif',
      }}
    >
      {/* Header Skeleton */}
      <header className="border-b-2 pb-5 text-center" style={{ borderColor: primaryColor }}>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-1 uppercase">
          {isAr ? 'اسمك الكامل (YOUR NAME)' : 'YOUR NAME'}
        </h1>
        <p className="text-sm sm:text-base font-bold mb-2" style={{ color: primaryColor }}>
          {isAr ? 'مطور واجهات أمامية (Frontend Developer)' : 'Frontend Developer'}
        </p>
        <p className="text-xs text-slate-500 font-medium">
          email@example.com &nbsp;|&nbsp; +20 100 123 4567 &nbsp;|&nbsp; {isAr ? 'القاهرة، مصر' : 'Cairo, Egypt'}
        </p>
      </header>

      {/* Professional Summary Skeleton */}
      <section className="space-y-2 text-start">
        <h2
          className="text-xs sm:text-sm font-extrabold uppercase tracking-wider pb-1 border-b"
          style={{ color: primaryColor, borderColor: `${primaryColor}30` }}
        >
          {isAr ? 'الملخص المهني' : 'PROFESSIONAL SUMMARY'}
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed font-normal italic">
          {isAr
            ? 'سيظهر ملخصك المهني هنا عند كتابته أو توليده بالذكاء الاصطناعي...'
            : 'Your professional summary will appear here. Highlight your key strengths, domain expertise, and career goals...'}
        </p>
      </section>

      {/* Experience Skeleton */}
      <section className="space-y-2.5 text-start">
        <h2
          className="text-xs sm:text-sm font-extrabold uppercase tracking-wider pb-1 border-b"
          style={{ color: primaryColor, borderColor: `${primaryColor}30` }}
        >
          {isAr ? 'الخبرات المهنية' : 'EXPERIENCE'}
        </h2>
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline text-xs font-bold text-slate-700">
            <span>{isAr ? 'المسمى الوظيفي المستهدف  |  اسم الشركة' : 'Senior Job Title  |  Company Name'}</span>
            <span className="text-slate-400 font-normal">{isAr ? '٢٠٢٢ – حتى الآن' : '2022 – Present'}</span>
          </div>
          <ul className="list-disc list-outside ms-4 text-xs text-slate-500 space-y-1 font-normal italic">
            <li>
              {isAr
                ? 'ستظهر مهامك العملية وإنجازاتك ونتائجك الملموسة هنا...'
                : 'Your work experience, responsibilities, and achievements will appear here...'}
            </li>
            <li>
              {isAr
                ? 'الصياغة المحسنة لمعايير الـ ATS والأرقام والنسب المئوية...'
                : 'Quantifiable metrics and ATS-compliant action verbs formatted automatically...'}
            </li>
          </ul>
        </div>
      </section>

      {/* Education Skeleton */}
      <section className="space-y-2 text-start">
        <h2
          className="text-xs sm:text-sm font-extrabold uppercase tracking-wider pb-1 border-b"
          style={{ color: primaryColor, borderColor: `${primaryColor}30` }}
        >
          {isAr ? 'التعليم والمؤهلات' : 'EDUCATION'}
        </h2>
        <div className="flex justify-between items-baseline text-xs font-bold text-slate-700">
          <span>{isAr ? 'درجة البكالوريوس في التخصص  |  اسم الجامعة' : "Bachelor's Degree  |  University Name"}</span>
          <span className="text-slate-400 font-normal">{isAr ? '٢٠١٨ – ٢٠٢٢' : '2018 – 2022'}</span>
        </div>
      </section>

      {/* Skills Skeleton */}
      <section className="space-y-2 text-start">
        <h2
          className="text-xs sm:text-sm font-extrabold uppercase tracking-wider pb-1 border-b"
          style={{ color: primaryColor, borderColor: `${primaryColor}30` }}
        >
          {isAr ? 'المهارات والقدرات' : 'KEY SKILLS'}
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          {isAr
            ? 'المهارات التقنية  •  حل المشكلات  •  إدارة المشروعات  •  التواصل الفعال  •  أدوات العمل'
            : 'Technical Skills  •  Problem Solving  •  Project Management  •  Team Leadership  •  Core Tools'}
        </p>
      </section>
    </div>
  );
};

export const ResumePreview: React.FC = () => {
  const { requestPdfExport } = useResumeExport();
  const {
    resumeData,
    settings,
    activation,
    useDownloadQuota,
    setIsActivationModalOpen,
    setTemplate,
    setPrimaryColor,
    setSpacing,
    setFontFamily,
  } = useResumeStore();

  // High-Performance deferred data binding to prevent typing latency
  const deferredResumeData = useDeferredValue(resumeData);

  const [zoom, setZoom] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 640) {
      const w = window.innerWidth;
      return w < 380
        ? Math.min(0.44, Math.max(0.26, (w - 16) / 794))
        : Math.min(0.48, Math.max(0.36, (w - 24) / 794));
    }
    return 0.82;
  });
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showQuickToolbar, setShowQuickToolbar] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [emptyWarningToast, setEmptyWarningToast] = useState<string | null>(null);
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const isCurrentResumeBlank = isResumeBlank(deferredResumeData) || !deferredResumeData.personalInfo?.fullName?.trim();

  // Listen to empty download warning events from any trigger
  React.useEffect(() => {
    const handleEmptyWarning = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string }>;
      if (customEvent.detail?.message) {
        setEmptyWarningToast(customEvent.detail.message);
        setTimeout(() => setEmptyWarningToast(null), 4500);
      }
    };
    window.addEventListener('resume:empty-download-warning', handleEmptyWarning);
    return () => window.removeEventListener('resume:empty-download-warning', handleEmptyWarning);
  }, []);

  // Responsive dynamic auto-scale on resize
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        const w = window.innerWidth;
        const mobileFit = w < 380
          ? Math.min(0.44, Math.max(0.26, (w - 16) / 794))
          : Math.min(0.48, Math.max(0.36, (w - 24) / 794));
        setZoom(mobileFit);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.08, 1.3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.08, 0.3));
  const handleZoomReset = () => {
    if (window.innerWidth < 640) {
      setZoom(Math.min(0.48, Math.max(0.36, (window.innerWidth - 32) / 800)));
    } else {
      setZoom(0.82);
    }
  };
  const handleZoomFit = () => {
    if (window.innerWidth < 640) {
      setZoom(Math.min(0.45, Math.max(0.35, (window.innerWidth - 32) / 800)));
    } else {
      setZoom(0.68);
    }
  };

  const handlePdfDownload = () => {
    if (isCurrentResumeBlank) {
      setEmptyWarningToast(
        isAr
          ? 'يرجى إكمال بياناتك الشخصية قبل تحميل السيرة الذاتية.'
          : 'Complete your Personal Information before downloading your CV.'
      );
      setTimeout(() => setEmptyWarningToast(null), 4500);
      return;
    }
    requestPdfExport('preview');
  };

  const renderActiveTemplate = () => {
    switch (settings.templateId) {
      case 'bassux':
        return <BassuxAtsTemplate data={deferredResumeData} settings={settings} />;
      case 'classic-professional':
        return <ClassicProfessionalTemplate data={deferredResumeData} settings={settings} />;
      case 'minimal-exec':
        return <MinimalExecTemplate data={deferredResumeData} settings={settings} />;
      case 'technical-clean':
        return <TechnicalCleanTemplate data={deferredResumeData} settings={settings} />;
      case 'creative-compact':
        return <CreativeCompactTemplate data={deferredResumeData} settings={settings} />;
      case 'modern-ats':
      default:
        return <ModernAtsTemplate data={deferredResumeData} settings={settings} />;
    }
  };

  const isMultiPage = React.useMemo(() => {
    const expCount = deferredResumeData.experiences?.length || 0;
    const eduCount = deferredResumeData.education?.length || 0;
    const projCount = deferredResumeData.projects?.length || 0;
    const certCount = deferredResumeData.certifications?.length || 0;
    const hasSummary = Boolean(deferredResumeData.personalInfo.summary?.trim());
    const totalEntries = expCount + eduCount + projCount + certCount;
    return totalEntries >= 5 || (totalEntries >= 4 && hasSummary);
  }, [deferredResumeData]);

  return (
    <div className="flex flex-col h-full bg-slate-100 text-slate-800 rounded-3xl overflow-hidden border border-[#CBD5E1] shadow-xs">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 py-2.5 bg-white border-b border-[#E2E8F0] text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#E8EEF7] text-[#001639]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D]" />
            <span>{isAr ? 'المعاينة اللحظية' : 'Live Preview'}</span>
          </span>

          <button
            type="button"
            onClick={() => setShowQuickToolbar(!showQuickToolbar)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-medium border flex items-center gap-1.5 transition cursor-pointer ${
              showQuickToolbar
                ? 'bg-[#001639] text-white border-[#001639]'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title={isAr ? 'شريط التخصيص السريع' : 'Quick Style Customizer'}
          >
            <Palette className="w-3 h-3 text-[#FF4D2D]" />
            <span>{isAr ? 'تنسيق سريع' : 'Quick Style'}</span>
          </button>
        </div>

        {/* Zoom & Fullscreen controls */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={handleZoomOut}
            className="p-1 hover:bg-slate-200 rounded text-slate-600 transition cursor-pointer"
            title={isAr ? 'تصغير' : 'Zoom Out'}
            aria-label={isAr ? 'تصغير المعاينة' : 'Zoom Out'}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 font-mono text-[11px] text-slate-700 font-bold">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1 hover:bg-slate-200 rounded text-slate-600 transition cursor-pointer"
            title={isAr ? 'تكبير' : 'Zoom In'}
            aria-label={isAr ? 'تكبير المعاينة' : 'Zoom In'}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomFit}
            className="px-1.5 py-0.5 text-[10px] hover:bg-slate-200 rounded text-slate-600 transition cursor-pointer font-medium"
            title={isAr ? 'ملاءمة العرض' : 'Fit Width'}
          >
            Fit
          </button>
          <button
            onClick={handleZoomReset}
            className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition cursor-pointer"
            title={isAr ? 'إعادة ضبط الحجم' : 'Reset Zoom'}
            aria-label={isAr ? 'إعادة ضبط الحجم' : 'Reset Zoom'}
          >
            <RotateCcw className="w-3 h-3" />
          </button>
          <div className="w-[1px] h-3.5 bg-slate-300 mx-0.5" />
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-1 hover:bg-slate-200 rounded text-[#001639] hover:text-[#FF4D2D] transition cursor-pointer"
            title={isAr ? 'معاينة ملء الشاشة' : 'Fullscreen Preview'}
            aria-label={isAr ? 'معاينة ملء الشاشة' : 'Fullscreen Preview'}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Share Button - Disabled when resume is blank */}
          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            disabled={isCurrentResumeBlank}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium text-xs rounded-full border transition min-h-[34px] ${
              isCurrentResumeBlank
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                : 'bg-slate-100 hover:bg-slate-200 text-[#001639] border-slate-300 cursor-pointer active:scale-95'
            }`}
            title={
              isCurrentResumeBlank
                ? isAr
                  ? 'أدخل بياناتك أولاً لتمكين المشاركة'
                  : 'Fill your info first to enable sharing'
                : isAr
                ? 'مشاركة السيرة الذاتية'
                : 'Share Resume'
            }
          >
            <Share2 className="w-3.5 h-3.5 text-orange-600" />
            <span className="hidden sm:inline">{isAr ? 'مشاركة' : 'Share'}</span>
          </button>

          {/* Quick Export CTA */}
          <button
            onClick={handlePdfDownload}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-semibold text-xs rounded-full shadow-2xs transition transform active:scale-95 disabled:opacity-50 cursor-pointer min-h-[34px]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>
              {isExporting
                ? isAr
                  ? 'جاري التصدير...'
                  : 'Exporting...'
                : isAr
                ? 'تصدير PDF'
                : 'Download PDF'}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Customizer Bar (Expandable) */}
      <AnimatePresence>
        {showQuickToolbar && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 overflow-hidden text-xs space-y-2"
          >
            {/* Row 1: Templates & Colors */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Template Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                <span className="text-[11px] font-medium text-slate-500 shrink-0">
                  {isAr ? 'القالب:' : 'Template:'}
                </span>
                {TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setTemplate(tpl.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer shrink-0 ${
                      settings.templateId === tpl.id
                        ? 'bg-[#001639] text-white shadow-2xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isAr ? tpl.labelAr : tpl.labelEn}
                  </button>
                ))}
              </div>

              {/* Color Swatches */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-medium text-slate-500">
                  {isAr ? 'اللون:' : 'Color:'}
                </span>
                <div className="flex items-center gap-1">
                  {QUICK_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setPrimaryColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-5 h-5 rounded-full transition cursor-pointer transform hover:scale-110 ${
                        settings.primaryColor === c
                          ? 'ring-2 ring-offset-1 ring-[#001639] scale-110'
                          : 'opacity-85 hover:opacity-100'
                      }`}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Row 2: Spacing & Font */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200/60">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-slate-500">
                  {isAr ? 'المسافات:' : 'Density:'}
                </span>
                {(['compact', 'normal', 'spacious'] as const).map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => setSpacing(sp)}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                      settings.spacing === sp
                        ? 'bg-[#001639] text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {sp}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-slate-500">
                  {isAr ? 'الخط:' : 'Font:'}
                </span>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-[11px] text-slate-800 outline-none"
                >
                  <option value="Tajawal">Tajawal (تجوال)</option>
                  <option value="Cairo">Cairo (كايرو)</option>
                  <option value="Almarai">Almarai (المراعي)</option>
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Playfair Display">Playfair Display</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas Scroll Container with Visual Page Break Line */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-2 sm:p-6 flex justify-center items-start bg-slate-200/70 custom-scrollbar relative">
        <div
          className="flex justify-center items-start relative shrink-0 transition-all duration-150 mx-auto"
          style={{
            width: `${Math.round(794 * zoom)}px`,
            minHeight: `${Math.round(1050 * zoom)}px`,
          }}
        >
          <div
            className="transition-transform duration-150 shadow-xl rounded-sm bg-white relative shrink-0"
            style={{
              width: '794px',
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Render Active Template Document or Live Skeleton Preview */}
            <div id="resume-preview-document" className="relative min-h-[1050px]">
              {isCurrentResumeBlank ? (
                <ResumeSkeletonPreview
                  isAr={isAr}
                  primaryColor={settings.primaryColor || '#001639'}
                  fontFamily={settings.fontFamily}
                />
              ) : (
                renderActiveTemplate()
              )}

              {/* Visual Page Break Line (Hidden during PDF export via no-print class) */}
              <div
                className="absolute left-0 right-0 border-b-2 border-dashed border-rose-400 pointer-events-none no-print flex items-center justify-center"
                style={{ top: '1050px' }} // Standard A4 page height boundary
              >
                <span className="bg-rose-50 text-rose-700 border border-rose-300 text-[10px] font-medium px-3 py-0.5 rounded-full shadow-2xs transform -translate-y-1/2">
                  {isAr
                    ? '--- فاصل الصفحة الأولى A4 (صفحة ثانية) ---'
                    : '--- Page 1 Break (A4 Page 2 Begins) ---'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Page Status & Count Bar */}
      <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600 no-print">
        <div className="flex items-center gap-2">
          {isMultiPage ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{isAr ? 'المحتوى قد يستدعي صفحة ثانية' : 'Content may require a second page'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200">
              <span>{isAr ? 'صفحة 1 من 1' : 'Page 1 of 1'}</span>
            </span>
          )}
        </div>

        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          {isAr ? 'نسق A4 القياسي - جاهز للطباعة والتصدير' : 'Standard A4 Format - Print & Export Ready'}
        </span>
      </div>

      {/* Floating Download Warning Toast */}
      <AnimatePresence>
        {emptyWarningToast && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-40 bg-[#001639] text-white px-4 py-3 rounded-2xl shadow-xl border border-amber-400/40 flex items-center gap-3 max-w-md no-print"
          >
            <div className="p-1 bg-amber-400/20 rounded-lg shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 text-xs font-semibold leading-relaxed">
              {emptyWarningToast}
            </div>
            <button
              type="button"
              onClick={() => setEmptyWarningToast(null)}
              className="text-slate-400 hover:text-white p-1 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Preview Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            key="fullscreen-preview-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex flex-col p-3 sm:p-6"
          >
            <motion.div
              key="fullscreen-preview-card"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl flex-1 flex flex-col overflow-hidden shadow-2xl"
            >
              {/* Fullscreen Header Bar */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2.5">
                  <Maximize2 className="w-4 h-4 text-[#001639]" />
                  <span className="font-semibold text-sm text-[#0B1120]">
                    {isAr ? 'معاينة السيرة الذاتية الكاملة (Fullscreen)' : 'Full Resume Document Preview'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePdfDownload}
                    disabled={isExporting}
                    className="px-4 py-2 bg-[#FF4D2D] hover:bg-[#E5431F] text-white text-xs font-semibold rounded-full shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تصدير PDF' : 'Download PDF'}</span>
                  </button>
                  <button
                    onClick={() => setIsFullscreen(false)}
                    className="p-2 text-slate-500 hover:text-slate-900 bg-slate-200/80 rounded-full transition cursor-pointer"
                    title={isAr ? 'إغلاق ملء الشاشة' : 'Close Fullscreen'}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Fullscreen Body */}
              <div className="flex-1 overflow-auto p-6 bg-slate-200 flex justify-center items-start">
                <div className="bg-white shadow-2xl rounded-sm">
                  {renderActiveTemplate()}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        data={resumeData}
        settings={settings}
      />
    </div>
  );
};
