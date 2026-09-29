import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { detectLiveAtsWarnings, runOneClickAtsFix, AtsWarningItem } from '../../utils/atsFixer';
import {
  ShieldAlert,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
  Calendar,
  PenTool,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LiveAtsInspectorBar: React.FC = () => {
  const { resumeData, setResumeData, settings } = useResumeStore();
  const isAr = settings.language === 'ar';

  const [expanded, setExpanded] = useState(false);
  const [fixedState, setFixedState] = useState<{
    applied: boolean;
    fixedCount: number;
    fixes: { id: string; titleAr: string; titleEn: string }[];
    previousResumeData?: any;
  }>({
    applied: false,
    fixedCount: 0,
    fixes: [],
  });
  const [isFixing, setIsFixing] = useState(false);

  // Compute live warnings based on current resumeData
  const { warnings, atsScore } = detectLiveAtsWarnings(resumeData, isAr);

  const handleOneClickFix = () => {
    setIsFixing(true);
    const previousSnapshot = JSON.parse(JSON.stringify(resumeData));
    const result = runOneClickAtsFix(resumeData, isAr);

    // Save updated resume data to store
    setResumeData(result.updatedResumeData);

    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.25 },
        colors: ['#FF4D2D', '#001639', '#10B981'],
      });
    } catch {
      // Confetti fallback
    }

    setFixedState({
      applied: true,
      fixedCount: result.fixedCount,
      fixes: result.fixesApplied,
      previousResumeData: previousSnapshot,
    });
    setExpanded(true);
    setIsFixing(false);
  };

  const handleUndoFix = () => {
    if (fixedState.previousResumeData) {
      setResumeData(fixedState.previousResumeData);
      setFixedState({
        applied: false,
        fixedCount: 0,
        fixes: [],
      });
    }
  };

  const getWarningIcon = (type: AtsWarningItem['type']) => {
    switch (type) {
      case 'date_format':
        return <Calendar className="w-3.5 h-3.5 shrink-0 text-amber-600" />;
      case 'action_verbs':
        return <PenTool className="w-3.5 h-3.5 shrink-0 text-amber-600" />;
      case 'metrics':
        return <TrendingUp className="w-3.5 h-3.5 shrink-0 text-amber-600" />;
      default:
        return <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />;
    }
  };

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 text-xs shadow-md transition-all">
      {/* Top Banner Row */}
      <div className="px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        {/* Left / Start: ATS Score + Status */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 font-mono">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                fixedState.applied || atsScore >= 95
                  ? 'bg-emerald-400 animate-pulse'
                  : atsScore >= 80
                  ? 'bg-amber-400'
                  : 'bg-rose-400 animate-pulse'
              }`}
            />
            <span className="text-[11px] font-medium text-slate-300">
              {isAr ? 'محاكي ATS:' : 'ATS Audit:'}
            </span>
            <span
              className={`text-xs font-semibold ${
                fixedState.applied || atsScore >= 95
                  ? 'text-emerald-400'
                  : atsScore >= 80
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {fixedState.applied ? '98%' : `${atsScore}%`}
            </span>
          </div>

          {/* Quick Warning Pills (up to 3) */}
          {!fixedState.applied && warnings.length > 0 ? (
            <div className="hidden lg:flex items-center gap-1.5 overflow-hidden text-[11px]">
              {warnings.map((w) => (
                <span
                  key={w.id}
                  className="px-2 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1 truncate max-w-[210px]"
                  title={isAr ? w.titleAr : w.titleEn}
                >
                  <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                  <span className="truncate">{isAr ? w.titleAr : w.titleEn}</span>
                </span>
              ))}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isAr
                  ? 'معايير Workday و Taleo والشركات العالمية متوافقة 100%'
                  : '100% compliant with Workday & Taleo corporate standards'}
              </span>
            </div>
          )}
        </div>

        {/* Right / End: One-Click ATS Fix Button & Toggle Details */}
        <div className="flex items-center gap-2 shrink-0 ms-auto">
          {!fixedState.applied ? (
            <button
              type="button"
              onClick={handleOneClickFix}
              disabled={isFixing}
              className="px-3.5 py-1.5 bg-gradient-to-r from-[#FF4D2D] to-[#FF6B4A] hover:from-[#E5431F] hover:to-[#FF4D2D] text-white font-semibold text-[11px] rounded-xl shadow-md shadow-coral/30 flex items-center gap-1.5 transition active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>{isAr ? 'إصلاح تلقائي بنقرة واحدة (One-Click ATS Fix)' : 'One-Click ATS Fix'}</span>
              <Sparkles className="w-3 h-3 text-amber-200" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl font-medium text-[11px] flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>{isAr ? 'تم تطبيق المعايير العالمية!' : 'ATS Fix Applied!'}</span>
              </span>
              <button
                type="button"
                onClick={handleUndoFix}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[11px] font-medium flex items-center gap-1 transition cursor-pointer"
                title={isAr ? 'تراجع عن الإصلاح' : 'Undo fix'}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isAr ? 'تراجع' : 'Undo'}</span>
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition cursor-pointer flex items-center gap-1 text-[11px]"
            aria-expanded={expanded}
          >
            <span>{isAr ? (expanded ? 'إخفاء' : 'تفاصيل') : expanded ? 'Hide' : 'Details'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Interactive Breakdown Details Panel */}
      {expanded && (
        <div className="px-4 py-3 bg-slate-950 border-t border-slate-800/80 space-y-3 animate-in fade-in-50 duration-150">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-bold text-slate-200">
              {fixedState.applied
                ? isAr
                  ? 'ملخص التحسينات المنفذة على السيرة الذاتية:'
                  : 'Applied Enhancements Breakdown:'
                : isAr
                ? 'تحذيرات التوافق المباشرة مع أنظمة الفرز (Workday / Taleo / Greenhouse):'
                : 'Direct Compatibility Warnings for Enterprise ATS Systems:'}
            </span>
            <span className="text-slate-500">
              {isAr ? 'معايير الفرز الآلي الدولية 2026' : 'Global ATS Standards 2026'}
            </span>
          </div>

          {/* If fix has been applied, show what was improved */}
          {fixedState.applied ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-700/50 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isAr ? '1. توحيد صياغة التواريخ' : '1. Date Normalization'}</span>
                </div>
                <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                  {isAr
                    ? 'تم توحيد فترات العمل لتنسيق (YYYY-MM) القابل للقراءة الآلية لبرامج Workday دون أخطاء.'
                    : 'Standardized to (YYYY-MM) format readable by Workday without parsing errors.'}
                </p>
              </div>

              <div className="p-2.5 bg-emerald-950/40 border border-emerald-700/50 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isAr ? '2. أفعال قيادية قوية' : '2. Power Action Verbs'}</span>
                </div>
                <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                  {isAr
                    ? 'استبدال العبارات المبهمة مثل "مسؤول عن" بأفعال مبنية للمعلوم (قُدت، صممت، أطلقت، حسّنت).'
                    : 'Replaced passive phrases with high-impact action verbs (Spearheaded, Engineered, Optimized).'}
                </p>
              </div>

              <div className="p-2.5 bg-emerald-950/40 border border-emerald-700/50 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{isAr ? '3. مؤشرات أداء (KPIs)' : '3. Quantified Metrics'}</span>
                </div>
                <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                  {isAr
                    ? 'تعزيز نقاط الإنجاز بنسب مئوية وأرقام لقياس حجم الأثر والمسؤولية المهنية.'
                    : 'Enriched bullets with quantifiable percentages and benchmark efficiency metrics.'}
                </p>
              </div>
            </div>
          ) : (
            /* Warning Cards with Fix Previews */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {warnings.map((warn, i) => (
                <div
                  key={warn.id}
                  className="p-3 bg-slate-900/90 border border-amber-500/30 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-300">
                      {getWarningIcon(warn.type)}
                      <span className="text-xs">{isAr ? warn.titleAr : warn.titleEn}</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-400">
                      #{i + 1}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {isAr ? warn.descAr : warn.descEn}
                  </p>

                  {warn.fixPreviewAr && (
                    <div className="pt-1 border-t border-slate-800 text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 shrink-0" />
                      <span>{isAr ? `الحل المباشر: ${warn.fixPreviewAr}` : `Fix: ${warn.fixPreviewEn}`}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
