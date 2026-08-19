import React, { useState } from 'react';
import { XCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface AtsComparisonSectionProps {
  isAr: boolean;
}

export const AtsComparisonSection: React.FC<AtsComparisonSectionProps> = ({ isAr }) => {
  const [showDetailedDetails, setShowDetailedDetails] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 py-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#E8EEF7] text-[#001639] border border-[#CBD5E1]">
          {isAr ? 'مقارنة الفلترة الآلية' : 'ATS Benchmark Comparison'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0B1120]">
          {isAr ? 'لماذا تُرفض 75% من السير الذاتية التقليدية؟' : 'Why 75% of Standard Resumes Get Auto-Rejected'}
        </h2>
        <p className="text-xs text-[#52627A]">
          {isAr
            ? 'مقارنة مباشرة تبرز الفروق الهندسية الدقيقة بين السير العشوائية وسيرتنا المصممة وفقاً لمعايير خوارزميات التوظيف.'
            : 'Side-by-side technical comparison between regular graphics templates and Hash Resume.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Unoptimized Graphic Resume (Failure) */}
        <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 space-y-5 relative text-start shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-rose-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold shrink-0">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    {isAr ? 'سيرة ذاتية تقليدية (تصميم Canva/Word)' : 'Traditional Graphic CV'}
                  </h3>
                  <span className="text-[11px] text-rose-600 font-bold">
                    {isAr ? 'معدل استبعاد مرتفع جداً' : 'High Rejection Rate by Scanners'}
                  </span>
                </div>
              </div>

              <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-black rounded-full shrink-0">
                ATS: 42% ❌
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-700 font-medium">
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'جداول متعددة وأعمدة جانبية تفقد برامج الفرز قراءتها وتخلط الترتيب النصي.'
                    : 'Complex tables and multi-columns cause text corruption.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'أشرطة تقييم مهارات غامضة (مثل 80% في المهارة) غير قابلة للقراءة الآلية.'
                    : 'Progress bars & rating icons are invisible to parsing algorithms.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'غياب الكلمات المفتاحية الأساسية ومؤشرات الإنجاز الكمية (KPIs).'
                    : 'Vague task lists lacking action verbs or measurable KPIs.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'خطوط وعناوين غير قياسية تؤدي لظهور رموز غريبة عند الاستخراج النصي.'
                    : 'Non-standard fonts lead to garbled Unicode character extraction.'}
                </span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-rose-50/80 rounded-2xl border border-rose-200 text-[11px] text-rose-800 font-bold">
            {isAr ? '⚠️ النتيجة: استبعاد أوتوماتيكي قبل وصول الملف لمسؤول التوظيف.' : '⚠️ Outcome: Filtered out before human review.'}
          </div>
        </div>

        {/* Hash Resume (ATS Engineered Success) */}
        <div className="bg-white border-2 border-emerald-300 rounded-3xl p-6 sm:p-8 space-y-5 relative text-start shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    {isAr ? 'سيرة Hash Resume (المحسنة لـ ATS)' : 'Hash Resume (ATS Engineered)'}
                  </h3>
                  <span className="text-[11px] text-emerald-700 font-bold">
                    {isAr ? 'مطابقة قياسية لأنظمة Taleo, Workday, Greenhouse' : '100% Parser Compliant'}
                  </span>
                </div>
              </div>

              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-black rounded-full shrink-0">
                ATS: 98% ✅
              </span>
            </div>

            <ul className="space-y-3 text-xs text-slate-700 font-medium">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'هيكل خطّي نقي ودقيق يضمن قراءة 100% من بياناتك بدون أي تشويش.'
                    : 'Clean linear structure guarantees 100% error-free data parsing.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'نقاط إنجاز مدعومة بأفعال قوية ونسب مئوية مصاغة بالذكاء الاصطناعي Gemini.'
                    : 'Action-oriented bullets with metrics powered by Gemini AI.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'تضمين الكلمات المفتاحية التنافسية للوظائف المستهدفة لرفع نسبة المطابقة.'
                    : 'Targeted industry skill keywords matching job requisitions.'}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'تصدير PDF شعاعي نقي بنصوص قابلة للنسخ والمسح دون أخطاء ترميز.'
                    : 'Crisp vector PDF export with standard selectable text.'}
                </span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-800 font-bold">
            {isAr ? '🎉 النتيجة: عبور الفلترة وتلقي دعوة مقابلة العمل مباشرة.' : '🎉 Outcome: Direct path to recruiter interview.'}
          </div>
        </div>
      </div>
    </section>
  );
};
