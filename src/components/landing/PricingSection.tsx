import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { CheckCircle2, ChevronDown, ChevronUp, Zap, CreditCard, Smartphone, ShieldCheck } from 'lucide-react';

interface PricingSectionProps {
  isAr: boolean;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ isAr }) => {
  const { setIsActivationModalOpen } = useResumeStore();

  const [showMorePlan1, setShowMorePlan1] = useState(false);
  const [showMorePlan2, setShowMorePlan2] = useState(false);

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center py-6">
      <div className="space-y-2">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#E8EEF7] text-[#001639] border border-[#CBD5E1]">
          {isAr ? 'خطط التفعيل المحلية' : 'Simple Local Pricing'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0B1120]">
          {isAr ? 'ادفع مرة واحدة واستمتع بالتحميل الفوري لـ PDF عالي الجودة' : 'Pay Once, Download High-Quality PDF Instantly'}
        </h2>
        <p className="text-xs text-[#52627A]">
          {isAr
            ? 'بدون اشتراكات شهرية خفية. تفعيل فوري عبر فودافون كاش، إنستا باي، وكروت ميزة.'
            : 'No hidden recurring subscriptions. One-time code activation via local MENA payment options.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-start items-stretch">
        {/* Single Pass Card */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-[#52627A]">{isAr ? 'تفعيل فردي' : 'Single Pass'}</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-[#0B1120]">50</span>
                <span className="text-xs font-bold text-[#52627A]">{isAr ? 'ج.م' : 'EGP'}</span>
              </div>
              <p className="text-[11px] text-[#52627A] mt-1">{isAr ? 'تحميل سيرة ذاتية واحدة HD PDF' : '1 HD PDF Download'}</p>
            </div>

            <ul className="space-y-2.5 text-xs text-[#52627A] font-medium border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isAr ? 'تصدير سيرة ذاتية واحدة PDF عالية الجودة' : '1 High-Quality PDF Export'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isAr ? 'وصول لكافة القوالب المعتمدة لـ ATS' : 'Access to all ATS templates'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isAr ? 'استخدام مساعد الذكاء الاصطناعي Gemini' : 'Gemini AI Assistant usage'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{isAr ? 'تعديل وحفظ مفتوح مجاني في المتصفح' : 'Unlimited editing in browser'}</span>
              </li>
            </ul>

            {showMorePlan1 && (
              <div className="text-[11px] text-[#52627A] space-y-1.5 pt-2 border-t border-dashed border-slate-200">
                <p>• {isAr ? 'بدون أي علامات مائية على الملف النهائي.' : 'No watermarks on exported PDF.'}</p>
                <p>• {isAr ? 'دعم العربية والإنجليزية بجميع الخطوط الرسمية.' : 'Full Arabic & English support.'}</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowMorePlan1(!showMorePlan1)}
              className="text-[11px] font-bold text-[#001639] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{showMorePlan1 ? (isAr ? 'عرض أقل' : 'Show Less') : (isAr ? 'عرض التفاصيل المزيدة' : 'Show Details')}</span>
              {showMorePlan1 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsActivationModalOpen(true)}
            className="w-full py-3 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#001639] font-extrabold text-xs rounded-full shadow-2xs transition text-center cursor-pointer"
          >
            {isAr ? 'شراء كود تفعيل فردي' : 'Get Single Key'}
          </button>
        </div>

        {/* 3-Pass Bundle Card */}
        <div className="bg-white text-slate-900 rounded-3xl border-2 border-[#FF4D2D] p-6 sm:p-8 shadow-md hover:shadow-xl transition space-y-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-4 left-4 sm:left-auto sm:right-4 px-3 py-1 bg-[#FF4D2D] text-white font-black text-[10px] rounded-full uppercase tracking-wider shadow-xs">
            {isAr ? 'الأكثر توفيراً ⭐' : 'Best Value ⭐'}
          </div>

          <div className="space-y-4 pt-4 sm:pt-0">
            <div>
              <span className="text-xs font-bold text-[#001639]">{isAr ? 'حزمة 3 تفعيلات' : '3-Download Bundle'}</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl sm:text-4xl font-black text-[#001639]">120</span>
                <span className="text-xs font-bold text-[#52627A]">{isAr ? 'ج.م' : 'EGP'}</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-bold mt-1">
                {isAr ? 'توفير 30 ج.م (40 ج.م فقط لكل تحميل)' : 'Save 30 EGP (40 EGP / export)'}
              </p>
            </div>

            <ul className="space-y-2.5 text-xs text-[#52627A] font-medium border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF4D2D] shrink-0" />
                <span>{isAr ? '3 عمليات تحميل PDF مستقلة HD' : '3 HD PDF Downloads'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF4D2D] shrink-0" />
                <span>{isAr ? 'صلاحية دائمية للكود بدون انتهاء' : 'Permanent Key Validity'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF4D2D] shrink-0" />
                <span>{isAr ? 'مثالي للتقديم بلغات ومسميات متعددة' : 'Ideal for multi-version CVs'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF4D2D] shrink-0" />
                <span>{isAr ? 'دعم فني وتفعيل فوري محلي' : 'Priority Local Support'}</span>
              </li>
            </ul>

            {showMorePlan2 && (
              <div className="text-[11px] text-[#52627A] space-y-1.5 pt-2 border-t border-dashed border-slate-200">
                <p>• {isAr ? 'استخدام الرصيد المتبقي لتحديث سيرتك في أي وقت.' : 'Use remaining quota for future updates.'}</p>
                <p>• {isAr ? 'دعم الدفع الفوري عبر فودافون كاش وإنستا باي.' : 'Instant activation via local wallets.'}</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowMorePlan2(!showMorePlan2)}
              className="text-[11px] font-bold text-[#FF4D2D] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{showMorePlan2 ? (isAr ? 'عرض أقل' : 'Show Less') : (isAr ? 'عرض التفاصيل المزيدة' : 'Show Details')}</span>
              {showMorePlan2 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsActivationModalOpen(true)}
            className="w-full py-3 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-extrabold text-xs rounded-full shadow-md hover:shadow-lg transition text-center cursor-pointer"
          >
            {isAr ? 'شراء باقة الـ 3 تفعيلات الآن' : 'Get 3-Pass Bundle'}
          </button>
        </div>
      </div>
    </section>
  );
};
