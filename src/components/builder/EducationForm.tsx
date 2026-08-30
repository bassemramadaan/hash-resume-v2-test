import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { GraduationCap, Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp, Edit3 } from 'lucide-react';
import { NextStepBanner } from './NextStepBanner';

export const EducationForm: React.FC = () => {
  const {
    resumeData,
    addEducation,
    updateEducation,
    removeEducation,
    reorderEducation,
    settings,
  } = useResumeStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';
  const educationList = resumeData.education || [];

  const [expandedId, setExpandedId] = useState<string | null>(
    educationList.length > 0 ? educationList[0].id : null
  );

  const handleAddNew = () => {
    addEducation({
      degree: '',
      institution: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gpa: '',
    });
    setTimeout(() => {
      const currentList = useResumeStore.getState().resumeData.education;
      if (currentList && currentList.length > 0) {
        setExpandedId(currentList[currentList.length - 1].id);
      }
    }, 50);
  };

  return (
    <div className="space-y-5 sm:space-y-6 text-slate-800 w-full max-w-full min-w-0 overflow-x-hidden mobile-editor-content">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-100">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#001639] flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#FF4D2D]" />
            <span>{t.tabEducation}</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            {isAr
              ? 'أضف المؤهلات الأكاديمية والدرجات العلمية'
              : 'Add your degrees and academic qualifications'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddNew}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#001639] hover:bg-[#00245E] text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer shrink-0 min-h-[42px] active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#FF4D2D]" />
          <span>{isAr ? 'إضافة مؤهل' : 'Add Education'}</span>
        </button>
      </div>

      {/* Next Action in Section */}
      <NextStepBanner
        variant="section"
        isAr={isAr}
        stepTextAr={
          educationList.length === 0
            ? 'أضف أعلى درجة علمية حصلت عليها (بكالوريوس، ماجستير، أو معهد).'
            : educationList.some((e) => !e.institution?.trim() || !e.degree?.trim())
            ? 'أكمل اسم الجامعة أو الكلية والمؤهل الدراسي.'
            : 'المؤهلات مكتملة! انتقل إلى قسم المهارات واللغات.'
        }
        stepTextEn={
          educationList.length === 0
            ? 'Add your highest academic degree or diploma.'
            : educationList.some((e) => !e.institution?.trim() || !e.degree?.trim())
            ? 'Complete university/college name and degree title.'
            : 'Education complete! Move to Skills & Languages.'
        }
        actionTextAr={educationList.length === 0 ? 'إضافة مؤهل الآن' : undefined}
        actionTextEn={educationList.length === 0 ? 'Add degree now' : undefined}
        onAction={educationList.length === 0 ? handleAddNew : undefined}
      />

      {/* Empty State */}
      {educationList.length === 0 && (
        <div className="p-7 border border-dashed border-slate-200 rounded-2xl text-center space-y-3 bg-slate-50/50">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#001639] flex items-center justify-center mx-auto shadow-2xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-semibold text-slate-900 text-xs">
              {isAr ? 'لم تقم بإضافة مؤهل تعليمي بعد' : 'No Education Entries Added Yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isAr
                ? 'أضف شهادتك الجامعية أو دراستك الأكاديمية'
                : 'Add your degree or university information'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddNew}
            className="px-4 py-2.5 bg-[#001639] hover:bg-[#00245E] text-white font-bold text-xs rounded-xl shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer min-h-[42px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? 'إضافة أول مؤهل' : 'Add First Education'}</span>
          </button>
        </div>
      )}

      {/* List with Collapsible Cards */}
      <div className="space-y-3">
        {(educationList || []).map((edu, idx) => {
          const isExpanded = expandedId === edu.id;

          return (
            <div
              key={edu.id}
              className={`border rounded-xl bg-white overflow-hidden transition-all shadow-2xs ${
                isExpanded ? 'border-[#001639] ring-1 ring-[#001639]/10' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header / Summary Card */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : edu.id)}
                className="flex items-center justify-between p-3 sm:p-3.5 cursor-pointer hover:bg-slate-50/80 transition"
                role="button"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2 rtl:pr-0 rtl:pl-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-[#001639] flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 truncate">
                    <h3 className="font-semibold text-xs text-slate-900 truncate">
                      {edu.degree || (isAr ? 'درجة علمية جديدة' : 'New Degree')}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-normal truncate">
                      {edu.institution || (isAr ? 'اسم الجامعة' : 'Institution / University')}
                      {edu.startDate || edu.endDate ? ` • ${edu.startDate || ''} - ${edu.endDate || ''}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="hidden xs:inline-flex text-[11px] font-semibold text-slate-500 px-2 py-1 bg-slate-100 rounded-md mr-1">
                    {isExpanded ? (isAr ? 'إغلاق' : 'Close') : (isAr ? 'تعديل' : 'Edit')}
                  </span>

                  {/* Reorder Buttons */}
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      reorderEducation(idx, idx - 1);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100 rounded-lg transition cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                    title={isAr ? 'تحريك للأعلى' : 'Move Up'}
                    aria-label={isAr ? 'تحريك للأعلى' : 'Move Up'}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === educationList.length - 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      reorderEducation(idx, idx + 1);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100 rounded-lg transition cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                    title={isAr ? 'تحريك للأسفل' : 'Move Down'}
                    aria-label={isAr ? 'تحريك للأسفل' : 'Move Down'}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeEducation(edu.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                    title={isAr ? 'حذف المؤهل' : 'Delete entry'}
                    aria-label={isAr ? 'حذف المؤهل' : 'Delete entry'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="p-1 text-slate-400">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Form Content */}
              {isExpanded && (
                <div className="p-4 sm:p-5 border-t border-slate-100 space-y-4 bg-slate-50/40 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Degree */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        {t.degree} <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        placeholder={isAr ? 'بكالوريوس علوم الحاسب' : 'Bachelor of Computer Science'}
                        className="w-full px-3.5 min-h-[44px] h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                      />
                    </div>

                    {/* Institution */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        {t.institution} <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                        placeholder={isAr ? 'جامعة القاهرة' : 'Cairo University'}
                        className="w-full px-3.5 min-h-[44px] h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                      />
                    </div>

                    {/* Field of Study */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">{t.fieldOfStudy}</label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy}
                        onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                        placeholder={isAr ? 'تكنولوجيا المعلومات' : 'Information Technology'}
                        className="w-full px-3.5 min-h-[44px] h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                      />
                    </div>

                    {/* GPA */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">{t.gpa}</label>
                      <input
                        type="text"
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                        placeholder="3.8 / 4.0"
                        className="w-full px-3.5 min-h-[44px] h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                      />
                    </div>

                    {/* Start Date */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">{t.startDate}</label>
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                        placeholder="09/2016"
                        className="w-full px-3.5 min-h-[44px] h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                      />
                    </div>

                    {/* End Date */}
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">{t.endDate}</label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                        placeholder="06/2020"
                        className="w-full px-3.5 min-h-[44px] h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                      />
                    </div>
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
