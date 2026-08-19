import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Download,
  Languages,
  Smartphone,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  Lock,
  Layers,
  FileCheck,
  CreditCard,
  Target,
  RefreshCw,
  Award
} from 'lucide-react';

interface FeaturesSectionProps {
  isAr: boolean;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ isAr }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  const categories = [
    { id: 'all', labelAr: '💎 جميع المزايا', labelEn: '💎 All Features' },
    { id: 'ai_ats', labelAr: '🤖 الذكاء الاصطناعي و ATS', labelEn: '🤖 AI & ATS Parsing' },
    { id: 'privacy_pdf', labelAr: '🔒 الخصوصية والتصدير', labelEn: '🔒 Privacy & HD Export' },
    { id: 'local_pay', labelAr: '📱 الدفع المحلي السريع', labelEn: '📱 Local MENA Payment' },
  ];

  const features = [
    {
      id: 'ai_enhancement',
      category: 'ai_ats',
      icon: Sparkles,
      iconBg: 'bg-amber-100 text-amber-800',
      badgeAr: 'مدعوم بـ Gemini AI',
      badgeEn: 'Gemini AI Powered',
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-200',
      titleAr: 'صياغة ذكية بالذكاء الاصطناعي',
      titleEn: 'AI Smart Content Generation',
      shortDescAr: 'إعادة صياغة نقاط خبراتك وإبراز الأرقام والإنجازات بأفعال عمل قياسية تناسب كل مجال.',
      shortDescEn: 'Auto-refine experience bullet points with action verbs and quantifiable metrics.',
      detailedDescAr: 'يساعدك مساعد Gemini الذكي على اقتراح جمل محترفة وإضافة الكلمات المفتاحية الأكثر طلباً في سوق العمل، مما يرفع فرصة القبول المبدئي لسيرتك الذاتية بنسبة تصل إلى 300%.',
      detailedDescEn: 'Gemini AI suggests keywords and optimizes achievements, boosting recruiter callback rates significantly.',
    },
    {
      id: 'ats_guarantee',
      category: 'ai_ats',
      icon: Cpu,
      iconBg: 'bg-emerald-100 text-emerald-800',
      badgeAr: 'مطابقة 100% مع خوارزميات التوظيف',
      badgeEn: '100% ATS Compliant',
      badgeColor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      titleAr: 'قوالب مهندسة لا تتأثر بالفلترة الآلية',
      titleEn: 'Engineered ATS Templates',
      shortDescAr: 'تصميم خطي خالٍ من الجداول المعقدة لضمان قراءة 100% من بياناتك عبر Taleo وWorkday.',
      shortDescEn: 'Single-column structure built to pass Workday, Taleo, and Greenhouse systems.',
      detailedDescAr: 'تم بناء الهيكل البرمجي لقوالبنا وفقاً للقياسات الرسمية المعتمَدة لدى كبرى شركات التوظيف، مما يضمن استخراج الأسماء والتواريخ والمهارات بدقة متناهية دون أي تشويه نصي.',
      detailedDescEn: 'Designed according to official recruiter standards ensuring error-free data extraction.',
    },
    {
      id: 'local_privacy',
      category: 'privacy_pdf',
      icon: ShieldCheck,
      iconBg: 'bg-blue-100 text-blue-800',
      badgeAr: 'أمان وتشفير محلي 100%',
      badgeEn: '100% Client Privacy',
      badgeColor: 'bg-blue-50 text-blue-900 border-blue-200',
      titleAr: 'خصوصية تامة داخل متصفحك (Local-First)',
      titleEn: 'Local-First Data Storage',
      shortDescAr: 'بياناتك الشخصية تُحفظ على جهازك فقط، ولا تُباع أو تُنقل لأي خوادم خارجية.',
      shortDescEn: 'Your resume data is stored safely in your browser and never sold to 3rd parties.',
      detailedDescAr: 'نحن نعتمد تقنية التخزين المحلي الآمنة (Local Storage) داخل جهازك. سيرتك الذاتية وبياناتك الحساسة تظل ملكك الخاص دون أي تخزين سحابي غير مرغوب فيه.',
      detailedDescEn: 'Data remains strictly inside your device browser local state, guaranteeing full privacy.',
    },
    {
      id: 'vector_pdf',
      category: 'privacy_pdf',
      icon: Download,
      iconBg: 'bg-indigo-100 text-indigo-800',
      badgeAr: 'تحميل بدون علامات مائية',
      badgeEn: 'No Watermarks',
      badgeColor: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      titleAr: 'تصدير PDF شعاعي فائق الجودة',
      titleEn: 'HD Vector PDF Exporter',
      shortDescAr: 'تنزيل ملفات PDF بنصوص قابلة للنسخ والبحث مع دقة طباعة متناسقة تماماً.',
      shortDescEn: 'High-resolution PDF generation with standard selectable text & instant print layout.',
      detailedDescAr: 'محرك التصدير الخطي ينتج ملفات PDF نقيّة خفيفة الحجم ولكنها فائقة الوضوح، مع مطابقة خطوط قياسية Unicode لا تتعرض للتلف أو الضبابية عند طباعتها أو مسحها آلياً.',
      detailedDescEn: 'Vector engine creates clean PDF documents optimized for both human reading and machine scanners.',
    },
    {
      id: 'bilingual_support',
      category: 'ai_ats',
      icon: Languages,
      iconBg: 'bg-purple-100 text-purple-800',
      badgeAr: 'عربي + إنجليزي (RTL / LTR)',
      badgeEn: 'Arabic & English Ready',
      badgeColor: 'bg-purple-50 text-purple-900 border-purple-200',
      titleAr: 'دعم كامل ومحاذاة احترافية للغتين',
      titleEn: 'Full Bilingual Formatting',
      shortDescAr: 'ضبط تلقائي لاتجاه النص، والخطوط العربية الرسمية (Kufi/Naskh) والإنجليزية.',
      shortDescEn: 'Automatic text direction alignment for Arabic and English typography.',
      detailedDescAr: 'يدعم النظام التبديل السلس بين اللغة العربية والإنجليزية بضغطة زر واحدة، مع ضبط المسافات وعلامات الترقيم وتنسيق العناوين بما يلائم قواعد كل لغة.',
      detailedDescEn: 'Seamlessly switch between Arabic RTL and English LTR layouts with tuned font pairings.',
    },
    {
      id: 'local_payments',
      category: 'local_pay',
      icon: Smartphone,
      iconBg: 'bg-emerald-100 text-emerald-800',
      badgeAr: 'فودافون كاش وإنستا باي',
      badgeEn: 'Vodafone Cash & InstaPay',
      badgeColor: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      titleAr: 'دفع محلي سهل بدون اشتراكات شهرية',
      titleEn: 'Local MENA Instant Activation',
      shortDescAr: 'تفعيل فوري بكود بسيط عبر كاش أو إنستا باي، ادفع فقط عندما تريد التنزيل.',
      shortDescEn: 'Instant one-time activation key via local wallets with zero recurring charges.',
      detailedDescAr: 'لا حاجة لبطاقات الائتمان الدولية أو الخوف من الخصم الشهري المتكرر! ادفع رسم تفعيل بسيط لمرة واحدة للحصول على ملفك الجاهز مباشرة.',
      detailedDescEn: 'No international credit card required. Pay once via local wallet and download your CV.',
    },
  ];

  const filteredFeatures = features.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedFeature(expandedFeature === id ? null : id);
  };

  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-8 scroll-mt-20">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#E8EEF7] text-[#001639] border border-[#CBD5E1] inline-flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-[#FF4D2D]" />
          <span>{isAr ? 'مزايا المنصة الاستثنائية' : 'Platform Key Advantages'}</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0B1120]">
          {isAr ? 'لماذا يختار المحترفون منصة Hash Resume؟' : 'Why Job Seekers Prefer Hash Resume'}
        </h2>
        <p className="text-xs text-[#52627A]">
          {isAr
            ? 'مجموعة متكاملة من الأدوات التقنية المصممة خصيصاً لرفع فرصك في سوق العمل وتوفير أقصى درجات السهولة والخصوصية.'
            : 'Advanced feature set engineered for speed, privacy, and max recruiter response.'}
        </p>
      </div>

      {/* Horizontal Scrollable Mobile-Optimized Category Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-4 px-4 sm:mx-0">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition flex items-center gap-2 cursor-pointer shrink-0 border ${
                isActive
                  ? 'bg-[#001639] text-white border-[#001639] shadow-md scale-[1.02]'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 active:bg-slate-200'
              }`}
            >
              <span>{isAr ? cat.labelAr : cat.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Features Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        <AnimatePresence mode="popLayout">
          {filteredFeatures.map((item) => {
            const Icon = item.icon;
            const isExpanded = expandedFeature === item.id;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-3xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs hover:shadow-md transition space-y-4 text-start flex flex-col justify-between group active:bg-slate-50/50"
              >
                <div className="space-y-3.5">
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between gap-2">
                    <div className={`w-11 h-11 rounded-2xl ${item.iconBg} flex items-center justify-center font-bold shrink-0 shadow-2xs`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${item.badgeColor} shrink-0`}>
                      {isAr ? item.badgeAr : item.badgeEn}
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-sm sm:text-base text-[#0B1120] group-hover:text-[#001639] transition">
                      {isAr ? item.titleAr : item.titleEn}
                    </h3>
                    <p className="text-xs text-[#52627A] leading-relaxed">
                      {isAr ? item.shortDescAr : item.shortDescEn}
                    </p>
                  </div>

                  {/* Expandable Detailed Explanation for Mobile & Desktop */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 border-t border-slate-100 text-[11px] text-[#001639] font-medium leading-relaxed bg-slate-50/80 p-3 rounded-2xl border border-slate-200/80 space-y-1"
                    >
                      <div className="font-bold text-xs flex items-center gap-1.5 text-[#001639]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{isAr ? 'القيمة التنافسية:' : 'Key Value:'}</span>
                      </div>
                      <p>{isAr ? item.detailedDescAr : item.detailedDescEn}</p>
                    </motion.div>
                  )}
                </div>

                {/* Bottom Interactive Expand Toggle */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="text-[11px] font-extrabold text-[#001639] hover:text-[#FF4D2D] transition flex items-center gap-1 cursor-pointer py-1"
                  >
                    <span>
                      {isExpanded
                        ? isAr
                          ? 'إخفاء التفاصيل'
                          : 'Hide Details'
                        : isAr
                        ? 'اقرأ المزيد عن هذه الميزة'
                        : 'Learn More'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                    {isAr ? 'متاح مجاناً' : 'Included'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
};
