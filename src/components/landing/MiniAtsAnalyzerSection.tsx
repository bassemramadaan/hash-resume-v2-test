import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, CheckCircle2, AlertTriangle, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';

interface MiniAtsAnalyzerSectionProps {
  isAr: boolean;
}

export const MiniAtsAnalyzerSection: React.FC<MiniAtsAnalyzerSectionProps> = ({ isAr }) => {
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [inputTitle, setInputTitle] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSimulateAnalysis = () => {
    if (!inputTitle.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 600);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-gradient-to-r from-[#E8EEF7] via-[#F1F5F9] to-[#E2E8F0] border border-[#CBD5E1] rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-start shadow-sm">
        {/* Left Column Text & Input */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#001639] text-white rounded-full text-xs font-bold">
            <Search className="w-3.5 h-3.5 text-blue-300" />
            <span>{isAr ? 'أداة الفحص والمطابقة اللحظية' : 'Live Match Analyzer Widget'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#0B1120]">
            {isAr ? 'افحص مدى مطابقة سيرتك الذاتية لأي إعلان وظيفي' : 'Analyze Match Ratio Against Any Job Posting'}
          </h2>

          <p className="text-xs text-[#52627A] leading-relaxed max-w-xl">
            {isAr
              ? 'جرّب كتابة مسمى الوظيفة المستهدفة لرؤية النتيجة التقريبية للكلمات المفتاحية المطلوبة ومدى جاهزية ملفك قبل التقديم الرسمى.'
              : 'Enter job titles or specs to identify missing keyword tags and format fixes before applying.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-2 max-w-lg">
            <input
              type="text"
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSimulateAnalysis();
              }}
              placeholder={isAr ? 'أدخل مسمى الوظيفة (مثال: Senior React Developer)...' : 'Enter target job title...'}
              className="w-full px-4 py-2.5 bg-white rounded-xl text-xs font-semibold text-slate-800 border border-slate-300 outline-none focus:border-[#001639] transition"
            />

            <button
              type="button"
              onClick={handleSimulateAnalysis}
              disabled={loading}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#001639] hover:bg-[#00245E] text-white rounded-xl text-xs font-bold transition shrink-0 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>{isAr ? 'افحص مجاناً' : 'Analyze Free'}</span>
            </button>
          </div>

          <div>
            <Link
              to="/ats-checker"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#001639] hover:text-[#FF4D2D] transition mt-2"
            >
              <span>{isAr ? 'انتقل لأداة فحص ATS الكاملة' : 'Open Full ATS Checker Tool'}</span>
              <ArrowIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Right Column Simulated Live Report Card */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#CBD5E1] shadow-md space-y-4">
          <div className="flex items-center justify-between text-xs font-bold border-b pb-3 border-slate-100">
            <span className="text-[#0B1120]">
              {isAr ? 'تقرير المطابقة اللحظي (نموذج محاكاة)' : 'Instant Match Simulator'}
            </span>
            <span className="text-emerald-800 font-black bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {analyzed ? '94% Match ✅' : '88% Match'}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>{isAr ? 'الكلمات المفتاحية المكتشفة:' : 'Matched Keywords:'}</span>
              <span className="font-extrabold text-slate-800">{analyzed ? '16 / 17' : '14 / 16'}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-lg text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{inputTitle ? inputTitle : 'React.js'}</span>
              </span>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-lg text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>TypeScript</span>
              </span>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 rounded-lg text-[10px] font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>CI/CD (موصى به)</span>
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600">
            {isAr
              ? '✨ تقوم المنصة بحظر الجداول والأخطاء وتوليد صياغات متوافقة مع الخوارزميات.'
              : '✨ Hash Resume structures eliminate layout errors automatically.'}
          </div>
        </div>
      </div>
    </section>
  );
};
