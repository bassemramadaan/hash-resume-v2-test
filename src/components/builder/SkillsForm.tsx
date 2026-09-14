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
    <div className="space-y-6 text-slate-800 w-full max-w-full min-w-0 overflow-x-hidden mobile-editor-content" aria-live="polite">
      {/* Skills Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 border-b pb-4 border-slate-100 w-full min-w-0">
          <div className="min-w-0 flex-1">
            <h2 className="text-sm sm:text-base font-bold text-[#001639] flex items-center gap-2 truncate">
              <Wrench className="w-4 h-4 text-[#FF4D2D] shrink-0" />
              <span className="truncate">{t.tabSkills}</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
              {isAr
                ? 'أضف المهارات التقنية والشخصية المتوافقة مع الوظيفة'
                : 'List hard and soft skills matching target job'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => openAiModal('skills')}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#001639] bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition cursor-pointer shrink-0 min-h-[38px] active:scale-95 whitespace-nowrap shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D]" />
            <span>{t.aiSuggestSkills}</span>
          </button>
        </div>

        {/* Next Action in Section */}
        <NextStepBanner
          variant="section"
          isAr={isAr}
          stepTextAr={
            skills.length < 3
              ? `أضف على الأقل ${3 - skills.length} مهارات تقنية أو أدوات أساسية لمجالك.`
              : languages.length === 0
              ? 'أضف لغاتك ومستوى إتقانك (مثل: العربية والإنجليزية).'
              : 'مهاراتك مكتملة! يمكنك إجراء فحص توافق ATS أو مراجعة وتصدير السيرة.'
          }
          stepTextEn={
            skills.length < 3
              ? `Add at least ${3 - skills.length} key technical skills or tools.`
              : languages.length === 0
              ? 'Add your spoken languages and proficiency levels.'
              : 'Skills look complete! Run an ATS scan or review and export.'
          }
        />

        {/* Add Skill Form */}
        <form onSubmit={handleAddSkillSubmit} className="space-y-3">
          {/* One-Tap Quick Skill Suggestions */}
          <div className="space-y-1.5 mb-2">
            <span className="text-[11px] font-bold text-slate-500 block">
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
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition flex items-center gap-1 cursor-pointer active:scale-95 ${
                      isAdded
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 hover:text-[#001639]'
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

          <div className="space-y-2.5">
            {/* Input Row */}
            <div className="w-full">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder={isAr ? 'مثال: React.js, Python, إدارة المشاريع' : 'e.g. React.js, Python, Management'}
                className="w-full px-3.5 h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition shadow-2xs"
              />
            </div>

            {/* Selects & Add Button Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="w-full px-3 h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs font-semibold text-slate-700 outline-none transition cursor-pointer shadow-2xs"
                >
                  <option value="technical">{t.techSkills}</option>
                  <option value="soft">{t.softSkills}</option>
                  <option value="tool">{t.tools}</option>
                </select>
              </div>

              <div>
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as any)}
                  className="w-full px-3 h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs font-semibold text-slate-700 outline-none transition cursor-pointer shadow-2xs truncate"
                >
                  <option value="">{isAr ? 'المستوى (اختياري)' : 'Level (Optional)'}</option>
                  <option value="beginner">{isAr ? 'مبتدئ' : 'Beginner'}</option>
                  <option value="intermediate">{isAr ? 'متوسط' : 'Intermediate'}</option>
                  <option value="advanced">{isAr ? 'متقدم' : 'Advanced'}</option>
                  <option value="expert">{isAr ? 'خبير' : 'Expert'}</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full h-11 bg-[#001639] hover:bg-[#00245E] text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer text-xs active:scale-95"
                >
                  <Plus className="w-4 h-4 text-[#FF4D2D] shrink-0" />
                  <span>{t.addSkill}</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Category Filter Tabs */}
        {skills.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-4 border-t border-slate-100 mt-4">
            <button
              type="button"
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-[#001639] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isAr ? `الكل (${skills.length})` : `All (${skills.length})`}
            </button>
            {techCount > 0 && (
              <button
                type="button"
                onClick={() => setFilterCategory('technical')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-2 ${
                  filterCategory === 'technical'
                    ? 'bg-blue-900 text-white shadow-2xs'
                    : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                <span>{isAr ? `تقنية (${techCount})` : `Technical (${techCount})`}</span>
              </button>
            )}
            {softCount > 0 && (
              <button
                type="button"
                onClick={() => setFilterCategory('soft')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-2 ${
                  filterCategory === 'soft'
                    ? 'bg-emerald-900 text-white shadow-2xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                <span>{isAr ? `شخصية (${softCount})` : `Soft (${softCount})`}</span>
              </button>
            )}
            {toolCount > 0 && (
              <button
                type="button"
                onClick={() => setFilterCategory('tool')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-2 ${
                  filterCategory === 'tool'
                    ? 'bg-amber-900 text-white shadow-2xs'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>{isAr ? `أدوات (${toolCount})` : `Tools (${toolCount})`}</span>
              </button>
            )}
          </div>
        )}

        {/* Skill Badges List */}
        {filteredSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2.5 pt-2 w-full min-w-0">
            {filteredSkills.map((skill, sIdx) => {
              const isTech = skill.category === 'technical';
              const isSoft = skill.category === 'soft';
              const isTool = skill.category === 'tool';

              return (
                <span
                  key={skill.id}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium shadow-2xs max-w-full min-w-0 border transition ${
                    isTech
                      ? 'bg-blue-50/70 border-blue-200 text-blue-950'
                      : isSoft
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : isTool
                      ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                      : 'bg-slate-100 border-slate-200 text-slate-800'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isTech
                        ? 'bg-blue-500'
                        : isSoft
                        ? 'bg-emerald-500'
                        : isTool
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span className="truncate max-w-[140px] sm:max-w-[200px] font-semibold">{skill.name}</span>
                  {skill.level && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/90 border border-slate-200 text-slate-700 font-bold uppercase shrink-0">
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
                    <div className="flex items-center gap-0.5 ms-1 border-s border-slate-300/80 ps-1">
                      {sIdx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveSkill(sIdx, 'prev')}
                          className="text-slate-400 hover:text-[#001639] p-0.5 transition cursor-pointer"
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
                          className="text-slate-400 hover:text-[#001639] p-0.5 transition cursor-pointer"
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
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-[#001639] flex items-center gap-2">
            <LangIcon className="w-4 h-4 text-[#FF4D2D]" />
            <span>{t.addLanguage}</span>
          </h3>
        </div>

        <form onSubmit={handleAddLangSubmit} className="space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-2 items-stretch">
            <input
              type="text"
              value={newLangName}
              onChange={(e) => setNewLangName(e.target.value)}
              placeholder={isAr ? 'مثال: العربية، الإنجليزية' : 'e.g. Arabic, English'}
              className="flex-1 min-w-0 px-3.5 h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition shadow-2xs"
            />
            <div className="flex items-center gap-2">
              <select
                value={newLangProf}
                onChange={(e) => setNewLangProf(e.target.value as any)}
                className="flex-1 sm:w-44 px-3 h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs font-semibold text-slate-700 outline-none transition cursor-pointer shadow-2xs shrink-0 truncate"
              >
                <option value="native">{t.profNative}</option>
                <option value="fluent">{t.profFluent}</option>
                <option value="advanced">{t.profAdvanced}</option>
                <option value="intermediate">{t.profIntermediate}</option>
                <option value="basic">{t.profBasic}</option>
              </select>
              <button
                type="submit"
                className="h-11 px-4 bg-[#001639] hover:bg-[#00245E] text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer text-xs active:scale-95 shrink-0 whitespace-nowrap"
              >
                <Plus className="w-4 h-4 text-[#FF4D2D] shrink-0" />
                <span>{t.addLanguage}</span>
              </button>
            </div>
          </div>
        </form>

        {languages.length > 0 && (
          <div className="flex flex-wrap gap-2.5 pt-2 w-full min-w-0">
            {(languages || []).map((lang, lIdx) => (
              <span
                key={lang.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-50 border border-slate-200 shadow-2xs max-w-full min-w-0"
              >
                <span className="font-semibold text-slate-900 truncate max-w-[130px]">{lang.language}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 shrink-0">
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
