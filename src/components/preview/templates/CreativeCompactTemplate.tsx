import React from 'react';
import { ResumeData, ResumeSettings } from '../../../types/resume';

interface TemplateProps {
  data: ResumeData;
  settings: ResumeSettings;
}

export const CreativeCompactTemplate: React.FC<TemplateProps> = React.memo(({ data, settings }) => {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = data;
  const isArabic = settings.language === 'ar';
  const docDir = settings.documentDirection || (isArabic ? 'rtl' : 'ltr');
  const primaryColor = settings.primaryColor || '#b91c1c';
  const careerFocus = settings.careerFocus || 'experienced';
  const isFreshGrad = careerFocus === 'fresh-grad';

  const renderSummary = () =>
    personalInfo.summary ? (
      <section className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-red-700 mb-1.5 border-b pb-1" style={{ color: primaryColor }}>
          {isArabic ? 'الملخص المهني' : 'ABOUT ME'}
        </h2>
        <p className="text-xs text-gray-700 leading-normal">{personalInfo.summary}</p>
      </section>
    ) : null;

  const renderExperience = () =>
    experiences && experiences.length > 0 ? (
      <section className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-red-700 mb-2.5 border-b pb-1" style={{ color: primaryColor }}>
          {isArabic ? 'الخبرات العملية' : 'EXPERIENCE'}
        </h2>
        <div className="space-y-3.5">
          {(experiences || []).map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-xs text-gray-900">{exp.position}</h3>
                <span className="text-[11px] font-medium text-gray-500">
                  {exp.startDate} - {exp.current ? (isArabic ? 'حتى الآن' : 'Present') : exp.endDate}
                </span>
              </div>
              <p className="text-xs font-semibold text-red-600 mb-1" style={{ color: primaryColor }}>{exp.company}</p>
              {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1">
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-red-700 mb-2.5 border-b pb-1" style={{ color: primaryColor, borderColor: `${primaryColor}30` }}>
          {isArabic ? 'المشاريع البارزة' : 'FEATURED PROJECTS'}
        </h2>
        <div className="space-y-3">
          {(projects || []).map((p) => (
            <div key={p.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-xs text-gray-900">
                  {p.title}
                  {p.link && (
                    <span className="text-[10px] font-normal text-red-600 underline ml-2 mr-2">
                      {p.link}
                    </span>
                  )}
                </h3>
                {(p.startDate || p.endDate) && (
                  <span className="text-[11px] text-gray-500">
                    {p.startDate} {p.endDate ? `- ${p.endDate}` : ''}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-700 leading-normal mt-0.5">{p.description}</p>
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-red-700 mb-2 border-b pb-1" style={{ color: primaryColor }}>
          {isArabic ? 'التعليم' : 'EDUCATION'}
        </h2>
        <div className="space-y-2">
          {(education || []).map((edu) => (
            <div key={edu.id} className="flex justify-between items-start text-xs">
              <div>
                <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution} ({edu.fieldOfStudy})</p>
              </div>
              <span className="text-[11px] text-gray-500">{edu.startDate} - {edu.endDate}</span>
            </div>
          ))}
        </div>
      </section>
    ) : null;

  const renderCertifications = () =>
    certifications && certifications.length > 0 ? (
      <section className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-red-700 mb-2 border-b pb-1" style={{ color: primaryColor }}>
          {isArabic ? 'الشهادات المعتمدة' : 'CERTIFICATIONS'}
        </h2>
        <div className="space-y-1.5 text-xs text-gray-700">
          {(certifications || []).map((cert) => (
            <div key={cert.id}>
              <span className="font-bold text-gray-900">{cert.title}</span> – {cert.issuer} ({cert.date})
            </div>
          ))}
        </div>
      </section>
    ) : null;

  return (
    <div
      className="w-[210mm] min-h-[297mm] bg-white text-gray-900 p-0 shadow-sm text-sm leading-relaxed flex"
      dir={docDir}
      style={{
        fontFamily: settings.fontFamily === 'Tajawal' ? 'Tajawal, sans-serif' : 'Inter, sans-serif',
        direction: docDir,
      }}
    >
      {/* Sidebar Accent Panel */}
      <aside className="w-1/3 bg-slate-900 text-white p-6 flex flex-col justify-between text-start">
        <div>
          {settings.showPhoto && personalInfo.photoUrl && (
            <img
              src={personalInfo.photoUrl}
              alt={personalInfo.fullName}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-red-500"
            />
          )}

          <h1 className="text-xl font-bold text-white mb-1 text-center">
            {personalInfo.fullName || (isArabic ? 'الاسم الكامل' : 'Full Name')}
          </h1>
          <p className="text-xs font-medium text-red-400 text-center mb-6">
            {personalInfo.jobTitle || (isArabic ? 'مطور واجهات أمامية' : 'Frontend Developer')}
          </p>

          <div className="space-y-2 text-xs text-slate-300 mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-wider text-red-400 border-b border-slate-700 pb-1 mb-2">
              {isArabic ? 'التواصل' : 'CONTACT'}
            </h2>
            {personalInfo.email && <p className="truncate">📧 {personalInfo.email}</p>}
            {personalInfo.phone && <p>📱 {personalInfo.phone}</p>}
            {personalInfo.location && <p>📍 {personalInfo.location}</p>}
            {personalInfo.linkedin && <p className="truncate">🔗 {personalInfo.linkedin}</p>}
          </div>

          {skills && skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-red-400 border-b border-slate-700 pb-1 mb-2">
                {isArabic ? 'المهارات' : 'SKILLS'}
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {(skills || []).map((s) => (
                  <span key={s.id} className="text-[10px] bg-slate-800 text-slate-200 px-2 py-0.5 rounded inline-flex items-center gap-1">
                    <span>{s.name}</span>
                    {s.level && (
                      <span className="text-[8px] text-red-400 font-bold uppercase">
                        ({isArabic ? (s.level === 'beginner' ? 'مبتدئ' : s.level === 'intermediate' ? 'متوسط' : s.level === 'advanced' ? 'متقدم' : 'خبير') : s.level.substring(0, 3)})
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-wider text-red-400 border-b border-slate-700 pb-1 mb-2">
                {isArabic ? 'اللغات' : 'LANGUAGES'}
              </h2>
              <ul className="text-xs space-y-1 text-slate-300">
                {(languages || []).map((l) => (
                  <li key={l.id}>
                    <span className="font-semibold text-white">{l.language}</span> ({isArabic ? (l.proficiency === 'native' ? 'اللغة الأم' : l.proficiency === 'fluent' ? 'طلاقة' : l.proficiency === 'advanced' ? 'متقدم' : l.proficiency === 'intermediate' ? 'متوسط' : 'مبتدئ') : l.proficiency})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="text-[10px] text-slate-500 text-center mt-6">
          Hash Resume
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="w-2/3 p-6">
        {renderSummary()}

        {isFreshGrad ? (
          <>
            {renderEducation()}
            {renderProjects()}
            {renderCertifications()}
            {renderExperience()}
          </>
        ) : (
          <>
            {renderExperience()}
            {renderEducation()}
            {renderProjects()}
            {renderCertifications()}
          </>
        )}
      </main>
    </div>
  );
});
