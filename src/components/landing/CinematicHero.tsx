import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Layout,
  Star,
  FileCheck2,
  Building2,
  Sliders,
  Check,
  Eye,
  Award,
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';

interface CinematicHeroProps {
  isAr: boolean;
}

export const CinematicHero: React.FC<CinematicHeroProps> = ({ isAr }) => {
  const navigate = useNavigate();
  const { settings } = useResumeStore();
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  // Interactive Live Preview Controls inside Hero
  const [selectedAccent, setSelectedAccent] = useState<'navy' | 'coral' | 'emerald' | 'slate'>('coral');
  const [selectedTemplate, setSelectedTemplate] = useState<'modern' | 'exec' | 'technical'>('modern');

  const accentColors = {
    coral: {
      primary: '#FF4D2D',
      bgLight: 'bg-orange-50',
      text: 'text-[#FF4D2D]',
      border: 'border-[#FF4D2D]',
      glow: 'shadow-coral/20',
      beam: 'from-transparent via-[#FF4D2D] to-transparent',
    },
    navy: {
      primary: '#001639',
      bgLight: 'bg-[#E8EEF7]',
      text: 'text-[#001639]',
      border: 'border-[#001639]',
      glow: 'shadow-navy/20',
      beam: 'from-transparent via-[#001639] to-transparent',
    },
    emerald: {
      primary: '#16A36A',
      bgLight: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-600',
      glow: 'shadow-emerald-500/20',
      beam: 'from-transparent via-emerald-500 to-transparent',
    },
    slate: {
      primary: '#334155',
      bgLight: 'bg-slate-100',
      text: 'text-slate-800',
      border: 'border-slate-700',
      glow: 'shadow-slate-500/20',
      beam: 'from-transparent via-slate-700 to-transparent',
    },
  };

  const currentAccent = accentColors[selectedAccent];

  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center pt-8 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F8FAFC]/90 via-white to-white overflow-hidden">
      {/* Background Ambient Glows & Grid */}
      <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-slate-100/60 to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[900px] h-[500px] bg-gradient-to-tr from-coral-soft/50 via-orange-50/40 to-blue-50/40 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* Main Split Grid: Text/CTAs on Right (in RTL), Interactive Live Scanner Card on Left */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
          
          {/* =========================================================================
              1. RIGHT SIDE (RTL): Marketing Copy, Value Points, Action Buttons
             ========================================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 text-start space-y-5 sm:space-y-6">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#CBD5E1] shadow-2xs text-[11px] sm:text-xs font-medium text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>{isAr ? 'معتمد لأنظمة ATS العالمية' : '100% ATS Parser Compliant'}</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#FF4D2D] font-semibold">{isAr ? 'بدون تسجيل حساب' : 'No Sign-up'}</span>
              <span className="text-slate-300 hidden sm:inline">•</span>
              <span className="text-slate-500 hidden sm:inline">{isAr ? '50 ج.م فقط' : '50 EGP'}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-[#001639] leading-[1.18] sm:leading-[1.16]">
              {isAr ? (
                <>
                  سيرتك الذاتية.
                  <br />
                  بدون <span className="text-coral">أي تعقيد.</span>
                </>
              ) : (
                <>
                  Your Resume.
                  <br />
                  Zero <span className="text-coral">Friction.</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
              {isAr
                ? 'أنشئ سيرة ذاتية قياسية ونقية تجتاز خوارزميات الفرز الآلي (ATS) بنسبة 98% وتصل مباشرة لمديري التوظيف في كبرى الشركات دون تشتيت.'
                : 'Build an ATS-engineered resume with clean linear structure that passes corporate recruiters and automated filters with a 98% scan rate.'}
            </p>

            {/* 3 Value Checkpoints */}
            <div className="space-y-2.5 pt-1 text-xs sm:text-sm text-slate-700 font-normal">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>
                  {isAr
                    ? 'مطابقة تامة لمعايير Workday و Taleo و Greenhouse و SAP'
                    : '100% compliant with Workday, Taleo, and Greenhouse'}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-orange-50 border border-orange-200 text-[#FF4D2D] flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>
                  {isAr
                    ? 'صياغة ذكية بالذكاء الاصطناعي (Gemini) لإبراز مؤشرات الأداء والأرقام'
                    : 'Smart AI action verbs & KPI metrics powered by Gemini'}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 text-[#001639] flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span>
                  {isAr
                    ? 'تحميل PDF فوري عالي الجودة بدون علامات مائية وبدون اشتراكات شهرية'
                    : 'One-time payment • Zero watermarks • Instant HD PDF download'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => navigate('/builder')}
                className="btn-folded-corner px-6 sm:px-8 min-h-[50px] bg-[#FF4D2D] hover:bg-[#E5431F] text-white rounded-xl sm:rounded-2xl text-sm sm:text-base font-semibold shadow-md hover:shadow-lg shadow-coral/25 flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-white/20 shrink-0" />
                <span>{isAr ? 'ابدأ إنشاء سيرتي مجاناً' : 'Build My Resume Now'}</span>
                <ArrowIcon className="w-4 h-4 shrink-0" />
              </button>

              <Link
                to="/templates"
                className="px-5 sm:px-6 min-h-[50px] bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#001639] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-2xs hover:shadow-xs flex items-center justify-center gap-2 transition active:scale-98"
              >
                <Eye className="w-4 h-4 text-slate-500" />
                <span>{isAr ? 'استعراض النماذج (5 قوالب)' : 'View 5 Templates'}</span>
              </Link>
            </div>

            {/* Subtle Founder Signature & Trust Label */}
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-500 select-none">
              <span className="font-normal">{isAr ? 'تصميم وهندسة:' : 'Engineered by:'}</span>
              <span
                className="text-base sm:text-lg text-slate-700 block leading-none font-normal"
                style={{
                  fontFamily: "'Caveat', cursive, sans-serif",
                  transform: 'rotate(-2deg)',
                }}
              >
                Bassem Ramadan
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {isAr ? 'مُعتمد لدى +500 باحث عن عمل' : '500+ Hired Job Seekers'}
              </span>
            </div>

          </div>

          {/* =========================================================================
              2. LEFT SIDE (RTL): Interactive Live Realistic ATS CV & Scanning Laser
             ========================================================================= */}
          <div className="lg:col-span-6 xl:col-span-6 relative mt-4 lg:mt-0 flex justify-center lg:justify-end">
            
            {/* Outer Container with Soft Glow & Depth */}
            <div className="relative w-full max-w-lg lg:max-w-md xl:max-w-lg">
              
              {/* Floating Top Badge: ATS Score Circle Gauge */}
              <div className="absolute -top-3 -start-3 sm:-top-4 sm:-start-4 z-30 bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-900/10 flex items-center gap-2.5 animate-float-slow select-none">
                <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray="98, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute font-semibold text-xs sm:text-sm text-[#001639]">98%</span>
                </div>
                <div className="text-start">
                  <span className="text-[10px] text-slate-400 font-medium block leading-tight uppercase">
                    {isAr ? 'فحص التوافق اللحظي' : 'ATS Readiness'}
                  </span>
                  <span className="text-xs sm:text-[13px] font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {isAr ? 'مؤهل 100% للمقابلة' : 'Interview Ready'}
                  </span>
                </div>
              </div>

              {/* Floating Right Badge: Corporate Verification */}
              <div className="absolute -bottom-3 -end-2 sm:-bottom-4 sm:-end-3 z-30 bg-white/95 backdrop-blur-md px-3 sm:px-3.5 py-2 rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-900/10 flex items-center gap-2 animate-float-reverse select-none">
                <div className="w-7 h-7 rounded-xl bg-orange-50 text-[#FF4D2D] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-start">
                  <span className="text-[11px] sm:text-xs font-semibold text-[#001639] block">
                    Workday &amp; Taleo
                  </span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {isAr ? 'معايير الفرز الآلي الدولية' : 'Verified Parser Standard'}
                  </span>
                </div>
              </div>

              {/* Floating Top-Right Keyword Match Pill */}
              <div className="absolute top-10 -end-3 sm:-end-5 z-30 bg-[#001639] text-white px-3 py-1.5 rounded-xl shadow-md text-[11px] font-medium hidden sm:flex items-center gap-1.5 animate-float-slow select-none">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isAr ? '+38% الكلمات المفتاحية' : '+38% Keyword Match'}</span>
              </div>

              {/* The Realistic Live A4 Resume Card with Laser Scanner */}
              <div className="relative bg-white rounded-2xl sm:rounded-3xl border-2 border-slate-200/90 p-5 sm:p-7 shadow-xl shadow-slate-900/8 text-start select-none overflow-hidden group">
                
                {/* Continuous Glowing Laser Scanning Beam */}
                <div className="absolute inset-x-0 h-10 pointer-events-none z-20 animate-scan-beam">
                  {/* Glowing Laser Horizontal Line */}
                  <div className={`h-[2px] w-full bg-gradient-to-r ${currentAccent.beam} shadow-[0_0_12px_#FF4D2D]`} />
                  {/* Soft Light Fade under the Beam */}
                  <div className="h-8 w-full bg-gradient-to-b from-[#FF4D2D]/10 to-transparent" />
                </div>

                {/* Resume Header */}
                <div className={`border-b-2 pb-3.5 mb-3.5 transition-colors`} style={{ borderColor: currentAccent.primary }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                        {isAr ? 'باسم رمضان' : 'BASSAM RAMADAN'}
                      </h2>
                      <p className="text-xs font-semibold mt-0.5" style={{ color: currentAccent.primary }}>
                        {isAr ? 'مطور واجهات ومصمم منتجات رقمية (Senior Frontend Engineer)' : 'Senior Frontend & Product Engineer'}
                      </p>
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-slate-500 space-y-0.5 text-end font-mono">
                      <div>cairo, egypt</div>
                      <div>dev@example.com</div>
                    </div>
                  </div>
                </div>

                {/* Section 1: Professional Summary */}
                <div className="space-y-1.5 mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentAccent.primary }} />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-900 uppercase tracking-wider">
                      {isAr ? 'الملخص المهني' : 'PROFESSIONAL SUMMARY'}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal">
                    {isAr
                      ? 'مطور برمجيات ذو خبرة +6 سنوات في بناء وتطوير منصات الويب السحابية عالية الأداء. متخصص في تسريع واجهات المستخدم بنسبة 40% وإدارة الفرق البرمجية وفق أعلى معايير الجودة.'
                      : 'Senior Software Engineer with 6+ years driving enterprise web platforms, scalable cloud architectures, and improving web performance by 40% using modern stack.'}
                  </p>
                </div>

                {/* Section 2: Work Experience with Metrics */}
                <div className="space-y-2 mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentAccent.primary }} />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-900 uppercase tracking-wider">
                      {isAr ? 'الخبرات العملية' : 'EXPERIENCE'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs">
                      <span className="font-semibold text-slate-900">Lead Tech Architect @ Alpha Global</span>
                      <span className="text-[10px] font-medium text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {isAr ? '٢٠٢٢ – حتى الآن' : '2022 – Present'}
                      </span>
                    </div>
                    <ul className="text-[10px] sm:text-[11px] text-slate-600 space-y-0.5 list-disc list-inside">
                      <li>{isAr ? 'قيادة فريق مكون من 8 مهندسين لبناء منصة SaaS عالية التحمل.' : 'Led team of 8 engineers delivering high-velocity fintech SaaS.'}</li>
                      <li>
                        <span className="font-semibold text-emerald-700">{isAr ? '+35% تحسين في معدل التحويل' : '+35% conversion lift'}</span>
                        {isAr ? ' عبر تحسين تجربة المستخدم وهندسة الواجهات.' : ' through ultra-fast UI rendering optimization.'}
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Section 3: Core Skills Pills */}
                <div className="space-y-1.5 mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentAccent.primary }} />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-900 uppercase tracking-wider">
                      {isAr ? 'المهارات والتقنيات' : 'CORE COMPETENCIES'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {['React.js', 'TypeScript', 'Node.js', 'Tailwind', 'Next.js', 'System Design', 'Cloud APIs'].map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium border border-slate-200/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interactive Palette Switcher Pill on the Card */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500">
                  <span className="font-medium">{isAr ? 'جرب الألوان فوراً:' : 'Theme Accent:'}</span>
                  <div className="flex items-center gap-1.5">
                    {(['coral', 'navy', 'emerald', 'slate'] as const).map((clr) => (
                      <button
                        key={clr}
                        type="button"
                        onClick={() => setSelectedAccent(clr)}
                        className={`w-4 h-4 rounded-full transition-transform active:scale-90 cursor-pointer ${
                          selectedAccent === clr ? 'ring-2 ring-offset-1 ring-slate-400 scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: accentColors[clr].primary }}
                        title={clr}
                      />
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
