import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { KeywordSuggestionsPanel } from './KeywordSuggestionsPanel';
import { Wrench, Plus, Sparkles, Languages as LangIcon, X } from 'lucide-react';
import { NextStepBanner } from './NextStepBanner';

export const SkillsForm: React.FC = () => {
  const {
    resumeData,
    addSkill,
    removeSkill,
    addLanguage,
    removeLanguage,
    settings,
    openAiModal,
  } = useResumeStore();
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3.5 border-slate-100">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-[#001639] flex items-center gap-2">
              <Wrench className="w-4 h-4 text-[#FF4D2D]" />
              <span>{t.tabSkills}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isAr
                ? 'أضف المهارات التقنية والشخصية المتوافقة مع الوظيفة'
                : 'List hard and soft skills matching target job'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => openAiModal('skills')}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#001639] bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition cursor-pointer shrink-0 self-start sm:self-auto min-h-[36px]"
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
        <form onSubmit={handleAddSkillSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <div className="sm:col-span-5">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder={isAr ? 'مثال: React.js, Python, إدارة المشاريع' : 'e.g. React.js, Python, Management'}
              className="w-full px-3.5 min-h-[44px] h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
            />
          </div>
          <div className="sm:col-span-3">
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value as any)}
              className="w-full px-3 min-h-[44px] h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs font-medium text-slate-700 outline-none transition cursor-pointer"
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
              className="w-full px-3 min-h-[44px] h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs font-medium text-slate-700 outline-none transition cursor-pointer"
            >
              <option value="">{isAr ? 'المستوى (اختياري)' : 'Level (Optional)'}</option>
              <option value="beginner">{isAr ? 'مبتدئ' : 'Beginner'}</option>
              <option value="intermediate">{isAr ? 'متوسط' : 'Intermediate'}</option>
              <option value="advanced">{isAr ? 'متقدم' : 'Advanced'}</option>
              <option value="expert">{isAr ? 'خبير' : 'Expert'}</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full min-h-[44px] h-11 bg-[#001639] hover:bg-[#00245E] text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer text-xs active:scale-95"
            >
              <Plus className="w-4 h-4 text-[#FF4D2D]" />
              <span>{t.addSkill}</span>
            </button>
          </div>
        </form>

        {/* Skill Badges List */}
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {(skills || []).map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs"
              >
                <span>{skill.name}</span>
                {skill.level && (
                  <span className="text-[10px] px-1 py-0.5 rounded-sm bg-slate-200 text-slate-600 font-bold uppercase scale-90">
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
                  onClick={() => removeSkill(skill.id)}
                  className="text-slate-400 hover:text-rose-600 transition cursor-pointer p-0.5"
                  aria-label={isAr ? `حذف مهارة ${skill.name}` : `Remove ${skill.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 pt-1">
            {isAr ? 'لم يتم إضافة مهارات بعد.' : 'No skills added yet.'}
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

        <form onSubmit={handleAddLangSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <div className="sm:col-span-6">
            <input
              type="text"
              value={newLangName}
              onChange={(e) => setNewLangName(e.target.value)}
              placeholder={isAr ? 'العربية / الإنجليزية' : 'Arabic / English'}
              className="w-full px-3.5 h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
            />
          </div>
          <div className="sm:col-span-3">
            <select
              value={newLangProf}
              onChange={(e) => setNewLangProf(e.target.value as any)}
              className="w-full px-3 h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs font-medium text-slate-700 outline-none transition cursor-pointer"
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
              className="w-full h-10 sm:h-11 bg-[#001639] hover:bg-[#00245E] text-white font-semibold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addLanguage}</span>
            </button>
          </div>
        </form>

        {languages.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {(languages || []).map((lang) => (
              <span
                key={lang.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs"
              >
                <span>
                  {lang.language} ({lang.proficiency})
                </span>
                <button
                  type="button"
                  onClick={() => removeLanguage(lang.id)}
                  className="text-slate-400 hover:text-rose-600 transition cursor-pointer p-0.5"
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
