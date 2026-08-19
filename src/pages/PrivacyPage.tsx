import React from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { getTranslation } from '../i18n/translations';
import { ShieldCheck, Lock, EyeOff, FileText, Database } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const { settings } = useResumeStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-xs text-[#52627A]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isAr ? 'سياسة الخصوصية وأمان البيانات' : 'Privacy Policy & Data Protection'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B1120]">
          {isAr ? 'بياناتك ملك لك وحدك' : 'Your Privacy is Fully Protected'}
        </h1>
        <p className="text-xs text-[#52627A]">
          {isAr ? 'تاريخ التحديث: أغسطس 2026' : 'Last Updated: August 2026'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6 text-start">
        <section className="space-y-2">
          <h2 className="text-sm font-extrabold text-[#0B1120] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#001639]" />
            <span>{isAr ? '1. تخزين البيانات محلياً (Local Browser Storage)' : '1. Client-Side Data Storage'}</span>
          </h2>
          <p className="leading-relaxed">
            {isAr
              ? 'تلتزم منصة Hash Resume بحماية خصوصية المستخدمين بشكل مطلق. جميع البيانات التي تدخلها في محرر السيرة الذاتية (المعلومات الشخصية، الخبرات، والمهارات) تعيش وتخزن محلياً داخل متصفحك الخاص فقط عبر تقنية LocalStorage.'
              : 'Hash Resume stores all user inputs, personal data, and work history locally inside your browser via encrypted LocalStorage.'}
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-100 pt-4">
          <h2 className="text-sm font-extrabold text-[#0B1120] flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-[#001639]" />
            <span>{isAr ? '2. عدم مشاركة أو بيع البيانات' : '2. Zero Data Selling'}</span>
          </h2>
          <p className="leading-relaxed">
            {isAr
              ? 'نحن لا نقوم ببيع أو مشاركة أو تحويل سيرتك الذاتية أو بياناتك الشخصية لأي شركات توظيف أو أطراف ثالثة على الإطلاق. معلوماتك المهنية تظل ملكك الفردي الخالص.'
              : 'We do not sell, license, or transmit your career details or personal credentials to recruiters or advertising networks.'}
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-100 pt-4">
          <h2 className="text-sm font-extrabold text-[#0B1120] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#001639]" />
            <span>{isAr ? '3. معالجة طلبات الذكاء الاصطناعي' : '3. Gemini AI Processing'}</span>
          </h2>
          <p className="leading-relaxed">
            {isAr
              ? 'عند استخدامك لمساعد الذكاء الاصطناعي التوليدي، يتم إرسال النصوص المؤقتة المراد صياغتها عبر خوادم آمنة ومشفرة لتوليد الاقتراحات وإعادتها فوراً دون حفظها في قاعدة بيانات دائمة.'
              : 'When triggering Gemini AI writing aids, text fragments are processed server-side in encrypted transit without being stored permanently.'}
          </p>
        </section>
      </div>
    </div>
  );
};
