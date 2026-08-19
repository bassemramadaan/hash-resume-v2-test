import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';

interface FinalCtaSectionProps {
  isAr: boolean;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({ isAr }) => {
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <>
      {/* Big Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-gradient-to-br from-[#E8EEF7] via-white to-[#F1F5F9] text-slate-900 rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-lg border-2 border-[#001639] relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#FF4D2D]/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="px-3.5 py-1.5 rounded-full text-[10px] font-black bg-[#001639] text-white uppercase tracking-widest inline-flex items-center gap-1.5 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D]" />
              <span>{isAr ? 'خطوتك القادمة نحو الوظيفة' : 'Ready to Land Your Dream Job?'}</span>
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-[#001639] leading-tight">
              {isAr ? 'جاهز لبناء سيرة ذاتية تفتح لك أبواب المقابلات؟' : 'Create an Interview-Winning Resume Today'}
            </h2>

            <p className="text-xs sm:text-sm text-[#52627A] font-medium leading-relaxed">
              {isAr
                ? 'انضم إلى آلاف الباحثين عن عمل في مصر والخليج الذين يعتمدون على Hash Resume لتخطي أنظمة الفلترة الآلية بحرفية كاملة.'
                : 'Build, optimize, and export your professional resume in minutes.'}
            </p>

            <div className="pt-2">
              <Link
                to="/builder"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-black text-sm rounded-full shadow-lg hover:shadow-xl transition transform active:scale-95 cursor-pointer"
              >
                <span>{isAr ? 'ابدأ إنشاء سيرتك مجاناً الآن' : 'Start Building Free Now'}</span>
                <ArrowIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA Bar (Only visible on mobile screens) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md p-3 border-t border-slate-200 shadow-2xl flex items-center justify-between gap-3">
        <div className="text-start space-y-0.5">
          <div className="text-[11px] font-extrabold text-[#001639]">Hash Resume</div>
          <div className="text-[9px] text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{isAr ? 'متوافق 100% مع ATS' : '100% ATS Compliant'}</span>
          </div>
        </div>

        <Link
          to="/builder"
          className="px-5 py-2.5 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-extrabold text-xs rounded-full shadow-md transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>{isAr ? 'ابدأ مجاناً' : 'Build Free'}</span>
          <ArrowIcon className="w-3.5 h-3.5" />
        </Link>
      </div>
    </>
  );
};
