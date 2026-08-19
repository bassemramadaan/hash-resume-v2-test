import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { FolderGit2, Plus, Trash2 } from 'lucide-react';

export const ProjectsForm: React.FC = () => {
  const { resumeData, addProject, updateProject, removeProject, settings } = useResumeStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const projects = resumeData.projects || [];

  const handleAddProject = () => {
    addProject({
      title: '',
      description: '',
      technologies: [],
      link: '',
    });
  };

  return (
    <div className="space-y-6 text-slate-800" aria-live="polite">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3.5 border-slate-100">
        <div>
          <h2 className="text-base font-bold text-[#001639] flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-[#FF4D2D]" />
            <span>{t.tabProjects}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAr
              ? 'أضف المشاريع العملية والتطبيقات المميزة'
              : 'Add notable projects and applications you worked on'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddProject}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#001639] hover:bg-[#00245E] text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer shrink-0 min-h-[36px]"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isAr ? 'إضافة مشروع' : 'Add Project'}</span>
        </button>
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="p-7 border border-dashed border-slate-200 rounded-2xl text-center space-y-3 bg-slate-50/50">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#001639] flex items-center justify-center mx-auto shadow-2xs">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h3 className="font-semibold text-slate-900 text-xs">
              {isAr ? 'لم تقم بإضافة مشاريع بعد' : 'No Projects Added Yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isAr
                ? 'قسم اختياري: أضف مشاريعك البرمجية أو القيادية لتعزيز السيرة الذاتية'
                : 'Optional section to showcase your portfolio and practical work'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddProject}
            className="px-4 py-2 bg-[#001639] hover:bg-[#00245E] text-white font-semibold text-xs rounded-lg shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? 'إضافة أول مشروع' : 'Add First Project'}</span>
          </button>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        {(projects || []).map((proj, idx) => (
          <div
            key={proj.id}
            className="p-4 sm:p-5 border border-slate-200 rounded-xl bg-white space-y-4 shadow-2xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-100 text-[#001639] flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <span className="font-semibold text-xs text-slate-900">
                  {proj.title || (isAr ? `مشروع #${idx + 1}` : `Project #${idx + 1}`)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeProject(proj.id)}
                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                title={isAr ? 'حذف المشروع' : 'Delete project'}
                aria-label={isAr ? 'حذف المشروع' : 'Delete project'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {t.projectTitle} <span className="text-rose-500 font-bold">*</span>
                </label>
                <input
                  type="text"
                  value={proj.title}
                  onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                  placeholder={isAr ? 'منصة التجارة الإلكترونية' : 'E-Commerce Platform'}
                  className="w-full px-3.5 h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isAr ? 'رابط المشروع / GitHub' : 'Project URL / GitHub'}
                </label>
                <input
                  type="text"
                  value={proj.link || ''}
                  onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                  placeholder="https://github.com/username/project"
                  className="w-full px-3.5 h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isAr ? 'تاريخ البدء (مثال: يناير 2026)' : 'Start Date (e.g. Jan 2026)'}
                </label>
                <input
                  type="text"
                  value={proj.startDate || ''}
                  onChange={(e) => updateProject(proj.id, { startDate: e.target.value })}
                  placeholder={isAr ? 'يناير 2026' : 'Jan 2026'}
                  className="w-full px-3.5 h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isAr ? 'تاريخ الانتهاء (مثال: مارس 2026 / حالياً)' : 'End Date (e.g. Mar 2026 / Present)'}
                </label>
                <input
                  type="text"
                  value={proj.endDate || ''}
                  onChange={(e) => updateProject(proj.id, { endDate: e.target.value })}
                  placeholder={isAr ? 'مارس 2026' : 'Present'}
                  className="w-full px-3.5 h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                {isAr ? 'التقنيات المستخدمة (مفصولة بفاصلة)' : 'Technologies Used (comma separated)'}
              </label>
              <input
                type="text"
                value={(proj.technologies || []).join(', ')}
                onChange={(e) => updateProject(proj.id, { technologies: e.target.value.split(',').map(tech => tech.trim()).filter(Boolean) })}
                placeholder={isAr ? 'React, TypeScript, Tailwind' : 'React, Node.js, PostgreSQL'}
                className="w-full px-3.5 h-10 sm:h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t.projectDesc}</label>
              <textarea
                rows={3}
                value={proj.description}
                onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                placeholder={
                  isAr
                    ? 'شرح مختصر عن نطاق العمل والتقنيات المستخدمة والنتائج...'
                    : 'Describe project architecture, technologies used, and outcomes...'
                }
                className="w-full p-3.5 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none transition leading-relaxed min-h-[80px]"
              />
            </div>
          </div>
        ))}
      </div>

      {projects.length > 0 && (
        <button
          type="button"
          onClick={handleAddProject}
          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-[#001639] border border-slate-200 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer min-h-[40px]"
        >
          <Plus className="w-3.5 h-3.5 text-[#FF4D2D]" />
          <span>{isAr ? 'إضافة مشروع آخر' : 'Add Another Project'}</span>
        </button>
      )}
    </div>
  );
};
