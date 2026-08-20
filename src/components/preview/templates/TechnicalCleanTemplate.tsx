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
  const headerLayout = settings.headerLayout || 'centered';
  const careerFocus = settings.careerFocus || 'experienced';
  const isFreshGrad = careerFocus === 'fresh-grad';

  const renderHeader = () => {
    if (headerLayout === 'two-column') {
      return (
        <header className="flex justify-between items-start border-b pb-4 mb-4 border-gray-200 gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-mono font-bold text-gray-900">
              {personalInfo.fullName || (isArabic ? 'الاسم الكامل' : 'Full Name')}
            </h1>
            <p className="text-xs font-mono font-bold text-indigo-600 mt-0.5">
              // {personalInfo.jobTitle || (isArabic ? 'المسمى الوظيفي' : 'Job Title')}
            </p>
          </div>
          <div className="flex flex-col gap-0.5 text-xs text-gray-600 font-mono text-end shrink-0">
            {personalInfo.email && <span>📧 {personalInfo.email}</span>}
            {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
            {personalInfo.github && <span>💻 {personalInfo.github}</span>}
            {personalInfo.linkedin && <span>🔗 {personalInfo.linkedin}</span>}
          </div>
          {settings.showPhoto && personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-16 h-16 rounded-md object-cover border border-indigo-500 shrink-0"
            />
          )}
        </header>
      );
    }

    if (headerLayout === 'compact') {
      return (
        <header className="border-b pb-2.5 mb-3 border-gray-200">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
            <h1 className="text-xl font-mono font-bold text-gray-900">
              {personalInfo.fullName || (isArabic ? 'الاسم الكامل' : 'Full Name')}
            </h1>
            <p className="text-xs font-mono font-bold text-indigo-600">
              // {personalInfo.jobTitle || (isArabic ? 'المسمى الوظيفي' : 'Job Title')}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-600 font-mono">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.github && <span>• {personalInfo.github}</span>}
            {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          </div>
        </header>
      );
    }

    // Default centered/standard
    return (
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
        {settings.showPhoto && personalInfo.photoUrl && (
          <img
            src={personalInfo.photoUrl}
            alt={personalInfo.fullName}
            className="w-16 h-16 rounded-md object-cover border border-indigo-500 shrink-0"
          />
        )}
      </header>
    );
  };

  const renderSummary = () =>
    personalInfo.summary ? (
      <section className="mb-4">
        <h2 className="text-xs font-mono font-bold text-indigo-700 uppercase mb-1">
          [SUMMARY]
        </h2>
        <p className="text-xs text-gray-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
          {personalInfo.summary}
        </p>
      </section>
    ) : null;

  const renderSkills = () =>
    skills && skills.length > 0 ? (
      <section className="mb-4">
        <h2 className="text-xs font-mono font-bold text-indigo-700 uppercase mb-1.5" style={{ color: primaryColor }}>
          {isArabic ? '[المهارات والتقنيات]' : '[TECHNICAL_STACK]'}
        </h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {(skills || []).map((s) => (
            <div key={s.id} className="flex items-center justify-between bg-indigo-50/60 px-2.5 py-1.5 rounded border border-indigo-100/50">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-indigo-600">❯</span>
                <span className="font-medium text-gray-800">{s.name}</span>
              </div>
              {s.level && (
                <span className="text-[9px] font-mono font-bold uppercase bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded leading-none">
                  {s.level}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    ) : null;

  const renderExperience = () =>
    experiences && experiences.length > 0 ? (
      <section className="mb-4">
        <h2 className="text-xs font-mono font-bold text-indigo-700 uppercase mb-2" style={{ color: primaryColor }}>
          {isArabic ? '[الخبرات المهنية]' : '[EXPERIENCE]'}
        </h2>
        <div className="space-y-3">
          {(experiences || []).map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline text-xs">
                <span className="font-bold text-gray-900">{exp.position} @ {exp.company}</span>
                <span className="text-[11px] font-mono text-gray-500">
                  {exp.startDate} - {exp.current ? (isArabic ? 'الآن' : 'PRESENT') : exp.endDate}
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
    ) : null;

  const renderProjects = () =>
    projects && projects.length > 0 ? (
      <section className="mb-4">
        <h2 className="text-xs font-mono font-bold text-indigo-700 uppercase mb-1.5" style={{ color: primaryColor }}>
          {isArabic ? '[المشاريع]' : '[FEATURED_PROJECTS]'}
        </h2>
        <div className="space-y-2.5 text-xs">
          {(projects || []).map((p) => (
            <div key={p.id} className="border-l-2 border-indigo-500 pl-2.5 rtl:border-l-0 rtl:border-r-2 rtl:pr-2.5">
              <div className="flex justify-between items-baseline font-mono">
                <div className="font-bold text-gray-900">
                  {p.title}
                  {p.link && (
                    <span className="text-[10px] font-normal text-indigo-600 underline ml-2 mr-2">
                      {p.link}
                    </span>
                  )}
                </div>
                {(p.startDate || p.endDate) && (
                  <span className="text-[10px] text-gray-500">
                    {p.startDate} {p.endDate ? `- ${p.endDate}` : ''}
                  </span>
                )}
              </div>
              <p className="text-gray-700 text-xs mt-0.5">{p.description}</p>
              {p.technologies && p.technologies.length > 0 && (
                <p className="text-[10px] text-gray-500 mt-1">
                  <strong>{isArabic ? 'التقنيات: ' : 'Tech Stack: '}</strong>
                  {p.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    ) : null;

  const renderEducation = () =>
    education && education.length > 0 ? (
      <section className="mb-4">
        <h2 className="text-xs font-mono font-bold text-indigo-700 uppercase mb-1" style={{ color: primaryColor }}>
          {isArabic ? '[التعليم]' : '[EDUCATION]'}
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
    ) : null;

  return (
    <div
      className="w-[210mm] min-h-[297mm] bg-white text-gray-900 p-8 shadow-sm text-sm leading-relaxed"
      style={{
        fontFamily: settings.fontFamily === 'Tajawal' ? 'Tajawal, sans-serif' : 'Inter, sans-serif',
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      {renderHeader()}
      {renderSummary()}

      {isFreshGrad ? (
        <>
          {renderEducation()}
          {renderProjects()}
          {renderSkills()}
          {renderExperience()}
        </>
      ) : (
        <>
          {renderExperience()}
          {renderEducation()}
          {renderSkills()}
          {renderProjects()}
        </>
      )}

      {/* Certifications & Languages Bottom Grid */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-2 border-t border-gray-100">
        {certifications && certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-mono font-bold text-indigo-700 uppercase mb-1.5" style={{ color: primaryColor }}>
              {isArabic ? '[الشهادات المعتمدة]' : '[CERTIFICATIONS]'}
            </h2>
            <div className="space-y-1">
              {(certifications || []).map((cert) => (
                <div key={cert.id} className="text-xs">
                  <p className="font-semibold text-gray-900">{cert.title}</p>
                  <p className="text-[11px] text-gray-500">
                    {cert.issuer} ({cert.date})
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {languages && languages.length > 0 && (
          <section>
            <h2 className="text-xs font-mono font-bold text-indigo-700 uppercase mb-1.5" style={{ color: primaryColor }}>
              {isArabic ? '[اللغات]' : '[LANGUAGES]'}
            </h2>
            <div className="space-y-1 text-xs">
              {(languages || []).map((lang) => (
                <div key={lang.id} className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">{lang.language}</span>
                  <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded uppercase font-mono font-semibold">
                    {isArabic
                      ? lang.proficiency === 'native'
                        ? 'اللغة الأم'
                        : lang.proficiency === 'fluent'
                        ? 'طلاقة'
                        : lang.proficiency === 'advanced'
                        ? 'متقدم'
                        : lang.proficiency === 'intermediate'
                        ? 'متوسط'
                        : 'مبتدئ'
                      : lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
});
