import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { GraduationCap, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

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

  const handleAddNew = () => {
    addEducation({
      degree: '',
      institution: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      gpa: '',
    });
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3.5 border-slate-100">
        <div>
          <h2 className="text-base font-bold text-[#001639] flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#FF4D2D]" />
            <span>{t.tabEducation}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAr
              ? 'أضف المؤهلات الأكاديمية والدرجات العلمية'
              : 'Add your degrees and academic qualifications'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddNew}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#001639] hover:bg-[#00245E] text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer shrink-0 min-h-[36px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAr ? 'إضافة مؤهل' : 'Add Education'}</span>
        </button>
      </div>

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
            className="px-4 py-2 bg-[#001639] hover:bg-[#00245E] text-white font-semibold text-xs rounded-lg shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? 'إضافة أول مؤهل' : 'Add First Education'}</span>
          </button>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {(educationList || []).map((edu, idx) => (
          <div
            key={edu.id}
            className="p-4 sm:p-5 border border-slate-200 rounded-xl bg-white space-y-4 shadow-2xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-100 text-[#001639] flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <span className="font-semibold text-xs text-slate-900">
                  {edu.degree || (isAr ? `مؤهل تعليمي #${idx + 1}` : `Education Entry #${idx + 1}`)}
                </span>
              </div>

              <div className="flex items-center gap-1">
                {/* Reorder Buttons */}
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => reorderEducation(idx, idx - 1)}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100 rounded-md transition cursor-pointer"
                  title={isAr ? 'تحريك للأعلى' : 'Move Up'}
                  aria-label={isAr ? 'تحريك للأعلى' : 'Move Up'}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={idx === educationList.length - 1}
                  onClick={() => reorderEducation(idx, idx + 1)}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 hover:bg-slate-100 rounded-md transition cursor-pointer"
                  title={isAr ? 'تحريك للأسفل' : 'Move Down'}
                  aria-label={isAr ? 'تحريك للأسفل' : 'Move Down'}
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                  title={isAr ? 'حذف المؤهل' : 'Delete entry'}
                  aria-label={isAr ? 'حذف المؤهل' : 'Delete entry'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Degree */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.degree} <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                  placeholder={isAr ? 'بكالوريوس علوم الحاسب' : 'Bachelor of Computer Science'}
                  className="w-full px-3.5 h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>

              {/* Institution */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.institution} <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                  placeholder={isAr ? 'جامعة القاهرة' : 'Cairo University'}
                  className="w-full px-3.5 h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>

              {/* Field of Study */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.fieldOfStudy}</label>
                <input
                  type="text"
                  value={edu.fieldOfStudy}
                  onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                  placeholder={isAr ? 'تكنولوجيا المعلومات' : 'Information Technology'}
                  className="w-full px-3.5 h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>

              {/* GPA */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.gpa}</label>
                <input
                  type="text"
                  value={edu.gpa || ''}
                  onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                  placeholder="3.8 / 4.0"
                  className="w-full px-3.5 h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.startDate}</label>
                <input
                  type="text"
                  value={edu.startDate}
                  onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                  placeholder="09/2016"
                  className="w-full px-3.5 h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.endDate}</label>
                <input
                  type="text"
                  value={edu.endDate}
                  onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                  placeholder="06/2020"
                  className="w-full px-3.5 h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
