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

  const candidateTitle =
    resumeData.personalInfo.jobTitle?.trim() || (isAr ? 'تخصصك المهني' : 'Your specialization');

  const partnerSectors = [
    {
      id: 'banking',
      icon: Landmark,
      nameAr: 'القطاع المصرفي والبنوك',
      nameEn: 'Banking & Financial Institutions',
      color: 'border-blue-200 bg-blue-50/70 text-blue-900',
      badgeColor: 'bg-blue-600 text-white',
      companies: isAr
        ? ['البنك التجاري الدولي (CIB)', 'بنك مصر', 'البنك الأهلي المصري', 'QNB الأهلي', 'بنك القاهرة']
        : ['CIB Egypt', 'Banque Misr', 'National Bank of Egypt', 'QNB Alahli', 'Banque du Caire'],
      sampleRolesAr: 'محاسبة، تيلر، خدمة عملاء مصرفية، ائتمان',
      sampleRolesEn: 'Accounting, Bank Teller, CX, Credit Analysis',
      activeJobs: 38,
    },
    {
      id: 'tech',
      icon: Laptop,
      nameAr: 'التكنولوجيا والبرمجيات',
      nameEn: 'Tech & Digital SaaS',
      color: 'border-indigo-200 bg-indigo-50/70 text-indigo-900',
      badgeColor: 'bg-indigo-600 text-white',
      companies: isAr
        ? ['شركات البرمجيات الناشئة', 'وكالات التسويق الرقمي', 'منصات التجارة الإلكترونية', 'شركات حلول السحابة']
        : ['FinTech Startups', 'Digital Agencies', 'E-Commerce Platforms', 'Cloud Solution Providers'],
      sampleRolesAr: 'Frontend, Backend, UI/UX, تسويق رقمي',
      sampleRolesEn: 'Frontend, Backend, UI/UX, Digital Marketing',
      activeJobs: 44,
    },
    {
      id: 'retail',
      icon: ShoppingCart,
      nameAr: 'سلاسل التجزئة والسلع الاستهلاكية',
      nameEn: 'Retail, FMCG & Supply Chain',
      color: 'border-amber-200 bg-amber-50/70 text-amber-900',
      badgeColor: 'bg-amber-600 text-white',
      companies: isAr
        ? ['سلاسل كبرى للتجزئة', 'شركات المواد الغذائية (FMCG)', 'شركات الأزياء', 'سلاسل التوزيع والإمداد']
        : ['Hypermarket Chains', 'FMCG Conglomerates', 'Fashion Brands', 'Logistics & Supply'],
      sampleRolesAr: 'إدارة فروع، سلاسل إمداد، مبيعات، تسويق منتجات',
      sampleRolesEn: 'Store Management, Supply Chain, B2B Sales',
      activeJobs: 29,
    },
    {
      id: 'construction',
      icon: HardHat,
      nameAr: 'المقاولات والتطوير العقاري',
      nameEn: 'Engineering & Real Estate',
      color: 'border-orange-200 bg-orange-50/70 text-orange-900',
      badgeColor: 'bg-orange-600 text-white',
      companies: isAr
        ? ['شركات التطوير العقاري الكبرى', 'المكاتب الاستشارية الهندسية', 'شركات المقاولات العامة']
        : ['Major Property Developers', 'Engineering Consultancies', 'General Contractors'],
      sampleRolesAr: 'هندسة معمارية/مدنية، إشراف مواقع، مبيعات عقارية',
      sampleRolesEn: 'Civil/Arch Engineering, Site Supervision, Sales',
      activeJobs: 17,
    },
    {
      id: 'cx',
      icon: Headphones,
      nameAr: 'خدمة العملاء والاتصالات',
      nameEn: 'Customer Support & Telecom',
      color: 'border-emerald-200 bg-emerald-50/70 text-emerald-900',
      badgeColor: 'bg-emerald-600 text-white',
      companies: isAr
        ? ['مراكز الاتصال الدولية (BPO)', 'شركات الاتصالات والشبكات', 'مراكز الدعم الفني متعدد اللغات']
        : ['Global Call Centers (BPO)', 'Telecom Providers', 'Multilingual Tech Support'],
      sampleRolesAr: 'دعم فني، خدمة عملاء عربي/إنجليزي، إدارة حسابات',
      sampleRolesEn: 'Tech Support, Arabic/English CX, Account Reps',
      activeJobs: 14,
    },
  ];

  return (
    <div
      className={`border rounded-2xl transition-all ${
        hashHuntAutoSubmit
          ? 'bg-gradient-to-b from-orange-50/40 via-white to-slate-50/50 border-[#FF4D2D]/30 shadow-md shadow-orange-500/5'
          : 'bg-slate-50/70 border-slate-200 opacity-90'
      } p-4 sm:p-5 space-y-4`}
    >
      {/* Top Header Row with Toggle & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/70">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#FF4D2D]/10 text-[#FF4D2D] border border-[#FF4D2D]/20">
              <Flame className="w-3.5 h-3.5 text-[#FF4D2D] animate-pulse" />
              <span>{isAr ? 'ميزة حصرية مشمولة بالـ 50 ج.م' : 'Included in 50 EGP Plan'}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>{isAr ? 'مطلوب هذا الأسبوع: 142 وظيفة نشطة' : '142 Active Openings This Week'}</span>
            </span>
          </div>

          <h3 className="font-tajawal font-bold text-sm sm:text-base text-[#001639] flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#FF4D2D] shrink-0" />
            <span>
              {isAr
                ? 'التقديم والترشيح التلقائي على شركات Hash Hunt الشريكة'
                : 'Auto-Submission to Hash Hunt Contracted Hiring Partners'}
            </span>
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
            {isAr
              ? `الـ 50 ج.م استثمار مهني حقيقي وليست مجرد ملف PDF: نقوم بربط وفهرسة سيرتك الذاتية المنسقة مباشرة مع قواعد بيانات مسؤولي التوظيف في الشركات المتعاقدة والباحثة عن (${candidateTitle}).`
              : `A genuine career investment: Your 50 EGP payment indexes your ATS-compliant resume directly to recruiters at contracted companies actively hiring for (${candidateTitle}).`}
          </p>
        </div>

        {/* Master Toggle Switch */}
        <div className="flex items-center gap-3 shrink-0 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-center">
          <label className="text-xs font-bold text-slate-800 cursor-pointer select-none">
            {hashHuntAutoSubmit
              ? isAr
                ? 'مفعل ومربوط ✅'
                : 'Active & Linked ✅'
              : isAr
              ? 'معطّل'
              : 'Disabled'}
          </label>
          <button
            type="button"
            role="switch"
            aria-checked={hashHuntAutoSubmit}
            onClick={() => setHashHuntAutoSubmit(!hashHuntAutoSubmit)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-[#FF4D2D] focus:ring-offset-2 ${
              hashHuntAutoSubmit ? 'bg-[#FF4D2D]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out shadow-xs ${
                hashHuntAutoSubmit ? (isAr ? '-translate-x-6' : 'translate-x-6') : isAr ? '-translate-x-1' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Contracted Sectors & Brand Badges Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-700 font-bold">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#001639]" />
            <span>
              {isAr
                ? 'القطاعات والشركات المتعاقدة التي تستقبل ملفات مرشحي Hash Resume:'
                : 'Contracted Sectors & Companies Receiving Hash Resume Candidates:'}
            </span>
          </span>
          <span className="text-[11px] text-[#FF4D2D] font-extrabold hidden sm:inline">
            {isAr ? 'بدون أي عمولات على راتبك' : 'Zero Placement Commission'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {partnerSectors.map((sector) => {
            const Icon = sector.icon;
            return (
              <div
                key={sector.id}
                className={`p-3 rounded-xl border transition-all text-xs space-y-2 ${sector.color} hover:shadow-xs`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Icon className="w-4 h-4 shrink-0 text-[#001639]" />
                    <span className="font-tajawal text-xs">{isAr ? sector.nameAr : sector.nameEn}</span>
                  </div>
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${sector.badgeColor} shrink-0`}
                  >
                    {sector.activeJobs} {isAr ? 'فرصة' : 'jobs'}
                  </span>
                </div>

                {/* Company badges */}
                <div className="flex flex-wrap gap-1">
                  {sector.companies.slice(0, 3).map((comp, idx) => (
                    <span
                      key={idx}
                      className="px-1.5 py-0.5 bg-white/90 border border-slate-200 rounded-md text-[10px] font-bold text-slate-800 shadow-2xs"
                    >
                      {comp}
                    </span>
                  ))}
                  {sector.companies.length > 3 && (
                    <span className="px-1.5 py-0.5 bg-white/50 text-slate-600 rounded-md text-[9px] font-bold">
                      +{sector.companies.length - 3} {isAr ? 'المزيد' : 'more'}
                    </span>
                  )}
                </div>

                {/* Sample Roles */}
                <div className="text-[10px] text-slate-600 pt-1 border-t border-slate-200/50 flex items-center justify-between">
                  <span className="truncate">
                    {isAr ? sector.sampleRolesAr : sector.sampleRolesEn}
                  </span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 ms-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Guarantee Strip */}
      <div className="p-3 bg-white border border-slate-200/80 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            {isAr
              ? 'الربط تلقائي بالكامل ويحدث في الخلفية فور اعتماد التحويل والتحميل.'
              : 'Auto-linking occurs in the background upon confirmation and PDF export.'}
          </span>
        </div>
        <div className="text-[11px] font-extrabold text-[#001639] flex items-center gap-1">
          <span>{isAr ? 'Hash Hunt Partnership Verified' : 'Hash Hunt Partnership Verified'}</span>
          <span className="text-emerald-600">✓</span>
        </div>
      </div>
    </div>
  );
};
