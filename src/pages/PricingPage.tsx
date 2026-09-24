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
  Building2,
  Briefcase,
  Target
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
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* 1. Simplified Minimal Header */}
      <section className="text-center max-w-3xl mx-auto space-y-3">
        {isActivated ? (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-bold shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              {isAr
                ? 'حسابك مفعّل حالياً وجاهز للتصدير الفوري!'
                : 'Your session is currently activated & ready for export!'}
            </span>
          </div>
        ) : (
          <>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#001639] tracking-tight leading-tight">
              {isAr
                ? 'سيرة ذاتية احترافية — دفعة واحدة، مش اشتراك شهري'
                : 'Professional Resume — One-Time Payment, No Subscriptions'}
            </h1>
            <p className="text-sm sm:text-base font-semibold text-slate-500">
              {isAr
                ? 'متوافقة 100% مع ATS — جاهزة للتحميل فوراً'
                : '100% ATS-Compliant — Ready for Instant Download'}
            </p>
          </>
        )}
      </section>

      {/* 2. Pricing Cards Directly After Header (50 EGP Left/Top, 120 EGP Right/Bottom - visually dominant) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto items-center" dir="ltr">
        {/* Single Plan Card (50 EGP) - Left on Desktop, Top on Mobile */}
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 py-6 sm:py-7 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between relative group order-1"
        >
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-1">
                  {isAr ? 'الباقة الفردية' : 'Single Plan'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#001639]">
                  {t.planSingleTitle}
                </h2>
              </div>
              <div className="text-end">
                <span className="text-3xl sm:text-4xl font-black text-[#001639] tracking-tight">
                  50
                </span>
                <span className="text-xs font-bold text-slate-500 ms-1">
                  {isAr ? 'ج.م' : 'EGP'}
                </span>
                <span className="block text-[11px] text-slate-400 font-medium">
                  {isAr ? 'تدفع لمرة واحدة' : 'One-time payment'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t.planSingleDesc}
            </p>

            {/* Hash Hunt Value Feature Highlight Box */}
            <div className="p-3 rounded-2xl bg-orange-50/80 border border-orange-200/90 text-xs text-[#001639] space-y-1">
              <div className="flex items-center gap-1.5 font-black text-[#FF4D2D]">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{isAr ? 'شامل الربط والرفع على Hash Hunt 🎯' : 'Includes Hash Hunt Direct Referral 🎯'}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
                {isAr
                  ? 'رفع وتوجيه تلقائي لسيرتك الذاتية لشركات توظيف متعاقدة تبحث عن CVs معينة لوظائف متخصصة.'
                  : 'Automatic indexing & referral connecting your resume directly with companies hiring for specialized roles.'}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2.5 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2.5">
                <div className="p-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-[#001639]">
                  {isAr ? 'تحميل سيرة ذاتية واحدة بصيغة PDF عالية الدقة' : '1 High-Resolution PDF Download'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="p-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{isAr ? 'تنسيق معتمد 100% لأنظمة فحص ATS العالمية' : '100% ATS-Friendly Structure'}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="p-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{isAr ? 'بدون أي علامة مائية أو شعارات مفروضة' : 'Zero Watermarks or Logos'}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="p-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{isAr ? 'الوصول لجميع القوالب الـ 5 والألوان المعتمدة' : 'Access to all 5 Professional Templates'}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="p-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{isAr ? 'دعم كامل للكتابة باللغة العربية والإنجليزية' : 'Full Bilingual Arabic & English Support'}</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="button"
              onClick={() => setIsActivationModalOpen(true)}
              className="btn-folded-corner w-full py-3.5 px-5 bg-[#001639] hover:bg-[#002866] text-white font-black text-xs sm:text-sm rounded-2xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 min-h-[48px]"
            >
              <span>{isAr ? 'تفعيل باقة التحميل الفردي (50 ج.م)' : 'Get Single Key — 50 EGP'}</span>
              <ArrowUpRight className="w-4 h-4 rtl:rotate-[-90deg]" />
            </button>
          </div>
        </div>

        {/* Bundle Plan Card (120 EGP - Featured Best Value) - Right on Desktop, Bottom on Mobile */}
        <div
          dir={isAr ? 'rtl' : 'ltr'}
          className="bg-[#000F27] text-white rounded-3xl border-2 border-[#FF4D2D] p-6 sm:p-8 py-9 sm:py-11 md:py-12 shadow-[0_20px_40px_-12px_rgba(255,77,45,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(255,77,45,0.4)] transition-all flex flex-col justify-between relative overflow-hidden group order-2 md:scale-[1.02]"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -end-24 w-60 h-60 bg-[#FF4D2D]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Prominent Value Badge */}
          <div className="absolute top-4 end-4 px-3.5 py-1.5 rounded-full text-xs font-black bg-[#FF4D2D] text-white uppercase tracking-wider shadow-md flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'الأكثر طلباً وتوفيراً' : 'Best Value'}</span>
          </div>

          <div className="space-y-6 relative z-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#FF4D2D] block mb-1">
                  {isAr ? 'الباقة الاقتصادية الشاملة' : '3-Resume Pack'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {t.planBundleTitle}
                </h2>
              </div>
              <div className="text-end">
                <div className="flex items-baseline justify-end gap-1">
                  <span className="text-xs line-through text-slate-400 font-bold">150</span>
                  <span className="text-3xl sm:text-4xl font-black text-[#FF4D2D] tracking-tight">
                    120
                  </span>
                  <span className="text-xs font-bold text-slate-300 ms-0.5">
                    {isAr ? 'ج.م' : 'EGP'}
                  </span>
                </div>
                <span className="block text-[11px] text-emerald-400 font-bold">
                  {isAr ? 'وفر 30 ج.م فوراً (40 ج.م للنسخة)' : 'Save 30 EGP (40 EGP/CV)'}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.planBundleDesc}
            </p>

            <div className="border-t border-slate-800 pt-5 space-y-3 text-xs sm:text-sm text-slate-200">
              <div className="flex items-start gap-2.5">
                <div className="p-0.5 rounded-full bg-[#FF4D2D]/20 text-[#FF4D2D] shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-white">
                  {isAr ? '3 تفعيلات مستقلة لـ 3 سير ذاتية مختلفة' : '3 Separate Download Credits for Different CVs'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="p-0.5 rounded-full bg-[#FF4D2D]/20 text-[#FF4D2D] shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{isAr ? 'مثالية للتقديم على وظائف متعددة أو بلغتين' : 'Target Different Job Titles or Bilingual CVs'}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="p-0.5 rounded-full bg-[#FF4D2D]/20 text-[#FF4D2D] shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{isAr ? 'أكوادك صالحة للاستخدام في أي وقت بدون تاريخ انتهاء' : 'Credits Never Expire — Use Whenever You Need'}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="p-0.5 rounded-full bg-[#FF4D2D]/20 text-[#FF4D2D] shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>{isAr ? 'فحص وتحليل ATS غير محدود لكل النسخ' : 'Unlimited ATS Checker Access for All Copies'}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="p-0.5 rounded-full bg-[#FF4D2D]/20 text-[#FF4D2D] shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-emerald-400 font-bold">
                  {isAr ? 'أولوية في الدعم الفني الفوري عبر واتساب' : 'Priority WhatsApp VIP Support'}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-8 relative z-10">
            <button
              type="button"
              onClick={() => setIsActivationModalOpen(true)}
              className="btn-folded-corner w-full py-4 px-5 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-black text-xs sm:text-sm rounded-2xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#FF4D2D]/30 active:scale-98 min-h-[48px]"
            >
              <span>{isAr ? 'تفعيل الباقة الاقتصادية (120 ج.م)' : 'Get 3-Pack Key — 120 EGP'}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Hash Hunt Reinforcement Dark Card (Directly After Pricing Cards) */}
      <section className="bg-gradient-to-br from-[#001639] via-[#0B2545] to-[#000F27] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-white/10 relative overflow-hidden max-w-4xl mx-auto">
        <div className="absolute top-0 end-0 w-72 h-72 bg-[#FF4D2D]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4D2D]/20 border border-[#FF4D2D]/30 text-[#FF4D2D] text-xs font-black">
              <Building2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'أكثر من مجرد سيرة ذاتية 🎯' : 'More Than Just a Resume 🎯'}</span>
            </div>
            
            <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
              {isAr ? 'ربط مباشر وترشيح للوظائف عبر Hash Hunt' : 'Direct Referral to Hiring Companies via Hash Hunt'}
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isAr
                ? 'عند تفعيل سيرتك الذاتية، يتم إدراجها تلقائياً على منصة Hash Hunt لنوصلك مباشرةً بالشركات والمؤسسات المتعاقدة الباحثة عن تخصصك وخبراتك.'
                : 'When you activate your resume, it is automatically indexed on Hash Hunt to connect you directly with hiring partners seeking your background.'}
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <div className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-center flex items-center justify-center gap-2">
              <Briefcase className="w-4 h-4 text-[#FF4D2D]" />
              <span className="text-xs font-bold text-slate-100">
                {isAr ? 'ربط تلقائي بالوظائف الشاغرة' : 'Auto-linked to Open Roles'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Prominent Redeem Code Callout Above Payment Section */}
      <div className="text-center max-w-4xl mx-auto pt-2">
        <button
          type="button"
          onClick={() => setIsActivationModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-200/80 text-sm font-bold text-[#FF4D2D] hover:text-[#001639] transition active:scale-98 cursor-pointer shadow-2xs"
        >
          <Sparkles className="w-4 h-4 text-[#FF4D2D]" />
          <span>{isAr ? 'معي كود تفعيل جاهز؟ اضغط هنا لإدخاله' : 'Already have a code? Redeem here'}</span>
        </button>
      </div>

      {/* 5. Harmonized Local Payment Methods Section */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-4xl mx-auto space-y-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-orange-50 border border-orange-200/80 text-[#FF4D2D] shadow-2xs">
            <Smartphone className="w-5 h-5 text-[#FF4D2D]" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#001639] text-base sm:text-lg">
              {isAr ? 'طرق الدفع المحلية السريعة والمباشرة' : 'Instant Local Payment Methods'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {isAr
                ? 'حوّل في ثوانٍ عبر إنستاباي أو المحفظة الإلكترونية وفعّل حسابك فوراً'
                : 'Pay directly via InstaPay or Mobile Wallets for instant code unlock'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* InstaPay Quick Card */}
          <div className="bg-slate-50/70 rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col justify-between gap-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">⚡</span>
                <span className="font-black text-sm text-[#001639]">
                  {isAr ? 'إنستاباي (InstaPay)' : 'InstaPay App'}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                {isAr ? 'تحويل لحظي' : 'Instant'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2.5">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 font-bold block mb-0.5">
                  {isAr ? 'عنوان الدفع (IPA):' : 'Payment Address:'}
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-[#001639] break-all select-all block dir-ltr text-start">
                  {INSTAPAY_ADDRESS}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(INSTAPAY_ADDRESS, 'instapay')}
                className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-[#001639] transition flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
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
              className="text-center py-2.5 bg-[#001639] hover:bg-[#002866] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
            >
              <span>{isAr ? 'فتح تطبيق إنستاباي' : 'Open InstaPay App'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-[-90deg]" />
            </a>
          </div>

          {/* Vodafone Cash & Wallets */}
          <div className="bg-slate-50/70 rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col justify-between gap-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">📱</span>
                <span className="font-black text-sm text-[#001639]">
                  {isAr ? 'فودافون كاش ومحافظ المحمول' : 'Mobile Wallets'}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                {isAr ? 'متاح 24/7' : 'Available 24/7'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2.5">
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-slate-400 font-bold block mb-0.5">
                  {isAr ? 'رقم المحفظة المعتمد:' : 'Wallet Number:'}
                </span>
                <span className="text-xs sm:text-sm font-mono font-bold text-[#001639] break-all select-all block dir-ltr text-start">
                  {VODAFONE_CASH_NUMBER}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(VODAFONE_CASH_NUMBER, 'vodafone')}
                className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-[#001639] transition flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
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
              className="py-2.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-[#001639] transition text-center cursor-pointer shadow-2xs active:scale-98"
            >
              {isAr ? 'تأكيد التحويل وإدخال رقم العملية' : 'Confirm Reference & Unlock'}
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Badges */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#001639]">
              {isAr ? 'أمان وخصوصية تامة' : '100% Client Privacy'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {isAr ? 'بياناتك لا تُشارك أو تُباع لأي جهة' : 'Never shared or sold remotely'}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#001639]">
              {isAr ? 'تفعيل واستلام فوري' : 'Instant Code Delivery'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {isAr ? 'بدون انتظار أو اشتراكات مجدولة' : 'Zero waiting or complex sign-ups'}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-[#001639]">
              {isAr ? 'دعم فني عبر واتساب' : 'Direct WhatsApp Help'}
            </h4>
            <p className="text-[11px] text-slate-500">
              {isAr ? 'مساعدة مباشرة في أي وقت' : 'Fast human assistance anytime'}
            </p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto space-y-4 pt-4">
        <div className="text-center space-y-1.5 mb-6">
          <h3 className="text-xl sm:text-2xl font-black text-[#001639]">
            {isAr ? 'الأسئلة الشائعة حول التسعير والتفعيل' : 'Frequently Asked Questions'}
          </h3>
          <p className="text-xs text-slate-500">
            {isAr ? 'كل ما تحتاج لمعرفته قبل بدء التفعيل' : 'Everything you need to know before purchasing'}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-white rounded-2xl border border-slate-200/90 p-4 transition-all duration-200 open:shadow-xs"
            >
              <summary className="font-extrabold text-xs sm:text-sm text-[#001639] cursor-pointer list-none flex items-center justify-between gap-3">
                <span>{faq.q}</span>
                <span className="text-slate-400 group-open:rotate-180 transition-transform duration-200 text-base">
                  ▾
                </span>
              </summary>
              <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
};

