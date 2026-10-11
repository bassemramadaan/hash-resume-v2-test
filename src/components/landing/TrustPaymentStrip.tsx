import React from 'react';
import { Shield, Smartphone, Award, Zap, Lock, CheckCircle2 } from 'lucide-react';

interface TrustPaymentStripProps {
  isAr: boolean;
}

export const TrustPaymentStrip: React.FC<TrustPaymentStripProps> = ({ isAr }) => {
  return (
    <section className="bg-white border-y border-[#E2E8F0] py-3.5 sm:py-4 px-4 sm:px-6 lg:px-8 shadow-2xs">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:flex lg:items-center lg:justify-around gap-2.5 sm:gap-6 text-xs text-[#52627A] font-medium">
        <div className="flex items-center justify-center sm:justify-start gap-2 bg-slate-50 lg:bg-transparent p-2 sm:p-0 rounded-xl border border-slate-100 lg:border-none text-center sm:text-start">
          <Shield className="w-4 h-4 text-[#001639] shrink-0" />
          <span className="text-[11px] sm:text-xs font-semibold text-slate-800">
            {isAr ? 'دفع لمرة واحدة 50 ج.م' : 'One-time Payment 50 EGP'}
          </span>
        </div>

        <div className="flex items-center justify-center sm:justify-start gap-2 bg-slate-50 lg:bg-transparent p-2 sm:p-0 rounded-xl border border-slate-100 lg:border-none text-center sm:text-start">
          <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-[11px] sm:text-xs font-semibold text-slate-800">
            {isAr ? 'فودافون كاش وإنستاباي 📱' : 'Vodafone Cash & InstaPay 📱'}
          </span>
        </div>

        <div className="flex items-center justify-center sm:justify-start gap-2 bg-slate-50 lg:bg-transparent p-2 sm:p-0 rounded-xl border border-slate-100 lg:border-none text-center sm:text-start">
          <Lock className="w-4 h-4 text-[#FF4D2D] shrink-0" />
          <span className="text-[11px] sm:text-xs">
            {isAr ? 'بدون أي اشتراكات شهرية خفية' : 'No Hidden Recurring Fees'}
          </span>
        </div>

        <div className="flex items-center justify-center sm:justify-start gap-2 bg-slate-50 lg:bg-transparent p-2 sm:p-0 rounded-xl border border-slate-100 lg:border-none text-center sm:text-start">
          <Zap className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-[11px] sm:text-xs">
            {isAr ? 'تحميل فوري لملف الـ PDF ⚡' : 'Instant PDF Export ⚡'}
          </span>
        </div>
      </div>
    </section>
  );
};
