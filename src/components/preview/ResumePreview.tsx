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
  FileText,
} from 'lucide-react';
import { useResumeExport } from '../../hooks/useResumeExport';
import { getTranslation } from '../../i18n/translations';
import { TemplateId } from '../../types/resume';
import { isResumeBlank } from '../../utils/resumeFingerprint';
import { motion, AnimatePresence } from 'motion/react';
import { getTemplateFontFamily, ARABIC_FONTS, ENGLISH_FONTS } from '../../utils/resumeFonts';

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
      className="p-8 sm:p-12 text-slate-800 space-y-6 select-none animate-in fade-in duration-200 relative"
      style={{
        fontFamily: getTemplateFontFamily(fontFamily, isAr ? 'ar' : 'en'),
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
    setHeadingFontFamily,
    loadSampleResume,
  } = useResumeStore();

  // High-Performance deferred data binding to prevent typing latency
  const deferredResumeData = useDeferredValue(resumeData);

  const documentRef = React.useRef<HTMLDivElement>(null);
  const canvasContainerRef = React.useRef<HTMLDivElement>(null);
  const [renderedHeight, setRenderedHeight] = useState<number>(1050);

  // Measure exact template content height to calculate accurate page fill percentage
  React.useEffect(() => {
    const el = documentRef.current;
    if (!el) return;

    const measureHeight = () => {
      const child = el.querySelector('.resume-template-container') as HTMLElement | null;
      const h = child ? child.offsetHeight : el.scrollHeight;
      if (h > 0) {
        setRenderedHeight(h);
      }
    };

    measureHeight();

    const observer = new ResizeObserver(() => {
      measureHeight();
    });

    observer.observe(el);
    const child = el.querySelector('.resume-template-container');
    if (child) {
      observer.observe(child);
    }

    return () => observer.disconnect();
  }, [deferredResumeData, settings]);

  // Standard A4 boundary is 1050px in 96 DPI CSS canvas
  const fillPercent = Math.min(Math.round((renderedHeight / 1050) * 100), 200);
  const isMultiPage = fillPercent > 104;

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
  const handleZoomFullRead = () => {
    setZoom(1.0);
  };
  const handleZoomFitWidth = () => {
    if (canvasContainerRef.current) {
      const containerW = canvasContainerRef.current.clientWidth;
      const targetZoom = Math.min(1.2, Math.max(0.35, (containerW - 36) / 794));
      setZoom(Number(targetZoom.toFixed(2)));
    } else {
      setZoom(0.78);
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

  return (
    <div className="flex flex-col h-full bg-white text-slate-800 rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs">
      {/* Top Controls Bar - Streamlined Minimalist Toolbar */}
      <div className="flex items-center justify-between gap-2 px-4 py-2.5 bg-white border-b border-slate-100 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-[11px] text-[#001639] bg-slate-100/90 border border-slate-200/60">
            <span className="w-2 h-2 rounded-full bg-[#FF4D2D]"></span>
            <span>{isAr ? 'معاينة مباشرة A4' : 'A4 Live Preview'}</span>
          </span>

          <button
            type="button"
            onClick={() => setShowQuickToolbar(!showQuickToolbar)}
            className={`px-3 py-1 rounded-lg text-xs font-bold border flex items-center gap-1.5 transition cursor-pointer ${
              showQuickToolbar
                ? 'bg-[#001639] text-white border-[#001639] shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title={isAr ? 'شريط التخصيص السريع' : 'Quick Style Customizer'}
          >
            <Palette className="w-3.5 h-3.5 text-[#FF4D2D]" />
            <span>{isAr ? 'تنسيق سريع' : 'Quick Style'}</span>
          </button>
        </div>

        {/* Streamlined Zoom & View controls */}
        <div className="flex items-center gap-1">
          <div className="flex items-center bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/70">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition cursor-pointer flex items-center justify-center"
              title={isAr ? 'تصغير' : 'Zoom Out'}
              aria-label={isAr ? 'تصغير المعاينة' : 'Zoom Out'}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] text-slate-800 font-bold min-w-[36px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-white rounded-lg text-slate-700 transition cursor-pointer flex items-center justify-center"
              title={isAr ? 'تكبير' : 'Zoom In'}
              aria-label={isAr ? 'تكبير المعاينة' : 'Zoom In'}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-3.5 bg-slate-200 mx-0.5" />
            <button
              type="button"
              onClick={handleZoomFit}
              className="px-2 py-1 text-[11px] rounded-lg transition cursor-pointer font-bold hover:bg-white text-slate-700"
              title={isAr ? 'ملاءمة الصفحة' : 'Fit Page'}
            >
              {isAr ? 'ملاءمة' : 'Fit'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-[#001639] border border-slate-200/70 transition cursor-pointer flex items-center justify-center"
            title={isAr ? 'معاينة ملء الشاشة' : 'Fullscreen Preview'}
            aria-label={isAr ? 'معاينة ملء الشاشة' : 'Fullscreen Preview'}
          >
            <Maximize2 className="w-3.5 h-3.5" />
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

              <div className="flex items-center gap-3 flex-wrap">
                {/* Body Font */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-slate-500">
                    {isAr ? 'خط النصوص:' : 'Body Font:'}
                  </span>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-[11px] font-medium text-slate-800 outline-none cursor-pointer"
                  >
                    {isAr ? (
                      ARABIC_FONTS.map((font) => (
                        <option key={font.id} value={font.id}>
                          {font.nameAr}
                        </option>
                      ))
                    ) : (
                      ENGLISH_FONTS.map((font) => (
                        <option key={font.id} value={font.id}>
                          {font.nameEn}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Heading Font */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-slate-500">
                    {isAr ? 'خط العناوين:' : 'Heading Font:'}
                  </span>
                  <select
                    value={settings.headingFontFamily || settings.fontFamily}
                    onChange={(e) => setHeadingFontFamily(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-0.5 text-[11px] font-medium text-slate-800 outline-none cursor-pointer"
                  >
                    <option value={settings.fontFamily}>
                      {isAr ? `مطابق للنصوص (${settings.fontFamily})` : `Same as Body (${settings.fontFamily})`}
                    </option>
                    {isAr ? (
                      ARABIC_FONTS.filter((f) => f.id !== settings.fontFamily).map((font) => (
                        <option key={font.id} value={font.id}>
                          {font.nameAr}
                        </option>
                      ))
                    ) : (
                      ENGLISH_FONTS.filter((f) => f.id !== settings.fontFamily).map((font) => (
                        <option key={font.id} value={font.id}>
                          {font.nameEn}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas Scroll Container with Visual Page Break Line */}
      <div
        ref={canvasContainerRef}
        className="preview-desk-canvas flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-8 flex justify-center items-start bg-slate-100/70 custom-scrollbar relative"
      >
        <div
          className="flex justify-center items-start relative shrink-0 transition-all duration-150 mx-auto"
          style={{
            width: `${Math.round(794 * zoom)}px`,
            minHeight: `${Math.round(1050 * zoom)}px`,
          }}
        >
          <div
            className="transition-transform duration-150 border border-slate-200/90 shadow-xl shadow-slate-900/5 bg-white relative shrink-0 rounded-xs"
            style={{
              width: '794px',
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Document Engineering A4 Corner Crop Marks */}
            <div className="a4-corner-mark top-left no-print" aria-hidden="true" />
            <div className="a4-corner-mark top-right no-print" aria-hidden="true" />
            <div className="a4-corner-mark bottom-left no-print" aria-hidden="true" />
            <div className="a4-corner-mark bottom-right no-print" aria-hidden="true" />

            {/* Render Active Template Document or Live Skeleton Preview */}
            <div
              id="resume-preview-document"
              ref={documentRef}
              className={`relative min-h-[1050px] resume-density-${settings.spacing || 'normal'} resume-font-${settings.fontSize || 'md'}`}
            >
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
                <span className="bg-white text-rose-700 border border-rose-300 font-bold text-[10px] rounded-full px-3 py-0.5 transform -translate-y-1/2 shadow-xs">
                  {isAr
                    ? '--- فاصل الصفحة الأولى A4 ---'
                    : '--- A4 Page 1 Break ---'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Page Status & Count Bar */}
      <div className="bg-white border-t border-slate-100 px-4 py-2.5 flex items-center justify-between text-xs text-slate-500 no-print">
        <div className="flex items-center gap-2.5">
          {isMultiPage ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{isAr ? 'المحتوى يتجاوز صفحة واحدة' : 'Content exceeds 1 page'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200/80 rounded-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{isAr ? 'صفحة 01 / 01 (مثالي)' : 'Page 01 / 01 (Optimal)'}</span>
            </span>
          )}

          {isMultiPage && (
            <span className="text-[10px] text-amber-700 hidden lg:inline">
              {isAr ? '💡 نصيحة: اختر مسافات ضيقة (Compact) لضغط السيرة في صفحة واحدة' : '💡 Tip: Select Compact density to fit on one page'}
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
                <div className={`bg-white shadow-2xl rounded-sm resume-density-${settings.spacing || 'normal'} resume-font-${settings.fontSize || 'md'}`}>
                  {renderActiveTemplate()}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
