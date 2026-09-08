import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { getTranslation } from '../i18n/translations';
import { TEMPLATES, TemplateInfo } from '../data/templates';
import { TemplateMiniLayout } from '../components/templates/TemplateMiniLayout';
import { Layout, Check, Sparkles, ArrowRight, ArrowLeft, ShieldCheck, Filter } from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  const { settings, setTemplate } = useResumeStore();
  const navigate = useNavigate();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: isAr ? 'جميع القوالب' : 'All Templates' },
    { id: 'ats', label: isAr ? 'متوافقة مع ATS' : 'ATS Compliant' },
    { id: 'classic', label: isAr ? 'رسمية وكلاسيكية' : 'Classic & Formal' },
    { id: 'tech', label: isAr ? 'تقنية للمطورين' : 'Technical' },
    { id: 'exec', label: isAr ? 'تنفيذية وللإدارة' : 'Executive' },
    { id: 'creative', label: isAr ? 'إبداعية' : 'Creative' },
  ];

  const filteredTemplates = filterCategory === 'all'
    ? TEMPLATES
    : TEMPLATES.filter((tpl) => tpl.category === filterCategory);

  const handleSelectTemplate = (templateId: TemplateInfo['id']) => {
    setTemplate(templateId);
    navigate('/builder');
  };

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8EEF7] border border-[#CBD5E1] text-[#001639] text-xs font-bold shadow-2xs">
          <Layout className="w-4 h-4 text-[#001639]" />
          <span>{isAr ? 'معرض القوالب الاحترافية' : 'Professional Template Gallery'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B1120]">
          {isAr ? 'اختر القالب المثالي لسيرتك الذاتية' : 'Choose Your ATS-Optimized Template'}
        </h1>
        <p className="text-xs sm:text-sm text-[#52627A]">
          {isAr
            ? 'جميع القوالب مصممة هندسياً للعبور من أنظمة الفلترة الآلية (ATS) وقابلة للتخصيص بالكامل.'
            : 'Every template is engineered to pass ATS scanners with full color and font customization.'}
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${
              filterCategory === cat.id
                ? 'bg-[#001639] text-white shadow-xs'
                : 'bg-white text-[#52627A] border border-[#E2E8F0] hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl) => {
          const isCurrentSelected = settings.templateId === tpl.id;
          return (
            <div
              key={tpl.id}
              className={`bg-white rounded-2xl border transition overflow-hidden flex flex-col justify-between shadow-xs ${
                isCurrentSelected
                  ? 'border-[#001639] ring-2 ring-[#001639]/20'
                  : 'border-[#E2E8F0] hover:border-slate-300'
              }`}
            >
              <div className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-[#0B1120] text-sm">
                      {isAr ? tpl.nameAr : tpl.nameEn}
                    </h3>
                    <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#E8EEF7] text-[#001639] border border-[#CBD5E1]">
                      {isAr ? tpl.badgeAr : tpl.badgeEn}
                    </span>
                  </div>

                  <div
                    className="w-5 h-5 rounded-full border border-white shadow-2xs shrink-0 mt-1"
                    style={{ backgroundColor: tpl.previewColor }}
                  ></div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#52627A] leading-relaxed line-clamp-2 min-h-[32px]">
                  {isAr ? tpl.descAr : tpl.descEn}
                </p>

                {/* Mini-Layout Authentic Representation */}
                <div className="h-60 bg-slate-100/70 p-2 rounded-xl border border-slate-200/90 overflow-hidden relative group-hover:border-slate-300 transition shadow-2xs">
                  <TemplateMiniLayout
                    templateId={tpl.id}
                    previewColor={tpl.previewColor}
                    isAr={isAr}
                  />

                  {/* Layout Architecture Badge Overlay */}
                  <div className="absolute bottom-3 end-3 px-2 py-0.5 bg-white/95 backdrop-blur-xs text-slate-800 rounded-md text-[9px] font-bold border border-slate-200/90 shadow-xs flex items-center gap-1">
                    {tpl.id === 'creative-compact' ? (
                      <span>{isAr ? 'تخطيط عمودين جانبي' : '2-Column Sidebar'}</span>
                    ) : tpl.id === 'bassux' ? (
                      <span>{isAr ? 'عمود نقي بدون رسوم' : 'Single Column ATS'}</span>
                    ) : tpl.id === 'technical-clean' ? (
                      <span>{isAr ? 'صيغة برمجية Monospace' : 'Code Monospace'}</span>
                    ) : tpl.id === 'minimal-exec' ? (
                      <span>{isAr ? 'اقتباس تنفيذي رأسي' : 'Executive Quote Bar'}</span>
                    ) : tpl.id === 'classic-professional' ? (
                      <span>{isAr ? 'خط رسمي وتنسيق Serif' : 'Classic Serif Format'}</span>
                    ) : (
                      <span>{isAr ? 'عمود عصري موحد' : 'Modern Clean Layout'}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className={`flex items-center gap-1 text-[11px] font-bold ${
                  tpl.category === 'ats'
                    ? 'text-emerald-700'
                    : 'text-slate-600'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>
                    {tpl.category === 'ats'
                      ? (isAr ? 'توافق ATS عالي 100%' : '100% ATS Compliant')
                      : (isAr ? 'مراجعة بشرية وبورتفوليو' : 'Human Review & Portfolio')}
                  </span>
                </div>

                <button
                  onClick={() => handleSelectTemplate(tpl.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isCurrentSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#001639] hover:bg-[#00214F] text-white shadow-2xs'
                  }`}
                >
                  <span>
                    {isCurrentSelected
                      ? isAr ? 'القالب المختار حالياً' : 'Currently Selected'
                      : isAr ? 'استخدم هذا القالب' : 'Use Template'}
                  </span>
                  {!isCurrentSelected && <ArrowIcon className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};
