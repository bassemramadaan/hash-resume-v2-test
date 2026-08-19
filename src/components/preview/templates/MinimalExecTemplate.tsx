import React from 'react';
import { ResumeData, ResumeSettings } from '../../../types/resume';

interface TemplateProps {
  data: ResumeData;
  settings: ResumeSettings;
}

export const MinimalExecTemplate: React.FC<TemplateProps> = React.memo(({ data, settings }) => {
  const { personalInfo, experiences, education, skills, languages } = data;
  const isArabic = settings.language === 'ar';
  const primaryColor = settings.primaryColor || '#0f766e';

  return (
    <div
      
      className="w-[210mm] min-h-[297mm] bg-white text-gray-900 p-8 shadow-sm text-sm leading-relaxed"
      style={{
        fontFamily: settings.fontFamily === 'Tajawal' ? 'Tajawal, sans-serif' : 'Inter, sans-serif',
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          {personalInfo.fullName || (isArabic ? 'الاسم الكامل' : 'Full Name')}
        </h1>
        <p className="text-base font-bold text-teal-700 mt-0.5">
          {personalInfo.jobTitle || (isArabic ? 'المسمى الوظيفي' : 'Job Title')}
        </p>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-2 font-mono">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
        </div>
      </header>

      {personalInfo.summary && (
        <section className="mb-5">
          <p className="text-xs text-gray-700 leading-normal border-l-2 pl-3 py-0.5 border-teal-600">
            {personalInfo.summary}
          </p>
        </section>
      )}

      {experiences && experiences.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-3 border-b pb-1 border-gray-200">
            {isArabic ? 'الخبرة العملية' : 'EXPERIENCE'}
          </h2>
          <div className="space-y-4">
            {(experiences || []).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-xs text-gray-900">
                    {exp.position} — <span className="font-semibold text-gray-600">{exp.company}</span>
                  </h3>
                  <span className="text-[11px] text-gray-500">
                    {exp.startDate} - {exp.current ? (isArabic ? 'حتى الآن' : 'Present') : exp.endDate}
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

      {education && education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-2 border-b pb-1 border-gray-200">
            {isArabic ? 'التعليم' : 'EDUCATION'}
          </h2>
          <div className="space-y-1.5">
            {(education || []).map((edu) => (
              <div key={edu.id} className="flex justify-between text-xs">
                <div>
                  <span className="font-bold text-gray-900">{edu.degree}</span> ({edu.fieldOfStudy})
                  <p className="text-gray-600">{edu.institution}</p>
                </div>
                <span className="text-[11px] text-gray-500">{edu.startDate} - {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills && skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-2 border-b pb-1 border-gray-200">
            {isArabic ? 'المهارات والتقنيات' : 'SKILLS'}
          </h2>
          <div className="flex flex-wrap gap-1">
            {(skills || []).map((s) => (
              <span key={s.id} className="text-xs bg-gray-50 text-gray-800 px-2 py-0.5 border rounded-xs">
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
});
