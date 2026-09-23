import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useResumeStore } from '../../../store/useResumeStore';
import { useUndoToastStore } from '../../../store/useUndoToastStore';
import { getTranslation } from '../../../i18n/translations';
import { CertificationsForm } from '../../builder/CertificationsForm';
import { ProjectsForm } from '../../builder/ProjectsForm';
import {
  Award,
  FolderGit2,
  Languages as LangIcon,
  CheckSquare,
  Square,
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Check,
  Sparkles,
} from 'lucide-react';

interface ExtrasStepProps {
  onNextMainStep: () => void;
  onPrevMainStep: () => void;
  isAr?: boolean;
}

type ExtraSection = 'certs' | 'projects' | 'languages';

export const ExtrasStep: React.FC<ExtrasStepProps> = ({
  onNextMainStep,
  onPrevMainStep,
  isAr = true,
}) => {
  const {
    resumeData,
    settings,
    addLanguage,
    removeLanguage,
    insertLanguageAtIndex,
  } = useResumeStore();
  const { showUndoToast } = useUndoToastStore();
  const t = getTranslation(settings?.language || 'ar');

  const certsCount = resumeData.certifications?.length || 0;
  const projectsCount = resumeData.projects?.length || 0;
  const languages = resumeData.languages || [];

  // Initialize selected extras based on existing data
  const [selectedExtras, setSelectedExtras] = useState<Set<ExtraSection>>(() => {
    const initial = new Set<ExtraSection>();
    if (certsCount > 0) initial.add('certs');
    if (projectsCount > 0) initial.add('projects');
    if (languages.length > 0) initial.add('languages');
    return initial;
  });

  // Languages form local state
  const [newLangName, setNewLangName] = useState('');
  const [newLangProf, setNewLangProf] = useState<'native' | 'fluent' | 'advanced' | 'intermediate' | 'basic'>('fluent');

  const toggleSection = (section: ExtraSection) => {
    setSelectedExtras((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const handleAddLanguageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangName.trim()) return;
    addLanguage({
      language: newLangName.trim(),
      proficiency: newLangProf,
    });
    setNewLangName('');
  };

  const handleDeleteLanguage = (lang: any, idx: number) => {
    removeLanguage(lang.id);
    showUndoToast({
      messageAr: `تم حذف لغة "${lang.language || lang.name}"`,
      messageEn: `Deleted "${lang.language || lang.name}"`,
      onUndo: () => {
        insertLanguageAtIndex(idx, lang);
      },
    });
  };

  const getProficiencyLabel = (prof: string) => {
    switch (prof) {
      case 'native':
        return isAr ? 'اللغة الأم' : 'Native';
      case 'fluent':
        return isAr ? 'طلاقة تامة' : 'Fluent';
      case 'advanced':
        return isAr ? 'متقدم' : 'Advanced';
      case 'intermediate':
        return isAr ? 'متوسط' : 'Intermediate';
      case 'basic':
        return isAr ? 'مبتدئ' : 'Basic';
      default:
        return prof;
    }
  };

  return (
    <motion.div
      key="step-extras"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="w-full max-w-xl mx-auto space-y-6"
    >
      {/* Header */}
      <div>
        <span className="text-[11px] sm:text-sm font-bold tracking-wide text-[#FF4D2D] block mb-1">
          {isAr ? 'الخطوة 04: إضافات مميزة (اختيارية)' : 'Step 04: Extras & Achievements (Optional)'}
        </span>
        <h2 className="text-xl sm:text-3xl font-black text-[#001639] tracking-tight mb-1.5 sm:mb-2">
          {isAr ? 'عايز تضيف حاجة من دول؟' : 'Would you like to add any of these?'}
        </h2>
        <p className="text-xs sm:text-sm text-[#7a8093] leading-relaxed">
          {isAr
            ? 'حدد الأقسام التي ترغب في إبرازها، أو اضغط "متابعة" مباشرة إذا لم تكن بحاجة إليها.'
            : 'Select any sections you want to include, or simply continue to the next step.'}
        </p>
      </div>

      {/* 3 Selection Chips / Checklist Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* 1. Certifications */}
        <button
          type="button"
          onClick={() => toggleSection('certs')}
          className={`p-3.5 rounded-2xl border-2 text-start transition-all cursor-pointer flex flex-col justify-between ${
            selectedExtras.has('certs')
              ? 'bg-[#001639] text-white border-[#001639] shadow-sm'
              : 'bg-white text-[#001639] border-[#e8e5de] hover:border-[#FF4D2D]/40'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                selectedExtras.has('certs') ? 'bg-white/10 text-white' : 'bg-[#FF4D2D]/10 text-[#FF4D2D]'
              }`}
            >
              <Award className="w-4 h-4" />
            </div>
            {selectedExtras.has('certs') ? (
              <CheckSquare className="w-5 h-5 text-[#FF4D2D]" />
            ) : (
              <Square className="w-5 h-5 text-[#d6d2c4]" />
            )}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold">
              {isAr ? 'شهادات معتمدة' : 'Certifications'}
            </h4>
            <span
              className={`text-[11px] block mt-0.5 ${
                selectedExtras.has('certs') ? 'text-slate-300' : 'text-[#7a8093]'
              }`}
            >
              {certsCount > 0 ? (isAr ? `${certsCount} مضافة` : `${certsCount} added`) : isAr ? 'دورات مهنية' : 'Credentials'}
            </span>
          </div>
        </button>

        {/* 2. Projects */}
        <button
          type="button"
          onClick={() => toggleSection('projects')}
          className={`p-3.5 rounded-2xl border-2 text-start transition-all cursor-pointer flex flex-col justify-between ${
            selectedExtras.has('projects')
              ? 'bg-[#001639] text-white border-[#001639] shadow-sm'
              : 'bg-white text-[#001639] border-[#e8e5de] hover:border-[#FF4D2D]/40'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                selectedExtras.has('projects') ? 'bg-white/10 text-white' : 'bg-[#FF4D2D]/10 text-[#FF4D2D]'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
            </div>
            {selectedExtras.has('projects') ? (
              <CheckSquare className="w-5 h-5 text-[#FF4D2D]" />
            ) : (
              <Square className="w-5 h-5 text-[#d6d2c4]" />
            )}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold">
              {isAr ? 'مشاريع عملية' : 'Projects'}
            </h4>
            <span
              className={`text-[11px] block mt-0.5 ${
                selectedExtras.has('projects') ? 'text-slate-300' : 'text-[#7a8093]'
              }`}
            >
              {projectsCount > 0 ? (isAr ? `${projectsCount} مضافة` : `${projectsCount} added`) : isAr ? 'أعمال سابقة' : 'Portfolio'}
            </span>
          </div>
        </button>

        {/* 3. Additional Languages */}
        <button
          type="button"
          onClick={() => toggleSection('languages')}
          className={`p-3.5 rounded-2xl border-2 text-start transition-all cursor-pointer flex flex-col justify-between ${
            selectedExtras.has('languages')
              ? 'bg-[#001639] text-white border-[#001639] shadow-sm'
              : 'bg-white text-[#001639] border-[#e8e5de] hover:border-[#FF4D2D]/40'
          }`}
        >
          <div className="flex items-center justify-between w-full mb-2">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                selectedExtras.has('languages') ? 'bg-white/10 text-white' : 'bg-[#FF4D2D]/10 text-[#FF4D2D]'
              }`}
            >
              <LangIcon className="w-4 h-4" />
            </div>
            {selectedExtras.has('languages') ? (
              <CheckSquare className="w-5 h-5 text-[#FF4D2D]" />
            ) : (
              <Square className="w-5 h-5 text-[#d6d2c4]" />
            )}
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold">
              {isAr ? 'لغات إضافية' : 'Languages'}
            </h4>
            <span
              className={`text-[11px] block mt-0.5 ${
                selectedExtras.has('languages') ? 'text-slate-300' : 'text-[#7a8093]'
              }`}
            >
              {languages.length > 0 ? (isAr ? `${languages.length} مضافة` : `${languages.length} added`) : isAr ? 'مستوى الإتقان' : 'Fluency'}
            </span>
          </div>
        </button>
      </div>

      {/* When none selected, show empty reassurance banner */}
      {selectedExtras.size === 0 && (
        <div className="p-4 sm:p-5 bg-white border border-[#e8e5de] rounded-2xl text-center space-y-1.5">
          <p className="text-xs font-bold text-[#001639]">
            {isAr
              ? '✓ لم يتم تحديد أي أقسام إضافية — يمكنك المتابعة مباشرة للتحميل والتنسيق.'
              : '✓ No extra sections selected — you can proceed straight to design & download.'}
          </p>
          <p className="text-[11px] text-[#7a8093]">
            {isAr
              ? 'هذه الأقسام اختيارية 100% ولا تؤثر على اكتمال سيرتك الذاتية الأساسية.'
              : 'These sections are completely optional and not required for a complete resume.'}
          </p>
        </div>
      )}

      {/* Selected Forms Container */}
      <div className="space-y-6 pt-1">
        {/* 1. Certifications Form (if selected) */}
        {selectedExtras.has('certs') && (
          <div className="p-4 sm:p-5 bg-white border border-[#e8e5de] rounded-2xl space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#e8e5de]">
              <div className="w-7 h-7 rounded-lg bg-[#FF4D2D]/10 text-[#FF4D2D] flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#001639]">
                {isAr ? 'الشهادات والدورات المهنية' : 'Certifications & Courses'}
              </h3>
            </div>
            <CertificationsForm />
          </div>
        )}

        {/* 2. Projects Form (if selected) */}
        {selectedExtras.has('projects') && (
          <div className="p-4 sm:p-5 bg-white border border-[#e8e5de] rounded-2xl space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#e8e5de]">
              <div className="w-7 h-7 rounded-lg bg-[#FF4D2D]/10 text-[#FF4D2D] flex items-center justify-center">
                <FolderGit2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#001639]">
                {isAr ? 'المشاريع العملية والنماذج' : 'Notable Projects'}
              </h3>
            </div>
            <ProjectsForm />
          </div>
        )}

        {/* 3. Languages Form (if selected) */}
        {selectedExtras.has('languages') && (
          <div className="p-4 sm:p-5 bg-white border border-[#e8e5de] rounded-2xl space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#e8e5de]">
              <div className="w-7 h-7 rounded-lg bg-[#FF4D2D]/10 text-[#FF4D2D] flex items-center justify-center">
                <LangIcon className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#001639]">
                {isAr ? 'اللغات ومستوى الإتقان' : 'Languages & Proficiency'}
              </h3>
            </div>

            <form onSubmit={handleAddLanguageSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newLangName}
                  onChange={(e) => setNewLangName(e.target.value)}
                  placeholder={isAr ? 'اسم اللغة (مثال: الإنجليزية، الألمانية)' : 'Language (e.g. English, German)'}
                  className="flex-1 px-3.5 py-2.5 bg-white border border-[#e8e5de] focus:border-[#FF4D2D] rounded-xl text-xs sm:text-sm outline-hidden"
                />
                <div className="flex items-center gap-2">
                  <select
                    value={newLangProf}
                    onChange={(e) => setNewLangProf(e.target.value as any)}
                    className="flex-1 sm:w-40 px-3 py-2.5 bg-white border border-[#e8e5de] focus:border-[#FF4D2D] rounded-xl text-xs font-semibold text-[#001639] outline-hidden cursor-pointer"
                  >
                    <option value="native">{isAr ? 'اللغة الأم' : 'Native'}</option>
                    <option value="fluent">{isAr ? 'طلاقة تامة' : 'Fluent'}</option>
                    <option value="advanced">{isAr ? 'متقدم' : 'Advanced'}</option>
                    <option value="intermediate">{isAr ? 'متوسط' : 'Intermediate'}</option>
                    <option value="basic">{isAr ? 'مبتدئ' : 'Basic'}</option>
                  </select>
                  <button
                    type="submit"
                    className="py-2.5 px-4 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#FF4D2D]" />
                    <span>{isAr ? 'إضافة' : 'Add'}</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Added Languages Chips */}
            {languages.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {languages.map((lang, lIdx) => (
                  <span
                    key={lang.id || lIdx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f4f1e9] border border-[#e8e5de] rounded-xl text-xs text-[#001639] font-medium"
                  >
                    <span className="font-bold">{lang.language}</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-white text-[#7a8093] rounded-md font-semibold">
                      {getProficiencyLabel(lang.proficiency)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteLanguage(lang, lIdx)}
                      className="text-[#7a8093] hover:text-red-600 transition cursor-pointer p-0.5"
                      title={isAr ? 'حذف اللغة' : 'Delete language'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <div className="pt-3 sm:pt-4 border-t border-[#e8e5de] flex items-center justify-between gap-2.5 sm:gap-3 sticky bottom-0 bg-white/95 backdrop-blur-xs py-3 z-10">
        <button
          type="button"
          onClick={onPrevMainStep}
          className="py-3 sm:py-3.5 px-4 sm:px-5 bg-white border-2 border-[#e8e5de] text-[#001639] hover:bg-[#f4f1e9] font-bold text-xs sm:text-sm rounded-xl sm:rounded-2xl transition cursor-pointer shrink-0"
        >
          {isAr ? 'السابق' : 'Back'}
        </button>

        <button
          type="button"
          onClick={onNextMainStep}
          className="btn-folded-corner flex-1 max-w-sm py-3 sm:py-3.5 px-4 sm:px-6 bg-[#001639] hover:bg-[#00214F] text-white font-bold text-xs sm:text-base rounded-xl sm:rounded-2xl shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer"
        >
          <span className="truncate">
            {isAr ? 'متابعة إلى المظهر والتحميل' : 'Continue to Design & Export'}
          </span>
          {isAr ? (
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          ) : (
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          )}
        </button>
      </div>
    </motion.div>
  );
};
