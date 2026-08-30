import React from 'react';
import { useResumeStore } from '../store/useResumeStore';
import { Sparkles, Eye, Download, Layers, ShieldCheck, Smartphone, FileCheck, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ShowcasePage: React.FC = () => {
  const { settings } = useResumeStore();
  const isAr = settings.language === 'ar';

  const showcaseItems = [
    {
      id: 'landing',
      title: isAr ? 'الصفحة الرئيسية وقسم البداية' : 'Landing Page & Hero',
      badge: isAr ? 'الواجهة الرئيسية' : 'Hero UI',
      icon: Sparkles,
      image: '/images/landing_hero_preview_1788097529363.jpg',
      description: isAr
        ? 'تصميم نظيف وعصري يركز على إدخال المسمى الوظيفي والزر الرئيسي البرتقالي مع شريط الثقة (بدون حساب • متوافق مع ATS • دفع لمرة واحدة).'
        : 'Clean and modern hero focused on single job title input, bold orange CTA button, and clear trust signals (No account required • ATS-friendly • Pay once).',
      highlights: isAr
        ? [
            'زر أساسي واحد عالي الوضوح بارتفاع 52px',
            'إخفاء الأزرار المشتتة على الموبايل',
            'زر واتساب عائم يظهر بذكاء بعد التمرير',
            'متجاوب بالكامل مع شاشات 320px حتى 4K'
          ]
        : [
            'Single high-contrast 52px primary CTA',
            'Zero distraction mobile header',
            'Smart WhatsApp reveal on scroll (>300px)',
            'Fully responsive from 320px to 4K'
          ]
    },
    {
      id: 'builder',
      title: isAr ? 'محرر السيرة الذاتية والشاشة المنقسمة' : 'Split-Screen Resume Builder',
      badge: isAr ? 'المحرر الحي' : 'Live Editor',
      icon: Layers,
      image: '/images/builder_ui_preview_1788097555233.jpg',
      description: isAr
        ? 'بيئة عمل تفاعلية تجمع بين حقول الإدخال المنظمة على اليسار والمعاينة الحية فوراً للصفحة A4 على اليمين مع دعم أنظمة ATS.'
        : 'Split-screen workspace pairing structured input form fields on the left with live high-fidelity A4 page rendering on the right.',
      highlights: isAr
        ? [
            'فحص فوري للكلمات المفتاحية المطلوبة في الوظيفة (ATS Matcher)',
            'تخصيص القوالب، الألوان، الخطوط وهوامش الطباعة',
            'نسخ احتياطي واستعادة فورية لبيانات السيرة بصيغة JSON',
            'حفظ تلقائي محلي بدون فقدان أي بيانات'
          ]
        : [
            'Instant job keyword ATS matching and insertion',
            'Template, font, color, and line spacing customization',
            'Instant local JSON backup and restore',
            'Auto-save mechanism with complete privacy'
          ]
    },
    {
      id: 'payment',
      title: isAr ? 'نافذة الدفع والتفعيل (InstaPay & فودافون كاش)' : 'Payment & Activation Modal',
      badge: isAr ? 'الدفع المحلي' : 'Local Payments',
      icon: ShieldCheck,
      image: '/images/payment_modal_preview_1788097573048.jpg',
      description: isAr
        ? 'شاشة دفع محلية مخصصة للسوق المصري بدون أي تعقيد ببطاقات الائتمان الأجنبية، تدعم إنستاباي والمحافظ الإلكترونية.'
        : 'Frictionless local payment modal tailored for Egyptian payment methods including InstaPay and mobile wallets (Vodafone Cash).',
      highlights: isAr
        ? [
            'باقة فردية: 50 ج.م لتحميل سيرة ذاتية واحدة',
            'باقة توفير: 120 ج.م لـ 3 تحميلات (40 ج/سيرة)',
            'تفعيل فوري برقم المرجع أو كود الشراء',
            'دعم فني مباشر وسريع عبر واتساب'
          ]
        : [
            'Single download plan: 50 EGP for 1 CV',
            'Bundle plan: 120 EGP for 3 CVs (40 EGP/CV)',
            'Instant unlock via reference or code',
            'Direct live WhatsApp assistance'
          ]
    },
    {
      id: 'mobile',
      title: isAr ? 'تجربة الهاتف المتجاوبة وشريط الإجراءات' : 'Mobile Experience & Bottom Bar',
      badge: isAr ? 'موبايل فرست' : 'Mobile-First',
      icon: Smartphone,
      image: '/images/mobile_view_preview_1788097594618.jpg',
      description: isAr
        ? 'تجربة مستخدم مصممة خصيصاً للشاشات التي تقل عن 768px، مع شريط إجراءات سفلي ثابت ومساحات لمس لا تقل عن 44px.'
        : 'Engineered mobile experience for sub-768px screens featuring fixed bottom action bar and ≥44px touch targets.',
      highlights: isAr
        ? [
            'شريط إجراءات سفلي ثابت يراعي حواف الآيفون',
            'محرر أقسام تدريجي ببطاقات سلسة وسهلة اللمس',
            'دعم كامل ومتقن للاتجاه العربي RTL وانزلاق القوائم',
            'معاينة كاملة للسيرة بورقة سفلية سريعة'
          ]
        : [
            'Fixed bottom action bar with safe area padding',
            'Step-by-step mobile card drawer editors',
            'Logical RTL layout with LTR preservation for tech details',
            'Instant mobile bottom sheet preview'
          ]
    }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Title */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-[#FF4D2D] text-xs font-black">
            <Eye className="w-3.5 h-3.5" />
            <span>{isAr ? 'معاينة واجهات المنصة' : 'Platform UI Showcase'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#001639] tracking-tight">
            {isAr ? 'صور ومعاينة كل جزء في الموقع' : 'Screenshots & UI Showcase Guide'}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            {isAr
              ? 'استعراض بصري مفصل لجميع شاشات وأركان منصة Hash Resume، مع شرح دقيق لأهم الوظائف والمزايا المدمجة في كل شاشة.'
              : 'Detailed visual breakdown of all Hash Resume platform sections, featuring high-resolution captures and functional highlights.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="/site-showcase.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#001639] hover:bg-[#00245E] text-white text-xs sm:text-sm font-extrabold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>{isAr ? 'فتح الملف بصيغة HTML كاملة' : 'Open Full HTML Document'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <Link
              to="/builder"
              className="px-5 py-2.5 bg-[#FF4D2D] hover:bg-[#E5431F] text-white text-xs sm:text-sm font-extrabold rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAr ? 'تجربة المنصة الآن' : 'Launch Builder'}</span>
            </Link>
          </div>
        </div>

        {/* Gallery Cards */}
        <div className="space-y-12">
          {showcaseItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                id={item.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-[#001639] font-black shrink-0">
                      <Icon className="w-5 h-5 text-[#001639]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-[#FF4D2D] uppercase tracking-wider">
                          0{idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-400">•</span>
                        <span className="text-xs font-bold text-slate-500">{item.badge}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-[#001639]">{item.title}</h2>
                    </div>
                  </div>

                  <a
                    href={item.image}
                    download={`${item.id}-preview.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition shrink-0 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تحميل الصورة الأصلية' : 'Download Image'}</span>
                  </a>
                </div>

                {/* Main Visual Image */}
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-50 group relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {item.description}
                </p>

                {/* Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  {item.highlights.map((highlight, hIdx) => (
                    <div
                      key={hIdx}
                      className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-2.5"
                    >
                      <FileCheck className="w-4 h-4 text-[#FF4D2D] shrink-0 mt-0.5" />
                      <span className="text-xs font-bold text-slate-700 leading-snug">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Card */}
        <div className="bg-[#001639] rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF4D2D]/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black">
              {isAr ? 'جاهز لتجربة السيرة الذاتية بدون أي تعقيد؟' : 'Ready to build your ATS-ready resume?'}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {isAr
                ? 'أنشئ سيرتك الذاتية في دقائق، افحص مطابقتها مع إعلان الوظيفة، وحمّلها بصيغة PDF نقية.'
                : 'Create your professional resume in minutes, match job keywords with ATS scanning, and download clean vector PDF.'}
            </p>
            <div className="pt-2">
              <Link
                to="/builder"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF4D2D] hover:bg-[#E5431F] text-white text-sm sm:text-base font-extrabold rounded-2xl shadow-lg transition active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>{isAr ? 'ابدأ إنشاء سيرتي الآن مجاناً' : 'Start Building My Resume Free'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
