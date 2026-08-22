import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useResumeStore } from '../../store/useResumeStore';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  FileText,
  Zap,
  ShieldCheck,
  Check,
  Cpu,
  Layers,
  Search,
  XCircle,
  Briefcase,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

interface HeroSectionProps {
  isAr: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isAr }) => {
  const navigate = useNavigate();
  const { resumeData, setPersonalInfo, setTemplate, settings } = useResumeStore();

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  // State for hero interactive job launcher
  const [targetRole, setTargetRole] = useState('');
  const [selectedSimTab, setSelectedSimTab] = useState<'ats' | 'traditional'>('ats');
  const [simTemplate, setSimTemplate] = useState<'modern-ats' | 'technical-clean' | 'minimal-exec'>('modern-ats');

  // Suggested roles for 1-click selection in hero
  const suggestedRoles = isAr
    ? [
        { label: 'مهندس برمجيات', icon: '💻' },
        { label: 'مسؤول تسويق رقمي', icon: '📊' },
        { label: 'مدير مشاريع', icon: '🎯' },
        { label: 'محاسب مالي', icon: '💰' },
        { label: 'أخصائي موارد بشرية', icon: '👥' },
        { label: 'مطور وجهات أمامي', icon: '⚡' },
      ]
    : [
        { label: 'Software Engineer', icon: '💻' },
        { label: 'Digital Marketer', icon: '📊' },
        { label: 'Project Manager', icon: '🎯' },
        { label: 'Financial Accountant', icon: '💰' },
        { label: 'HR Specialist', icon: '👥' },
        { label: 'Frontend Developer', icon: '⚡' },
      ];

  const handleStartBuilder = (roleOverride?: string) => {
    const roleToUse = roleOverride || targetRole.trim();
    if (roleToUse) {
      setPersonalInfo({
        jobTitle: roleToUse,
      });
    }
    navigate('/builder');
  };

  return (
    <section className="relative overflow-hidden bg-white text-slate-900 pt-10 sm:pt-16 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Simple & Calm Copy */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-start">
          {/* Top Quiet Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 text-[#001639] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D] shrink-0" />
            <span>
              {isAr
                ? 'منصة سريعة وبسيطة لبناء سيرة ذاتية متوافقة مع ATS'
                : 'Simple, ATS-Engineered Resume Builder'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl font-black text-[#001639] leading-[1.2] tracking-tight">
            {isAr ? (
              <>
                سيرتك الذاتية الاحترافية{' '}
                <span className="text-[#FF4D2D]">ببساطة وهدوء</span>
              </>
            ) : (
              <>
                Create Your Professional Resume <span className="text-[#FF4D2D]">Effortlessly</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#52627A] font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
            {isAr
              ? 'صمّم سيرة ذاتية متوافقة تماماً مع أنظمة الفلترة الآلية باللغتين العربية والإنجليزية، بمساعدة الذكاء الاصطناعي وخصوصية محليّة كاملة.'
              : 'Build an ATS-compliant CV in Arabic & English with AI assistance and 100% local privacy.'}
          </p>

          {/* Simple Direct Launcher */}
          <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto lg:mx-0 pt-2">
            <div className="relative w-full">
              <Briefcase className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStartBuilder();
                }}
                placeholder={isAr ? 'أدخل مسمى الوظيفة (اختياري)...' : 'Enter job title (optional)...'}
                className="w-full ps-10 pe-4 py-3 bg-slate-50 text-slate-900 rounded-2xl text-xs font-medium placeholder:text-slate-400 border border-slate-200 focus:outline-none focus:border-[#001639] focus:bg-white transition"
              />
            </div>

            <button
              type="button"
              onClick={() => handleStartBuilder()}
              className="w-full sm:w-auto px-7 py-3 bg-[#001639] hover:bg-[#00245E] text-white font-bold text-xs rounded-2xl shadow-xs hover:shadow transition flex items-center justify-center gap-2 shrink-0 cursor-pointer min-h-[44px]"
            >
              <span>{isAr ? 'ابدأ الآن مجاناً' : 'Build Resume Free'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Quiet Badges */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-[#52627A]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isAr ? 'بدون تسجيل حساب' : 'No Account Required'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isAr ? 'خصوصية تامة 100%' : '100% Private'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Resume Card */}
        <div className="lg:col-span-5 relative">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-start">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#001639]" />
                <span className="font-bold text-xs text-[#0B1120]">
                  {isAr ? 'معاينة سريعة للسيرة' : 'Resume Preview'}
                </span>
              </div>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                ATS Score 98%
              </span>
            </div>

            <div className="space-y-3 bg-slate-50/60 p-4 rounded-2xl border border-slate-100 text-xs">
              <div>
                <h3 className="font-bold text-sm text-[#0B1120]">
                  {targetRole || (isAr ? 'باسم رمضان — مهندس برمجيات' : 'Bassem Ramadan — Software Engineer')}
                </h3>
                <p className="text-[11px] text-[#52627A] mt-0.5">
                  bassem@example.com • +20 100 000 0000 • Cairo, Egypt
                </p>
              </div>

              <div className="border-t border-slate-200 pt-2 space-y-1">
                <div className="text-[10px] font-bold text-[#001639] uppercase tracking-wider">
                  {isAr ? 'الخبرة المهنية' : 'Work Experience'}
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 text-[11px] space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>{isAr ? 'مهندس برمجيات أول' : 'Senior Software Engineer'}</span>
                    <span className="text-[10px] text-slate-400 font-normal">2023 – Present</span>
                  </div>
                  <p className="text-[10px] text-[#52627A] leading-relaxed">
                    • {isAr ? 'بناء أنظمة عالية الأداء وتحسين كفاءة الفلترة بـ 45%.' : 'Built scalable systems boosting processing performance by 45%.'}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2 space-y-1">
                <div className="text-[10px] font-bold text-[#001639] uppercase tracking-wider">
                  {isAr ? 'المهارات المفتاحية' : 'Core Skills'}
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 bg-white text-slate-700 border border-slate-200 text-[9px] font-semibold rounded-md">
                    TypeScript
                  </span>
                  <span className="px-2 py-0.5 bg-white text-slate-700 border border-slate-200 text-[9px] font-semibold rounded-md">
                    React.js
                  </span>
                  <span className="px-2 py-0.5 bg-white text-slate-700 border border-slate-200 text-[9px] font-semibold rounded-md">
                    Node.js
                  </span>
                  <span className="px-2 py-0.5 bg-white text-slate-700 border border-slate-200 text-[9px] font-semibold rounded-md">
                    System Design
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleStartBuilder()}
              className="w-full py-2.5 bg-[#001639] hover:bg-[#00245E] text-white font-bold text-xs rounded-xl transition text-center cursor-pointer block"
            >
              {isAr ? 'تعديل وإنشاء هذه السيرة' : 'Edit & Build Resume'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
