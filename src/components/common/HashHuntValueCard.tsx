import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Flame,
  ArrowUpRight,
  Landmark,
  Laptop,
  ShoppingCart,
  HardHat,
  Headphones,
} from 'lucide-react';

interface HashHuntValueCardProps {
  compact?: boolean;
}

export const HashHuntValueCard: React.FC<HashHuntValueCardProps> = ({ compact = false }) => {
  const { settings, hashHuntAutoSubmit, setHashHuntAutoSubmit, resumeData } = useResumeStore();
  const isAr = settings.language === 'ar';
  const [showDetails, setShowDetails] = React.useState(false);

  const candidateTitle =
    resumeData.personalInfo.jobTitle?.trim() || (isAr ? 'تخصصك المهني' : 'Your specialization');

  const partnerSectors = [
    {
      id: 'banking',
      icon: Landmark,
      nameAr: 'القطاع المصرفي والبنوك',
      nameEn: 'Banking & Financial Institutions',
      color: 'border-blue-100 bg-blue-50/50 text-blue-900',
      badgeColor: 'bg-blue-100 text-blue-800',
      companies: isAr
        ? ['البنك التجاري الدولي (CIB)', 'بنك مصر', 'البنك الأهلي المصري', 'QNB الأهلي']
        : ['CIB Egypt', 'Banque Misr', 'National Bank of Egypt', 'QNB Alahli'],
      sampleRolesAr: 'محاسبة، تيلر، خدمة عملاء مصرفية، ائتمان',
      sampleRolesEn: 'Accounting, Bank Teller, CX, Credit Analysis',
      activeJobs: 38,
    },
    {
      id: 'tech',
      icon: Laptop,
      nameAr: 'التكنولوجيا والبرمجيات',
      nameEn: 'Tech & Digital SaaS',
      color: 'border-indigo-100 bg-indigo-50/50 text-indigo-900',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      companies: isAr
        ? ['شركات البرمجيات الناشئة', 'وكالات التسويق الرقمي', 'منصات التجارة الإلكترونية']
        : ['FinTech Startups', 'Digital Agencies', 'E-Commerce Platforms'],
      sampleRolesAr: 'Frontend, Backend, UI/UX, تسويق رقمي',
      sampleRolesEn: 'Frontend, Backend, UI/UX, Digital Marketing',
      activeJobs: 44,
    },
    {
      id: 'retail',
      icon: ShoppingCart,
      nameAr: 'سلاسل التجزئة والسلع الاستهلاكية',
      nameEn: 'Retail, FMCG & Supply Chain',
      color: 'border-amber-100 bg-amber-50/50 text-amber-900',
      badgeColor: 'bg-amber-100 text-amber-800',
      companies: isAr
        ? ['سلاسل كبرى للتجزئة', 'شركات المواد الغذائية (FMCG)', 'شركات التوزيع']
        : ['Hypermarket Chains', 'FMCG Conglomerates', 'Logistics & Supply'],
      sampleRolesAr: 'إدارة فروع، سلاسل إمداد، مبيعات، تسويق منتجات',
      sampleRolesEn: 'Store Management, Supply Chain, B2B Sales',
      activeJobs: 29,
    },
    {
      id: 'construction',
      icon: HardHat,
      nameAr: 'المقاولات والتطوير العقاري',
      nameEn: 'Engineering & Real Estate',
      color: 'border-orange-100 bg-orange-50/50 text-orange-900',
      badgeColor: 'bg-orange-100 text-orange-800',
      companies: isAr
        ? ['شركات التطوير العقاري الكبرى', 'المكاتب الاستشارية الهندسية']
        : ['Major Property Developers', 'Engineering Consultancies'],
      sampleRolesAr: 'هندسة معمارية/مدنية، إشراف مواقع، مبيعات عقارية',
      sampleRolesEn: 'Civil/Arch Engineering, Site Supervision, Sales',
      activeJobs: 17,
    },
    {
      id: 'cx',
      icon: Headphones,
      nameAr: 'خدمة العملاء والاتصالات',
      nameEn: 'Customer Support & Telecom',
      color: 'border-emerald-100 bg-emerald-50/50 text-emerald-900',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      companies: isAr
        ? ['مراكز الاتصال الدولية (BPO)', 'شركات الاتصالات والشبكات']
        : ['Global Call Centers (BPO)', 'Telecom Providers'],
      sampleRolesAr: 'دعم فني، خدمة عملاء عربي/إنجليزي، إدارة حسابات',
      sampleRolesEn: 'Tech Support, Arabic/English CX, Account Reps',
      activeJobs: 14,
    },
  ];

  return (
    <div
      className={`border rounded-2xl transition-all ${
        hashHuntAutoSubmit
          ? 'bg-gradient-to-b from-orange-50/30 via-white to-slate-50/40 border-orange-200/80 shadow-2xs'
          : 'bg-slate-50/70 border-slate-200/80 opacity-90'
      } p-4 sm:p-5 space-y-3.5`}
    >
      {/* Top Header Row with Toggle & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-orange-50 text-[#FF4D2D] border border-orange-200/70">
              <Sparkles className="w-3 h-3 text-[#FF4D2D]" />
              <span>{isAr ? 'مشمول مع باقتك تلقائياً' : 'Included in your plan'}</span>
            </span>
            <span className="text-[11px] font-normal text-slate-500">
              {isAr ? '142 فرصة نشطة هذا الأسبوع' : '142 active openings this week'}
            </span>
          </div>

          <h3 className="font-semibold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#FF4D2D] shrink-0" />
            <span>
              {isAr
                ? 'الترشيح التلقائي لشركات التوظيف عبر Hash Hunt'
                : 'Auto-Submission to Hash Hunt Hiring Partners'}
            </span>
          </h3>

          <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-2xl">
            {isAr
              ? `يتم ربط سيرتك الذاتية المنسقة مباشرة مع قواعد بيانات مسؤولي التوظيف الباحثين عن كفاءات (${candidateTitle}).`
              : `Your ATS-compliant resume is indexed directly with recruiters hiring for (${candidateTitle}).`}
          </p>
        </div>

        {/* Master Toggle Switch */}
        <div className="flex items-center gap-2.5 shrink-0 bg-white px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs self-start sm:self-center">
          <label className="text-xs font-medium text-slate-700 cursor-pointer select-none">
            {hashHuntAutoSubmit
              ? isAr
                ? 'مفعل'
                : 'Active'
              : isAr
              ? 'معطّل'
              : 'Disabled'}
          </label>
          <button
            type="button"
            role="switch"
            aria-checked={hashHuntAutoSubmit}
            onClick={() => setHashHuntAutoSubmit(!hashHuntAutoSubmit)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer focus:outline-hidden ${
              hashHuntAutoSubmit ? 'bg-[#FF4D2D]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition duration-200 ease-in-out shadow-xs ${
                hashHuntAutoSubmit ? (isAr ? '-translate-x-4.5' : 'translate-x-4.5') : isAr ? '-translate-x-0.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Clean, Non-Crowded Sectors Bar with Expand/Collapse Option */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-600 font-normal">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {isAr
                ? 'القطاعات الشريكة: بنوك · تكنولوجيا · تجزئة · مقاولات · خدمة عملاء'
                : 'Partner Sectors: Banking · Tech · Retail · Engineering · CX'}
            </span>
          </span>
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] text-[#FF4D2D] hover:underline font-medium cursor-pointer flex items-center gap-1 shrink-0"
          >
            <span>{showDetails ? (isAr ? 'إخفاء التفاصيل' : 'Hide details') : (isAr ? 'عرض التفاصيل والشركات' : 'View details')}</span>
            <span className="text-[10px]">{showDetails ? '▲' : '▼'}</span>
          </button>
        </div>

        {/* Expandable detailed grid if the user chooses to explore */}
        {showDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 animate-in fade-in-50 duration-200">
            {partnerSectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <div
                  key={sector.id}
                  className={`p-3 rounded-xl border transition-all text-xs space-y-2 ${sector.color}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <Icon className="w-3.5 h-3.5 shrink-0 text-slate-700" />
                      <span className="text-xs">{isAr ? sector.nameAr : sector.nameEn}</span>
                    </div>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${sector.badgeColor} shrink-0`}
                    >
                      {sector.activeJobs} {isAr ? 'فرصة' : 'jobs'}
                    </span>
                  </div>

                  {/* Company badges */}
                  <div className="flex flex-wrap gap-1">
                    {sector.companies.map((comp, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 bg-white border border-slate-200/80 rounded-md text-[10px] font-normal text-slate-700"
                      >
                        {comp}
                      </span>
                    ))}
                  </div>

                  {/* Sample Roles */}
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200/50 flex items-center justify-between">
                    <span className="truncate">
                      {isAr ? sector.sampleRolesAr : sector.sampleRolesEn}
                    </span>
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 ms-1" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Guarantee Strip */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-normal">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>
            {isAr
              ? 'يتم الربط التلقائي في الخلفية بدون أي عمولات على راتبك.'
              : 'Auto-linking occurs in the background with zero salary commissions.'}
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Hash Hunt Verified
        </span>
      </div>
    </div>
  );
};
