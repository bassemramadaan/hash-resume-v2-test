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
  QrCode,
  ExternalLink,
  ChevronDown,
  MessageCircle,
  Award,
  FileText,
  BadgePercent,
  CheckCircle,
  X,
} from 'lucide-react';
import { QRCodeSVG } from '../components/common/QRCodeSVG';
import { INSTAPAY_ADDRESS, VODAFONE_CASH_NUMBER, INSTAPAY_LINK } from '../lib/constants/payment';
import { HashHuntValueCard } from '../components/common/HashHuntValueCard';

export const PricingPage: React.FC = () => {
  const { settings, setIsActivationModalOpen, activation } = useResumeStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'plans' | 'comparison'>('plans');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const isActivated = activation.isActivated;

  const whatsappConfirmUrl = (planName: string, amount: number) => {
    const message = isAr
      ? `مرحباً دكتور باسم، قمت بتحويل ${amount} ج.م لتفعيل (${planName}) على منصة Hash Resume. أرجو تزويدي بكود التفعيل.`
      : `Hello, I have transferred ${amount} EGP for (${planName}) on Hash Resume. Please send me my activation key.`;
    return `https://wa.me/201101007965?text=${encodeURIComponent(message)}`;
  };

  const faqs = [
    {
      q: isAr ? 'هل الـ 50 ج.م هي فقط لتصميم وتحميل السيرة الذاتية؟' : 'Is the 50 EGP only for downloading the CV?',
      a: isAr
        ? 'لا! الـ 50 ج.م تشمل تصميم سيرة ذاتية احترافية معتمدة 100% لأنظمة الفرز الآلي (ATS) + الرفع والربط التلقائي على منصة Hash Hunt للتوظيف، حيث نعمل كجسر لتوصيل سيرتك الذاتية مباشرةً للشركات والمؤسسات المتعاقدة معنا الباحثة عن تخصصات محددة بدون أي عمولات خفية.'
        : 'No! The 50 EGP covers creating your 100% ATS-compliant PDF resume PLUS automatically uploading & indexing it on Hash Hunt to refer you directly to our contracted hiring partners looking for specialized candidate profiles.'
    },
    {
      q: isAr ? 'هل يتم تجديد الدفع شهرياً بشكل تلقائي؟' : 'Is there an automatic monthly renewal or subscription?',
      a: isAr
        ? 'قطعاً لا! جميع الباقات هنا دفع لمرة واحدة فقط (One-Time Payment). لن يتم خصم أي قرش إضافي من حسابك، ولا نطلب بيانات بطاقتك الائتمانية البنكية.'
        : 'Absolutely not! All plans are 100% one-time payments. No hidden recurring charges, no auto-renewals, and no credit card storage.'
    },
    {
      q: isAr ? 'كيف أستلم كود التفعيل بعد إتمام التحويل؟' : 'How do I receive my activation code after payment?',
      a: isAr
        ? 'بمجرد تحويل المبلغ عبر إنستاباي أو المحفظة الإلكترونية، اضغط على زر "تأكيد التحويل وإدخال الرقم" وسجل رقم العملية واسمك، أو راسلنا فوراً عبر واتساب لنرسل لك كود التفعيل الصالح مدى الحياة في أقل من 3 دقائق.'
        : 'After transferring via InstaPay or Mobile Wallet, click "Confirm Transaction" in the app or contact us via WhatsApp to receive your lifetime activation key within 3 minutes.'
    },
    {
      q: isAr ? 'ما الفارق بين الباقة الفردية (50 ج.م) وباقة الـ 3 نسخ (120 ج.م)؟' : 'What is the difference between Single (50 EGP) and 3-Pack (120 EGP)?',
      a: isAr
        ? 'الباقة الفردية تمنحك كوداً واحداً لتحميل سيرة ذاتية واحدة عالية الدقة. باقة الـ 3 نسخ تمنحك 3 أكواد مستقلة بسعر 40 ج.م فقط للنسخة (توفير 30 ج.م)، وهي مثالية لتجهيز نسخة بالعربية وأخرى بالإنجليزية، أو استهداف مسميات وظيفية مختلفة، وتظل الأكواد صالحة للاستخدام في أي وقت بدون انتهاء صلاحية.'
        : 'The Single plan provides 1 lifetime download code for 1 CV. The 3-Pack gives you 3 independent keys for only 40 EGP each (saving 30 EGP), perfect for bilingual English/Arabic CVs or multiple job profiles.'
    },
    {
      q: isAr ? 'هل بياناتي وتفاصيل سيرتي الذاتية آمنة ومحمية؟' : 'Is my personal information and resume data secure?',
      a: isAr
        ? 'نعم بنسبة 100%. نظام Hash Resume مصمم وفق معايير الخصوصية المحلية المشددة (Client-Side Privacy)؛ نصوصك وبياناتك لا تُباع ولا تُشارك مع أي طرف ثالث، ولا يتم تخزين أرقام بطاقات بنكية على منصتنا.'
        : 'Yes, 100%. Hash Resume operates with strict client-side privacy architecture. Your data is never sold or shared with third parties without your consent.'
    }
  ];

  const comparisonRows = [
    {
      featureAr: 'تحرير وتعديل السيرة الذاتية في المتصفح',
      featureEn: 'Live In-Browser Resume Editor',
      free: isAr ? 'مجاني بالكامل' : 'Free Forever',
      single: isAr ? 'مجاني بالكامل' : 'Free Forever',
      bundle: isAr ? 'مجاني بالكامل' : 'Free Forever',
    },
    {
      featureAr: 'فحص التوافق مع أنظمة ATS واقتراحات الذكاء الاصطناعي',
      featureEn: 'ATS Audit & AI Keyword Optimization',
      free: isAr ? 'متاح' : 'Available',
      single: isAr ? 'متاح ومتقدم' : 'Full Access',
      bundle: isAr ? 'متاح ومتقدم' : 'Full Access',
    },
    {
      featureAr: 'تحميل ملف PDF عالي الدقة (300DPI) نقي',
      featureEn: 'High-Res 300DPI Clean Vector PDF Export',
      free: isAr ? 'غير متاح' : 'Not Included',
      single: isAr ? '1 تحميل سيرة ذاتية' : '1 CV Download',
      bundle: isAr ? '3 تحميلات مستقلة' : '3 CV Downloads',
      highlight: true,
    },
    {
      featureAr: 'إزالة تامة لأي علامات مائية أو لوجوهات',
      featureEn: '100% Watermark-Free Clean Document',
      free: isAr ? 'غير متاح' : 'No',
      single: isAr ? 'نعم (نظيف 100%)' : 'Yes (Clean)',
      bundle: isAr ? 'نعم (نظيف 100%)' : 'Yes (Clean)',
    },
    {
      featureAr: 'الوصول لكافة القوالب الرسمية الـ 5 المعتمدة',
      featureEn: 'Access to All 5 Certified ATS Templates',
      free: isAr ? 'قوالب محدودة' : 'Limited',
      single: isAr ? 'كافة القوالب والخطوط' : 'All Templates & Fonts',
      bundle: isAr ? 'كافة القوالب والخطوط' : 'All Templates & Fonts',
    },
    {
      featureAr: 'الرفع والفهرسة على منصة التوظيف Hash Hunt',
      featureEn: 'Direct Indexing & Matching on Hash Hunt',
      free: isAr ? 'غير متاح' : 'No',
      single: isAr ? 'ترشيح تلقائي' : 'Standard Referral',
      bundle: isAr ? 'أولوية ترشيح VIP لـ 3 نسخ' : 'Priority VIP Referral (3x)',
      highlight: true,
    },
    {
      featureAr: 'صلاحية الأكواد والتفعيلات',
      featureEn: 'Activation Code Validity',
      free: '—',
      single: isAr ? 'صالحة مدى الحياة' : 'Lifetime Validity',
      bundle: isAr ? 'صالحة مدى الحياة' : 'Lifetime Validity',
    },
    {
      featureAr: 'الدعم الفني المباشر',
      featureEn: 'Direct Customer Support',
      free: isAr ? 'مجتمعي' : 'Community',
      single: isAr ? 'دعم قياسي خلال ساعات العمل' : 'Standard Support',
      bundle: isAr ? 'أولوية دعم فوري عبر واتساب VIP' : 'Priority WhatsApp VIP Support',
    },
  ];

  return (
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-50/60 pb-16 pt-6 sm:pt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        
        {/* 1. Header Hero with Refined Trust Cues */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          {/* Active status indicator if unlocked */}
          {isActivated ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs sm:text-sm font-semibold shadow-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {isAr
                  ? 'حسابك مفعّل حالياً وجاهز للتصدير والتحميل الفوري بدون علامات مائية!'
                  : 'Your session is active & ready for instant watermark-free PDF export!'}
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8EEF7] border border-[#CBD5E1] text-[#001639] text-xs font-semibold tracking-wide">
              <CreditCard className="w-3.5 h-3.5 text-[#001639]" />
              <span>{isAr ? 'دفع محلي لمرة واحدة • بدون اشتراكات شهرية خفية' : 'Local One-Time Payment • Zero Recurring Fees'}</span>
            </div>
          )}

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {isAr ? (
              <>
                سيرتك الذاتية القياسية بـ <span className="text-[#FF4D2D]">50 ج.م فقط</span>
                <br className="hidden sm:inline" /> جاهزة للتقديم وتخطي الفرز
              </>
            ) : (
              <>
                Your ATS-Certified Resume for <span className="text-[#FF4D2D]">Only 50 EGP</span>
                <br className="hidden sm:inline" /> One-Time Payment, Instant Download
              </>
            )}
          </h1>

          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            {isAr
              ? 'صُممت لتجتاز خوارزميات الفرز الآلي (ATS) بدقة 100% مع ربط وترشيح تلقائي لملفك عبر منصة Hash Hunt للتوظيف. ادفع بسهولة عبر فودافون كاش أو إنستاباي واستلم ملفك فوراً.'
              : 'Engineered to pass ATS screening algorithms with 100% precision plus automated matching on Hash Hunt. Pay easily via InstaPay or Mobile Wallets for instant delivery.'}
          </p>

          {/* Quick Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px] sm:text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
              <Zap className="w-3 h-3 text-amber-500" />
              {isAr ? 'تفعيل فوري في 3 دقائق' : '3-Min Instant Activation'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              {isAr ? 'معتمد 100% لأنظمة الـ ATS' : '100% ATS Guaranteed'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
              <Award className="w-3 h-3 text-blue-500" />
              {isAr ? 'بدون أي علامة مائية' : 'Zero Watermarks'}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
              <Smartphone className="w-3 h-3 text-[#FF4D2D]" />
              {isAr ? 'إنستاباي وفودافون كاش' : 'InstaPay & Mobile Wallets'}
            </span>
          </div>
        </section>

        {/* 2. Main Pricing Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto items-stretch" dir="ltr">
          
          {/* Plan 1: Single Pass (50 EGP) */}
          <div
            dir={isAr ? 'rtl' : 'ltr'}
            className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative group order-1"
          >
            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 mb-2">
                    {isAr ? 'الباقة الفردية' : 'Single Pass'}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    {t.planSingleTitle}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-normal">
                    {isAr ? 'مثالية للتقديم على وظيفة محددة وتحميل السيرة فوراً' : 'Best for targeted job applications with instant export'}
                  </p>
                </div>

                <div className="text-end shrink-0 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-100">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                      50
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {isAr ? 'ج.م' : 'EGP'}
                    </span>
                  </div>
                  <span className="block text-[10px] text-slate-400 font-medium mt-0.5">
                    {isAr ? 'تدفع لمرة واحدة فقط' : 'One-time payment'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => setIsActivationModalOpen(true)}
                className="w-full py-3.5 px-5 bg-[#001639] hover:bg-[#002866] text-white font-semibold text-xs sm:text-sm rounded-2xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] min-h-[48px]"
              >
                <span>{isAr ? 'تفعيل الباقة الفردية (50 ج.م)' : 'Get Single Key — 50 EGP'}</span>
                <ArrowUpRight className="w-4 h-4 rtl:rotate-[-90deg]" />
              </button>

              <div className="border-t border-slate-100 pt-5 space-y-3 text-xs text-slate-600 font-normal">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-800">
                    {isAr ? 'تحميل 1 سيرة ذاتية بصيغة PDF عالية الدقة (Vector 300DPI)' : '1 Clean High-Res PDF Export (Vector 300DPI)'}
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{isAr ? 'تنسيق معتمد 100% ومفحوص مع أنظمة ATS العالمية' : '100% Tested & Verified ATS Architecture'}</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{isAr ? 'ترشيح وفهرسة تلقائية لملفك على منصة Hash Hunt' : 'Automatic Referral on Hash Hunt Network'}</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{isAr ? 'بدون أي علامة مائية أو شعارات مفروضة على ملفك' : '100% Watermark-Free & Unbranded Document'}</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{isAr ? 'الوصول لجميع القوالب والألوان والخطوط الرسمية' : 'Full Access to All Certified Templates & Fonts'}</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{isAr ? 'صلاحية الكود دائمة للاستخدام في أي وقت' : 'Lifetime Key Validity with No Expiration'}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>{isAr ? '⚡ استلام فوري لكود التحميل' : 'Instant Code Delivery'}</span>
              <a
                href={whatsappConfirmUrl(isAr ? 'الباقة الفردية' : 'Single Pass', 50)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#001639] hover:underline font-medium inline-flex items-center gap-1"
              >
                <MessageCircle className="w-3 h-3 text-emerald-600" />
                <span>{isAr ? 'تأكيد عبر واتساب' : 'WhatsApp Help'}</span>
              </a>
            </div>
          </div>

          {/* Plan 2: 3-Pack Pro Bundle (120 EGP) - Elevated & Featured */}
          <div
            dir={isAr ? 'rtl' : 'ltr'}
            className="bg-white rounded-3xl border-2 border-[#FF4D2D] p-6 sm:p-8 shadow-md hover:shadow-xl transition-all flex flex-col justify-between relative group order-2 mt-4 md:mt-0 ring-4 ring-[#FF4D2D]/10"
          >
            {/* Prominent Floating Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold bg-[#FF4D2D] text-white shadow-sm flex items-center gap-1.5 whitespace-nowrap z-10 select-none">
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>{isAr ? 'الأكثر طلباً وتوفيراً • وفر 30 ج.م' : 'Best Value • Save 30 EGP'}</span>
            </div>

            <div className="space-y-5">
              <div className="flex items-start justify-between gap-4 pt-1">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-100 text-[#FF4D2D] mb-2">
                    {isAr ? 'باقة الباحث النشط' : '3-Resume Pack'}
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    {t.planBundleTitle}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-normal">
                    {isAr ? 'للتقديم بلغات ومسميات مختلفة وتحديث ملفك مستقبلاً' : 'Target different roles, bilingual CVs & future revisions'}
                  </p>
                </div>

                <div className="text-end shrink-0 bg-orange-50/70 p-2.5 rounded-2xl border border-orange-100">
                  <div className="flex items-baseline justify-end gap-1.5">
                    <span className="text-xs line-through text-slate-400 font-normal">150</span>
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#FF4D2D] tracking-tight">
                      120
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {isAr ? 'ج.م' : 'EGP'}
                    </span>
                  </div>
                  <span className="block text-[10px] text-emerald-700 font-semibold mt-0.5">
                    {isAr ? '40 ج.م فقط للنسخة الواحدة' : 'Only 40 EGP per CV'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => setIsActivationModalOpen(true)}
                className="w-full py-3.5 px-5 bg-[#FF4D2D] hover:bg-[#e03e1e] text-white font-semibold text-xs sm:text-sm rounded-2xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.99] min-h-[48px]"
              >
                <span>{isAr ? 'تفعيل باقة الـ 3 نسخ (120 ج.م)' : 'Get 3-Pack Key — 120 EGP'}</span>
                <Sparkles className="w-4 h-4" />
              </button>

              <div className="border-t border-slate-100 pt-5 space-y-3 text-xs text-slate-600 font-normal">
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-slate-900">
                    {isAr ? '3 تفعيلات مستقلة لـ 3 سير ذاتية مختلفة صالحة للأبد' : '3 Separate Download Credits for Different Resumes'}
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium text-slate-800">
                    {isAr ? 'مثالية لنسخة بالعربية وأخرى بالإنجليزية لمضاعفة فرصك' : 'Ideal for Dual Arabic & English Market Versions'}
                  </span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{isAr ? 'ترشيح الـ 3 نسخ للشركات ذات الصلة عبر منصة Hash Hunt' : 'All 3 Profiles Indexed & Referred via Hash Hunt'}</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{isAr ? 'أكوادك صالحة للاستخدام في أي وقت ولا تنتهي صلاحيتها' : 'Credits Never Expire — Save Extras for Future Career Updates'}</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{isAr ? 'وصول مفتوح لكافة القوالب والتعديل بدون حدود' : 'Unlimited Editing and Template Access'}</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-emerald-700 font-semibold">
                    {isAr ? 'أولوية دعم فوري عبر واتساب VIP وتفعيل مباشر' : 'VIP Priority Support on WhatsApp'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-dashed border-orange-200 flex items-center justify-between text-[11px] text-slate-500">
              <span className="text-emerald-600 font-medium">{isAr ? '⭐ أفضل قيمة واستثمار للباحث عن عمل' : 'Best ROI for Job Hunters'}</span>
              <a
                href={whatsappConfirmUrl(isAr ? 'باقة الـ 3 نسخ (120 ج.م)' : '3-Pack Pro Bundle', 120)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF4D2D] hover:underline font-semibold inline-flex items-center gap-1"
              >
                <MessageCircle className="w-3 h-3 text-emerald-600" />
                <span>{isAr ? 'طلب الباقة عبر واتساب' : 'Order via WhatsApp'}</span>
              </a>
            </div>
          </div>
        </section>

        {/* 3. Subtle Redeem Code Bar */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-start shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-[#FF4D2D] shrink-0 shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isAr ? 'هل تمتلك كود تفعيل بالفعل؟' : 'Already have an activation code?'}
                </h3>
                <p className="text-xs text-slate-500 font-normal">
                  {isAr
                    ? 'أدخل الكود المستلم عبر رسالة الواتساب لفتح التحميل الفوري بدون انتظار.'
                    : 'Enter your code received via WhatsApp or message to unlock instant download.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsActivationModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 hover:text-slate-900 transition active:scale-98 cursor-pointer shadow-2xs shrink-0 inline-flex items-center gap-2"
            >
              <span>{isAr ? 'إدخال كود التفعيل' : 'Redeem Code'}</span>
              <ArrowUpRight className="w-4 h-4 rtl:rotate-[-90deg]" />
            </button>
          </div>
        </div>

        {/* 4. Interactive Local Payment Hub (Fintech Experience) */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 max-w-4xl mx-auto space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-orange-50 border border-orange-100 text-[#FF4D2D]">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-base sm:text-lg">
                  {isAr ? 'طرق الدفع المحلية السريعة (مصر)' : 'Direct Egyptian Local Payment Gateways'}
                </h2>
                <p className="text-xs text-slate-500 font-normal">
                  {isAr
                    ? 'تحويل فوري بدون عمولات بنكية عبر إنستاباي أو المحفظة الإلكترونية وتفعيل خلال 3 دقائق'
                    : 'Instant transfers via InstaPay & Mobile Wallets with 3-minute delivery'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {isAr ? 'تأكيد ودعم حي 24/7' : '24/7 Active'}
              </span>
            </div>
          </div>

          {/* Payment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* InstaPay Gateway Card */}
            <div className="bg-linear-to-b from-slate-50/90 to-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between gap-4 shadow-2xs">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {isAr ? 'إنستاباي (InstaPay IPN)' : 'InstaPay App'}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {isAr ? 'تحويل لحظي بين جميع البنوك المصرية' : 'Instant National Payment Network'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {isAr ? 'تحويل فوري' : 'Zero Fee'}
                  </span>
                </div>

                {/* QR Code and Quick Link Box */}
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-3">
                  <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg shrink-0 flex flex-col items-center">
                    <QRCodeSVG value={INSTAPAY_LINK} size={76} level="M" />
                    <span className="text-[9px] font-medium text-slate-500 mt-0.5 flex items-center gap-0.5">
                      <QrCode className="w-2.5 h-2.5 text-[#FF4D2D]" />
                      <span>{isAr ? 'امسح' : 'Scan'}</span>
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 space-y-2 text-start">
                    <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                      {isAr ? 'امسح الرمز بكاميرا إنستاباي أو افتح الرابط المباشر للتحويل في ثوانٍ:' : 'Scan with InstaPay app or click to open direct payment link:'}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <a
                        href={INSTAPAY_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-3 bg-[#001639] hover:bg-[#002866] text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                      >
                        <span>{isAr ? 'فتح رابط إنستاباي' : 'Open Link'}</span>
                        <ArrowUpRight className="w-3 h-3 rtl:rotate-[-90deg]" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopy(INSTAPAY_LINK, 'link')}
                        className="py-1.5 px-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-lg text-xs font-medium transition flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'link' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">{isAr ? 'تم النسخ' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-500" />
                            <span>{isAr ? 'نسخ الرابط' : 'Copy'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* IPA address with one-click copy */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-slate-400 font-medium block mb-0.5">
                      {isAr ? 'عنوان الدفع اللحظي (IPA):' : 'InstaPay IPA Address:'}
                    </span>
                    <span className="text-xs sm:text-[13px] font-mono font-bold text-slate-900 break-all select-all block dir-ltr text-start">
                      {INSTAPAY_ADDRESS}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(INSTAPAY_ADDRESS, 'instapay')}
                    className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95"
                    title={isAr ? 'نسخ عنوان إنستاباي' : 'Copy InstaPay address'}
                  >
                    {copiedKey === 'instapay' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">{isAr ? 'تم النسخ' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>{isAr ? 'نسخ العنوان' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsActivationModalOpen(true)}
                className="w-full text-center py-2.5 bg-[#001639] hover:bg-[#002866] text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
              >
                <span>{isAr ? 'تأكيد التحويل وإدخال رقم العملية' : 'Confirm Reference & Activate'}</span>
                <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-[-90deg]" />
              </button>
            </div>

            {/* Vodafone Cash & Wallets Card */}
            <div className="bg-linear-to-b from-slate-50/90 to-white rounded-2xl border border-slate-200 p-5 flex flex-col justify-between gap-4 shadow-2xs">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📱</span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {isAr ? 'فودافون كاش ومحافظ المحمول' : 'Mobile Wallets (Vodafone / Orange / Etisalat / WE)'}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {isAr ? 'مقبول من جميع محافظ المحمول المصرية' : 'All Egyptian Mobile Network Wallets'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                    {isAr ? 'متاح 24/7' : 'Instant'}
                  </span>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2">
                  <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                    {isAr
                      ? 'حوّل المبلغ (50 أو 120 ج.م) لرقم المحفظة، واحتفظ برقم العملية لتأكيد الحساب فوراً:'
                      : 'Transfer 50 or 120 EGP to our wallet number, then enter your transaction reference:'}
                  </p>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] text-slate-400 font-medium block mb-0.5">
                        {isAr ? 'رقم المحفظة المعتمد:' : 'Official Wallet Number:'}
                      </span>
                      <span className="text-sm font-mono font-bold text-slate-900 select-all block dir-ltr text-start">
                        {VODAFONE_CASH_NUMBER}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(VODAFONE_CASH_NUMBER, 'vodafone')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-95 shadow-2xs"
                      title={isAr ? 'نسخ رقم المحفظة' : 'Copy Wallet Number'}
                    >
                      {copiedKey === 'vodafone' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">{isAr ? 'تم النسخ' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>{isAr ? 'نسخ الرقم' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1">
                    <span>💡</span>
                    <span>{isAr ? 'يمكنك أيضاً التحويل من تطبيق إنستاباي إلى رقم المحفظة مباشرة' : 'You can also transfer from InstaPay to this mobile wallet'}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsActivationModalOpen(true)}
                  className="w-full text-center py-2.5 bg-[#001639] hover:bg-[#002866] text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
                >
                  <span>{isAr ? 'تأكيد التحويل' : 'Confirm Reference'}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 rtl:rotate-[-90deg]" />
                </button>

                <a
                  href={whatsappConfirmUrl(isAr ? 'تحويل محفظة' : 'Wallet Transfer', 50)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isAr ? 'واتساب مباشر' : 'WhatsApp'}</span>
                </a>
              </div>
            </div>
          </div>

          {/* 3 Step Visual Flow */}
          <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4 sm:p-5">
            <h4 className="text-xs font-bold text-slate-800 mb-3 text-center sm:text-start">
              {isAr ? 'خطوات التفعيل في 3 خطوات بسيطة:' : 'Easy 3-Step Activation Process:'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-start">
              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-[#001639] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {isAr ? 'حوّل المبلغ' : 'Transfer Amount'}
                  </p>
                  <p className="text-[11px] text-slate-500 font-normal">
                    {isAr ? '50 ج.م للفردية أو 120 ج.م للثلاث نسخ' : '50 EGP Single or 120 EGP 3-Pack'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-[#FF4D2D] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {isAr ? 'سجّل رقم العملية' : 'Confirm Reference'}
                  </p>
                  <p className="text-[11px] text-slate-500 font-normal">
                    {isAr ? 'في نافذة التفعيل أو راسلنا فوراً عبر واتساب' : 'In the activation popup or via WhatsApp'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-100">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </span>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    {isAr ? 'حمّل سيرتك فوراً' : 'Instant Download'}
                  </p>
                  <p className="text-[11px] text-slate-500 font-normal">
                    {isAr ? 'PDF نقي بجودة 300DPI بدون علامات مائية' : 'High-Res PDF export with zero watermarks'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Detailed Comparison Table Matrix */}
        <section className="max-w-4xl mx-auto space-y-4">
          <div className="text-center space-y-1 mb-2">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
              {isAr ? 'مقارنة شاملة بين الباقات' : 'Comprehensive Feature Comparison'}
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              {isAr ? 'اختر الباقة التي تلبي احتياجات مسيرتك المهنية بأعلى دقة' : 'Compare plans and find the right fit for your career stage'}
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-700">
                    <th className="py-4 px-4 sm:px-6 font-bold text-start text-xs sm:text-sm">
                      {isAr ? 'الميزة / الخاصية' : 'Feature'}
                    </th>
                    <th className="py-4 px-3 sm:px-4 font-semibold text-center text-slate-500">
                      {isAr ? 'المحرر المجاني' : 'Free Editor'}
                    </th>
                    <th className="py-4 px-3 sm:px-4 font-bold text-center text-[#001639] bg-slate-100/50">
                      {isAr ? 'الباقة الفردية (50 ج.م)' : 'Single (50 EGP)'}
                    </th>
                    <th className="py-4 px-3 sm:px-4 font-bold text-center text-[#FF4D2D] bg-orange-50/60">
                      {isAr ? 'باقة الـ 3 نسخ (120 ج.م)' : '3-Pack (120 EGP)'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {comparisonRows.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-50/50 transition-colors ${
                        row.highlight ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 sm:px-6 text-slate-800 font-medium">
                        {isAr ? row.featureAr : row.featureEn}
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 text-center text-slate-500">
                        {row.free === 'غير متاح' || row.free === 'No' || row.free === 'Not Included' ? (
                          <span className="inline-flex items-center text-slate-400">✕</span>
                        ) : (
                          row.free
                        )}
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 text-center font-semibold text-[#001639] bg-slate-50/40">
                        {row.single}
                      </td>
                      <td className="py-3.5 px-3 sm:px-4 text-center font-bold text-[#FF4D2D] bg-orange-50/30">
                        {row.bundle}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-start">
              <span className="text-xs text-slate-600 font-normal">
                {isAr
                  ? 'جميع الباقات تشمل ضمان اجتياز أنظمة الـ ATS والتوافق مع معايير الشركات العالمية.'
                  : 'All plans include our 100% ATS-friendly guarantee and global recruiter formatting.'}
              </span>
              <button
                type="button"
                onClick={() => setIsActivationModalOpen(true)}
                className="px-4 py-2 bg-[#001639] hover:bg-[#002866] text-white rounded-xl text-xs font-semibold transition active:scale-95 cursor-pointer shrink-0 shadow-2xs"
              >
                {isAr ? 'تفعيل حسابك الآن' : 'Get Started Now'}
              </button>
            </div>
          </div>
        </section>

        {/* 6. Hash Hunt Value Showcase */}
        <section className="max-w-4xl mx-auto">
          <HashHuntValueCard />
        </section>

        {/* 7. Trust & Guarantee Badges Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 max-w-4xl mx-auto">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3.5 shadow-2xs">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">
                {isAr ? 'خصوصية تامة 100%' : '100% Privacy First'}
              </h4>
              <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                {isAr ? 'بياناتك لا تُشارك ولا تُباع لأي جهة' : 'Client-side encrypted'}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3.5 shadow-2xs">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">
                {isAr ? 'تفعيل فوري في دقائق' : 'Fast Activation'}
              </h4>
              <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                {isAr ? 'بدون انتظار أو اشتراكات شهرية' : 'Instant code dispatch'}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3.5 shadow-2xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">
                {isAr ? 'ضمان اجتياز الـ ATS' : '100% ATS Verified'}
              </h4>
              <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                {isAr ? 'معايير فحص قياسية للشركات' : 'Approved CV structure'}
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3.5 shadow-2xs">
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-slate-900">
                {isAr ? 'دعم حي عبر واتساب' : 'Live WhatsApp Help'}
              </h4>
              <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
                {isAr ? 'مساعدة مباشرة في أي وقت' : 'Fast human assistance'}
              </p>
            </div>
          </div>
        </section>

        {/* 8. Interactive Frequently Asked Questions */}
        <section className="max-w-3xl mx-auto space-y-4 pt-2">
          <div className="text-center space-y-1 mb-4">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900">
              {isAr ? 'الأسئلة الشائعة حول التسعير والتفعيل' : 'Frequently Asked Questions'}
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              {isAr ? 'إجابات مباشرة على أهم استفسارات الدفع والتحميل' : 'Clear answers to your pricing & payment questions'}
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border transition-all duration-200 ${
                    isOpen ? 'border-[#001639]/30 shadow-xs ring-1 ring-[#001639]/10' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full font-bold text-xs sm:text-sm text-slate-900 p-4 sm:p-5 flex items-center justify-between gap-4 text-start cursor-pointer select-none"
                  >
                    <span>{faq.q}</span>
                    <span className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[#001639] text-white' : 'text-slate-500'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs text-slate-600 leading-relaxed font-normal border-t border-slate-100 mt-1">
                      <p className="pt-2">{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 9. Bottom Floating / Sticky Callout */}
        <section className="text-center py-6 border-t border-slate-200 max-w-4xl mx-auto space-y-3">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            {isAr ? 'جاهز للانطلاق والحصول على سيرتك الذاتية الاحترافية؟' : 'Ready to launch your ATS-certified resume?'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isAr ? 'خطوة واحدة تفصلك عن سيرة ذاتية مميزة تفتح لك أبواب المقابلات الوظيفية.' : 'One simple step towards an outstanding resume that opens recruiter doors.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => setIsActivationModalOpen(true)}
              className="py-3 px-6 bg-[#001639] hover:bg-[#002866] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition cursor-pointer active:scale-95 inline-flex items-center gap-2"
            >
              <span>{isAr ? 'تفعيل الآن (50 ج.م فقط)' : 'Activate Now — 50 EGP'}</span>
              <ArrowUpRight className="w-4 h-4 rtl:rotate-[-90deg]" />
            </button>
            <a
              href="https://wa.me/201101007965"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-xl transition cursor-pointer inline-flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? 'تواصل معنا' : 'Contact Us'}</span>
            </a>
          </div>
        </section>

      </div>
    </main>
  );
};
