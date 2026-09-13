import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useUndoToastStore } from '../../store/useUndoToastStore';
import { getTranslation } from '../../i18n/translations';
import { GraduationCap, Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp, Calendar, School, Award, Check } from 'lucide-react';
import { NextStepBanner } from './NextStepBanner';

export const EducationForm: React.FC = () => {
  const {
    resumeData,
    addEducation,
    updateEducation,
    removeEducation,
    insertEducationAtIndex,
    reorderEducation,
    settings,
  } = useResumeStore();
  const { showUndoToast } = useUndoToastStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';
  const educationList = resumeData.education || [];

  const [expandedId, setExpandedId] = useState<string | null>(
    educationList.length > 0 ? educationList[0].id : null
  );

  const degreePresets = isAr
    ? ['بكالوريوس', 'ماجستير', 'دبلوم عالي', 'ثانوية عامة', 'دكتوراه']
    : ["Bachelor's", "Master's", 'Diploma', 'High School', 'PhD'];

  const handleDeleteEducation = (edu: any, idx: number) => {
    removeEducation(edu.id);
    showUndoToast({
      messageAr: edu.degree ? `تم حذف مؤهل "${edu.degree}"` : 'تم حذف المؤهل التعليمي',
      messageEn: edu.degree ? `Deleted "${edu.degree}"` : 'Education entry deleted',
      onUndo: () => {
        insertEducationAtIndex(idx, edu);
        setExpandedId(edu.id);
      },
    });
  };

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
    <div className="space-y-4 sm:space-y-5 text-slate-800 w-full max-w-full min-w-0 overflow-x-hidden mobile-editor-content">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b pb-3 border-slate-100 w-full min-w-0">
        <div className="min-w-0 flex-1">
          <h2 className="text-sm sm:text-base font-bold text-[#001639] flex items-center gap-2 truncate">
            <GraduationCap className="w-4 h-4 text-[#FF4D2D] shrink-0" />
            <span className="truncate">{t.tabEducation}</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
            {isAr
              ? 'أضف المؤهلات الأكاديمية والدرجات العلمية بترتيب زمني'
              : 'Add degrees and academic qualifications in order'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddNew}
          className="inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-[#001639] hover:bg-[#00245E] text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer shrink-0 min-h-[38px] active:scale-95"
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
            : 'المؤهلات مكتملة! يمكنك الانتقال لقسم المهارات.'
        }
        stepTextEn={
          educationList.length === 0
            ? 'Add your highest academic degree or diploma.'
            : educationList.some((e) => !e.institution?.trim() || !e.degree?.trim())
            ? 'Complete university/college name and degree title.'
            : 'Education complete! Move on to Skills section.'
        }
        actionTextAr={educationList.length === 0 ? 'إضافة مؤهل الآن' : undefined}
        actionTextEn={educationList.length === 0 ? 'Add degree now' : undefined}
        onAction={educationList.length === 0 ? handleAddNew : undefined}
      />

      {/* Empty State */}
      {educationList.length === 0 && (
        <div className="p-6 sm:p-8 border border-dashed border-slate-200 rounded-2xl text-center space-y-3 bg-slate-50/50">
          <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 text-[#001639] flex items-center justify-center mx-auto shadow-2xs">
            <GraduationCap className="w-5 h-5 text-[#FF4D2D]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
              {isAr ? 'لم تقم بإضافة مؤهل تعليمي بعد' : 'No Education Entries Added Yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
              {isAr
                ? 'أضف شهادتك الجامعية، كليتك أو مدرستك لتعزيز قوة سيرتك الذاتية.'
                : 'Add university, college, or diploma to strengthen your profile.'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddNew}
            className="px-4 py-2 bg-[#001639] hover:bg-[#00245E] text-white font-bold text-xs rounded-xl shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer min-h-[40px] active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF4D2D]" />
            <span>{isAr ? 'إضافة أول مؤهل' : 'Add First Education'}</span>
          </button>
        </div>
      )}

      {/* List with Collapsible Cards */}
      <div className="space-y-2.5 sm:space-y-3">
        {(educationList || []).map((edu, idx) => {
          const isExpanded = expandedId === edu.id;
          const isCurrentlyStudying =
            edu.endDate === (isAr ? 'حالي' : 'Present') ||
            edu.endDate?.toLowerCase() === 'present' ||
            edu.endDate === 'حالي';

          return (
            <div
              key={edu.id}
              className={`border rounded-2xl bg-white overflow-hidden transition-all shadow-2xs ${
                isExpanded ? 'border-[#001639] ring-1 ring-[#001639]/10' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header / Summary Card */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : edu.id)}
                className="flex items-center justify-between p-3 sm:p-3.5 cursor-pointer hover:bg-slate-50/80 transition gap-2 w-full min-w-0"
                role="button"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-[#001639] flex items-center justify-center text-xs font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <h3 className="font-bold text-xs text-slate-900 truncate">
                      {edu.degree || (isAr ? 'درجة علمية جديدة' : 'New Degree')}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      {edu.institution || (isAr ? 'اسم الجامعة أو الكلية' : 'Institution / University')}
                      {edu.startDate || edu.endDate ? ` • ${edu.startDate || ''} - ${edu.endDate || ''}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="hidden xs:inline-flex text-[11px] font-semibold text-slate-600 px-2 py-0.5 bg-slate-100 rounded-md">
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
                    className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 hover:bg-slate-100 rounded-lg transition cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
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
                    className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-20 hover:bg-slate-100 rounded-lg transition cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
                    title={isAr ? 'تحريك للأسفل' : 'Move Down'}
                    aria-label={isAr ? 'تحريك للأسفل' : 'Move Down'}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteEducation(edu, idx);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
                    title={isAr ? 'حذف المؤهل' : 'Delete entry'}
                    aria-label={isAr ? 'حذف المؤهل' : 'Delete entry'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="p-0.5 text-slate-400">
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
                <div className="p-3.5 sm:p-4 border-t border-slate-100 space-y-3.5 bg-slate-50/30 animate-in fade-in duration-150">
                  {/* Quick Degree Presets */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-slate-600">
                      {isAr ? 'اختصارات سريعة للدرجة العلمية:' : 'Quick Degree Presets:'}
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {degreePresets.map((preset) => {
                        const isSelected = edu.degree === preset;
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => updateEducation(edu.id, { degree: preset })}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                              isSelected
                                ? 'bg-[#001639] text-white border-[#001639]'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 inline-block -mt-0.5 me-1" />}
                            {preset}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Degree */}
                    <div className="space-y-1 min-w-0">
                      <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-[#FF4D2D]" />
                        <span>{t.degree}</span>
                        <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                        placeholder={isAr ? 'مثال: بكالوريوس هندسة حاسبات' : 'e.g. Bachelor of Computer Engineering'}
                        className="w-full px-3.5 min-h-[42px] h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                      />
                    </div>

                    {/* Institution */}
                    <div className="space-y-1 min-w-0">
                      <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <School className="w-3.5 h-3.5 text-[#001639]" />
                        <span>{t.institution}</span>
                        <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                        placeholder={isAr ? 'مثال: جامعة القاهرة' : 'e.g. Cairo University'}
                        className="w-full px-3.5 min-h-[42px] h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Field of Study & GPA */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-1 min-w-0">
                      <label className="block text-xs font-semibold text-slate-700">{t.fieldOfStudy}</label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy}
                        onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                        placeholder={isAr ? 'مثال: نظم المعلومات وعلوم البيانات' : 'e.g. Information Systems'}
                        className="w-full px-3.5 min-h-[42px] h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                      />
                    </div>

                    <div className="sm:col-span-1 space-y-1 min-w-0">
                      <label className="block text-xs font-semibold text-slate-700">{t.gpa}</label>
                      <input
                        type="text"
                        inputMode="text"
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                        placeholder={isAr ? 'مثال: ممتاز / 3.8' : 'e.g. 3.8 / 4.0'}
                        className="w-full px-3.5 min-h-[42px] h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                      />
                    </div>
                  </div>

                  {/* Dates with Currently Studying Toggle */}
                  <div className="space-y-2 pt-1 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{isAr ? 'فترة الدراسة' : 'Study Period'}</span>
                      </label>
                      <label className="inline-flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isCurrentlyStudying}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updateEducation(edu.id, { endDate: isAr ? 'حالي' : 'Present' });
                            } else {
                              updateEducation(edu.id, { endDate: '' });
                            }
                          }}
                          className="rounded border-slate-300 text-[#001639] focus:ring-[#001639] w-4 h-4 cursor-pointer"
                        />
                        <span>{isAr ? 'قيد الدراسة حالياً' : 'Currently Studying'}</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Start Date */}
                      <div className="space-y-1 min-w-0">
                        <label className="block text-[11px] font-medium text-slate-500">{t.startDate}</label>
                        <input
                          type="text"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                          placeholder={isAr ? 'مثال: 2019 أو 09/2019' : 'e.g. 2019 or 09/2019'}
                          className="w-full px-3 min-h-[42px] h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                        />
                      </div>

                      {/* End Date */}
                      <div className="space-y-1 min-w-0">
                        <label className="block text-[11px] font-medium text-slate-500">{t.endDate}</label>
                        <input
                          type="text"
                          disabled={isCurrentlyStudying}
                          value={isCurrentlyStudying ? (isAr ? 'حالي' : 'Present') : edu.endDate}
                          onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                          placeholder={isAr ? 'مثال: 2023 أو 06/2023' : 'e.g. 2023 or 06/2023'}
                          className={`w-full px-3 min-h-[42px] h-10 sm:h-11 border rounded-xl text-xs sm:text-sm font-medium outline-none transition ${
                            isCurrentlyStudying
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800 font-bold'
                              : 'bg-white border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] text-slate-900 placeholder:text-slate-400'
                          }`}
                        />
                      </div>
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

