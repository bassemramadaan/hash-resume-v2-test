import React from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { getTranslation } from '../i18n/translations';
import { FileText, Shield, CheckCircle2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { settings } = useResumeStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-xs text-[#52627A]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8EEF7] border border-[#CBD5E1] text-[#001639] text-xs font-bold shadow-2xs">
          <FileText className="w-4 h-4 text-[#001639]" />
          <span>{isAr ? 'الشروط والأحكام التنظيمية' : 'Terms & Conditions'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#0B1120]">
          {isAr ? 'شروط الاستخدام وأحكام الخدمة' : 'Terms of Service Agreement'}
        </h1>
        <p className="text-xs text-[#52627A]">
          {isAr ? 'تاريخ التحديث: أغسطس 2026' : 'Last Updated: August 2026'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6 text-start">
        <section className="space-y-2">
          <h2 className="text-sm font-extrabold text-[#0B1120]">
            {isAr ? '1. قبول الشروط' : '1. Acceptance of Terms'}
          </h2>
          <p className="leading-relaxed">
            {isAr
              ? 'باستخدامك لمنصة Hash Resume، فإنك توافق على الالتزام بكافة الشروط والأحكام الواردة في هذه الاتفاقية. إذا كنت لا توافق على أي بند، يرجى عدم استخدام الخدمة.'
              : 'By accessing and using Hash Resume, you agree to comply with all terms laid out in this service agreement.'}
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-100 pt-4">
          <h2 className="text-sm font-extrabold text-[#0B1120]">
            {isAr ? '2. أحكام أكواد التفعيل والتصدير' : '2. Activation Codes & Downloads'}
          </h2>
          <p className="leading-relaxed">
            {isAr
              ? 'تمنح أكواد التفعيل المشتراة رصيد تحميلات محدد (سواءً تحميل فردي أو حزمة 3 تحميلات) صالح للاستخدام وتصدير سيرتك الذاتية بصيغة PDF. الأكواد مخصصة للاستخدام الشخصي وغير قابلة لإعادة البيع التجاري.'
              : 'Purchased activation keys provide specified download quotas (single or bundle) for personal PDF generation and export.'}
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-100 pt-4">
          <h2 className="text-sm font-extrabold text-[#0B1120]">
            {isAr ? '3. سياسة الاسترجاع والاستبدال' : '3. Refund Policy'}
          </h2>
          <p className="leading-relaxed">
            {isAr
              ? 'في حال مواجهة أي خلل تقني يمنعك من استخدام كود التفعيل أو تصدير ملفك، يمكنك التواصل مع فريق الدعم الفني المباشر لحل المشكلة فوراً أو استبدال الكود.'
              : 'If technical glitches prevent key redemption or export, our support team will instantly resolve or issue replacement keys.'}
          </p>
        </section>
      </div>
    </div>
  );
};
