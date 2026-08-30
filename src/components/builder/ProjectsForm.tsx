import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { getTranslation } from '../../i18n/translations';
import { FolderGit2, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { NextStepBanner } from './NextStepBanner';

export const ProjectsForm: React.FC = () => {
  const { resumeData, addProject, updateProject, removeProject, settings } = useResumeStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const projects = resumeData.projects || [];
  const [expandedId, setExpandedId] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );

  const handleAddProject = () => {
    addProject({
      title: '',
      description: '',
      technologies: [],
      link: '',
    });
    setTimeout(() => {
      const currentList = useResumeStore.getState().resumeData.projects;
      if (currentList && currentList.length > 0) {
        setExpandedId(currentList[currentList.length - 1].id);
      }
    }, 50);
  };

  return (
    <div className="space-y-5 sm:space-y-6 text-slate-800 w-full max-w-full min-w-0 overflow-x-hidden mobile-editor-content" aria-live="polite">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 border-slate-100">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-[#001639] flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-[#FF4D2D]" />
            <span>{t.tabProjects}</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            {isAr
              ? 'أضف المشاريع العملية والتطبيقات المميزة'
              : 'Add notable projects and applications you worked on'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddProject}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#001639] hover:bg-[#00245E] text-white rounded-xl text-xs font-bold shadow-xs transition cursor-pointer shrink-0 min-h-[42px] active:scale-95"
        >
          <Plus className="w-4 h-4 text-[#FF4D2D]" />
          <span>{isAr ? 'إضافة مشروع' : 'Add Project'}</span>
        </button>
      </div>

      {/* Next Action in Section */}
      <NextStepBanner
        variant="section"
        isAr={isAr}
        stepTextAr={
          projects.length === 0
            ? 'أضف مشروعاً رئيسياً عملت عليه مع التقنيات المستخدمة ورابط العمل إن وُجد.'
            : projects.some((p) => !p.title?.trim())
            ? 'أكمل اسم المشروع ووصف التقنيات المستخدمة.'
            : 'مشاريعك مكتملة! انتقل لاختيار القالب وفحص ATS.'
        }
        stepTextEn={
          projects.length === 0
            ? 'Add a featured project highlighting technologies used and links.'
            : projects.some((p) => !p.title?.trim())
            ? 'Fill in project title and tech stack.'
            : 'Projects complete! Move to Templates and ATS scan.'
        }
        actionTextAr={projects.length === 0 ? 'إضافة مشروع الآن' : undefined}
        actionTextEn={projects.length === 0 ? 'Add project now' : undefined}
        onAction={projects.length === 0 ? handleAddProject : undefined}
      />

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
            className="px-4 py-2.5 bg-[#001639] hover:bg-[#00245E] text-white font-bold text-xs rounded-xl shadow-xs transition inline-flex items-center gap-1.5 cursor-pointer min-h-[42px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? 'إضافة أول مشروع' : 'Add First Project'}</span>
          </button>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-3">
        {(projects || []).map((proj, idx) => {
          const isExpanded = expandedId === proj.id;

          return (
            <div
              key={proj.id}
              className={`border rounded-xl bg-white overflow-hidden transition-all shadow-2xs ${
                isExpanded ? 'border-[#001639] ring-1 ring-[#001639]/10' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : proj.id)}
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
                      {proj.title || (isAr ? `مشروع #${idx + 1}` : `Project #${idx + 1}`)}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-normal truncate">
                      {(proj.technologies || []).length > 0
                        ? (proj.technologies || []).join(', ')
                        : proj.link || (isAr ? 'بدون رابط' : 'No link')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="hidden xs:inline-flex text-[11px] font-semibold text-slate-500 px-2 py-1 bg-slate-100 rounded-md mr-1">
                    {isExpanded ? (isAr ? 'إغلاق' : 'Close') : (isAr ? 'تعديل' : 'Edit')}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProject(proj.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
                    title={isAr ? 'حذف المشروع' : 'Delete project'}
                    aria-label={isAr ? 'حذف المشروع' : 'Delete project'}
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
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        {t.projectTitle} <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                        placeholder={isAr ? 'منصة التجارة الإلكترونية' : 'E-Commerce Platform'}
                        className="w-full px-3.5 min-h-[44px] h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        {isAr ? 'رابط المشروع / GitHub' : 'Project URL / GitHub'}
                      </label>
                      <input
                        type="url"
                        inputMode="url"
                        autoCapitalize="none"
                        value={proj.link || ''}
                        onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                        placeholder="https://github.com/username/project"
                        className="w-full px-3.5 min-h-[44px] h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        {isAr ? 'تاريخ البدء' : 'Start Date'}
                      </label>
                      <input
                        type="text"
                        value={proj.startDate || ''}
                        onChange={(e) => updateProject(proj.id, { startDate: e.target.value })}
                        placeholder={isAr ? 'يناير 2026' : 'Jan 2026'}
                        className="w-full px-3.5 min-h-[44px] h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        {isAr ? 'تاريخ الانتهاء' : 'End Date'}
                      </label>
                      <input
                        type="text"
                        value={proj.endDate || ''}
                        onChange={(e) => updateProject(proj.id, { endDate: e.target.value })}
                        placeholder={isAr ? 'مارس 2026' : 'Present'}
                        className="w-full px-3.5 min-h-[44px] h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      {isAr ? 'التقنيات المستخدمة (مفصولة بفاصلة)' : 'Technologies Used (comma separated)'}
                    </label>
                    <input
                      type="text"
                      value={(proj.technologies || []).join(', ')}
                      onChange={(e) => updateProject(proj.id, { technologies: e.target.value.split(',').map(tech => tech.trim()).filter(Boolean) })}
                      placeholder={isAr ? 'React, TypeScript, Tailwind' : 'React, Node.js, PostgreSQL'}
                      className="w-full px-3.5 min-h-[44px] h-11 bg-white border border-slate-200 focus:border-[#001639] focus:ring-1 focus:ring-[#001639] rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none transition"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">{t.projectDesc}</label>
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
              )}
            </div>
          );
        })}
      </div>

      {projects.length > 0 && (
        <button
          type="button"
          onClick={handleAddProject}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-[#001639] border border-slate-200 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
        >
          <Plus className="w-4 h-4 text-[#FF4D2D]" />
          <span>{isAr ? 'إضافة مشروع آخر' : 'Add Another Project'}</span>
        </button>
      )}
    </div>
  );
};
