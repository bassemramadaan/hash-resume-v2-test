import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { Sparkles, X, Check, Loader2, Copy } from 'lucide-react';
import { parseApiError } from '../../utils/apiErrorHelper';
import { aiApi } from '../../lib/api';

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
        const data = await aiApi.enhanceBullet({
          bulletText: inputText || (expItem?.bulletPoints?.[0] ?? 'أدرت واستكملت المهام اليومية بكفاءة'),
          jobTitle: expItem?.position || resumeData.personalInfo.jobTitle,
          language: settings.language,
        });

        if (data.suggestions && data.suggestions.length > 0) {
          setSuggestions(data.suggestions);
        } else if (data.fallbackSuggestions) {
          setSuggestions(data.fallbackSuggestions);
          if (data.error) setErrorMessage(settings.language === 'en' ? data.errorEn || data.error : data.error);
        } else if (data.error) {
          setErrorMessage(settings.language === 'en' ? data.errorEn || data.error : data.error);
        }
      } else if (aiModalType === 'summary') {
        const data = await aiApi.generateSummary({
          jobTitle: resumeData.personalInfo.jobTitle || 'محترف',
          yearsOfExperience: '3-5',
          keySkills: (resumeData.skills || []).map((s) => s.name).join(', '),
          language: settings.language,
        });

        if (data.summary) {
          setSuggestions([data.summary]);
          if (data.error) setErrorMessage(settings.language === 'en' ? data.errorEn || data.error : data.error);
        } else if (data.error) {
          setErrorMessage(settings.language === 'en' ? data.errorEn || data.error : data.error);
        }
      } else if (aiModalType === 'skills') {
        const data = await aiApi.suggestSkills({
          jobTitle: resumeData.personalInfo.jobTitle || 'مهندس برمجيات',
          language: settings.language,
        });

        if (data.technicalSkills || data.softSkills || data.tools) {
          setCategorizedSkills(data);
          if (data.error) setErrorMessage(settings.language === 'en' ? data.errorEn || data.error : data.error);
        } else if (data.error) {
          setErrorMessage(settings.language === 'en' ? data.errorEn || data.error : data.error);
        }
      }
    } catch (err) {
      console.error('AI Modal error:', err);
      setErrorMessage(parseApiError(err, settings.language === 'ar'));
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
      id="ai-assistant-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAiModal();
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-modal-title"
        className="w-full max-w-lg bg-white border border-line rounded-none shadow-2xl overflow-hidden text-ink animate-in fade-in zoom-in duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-line bg-paper">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-none bg-white text-orange border border-line flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-orange" />
            </div>
            <div>
              <h3 id="ai-modal-title" className="font-tajawal font-bold text-sm text-ink">
                {aiModalType === 'summary' && (settings.language === 'ar' ? 'صياغة ملخص مهني بالذكاء الاصطناعي' : 'AI Professional Summary Generator')}
                {aiModalType === 'bullet' && (settings.language === 'ar' ? 'تحسين صياغة الإنجازات لنظام ATS' : 'AI ATS Bullet Optimizer')}
                {aiModalType === 'skills' && (settings.language === 'ar' ? 'اقتراح مهارات ذكية حسب المسمى الوظيفي' : 'AI Skill Recommender')}
              </h3>
              <p className="text-xs font-ibm-sans text-ink-soft">
                {settings.language === 'ar' ? 'توليد صياغة موثوقة ومحسنة لخوارزميات التوظيف' : 'Optimized for high ATS scanner compatibility'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAiModal}
            className="p-1 text-ink-soft hover:text-ink hover:bg-paper-2 rounded-none transition cursor-pointer"
            aria-label={settings.language === 'ar' ? 'إغلاق النافذة' : 'Close modal'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {aiModalType === 'bullet' && (
            <div>
              <label className="block font-tajawal font-bold text-ink mb-1">
                {settings.language === 'ar' ? 'أدخل النقطة الحالية أو المهام المراد تحسينها:' : 'Current bullet or task description:'}
              </label>
              <textarea
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={settings.language === 'ar' ? 'مثال: كنت مسئول عن تصميم المواقع وإدارة قاعدة البيانات' : 'e.g. Responsible for web design and database administration'}
                className="w-full p-3 bg-paper border border-line rounded-none text-ink outline-none focus:border-ink leading-relaxed font-ibm-sans text-xs"
              />
            </div>
          )}

          {aiModalType === 'summary' && (
            <p className="text-ink-soft bg-paper p-3 rounded-none border border-line font-ibm-sans">
              {settings.language === 'ar'
                ? `سيتم توليد ملخص مهني جذاب بناءً على مسمّاك الوظيفي (${resumeData.personalInfo.jobTitle || 'محترف'}) ومهاراتك المكتوبة.`
                : `A concise professional summary will be generated for your role: (${resumeData.personalInfo.jobTitle || 'Professional'}).`}
            </p>
          )}

          {aiModalType === 'skills' && (
            <p className="text-ink-soft bg-paper p-3 rounded-none border border-line font-ibm-sans">
              {settings.language === 'ar'
                ? `اقتراح المهارات المستهدفة للمسمى: ${resumeData.personalInfo.jobTitle || 'عام'}`
                : `Recommending high-demand skills for: ${resumeData.personalInfo.jobTitle || 'General'}`}
            </p>
          )}

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="p-3 bg-amber-50/70 border border-amber-300 rounded-none text-amber-950 text-xs leading-relaxed flex items-start gap-2 font-ibm-sans">
              <span className="font-bold">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Trigger Button */}
          <div>
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-2.5 bg-ink hover:bg-ink/90 text-white font-ibm-sans font-bold text-xs rounded-none border border-ink transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[38px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-orange" />
                  <span>{settings.language === 'ar' ? 'جاري المعالجة...' : 'Processing...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-orange" />
                  <span>{settings.language === 'ar' ? 'توليد الصياغة الآن' : 'Generate Suggestions Now'}</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-center text-ink-soft font-ibm-sans mt-2">
              {settings.language === 'ar'
                ? '🛡️ يعتمد على معلوماتك فقط — ولا يخترع أي خبرات وهمية.'
                : '🛡️ Uses your information only — never invents experience.'}
            </p>
          </div>

          {/* Suggestions Output */}
          {suggestions.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-line">
              <div className="p-2.5 bg-amber-50/50 border border-amber-300 rounded-none text-amber-950 text-xs font-ibm-sans leading-relaxed">
                {settings.language === 'ar'
                  ? '💡 راجع مسودة الذكاء الاصطناعي قبل اعتمادها. يمكنك تعديل أي نص بحرية.'
                  : '💡 Review the AI draft before using it. You can edit anything.'}
              </div>
              <h4 className="font-tajawal font-bold text-ink">
                {settings.language === 'ar' ? 'الاقتراحات المحسنة:' : 'Generated Suggestions:'}
              </h4>
              <div className="space-y-2">
                {suggestions.map((sug, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-paper rounded-none border border-line space-y-2"
                  >
                    <p className="text-ink font-ibm-sans leading-relaxed text-xs">{sug}</p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleApplySuggestion(sug)}
                        className="px-3 py-1 bg-ink hover:bg-ink/90 text-white rounded-none border border-ink font-ibm-sans font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5 text-orange" />
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
            <div className="space-y-3 pt-2 border-t border-line">
              <div className="p-2.5 bg-amber-50/50 border border-amber-300 rounded-none text-amber-950 text-xs font-ibm-sans leading-relaxed">
                {settings.language === 'ar'
                  ? '💡 راجع مسودة الذكاء الاصطناعي قبل اعتمادها. يمكنك تعديل أي نص بحرية.'
                  : '💡 Review the AI draft before using it. You can edit anything.'}
              </div>
              {categorizedSkills.technicalSkills && (
                <div>
                  <h4 className="font-tajawal font-bold text-ink mb-1.5">{t.techSkills}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {categorizedSkills.technicalSkills.map((sk: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleAddSuggestedSkill(sk, 'technical')}
                        className="px-2.5 py-1 bg-white hover:bg-paper text-ink border border-line rounded-none transition text-xs font-ibm-sans font-medium cursor-pointer"
                      >
                        + {sk}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {categorizedSkills.softSkills && (
                <div>
                  <h4 className="font-tajawal font-bold text-ink mb-1.5">{t.softSkills}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {categorizedSkills.softSkills.map((sk: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleAddSuggestedSkill(sk, 'soft')}
                        className="px-2.5 py-1 bg-white hover:bg-paper text-ink border border-line rounded-none transition text-xs font-ibm-sans font-medium cursor-pointer"
                      >
                        + {sk}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {categorizedSkills.tools && (
                <div>
                  <h4 className="font-tajawal font-bold text-ink mb-1.5">{t.tools}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {categorizedSkills.tools.map((sk: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => handleAddSuggestedSkill(sk, 'tool')}
                        className="px-2.5 py-1 bg-white hover:bg-paper text-ink border border-line rounded-none transition text-xs font-ibm-sans font-medium cursor-pointer"
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
