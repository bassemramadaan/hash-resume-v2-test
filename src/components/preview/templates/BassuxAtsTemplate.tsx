import React from 'react';
import { ResumeData, ResumeSettings } from '../../../types/resume';

interface TemplateProps {
  data: ResumeData;
  settings: ResumeSettings;
}

export const BassuxAtsTemplate: React.FC<TemplateProps> = React.memo(({ data, settings }) => {
  const {
    personalInfo,
    experiences,
    education,
    skills,
    projects,
    certifications,
    languages,
    customSections,
  } = data;
  const isArabic = settings.language === 'ar';
  const careerFocus = settings.careerFocus || 'experienced';
  const isFreshGrad = careerFocus === 'fresh-grad';

  const fontStyle = {
    fontFamily: isArabic
      ? 'Tajawal, Arial, sans-serif'
      : 'Calibri, Arial, Helvetica, sans-serif',
  };

  // Plain text contact info (no icons, no links with graphics)
  const contactParts = [
    personalInfo.location,
    personalInfo.phone,
    personalInfo.email,
    personalInfo.linkedin,
    personalInfo.github,
    personalInfo.website,
  ].filter(Boolean);

  // Header Component (Plain text, no photo, no icons, single column)
  const renderHeader = () => (
    <header className="mb-6 text-center border-b border-black pb-4">
      <h1 className="text-[22px] font-bold text-black uppercase tracking-tight mb-1">
        {personalInfo.fullName || (isArabic ? 'الاسم الكامل' : 'Full Name')}
      </h1>
      {personalInfo.jobTitle && (
        <p className="text-[15px] font-semibold text-black mb-2">
          {personalInfo.jobTitle}
        </p>
      )}
      {contactParts.length > 0 && (
        <p className="text-[11px] text-black leading-relaxed">
          {contactParts.join('  |  ')}
        </p>
      )}
    </header>
  );

  // Summary
  const renderSummary = () =>
    personalInfo.summary ? (
      <section className="mb-5">
        <h2 className="text-[13px] font-bold uppercase text-black border-b border-black pb-1 mb-2">
          {isArabic ? 'الملخص المهني' : 'PROFESSIONAL SUMMARY'}
        </h2>
        <p className="text-[11px] text-black leading-relaxed">
          {personalInfo.summary}
        </p>
      </section>
    ) : null;

  // Work Experience
  const renderExperience = () =>
    experiences && experiences.length > 0 ? (
      <section className="mb-5">
        <h2 className="text-[13px] font-bold uppercase text-black border-b border-black pb-1 mb-2.5">
          {isArabic ? 'الخبرات العملية' : 'WORK EXPERIENCE'}
        </h2>
        <div className="space-y-4">
          {experiences.map((exp) => {
            const dateStr = `${exp.startDate || ''} – ${
              exp.current ? (isArabic ? 'حتى الآن' : 'Present') : exp.endDate || ''
            }`;
            const lineParts = [exp.position, exp.company, exp.location, dateStr].filter(Boolean);

            return (
              <div key={exp.id}>
                <p className="font-bold text-[12px] text-black">
                  {lineParts.join('  |  ')}
                </p>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="list-disc list-outside ms-5 mt-1 space-y-1 text-[11px] text-black">
                    {exp.bulletPoints.map((bullet, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </section>
    ) : null;

  // Education
  const renderEducation = () =>
    education && education.length > 0 ? (
      <section className="mb-5">
        <h2 className="text-[13px] font-bold uppercase text-black border-b border-black pb-1 mb-2.5">
          {isArabic ? 'التعليم والمؤهلات' : 'EDUCATION'}
        </h2>
        <div className="space-y-3">
          {education.map((edu) => {
            const dateStr = `${edu.startDate || ''} – ${edu.endDate || ''}`;
            const eduParts = [
              `${edu.degree || ''}${edu.fieldOfStudy ? ` - ${edu.fieldOfStudy}` : ''}`,
              edu.institution,
              edu.gpa ? `GPA: ${edu.gpa}` : '',
              dateStr,
            ].filter(Boolean);

            return (
              <div key={edu.id}>
                <p className="font-bold text-[12px] text-black">
                  {eduParts.join('  |  ')}
                </p>
                {edu.description && (
                  <p className="text-[11px] text-black mt-0.5">{edu.description}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    ) : null;

  // Skills
  const renderSkills = () =>
    skills && skills.length > 0 ? (
      <section className="mb-5">
        <h2 className="text-[13px] font-bold uppercase text-black border-b border-black pb-1 mb-2">
          {isArabic ? 'المهارات والتقنيات' : 'SKILLS & COMPETENCIES'}
        </h2>
        <p className="text-[11px] text-black leading-relaxed">
          {skills.map((s) => s.name).join(', ')}
        </p>
      </section>
    ) : null;

  // Key Projects
  const renderProjects = () =>
    projects && projects.length > 0 ? (
      <section className="mb-5">
        <h2 className="text-[13px] font-bold uppercase text-black border-b border-black pb-1 mb-2.5">
          {isArabic ? 'المشاريع الرئيسية' : 'KEY PROJECTS'}
        </h2>
        <div className="space-y-3">
          {projects.map((proj) => {
            const dateStr = proj.startDate || proj.endDate
              ? `${proj.startDate || ''} – ${proj.endDate || ''}`
              : '';
            const projParts = [proj.title, proj.link, dateStr].filter(Boolean);

            return (
              <div key={proj.id}>
                <p className="font-bold text-[12px] text-black">
                  {projParts.join('  |  ')}
                </p>
                {proj.description && (
                  <p className="text-[11px] text-black mt-0.5 leading-relaxed">
                    {proj.description}
                  </p>
                )}
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[11px] text-black mt-0.5">
                    <strong>{isArabic ? 'التقنيات: ' : 'Technologies: '}</strong>
                    {proj.technologies.join(', ')}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    ) : null;

  // Certifications
  const renderCertifications = () =>
    certifications && certifications.length > 0 ? (
      <section className="mb-5">
        <h2 className="text-[13px] font-bold uppercase text-black border-b border-black pb-1 mb-2">
          {isArabic ? 'الشهادات المعتمدة' : 'CERTIFICATIONS'}
        </h2>
        <div className="space-y-1.5 text-[11px] text-black">
          {certifications.map((cert) => (
            <p key={cert.id}>
              <strong>{cert.title}</strong> — {cert.issuer} {cert.date ? `(${cert.date})` : ''}
            </p>
          ))}
        </div>
      </section>
    ) : null;

  // Languages
  const renderLanguages = () =>
    languages && languages.length > 0 ? (
      <section className="mb-5">
        <h2 className="text-[13px] font-bold uppercase text-black border-b border-black pb-1 mb-2">
          {isArabic ? 'اللغات' : 'LANGUAGES'}
        </h2>
        <p className="text-[11px] text-black leading-relaxed">
          {languages.map((l) => `${l.language} (${l.proficiency})`).join('  |  ')}
        </p>
      </section>
    ) : null;

  // Custom Sections
  const renderCustomSections = () =>
    customSections && customSections.length > 0
      ? customSections.map((sec) => (
          <section key={sec.id} className="mb-5">
            <h2 className="text-[13px] font-bold uppercase text-black border-b border-black pb-1 mb-2">
              {sec.sectionTitle}
            </h2>
            <div className="space-y-2">
              {sec.items.map((item) => (
                <div key={item.id} className="text-[11px] text-black">
                  <p className="font-bold">
                    {[item.title, item.subtitle, item.date].filter(Boolean).join('  |  ')}
                  </p>
                  {item.description && (
                    <p className="mt-0.5 leading-relaxed">{item.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))
      : null;

  return (
    <div
      className="w-[210mm] min-h-[297mm] bg-white text-black p-8 sm:p-12 shadow-sm text-sm leading-relaxed text-start"
      dir={isArabic ? 'rtl' : 'ltr'}
      style={{ ...fontStyle, direction: isArabic ? 'rtl' : 'ltr' }}
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

      {renderCertifications()}
      {renderLanguages()}
      {renderCustomSections()}
    </div>
  );
});
