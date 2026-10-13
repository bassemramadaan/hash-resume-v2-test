import React from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { getTranslation } from '../i18n/translations';
import { ShieldCheck, Lock, Database, Users, Trash2, FileText } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  const { settings } = useResumeStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-xs text-[#52627A]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{isAr ? 'سياسة الخصوصية وأمان البيانات' : 'Privacy Policy & Data Protection'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
          {isAr ? 'بياناتك — بموافقتك أنت' : 'Your Data — On Your Terms'}
        </h1>
        <p className="text-xs text-[#52627A]">
          {isAr ? 'تاريخ التحديث: أكتوبر 2026' : 'Last Updated: October 2026'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 shadow-xs space-y-6 text-start">
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#001639]" />
            <span>{isAr ? '1. تخزين بياناتك' : '1. Your Data Storage'}</span>
          </h2>
          <p className="leading-relaxed">
            {isAr
              ? 'جميع البيانات التي تدخلها في محرر السيرة الذاتية تعيش في متصفحك الخاص (LocalStorage). عند تحميل سيرتك الذاتية PDF، يتم إرسال نسخة منها إلى خوادمنا الآمنة لتخزينها في قاعدة بياناتنا.'
              : 'All inputs live in your browser (LocalStorage). When you download your PDF, a copy is transmitted to our secure servers and stored in our database.'}
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-100 pt-4">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#001639]" />
            <span>{isAr ? '2. مشاركة بياناتك مع شركات التوظيف' : '2. Sharing with Hiring Companies'}</span>
          </h2>
          <p className="leading-relaxed">
            {isAr
              ? 'عند تحميل سيرتك الذاتية، يُطلب منك الاختيار صراحةً: هل توافق على عرض سيرتك الذاتية (بدون بيانات التواصل الشخصية) على الشركات الشريكة في منصة Hash Resume؟'
              : 'When downloading your resume, you are explicitly asked: do you agree to have your resume (without personal contact details) shown to partner companies on Hash Resume?'}
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1 leading-relaxed ps-2">
            <li>
              {isAr
                ? 'إذا وافقت: قد تتواصل معك الشركات الشريكة بخصوص فرص عمل مناسبة.'
                : 'If you agree: partner companies may contact you about suitable job opportunities.'}
            </li>
            <li>
              {isAr
                ? 'إذا لم توافق: تبقى سيرتك الذاتية خاصة ولا تُشارك مع أي شركة.'
                : 'If you do not agree: your resume stays private and is not shared with any company.'}
            </li>
            <li>
              {isAr
                ? 'دائماً نحتفظ بسيرتك الذاتية الكاملة (بما فيها بيانات التواصل) في قاعدة بياناتنا الآمنة، لكن لا تُعرض للشركات إلا بعد موافقتك.'
                : 'We always keep your full resume (including contact details) in our secure database, but it is never shown to companies without your consent.'}
            </li>
          </ul>
        </section>

        <section className="space-y-2 border-t border-slate-100 pt-4">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-[#001639]" />
            <span>{isAr ? '3. حقك في الحذف' : '3. Your Right to Deletion'}</span>
          </h2>
          <p className="leading-relaxed">
            {isAr
              ? 'يمكنك في أي وقت طلب حذف سيرتك الذاتية بالكامل من قاعدة بياناتنا. سنحذف جميع البيانات المرتبطة بك خلال 30 يوماً من استلام طلبك.'
              : 'You may request deletion of your resume from our database at any time. We will remove all your data within 30 days of receiving your request.'}
          </p>
          <p className="leading-relaxed">
            {isAr
              ? 'للحذف أو لأي استفسار: تواصل معنا عبر واتساب أو البريد الإلكتروني.'
              : 'To request deletion or for any inquiry: contact us via WhatsApp or email.'}
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-100 pt-4">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-[#001639]" />
            <span>{isAr ? '4. معالجة الذكاء الاصطناعي' : '4. AI Processing'}</span>
          </h2>
          <p className="leading-relaxed">
            {isAr
              ? 'عند استخدامك لمساعد الذكاء الاصطناعي التوليدي، يتم إرسال النصوص المؤقتة المراد صياغتها عبر خوادم آمنة ومشفرة لتوليد الاقتراحات وإعادتها فوراً دون حفظها في قاعدة بيانات دائمة.'
              : 'When using AI writing aids, text fragments are processed server-side in encrypted transit without being stored permanently.'}
          </p>
        </section>

        <section className="space-y-2 border-t border-slate-100 pt-4">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#001639]" />
            <span>{isAr ? '5. الامتثال القانوني' : '5. Legal Compliance'}</span>
          </h2>
          <p className="leading-relaxed">
            {isAr
              ? 'نلتزم بقانون حماية البيانات الشخصية المصري رقم 151 لسنة 2020. أي مستخدم له الحق في الوصول لبياناته، تصحيحها، أو حذفها في أي وقت.'
              : 'We comply with Egyptian Personal Data Protection Law No. 151 of 2020. Any user has the right to access, correct, or delete their data at any time.'}
          </p>
        </section>
      </div>
    </div>
  );
};
