import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import {
  Palette, Check, Layout, Type, GraduationCap, Briefcase, AlignCenter, Columns, Rows, Globe, ArrowLeftRight,
  Sliders, ChevronDown, ChevronUp, Image as ImageIcon
} from 'lucide-react';
import { TemplateId, HeaderLayout, CareerFocus, DocumentDirection } from '../../types/resume';

const TEMPLATE_OPTIONS: { id: TemplateId; nameKey: string; descKey: string }[] = [
  { id: 'bassux', nameKey: 'tplBassux', descKey: 'tplBassuxDesc' },
  { id: 'modern-ats', nameKey: 'tplModernAts', descKey: 'tplModernAtsDesc' },
  { id: 'classic-professional', nameKey: 'tplClassicProf', descKey: 'tplClassicProfDesc' },
  { id: 'minimal-exec', nameKey: 'tplMinimalExec', descKey: 'tplMinimalExecDesc' },
  { id: 'technical-clean', nameKey: 'tplTechnicalClean', descKey: 'tplTechnicalCleanDesc' },
  { id: 'creative-compact', nameKey: 'tplCreativeCompact', descKey: 'tplCreativeCompactDesc' },
];

const COLOR_PRESETS = [
  '#001639', // Hash Resume Primary Dark Blue
  '#1e40af', // Blue
  '#0f766e', // Teal
  '#111827', // Slate Black
  '#4f46e5', // Indigo
  '#b91c1c', // Crimson Red
  '#047857', // Emerald
];

export const CustomizeForm: React.FC = () => {
  const {
    settings,
    setTemplate,
    setPrimaryColor,
    setFontFamily,
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

  return (
    <div className="space-y-6 text-slate-800 w-full max-w-full min-w-0 overflow-x-hidden mobile-editor-content" aria-live="polite">
      {/* Header */}
      <div className="border-b pb-3.5 border-slate-100">
        <h2 className="text-base font-bold text-[#001639] flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#FF4D2D]" />
          <span>{t.customizeTitle}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {isAr
            ? 'اختر مستوى الخبرة، لغة السيرة، اتجاه التخطيط والقالب المناسب.'
            : 'Select career level, resume language, layout direction, and template.'}
        </p>
      </div>

      {/* 1. Career level */}
      <div className="bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-orange-50/70 p-4 rounded-xl border border-orange-200/80 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-orange-600" />
            <h3 className="font-bold text-xs text-orange-950">
              {isAr ? 'مستوى الخبرة ونمط الأقسام (Career Level)' : 'Career Level & Section Order'}
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-200 text-orange-900">
            {currentCareerFocus === 'fresh-grad'
              ? isAr ? 'نمط حديثي التخرج نشط' : 'Fresh Grad Active'
              : isAr ? 'النمط المهني للخبرات' : 'Experienced Mode'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => setCareerFocus('experienced')}
            className={`p-3 rounded-lg border text-start transition cursor-pointer flex items-center gap-2.5 ${
              currentCareerFocus === 'experienced'
                ? 'bg-white border-[#001639] ring-2 ring-[#001639]/15 shadow-xs'
                : 'bg-white/70 border-orange-200 hover:bg-white'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              currentCareerFocus === 'experienced' ? 'bg-[#001639] text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                <span>{isAr ? 'ذوي الخبرة' : 'Experienced Professional'}</span>
                {currentCareerFocus === 'experienced' && <Check className="w-3.5 h-3.5 text-[#001639]" />}
              </div>
              <p className="text-[10px] text-slate-500 truncate">
                {isAr ? 'الخبرات العملية أولاً ثم التعليم' : 'Experience first, then Education'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCareerFocus('fresh-grad')}
            className={`p-3 rounded-lg border text-start transition cursor-pointer flex items-center gap-2.5 ${
              currentCareerFocus === 'fresh-grad'
                ? 'bg-white border-orange-600 ring-2 ring-orange-600/20 shadow-xs'
                : 'bg-white/70 border-orange-200 hover:bg-white'
            }`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              currentCareerFocus === 'fresh-grad' ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700'
            }`}>
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                <span>{isAr ? 'حديثو التخرج والطلاب' : 'Fresh Graduate'}</span>
                {currentCareerFocus === 'fresh-grad' && <Check className="w-3.5 h-3.5 text-orange-600" />}
              </div>
              <p className="text-[10px] text-slate-500 truncate">
                {isAr ? 'التعليم ومشاريع التخرج أولاً' : 'Education & Projects first'}
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 2 & 3. Resume Language & Layout Direction */}
      <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-4 shadow-2xs">
        {/* Resume Language */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-3">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
              <Globe className="w-4 h-4 text-[#001639]" />
              <span>{isAr ? 'لغة السيرة الذاتية (Resume Language)' : 'Resume Language'}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isAr ? 'لغة العناوين والنصوص الرسمية' : 'Content language for headers & labels'}
            </p>
          </div>
          <div className="flex flex-wrap bg-slate-200/60 p-1 rounded-lg gap-1 text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={() => setLanguage('ar')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer min-h-[32px] ${
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
              className={`px-3 py-1.5 rounded-md transition cursor-pointer min-h-[32px] ${
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
              className={`px-3 py-1.5 rounded-md transition cursor-pointer min-h-[32px] ${
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
            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
              <ArrowLeftRight className="w-4 h-4 text-[#FF4D2D]" />
              <span>{isAr ? 'اتجاه التخطيط (Layout Direction)' : 'Layout Direction'}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isAr ? 'اختر اتجاه الصفحات المستقل عن الواجهة' : 'Select layout flow (RTL or LTR)'}
            </p>
          </div>
          <div className="flex flex-wrap bg-slate-200/60 p-1 rounded-lg gap-1 text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={() => setDocumentDirection('rtl')}
              className={`px-3 py-1.5 rounded-md transition cursor-pointer min-h-[32px] flex items-center gap-1.5 ${
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
              className={`px-3 py-1.5 rounded-md transition cursor-pointer min-h-[32px] flex items-center gap-1.5 ${
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

      {/* 4. Template */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            <Layout className="w-4 h-4 text-[#001639]" />
            <span>{t.templateSelect}</span>
          </h3>
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {(t as any).atsSelectorNote || 'Best for online applications and Applicant Tracking Systems (ATS).'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEMPLATE_OPTIONS.map((tpl) => {
            const isSelected = settings.templateId === tpl.id;
            const name = (t as any)[tpl.nameKey] || tpl.id;
            const desc = (t as any)[tpl.descKey] || '';
            const isRecommended = tpl.id === 'bassux';

            return (
              <button
                type="button"
                key={tpl.id}
                onClick={() => setTemplate(tpl.id)}
                className={`p-3.5 rounded-xl border text-start transition cursor-pointer text-xs space-y-1.5 relative ${
                  isSelected
                    ? 'bg-slate-50 border-[#001639] ring-1 ring-[#001639]/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
                    <span className="font-bold text-slate-900 truncate">{name}</span>
                    {isRecommended && (
                      <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                        {isAr ? 'موصى به لـ ATS' : 'Recommended'}
                      </span>
                    )}
                    {(tpl.id === 'classic-professional' || tpl.id === 'creative-compact') && (
                      <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                        {isAr ? 'أفضل للمراجعة البشرية والبورتفوليو' : 'Human Review & Portfolio'}
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#001639] shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Collapse Container for Advanced Styling */}
      <div className="pt-2 border-t border-slate-200/80">
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="w-full p-3.5 bg-slate-50 hover:bg-slate-100/90 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold text-[#001639] transition cursor-pointer shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#FF4D2D]" />
            <span>{isAr ? 'إعدادات المظهر المتقدمة (Advanced styling)' : 'Advanced styling'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 font-normal text-[11px]">
            <span>{showAdvanced ? (isAr ? 'إخفاء' : 'Hide') : (isAr ? 'عرض الإعدادات' : 'Show options')}</span>
            {showAdvanced ? <ChevronUp className="w-4 h-4 text-[#001639]" /> : <ChevronDown className="w-4 h-4 text-[#001639]" />}
          </div>
        </button>

        {/* Collapsed Advanced Settings */}
        {showAdvanced && (
          <div className="mt-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-200 space-y-5 animate-in fade-in duration-200">
            {/* Primary Theme Color */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-[#001639]" />
                <span>{isAr ? 'لون التظليل والتمييز الرئيسي (Primary Theme Color)' : 'Primary Theme Color'}</span>
              </h4>
              <div className="flex flex-wrap gap-2.5 pt-1">
                {COLOR_PRESETS.map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setPrimaryColor(color)}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-xs flex items-center justify-center transition transform active:scale-90 cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-[#001639]"
                    style={{ backgroundColor: color }}
                    aria-label={`Select color ${color}`}
                  >
                    {settings.primaryColor === color && <Check className="w-3.5 h-3.5 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Font & Display Photo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-slate-200/70">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-[#001639]" />
                  <span>{isAr ? 'نوع الخط (Typography Font)' : 'Typography Font'}</span>
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full px-3.5 h-10 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs font-medium text-slate-800 outline-none transition cursor-pointer"
                >
                  {settings.language === 'ar' ? (
                    <>
                      <option value="IBM Plex Sans Arabic">IBM Plex Sans Arabic (رسمي وممتاز لـ ATS)</option>
                      <option value="Cairo">Cairo (واضح وعصري)</option>
                      <option value="Tajawal">Tajawal (أنيق ومقروء)</option>
                    </>
                  ) : (
                    <>
                      <option value="Inter">Inter (Standard Modern Sans)</option>
                      <option value="Georgia">Georgia (Executive Serif)</option>
                      <option value="Roboto">Roboto (Technical Clean)</option>
                    </>
                  )}
                </select>
              </div>

              <div className="flex items-center gap-2 sm:pt-6">
                <input
                  type="checkbox"
                  id="photoToggle"
                  checked={settings.showPhoto}
                  onChange={(e) => setShowPhoto(e.target.checked)}
                  className="rounded text-[#001639] focus:ring-[#001639] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="photoToggle" className="font-bold text-slate-800 cursor-pointer text-xs flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#FF4D2D]" />
                  <span>{isAr ? 'إظهار الصورة الشخصية (Display Photo)' : 'Display Photo'}</span>
                </label>
              </div>
            </div>

            {/* Header Layout */}
            <div className="space-y-3 pt-2 border-t border-slate-200/70">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Layout className="w-4 h-4 text-[#001639]" />
                  <span>{isAr ? 'تنسيق الترويسة (Header Layout)' : 'Header Layout'}</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Centered */}
                <button
                  type="button"
                  onClick={() => setHeaderLayout('centered')}
                  className={`p-3 rounded-xl border text-start transition cursor-pointer space-y-1.5 ${
                    currentHeaderLayout === 'centered'
                      ? 'bg-white border-[#001639] ring-2 ring-[#001639]/15 shadow-xs'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <AlignCenter className="w-3.5 h-3.5 text-[#001639]" />
                      <span>{isAr ? 'المتمركز' : 'Centered'}</span>
                    </div>
                    {currentHeaderLayout === 'centered' && <Check className="w-3.5 h-3.5 text-[#001639]" />}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    {isAr ? 'الاسم واللقب في الوسط' : 'Centered name & title'}
                  </p>
                </button>

                {/* Two-Column */}
                <button
                  type="button"
                  onClick={() => setHeaderLayout('two-column')}
                  className={`p-3 rounded-xl border text-start transition cursor-pointer space-y-1.5 ${
                    currentHeaderLayout === 'two-column'
                      ? 'bg-white border-[#001639] ring-2 ring-[#001639]/15 shadow-xs'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <Columns className="w-3.5 h-3.5 text-[#001639]" />
                      <span>{isAr ? 'ذو العمودين' : 'Two-Column'}</span>
                    </div>
                    {currentHeaderLayout === 'two-column' && <Check className="w-3.5 h-3.5 text-[#001639]" />}
                  </div>
                  <p className="text-[10px] text-amber-700 font-medium leading-normal">
                    {isAr ? 'أفضل للمراجعة البشرية ومشاركة البورتفوليو' : 'Best for human review & portfolio sharing'}
                  </p>
                </button>

                {/* Compact */}
                <button
                  type="button"
                  onClick={() => setHeaderLayout('compact')}
                  className={`p-3 rounded-xl border text-start transition cursor-pointer space-y-1.5 ${
                    currentHeaderLayout === 'compact'
                      ? 'bg-white border-[#001639] ring-2 ring-[#001639]/15 shadow-xs'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <Rows className="w-3.5 h-3.5 text-[#001639]" />
                      <span>{isAr ? 'المدمج' : 'Compact'}</span>
                    </div>
                    {currentHeaderLayout === 'compact' && <Check className="w-3.5 h-3.5 text-[#001639]" />}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal">
                    {isAr ? 'توفير المساحة وتكثيف الهيدر' : 'Space saving header'}
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
