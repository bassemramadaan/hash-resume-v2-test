import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { getTranslation } from '../i18n/translations';
import {
  Check,
  ShieldCheck,
  Zap,
  Sparkles,
  CreditCard,
  Smartphone,
  Copy,
  FileCheck,
  HelpCircle,
  Clock,
  Lock,
  ArrowUpRight,
  Headphones,
  CheckCircle2,
} from 'lucide-react';
import { INSTAPAY_ADDRESS, VODAFONE_CASH_NUMBER, INSTAPAY_LINK } from '../lib/constants/payment';

export const PricingPage: React.FC = () => {
  const { settings, setIsActivationModalOpen, activation } = useResumeStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isActivated = activation.isActivated;

  const faqs = [
    {
      q: isAr ? 'هل الـ 50 ج.م هي فقط لتصميم وتحميل السيرة الذاتية؟' : 'Is the 50 EGP only for downloading the CV?',
      a: isAr
        ? 'لا! الـ 50 ج.م تشمل تصميم سيرة ذاتية احترافية متوافقة 100% مع أنظمة ATS + الرفع والربط التلقائي على منصة Hash Hunt للتوظيف، حيث نعمل كجسر لتوصيل سيرتك الذاتية مباشرةً للشركات والمؤسسات المتعاقدة معنا الباحثة عن تخصصات وكفاءات محددة.'
        : 'No! The 50 EGP covers creating your 100% ATS-compliant PDF resume PLUS automatically uploading & indexing it on Hash Hunt to refer you directly to our contracted hiring partners looking for specialized candidate profiles.'
    },
    {
      q: isAr ? 'هل يتم تجديد الدفع شهرياً تلقائياً؟' : 'Is there an automatic monthly renewal?',
      a: isAr
        ? 'قطعاً لا. جميع الأسعار هنا هي دفع لمرة واحدة فقط (One-Time Payment). لن يتم خصم أي قرش إضافي من حسابك مستقبلاً.'
        : 'Absolutely not. All plans are 100% one-time payments. No hidden recurring charges or subscription traps.'
    },
    {
      q: isAr ? 'كيف أستلم كود التفعيل بعد الدفع؟' : 'How do I receive my activation code after payment?',
      a: isAr
        ? 'بمجرد تحويل المبلغ عبر إنستاباي أو فودافون كاش، يمكنك تسجيل رقم العملية والاسم في نافذة التفعيل، أو مراسلتنا فوراً عبر واتساب لتأكيد العملية واستلام كود التحميل خلال دقائق.'
        : 'After transferring via InstaPay or Mobile Wallet, simply enter your transaction reference in the activation modal, or message us on WhatsApp for instant confirmation and code delivery.'
    },
    {
      q: isAr ? 'ما الذي أحصل عليه مع كل تفعيل؟' : 'What is included with each activation credit?',
      a: isAr
        ? 'تحميل سيرة ذاتية بصيغة PDF عالية الدقة بدون أي علامات مائية، مع اعتماد كامل لأنظمة فحص التوظيف الذكية (ATS)، والرفع التلقائي على Hash Hunt لتوصيلك بالشركات، والوصول لجميع القوالب والألوان والخطوط.'
        : 'Full high-resolution PDF download with zero watermarks, 100% ATS compliance guarantee, automated upload to Hash Hunt for employer referral, and unrestricted access to all 5 professional templates.'
    },
    {
      q: isAr ? 'هل بياناتي وتفاصيل سيرتي الذاتية آمنة؟' : 'Is my personal and resume data safe?',
      a: isAr
        ? 'نعم بنسبة 100%. نظام Hash Resume يعمل بتقنية الخصوصية المحلية (Client-Side Privacy)؛ نصوصك وبياناتك لا تُباع ولا تُشارك مع أي جهة خارجية بدون موافقتك.'
        : 'Yes, 100%. Hash Resume adheres strictly to client-side privacy. Your confidential information stays entirely on your device and is never harvested.'
    }
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      {/* 1. Refined Minimal Header */}
      <section className="text-center max-w-2xl mx-auto space-y-2">
        {isActivated ? (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {isAr
                ? 'حسابك مفعّل حالياً وجاهز للتصدير الفوري!'
                : 'Your session is currently activated & ready for export!'}
            </span>
          </div>
        ) : (
          <>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
              {isAr
                ? 'سيرتك الذاتية بـ 50 جنيه فقط — بدون اشتراكات'
                : 'Your Professional Resume for 50 EGP — No Subscriptions'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-normal">
              {isAr
                ? 'متوافقة 100% مع أنظمة ATS — دفعة واحدة جاهزة للتحميل فوراً'
                : '100% ATS-Compliant — One-Time Payment, Instant Download'}
            </p>
          </>
        )}
      </section>

      {/* 2. Cohesive, Harmonized Pricing Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto items-stretch" dir="ltr">
        {/* Single Plan Card (50 EGP) */}
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between relative group order-1"
        >
          <div className="space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                  {isAr ? 'الباقة الفردية' : 'Single Plan'}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  {t.planSingleTitle}
                </h2>
              </div>
              <div className="text-end shrink-0">
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    50
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {isAr ? 'ج.م' : 'EGP'}
                  </span>
                </div>
                <span className="block text-[11px] text-slate-400 font-normal">
                  {isAr ? 'تدفع لمرة واحدة' : 'One-time payment'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed font-normal">
              {t.planSingleDesc}
            </p>

            {/* Instant Action CTA Button */}
            <button
              type="button"
              onClick={() => setIsActivationModalOpen(true)}
              className="btn-folded-corner w-full py-2.5 sm:py-3 px-4 bg-[#001639] hover:bg-[#002866] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-98 min-h-[44px]"
            >
              <span>{isAr ? 'تفعيل الآن (50 ج.م فقط)' : 'Get Single Key — 50 EGP'}</span>
              <ArrowUpRight className="w-4 h-4 rtl:rotate-[-90deg]" />
            </button>

            {/* Hash Hunt Value Feature Highlight Box */}
            <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-100 text-xs text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#FF4D2D] text-xs">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{isAr ? 'الـ 50 ج.م ليست فقط لتحميل الـ CV! 🎯' : 'The 50 EGP is NOT just for a CV! 🎯'}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 font-normal">
                {isAr
                  ? 'تشمل الرفع والربط التلقائي على منصة Hash Hunt لترشيحك وتوصيل سيرتك الذاتية مباشرة لشركات التوظيف المتعاقدة.'
                  : 'Includes automated indexing on Hash Hunt connecting your resume directly with contracted companies hiring for specialized roles.'}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3.5 space-y-2 text-xs text-slate-600 font-normal">
              <div className="flex items-start gap-2">
                <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-slate-800">
                  {isAr ? 'تحميل سيرة ذاتية واحدة بصيغة PDF عالية الدقة' : '1 High-Resolution PDF Download'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{isAr ? 'تنسيق معتمد 100% لأنظمة فحص ATS العالمية' : '100% ATS-Friendly Structure'}</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{isAr ? 'بدون أي علامة مائية أو شعارات مفروضة' : 'Zero Watermarks or Logos'}</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{isAr ? 'الوصول لجميع القوالب الـ 5 والألوان المعتمدة' : 'Access to all 5 Professional Templates'}</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{isAr ? 'دعم كامل للكتابة باللغة العربية والإنجليزية' : 'Full Bilingual Arabic & English Support'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bundle Plan Card (120 EGP - Refined Elevated Style) */}
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className="bg-white rounded-2xl border-2 border-[#FF4D2D] p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative group order-2 mt-3 md:mt-0"
        >
          {/* Prominent Floating Best Value Badge — perfectly placed on the top border, never overlapping prices */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF4D2D] text-white shadow-xs flex items-center gap-1.5 whitespace-nowrap z-10 select-none">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span>{isAr ? 'الأكثر طلباً وتوفيراً' : 'Best Value'}</span>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FF4D2D] block mb-0.5">
                  {isAr ? 'الباقة الاقتصادية الشاملة' : '3-Resume Pack'}
                </span>
                <h2 className="text-base sm:text-lg font-bold text-slate-800">
                  {t.planBundleTitle}
                </h2>
              </div>
              <div className="text-end shrink-0">
                <div className="flex items-baseline justify-end gap-1.5">
                  <span className="text-xs line-through text-slate-400 font-normal">150</span>
                  <span className="text-2xl sm:text-3xl font-bold text-[#FF4D2D] tracking-tight">
                    120
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {isAr ? 'ج.م' : 'EGP'}
                  </span>
                </div>
                <span className="block text-[11px] text-emerald-600 font-medium">
                  {isAr ? 'وفر 30 ج.م (40 ج.م للنسخة)' : 'Save 30 EGP (40 EGP/CV)'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed font-normal">
              {t.planBundleDesc}
            </p>

            {/* Instant Action CTA Button */}
            <button
              type="button"
              onClick={() => setIsActivationModalOpen(true)}
              className="btn-folded-corner w-full py-2.5 sm:py-3 px-4 bg-[#FF4D2D] hover:bg-[#e5431f] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 min-h-[44px]"
            >
              <span>{isAr ? 'تفعيل الباقة الاقتصادية (120 ج.م)' : 'Get 3-Pack Key — 120 EGP'}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            {/* Hash Hunt Value Feature Highlight Box for Bundle */}
            <div className="p-3 rounded-xl bg-orange-50/70 border border-orange-100 text-xs text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[#FF4D2D] text-xs">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{isAr ? 'ترشيح الـ 3 نسخ تلقائياً على Hash Hunt 🎯' : 'All 3 Resumes Auto-Referred on Hash Hunt 🎯'}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 font-normal">
                {isAr
                  ? 'ترشيح كل سيرة ذاتية لوظائف وشركات مختلفة لمضاعفة فرصك في المقابلات والتوظيف.'
                  : 'Every resume variation is indexed for different job profiles to multiply your interview chances.'}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3.5 space-y-2 text-xs text-slate-600 font-normal">
              <div className="flex items-start gap-2">
                <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-slate-800">
                  {isAr ? '3 تفعيلات مستقلة لـ 3 سير ذاتية مختلفة' : '3 Separate Download Credits for Different CVs'}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{isAr ? 'مثالية للتقديم على وظائف متعددة أو بلغتين' : 'Target Different Job Titles or Bilingual CVs'}</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{isAr ? 'أكوادك صالحة للاستخدام في أي وقت بدون تاريخ انتهاء' : 'Credits Never Expire — Use Whenever You Need'}</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{isAr ? 'فحص وتحليل ATS غير محدود لكل النسخ' : 'Unlimited ATS Checker Access for All Copies'}</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="p-0.5 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-emerald-700 font-medium">
                  {isAr ? 'أولوية في الدعم الفني الفوري عبر واتساب' : 'Priority WhatsApp VIP Support'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Subtle Redeem Code Callout */}
      <div className="text-center max-w-4xl mx-auto">
        <button
          type="button"
          onClick={() => setIsActivationModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 transition active:scale-98 cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D]" />
          <span>{isAr ? 'معك كود تفعيل جاهز؟ اضغط هنا لإدخاله' : 'Already have a code? Redeem here'}</span>
        </button>
      </div>

      {/* 4. Harmonized Local Payment Methods Section */}
      <section className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 max-w-4xl mx-auto space-y-4 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-50 border border-orange-100 text-[#FF4D2D] shadow-2xs">
            <Smartphone className="w-4 h-4 text-[#FF4D2D]" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              {isAr ? 'طرق الدفع المحلية المباشرة' : 'Direct Local Payment Methods'}
            </h3>
            <p className="text-xs text-slate-500 font-normal">
              {isAr
                ? 'تحويل فوري عبر إنستاباي أو المحفظة الإلكترونية وتفعيل خلال دقائق'
                : 'Instant transfer via InstaPay or Mobile Wallets'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* InstaPay Quick Card */}
          <div className="bg-slate-50/70 rounded-xl border border-slate-200/80 p-3.5 sm:p-4 flex flex-col justify-between gap-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-base">⚡</span>
                <span className="font-semibold text-xs sm:text-sm text-slate-800">
                  {isAr ? 'إنستاباي (InstaPay)' : 'InstaPay App'}
                </span>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                {isAr ? 'تحويل لحظي' : 'Instant'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-slate-200/90 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 font-normal block mb-0.5">
                  {isAr ? 'عنوان الدفع (IPA):' : 'Payment Address:'}
                </span>
                <span className="text-xs sm:text-[13px] font-mono font-medium text-slate-800 break-all select-all block dir-ltr text-start">
                  {INSTAPAY_ADDRESS}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(INSTAPAY_ADDRESS, 'instapay')}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
                title={isAr ? 'نسخ عنوان إنستاباي' : 'Copy InstaPay address'}
              >
                {copiedKey === 'instapay' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">{isAr ? 'تم' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isAr ? 'نسخ' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>

            <a
              href={INSTAPAY_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center py-2 bg-[#001639] hover:bg-[#002866] text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
            >
              <span>{isAr ? 'فتح تطبيق إنستاباي' : 'Open InstaPay App'}</span>
              <ArrowUpRight className="w-3 h-3 rtl:rotate-[-90deg]" />
            </a>
          </div>

          {/* Vodafone Cash & Wallets */}
          <div className="bg-slate-50/70 rounded-xl border border-slate-200/80 p-3.5 sm:p-4 flex flex-col justify-between gap-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-base">📱</span>
                <span className="font-semibold text-xs sm:text-sm text-slate-800">
                  {isAr ? 'فودافون كاش ومحافظ المحمول' : 'Mobile Wallets'}
                </span>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                {isAr ? 'متاح 24/7' : 'Available 24/7'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-slate-200/90 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 font-normal block mb-0.5">
                  {isAr ? 'رقم المحفظة المعتمد:' : 'Wallet Number:'}
                </span>
                <span className="text-xs sm:text-[13px] font-mono font-medium text-slate-800 break-all select-all block dir-ltr text-start">
                  {VODAFONE_CASH_NUMBER}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(VODAFONE_CASH_NUMBER, 'vodafone')}
                className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
                title={isAr ? 'نسخ رقم المحفظة' : 'Copy Wallet Number'}
              >
                {copiedKey === 'vodafone' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">{isAr ? 'تم' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isAr ? 'نسخ' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsActivationModalOpen(true)}
              className="py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition text-center cursor-pointer shadow-2xs active:scale-98"
            >
              {isAr ? 'تأكيد التحويل وإدخال رقم العملية' : 'Confirm Reference & Unlock'}
            </button>
          </div>
        </div>
      </section>

      {/* 5. Trust & Guarantee Badges */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-center gap-3 shadow-2xs">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-slate-800">
              {isAr ? 'أمان وخصوصية تامة' : '100% Client Privacy'}
            </h4>
            <p className="text-[11px] text-slate-500 font-normal">
              {isAr ? 'بياناتك لا تُشارك أو تُباع لأي جهة' : 'Never shared or sold remotely'}
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-center gap-3 shadow-2xs">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-slate-800">
              {isAr ? 'تفعيل واستلام فوري' : 'Instant Code Delivery'}
            </h4>
            <p className="text-[11px] text-slate-500 font-normal">
              {isAr ? 'بدون انتظار أو اشتراكات مجدولة' : 'Zero waiting or complex sign-ups'}
            </p>
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex items-center gap-3 shadow-2xs">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-xs text-slate-800">
              {isAr ? 'دعم فني عبر واتساب' : 'Direct WhatsApp Help'}
            </h4>
            <p className="text-[11px] text-slate-500 font-normal">
              {isAr ? 'مساعدة مباشرة في أي وقت' : 'Fast human assistance anytime'}
            </p>
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto space-y-3 pt-2">
        <div className="text-center space-y-1 mb-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-800">
            {isAr ? 'الأسئلة الشائعة حول التسعير والتفعيل' : 'Frequently Asked Questions'}
          </h3>
          <p className="text-xs text-slate-500 font-normal">
            {isAr ? 'كل ما تحتاج لمعرفته قبل بدء التفعيل' : 'Everything you need to know before purchasing'}
          </p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-white rounded-xl border border-slate-200/90 p-3.5 transition-all duration-200 open:shadow-xs"
            >
              <summary className="font-semibold text-xs sm:text-[13px] text-slate-800 cursor-pointer list-none flex items-center justify-between gap-3">
                <span>{faq.q}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform duration-200 text-sm">
                  ▾
                </span>
              </summary>
              <p className="mt-2.5 text-xs text-slate-600 leading-relaxed font-normal border-t border-slate-100 pt-2.5">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
};

