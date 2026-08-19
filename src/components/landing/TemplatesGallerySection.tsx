import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useResumeStore } from '../../store/useResumeStore';
import { TEMPLATES, TemplateInfo } from '../../data/templates';
import { TemplateId } from '../../types/resume';
import { Star, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

interface TemplatesGallerySectionProps {
  isAr: boolean;
}

export const TemplatesGallerySection: React.FC<TemplatesGallerySectionProps> = ({ isAr }) => {
  const navigate = useNavigate();
  const { setTemplate } = useResumeStore();
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'ats', labelAr: 'الأكثر طلبًا (ATS)', labelEn: 'ATS Top Choice' },
    { id: 'exec', labelAr: 'تنفيذي ورسمي', labelEn: 'Executive & Formal' },
    { id: 'tech', labelAr: 'تقني ومطورين', labelEn: 'Tech & Engineering' },
    { id: 'creative', labelAr: 'إبداعي وتسويق', labelEn: 'Creative & Media' },
  ];

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    if (selectedCategory === 'all') return true;
    return tpl.category === selectedCategory;
  });

  const handleUseTemplate = (id: TemplateId) => {
    setTemplate(id);
    navigate('/builder');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#E8EEF7] text-[#001639] border border-[#CBD5E1]">
            {isAr ? 'معرض القوالب المعتمدة' : 'ATS Template Catalog'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0B1120] mt-1.5">
            {isAr ? 'قوالب مصممة خصيصاً لعبور الفلترة' : 'Templates Designed for Parser Performance'}
          </h2>
        </div>

        <Link
          to="/templates"
          className="px-5 py-2.5 bg-white hover:bg-slate-50 text-[#001639] font-bold text-xs rounded-full border border-[#CBD5E1] shadow-2xs transition flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>{isAr ? 'شاهد كافة القوالب' : 'View All Templates'}</span>
          <ArrowIcon className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer border ${
              selectedCategory === cat.id
                ? 'bg-[#001639] text-white border-[#001639] shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {isAr ? cat.labelAr : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Template Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl: TemplateInfo) => (
          <div
            key={tpl.id}
            className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-xs hover:shadow-lg transition space-y-4 text-start flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-[#E8EEF7] text-[#001639]">
                  {isAr ? tpl.badgeAr : tpl.badgeEn}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>4.9 / 5.0</span>
                </div>
              </div>

              {/* Miniature Live Layout Preview Card */}
              <div className="h-44 bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2.5 overflow-hidden relative group-hover:border-blue-300 transition">
                <div
                  className="h-3 rounded.w-1/2"
                  style={{ backgroundColor: tpl.previewColor || '#001639' }}
                ></div>
                <div className="h-2 bg-slate-300 rounded w-1/3"></div>
                <div className="space-y-1.5 pt-2">
                  <div className="h-1.5 bg-slate-200 rounded w-full"></div>
                  <div className="h-1.5 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-1.5 bg-slate-200 rounded w-4/6"></div>
                </div>

                {/* Overlaid ATS tag */}
                <div className="absolute bottom-3 end-3 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md text-[9px] font-black border border-emerald-200 flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                  <span>ATS 98%</span>
                </div>
              </div>

              <div>
                <h3 className="font-extrabold text-sm text-[#0B1120]">
                  {isAr ? tpl.nameAr : tpl.nameEn}
                </h3>
                <p className="text-xs text-[#52627A] line-clamp-2 mt-1">
                  {isAr ? tpl.descAr : tpl.descEn}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleUseTemplate(tpl.id)}
              className="w-full py-2.5 bg-[#001639] hover:bg-[#00245E] text-white font-bold text-xs rounded-xl shadow-2xs transition text-center cursor-pointer block"
            >
              {isAr ? 'استخدم هذا القالب' : 'Use This Template'}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
