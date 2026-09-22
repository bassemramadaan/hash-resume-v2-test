import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useUndoToastStore } from '../../store/useUndoToastStore';
import { getTranslation } from '../../i18n/translations';
import { KeywordSuggestionsPanel } from './KeywordSuggestionsPanel';
import { Wrench, Plus, Sparkles, Languages as LangIcon, X, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { NextStepBanner } from './NextStepBanner';

export const SkillsForm: React.FC = () => {
  const {
    resumeData,
    addSkill,
    removeSkill,
    reorderSkills,
    insertSkillAtIndex,
    addLanguage,
    removeLanguage,
    insertLanguageAtIndex,
    settings,
    openAiModal,
  } = useResumeStore();
  const { showUndoToast } = useUndoToastStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';
  const skills = resumeData.skills || [];
  const languages = resumeData.languages || [];

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'technical' | 'soft' | 'tool'>('technical');
  const [newSkillLevel, setNewSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert' | ''>('');

  const [newLangName, setNewLangName] = useState('');
  const [newLangProf, setNewLangProf] =
    useState<'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic'>('fluent');
  const [filterCategory, setFilterCategory] = useState<'all' | 'technical' | 'soft' | 'tool'>('all');

  const techCount = skills.filter((s) => s.category === 'technical').length;
  const softCount = skills.filter((s) => s.category === 'soft').length;
  const toolCount = skills.filter((s) => s.category === 'tool').length;

  const filteredSkills =
    filterCategory === 'all'
      ? skills
      : skills.filter((s) => s.category === filterCategory);

  const handleQuickAddSkill = (name: string, category: 'technical' | 'soft' | 'tool') => {
    if (skills.some((s) => s.name.trim().toLowerCase() === name.trim().toLowerCase())) {
      return;
    }
    addSkill({
      name: name.trim(),
      category,
    });
  };

  const handleMoveSkill = (currentIdx: number, direction: 'prev' | 'next') => {
    const targetIdx = direction === 'prev' ? currentIdx - 1 : currentIdx + 1;
    if (targetIdx < 0 || targetIdx >= skills.length) return;
    reorderSkills(currentIdx, targetIdx);
  };

  const handleDeleteSkill = (skill: any, idx: number) => {
    removeSkill(skill.id);
    showUndoToast({
      messageAr: `تم حذف مهارة "${skill.name}"`,
      messageEn: `Deleted "${skill.name}"`,
      onUndo: () => {
        insertSkillAtIndex(idx, skill);
      },
    });
  };

  const handleDeleteLanguage = (lang: any, idx: number) => {
    removeLanguage(lang.id);
    showUndoToast({
      messageAr: `تم حذف لغة "${lang.language}"`,
      messageEn: `Deleted "${lang.language}"`,
      onUndo: () => {
        insertLanguageAtIndex(idx, lang);
      },
    });
  };

  const handleAddSkillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;
    addSkill({
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel || undefined,
    });
    setNewSkillName('');
    setNewSkillLevel('');
  };

  const handleAddLangSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangName.trim()) return;
    addLanguage({
      language: newLangName.trim(),
      proficiency: newLangProf,
    });
    setNewLangName('');
  };

  return (
    <div className="space-y-5 text-slate-800 w-full max-w-full min-w-0 overflow-x-hidden mobile-editor-content" aria-live="polite">
      {/* Top AI Action Row */}
      <div className="flex items-center justify-between gap-3 pb-1">
        <span className="text-xs font-bold text-slate-700">
          {isAr ? `المهارات والقدرات (${skills.length})` : `Skills & Abilities (${skills.length})`}
        </span>
        <button
          type="button"
          onClick={() => openAiModal('skills')}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition cursor-pointer shrink-0 shadow-2xs active:scale-98"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D]" />
          <span>{t.aiSuggestSkills}</span>
        </button>
      </div>

      {/* Skills Section */}
      <div className="space-y-4">
        {/* Add Skill Form */}
        <form onSubmit={handleAddSkillSubmit} className="space-y-3 bg-slate-50/70 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          {/* One-Tap Quick Skill Suggestions */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-600 block">
              {isAr ? 'إضافة سريعة بلمسة واحدة:' : 'One-Tap Quick Add:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: isAr ? 'إدارة الوقت' : 'Time Management', cat: 'soft' as const },
                { name: isAr ? 'حل المشكلات' : 'Problem Solving', cat: 'soft' as const },
                { name: isAr ? 'القيادة والعمل الجماعي' : 'Leadership & Teamwork', cat: 'soft' as const },
                { name: isAr ? 'التواصل الفعال' : 'Communication', cat: 'soft' as const },
                { name: 'Microsoft Excel', cat: 'tool' as const },
                { name: 'Git & GitHub', cat: 'tool' as const },
              ].map((item) => {
                const isAdded = skills.some(
                  (s) => s.name.trim().toLowerCase() === item.name.trim().toLowerCase()
                );
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleQuickAddSkill(item.name, item.cat)}
                    disabled={isAdded}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition flex items-center gap-1 cursor-pointer border ${
                      isAdded
                        ? 'bg-slate-100 text-slate-400 border-slate-200 opacity-60 cursor-default'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-2xs'
                    }`}
                  >
                    {isAdded ? (
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                    ) : (
                      <Plus className="w-3 h-3 text-[#FF4D2D] shrink-0" />
                    )}
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2.5 pt-1">
            {/* Direct Input & Add Button */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder={isAr ? 'مثال: React, Python, إدارة المشاريع، SQL...' : 'e.g., React, Python, Project Management, SQL...'}
                className="flex-1 px-4 h-12 bg-white hover:border-slate-300 focus:bg-white border-2 border-slate-200 focus:border-[#FF4D2D] focus:ring-4 focus:ring-[#FF4D2D]/10 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition shadow-2xs"
              />

              <button
                type="submit"
                className="h-12 px-6 bg-[#001639] hover:bg-[#00214F] text-white font-bold rounded-2xl transition flex items-center justify-center gap-2 cursor-pointer text-sm shadow-2xs active:scale-98 shrink-0"
              >
                <Plus className="w-4 h-4 text-[#FF4D2D] shrink-0" />
                <span>{isAr ? 'إضافة المهارة' : 'Add Skill'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 px-1">
              {isAr
                ? '💡 معيار ATS الاحترافي: أنظمة الفرز تبحث عن الكلمات المفتاحية للمهارة مجردة دون نسب مئوية أو مستويات تقييمية.'
                : '💡 ATS Best Practice: Recruiters and scanners match direct skill keywords without arbitrary skill percentages or levels.'}
            </p>
          </div>
        </form>

        {/* Category Filter Tabs */}
        {skills.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-1">
            <button
              type="button"
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer border ${
                filterCategory === 'all'
                  ? 'bg-[#001639] text-white border-[#001639] shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isAr ? `الكل (${skills.length})` : `All (${skills.length})`}
            </button>
            {techCount > 0 && (
              <button
                type="button"
                onClick={() => setFilterCategory('technical')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                  filterCategory === 'technical'
                    ? 'bg-[#001639] text-white border-[#001639] shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#FF4D2D] shrink-0" />
                <span>{isAr ? `تقنية (${techCount})` : `Technical (${techCount})`}</span>
              </button>
            )}
            {softCount > 0 && (
              <button
                type="button"
                onClick={() => setFilterCategory('soft')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                  filterCategory === 'soft'
                    ? 'bg-[#001639] text-white border-[#001639] shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span>{isAr ? `شخصية (${softCount})` : `Soft (${softCount})`}</span>
              </button>
            )}
            {toolCount > 0 && (
              <button
                type="button"
                onClick={() => setFilterCategory('tool')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                  filterCategory === 'tool'
                    ? 'bg-[#001639] text-white border-[#001639] shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span>{isAr ? `أدوات (${toolCount})` : `Tools (${toolCount})`}</span>
              </button>
            )}
          </div>
        )}

        {/* Skill Badges List */}
        {filteredSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1 w-full min-w-0">
            {filteredSkills.map((skill, sIdx) => {
              const isTech = skill.category === 'technical';
              const isSoft = skill.category === 'soft';
              const isTool = skill.category === 'tool';

              return (
                <span
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium max-w-full min-w-0 border border-slate-200/90 bg-white hover:border-slate-300 transition shadow-2xs"
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isTech
                        ? 'bg-[#FF4D2D]'
                        : isSoft
                        ? 'bg-emerald-500'
                        : isTool
                        ? 'bg-blue-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span className="truncate max-w-[140px] sm:max-w-[200px] font-semibold text-slate-800">{skill.name}</span>
                  {skill.level && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold uppercase shrink-0">
                      {isAr
                        ? skill.level === 'beginner'
                          ? 'مبتدئ'
                          : skill.level === 'intermediate'
                          ? 'متوسط'
                          : skill.level === 'advanced'
                          ? 'متقدم'
                          : 'خبير'
                        : skill.level}
                    </span>
                  )}
                  {filterCategory === 'all' && (
                    <div className="flex items-center gap-0.5 ms-1 border-s border-slate-200 ps-1">
                      {sIdx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveSkill(sIdx, 'prev')}
                          className="text-slate-400 hover:text-slate-700 p-0.5 transition cursor-pointer"
                          title={isAr ? 'تحريك للأمام' : 'Move up/earlier'}
                          aria-label={isAr ? 'تحريك للأمام' : 'Move up'}
                        >
                          {isAr ? <ArrowRight className="w-3 h-3" /> : <ArrowLeft className="w-3 h-3" />}
                        </button>
                      )}
                      {sIdx < skills.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMoveSkill(sIdx, 'next')}
                          className="text-slate-400 hover:text-slate-700 p-0.5 transition cursor-pointer"
                          title={isAr ? 'تحريك للخلف' : 'Move down/later'}
                          aria-label={isAr ? 'تحريك للخلف' : 'Move down'}
                        >
                          {isAr ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(skill, sIdx)}
                    className="text-slate-400 hover:text-rose-600 transition cursor-pointer p-0.5 shrink-0 ms-0.5"
                    aria-label={isAr ? `حذف مهارة ${skill.name}` : `Remove ${skill.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-500 font-medium pt-1">
            {skills.length === 0
              ? (isAr ? 'لم يتم إضافة مهارات بعد.' : 'No skills added yet.')
              : (isAr ? 'لا توجد مهارات مطابقة لهذا التصنيف.' : 'No skills in this category.')}
          </p>
        )}

        {/* Industry Domain Keywords Suggestions Panel */}
        <div className="pt-2">
          <KeywordSuggestionsPanel />
        </div>
      </div>

      {/* Languages Section */}
      <div className="space-y-3 pt-4 border-t border-slate-200/80">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <LangIcon className="w-4 h-4 text-[#FF4D2D]" />
            <span>{t.addLanguage}</span>
          </h3>
          {languages.length > 0 && (
            <span className="text-xs text-slate-400 font-medium">({languages.length})</span>
          )}
        </div>

        <form onSubmit={handleAddLangSubmit} className="space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-2 items-stretch">
            <input
              type="text"
              value={newLangName}
              onChange={(e) => setNewLangName(e.target.value)}
              placeholder={isAr ? 'مثال: العربية، الإنجليزية' : 'e.g. Arabic, English'}
              className="flex-1 min-w-0 px-3.5 h-11 bg-white hover:border-slate-300 focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-xl text-sm font-ibm-sans text-slate-900 placeholder:text-slate-400 outline-none transition shadow-2xs"
            />
            <div className="flex items-center gap-2">
              <select
                value={newLangProf}
                onChange={(e) => setNewLangProf(e.target.value as any)}
                className="flex-1 sm:w-44 px-3 h-11 bg-white hover:border-slate-300 focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-xl text-xs font-semibold text-slate-700 outline-none transition cursor-pointer shrink-0 truncate shadow-2xs"
              >
                <option value="native">{t.profNative}</option>
                <option value="fluent">{t.profFluent}</option>
                <option value="advanced">{t.profAdvanced}</option>
                <option value="intermediate">{t.profIntermediate}</option>
                <option value="basic">{t.profBasic}</option>
              </select>
              <button
                type="submit"
                className="h-11 px-4 bg-[#001639] hover:bg-slate-800 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer text-xs shrink-0 whitespace-nowrap shadow-2xs active:scale-98"
              >
                <Plus className="w-4 h-4 text-[#FF4D2D] shrink-0" />
                <span>{t.addLanguage}</span>
              </button>
            </div>
          </div>
        </form>

        {languages.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 w-full min-w-0">
            {(languages || []).map((lang, lIdx) => (
              <span
                key={lang.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-slate-200/90 max-w-full min-w-0 shadow-2xs"
              >
                <span className="font-semibold text-slate-800 truncate max-w-[130px]">{lang.language}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                  {lang.proficiency}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteLanguage(lang, lIdx)}
                  className="text-slate-400 hover:text-rose-600 transition cursor-pointer p-0.5 shrink-0"
                  aria-label={isAr ? `حذف لغة ${lang.language}` : `Remove ${lang.language}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
