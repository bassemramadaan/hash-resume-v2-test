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
    <div className="space-y-4 text-slate-800 w-full max-w-full min-w-0 overflow-x-hidden mobile-editor-content" aria-live="polite">
      {/* 1. Template Selector Grid */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-[#FF4D2D]" />
            <div>
              <h3 className="font-tajawal font-bold text-xs sm:text-sm text-slate-900">
                {t.templateSelect}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr ? 'اختر نسق الهيكل المناسب لطبيعة مجالك وخبرتك' : 'Select a layout structure suited for your industry'}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>{isAr ? 'معايير ATS معتمدة' : 'ATS VERIFIED'}</span>
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
                className={`p-3.5 rounded-xl border text-start transition cursor-pointer relative flex flex-col justify-between gap-2.5 group shadow-2xs ${
                  isSelected
                    ? 'bg-slate-50 border-[#001639] ring-1 ring-[#001639]/10'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="space-y-1.5 w-full">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition ${
                          isSelected
                            ? 'bg-[#001639] text-white'
                            : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-tajawal font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {name}
                      </span>
                    </div>

                    {isSelected ? (
                      <div className="w-4 h-4 rounded-full bg-[#001639] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 group-hover:border-slate-400 shrink-0" />
                    )}
                  </div>

                  {badge && (
                    <div className="pt-0.5">
                      <span
                        className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded-md border ${
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

                  <p className="text-xs text-slate-500 leading-relaxed pt-0.5">
                    {desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Collapsible Advanced Styling & Layout (Collapsed by default, defaults remain fully active) */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="w-full p-4 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-900 transition cursor-pointer shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
              <Sliders className="w-4 h-4 text-[#FF4D2D]" />
            </div>
            <div className="text-start">
              <div className="font-tajawal font-bold text-xs sm:text-sm text-slate-900">
                {isAr ? 'الإعدادات المتقدمة (المسافات، الألوان، الخطوط، والاتجاه)' : 'Advanced Settings (Spacing, Colors, Fonts & Flow)'}
              </div>
              <div className="text-xs text-slate-500 font-normal">
                {isAr
                  ? 'المعايير المثالية مفعلة تلقائياً (مسافات قياسية، اتجاه متوافق مع ATS)'
                  : 'ATS defaults are active by default (Normal spacing, optimized contrast)'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-semibold text-xs shrink-0">
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase">
              {showAdvanced ? (isAr ? 'إخفاء' : 'HIDE') : (isAr ? 'افتراضي مفعل' : 'DEFAULT ACTIVE')}
            </span>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4 text-slate-700" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </button>

        {/* Collapsed Section Content */}
        {showAdvanced && (
          <div className="mt-3 p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-6 animate-in fade-in duration-200">
            {/* Page Spacing & Density */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#FF4D2D]" />
                  <div>
                    <h4 className="font-tajawal font-bold text-xs sm:text-sm text-slate-900">
                      {isAr ? 'المسافات وهوامش الصفحة (Page Density)' : 'Page Spacing & Density'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {isAr
                        ? 'التحكم في التباعد بين الأقسام وهوامش الورقة'
                        : 'Control margins and line spacing'}
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {currentSpacing === 'compact'
                    ? isAr
                      ? 'مدمجة (صفحة واحدة)'
                      : 'COMPACT'
                    : currentSpacing === 'spacious'
                    ? isAr
                      ? 'متباعدة (رحبة)'
                      : 'SPACIOUS'
                    : isAr
                    ? 'متوازنة (معياري)'
                    : 'NORMAL'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* Compact */}
                <button
                  type="button"
                  onClick={() => setSpacing('compact')}
                  className={`p-3 rounded-xl border text-start transition cursor-pointer flex flex-col justify-between gap-2 shadow-2xs ${
                    currentSpacing === 'compact'
                      ? 'bg-slate-50 border-[#001639] ring-1 ring-[#001639]/10'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-tajawal font-bold text-xs text-slate-900">
                      {isAr ? 'مدمجة (Compact)' : 'Compact'}
                    </span>
                    {currentSpacing === 'compact' && <Check className="w-3.5 h-3.5 text-[#001639]" />}
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    {isAr
                      ? 'تقليل الهوامش لضغط المحتوى في صفحة واحدة'
                      : 'Tight padding to fit on 1 page'}
                  </p>
                </button>

                {/* Normal */}
                <button
                  type="button"
                  onClick={() => setSpacing('normal')}
                  className={`p-3 rounded-xl border text-start transition cursor-pointer flex flex-col justify-between gap-2 shadow-2xs ${
                    currentSpacing === 'normal'
                      ? 'bg-slate-50 border-[#001639] ring-1 ring-[#001639]/10'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-tajawal font-bold text-xs text-slate-900">
                        {isAr ? 'متوازنة (Normal)' : 'Normal'}
                      </span>
                      <span className="font-mono text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {isAr ? 'الموصى به' : 'RECOMMENDED'}
                      </span>
                    </div>
                    {currentSpacing === 'normal' && <Check className="w-3.5 h-3.5 text-[#001639]" />}
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    {isAr
                      ? 'المسافات القياسية المعتمدة لأنظمة ATS'
                      : 'Standard balanced spacing'}
                  </p>
                </button>

                {/* Spacious */}
                <button
                  type="button"
                  onClick={() => setSpacing('spacious')}
                  className={`p-3 rounded-xl border text-start transition cursor-pointer flex flex-col justify-between gap-2 shadow-2xs ${
                    currentSpacing === 'spacious'
                      ? 'bg-slate-50 border-[#001639] ring-1 ring-[#001639]/10'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-tajawal font-bold text-xs text-slate-900">
                      {isAr ? 'متباعدة (Spacious)' : 'Spacious'}
                    </span>
                    {currentSpacing === 'spacious' && <Check className="w-3.5 h-3.5 text-[#001639]" />}
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    {isAr
                      ? 'مساحات واسعة لقراءة مريحة'
                      : 'Generous white space'}
                  </p>
                </button>
              </div>
            </div>

            {/* Font Size Controls */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-[#FF4D2D]" />
                  <h4 className="font-tajawal font-bold text-xs sm:text-sm text-slate-900">
                    {isAr ? 'حجم الخط العام بالسيرة' : 'Resume Font Size'}
                  </h4>
                </div>
                <span className="text-xs text-slate-600 font-bold font-mono">
                  {currentFontSize === 'sm'
                    ? '9.5pt'
                    : currentFontSize === 'lg'
                    ? '11.5pt'
                    : '10.5pt (Standard)'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-1.5 border border-slate-200 rounded-xl">
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

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFontSize(size)}
                      className={`py-2 px-2.5 rounded-lg text-center transition cursor-pointer ${
                        isSelected
                          ? 'bg-white text-[#001639] font-bold shadow-2xs border border-slate-200/80'
                          : 'text-slate-500 hover:text-slate-900 font-medium'
                      }`}
                    >
                      <div className="text-xs font-tajawal">{label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Career Level */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#FF4D2D]" />
                  <h4 className="font-tajawal font-bold text-xs sm:text-sm text-slate-900">
                    {isAr ? 'مستوى الخبرة وترتيب الأقسام' : 'Career Level & Section Order'}
                  </h4>
                </div>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {currentCareerFocus === 'fresh-grad'
                    ? isAr
                      ? 'حديث تخرج'
                      : 'FRESH GRAD'
                    : isAr
                    ? 'ذوي الخبرة'
                    : 'EXPERIENCED'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setCareerFocus('experienced')}
                  className={`p-3 rounded-xl border text-start transition cursor-pointer flex items-center gap-3 shadow-2xs ${
                    currentCareerFocus === 'experienced'
                      ? 'bg-slate-50 border-[#001639] ring-1 ring-[#001639]/10'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      currentCareerFocus === 'experienced'
                        ? 'bg-[#001639] text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-tajawal font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between">
                      <span>{isAr ? 'ذوي الخبرة المهنية' : 'Experienced'}</span>
                      {currentCareerFocus === 'experienced' && (
                        <Check className="w-3.5 h-3.5 text-[#001639]" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {isAr ? 'الخبرات أولاً ثم التعليم' : 'Experience first'}
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCareerFocus('fresh-grad')}
                  className={`p-3 rounded-xl border text-start transition cursor-pointer flex items-center gap-3 shadow-2xs ${
                    currentCareerFocus === 'fresh-grad'
                      ? 'bg-slate-50 border-[#001639] ring-1 ring-[#001639]/10'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      currentCareerFocus === 'fresh-grad'
                        ? 'bg-[#001639] text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-tajawal font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between">
                      <span>{isAr ? 'حديثو التخرج والطلاب' : 'Fresh Graduate'}</span>
                      {currentCareerFocus === 'fresh-grad' && (
                        <Check className="w-3.5 h-3.5 text-[#001639]" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {isAr ? 'التعليم والمشاريع أولاً' : 'Education first'}
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Layout Direction */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-1.5 font-tajawal font-bold text-xs sm:text-sm text-slate-900">
                  <ArrowLeftRight className="w-4 h-4 text-[#FF4D2D]" />
                  <span>{isAr ? 'اتجاه تخطيط المستند' : 'Document Direction'}</span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isAr ? 'تحديد اتجاه الصفحات RTL أو LTR' : 'Select page flow direction (RTL or LTR)'}
                </p>
              </div>
              <div className="flex flex-wrap bg-slate-50 p-1 rounded-xl gap-1 text-xs font-bold shrink-0 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setDocumentDirection('rtl')}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer min-h-[32px] flex items-center gap-1.5 ${
                    currentDirection === 'rtl'
                      ? 'bg-[#001639] text-white shadow-2xs'
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
                      ? 'bg-[#001639] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>LTR (يسار لليمين)</span>
                  {currentDirection === 'ltr' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Primary Theme Color */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-tajawal font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-[#FF4D2D]" />
                  <span>{isAr ? 'لون التمييز الرئيسي (Primary Color)' : 'Primary Theme Color'}</span>
                </h4>
                <span className="text-xs text-slate-500 font-mono">
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
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition cursor-pointer border shadow-2xs ${
                        isColorSelected
                          ? 'ring-2 ring-[#001639] ring-offset-2 border-transparent scale-105'
                          : 'border-slate-200 hover:opacity-90'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={`${isAr ? color.nameAr : color.nameEn} (${color.hex})`}
                      aria-label={`Select color ${color.hex}`}
                    >
                      {isColorSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Typography: Heading vs Body Font */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="font-tajawal font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-[#FF4D2D]" />
                  <span>{isAr ? 'منظومة الخطوط (Heading & Body Fonts)' : 'Typography System'}</span>
                </h4>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  {isAr ? 'خطوط رسمية تدعم العربية والإنجليزية' : 'ATS-friendly fonts'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Body Font */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    {isAr ? 'خط النصوص والفقرات (Body Font)' : 'Body Font (Paragraphs)'}
                  </label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full px-3 h-10 bg-white hover:border-slate-300 focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-xl text-xs font-ibm-sans text-slate-900 outline-none transition cursor-pointer shadow-2xs"
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
                  <p className="text-xs text-slate-400 leading-tight">
                    {isAr ? 'يُطبق على تفاصيل الخبرات والملخص والنقاط' : 'Applied to job descriptions and bullets'}
                  </p>
                </div>

                {/* Heading Font */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    {isAr ? 'خط العناوين الرئيسية (Heading Font)' : 'Heading Font (Titles)'}
                  </label>
                  <select
                    value={settings.headingFontFamily || settings.fontFamily}
                    onChange={(e) => setHeadingFontFamily(e.target.value)}
                    className="w-full px-3 h-10 bg-white hover:border-slate-300 focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-xl text-xs font-ibm-sans text-slate-900 outline-none transition cursor-pointer shadow-2xs"
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
                  <p className="text-xs text-slate-400 leading-tight">
                    {isAr ? 'يُطبق على اسمك وعناوين الأقسام' : 'Applied to your name and section titles'}
                  </p>
                </div>
              </div>
            </div>

            {/* Header Layout */}
            <div className="space-y-2.5 pt-3 border-t border-slate-100">
              <h4 className="font-tajawal font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                <Layout className="w-4 h-4 text-[#FF4D2D]" />
                <span>{isAr ? 'تنسيق الترويسة (Header Layout)' : 'Header Layout'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Centered */}
                <button
                  type="button"
                  onClick={() => setHeaderLayout('centered')}
                  className={`p-3 rounded-xl border text-start transition cursor-pointer space-y-1 shadow-2xs ${
                    currentHeaderLayout === 'centered'
                      ? 'bg-slate-50 border-[#001639] ring-1 ring-[#001639]/10'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-tajawal font-bold text-xs text-slate-900">
                      <AlignCenter className="w-3.5 h-3.5 text-[#001639]" />
                      <span>{isAr ? 'المتمركز' : 'Centered'}</span>
                    </div>
                    {currentHeaderLayout === 'centered' && (
                      <Check className="w-3.5 h-3.5 text-[#001639]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-tight">
                    {isAr ? 'الاسم والبيانات في المنتصف' : 'Centered name & contact'}
                  </p>
                </button>

                {/* Two-Column */}
                <button
                  type="button"
                  onClick={() => setHeaderLayout('two-column')}
                  className={`p-3 rounded-xl border text-start transition cursor-pointer space-y-1 shadow-2xs ${
                    currentHeaderLayout === 'two-column'
                      ? 'bg-slate-50 border-[#001639] ring-1 ring-[#001639]/10'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-tajawal font-bold text-xs text-slate-900">
                      <Columns className="w-3.5 h-3.5 text-[#001639]" />
                      <span>{isAr ? 'عمودان جانبيان' : 'Two-Column'}</span>
                    </div>
                    {currentHeaderLayout === 'two-column' && (
                      <Check className="w-3.5 h-3.5 text-[#001639]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-tight">
                    {isAr ? 'الاسم جهة وبيانات الاتصال جهة' : 'Side-by-side header'}
                  </p>
                </button>

                {/* Compact */}
                <button
                  type="button"
                  onClick={() => setHeaderLayout('compact')}
                  className={`p-3 rounded-xl border text-start transition cursor-pointer space-y-1 shadow-2xs ${
                    currentHeaderLayout === 'compact'
                      ? 'bg-slate-50 border-[#001639] ring-1 ring-[#001639]/10'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-tajawal font-bold text-xs text-slate-900">
                      <Rows className="w-3.5 h-3.5 text-[#001639]" />
                      <span>{isAr ? 'المدمج' : 'Compact'}</span>
                    </div>
                    {currentHeaderLayout === 'compact' && (
                      <Check className="w-3.5 h-3.5 text-[#001639]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-tight">
                    {isAr ? 'توفير المساحة وتكثيف الهيدر' : 'Space-saving dense header'}
                  </p>
                </button>
              </div>
            </div>

            {/* Display Photo Toggle */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <ImageIcon className="w-3.5 h-3.5 text-[#FF4D2D]" />
                </div>
                <div>
                  <div className="font-tajawal font-bold text-xs sm:text-sm text-slate-900">
                    {isAr ? 'إظهار الصورة الشخصية (Display Photo)' : 'Display Photo'}
                  </div>
                  <div className="text-xs text-slate-500">
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
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#001639]" />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
