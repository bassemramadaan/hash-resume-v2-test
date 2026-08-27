import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore';
import { getTranslation } from '../i18n/translations';
import { TEMPLATES, TemplateInfo } from '../data/templates';
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
                <p className="text-xs text-[#52627A] leading-relaxed">
                  {isAr ? tpl.descAr : tpl.descEn}
                </p>

                {/* Skeleton Visual Box */}
                <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-200 space-y-2 text-start">
                  <div className="h-3 bg-slate-300 rounded w-1/2" style={{ backgroundColor: tpl.previewColor }}></div>
                  <div className="h-2 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-1.5 bg-slate-100 rounded w-full"></div>
                  <div className="h-1.5 bg-slate-100 rounded w-5/6"></div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ATS-Friendly</span>
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
