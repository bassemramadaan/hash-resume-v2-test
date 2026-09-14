import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import {
  Palette,
  Check,
  Layout,
  Type,
  GraduationCap,
  Briefcase,
  AlignCenter,
  Columns,
  Rows,
  Globe,
  ArrowLeftRight,
  Sliders,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  SlidersHorizontal,
  Sparkles,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { TemplateId, HeaderLayout, CareerFocus, DocumentDirection } from '../../types/resume';
import { ARABIC_FONTS, ENGLISH_FONTS } from '../../utils/resumeFonts';
import { NextStepBanner } from './NextStepBanner';

const TEMPLATE_OPTIONS: {
  id: TemplateId;
  nameKey: string;
  descKey: string;
  badgeAr?: string;
  badgeEn?: string;
  badgeType?: 'ats' | 'portfolio' | 'executive';
}[] = [
  {
    id: 'bassux',
    nameKey: 'tplBassux',
    descKey: 'tplBassuxDesc',
    badgeAr: 'الأفضل لـ ATS 100%',
    badgeEn: 'Best for ATS (100%)',
    badgeType: 'ats',
  },
  {
    id: 'modern-ats',
    nameKey: 'tplModernAts',
    descKey: 'tplModernAtsDesc',
    badgeAr: 'متوازن وعصري',
    badgeEn: 'Modern & Balanced',
    badgeType: 'ats',
  },
  {
    id: 'classic-professional',
    nameKey: 'tplClassicProf',
    descKey: 'tplClassicProfDesc',
    badgeAr: 'تنفيذي وكلاسيكي',
    badgeEn: 'Executive Classic',
    badgeType: 'executive',
  },
  {
    id: 'minimal-exec',
    nameKey: 'tplMinimalExec',
    descKey: 'tplMinimalExecDesc',
    badgeAr: 'بسيط ومباشر',
    badgeEn: 'Minimal & Direct',
    badgeType: 'executive',
  },
  {
    id: 'technical-clean',
    nameKey: 'tplTechnicalClean',
    descKey: 'tplTechnicalCleanDesc',
    badgeAr: 'للمهندسين والتقنيين',
    badgeEn: 'Tech & Engineering',
    badgeType: 'portfolio',
  },
  {
    id: 'creative-compact',
    nameKey: 'tplCreativeCompact',
    descKey: 'tplCreativeCompactDesc',
    badgeAr: 'مكثف وجذاب',
    badgeEn: 'Creative Compact',
    badgeType: 'portfolio',
  },
];

const COLOR_PRESETS = [
  { hex: '#001639', nameAr: 'كحلي عميق (معتمد)', nameEn: 'Deep Navy' },
  { hex: '#1e40af', nameAr: 'أزرق كلاسيكي', nameEn: 'Royal Blue' },
  { hex: '#0f766e', nameAr: 'تركواز بترولي', nameEn: 'Teal Forest' },
  { hex: '#111827', nameAr: 'أسود فحمي', nameEn: 'Charcoal Black' },
  { hex: '#4f46e5', nameAr: 'نيلي معاصر', nameEn: 'Indigo Modern' },
  { hex: '#b91c1c', nameAr: 'عنابي وقور', nameEn: 'Crimson Wine' },
  { hex: '#047857', nameAr: 'أخضر زمردي', nameEn: 'Emerald Green' },
];

export const CustomizeForm: React.FC = () => {
  const {
    settings,
    setTemplate,
    setPrimaryColor,
    setFontFamily,
    setHeadingFontFamily,
    setFontSize,
    setSpacing,
    setShowPhoto,
    setLanguage,
    setDocumentDirection,
    setHeaderLayout,
    setCareerFocus,
  } = useResumeStore();

  const [showAdvanced, setShowAdvanced] = useState(false);

  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const currentHeaderLayout: HeaderLayout = settings.headerLayout || 'centered';
  const currentCareerFocus: CareerFocus = settings.careerFocus || 'experienced';
  const currentDirection: DocumentDirection = settings.documentDirection || (settings.language === 'ar' ? 'rtl' : 'ltr');
  const currentSpacing = settings.spacing || 'normal';
  const currentFontSize = settings.fontSize || 'md';

  return (
    <div className="space-y-5 sm:space-y-6 text-slate-800 w-full max-w-full min-w-0 overflow-x-hidden mobile-editor-content" aria-live="polite">
      {/* 1. Clean Top Section Header */}
      <div className="flex items-center justify-between border-b pb-3 border-slate-100">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#001639] flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#FF4D2D]" />
            <span>{t.customizeTitle}</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            {isAr
              ? 'تخصيص القالب والمسافات وهوامش الصفحة والخطوط بما يتوافق مع معايير ATS'
              : 'Customize template, page margins, line spacing, and typography for ATS compliance'}
          </p>
        </div>
      </div>

      {/* 2. Template Selector Grid (Responsive 2-Column Grid instead of overflowing horizontal scroll) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-[#001639]" />
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                {t.templateSelect}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isAr ? 'اختر نسق الهيكل المناسب لطبيعة مجالك وخبرتك' : 'Select a layout structure suited for your industry'}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>{isAr ? 'معايير ATS معتمدة' : 'ATS Verified'}</span>
          </span>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {TEMPLATE_OPTIONS.map((tpl) => {
            const isSelected = settings.templateId === tpl.id;
            const name = (t as any)[tpl.nameKey] || tpl.id;
            const desc = (t as any)[tpl.descKey] || '';
            const badge = isAr ? tpl.badgeAr : tpl.badgeEn;

            return (
              <button
                type="button"
                key={tpl.id}
                onClick={() => setTemplate(tpl.id)}
                className={`p-3.5 rounded-xl border text-start transition cursor-pointer relative flex flex-col justify-between gap-2.5 group ${
                  isSelected
                    ? 'bg-slate-50/80 border-[#001639] ring-2 ring-[#001639]/15 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
                }`}
              >
                <div className="space-y-1.5 w-full">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition ${
                          isSelected
                            ? 'bg-[#001639] text-white'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {name}
                      </span>
                    </div>

                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#001639] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 group-hover:border-slate-400 shrink-0" />
                    )}
                  </div>

                  {badge && (
                    <div className="pt-0.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          tpl.badgeType === 'ats'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : tpl.badgeType === 'portfolio'
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        {badge}
                      </span>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-600 leading-relaxed pt-0.5">
                    {desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Page Spacing & Density Section (المسافات وهوامش الصفحة) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#001639]" />
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                {isAr ? 'المسافات وهوامش الصفحة (Page Density)' : 'Page Spacing & Density'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isAr
                  ? 'التحكم في التباعد بين الأقسام وهوامش الورقة لضبط عدد الصفحات'
                  : 'Control margins and line spacing to balance single or multi-page layout'}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {currentSpacing === 'compact'
              ? isAr
                ? 'مدمجة (صفحة واحدة)'
                : 'Compact'
              : currentSpacing === 'spacious'
              ? isAr
                ? 'متباعدة (رحبة)'
                : 'Spacious'
              : isAr
              ? 'متوازنة (معياري)'
              : 'Normal'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Compact */}
          <button
            type="button"
            onClick={() => setSpacing('compact')}
            className={`p-3.5 rounded-xl border text-start transition cursor-pointer flex flex-col justify-between gap-2.5 ${
              currentSpacing === 'compact'
                ? 'bg-slate-50/90 border-[#001639] ring-2 ring-[#001639]/15 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">
                {isAr ? 'مدمجة (Compact)' : 'Compact'}
              </span>
              {currentSpacing === 'compact' && <Check className="w-3.5 h-3.5 text-[#001639]" />}
            </div>

            {/* Visual representation of tight lines */}
            <div className="space-y-1 py-1 px-1 bg-slate-50 rounded-md border border-slate-100">
              <div className="h-1.5 bg-slate-400 rounded-full w-full" />
              <div className="h-1.5 bg-slate-300 rounded-full w-4/5" />
              <div className="h-1.5 bg-slate-300 rounded-full w-2/3" />
            </div>

            <p className="text-[11px] text-slate-600 leading-snug">
              {isAr
                ? 'تقليل الهوامش والمسافات لضغط المحتوى في صفحة A4 واحدة'
                : 'Tight padding and margins to fit on 1 page'}
            </p>
          </button>

          {/* Normal */}
          <button
            type="button"
            onClick={() => setSpacing('normal')}
            className={`p-3.5 rounded-xl border text-start transition cursor-pointer flex flex-col justify-between gap-2.5 ${
              currentSpacing === 'normal'
                ? 'bg-slate-50/90 border-[#001639] ring-2 ring-[#001639]/15 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-900">
                  {isAr ? 'متوازنة (Normal)' : 'Normal'}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                  {isAr ? 'الموصى به' : 'Recommended'}
                </span>
              </div>
              {currentSpacing === 'normal' && <Check className="w-3.5 h-3.5 text-[#001639]" />}
            </div>

            {/* Visual representation of balanced lines */}
            <div className="space-y-2 py-1 px-1 bg-slate-50 rounded-md border border-slate-100">
              <div className="h-1.5 bg-slate-400 rounded-full w-full" />
              <div className="h-1.5 bg-slate-300 rounded-full w-4/5" />
              <div className="h-1.5 bg-slate-300 rounded-full w-2/3" />
            </div>

            <p className="text-[11px] text-slate-600 leading-snug">
              {isAr
                ? 'المسافات القياسية المتوازنة والمعتمدة لأنظمة ATS'
                : 'Standard balanced spacing for optimal ATS parsing'}
            </p>
          </button>

          {/* Spacious */}
          <button
            type="button"
            onClick={() => setSpacing('spacious')}
            className={`p-3.5 rounded-xl border text-start transition cursor-pointer flex flex-col justify-between gap-2.5 ${
              currentSpacing === 'spacious'
                ? 'bg-slate-50/90 border-[#001639] ring-2 ring-[#001639]/15 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900">
                {isAr ? 'متباعدة (Spacious)' : 'Spacious'}
              </span>
              {currentSpacing === 'spacious' && <Check className="w-3.5 h-3.5 text-[#001639]" />}
            </div>

            {/* Visual representation of relaxed lines */}
            <div className="space-y-3 py-1 px-1 bg-slate-50 rounded-md border border-slate-100">
              <div className="h-1.5 bg-slate-400 rounded-full w-full" />
              <div className="h-1.5 bg-slate-300 rounded-full w-3/4" />
            </div>

            <p className="text-[11px] text-slate-600 leading-snug">
              {isAr
                ? 'مساحات بيضاء وهوامش واسعة لقراءة مريحة للمراجع البشري'
                : 'Generous white space and breathing room'}
            </p>
          </button>
        </div>
      </div>

      {/* 4. Font Size Controls (حجم خط السيرة العام) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-[#001639]" />
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                {isAr ? 'حجم الخط العام بالسيرة (Resume Font Size)' : 'Resume Font Size'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isAr ? 'ضبط مقاس الخط لتسهيل القراءة وضمان تناسق المحتوى' : 'Adjust global typography scale across all sections'}
              </p>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 font-semibold font-mono">
            {currentFontSize === 'sm'
              ? '9.5pt'
              : currentFontSize === 'lg'
              ? '11.5pt'
              : '10.5pt (Standard)'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200">
          {(['sm', 'md', 'lg'] as const).map((size) => {
            const isSelected = currentFontSize === size;
            const label =
              size === 'sm'
                ? isAr
                  ? 'صغير (9.5pt)'
                  : 'Small (9.5pt)'
                : size === 'md'
                ? isAr
                  ? 'معياري (10.5pt)'
                  : 'Standard (10.5pt)'
                : isAr
                ? 'كبير (11.5pt)'
                : 'Large (11.5pt)';
            const sub =
              size === 'sm'
                ? isAr
                  ? 'للمحتوى الطويل'
                  : 'For long resumes'
                : size === 'md'
                ? isAr
                  ? 'الموصى به لـ ATS'
                  : 'ATS Recommended'
                : isAr
                ? 'للمحتوى الموجز'
                : 'For short resumes';

            return (
              <button
                key={size}
                type="button"
                onClick={() => setFontSize(size)}
                className={`py-2 px-2.5 rounded-lg text-center transition cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#001639] font-bold shadow-xs border border-slate-200/90'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <div className="text-xs">{label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 truncate">{sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Career Level (مستوى الخبرة وترتيب الأقسام) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#001639]" />
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                {isAr ? 'مستوى الخبرة وترتيب الأقسام (Career Level)' : 'Career Level & Section Order'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isAr ? 'يقوم بترتيب الأقسام أوتوماتيكياً حسب الأولوية المناسبة لمرحلتك المهنية' : 'Automatically prioritizes Experience vs Education'}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
            {currentCareerFocus === 'fresh-grad'
              ? isAr
                ? 'حديث تخرج'
                : 'Fresh Grad'
              : isAr
              ? 'ذوي الخبرة'
              : 'Experienced'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setCareerFocus('experienced')}
            className={`p-3.5 rounded-xl border text-start transition cursor-pointer flex items-center gap-3 ${
              currentCareerFocus === 'experienced'
                ? 'bg-slate-50/90 border-[#001639] ring-2 ring-[#001639]/15 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                currentCareerFocus === 'experienced'
                  ? 'bg-[#001639] text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                <span>{isAr ? 'ذوي الخبرة المهنية' : 'Experienced Professional'}</span>
                {currentCareerFocus === 'experienced' && (
                  <Check className="w-3.5 h-3.5 text-[#001639]" />
                )}
              </div>
              <p className="text-[11px] text-slate-600 truncate mt-0.5">
                {isAr ? 'الخبرات العملية أولاً ثم التعليم' : 'Experience first, then Education'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCareerFocus('fresh-grad')}
            className={`p-3.5 rounded-xl border text-start transition cursor-pointer flex items-center gap-3 ${
              currentCareerFocus === 'fresh-grad'
                ? 'bg-slate-50/90 border-[#001639] ring-2 ring-[#001639]/15 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/40'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                currentCareerFocus === 'fresh-grad'
                  ? 'bg-[#001639] text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                <span>{isAr ? 'حديثو التخرج والطلاب' : 'Fresh Graduate'}</span>
                {currentCareerFocus === 'fresh-grad' && (
                  <Check className="w-3.5 h-3.5 text-[#001639]" />
                )}
              </div>
              <p className="text-[11px] text-slate-600 truncate mt-0.5">
                {isAr ? 'التعليم ومشاريع التخرج أولاً' : 'Education & Projects first'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 6. Resume Language & Layout Direction */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        {/* Resume Language */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-900">
              <Globe className="w-4 h-4 text-[#001639]" />
              <span>{isAr ? 'لغة السيرة الذاتية (Resume Language)' : 'Resume Language'}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isAr ? 'لغة العناوين الرسمية وتسميات الأقسام' : 'Content language for headers & labels'}
            </p>
          </div>
          <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold shrink-0 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setLanguage('ar')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer min-h-[32px] ${
                settings.language === 'ar'
                  ? 'bg-[#001639] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              العربية
            </button>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer min-h-[32px] ${
                settings.language === 'en'
                  ? 'bg-[#001639] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('fr')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer min-h-[32px] ${
                settings.language === 'fr'
                  ? 'bg-[#001639] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Français
            </button>
          </div>
        </div>

        {/* Layout Direction */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-slate-900">
              <ArrowLeftRight className="w-4 h-4 text-[#FF4D2D]" />
              <span>{isAr ? 'اتجاه تخطيط المستند (Layout Flow)' : 'Document Direction'}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isAr ? 'تحديد اتجاه الصفحات مستقلاً عن لغة المتصفح' : 'Select page flow direction (RTL or LTR)'}
            </p>
          </div>
          <div className="flex flex-wrap bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold shrink-0 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setDocumentDirection('rtl')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer min-h-[32px] flex items-center gap-1.5 ${
                currentDirection === 'rtl'
                  ? 'bg-[#001639] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>RTL (يمين لليسار)</span>
              {currentDirection === 'rtl' && <Check className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={() => setDocumentDirection('ltr')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer min-h-[32px] flex items-center gap-1.5 ${
                currentDirection === 'ltr'
                  ? 'bg-[#001639] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>LTR (يسار لليمين)</span>
              {currentDirection === 'ltr' && <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 7. Collapsible Advanced Styling (Colors, Fonts, Layout, Photo) */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="w-full p-4 bg-white hover:bg-slate-50/80 border border-slate-200 rounded-2xl flex items-center justify-between text-xs font-bold text-[#001639] transition cursor-pointer shadow-2xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
              <Sliders className="w-4 h-4 text-[#FF4D2D]" />
            </div>
            <div className="text-start">
              <div className="font-bold text-xs sm:text-sm text-slate-900">
                {isAr ? 'خيارات المظهر المتقدمة (الألوان والخطوط والترويسة)' : 'Advanced Styling (Colors, Fonts & Layout)'}
              </div>
              <div className="text-[11px] text-slate-500 font-normal">
                {isAr ? 'تعديل لون التمييز، خط العناوين، ونمط ترويسة الاسم' : 'Customize theme accent, heading font, and header layout'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 font-semibold text-xs shrink-0">
            <span>{showAdvanced ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'تخصيص' : 'Customize')}</span>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4 text-[#001639]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#001639]" />
            )}
          </div>
        </button>

        {/* Collapsed Section Content */}
        {showAdvanced && (
          <div className="mt-3.5 p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 space-y-5 animate-in fade-in duration-200 shadow-2xs">
            {/* Primary Theme Color */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-[#001639]" />
                  <span>{isAr ? 'لون التمييز الرئيسي (Primary Color)' : 'Primary Theme Color'}</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-mono">
                  {settings.primaryColor}
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {COLOR_PRESETS.map((color) => {
                  const isColorSelected = settings.primaryColor === color.hex;
                  return (
                    <button
                      type="button"
                      key={color.hex}
                      onClick={() => setPrimaryColor(color.hex)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition transform active:scale-95 cursor-pointer shadow-xs ${
                        isColorSelected
                          ? 'ring-2 ring-offset-2 ring-[#001639] scale-105'
                          : 'hover:opacity-90'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={`${isAr ? color.nameAr : color.nameEn} (${color.hex})`}
                      aria-label={`Select color ${color.hex}`}
                    >
                      {isColorSelected && <Check className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typography: Heading vs Body Font */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-[#001639]" />
                  <span>{isAr ? 'منظومة الخطوط (Heading & Body Fonts)' : 'Typography System'}</span>
                </h4>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  {isAr ? 'خطوط رسمية تدعم العربية والإنجليزية' : 'ATS-friendly fonts'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Body Font */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    {isAr ? 'خط النصوص والفقرات (Body Font)' : 'Body Font (Paragraphs)'}
                  </label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-3 h-10 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs font-medium text-slate-800 outline-none transition cursor-pointer"
                  >
                    {settings.language === 'ar'
                      ? ARABIC_FONTS.map((font) => (
                          <option key={font.id} value={font.id}>
                            {font.nameAr}
                          </option>
                        ))
                      : ENGLISH_FONTS.map((font) => (
                          <option key={font.id} value={font.id}>
                            {font.nameEn}
                          </option>
                        ))}
                  </select>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {isAr ? 'يُطبق على تفاصيل الخبرات والملخص والنقاط' : 'Applied to job descriptions and bullets'}
                  </p>
                </div>

                {/* Heading Font */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-800">
                    {isAr ? 'خط العناوين الرئيسية (Heading Font)' : 'Heading Font (Titles)'}
                  </label>
                  <select
                    value={settings.headingFontFamily || settings.fontFamily}
                    onChange={(e) => setHeadingFontFamily(e.target.value)}
                    className="w-full px-3 h-10 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs font-medium text-slate-800 outline-none transition cursor-pointer"
                  >
                    {settings.language === 'ar' ? (
                      <>
                        <option value={settings.fontFamily}>
                          {isAr
                            ? `مطابق لخط النصوص (${settings.fontFamily})`
                            : `Same as Body (${settings.fontFamily})`}
                        </option>
                        {ARABIC_FONTS.filter((f) => f.id !== settings.fontFamily).map((font) => (
                          <option key={font.id} value={font.id}>
                            {font.nameAr}
                          </option>
                        ))}
                      </>
                    ) : (
                      <>
                        <option value={settings.fontFamily}>
                          {isAr
                            ? `مطابق لخط النصوص (${settings.fontFamily})`
                            : `Same as Body (${settings.fontFamily})`}
                        </option>
                        {ENGLISH_FONTS.filter((f) => f.id !== settings.fontFamily).map((font) => (
                          <option key={font.id} value={font.id}>
                            {font.nameEn}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {isAr ? 'يُطبق على اسمك وعناوين الأقسام' : 'Applied to your name and section titles'}
                  </p>
                </div>
              </div>
            </div>

            {/* Header Layout */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Layout className="w-4 h-4 text-[#001639]" />
                <span>{isAr ? 'تنسيق الترويسة (Header Layout)' : 'Header Layout'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Centered */}
                <button
                  type="button"
                  onClick={() => setHeaderLayout('centered')}
                  className={`p-3 rounded-xl border text-start transition cursor-pointer space-y-1 ${
                    currentHeaderLayout === 'centered'
                      ? 'bg-slate-50 border-[#001639] ring-2 ring-[#001639]/15 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <AlignCenter className="w-3.5 h-3.5 text-[#001639]" />
                      <span>{isAr ? 'المتمركز' : 'Centered'}</span>
                    </div>
                    {currentHeaderLayout === 'centered' && (
                      <Check className="w-3.5 h-3.5 text-[#001639]" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    {isAr ? 'الاسم والبيانات في المنتصف' : 'Centered name & contact'}
                  </p>
                </button>

                {/* Two-Column */}
                <button
                  type="button"
                  onClick={() => setHeaderLayout('two-column')}
                  className={`p-3 rounded-xl border text-start transition cursor-pointer space-y-1 ${
                    currentHeaderLayout === 'two-column'
                      ? 'bg-slate-50 border-[#001639] ring-2 ring-[#001639]/15 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <Columns className="w-3.5 h-3.5 text-[#001639]" />
                      <span>{isAr ? 'عمودان جانبيان' : 'Two-Column'}</span>
                    </div>
                    {currentHeaderLayout === 'two-column' && (
                      <Check className="w-3.5 h-3.5 text-[#001639]" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    {isAr ? 'الاسم جهة وبيانات الاتصال جهة' : 'Side-by-side header'}
                  </p>
                </button>

                {/* Compact */}
                <button
                  type="button"
                  onClick={() => setHeaderLayout('compact')}
                  className={`p-3 rounded-xl border text-start transition cursor-pointer space-y-1 ${
                    currentHeaderLayout === 'compact'
                      ? 'bg-slate-50 border-[#001639] ring-2 ring-[#001639]/15 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <Rows className="w-3.5 h-3.5 text-[#001639]" />
                      <span>{isAr ? 'المدمج' : 'Compact'}</span>
                    </div>
                    {currentHeaderLayout === 'compact' && (
                      <Check className="w-3.5 h-3.5 text-[#001639]" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    {isAr ? 'توفير المساحة وتكثيف الهيدر' : 'Space-saving dense header'}
                  </p>
                </button>
              </div>
            </div>

            {/* Display Photo Toggle */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-4 h-4 text-[#FF4D2D]" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">
                    {isAr ? 'إظهار الصورة الشخصية (Display Photo)' : 'Display Photo'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isAr
                      ? 'ينصح بعدم وضع الصورة للتقديم في أسواق أمريكا وكندا وبريطانيا'
                      : 'Not recommended for US/UK/Canada ATS compliance'}
                  </div>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  id="photoToggle"
                  checked={settings.showPhoto}
                  onChange={(e) => setShowPhoto(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#001639]" />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Next Step Banner */}
      <NextStepBanner
        variant="section"
        isAr={isAr}
        stepTextAr="القالب والتنسيق جاهزان. يمكنك الآن مراجعة المحتوى في المعاينة وتدقيق درجة ATS وتصدير السيرة كملف PDF."
        stepTextEn="Template & styling configured. Preview your CV, check ATS score, or export as PDF."
      />
    </div>
  );
};
