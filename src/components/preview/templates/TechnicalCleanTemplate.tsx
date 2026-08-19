import React from 'react';
import { ResumeData, ResumeSettings } from '../../../types/resume';

interface TemplateProps {
  data: ResumeData;
  settings: ResumeSettings;
}

export const TechnicalCleanTemplate: React.FC<TemplateProps> = React.memo(({ data, settings }) => {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = data;
  const isArabic = settings.language === 'ar';
  const primaryColor = settings.primaryColor || '#4f46e5';

  return (
    <div
      
      className="w-[210mm] min-h-[297mm] bg-white text-gray-900 p-8 shadow-sm text-sm leading-relaxed"
      style={{
        fontFamily: settings.fontFamily === 'Tajawal' ? 'Tajawal, sans-serif' : 'Inter, sans-serif',
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      <header className="flex justify-between items-start border-b pb-4 mb-4 border-gray-200">
        <div>
          <h1 className="text-2xl font-mono font-bold text-gray-900">
            {personalInfo.fullName || (isArabic ? 'الاسم الكامل' : 'Full Name')}
          </h1>
          <p className="text-xs font-mono font-bold text-indigo-600 mt-0.5">
            // {personalInfo.jobTitle || (isArabic ? 'المسمى الوظيفي' : 'Job Title')}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-600 mt-2">
            {personalInfo.email && <span>📧 {personalInfo.email}</span>}
            {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
            {personalInfo.github && <span>💻 {personalInfo.github}</span>}
            {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
          </div>
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-4">
          <h2 className="text-xs font-mono font-bold text-indigo-700 uppercase mb-1">
            [SUMMARY]
          </h2>
          <p className="text-xs text-gray-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {skills && skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-mono font-bold text-indigo-700 uppercase mb-1.5">
            [TECHNICAL_STACK]
          </h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {(skills || []).map((s) => (
              <div key={s.id} className="flex items-center gap-1.5 bg-indigo-50/60 px-2 py-1 rounded border border-indigo-100">
                <span className="font-mono text-[10px] text-indigo-600">❯</span>
                <span className="font-medium text-gray-800">{s.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {experiences && experiences.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-mono font-bold text-indigo-700 uppercase mb-2">
            [EXPERIENCE]
          </h2>
          <div className="space-y-3">
            {(experiences || []).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-gray-900">{exp.position} @ {exp.company}</span>
                  <span className="text-[11px] font-mono text-gray-500">
                    {exp.startDate} - {exp.current ? 'PRESENT' : exp.endDate}
                  </span>
                </div>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-gray-700 mt-1 space-y-1">
                    {(exp.bulletPoints || []).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {projects && projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-mono font-bold text-indigo-700 uppercase mb-1.5">
            [FEATURED_PROJECTS]
          </h2>
          <div className="space-y-2 text-xs">
            {(projects || []).map((p) => (
              <div key={p.id} className="border-l-2 border-indigo-500 pl-2">
                <div className="font-bold text-gray-900">{p.title}</div>
                <p className="text-gray-700 text-xs">{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {education && education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-mono font-bold text-indigo-700 uppercase mb-1">
            [EDUCATION]
          </h2>
          {(education || []).map((e) => (
            <div key={e.id} className="flex justify-between text-xs">
              <div>
                <span className="font-bold text-gray-900">{e.degree}</span> in {e.fieldOfStudy}
                <p className="text-gray-600">{e.institution}</p>
              </div>
              <span className="text-[11px] font-mono text-gray-500">{e.startDate} - {e.endDate}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
});
