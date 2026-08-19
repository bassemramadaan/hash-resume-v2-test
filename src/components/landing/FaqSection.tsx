import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle } from 'lucide-react';

interface FaqSectionProps {
  isAr: boolean;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ isAr }) => {
  const [openFaqs, setOpenFaqs] = useState<number[]>([0, 1]);
  const [searchFaq, setSearchFaq] = useState('');

  const toggleFaq = (index: number) => {
    if (openFaqs.includes(index)) {
      setOpenFaqs(openFaqs.filter((i) => i !== index));
    } else {
      setOpenFaqs([...openFaqs, index]);
    }
  };

  const faqItems = [
    {
      q: isAr
        ? 'كيف تضمن المنصة توافق السيرة الذاتية مع نظام ATS بنسبة 100%؟'
        : 'How does Hash Resume guarantee 100% ATS compliance?',
      a: isAr
        ? 'تم بناء قوالب المنصة وتصدير PDF بدون استخدام جداول أو عناصر نصوص معقدة غير قابلة للقراءة آلياً. يضمن الهيكل الهندسي قراءة العناوين والتواريخ والمهارات بدقة متناهية عبر أنظمة الفلترة مثل Taleo, Workday, and Greenhouse.'
        : 'Our templates and vector PDF exporter eliminate unparseable tables and graphics. Headers, dates, and skills adhere to structural standards read natively by systems like Taleo, Workday, and Greenhouse.',
    },
    {
      q: isAr
        ? 'ما هي وسائل الدفع المحلية المتاحة للحصول على كود التفعيل؟'
        : 'What local payment options are supported?',
      a: isAr
        ? 'ندعم جميع وسائل الدفع في مصر والشرق الأوسط: محافط الموبايل الإلكترونية (فودافون كاش، أورنج كاش، اتصالات كاش، وي باي)، خدمة إنستا باي (InstaPay)، كروت ميزة، والبطاقات البنكية المباشرة.'
        : 'We support all local MENA payment methods: mobile wallets (Vodafone Cash, InstaPay, Fawry), Meeza cards, and debit/credit cards.',
    },
    {
      q: isAr
        ? 'هل أحتاج لإدخال بيانات بطاقتي أو إنشاء حساب للبدء؟'
        : 'Do I need a credit card or user registration to start?',
      a: isAr
        ? 'لا على الإطلاق! يمكنك استخدام المنشئ بالكامل، تجربة الذكاء الاصطناعي، واستعراض القوالب مجاناً وبدون تسجيل أي حساب. يتم التفعيل فقط عند رغبتك بتصدير ملف PDF النهائي.'
        : 'No registration or credit card needed! You can use the builder, test Gemini AI, and preview templates completely free. Activation is required only when downloading the final HD PDF.',
    },
    {
      q: isAr
        ? 'أين تُحفظ بياناتي الشخصية؟ هل تُباع لأطراف ثالثة؟'
        : 'Where is my personal data stored?',
      a: isAr
        ? 'بياناتك تُحفظ محلياً 100% داخل ذاكرة متصفحك (Local Storage). نحن لا نملك خوادم تخزين لبيانات السير الذاتية ولا نبيعها أو نشاركها مع أي جهة توظيف مطلقاً.'
        : 'Your data stays 100% inside your browser session (local-first storage). We never store or sell your resume content to third parties.',
    },
    {
      q: isAr
        ? 'هل يدعم النظام استخراج السيرة الذاتية بالعربية والإنجليزية بنفس الجودة؟'
        : 'Does it support bilingual Arabic & English resumes?',
      a: isAr
        ? 'نعم تماماً! النظام مجهز بخطوط رسمية محاذية تلقائياً لاتجاه النص RTL / LTR مع ضبط المسافات وعلامات الترقيم الهندسية لكلتا اللغتين.'
        : 'Yes! The builder natively handles RTL for Arabic and LTR for English with formatted typography alignment.',
    },
  ];

  const filteredFaqs = faqItems.filter((item) => {
    if (!searchFaq.trim()) return true;
    const q = searchFaq.toLowerCase();
    return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
  });

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-start py-6">
      <div className="text-center space-y-2">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#E8EEF7] text-[#001639] border border-[#CBD5E1]">
          {isAr ? 'إجابات سريعة' : 'Frequently Asked Questions'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0B1120]">
          {isAr ? 'الأسئلة الشائعة حول المنصة والخدمة' : 'Everything You Need to Know'}
        </h2>
      </div>

      {/* FAQ Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchFaq}
          onChange={(e) => setSearchFaq(e.target.value)}
          placeholder={isAr ? 'ابحث في الأسئلة الشائعة...' : 'Search questions...'}
          className="w-full ps-10 pe-4 py-2.5 bg-white rounded-2xl border border-slate-300 text-xs outline-none focus:border-[#001639] transition"
        />
      </div>

      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl text-center text-xs text-slate-500 border border-slate-200">
            {isAr ? 'لم نجد سؤالاً يطابق بحثك.' : 'No matching questions found.'}
          </div>
        ) : (
          filteredFaqs.map((item, idx) => {
            const isOpen = openFaqs.includes(idx);
            return (
              <div
                key={idx}
                className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs transition"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-start font-extrabold text-xs sm:text-sm text-[#0B1120] flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50"
                >
                  <span>{item.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#001639] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#52627A] shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-[#52627A] leading-relaxed border-t border-slate-100">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
