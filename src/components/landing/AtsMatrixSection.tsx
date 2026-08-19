import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../../store/useResumeStore';
import {
  Cpu,
  TrendingUp,
  DollarSign,
  Users,
  Wrench,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Search,
} from 'lucide-react';

interface AtsMatrixSectionProps {
  isAr: boolean;
}

export const AtsMatrixSection: React.FC<AtsMatrixSectionProps> = ({ isAr }) => {
  const navigate = useNavigate();
  const { resumeData, setPersonalInfo } = useResumeStore();
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [activeCategory, setActiveCategory] = useState<string>('tech');

  const categories = [
    {
      id: 'tech',
      labelAr: '💻 تكنولوجيا المعلومات والبرمجة',
      labelEn: '💻 Software & IT',
      icon: Cpu,
      roleTitle: isAr ? 'مهندس برمجيات' : 'Software Engineer',
      keywords: [
        'TypeScript',
        'React.js',
        'System Architecture',
        'RESTful APIs',
        'CI/CD Pipelines',
        'Microservices',
        'Agile / Scrum',
        'Docker & Kubernetes',
      ],
      actionVerbsAr: ['صمّمت وقُدت', 'طوّرت وحدّثت', 'حسّنت الأداء بنسبة 45%', 'أتمتت خوادم التطوير'],
      actionVerbsEn: ['Spearheaded', 'Optimized', 'Architected', 'Automated'],
    },
    {
      id: 'marketing',
      labelAr: '📊 التسويق الرقمي والمبيعات',
      labelEn: '📊 Digital Marketing & Sales',
      icon: TrendingUp,
      roleTitle: isAr ? 'مدير تسويق رقمي' : 'Digital Marketing Manager',
      keywords: [
        'SEO / SEM',
        'Google Analytics 4',
        'CAC / LTV Optimization',
        'Content Strategy',
        'HubSpot CRM',
        'PPC Campaigns',
        'Conversion Rate (CRO)',
        'A/B Testing',
      ],
      actionVerbsAr: ['زدت المبيعات بنسبة 60%', 'قُدت حملات إعلانية', 'حسّنت معدل التحويل', 'أدرت ميزانية تسويقية'],
      actionVerbsEn: ['Scaled', 'Boosted ROI', 'Optimized Conversion', 'Managed Budget'],
    },
    {
      id: 'finance',
      labelAr: '💰 المالية والمحاسبة',
      labelEn: '💰 Finance & Accounting',
      icon: DollarSign,
      roleTitle: isAr ? 'محلل مالي ومحاسب' : 'Financial Analyst',
      keywords: [
        'Financial Modeling',
        'IFRS Standards',
        'Budget Forecasting',
        'ERP SAP / Oracle',
        'Risk Analysis',
        'Cash Flow Audit',
        'Variance Analysis',
        'Tax Compliance',
      ],
      actionVerbsAr: ['خفّضت التكاليف التشغيلية', 'أعددت التقارير الميزانية', 'دُقّقت القوائم المالية', 'حلّلت مخاطر الاستثمار'],
      actionVerbsEn: ['Reduced Costs', 'Audited Statements', 'Forecasted Revenues', 'Mitigated Risks'],
    },
    {
      id: 'hr',
      labelAr: '👥 الموارد البشرية والتعيينات',
      labelEn: '👥 Human Resources & Talent',
      icon: Users,
      roleTitle: isAr ? 'أخصائي موارد بشرية' : 'HR & Talent Partner',
      keywords: [
        'Talent Acquisition',
        'HRIS Systems',
        'Employee Engagement',
        'Performance Reviews',
        'Onboarding Workflows',
        'Labor Law Compliance',
        'Compensation & Benefits',
        'Retention Rates',
      ],
      actionVerbsAr: ['وظّفت أكثر من 50 كفاءة', 'حسّنت معدل الاستبقاء', 'طوّرت برامج التدريب', 'أدرت تقييم الأداء'],
      actionVerbsEn: ['Recruited Top Talent', 'Enhanced Retention', 'Streamlined Onboarding', 'Structured HRIS'],
    },
    {
      id: 'engineering',
      labelAr: '⚙️ الهندسة والمشاريع',
      labelEn: '⚙️ Engineering & Operations',
      icon: Wrench,
      roleTitle: isAr ? 'مدير مشاريع هندسية' : 'Project & Engineering Lead',
      keywords: [
        'PMP / PRINCE2',
        'Quality Assurance (QA)',
        'Supply Chain',
        'Vendor Management',
        'Procurement',
        'ISO Standards',
        'Site Safety Inspection',
        'Resource Planning',
      ],
      actionVerbsAr: ['أدرت مشاريع بقيمة 2 مليون', 'سلّمت المهام في الموعد', 'حسّنت سلاسل الإمداد', 'طبقت معايير الجودة'],
      actionVerbsEn: ['Delivered On-Time', 'Managed Vendor Relations', 'Enforced ISO Quality', 'Streamlined Logistics'],
    },
  ];

  const currentCategoryData = categories.find((c) => c.id === activeCategory) || categories[0];

  const handleApplyMatrixRole = () => {
    setPersonalInfo({
      jobTitle: currentCategoryData.roleTitle,
    });
    navigate('/builder');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#E8EEF7] text-[#001639] border border-[#CBD5E1]">
          {isAr ? 'مصفوفة الكلمات المفتاحية التنافسية' : 'ATS Keyword & Action Matrix'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0B1120]">
          {isAr ? 'كيف يُعزز الذكاء الاصطناعي Gemini سيرتك الذاتية؟' : 'How Gemini AI Optimizes Your Field-Specific CV'}
        </h2>
        <p className="text-xs text-[#52627A]">
          {isAr
            ? 'اختر مجالك الوظيفي واستكشف الكلمات والأفعال المفتاحية التي يدمجها النظام تلقائياً للعبور الفوري عبر الروبوتات.'
            : 'Select your target domain to see how Hash Resume matches critical ATS terms.'}
        </p>
      </div>

      {/* Domain Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {categories.map((cat) => {
          const isActive = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer border ${
                isActive
                  ? 'bg-[#001639] text-white border-[#001639] shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{isAr ? cat.labelAr : cat.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Active Domain Keyword Box */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-start"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isAr ? `توليد تلقائي لمجال: ${currentCategoryData.roleTitle}` : `Automated for: ${currentCategoryData.roleTitle}`}</span>
              </div>
              <h3 className="text-lg font-black text-[#0B1120] mt-1.5">
                {isAr ? 'الكلمات المفتاحية المطلوبة في برامج الفلترة (ATS Keywords)' : 'Recommended High-Impact ATS Keywords'}
              </h3>
            </div>

            <button
              type="button"
              onClick={handleApplyMatrixRole}
              className="px-5 py-2.5 bg-[#FF4D2D] hover:bg-[#E5431F] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer shrink-0"
            >
              <span>{isAr ? 'استخدم هذه الكلمات في سيرتك' : 'Build Resume with these terms'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Keywords */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-[#001639] tracking-wider">
                {isAr ? 'المهارات التقنية والكلمات المفتاحية الأساسية:' : 'Core Technical & Functional Skills:'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentCategoryData.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1.5 bg-[#E8EEF7] text-[#001639] text-xs font-bold rounded-xl border border-blue-200/60 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                    <span>{kw}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Action Verbs */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-[#001639] tracking-wider">
                {isAr ? 'أفعال الصياغة الإنجازية القوية (Action Verbs):' : 'Quantifiable Action Phrases:'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(isAr ? currentCategoryData.actionVerbsAr : currentCategoryData.actionVerbsEn).map((verb) => (
                  <div
                    key={verb}
                    className="p-2.5 bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                    <span>{verb}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};
