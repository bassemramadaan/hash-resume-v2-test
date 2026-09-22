import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useUndoToastStore } from '../../store/useUndoToastStore';
import { getTranslation } from '../../i18n/translations';
import { generateId } from '../../utils/idGenerator';
import {
  Briefcase,
  Plus,
  Trash2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Wand2,
  TrendingUp,
  Target,
  BarChart3,
  Loader2,
  Check,
  X,
} from 'lucide-react';
import { NextStepBanner } from './NextStepBanner';
import { aiApi } from '../../lib/api';

export const ExperienceForm: React.FC = () => {
  const {
    resumeData,
    addExperience,
    updateExperience,
    removeExperience,
    insertExperienceAtIndex,
    reorderExperiences,
    settings,
    openAiModal,
  } = useResumeStore();
  const { showUndoToast } = useUndoToastStore();

  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';
  const experiences = resumeData.experiences || [];

  const [expandedId, setExpandedId] = useState<string | null>(
    experiences.length > 0 ? experiences[0].id : null
  );

  // Active quantify state
  const [quantifyTarget, setQuantifyTarget] = useState<{
    expId: string;
    bIdx: number;
    text: string;
    jobTitle: string;
  } | null>(null);
  const [quantifyOptions, setQuantifyOptions] = useState<string[]>([]);
  const [isQuantifying, setIsQuantifying] = useState(false);

  const handleStartQuantify = async (expId: string, bIdx: number, text: string, jobTitle: string) => {
    setQuantifyTarget({ expId, bIdx, text, jobTitle });
    setIsQuantifying(true);
    setQuantifyOptions([]);

    try {
      const data = await aiApi.quantifyAchievement({
        text: text || 'مسؤول عن تحسين وتطوير العمليات والأنظمة',
        jobTitle: jobTitle || 'محترف',
        language: settings.language,
      });

      if (data && Array.isArray(data.options)) {
        setQuantifyOptions(data.options);
      } else {
        setQuantifyOptions([
          isAr
            ? `${text || 'طوّرت وحسّنت العمليات'}، مما حقق نمواً بنسبة 35% وزيادة في الكفاءة التشغيلية.`
            : `${text || 'Optimized operational workflows'}, delivering a 35% increase in team performance.`
        ]);
      }
    } catch {
      setQuantifyOptions([
        isAr
          ? `${text || 'طوّرت وحسّنت العمليات'}، مما حقق نمواً بنسبة 35% وزيادة في الكفاءة التشغيلية.`
          : `${text || 'Optimized operational workflows'}, delivering a 35% increase in team performance.`
      ]);
    } finally {
      setIsQuantifying(false);
    }
  };

  const handleApplyQuantified = (selectedOption: string) => {
    if (!quantifyTarget) return;
    const exp = experiences.find((e) => e.id === quantifyTarget.expId);
    if (!exp) return;

    const next = [...(exp.bulletPoints || [])];
    next[quantifyTarget.bIdx] = selectedOption;
    updateExperience(quantifyTarget.expId, { bulletPoints: next });
    setQuantifyTarget(null);
    setQuantifyOptions([]);
  };

  const AR_ACTION_VERBS = [
    'قُدت فريقاً لـ',
    'أشرفت على تطوير',
    'حققت زيادة بنسبة 35% في',
    'حسّنت كفاءة العمليات بنسبة',
    'قلّصت زمن الاستجابة بمقدار',
    'صممت ونفّذت استراتيجية',
    'أطلقت منتجاً حقق نمواً',
    'طوّرت بنية برمجية تدعم',
  ];

  const EN_ACTION_VERBS = [
    'Spearheaded the development of',
    'Increased efficiency by 30% through',
    'Optimized team performance by',
    'Reduced operational costs by 25%',
    'Architected and deployed',
    'Accelerated release cycle by 40%',
    'Led a cross-functional team to',
    'Engineered high-throughput solutions for',
  ];

  const actionVerbs = isAr ? AR_ACTION_VERBS : EN_ACTION_VERBS;

  const handleInsertVerb = (expId: string, currentBullets: string[], verb: string) => {
    const next = [...currentBullets];
    if (next.length === 0 || (next.length === 1 && next[0].trim() === '')) {
      next[0] = verb + ' ';
    } else {
      next.push(verb + ' ');
    }
    updateExperience(expId, { bulletPoints: next });
  };

  const handleApplyQuickTransform = (
    expId: string,
    currentBullets: string[],
    idx: number,
    type: 'metric' | 'action' | 'ats'
  ) => {
    const current = currentBullets[idx] || '';
    let transformed = current;

    if (type === 'metric') {
      if (isAr) {
        transformed = current.trim()
          ? `${current.trim()}، مما حقق نمواً بنسبة 35% وزيادة في الكفاءة التشغيلية.`
          : 'حسّنت كفاءة العمليات بنسبة 40% من خلال أتمتة الإجراءات اليومية.';
      } else {
        transformed = current.trim()
          ? `${current.trim()}, delivering a 35% increase in operational efficiency.`
          : 'Streamlined core workflows, achieving a 40% boost in team throughput.';
      }
    } else if (type === 'action') {
      if (isAr) {
        transformed = current.startsWith('قُدت') || current.startsWith('طوّرت')
          ? current
          : `قُدت تطوير وإدارة ${current || 'المشروع والمبادرات التقنية بنجاح.'}`;
      } else {
        transformed = current.startsWith('Led') || current.startsWith('Spearheaded')
          ? current
          : `Spearheaded the strategic execution of ${current || 'key initiatives with excellence.'}`;
      }
    } else if (type === 'ats') {
      if (isAr) {
        transformed = current.trim()
          ? `تطبيق أفضل ممارسات الجودة والمعايير القياسية في ${current.trim()}.`
          : 'تطبيق أحدث التقنيات والمعايير البرمجية لضمان استقرار وجاهزية النظام.';
      } else {
        transformed = current.trim()
          ? `Implemented industry best practices to scale ${current.trim()}.`
          : 'Applied agile methodologies to deliver scalable, high-availability solutions.';
      }
    }

    const next = [...currentBullets];
    next[idx] = transformed;
    updateExperience(expId, { bulletPoints: next });
  };

  const handleAddNew = () => {
    const newId = generateId('exp');
    addExperience({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      bulletPoints: [''],
    });
    setExpandedId(newId);
  };

  const handleAddBullet = (expId: string, currentBullets: string[]) => {
    updateExperience(expId, {
      bulletPoints: [...currentBullets, ''],
    });
  };

  const handleUpdateBullet = (
    expId: string,
    currentBullets: string[],
    idx: number,
    val: string
  ) => {
    const next = [...currentBullets];
    next[idx] = val;
    updateExperience(expId, { bulletPoints: next });
  };

  const handleRemoveBullet = (expId: string, currentBullets: string[], idx: number) => {
    const next = currentBullets.filter((_, i) => i !== idx);
    updateExperience(expId, { bulletPoints: next });
  };

  const handleDeleteExperience = (exp: any, expIdx: number) => {
    removeExperience(exp.id);
    showUndoToast({
      messageAr: exp.position ? `تم حذف خبرة "${exp.position}"` : 'تم حذف الخبرة',
      messageEn: exp.position ? `Deleted "${exp.position}"` : 'Experience deleted',
      onUndo: () => {
        insertExperienceAtIndex(expIdx, exp);
        setExpandedId(exp.id);
      },
    });
  };

  return (
    <div className="space-y-4 text-slate-800 w-full max-w-full min-w-0 overflow-x-hidden mobile-editor-content">
      {/* Top Action Bar when experiences exist */}
      {experiences.length > 0 && (
        <div className="flex items-center justify-between gap-3 pb-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">
              {isAr ? `الخبرات المضافة (${experiences.length})` : `Added Roles (${experiences.length})`}
            </span>
          </div>
          <button
            type="button"
            onClick={handleAddNew}
            className="add-experience-button inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#001639] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0 shadow-2xs active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF4D2D]" />
            <span>{isAr ? 'إضافة خبرة' : 'Add Experience'}</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {experiences.length === 0 && (
        <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center space-y-3 bg-slate-50/60">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#FF4D2D] flex items-center justify-center mx-auto shadow-2xs">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-tajawal font-bold text-slate-900 text-sm sm:text-base">
              {isAr ? 'لا توجد خبرات مهنية بعد' : 'No experience added yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {isAr
                ? 'أضف وظيفة سابقة، أو تدريباً صيفياً، أو عملاً حراً، أو دوراً تطوعياً لإبراز إنجازاتك.'
                : 'Add previous roles, internships, freelance, or volunteering to highlight your impact.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddNew}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#001639] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-98 cursor-pointer mt-2"
          >
            <Plus className="w-4 h-4 text-[#FF4D2D]" />
            <span>{isAr ? 'إضافة أول خبرة' : 'Add First Experience'}</span>
          </button>
        </div>
      )}

      {/* Experience List */}
      <div className="space-y-3">
        {(experiences || []).map((exp, expIdx) => {
          const isExpanded = expandedId === exp.id;

          return (
            <div
              key={exp.id}
              className="border border-slate-200/90 rounded-2xl bg-white transition shadow-2xs overflow-hidden"
            >
              {/* Card Header Bar */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-slate-50/70 transition"
                role="button"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-[#001639] flex items-center justify-center font-bold text-xs shrink-0">
                    {expIdx + 1}
                  </span>
                  <div>
                    <h3 className="font-tajawal font-bold text-xs sm:text-sm text-slate-900">
                      {exp.position || (isAr ? 'مسمى وظيفي جديد' : 'New Role Title')}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {exp.company || (isAr ? 'اسم الشركة' : 'Company Name')}
                      {exp.startDate ? ` • ${exp.startDate} - ${exp.current ? (isAr ? 'حتى الآن' : 'Present') : exp.endDate}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Reorder Buttons */}
                  <button
                    type="button"
                    disabled={expIdx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      reorderExperiences(expIdx, expIdx - 1);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title={isAr ? 'تحريك للأعلى' : 'Move Up'}
                    aria-label={isAr ? 'تحريك للأعلى' : 'Move Up'}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={expIdx === experiences.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      reorderExperiences(expIdx, expIdx + 1);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    title={isAr ? 'تحريك للأسفل' : 'Move Down'}
                    aria-label={isAr ? 'تحريك للأسفل' : 'Move Down'}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteExperience(exp, expIdx);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title={isAr ? 'حذف الخبرة' : 'Delete experience'}
                    aria-label={isAr ? 'حذف الخبرة' : 'Delete experience'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="p-1.5 text-slate-400">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-700" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Form Content */}
              {isExpanded && (
                <div className="p-4 sm:p-5 border-t border-slate-100 space-y-4 bg-slate-50/40">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Position */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {t.position} <span className="text-[#FF4D2D] font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                        placeholder={isAr ? 'مهندس برمجيات أول' : 'Senior Software Engineer'}
                        className="w-full px-3.5 h-11 bg-white hover:border-slate-300 focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-xl text-sm font-ibm-sans text-slate-900 placeholder:text-slate-400 outline-none transition shadow-2xs"
                      />
                    </div>

                    {/* Company */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {t.company} <span className="text-[#FF4D2D] font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                        placeholder={isAr ? 'اسم الشركة' : 'Company Name'}
                        className="w-full px-3.5 h-11 bg-white hover:border-slate-300 focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-xl text-sm font-ibm-sans text-slate-900 placeholder:text-slate-400 outline-none transition shadow-2xs"
                      />
                    </div>

                    {/* Start Date */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">{t.startDate}</label>
                      <input
                        type="text"
                        dir="ltr"
                        inputMode="numeric"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                        placeholder="01/2021"
                        className="w-full px-3.5 h-11 bg-white hover:border-slate-300 focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-xl text-sm font-mono text-slate-900 placeholder:text-slate-400 outline-none transition shadow-2xs"
                      />
                    </div>

                    {/* End Date & Current Checkbox */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">{t.endDate}</label>
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          dir="ltr"
                          inputMode="numeric"
                          disabled={exp.current}
                          value={exp.current ? (isAr ? 'حتى الآن' : 'Present') : exp.endDate}
                          onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                          placeholder="12/2023"
                          className="w-full px-3.5 h-11 bg-white hover:border-slate-300 focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-xl text-sm font-mono text-slate-900 placeholder:text-slate-400 outline-none transition disabled:opacity-50 disabled:bg-slate-100 shadow-2xs"
                        />
                        <label className="flex items-center gap-2 cursor-pointer group w-fit">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => {
                              updateExperience(exp.id, {
                                current: e.target.checked,
                                endDate: e.target.checked ? '' : exp.endDate
                              });
                            }}
                            className="w-4 h-4 rounded-md border-slate-300 text-[#001639] focus:ring-[#001639] cursor-pointer accent-[#FF4D2D]"
                          />
                          <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition">
                            {isAr ? 'أعمل هنا حالياً' : 'I currently work here'}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Bullet Points Section */}
                  <div className="pt-3 border-t border-slate-200/60 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <label className="text-xs font-bold text-slate-700">
                        {t.bulletPoints}
                      </label>
                      <button
                        type="button"
                        onClick={() => openAiModal('bullet', exp.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-[#001639] bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition cursor-pointer shadow-2xs active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D]" />
                        <span>{t.aiEnhanceBullet}</span>
                      </button>
                    </div>

                    {/* Action Verbs Bar */}
                    <div className="flex flex-wrap items-center gap-1.5 py-0.5">
                      <span className="text-xs text-slate-400 font-medium">
                        {isAr ? 'أفعال إنجاز:' : 'Verbs:'}
                      </span>
                      {(actionVerbs || []).slice(0, 5).map((verb, vIdx) => (
                        <button
                          key={vIdx}
                          type="button"
                          onClick={() => handleInsertVerb(exp.id, exp.bulletPoints, verb)}
                          className="px-2 py-0.5 text-xs bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg transition cursor-pointer shadow-2xs"
                        >
                          + {verb}
                        </button>
                      ))}
                    </div>

                    {/* Bullets List */}
                    <div className="space-y-2">
                      {(exp.bulletPoints || []).map((bullet, bIdx) => (
                        <div key={bIdx} className="bg-white p-2.5 rounded-xl border border-slate-200/80 space-y-2 shadow-2xs">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) =>
                                handleUpdateBullet(exp.id, exp.bulletPoints, bIdx, e.target.value)
                              }
                              placeholder={t.bulletPlaceholder}
                              className="flex-1 px-3 py-2 bg-slate-50/70 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-lg text-xs text-slate-800 outline-none transition"
                            />
                            <button
                              type="button"
                              onClick={() => handleStartQuantify(exp.id, bIdx, bullet, exp.position)}
                              className="p-2 text-slate-400 hover:text-[#FF4D2D] hover:bg-orange-50 rounded-lg transition cursor-pointer shrink-0"
                              title={isAr ? 'صياغة ذكية مدعومة بالأرقام' : 'Quantify with AI'}
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveBullet(exp.id, exp.bulletPoints, bIdx)}
                              className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer shrink-0"
                              aria-label={isAr ? 'حذف نقطة الإنجاز' : 'Delete bullet point'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* AI Quantify Options Card */}
                          {quantifyTarget?.expId === exp.id && quantifyTarget?.bIdx === bIdx && (
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 animate-in fade-in-50 duration-150">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D]" />
                                  <span>{isAr ? 'خيارات الصياغة الرقمية (منهجية STAR):' : 'Quantified Achievement Options (STAR):'}</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setQuantifyTarget(null)}
                                  className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {isQuantifying ? (
                                <div className="flex items-center justify-center py-4 text-xs font-medium text-slate-700 gap-2">
                                  <Loader2 className="w-4 h-4 animate-spin text-[#FF4D2D]" />
                                  <span>{isAr ? 'جاري تحويل المسؤولية إلى إنجاز كمي...' : 'Generating metrics...'}</span>
                                </div>
                              ) : (
                                <div className="space-y-1.5">
                                  {quantifyOptions.map((opt, oIdx) => (
                                    <button
                                      key={oIdx}
                                      type="button"
                                      onClick={() => handleApplyQuantified(opt)}
                                      className="w-full text-start p-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-800 transition cursor-pointer flex items-start gap-2 group active:scale-99 shadow-2xs"
                                    >
                                      <span className="w-5 h-5 rounded-md bg-slate-100 group-hover:bg-[#001639] group-hover:text-white text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 transition">
                                        {oIdx + 1}
                                      </span>
                                      <span className="flex-1 leading-relaxed">{opt}</span>
                                      <Check className="w-3.5 h-3.5 text-emerald-600 opacity-0 group-hover:opacity-100 transition shrink-0 mt-0.5" />
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddBullet(exp.id, exp.bulletPoints)}
                      className="text-xs text-[#001639] font-bold hover:text-[#FF4D2D] inline-flex items-center gap-1 cursor-pointer pt-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#FF4D2D]" />
                      <span>{t.addBullet}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
