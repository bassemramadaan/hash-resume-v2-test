import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, ArrowLeft, CheckCircle2, Building2, Sparkles, Users } from 'lucide-react';

interface HashHuntBridgeSectionProps {
  isAr: boolean;
}

export const HashHuntBridgeSection: React.FC<HashHuntBridgeSectionProps> = ({ isAr }) => {
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const partnerPositions = [
    { title: isAr ? 'مطور واجهات Frontend' : 'Frontend Developer', type: isAr ? 'هجين / Hybrid' : 'Hybrid', location: isAr ? 'القاهرة' : 'Cairo' },
    { title: isAr ? 'مطور نظم Backend' : 'Backend Engineer', type: isAr ? 'عن بُعد / Remote' : 'Remote', location: isAr ? 'عن بُعد' : 'Remote' },
    { title: isAr ? 'مصمم واجهات وتجربة UI/UX' : 'UI/UX Designer', type: isAr ? 'دوام كامل' : 'Full Time', location: isAr ? 'الجيزة' : 'Giza' },
    { title: isAr ? 'أخصائي خدمة عملاء ودعم' : 'Support Specialist', type: isAr ? 'مكتبي' : 'On-site', location: isAr ? 'القاهرة' : 'Cairo' },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FAF9F6] to-white relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF4D2D]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12 relative z-10">
        
        {/* Header Tagline & Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#FF4D2D]/20 shadow-2xs text-xs font-semibold text-[#FF4D2D]">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{isAr ? 'منظومة Hash Hunt للتوظيف' : 'Hash Hunt Talent Bridge'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#001639] tracking-tight leading-tight">
            {isAr ? (
              <>
                مش بس بنعملك الـ CV..<br />
                <span className="text-[#FF4D2D]">بنوصل ملفك لشبكة الشركات</span> المتعاقدة معنا
              </>
            ) : (
              <>
                More than just a CV..<br />
                <span className="text-[#FF4D2D]">Direct bridge</span> to our partner hiring network
              </>
            )}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            {isAr
              ? 'صممت منظومتنا بمسارين واضحين: بناء وتصدير سيرة ATS معتمدة وجديدة عبر المنصة، أو رفع سيرتك السابقة مجاناً تماماً عبر Hash Hunt للتوصيل المباشر لـ 100+ شركة شريكة.'
              : 'Our ecosystem offers two distinct paths: craft a certified ATS resume with Hash Resume, or submit your existing CV 100% free on Hash Hunt to reach 100+ partner companies.'}
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3 text-start hover:border-[#FF4D2D]/40 transition">
            <div className="w-10 h-10 rounded-xl bg-[#001639] text-white flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#FF4D2D]" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-slate-900">
              {isAr ? 'توجيه مباشر لمديري التوظيف' : 'Direct Recruiter Routing'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              {isAr
                ? 'ملفك بيوصل ليد الـ HR والشركات المتعاقدة الباحثة عن كفاءات فورية معتمدة بمعايير ATS.'
                : 'Your profile lands directly on hiring managers desks who actively seek ATS-vetted talent.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3 text-start hover:border-[#FF4D2D]/40 transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-slate-900">
              {isAr ? 'فرص حصرية لمستخدمي المنصة' : 'Exclusive Partner Openings'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              {isAr
                ? 'وظائف لا تُنشر على المنصات العامة، مخصصة حصرياً لأصحاب السير الذاتية الجاهزة عبر المنظومة.'
                : 'Curated job openings not publicly posted elsewhere, exclusively open to Hash Resume candidates.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3 text-start hover:border-[#FF4D2D]/40 transition">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF4D2D] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-slate-900">
              {isAr ? 'تكامل ذكي بين المسارين' : 'Integrated Dual Pathways'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              {isAr
                ? 'عند التفعيل (50 ج.م)، سيرتك بتتحط في رادار التوظيف + بتقدر ترفع سيرة قديمة مجاناً على Hash Hunt.'
                : 'With activation (50 EGP), your CV is placed on the hiring radar + you can upload any existing resume for free on Hash Hunt.'}
            </p>
          </div>
        </div>

        {/* Live Partner Opportunities Preview Strip */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-semibold text-xs sm:text-sm text-slate-900">
                  {isAr ? 'عينة من الفرص المتاحة حالياً على Hash Hunt:' : 'Sample Active Openings on Hash Hunt:'}
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 font-normal">
                {isAr ? 'وظائف نشطة لشركات شريكة جاهزة لاستقبال سيرتك الذاتية مجاناً' : 'Active partner jobs waiting for your CV completely free'}
              </p>
            </div>

            <Link
              to="/hash-hunt"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#001639] hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition active:scale-98 cursor-pointer shrink-0"
            >
              <span>{isAr ? 'ارفع سيرتك مجاناً على Hash Hunt' : 'Upload Free on Hash Hunt'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {partnerPositions.map((pos, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70 hover:border-slate-300 transition text-start space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                    {pos.type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {pos.location}
                  </span>
                </div>
                <div className="font-semibold text-xs text-slate-900 truncate">
                  {pos.title}
                </div>
                <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{isAr ? 'تقديم مباشر' : 'Fast-track Apply'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
