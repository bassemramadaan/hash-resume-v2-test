import React, { useState } from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { getTranslation } from '../i18n/translations';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, KeyRound, FileText, MessageCircle, Linkedin, Facebook } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const { settings } = useResumeStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      qAr: 'ما هو نظام ATS وكيف تضمن المنصة عبوره؟',
      qEn: 'What is ATS and how does Hash Resume guarantee pass rates?',
      aAr: 'نظام ATS (Applicant Tracking System) هو برمجية تصفية وتصنيف أوتوماتيكية تستخدمها الشركات لمعالجة السير الذاتية قبل وصولها لمسؤول التوظيف. نضمن عبوره من خلال استخدام قوالب العمود الواحد القياسية الخالية من الأشكال المعقدة، مع ترميز النص بدقة ودعم الخطوط المتوافقة.',
      aEn: 'An ATS parses and scores CVs before an HR manager views them. Our builder uses standard single-column vector layouts that ensure searchability and 100% text parsing.',
    },
    {
      qAr: 'كيف يمكنني الدفع عن طريق فودافون كاش أو إنستا باي؟',
      qEn: 'How do I pay using Vodafone Cash or InstaPay?',
      aAr: 'قم باختيار الخطة المناسبة من صفحة التسعير أو نافذة التفعيل، اتبع تعليمات التحويل الفوري لمبلغ الخطة لرقم المحفظة الموضح، وسصلك كود التفعيل لتغذية حسابك بالتحميلات فوراً.',
      aEn: 'Select your preferred plan, transfer the exact amount to the provided wallet/InstaPay ID, and enter your activation code to unlock instant download credits.',
    },
    {
      qAr: 'هل تدعم المنصة اللغة العربية بشكل كامل ودقيق؟',
      qEn: 'Is full Arabic typography natively supported?',
      aAr: 'نعم، تم تطوير المنصة بهندسة دعم الاتجاه من اليمين لليسار (RTL) واستخدام خطوط عربية حديثة مثل (Tajawal, Cairo, IBM Plex Sans Arabic) مع الحفاظ على الهوامش والاتجاهات الصحيحة في PDF.',
      aEn: 'Yes! Hash Resume features full RTL layout design and standard clean Arabic typography (Tajawal, Cairo, IBM Plex Sans) without text distortion.',
    },
    {
      qAr: 'هل أحتاج لدفع اشتراك شهري متكرر؟',
      qEn: 'Do I have to pay a recurring monthly subscription?',
      aAr: 'لا مطلقاً، نموذج الدفع في Hash Resume يعتمد على شراء أكواد تفعيل لعدد محدد من التصديرات بأسعار رمزية دون أي استقطاعات شهرية متكررة.',
      aEn: 'No! Hash Resume operates on pay-per-key activation models. You only pay for what you export without hidden automatic charges.',
    },
    {
      qAr: 'هل يتم حفظ بياناتي الشخصية بشكل آمن؟',
      qEn: 'Is my personal career data kept private?',
      aAr: 'نعم، يتم تخزين سيرتك الذاتية محلياً وبشكل مشفر في متصفحك الخاص (LocalStorage)، ولا نقوم بمشاركة أو بيع بياناتك لأي جهة ثالثة.',
      aEn: 'Your data stays encrypted inside your browser session storage. We adhere to zero-data-selling policies.',
    },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8EEF7] border border-[#CBD5E1] text-[#001639] text-xs font-bold shadow-2xs">
          <HelpCircle className="w-4 h-4 text-[#001639]" />
          <span>{isAr ? 'الأسئلة الأكثر شيوعاً' : 'Frequently Asked Questions'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B1120]">
          {isAr ? 'كل ما تحتاج معرفته عن المنصة والدفع' : 'Everything You Need to Know'}
        </h1>
        <p className="text-xs sm:text-sm text-[#52627A]">
          {isAr
            ? 'إجابات واضحة ومباشرة على استفسارات أنظمة ATS، وسائل الدفع المحلية وتصدير الملفات.'
            : 'Find clear answers regarding ATS compliance, local MENA payments, and exports.'}
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden transition"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                aria-expanded={isOpen}
                className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-4 font-extrabold text-xs sm:text-sm text-[#0B1120] hover:bg-slate-50 cursor-pointer"
              >
                <span>{isAr ? faq.qAr : faq.qEn}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#001639] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#52627A] shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 text-xs text-[#52627A] leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                  {isAr ? faq.aAr : faq.aEn}
                </div>
              )}
            </div>
          );
        })}
        {/* Contact Support & Social Links Card */}
        <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-4 text-center sm:text-start shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center justify-center sm:justify-start gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{isAr ? 'هل لديك سؤال أو تحتاج لمساعدة فورية؟' : 'Need Further Assistance or Have Questions?'}</span>
              </h3>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'فريق الدعم الفني متواجد عبر واتساب وشبكات التواصل لمساعدتك في بناء وتفعيل سيرتك الذاتية.'
                  : 'Our support team is active on WhatsApp and social channels to assist you anytime.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
              <a
                href="https://wa.me/201101007965"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-white" />
                <span>{isAr ? 'واتساب: 011 01007965' : 'WhatsApp: 011 01007965'}</span>
              </a>

              <a
                href="https://www.linkedin.com/company/hashresume"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-[#0A66C2] text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>

              <a
                href="https://www.facebook.com/hashresume"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-[#1877F2] text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition cursor-pointer"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
