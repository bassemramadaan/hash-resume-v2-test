import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { Sparkles, X, Check, Loader2, Copy } from 'lucide-react';

export const AiAssistantModal: React.FC = () => {
  const {
    isAiModalOpen,
    aiModalType,
    closeAiModal,
    activeExperienceIdForAi,
    resumeData,
    setPersonalInfo,
    updateExperience,
    addSkill,
    settings,
  } = useResumeStore();

  const t = getTranslation(settings.language);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [categorizedSkills, setCategorizedSkills] = useState<any>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Body scroll locking and Escape key listener for modal accessibility
  useEffect(() => {
    if (isAiModalOpen) {
      setErrorMessage(null);
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeAiModal();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isAiModalOpen, closeAiModal]);

  if (!isAiModalOpen) return null;

  const expItem = activeExperienceIdForAi
    ? resumeData.experiences.find((x) => x.id === activeExperienceIdForAi)
    : null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuggestions([]);
    setCategorizedSkills(null);

    try {
      if (aiModalType === 'bullet') {
        const response = await fetch('/api/ai/enhance-bullet', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bulletText: inputText || (expItem?.bulletPoints?.[0] ?? 'أدرت واستكملت المهام اليومية بكفاءة'),
            jobTitle: expItem?.position || resumeData.personalInfo.jobTitle,
            language: settings.language,
          }),
        });

        const data = await response.json();
        if (response.ok && data.suggestions) {
          setSuggestions(data.suggestions);
        } else if (data.fallbackSuggestions) {
          setSuggestions(data.fallbackSuggestions);
          if (data.error) setErrorMessage(settings.language === 'en' ? data.errorEn || data.error : data.error);
        } else if (data.error) {
          setErrorMessage(settings.language === 'en' ? data.errorEn || data.error : data.error);
        }
      } else if (aiModalType === 'summary') {
        const response = await fetch('/api/ai/generate-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobTitle: resumeData.personalInfo.jobTitle || 'محترف',
            yearsOfExperience: '3-5',
            keySkills: (resumeData.skills || []).map((s) => s.name).join(', '),
            language: settings.language,
          }),
        });

        const data = await response.json();
        if (response.ok && data.summary) {
          setSuggestions([data.summary]);
        } else if (data.summary) {
          setSuggestions([data.summary]);
          if (data.error) setErrorMessage(settings.language === 'en' ? data.errorEn || data.error : data.error);
        } else if (data.error) {
          setErrorMessage(settings.language === 'en' ? data.errorEn || data.error : data.error);
        }
      } else if (aiModalType === 'skills') {
        const response = await fetch('/api/ai/suggest-skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobTitle: resumeData.personalInfo.jobTitle || 'مهندس برمجيات',
            language: settings.language,
          }),
        });

        const data = await response.json();
        if (data.technicalSkills || data.softSkills || data.tools) {
          setCategorizedSkills(data);
          if (data.error) setErrorMessage(settings.language === 'en' ? data.errorEn || data.error : data.error);
        } else if (data.error) {
          setErrorMessage(settings.language === 'en' ? data.errorEn || data.error : data.error);
        }
      }
    } catch (err) {
      console.error('AI Modal error:', err);
      setErrorMessage(
        settings.language === 'ar'
          ? 'تعذر الاتصال بخدمة الذكاء الاصطناعي حالياً.'
          : 'Unable to connect to AI service at the moment.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplySuggestion = (text: string) => {
    if (aiModalType === 'summary') {
      setPersonalInfo({ summary: text });
    } else if (aiModalType === 'bullet' && activeExperienceIdForAi && expItem) {
      updateExperience(activeExperienceIdForAi, {
        bulletPoints: [...expItem.bulletPoints, text],
      });
    }
    closeAiModal();
  };

  const handleAddSuggestedSkill = (name: string, category: 'technical' | 'soft' | 'tool') => {
    addSkill({ name, category });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAiModal();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-modal-title"
        className="w-full max-w-lg bg-[#000F27] border border-[#001639] rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in fade-in zoom-in duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#001639] bg-[#000F27]/80">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#FF4D2D]/10 text-[#FF4D2D] border border-[#FF4D2D]/20">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 id="ai-modal-title" className="font-bold text-sm text-slate-100">
                {aiModalType === 'summary' && (settings.language === 'ar' ? 'صياغة ملخص مهني بالذكاء الاصطناعي' : 'AI Professional Summary Generator')}
                {aiModalType === 'bullet' && (settings.language === 'ar' ? 'تحسين صياغة الإنجازات لنظام ATS' : 'AI ATS Bullet Optimizer')}
                {aiModalType === 'skills' && (settings.language === 'ar' ? 'اقتراح مهارات ذكية حسب المسمى الوظيفي' : 'AI Skill Recommender')}
              </h3>
              <p className="text-[11px] text-slate-400">
                {settings.language === 'ar' ? 'توليد صياغة موثوقة ومحسنة لخوارزميات التوظيف' : 'Optimized for high ATS scanner compatibility'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAiModal}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition cursor-pointer"
            aria-label={settings.language === 'ar' ? 'إغلاق النافذة' : 'Close modal'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {aiModalType === 'bullet' && (
            <div>
              <label className="block font-medium text-slate-300 mb-1">
                {settings.language === 'ar' ? 'أدخل النقطة الحالية أو المهام المراد تحسينها:' : 'Current bullet or task description:'}
              </label>
              <textarea
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={settings.language === 'ar' ? 'مثال: كنت مسئول عن تصميم المواقع وإدارة قاعدة البيانات' : 'e.g. Responsible for web design and database administration'}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>
          )}

          {aiModalType === 'summary' && (
            <p className="text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
              {settings.language === 'ar'
                ? `سيتم توليد ملخص مهني جذاب بناءً على مسمّاك الوظيفي (${resumeData.personalInfo.jobTitle || 'محترف'}) ومهاراتك المكتوبة.`
                : `A concise professional summary will be generated for your role: (${resumeData.personalInfo.jobTitle || 'Professional'}).`}
            </p>
          )}

          {aiModalType === 'skills' && (
            <p className="text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
              {settings.language === 'ar'
                ? `اقتراح المهارات المستهدفة للمسمى: ${resumeData.personalInfo.jobTitle || 'عام'}`
                : `Recommending high-demand skills for: ${resumeData.personalInfo.jobTitle || 'General'}`}
            </p>
          )}

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-[11px] leading-relaxed flex items-start gap-2">
              <span className="font-bold">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Trigger Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-2.5 bg-[#FF4D2D] hover:bg-[#E5431F] text-white font-bold rounded-full shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري المعالجة...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{settings.language === 'ar' ? 'توليد الصياغة الآن' : 'Generate Suggestions Now'}</span>
              </>
            )}
          </button>

          {/* Suggestions Output */}
          {suggestions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="font-bold text-slate-300">
                {settings.language === 'ar' ? 'الاقتراحات المحسنة:' : 'Generated Suggestions:'}
              </h4>
              <div className="space-y-2">
                {suggestions.map((sug, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2"
                  >
                    <p className="text-slate-200 leading-relaxed">{sug}</p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleApplySuggestion(sug)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1 transition cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{settings.language === 'ar' ? 'اعتماد الصياغة' : 'Use This'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorized Skills Output */}
          {categorizedSkills && (
            <div className="space-y-3 pt-2 border-t border-slate-800">
              {categorizedSkills.technicalSkills && (
                <div>
                  <h4 className="font-bold text-blue-400 mb-1">{t.techSkills}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {categorizedSkills.technicalSkills.map((sk: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleAddSuggestedSkill(sk, 'technical')}
                        className="px-2.5 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 rounded-lg transition text-[11px] font-medium cursor-pointer"
                      >
                        + {sk}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {categorizedSkills.softSkills && (
                <div>
                  <h4 className="font-bold text-emerald-400 mb-1">{t.softSkills}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {categorizedSkills.softSkills.map((sk: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleAddSuggestedSkill(sk, 'soft')}
                        className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 rounded-lg transition text-[11px] font-medium cursor-pointer"
                      >
                        + {sk}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {categorizedSkills.tools && (
                <div>
                  <h4 className="font-bold text-purple-400 mb-1">{t.tools}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {categorizedSkills.tools.map((sk: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleAddSuggestedSkill(sk, 'tool')}
                        className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 rounded-lg transition text-[11px] font-medium cursor-pointer"
                      >
                        + {sk}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
