import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useUndoToastStore } from '../../store/useUndoToastStore';
import { getTranslation } from '../../i18n/translations';
import { FolderGit2, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { NextStepBanner } from './NextStepBanner';

export const ProjectsForm: React.FC = () => {
  const { resumeData, addProject, updateProject, removeProject, insertProjectAtIndex, settings } = useResumeStore();
  const { showUndoToast } = useUndoToastStore();
  const t = getTranslation(settings.language);
  const isAr = settings.language === 'ar';

  const projects = resumeData.projects || [];
  const [expandedId, setExpandedId] = useState<string | null>(
    projects.length > 0 ? projects[0].id : null
  );

  const handleDeleteProject = (proj: any, idx: number) => {
    removeProject(proj.id);
    showUndoToast({
      messageAr: proj.title ? `تم حذف مشروع "${proj.title}"` : 'تم حذف المشروع',
      messageEn: proj.title ? `Deleted "${proj.title}"` : 'Project deleted',
      onUndo: () => {
        insertProjectAtIndex(idx, proj);
        setExpandedId(proj.id);
      },
    });
  };

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
    <div className="space-y-4 text-slate-800 w-full max-w-full min-w-0 overflow-x-hidden mobile-editor-content" aria-live="polite">
      {/* Top Action Bar when projects exist */}
      {projects.length > 0 && (
        <div className="flex items-center justify-between gap-3 pb-1">
          <span className="text-xs font-bold text-slate-700">
            {isAr ? `المشاريع العملية (${projects.length})` : `Projects (${projects.length})`}
          </span>
          <button
            type="button"
            onClick={handleAddProject}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#001639] hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0 shadow-2xs active:scale-98"
          >
            <Plus className="w-3.5 h-3.5 text-[#FF4D2D]" />
            <span>{isAr ? 'إضافة مشروع' : 'Add Project'}</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center space-y-3 bg-slate-50/60">
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-[#FF4D2D] flex items-center justify-center mx-auto shadow-2xs">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-tajawal font-bold text-slate-900 text-sm sm:text-base">
              {isAr ? 'لم تقم بإضافة مشاريع بعد' : 'No Projects Added Yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {isAr
                ? 'قسم اختياري: أضف مشاريعك البرمجية أو العملية لتعزيز السيرة الذاتية'
                : 'Optional section to showcase your portfolio and practical work'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddProject}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#001639] hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition active:scale-98 cursor-pointer mt-2"
          >
            <Plus className="w-4 h-4 text-[#FF4D2D]" />
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
              className="border border-slate-200/90 rounded-2xl bg-white transition shadow-2xs overflow-hidden"
            >
              {/* Header Bar */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : proj.id)}
                className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-slate-50/70 transition gap-2 w-full min-w-0"
                role="button"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-[#001639] flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <h3 className="font-tajawal font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {proj.title || (isAr ? `مشروع #${idx + 1}` : `Project #${idx + 1}`)}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium truncate">
                      {(proj.technologies || []).length > 0
                        ? (proj.technologies || []).join(', ')
                        : proj.link || (isAr ? 'بدون رابط' : 'No link')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(proj, idx);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title={isAr ? 'حذف المشروع' : 'Delete project'}
                    aria-label={isAr ? 'حذف المشروع' : 'Delete project'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="p-1 text-slate-400">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-700" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Form Content */}
              {isExpanded && (
                <div className="p-4 sm:p-5 border-t border-slate-100 space-y-3.5 bg-slate-50/40">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        {t.projectTitle} <span className="text-[#FF4D2D] font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                        placeholder={isAr ? 'منصة التجارة الإلكترونية' : 'E-Commerce Platform'}
                        className="w-full px-3.5 h-11 bg-white hover:border-slate-300 focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-xl text-sm font-ibm-sans text-slate-900 placeholder:text-slate-400 outline-none transition shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        {isAr ? 'رابط المشروع / GitHub' : 'Project URL / GitHub'}
                      </label>
                      <input
                        type="url"
                        dir="ltr"
                        inputMode="url"
                        autoCapitalize="none"
                        value={proj.link || ''}
                        onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                        placeholder="https://github.com/username/project"
                        className="w-full px-3.5 h-11 bg-white hover:border-slate-300 focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-xl text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 outline-none transition shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        {isAr ? 'تاريخ البدء' : 'Start Date'}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={proj.startDate || ''}
                        onChange={(e) => updateProject(proj.id, { startDate: e.target.value })}
                        placeholder={isAr ? 'يناير 2026' : 'Jan 2026'}
                        className="w-full px-3.5 h-11 bg-white hover:border-slate-300 focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-xl text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 outline-none transition shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">
                        {isAr ? 'تاريخ الانتهاء' : 'End Date'}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={proj.endDate || ''}
                        onChange={(e) => updateProject(proj.id, { endDate: e.target.value })}
                        placeholder={isAr ? 'مارس 2026' : 'Present'}
                        className="w-full px-3.5 h-11 bg-white hover:border-slate-300 focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-xl text-xs sm:text-sm font-mono text-slate-900 placeholder:text-slate-400 outline-none transition shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">
                      {isAr ? 'التقنيات المستخدمة (مفصولة بفاصلة)' : 'Technologies Used (comma separated)'}
                    </label>
                    <input
                      type="text"
                      value={(proj.technologies || []).join(', ')}
                      onChange={(e) => updateProject(proj.id, { technologies: e.target.value.split(',').map(tech => tech.trim()).filter(Boolean) })}
                      placeholder={isAr ? 'React, TypeScript, Tailwind' : 'React, Node.js, PostgreSQL'}
                      className="w-full px-3.5 h-11 bg-white hover:border-slate-300 focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-xl text-sm font-ibm-sans text-slate-900 placeholder:text-slate-400 outline-none transition shadow-2xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">{t.projectDesc}</label>
                    <textarea
                      rows={3}
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                      placeholder={
                        isAr
                          ? 'شرح مختصر عن نطاق العمل والتقنيات المستخدمة والنتائج...'
                          : 'Describe project architecture, technologies used, and outcomes...'
                      }
                      className="w-full p-3.5 bg-white hover:border-slate-300 focus:bg-white border border-slate-200 focus:border-[#001639] focus:ring-2 focus:ring-[#001639]/10 rounded-xl text-xs sm:text-sm font-ibm-sans text-slate-900 placeholder:text-slate-400 outline-none transition leading-relaxed min-h-[80px] shadow-2xs"
                    />
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
