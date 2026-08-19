import React from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { getTranslation } from '../i18n/translations';
import { Check, ShieldCheck, KeyRound, Smartphone, Zap, Sparkles, CreditCard, Building } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const { settings, setIsActivationModalOpen, activation } = useResumeStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8EEF7] border border-[#CBD5E1] text-[#001639] text-xs font-bold shadow-2xs">
          <CreditCard className="w-4 h-4 text-[#001639]" />
          <span>{isAr ? 'خطط تسعير بسيطة ودعم كامل لوسائل الدفع المحلية' : 'Transparent Local Pricing'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B1120]">
          {isAr ? 'اختر الخطة المناسبة وابدأ التقديم بثقة' : 'Choose Your Plan & Get Interview Ready'}
        </h1>
        <p className="text-xs sm:text-sm text-[#52627A]">
          {isAr
            ? 'بدون اشتراكات شهريّة خفية أو تجديد تلقائي. دفع مرّة واحدة للحصول على كود التفعيل الفوري.'
            : 'No recurring monthly subscriptions. One-time payment for instant activation keys.'}
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Single Plan Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6 relative">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-[#0B1120] text-base">{t.planSingleTitle}</h3>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-800">
                {t.planSinglePrice}
              </span>
            </div>
            <p className="text-xs text-[#52627A]">{t.planSingleDesc}</p>

            <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs text-[#0B1120]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.planSingleFeature1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.planSingleFeature2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isAr ? 'دعم كامل باللغتين العربية والإنجليزية' : 'Full Arabic & English Support'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isAr ? 'فحص توافق ATS غير محدود' : 'Unlimited ATS Compatibility Checks'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsActivationModalOpen(true)}
            className="w-full py-3 bg-[#001639] hover:bg-[#00214F] text-white font-extrabold text-xs rounded-full transition cursor-pointer shadow-xs"
          >
            {isAr ? 'تفعيل خطة التحميل الفردي' : 'Get Single Key'}
          </button>
        </div>

        {/* Bundle Plan Card */}
        <div className="bg-[#000F27] text-white rounded-3xl border border-[#001639] p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black bg-[#FF4D2D] text-white uppercase shadow-2xs">
            {t.planBundleBadge}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base">{t.planBundleTitle}</h3>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FF4D2D] text-white">
                {t.planBundlePrice}
              </span>
            </div>
            <p className="text-xs text-slate-300">{t.planBundleDesc}</p>

            <div className="border-t border-slate-700 pt-4 space-y-2.5 text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FF4D2D] shrink-0" />
                <span>{t.planBundleFeature1}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FF4D2D] shrink-0" />
                <span>{t.planBundleFeature2}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FF4D2D] shrink-0" />
                <span>{isAr ? 'حفظ دائم وتحديثات غير محدودة' : 'Permanent Saved Profile'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#FF4D2D] shrink-0" />
                <span>{isAr ? 'أولوية في الدعم الفني المباشر' : 'Priority Customer Support'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsActivationModalOpen(true)}
            className="w-full py-3 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-extrabold text-xs rounded-full transition cursor-pointer shadow-md"
          >
            {isAr ? 'تفعيل الخطة الاقتصادية الشاملة' : 'Get Bundle Key'}
          </button>
        </div>
      </div>

      {/* Local Payment Methods Info */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 space-y-4 max-w-4xl mx-auto">
        <h3 className="font-extrabold text-[#0B1120] text-sm flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#001639]" />
          <span>{isAr ? 'طرق الدفع المحلية المتاحة' : 'Accepted Local Payment Methods'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-xl border border-slate-200 font-semibold text-[#0B1120]">
            📱 {t.payVodafoneCash}
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 font-semibold text-[#0B1120]">
            ⚡ {t.payInstapay}
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 font-semibold text-[#0B1120]">
            💳 {t.payCards}
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200 font-semibold text-[#0B1120]">
            🏪 {t.payFawry}
          </div>
        </div>
      </div>
    </main>
  );
};
