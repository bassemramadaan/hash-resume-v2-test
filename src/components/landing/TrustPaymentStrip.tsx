import React from 'react';
import { Shield, Smartphone, Award, Zap, Lock, CheckCircle2 } from 'lucide-react';

interface TrustPaymentStripProps {
  isAr: boolean;
}

export const TrustPaymentStrip: React.FC<TrustPaymentStripProps> = ({ isAr }) => {
  return (
    <section className="bg-white border-y border-[#E2E8F0] py-4 sm:py-5 px-4 sm:px-6 lg:px-8 shadow-2xs">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:flex lg:items-center lg:justify-around gap-3 sm:gap-6 text-xs text-[#52627A] font-extrabold">
        <div className="flex items-center justify-center sm:justify-start gap-2 bg-slate-50/80 lg:bg-transparent p-2.5 sm:p-0 rounded-2xl border border-slate-100 lg:border-none text-center sm:text-start">
          <Shield className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#001639] shrink-0" />
          <span className="text-[11px] sm:text-xs">{isAr ? 'خصوصية محليّة 100% 🔒' : '100% Local Privacy 🔒'}</span>
        </div>

        <div className="flex items-center justify-center sm:justify-start gap-2 bg-slate-50/80 lg:bg-transparent p-2.5 sm:p-0 rounded-2xl border border-slate-100 lg:border-none text-center sm:text-start">
          <Smartphone className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-600 shrink-0" />
          <span className="text-[11px] sm:text-xs">{isAr ? 'فودافون كاش وإنستا باي 📱' : 'Vodafone Cash & InstaPay 📱'}</span>
        </div>

        <div className="flex items-center justify-center sm:justify-start gap-2 bg-slate-50/80 lg:bg-transparent p-2.5 sm:p-0 rounded-2xl border border-slate-100 lg:border-none text-center sm:text-start">
          <Award className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#FF4D2D] shrink-0" />
          <span className="text-[11px] sm:text-xs">{isAr ? 'معايير ATS معتمدة 📜' : 'Global ATS Standards 📜'}</span>
        </div>

        <div className="flex items-center justify-center sm:justify-start gap-2 bg-slate-50/80 lg:bg-transparent p-2.5 sm:p-0 rounded-2xl border border-slate-100 lg:border-none text-center sm:text-start">
          <Zap className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-500 shrink-0" />
          <span className="text-[11px] sm:text-xs">{isAr ? 'بدون اشتراك شهري ⚡' : 'No Recurring Fee ⚡'}</span>
        </div>
      </div>
    </section>
  );
};
