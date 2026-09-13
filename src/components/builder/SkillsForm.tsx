import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useUndoToastStore } from '../../store/useUndoToastStore';
import { getTranslation } from '../../i18n/translations';
import { KeywordSuggestionsPanel } from './KeywordSuggestionsPanel';
import { Wrench, Plus, Sparkles, Languages as LangIcon, X } from 'lucide-react';
import { NextStepBanner } from './NextStepBanner';

export const SkillsForm: React.FC = () => {
  const {
    resumeData,
    addSkill,
    removeSkill,
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
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 border-b pb-3.5 border-slate-100 w-full min-w-0">
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
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#001639] bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition cursor-pointer shrink-0 min-h-[36px] active:scale-95"
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
        <form onSubmit={handleAddSkillSubmit} className="space-y-2.5">
          {/* Quick Suggestions (Tap vs Type) */}
          <div className="flex flex-wrap gap-2 mb-2">
            {[
              isAr ? 'إدارة الوقت' : 'Time Management',
              isAr ? 'حل المشكلات' : 'Problem Solving',
              isAr ? 'القيادة' : 'Leadership',
              isAr ? 'التواصل' : 'Communication',
              'Microsoft Office',
            ].map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => {
                  setNewSkillName(skill);
                  setNewSkillCategory(skill === 'Microsoft Office' ? 'tool' : 'soft');
                }}
                className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition cursor-pointer active:scale-95"
              >
                + {skill}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-5">
              <input
                type="text"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                placeholder={isAr ? 'مثال: React.js, Python, إدارة المشاريع' : 'e.g. React.js, Python, Management'}
                className="w-full px-3.5 min-h-[42px] h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-2 sm:contents gap-2 sm:gap-0">
              <div className="sm:col-span-3">
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value as any)}
                  className="w-full px-2.5 sm:px-3 min-h-[42px] h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs font-semibold text-slate-700 outline-none transition cursor-pointer"
                >
                  <option value="technical">{t.techSkills}</option>
                  <option value="soft">{t.softSkills}</option>
                  <option value="tool">{t.tools}</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <select
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value as any)}
                  className="w-full px-2.5 sm:px-3 min-h-[42px] h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs font-semibold text-slate-700 outline-none transition cursor-pointer truncate"
                >
                  <option value="">{isAr ? 'المستوى (اختياري)' : 'Level (Optional)'}</option>
                  <option value="beginner">{isAr ? 'مبتدئ' : 'Beginner'}</option>
                  <option value="intermediate">{isAr ? 'متوسط' : 'Intermediate'}</option>
                  <option value="advanced">{isAr ? 'متقدم' : 'Advanced'}</option>
                  <option value="expert">{isAr ? 'خبير' : 'Expert'}</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full min-h-[42px] h-10 sm:h-11 bg-[#001639] hover:bg-[#00245E] text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer text-xs active:scale-95"
              >
                <Plus className="w-4 h-4 text-[#FF4D2D]" />
                <span>{t.addSkill}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Category Filter Tabs */}
        {skills.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pt-1">
            <button
              type="button"
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer ${
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
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  filterCategory === 'technical'
                    ? 'bg-blue-900 text-white shadow-2xs'
                    : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                <span>{isAr ? `تقنية (${techCount})` : `Technical (${techCount})`}</span>
              </button>
            )}
            {softCount > 0 && (
              <button
                type="button"
                onClick={() => setFilterCategory('soft')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  filterCategory === 'soft'
                    ? 'bg-emerald-900 text-white shadow-2xs'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>{isAr ? `شخصية (${softCount})` : `Soft (${softCount})`}</span>
              </button>
            )}
            {toolCount > 0 && (
              <button
                type="button"
                onClick={() => setFilterCategory('tool')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  filterCategory === 'tool'
                    ? 'bg-amber-900 text-white shadow-2xs'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
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
                  <button
                    type="button"
                    onClick={() => handleDeleteSkill(skill, sIdx)}
                    className="text-slate-400 hover:text-rose-600 transition cursor-pointer p-0.5 shrink-0"
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
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            <div className="sm:col-span-6">
              <input
                type="text"
                value={newLangName}
                onChange={(e) => setNewLangName(e.target.value)}
                placeholder={isAr ? 'العربية / الإنجليزية' : 'Arabic / English'}
                className="w-full px-3.5 min-h-[42px] h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
              />
            </div>
            <div className="grid grid-cols-2 sm:contents gap-2 sm:gap-0">
              <div className="sm:col-span-3">
                <select
                  value={newLangProf}
                  onChange={(e) => setNewLangProf(e.target.value as any)}
                  className="w-full px-2.5 sm:px-3 min-h-[42px] h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs font-semibold text-slate-700 outline-none transition cursor-pointer truncate"
                >
                  <option value="native">{t.profNative}</option>
                  <option value="fluent">{t.profFluent}</option>
                  <option value="advanced">{t.profAdvanced}</option>
                  <option value="intermediate">{t.profIntermediate}</option>
                  <option value="basic">{t.profBasic}</option>
                </select>
              </div>
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full min-h-[42px] h-10 sm:h-11 bg-[#001639] hover:bg-[#00245E] text-white font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer text-xs active:scale-95"
                >
                  <Plus className="w-4 h-4 text-[#FF4D2D]" />
                  <span>{t.addLanguage}</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {languages.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 w-full min-w-0">
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
