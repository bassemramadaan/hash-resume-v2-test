import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, FormInput, Sparkles, Download, ArrowRight, ArrowLeft } from 'lucide-react';

interface HowItWorksSectionProps {
  isAr: boolean;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ isAr }) => {
  const navigate = useNavigate();
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      step: 1,
      titleAr: 'اختر القالب القياسي',
      titleEn: 'Choose ATS Template',
      icon: Layout,
      descAr: 'اختر من بين القوالب المعتمدة هندسياً للشركات العالمية والمحلية بدون جداول معقدة.',
      descEn: 'Select an ATS-optimized layout engineered to pass applicant tracking systems.',
      detailAr: 'القوالب مبنية بنسق عمودي واحد لضمان استخراج كامل البيانات دون تشويه.',
      detailEn: 'Single-column designs ensuring zero data loss across Workday & Taleo.',
    },
    {
      step: 2,
      titleAr: 'أدخل بياناتك في 9 خطوات',
      titleEn: 'Fill Your Details',
      icon: FormInput,
      descAr: 'اتبع النموذج المنظم لإدخال البيانات الشخصية، الخبرات، والمهارات، أو استورد نموذج جاهز.',
      descEn: 'Follow the 9 guided steps or load realistic sample content in one click.',
      detailAr: 'حقول مخصصة لكل قسم تتضمن الإنجازات، المشاريع، الشهادات، واللغات.',
      detailEn: 'Structured input fields for experience, projects, skills, and metrics.',
    },
    {
      step: 3,
      titleAr: 'حسّن بالذكاء الاصطناعي',
      titleEn: 'Optimize with AI',
      icon: Sparkles,
      descAr: 'استخدم محرك Gemini AI لإعادة صياغة نقاط خبراتك بإيقاع إنجازات كمية وأفعال حديثة.',
      descEn: 'Leverage Gemini AI to refine bullet points and highlight industry keywords.',
      detailAr: 'يساعدك الذكاء الاصطناعي في إبراز المؤشرات والأرقام التي يبحث عنها مسؤولو التوظيف.',
      detailEn: 'AI suggests quantified action verbs tailored to your target position.',
    },
    {
      step: 4,
      titleAr: 'تحميل PDF شعاعي نقي',
      titleEn: 'Export Vector PDF',
      icon: Download,
      descAr: 'قم بتنزيل ملف PDF نقي عالي الجودة بنصوص قابلة للقراءة والنسخ، جاهز للإرسال.',
      descEn: 'Download a clean, vector PDF ready for immediate job application.',
      detailAr: 'تصدير قياسي مباشر بدون علامات مائية وبطباعة متناسقة تماماً مع شاشتك.',
      detailEn: 'Crisp printing resolution with standard Unicode encoding.',
    },
  ];

  return (
    <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-6 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#E8EEF7] text-[#001639] border border-[#CBD5E1]">
          {isAr ? 'آلية العمل البسيطة' : 'How It Works'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0B1120]">
          {isAr ? '4 خطوات سهلة للحصول على سيرة متكاملة' : '4 Steps to Your Dream Resume'}
        </h2>
        <p className="text-xs text-[#52627A]">
          {isAr
            ? 'عملية مريحة ومنظمة تمكّنك من إنهاء سيرتك الذاتية في أقل من 10 دقائق.'
            : 'Designed to streamline CV generation in under 10 minutes.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((item) => {
          const Icon = item.icon;
          const isSelected = activeStep === item.step;
          return (
            <div
              key={item.step}
              onClick={() => setActiveStep(item.step)}
              className={`p-6 rounded-3xl border transition space-y-4 text-start cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-[#001639] shadow-lg ring-2 ring-[#001639]/10'
                  : 'bg-white border-[#E2E8F0] shadow-xs hover:border-slate-300'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-10 h-10 rounded-2xl font-black text-base flex items-center justify-center shadow-xs transition ${
                      item.step === 3
                        ? 'bg-[#FF4D2D] text-white'
                        : isSelected
                        ? 'bg-[#001639] text-white'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {item.step}
                  </div>
                  <Icon className={`w-5 h-5 ${item.step === 3 ? 'text-[#FF4D2D]' : 'text-[#001639]'}`} />
                </div>

                <h3 className="font-extrabold text-sm text-[#0B1120]">
                  {isAr ? item.titleAr : item.titleEn}
                </h3>

                <p className="text-xs text-[#52627A] leading-relaxed">
                  {isAr ? item.descAr : item.descEn}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                {isAr ? item.detailAr : item.detailEn}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => navigate('/builder')}
          className="px-8 py-3.5 bg-[#001639] hover:bg-[#00245E] text-white rounded-full text-xs font-black shadow-lg transition flex items-center gap-2 mx-auto cursor-pointer"
        >
          <span>{isAr ? 'ابدأ الخطوة الأولى الآن مجاناً' : 'Start Step 1 Free Now'}</span>
          <ArrowIcon className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
