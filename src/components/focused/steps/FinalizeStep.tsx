import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../../../store/useResumeStore';
import { getTranslation } from '../../../i18n/translations';
import { AtsAnalyzerPanel } from '../../builder/AtsAnalyzerPanel';
import { ARABIC_FONTS, ENGLISH_FONTS } from '../../../utils/resumeFonts';
import { TemplateId, CareerFocus } from '../../../types/resume';
import {
  Download,
  Eye,
  Check,
  Sparkles,
  Palette,
  Layout,
  Type,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  SlidersHorizontal,
  Target,
  FileCheck,
  GraduationCap,
} from 'lucide-react';

interface FinalizeStepProps {
  onPrevMainStep: () => void;
  onOpenPreview?: () => void;
  onExportPdf?: () => void;
  isAr?: boolean;
}

const TEMPLATE_OPTIONS: {
  id: TemplateId;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  badgeAr: string;
  badgeEn: string;
  badgeColor: string;
}[] = [
  {
    id: 'bassux',
    titleAr: 'قالب باسكس (BassUX)',
    titleEn: 'BassUX ATS Standard',
    descAr: 'القالب القياسي الأكثر توافقاً مع أنظمة الـ ATS العالمية بنسبة 100%.',
    descEn: 'The gold-standard ATS template with 100% parse rate.',
    badgeAr: 'الأفضل لـ ATS 100%',
    badgeEn: '100% ATS Safe',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    id: 'modern-ats',
    titleAr: 'عصري متوازن (Modern)',
    titleEn: 'Modern Balanced',
    descAr: 'تنسيق حديث يجمع بين الأناقة البصرية وقابلية القراءة الآلية الفائقة.',
    descEn: 'Contemporary layout balancing aesthetic appeal with high ATS score.',
    badgeAr: 'متوازن وعصري',
    badgeEn: 'Modern & Clean',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  {
    id: 'classic-professional',
    titleAr: 'كلاسيكي تنفيذي (Classic)',
    titleEn: 'Executive Classic',
    descAr: 'تصميم رسمي رصين للوظائف الإدارية، المصرفية، والقيادية العليا.',
    descEn: 'Traditional refined design for corporate and leadership positions.',
    badgeAr: 'تنفيذي ورسمي',
    badgeEn: 'Executive',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  },
  {
    id: 'minimal-exec',
    titleAr: 'مباشر وموجز (Minimal)',
    titleEn: 'Minimal Direct',
    descAr: 'خطوط واضحة ومسافات مريحة تركز بالكامل على المحتوى والنتائج.',
    descEn: 'Clean lines and generous whitespace focusing purely on achievements.',
    badgeAr: 'بسيط ومباشر',
    badgeEn: 'Minimalist',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
  },
  {
    id: 'technical-clean',
    titleAr: 'تقني وهندسي (Tech)',
    titleEn: 'Technical Clean',
    descAr: 'مخصص للمبرمجين والمهندسين مع إبراز المهارات والمشاريع بكفاءة.',
    descEn: 'Optimized for developers and engineers highlighting skills.',
    badgeAr: 'للمهندسين والتقنيين',
    badgeEn: 'Tech & Eng',
    badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  },
  {
    id: 'creative-compact',
    titleAr: 'إبداعي مضغوط (Creative)',
    titleEn: 'Creative Compact',
    descAr: 'استغلال أمثل للمساحة بلمسة عصرية تناسب المجالات الإبداعية والتسويق.',
    descEn: 'Space-optimized modern layout suitable for marketing and creative roles.',
    badgeAr: 'إبداعي ومضغوط',
    badgeEn: 'Compact Creative',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
  },
];

const COLOR_PALETTES = [
  { nameAr: 'كحلي هاش الأساسي', nameEn: 'Navy Deep', color: '#001639' },
  { nameAr: 'برتقالي مرجاني', nameEn: 'Coral Orange', color: '#FF4D2D' },
  { nameAr: 'أخضر زمردي', nameEn: 'Emerald Teal', color: '#0f766e' },
  { nameAr: 'أزرق ملكي', nameEn: 'Royal Blue', color: '#1d4ed8' },
  { nameAr: 'عنابي وقور', nameEn: 'Deep Burgundy', color: '#831843' },
  { nameAr: 'فحمي داكن', nameEn: 'Charcoal Black', color: '#18181b' },
  { nameAr: 'رمادي حجري', nameEn: 'Slate Slate', color: '#334155' },
  { nameAr: 'أحمر قرمزي', nameEn: 'Ruby Red', color: '#b91c1c' },
];

export const FinalizeStep: React.FC<FinalizeStepProps> = ({
  onPrevMainStep,
  onOpenPreview,
  onExportPdf,
  isAr = true,
}) => {
  const {
    settings,
    setTemplate,
    setPrimaryColor,
    setFontFamily,
    setFontSize,
    setCareerFocus,
  } = useResumeStore();

  const currentTemplate = settings?.templateId || 'bassux';
  const currentColor = settings?.primaryColor || '#001639';
  const currentFont = settings?.fontFamily || 'Cairo';
  const currentFontSize = settings?.fontSize || 'md';
  const currentCareerFocus = settings?.careerFocus || 'experienced';

  // Collapsible tool states
  const [isAtsOpen, setIsAtsOpen] = useState(false);
  const [isAdvancedStylingOpen, setIsAdvancedStylingOpen] = useState(false);

  return (
    <motion.div
      key="step-finalize"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="w-full max-w-xl mx-auto space-y-6"
    >
      {/* 1. HERO IMMEDIATE DOWNLOAD CARD */}
      <div className="p-5 sm:p-6 bg-gradient-to-br from-[#001639] to-[#002661] text-white rounded-3xl shadow-md border border-[#001639]/30 relative overflow-hidden">
        {/* Background Subtle Pattern */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-36 h-36 bg-[#FF4D2D]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-[11px] font-bold border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D]" />
            <span>{isAr ? 'الخطوة 05: سيرتك الذاتية مكتملة' : 'Step 05: Your Resume is Complete'}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {isAr ? 'جاهز لتحميل سيرتك الذاتية؟' : 'Ready to download your resume?'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-md">
            {isAr
              ? 'تم تنسيق بياناتك وفق أفضل معايير أنظمة الـ ATS والتصميم الاحترافي. يمكنك تحميل الـ PDF مباشرة الآن.'
              : 'Your data is formatted according to international ATS standards. Download your PDF instantly.'}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              onClick={onExportPdf}
              className="py-3.5 px-6 bg-[#FF4D2D] hover:bg-[#e03d1f] active:scale-[0.98] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Download className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-y-0.5 transition-transform" />
              <span>{isAr ? 'تحميل سيرتك الذاتية PDF' : 'Download Resume PDF'}</span>
            </button>

            {onOpenPreview && (
              <button
                type="button"
                onClick={onOpenPreview}
                className="py-3.5 px-5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4 text-slate-300" />
                <span>{isAr ? 'معاينة ملء الشاشة' : 'Full Preview'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. TEMPLATE SELECTION (6 TEMPLATES) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-[#FF4D2D]" />
            <h3 className="text-sm font-bold text-[#001639]">
              {isAr ? 'اختيار القالب (6 قوالب معتمدة)' : 'Choose Template (6 ATS Templates)'}
            </h3>
          </div>
          <span className="text-[11px] text-[#7a8093] font-medium">
            {isAr ? 'تغيير القالب لا يمس بياناتك' : 'Content is preserved'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {TEMPLATE_OPTIONS.map((tpl) => {
            const isSelected = currentTemplate === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setTemplate(tpl.id)}
                className={`p-3.5 rounded-2xl text-start transition-all cursor-pointer border-2 relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#001639] shadow-sm ring-1 ring-[#001639]/10'
                    : 'bg-white border-[#e8e5de] hover:border-[#FF4D2D]/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tpl.badgeColor}`}
                    >
                      {isAr ? tpl.badgeAr : tpl.badgeEn}
                    </span>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#001639] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-[#001639] mb-1">
                    {isAr ? tpl.titleAr : tpl.titleEn}
                  </h4>
                  <p className="text-[11px] text-[#7a8093] leading-relaxed">
                    {isAr ? tpl.descAr : tpl.descEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. COLOR PALETTE SELECTION */}
      <div className="space-y-3 p-4 sm:p-5 bg-white border border-[#e8e5de] rounded-2xl">
        <div className="flex items-center gap-2 pb-2 border-b border-[#e8e5de]">
          <Palette className="w-4 h-4 text-[#FF4D2D]" />
          <h3 className="text-xs sm:text-sm font-bold text-[#001639]">
            {isAr ? 'اللون الرئيسي للعناوين والخطوط' : 'Primary Brand Color'}
          </h3>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
          {COLOR_PALETTES.map((pal) => {
            const isSelected = currentColor.toLowerCase() === pal.color.toLowerCase();
            return (
              <button
                key={pal.color}
                type="button"
                onClick={() => setPrimaryColor(pal.color)}
                title={isAr ? pal.nameAr : pal.nameEn}
                className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-[#f4f1e9] transition cursor-pointer group"
              >
                <div
                  className="w-9 h-9 rounded-xl shadow-2xs flex items-center justify-center transition-transform group-hover:scale-105 border border-black/10"
                  style={{ backgroundColor: pal.color }}
                >
                  {isSelected && <Check className="w-4 h-4 text-white drop-shadow-xs" />}
                </div>
                <span className="text-[10px] text-[#7a8093] font-medium text-center truncate max-w-[55px] hidden sm:block">
                  {isAr ? pal.nameAr.split(' ')[0] : pal.nameEn.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. OPTIONAL ATS AUDIT TOOL (Collapsible Accordion) */}
      <div className="border border-[#e8e5de] rounded-2xl bg-white overflow-hidden transition-all shadow-2xs">
        <button
          type="button"
          onClick={() => setIsAtsOpen((prev) => !prev)}
          className="w-full p-4 sm:p-4.5 flex items-center justify-between text-start hover:bg-[#fbfaf7] transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#001639]/5 text-[#001639] flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-[#FF4D2D]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-[#001639]">
                  {isAr ? 'فحص التوافق مع إعلان وظيفة (ATS Audit)' : 'Job Description Match (ATS Audit)'}
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f4f1e9] text-[#7a8093] border border-[#e8e5de]">
                  {isAr ? 'اختياري' : 'Optional'}
                </span>
              </div>
              <p className="text-[11px] text-[#7a8093] mt-0.5">
                {isAr
                  ? 'الصق نص إعلان الوظيفة لتحليل الكلمات المفتاحية ونسبة المطابقة قبل التقديم.'
                  : 'Paste the job description to analyze keyword coverage and match rate.'}
              </p>
            </div>
          </div>

          <div className="p-1 text-[#7a8093] shrink-0">
            {isAtsOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        <AnimatePresence>
          {isAtsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="border-t border-[#e8e5de] p-4 sm:p-5 bg-[#fbfaf7]"
            >
              <AtsAnalyzerPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. OPTIONAL ADVANCED STYLING (Collapsible Accordion) */}
      <div className="border border-[#e8e5de] rounded-2xl bg-white overflow-hidden transition-all shadow-2xs">
        <button
          type="button"
          onClick={() => setIsAdvancedStylingOpen((prev) => !prev)}
          className="w-full p-4 sm:p-4.5 flex items-center justify-between text-start hover:bg-[#fbfaf7] transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#001639]/5 text-[#001639] flex items-center justify-center shrink-0">
              <SlidersHorizontal className="w-5 h-5 text-[#001639]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-[#001639]">
                  {isAr ? 'تخصيص متقدم (نوع الخط، الحجم، مستوى الخبرة)' : 'Advanced Styling (Font, Size, Level)'}
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f4f1e9] text-[#7a8093] border border-[#e8e5de]">
                  {isAr ? 'اختياري' : 'Optional'}
                </span>
              </div>
              <p className="text-[11px] text-[#7a8093] mt-0.5">
                {isAr
                  ? 'خيارات إضافية لضبط حجم الخط وتبديل الخطوط الرسمية.'
                  : 'Fine-tune typography, text sizing, and section priorities.'}
              </p>
            </div>
          </div>

          <div className="p-1 text-[#7a8093] shrink-0">
            {isAdvancedStylingOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        <AnimatePresence>
          {isAdvancedStylingOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="border-t border-[#e8e5de] p-4 sm:p-5 bg-white space-y-4"
            >
              {/* Font Family Selection */}
              <div>
                <label className="block text-xs font-bold text-[#001639] mb-1.5">
                  {isAr ? 'نوع الخط (عربي / إنجليزي)' : 'Font Family'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(isAr ? ARABIC_FONTS : ENGLISH_FONTS).map((font) => (
                    <button
                      key={font.id}
                      type="button"
                      onClick={() => setFontFamily(font.id)}
                      className={`p-2 rounded-xl text-center border text-xs font-bold transition cursor-pointer ${
                        currentFont === font.id
                          ? 'bg-[#001639] text-white border-[#001639]'
                          : 'bg-white text-[#001639] border-[#e8e5de] hover:border-[#FF4D2D]'
                      }`}
                    >
                      {isAr ? font.nameAr : font.nameEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Selection */}
              <div>
                <label className="block text-xs font-bold text-[#001639] mb-1.5">
                  {isAr ? 'حجم الخط العام بالسيرة' : 'Resume Font Size'}
                </label>
                <div className="grid grid-cols-3 gap-2 bg-[#f4f1e9] p-1 rounded-xl border border-[#e8e5de]">
                  {(['sm', 'md', 'lg'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFontSize(size)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        currentFontSize === size
                          ? 'bg-white text-[#001639] shadow-2xs'
                          : 'text-[#7a8093] hover:text-[#001639]'
                      }`}
                    >
                      {size === 'sm'
                        ? isAr
                          ? 'صغير (9.5pt)'
                          : 'Small'
                        : size === 'md'
                        ? isAr
                          ? 'معياري (10.5pt)'
                          : 'Standard'
                        : isAr
                        ? 'كبير (11.5pt)'
                        : 'Large'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Career Focus */}
              <div>
                <label className="block text-xs font-bold text-[#001639] mb-1.5">
                  {isAr ? 'مستوى الخبرة وترتيب الأقسام' : 'Career Focus'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCareerFocus('experienced')}
                    className={`p-3 rounded-xl border text-start transition cursor-pointer ${
                      currentCareerFocus === 'experienced'
                        ? 'bg-[#001639]/5 border-[#001639] font-bold text-[#001639]'
                        : 'bg-white border-[#e8e5de] text-[#7a8093]'
                    }`}
                  >
                    <div className="text-xs font-bold">{isAr ? 'ذوو الخبرة' : 'Experienced'}</div>
                    <div className="text-[10px] text-[#7a8093] mt-0.5">
                      {isAr ? 'إبراز الخبرات أولاً' : 'Experience first'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCareerFocus('fresh-grad')}
                    className={`p-3 rounded-xl border text-start transition cursor-pointer ${
                      currentCareerFocus === 'fresh-grad'
                        ? 'bg-[#001639]/5 border-[#001639] font-bold text-[#001639]'
                        : 'bg-white border-[#e8e5de] text-[#7a8093]'
                    }`}
                  >
                    <div className="text-xs font-bold">{isAr ? 'حديث تخرج' : 'Fresh Graduate'}</div>
                    <div className="text-[10px] text-[#7a8093] mt-0.5">
                      {isAr ? 'إبراز التعليم أولاً' : 'Education first'}
                    </div>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 6. STICKY BOTTOM ACTIONS */}
      <div className="pt-3 sm:pt-4 border-t border-[#e8e5de] flex items-center justify-between gap-2.5 sm:gap-3 sticky bottom-0 bg-[#fbfaf7]/95 backdrop-blur-xs py-3 z-10">
        <button
          type="button"
          onClick={onPrevMainStep}
          className="py-3 sm:py-3.5 px-4 sm:px-5 bg-white border-2 border-[#e8e5de] text-[#001639] hover:bg-[#f4f1e9] font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl transition cursor-pointer shrink-0"
        >
          {isAr ? 'السابق' : 'Back'}
        </button>

        <button
          type="button"
          onClick={onExportPdf}
          className="flex-1 max-w-sm py-3 sm:py-3.5 px-4 sm:px-6 bg-[#FF4D2D] hover:bg-[#e03d1f] text-white font-extrabold text-xs sm:text-base rounded-xl sm:rounded-2xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="truncate">{isAr ? 'تحميل ملف PDF' : 'Download PDF'}</span>
        </button>
      </div>
    </motion.div>
  );
};
