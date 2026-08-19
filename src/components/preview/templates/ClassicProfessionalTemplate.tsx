import React from 'react';
import { ResumeData, ResumeSettings } from '../../../types/resume';

interface TemplateProps {
  data: ResumeData;
  settings: ResumeSettings;
}

export const ClassicProfessionalTemplate: React.FC<TemplateProps> = React.memo(({ data, settings }) => {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = data;
  const isArabic = settings.language === 'ar';
  const primaryColor = settings.primaryColor || '#111827';

  return (
    <div
      
      className="w-[210mm] min-h-[297mm] bg-white text-gray-900 p-8 shadow-sm text-sm leading-relaxed"
      style={{
        fontFamily: settings.fontFamily === 'Tajawal' ? 'Tajawal, serif' : 'Georgia, serif',
        direction: isArabic ? 'rtl' : 'ltr',
      }}
    >
      {/* Centered Classic Header */}
      <header className="text-center border-b pb-4 mb-5 border-gray-300">
        <h1 className="text-2xl font-serif font-bold uppercase tracking-wide text-gray-900 mb-1">
          {personalInfo.fullName || (isArabic ? 'الاسم الكامل' : 'Full Name')}
        </h1>
        <p className="text-sm font-medium italic text-gray-700 mb-2">
          {personalInfo.jobTitle || (isArabic ? 'المسمى الوظيفي' : 'Job Title')}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-3 text-xs text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
        </div>
      </header>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-1 border-b pb-0.5 border-gray-400">
            {isArabic ? 'الملخص المهني' : 'EXECUTIVE SUMMARY'}
          </h2>
          <p className="text-xs text-gray-800 leading-relaxed italic">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experiences && experiences.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-2 border-b pb-0.5 border-gray-400">
            {isArabic ? 'الخبرة العملية' : 'PROFESSIONAL EXPERIENCE'}
          </h2>
          <div className="space-y-3">
            {(experiences || []).map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-xs text-gray-900">{exp.position}</span>
                  <span className="text-[11px] font-semibold text-gray-600">
                    {exp.startDate} – {exp.current ? (isArabic ? 'حتى الآن' : 'Present') : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-medium text-gray-700 italic mb-1">
                  {exp.company} {exp.location ? `, ${exp.location}` : ''}
                </div>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="list-disc list-inside text-xs text-gray-800 space-y-1">
                    {(exp.bulletPoints || []).map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-2 border-b pb-0.5 border-gray-400">
            {isArabic ? 'التعليم والشهادات' : 'EDUCATION'}
          </h2>
          <div className="space-y-2">
            {(education || []).map((edu) => (
              <div key={edu.id} className="flex justify-between items-start text-xs">
                <div>
                  <span className="font-bold text-gray-900">{edu.degree} in {edu.fieldOfStudy}</span>
                  <p className="text-gray-700">{edu.institution}</p>
                </div>
                <span className="text-[11px] text-gray-600">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-1 border-b pb-0.5 border-gray-400">
            {isArabic ? 'المهارات الرئيسية' : 'CORE SKILLS'}
          </h2>
          <p className="text-xs text-gray-800 leading-relaxed">
            {(skills || []).map((s) => s.name).join(' • ')}
          </p>
        </section>
      )}

      {/* Certifications & Languages */}
      <div className="grid grid-cols-2 gap-4">
        {certifications && certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-1 border-b pb-0.5 border-gray-400">
              {isArabic ? 'الشهادات' : 'CERTIFICATIONS'}
            </h2>
            <ul className="text-xs space-y-1 text-gray-800">
              {(certifications || []).map((c) => (
                <li key={c.id}>
                  <span className="font-semibold">{c.title}</span> – {c.issuer} ({c.date})
                </li>
              ))}
            </ul>
          </section>
        )}

        {languages && languages.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-1 border-b pb-0.5 border-gray-400">
              {isArabic ? 'اللغات' : 'LANGUAGES'}
            </h2>
            <p className="text-xs text-gray-800">
              {(languages || []).map((l) => `${l.language} (${l.proficiency})`).join(' • ')}
            </p>
          </section>
        )}
      </div>
    </div>
  );
});
