import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { Palette, Check, Layout, Type } from 'lucide-react';
import { TemplateId } from '../../types/resume';

const TEMPLATE_OPTIONS: { id: TemplateId; nameKey: string; descKey: string }[] = [
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
  const { settings, setTemplate, setPrimaryColor, setFontFamily, setShowPhoto, setLanguage } =
    useResumeStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  return (
    <div className="space-y-6 text-slate-800" aria-live="polite">
      {/* Header */}
      <div className="border-b pb-3.5 border-slate-100">
        <h2 className="text-base font-bold text-[#001639] flex items-center gap-2">
          <Palette className="w-4 h-4 text-[#FF4D2D]" />
          <span>{t.customizeTitle}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          {isAr
            ? 'تخصيص القالب والخطوط وألوان العناوين'
            : 'Customize template, typography, and accent colors'}
        </p>
      </div>

      {/* Language Switch */}
      <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div>
          <h3 className="font-bold text-xs text-slate-900">
            {isAr ? 'لغة السيرة الذاتية والاتجاه' : 'Resume Language & Layout'}
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {isAr
              ? 'تبديل فوري بين العربية (RTL) والإنجليزية (LTR)'
              : 'Switch between Arabic (RTL) and English (LTR)'}
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
            العربية (RTL)
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
            English (LTR)
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
            Français (LTR)
          </button>
        </div>
      </div>

      {/* Template Selection Cards */}
      <div className="space-y-3">
        <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
          <Layout className="w-4 h-4 text-[#001639]" />
          <span>{t.templateSelect}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TEMPLATE_OPTIONS.map((tpl) => {
            const isSelected = settings.templateId === tpl.id;
            const name = (t as any)[tpl.nameKey] || tpl.id;
            const desc = (t as any)[tpl.descKey] || '';

            return (
              <button
                type="button"
                key={tpl.id}
                onClick={() => setTemplate(tpl.id)}
                className={`p-3.5 rounded-xl border text-start transition cursor-pointer text-xs space-y-1.5 ${
                  isSelected
                    ? 'bg-slate-50 border-[#001639] ring-1 ring-[#001639]/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{name}</span>
                  {isSelected && <Check className="w-4 h-4 text-[#001639]" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">{desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Selection */}
      <div className="space-y-2">
        <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-[#001639]" />
          <span>{t.colorSelect}</span>
        </h3>
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

      {/* Font Family & Photo Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-[#001639]" />
            <span>{t.fontSelect}</span>
          </label>
          <select
            value={settings.fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="w-full px-3.5 h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs font-medium text-slate-800 outline-none transition cursor-pointer"
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
          <label htmlFor="photoToggle" className="font-semibold text-slate-700 cursor-pointer text-xs">
            {t.showPhotoToggle}
          </label>
        </div>
      </div>
    </div>
  );
};
