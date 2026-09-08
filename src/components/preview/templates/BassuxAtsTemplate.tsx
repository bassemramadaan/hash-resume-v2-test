import React from 'react';
import { ResumeData, ResumeSettings } from '../../../types/resume';
import { getTemplateFontFamily, getHeadingFontFamily } from '../../../utils/resumeFonts';

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
  const docDir = settings.documentDirection || (isArabic ? 'rtl' : 'ltr');
  const careerFocus = settings.careerFocus || 'experienced';
  const isFreshGrad = careerFocus === 'fresh-grad';

  const bodyFont = getTemplateFontFamily(settings.fontFamily, settings.language);
  const headingFont = getHeadingFontFamily(settings.headingFontFamily, settings.fontFamily, settings.language);

  const fontStyle = {
    fontFamily: bodyFont,
    ['--heading-font' as any]: headingFont,
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
      <h1 className="text-[24px] font-bold text-black uppercase tracking-tight mb-1">
        {personalInfo.fullName || (isArabic ? 'الاسم الكامل' : 'Full Name')}
      </h1>
      <p className="text-[16px] font-semibold text-black mb-2">
        {personalInfo.jobTitle || (isArabic ? 'مطور واجهات أمامية' : 'Frontend Developer')}
      </p>
      {contactParts.length > 0 && (
        <div className="text-[12px] text-black leading-relaxed flex flex-wrap justify-center items-center gap-x-2">
          {contactParts.map((part, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-gray-400 select-none">|</span>}
              <bdi className="font-sans">{part}</bdi>
            </React.Fragment>
          ))}
        </div>
      )}
    </header>
  );

  // Summary
  const renderSummary = () =>
    personalInfo.summary ? (
      <section className="mb-5">
        <h2 className="text-[14px] font-bold uppercase text-black border-b border-black pb-1 mb-2">
          {isArabic ? 'الملخص المهني' : 'PROFESSIONAL SUMMARY'}
        </h2>
        <p className="text-[12px] text-black leading-relaxed">
          {personalInfo.summary}
        </p>
      </section>
    ) : null;

  // Work Experience
  const renderExperience = () =>
    experiences && experiences.length > 0 ? (
      <section className="mb-5">
        <h2 className="text-[14px] font-bold uppercase text-black border-b border-black pb-1 mb-2.5">
          {isArabic ? 'الخبرات العملية' : 'WORK EXPERIENCE'}
        </h2>
        <div className="space-y-4">
          {experiences.map((exp) => {
            return (
              <div key={exp.id}>
                <div className="font-bold text-[13px] text-black flex flex-wrap items-baseline gap-x-2">
                  <span>{exp.position}</span>
                  {exp.company && <span className="text-gray-500">|</span>}
                  {exp.company && <span>{exp.company}</span>}
                  {exp.location && <span className="text-gray-500">|</span>}
                  {exp.location && <span>{exp.location}</span>}
                  {(exp.startDate || exp.endDate) && <span className="text-gray-500">|</span>}
                  {(exp.startDate || exp.endDate) && (
                    <bdi className="date-range font-sans">
                      {exp.startDate || ''} – {exp.current ? (isArabic ? 'حتى الآن' : 'Present') : exp.endDate || ''}
                    </bdi>
                  )}
                </div>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <ul className="list-disc list-outside ms-5 mt-1 space-y-1 text-[12px] text-black">
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
        <h2 className="text-[14px] font-bold uppercase text-black border-b border-black pb-1 mb-2.5">
          {isArabic ? 'التعليم والمؤهلات' : 'EDUCATION'}
        </h2>
        <div className="space-y-3">
          {education.map((edu) => {
            return (
              <div key={edu.id}>
                <div className="font-bold text-[13px] text-black flex flex-wrap items-baseline gap-x-2">
                  <span>{`${edu.degree || ''}${edu.fieldOfStudy ? ` - ${edu.fieldOfStudy}` : ''}`}</span>
                  {edu.institution && <span className="text-gray-500">|</span>}
                  {edu.institution && <span>{edu.institution}</span>}
                  {edu.gpa && <span className="text-gray-500">|</span>}
                  {edu.gpa && <bdi>GPA: {edu.gpa}</bdi>}
                  {(edu.startDate || edu.endDate) && <span className="text-gray-500">|</span>}
                  {(edu.startDate || edu.endDate) && (
                    <bdi className="date-range font-sans">
                      {edu.startDate || ''} – {edu.endDate || ''}
                    </bdi>
                  )}
                </div>
                {edu.description && (
                  <p className="text-[12px] text-black mt-0.5">{edu.description}</p>
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
        <h2 className="text-[14px] font-bold uppercase text-black border-b border-black pb-1 mb-2">
          {isArabic ? 'المهارات والتقنيات' : 'SKILLS & COMPETENCIES'}
        </h2>
        <p className="text-[12px] text-black leading-relaxed">
          {skills.map((s) => s.name).join(', ')}
        </p>
      </section>
    ) : null;

  // Key Projects
  const renderProjects = () =>
    projects && projects.length > 0 ? (
      <section className="mb-5">
        <h2 className="text-[14px] font-bold uppercase text-black border-b border-black pb-1 mb-2.5">
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
                <p className="font-bold text-[13px] text-black">
                  {projParts.join('  |  ')}
                </p>
                {proj.description && (
                  <p className="text-[12px] text-black mt-0.5 leading-relaxed">
                    {proj.description}
                  </p>
                )}
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-[12px] text-black mt-0.5">
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
        <h2 className="text-[14px] font-bold uppercase text-black border-b border-black pb-1 mb-2">
          {isArabic ? 'الشهادات المعتمدة' : 'CERTIFICATIONS'}
        </h2>
        <div className="space-y-1.5 text-[12px] text-black">
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
        <h2 className="text-[14px] font-bold uppercase text-black border-b border-black pb-1 mb-2">
          {isArabic ? 'اللغات' : 'LANGUAGES'}
        </h2>
        <p className="text-[12px] text-black leading-relaxed">
          {languages.map((l) => `${l.language} (${l.proficiency})`).join('  |  ')}
        </p>
      </section>
    ) : null;

  // Custom Sections
  const renderCustomSections = () =>
    customSections && customSections.length > 0
      ? customSections.map((sec) => (
          <section key={sec.id} className="mb-5">
            <h2 className="text-[14px] font-bold uppercase text-black border-b border-black pb-1 mb-2">
              {sec.sectionTitle}
            </h2>
            <div className="space-y-2">
              {sec.items.map((item) => (
                <div key={item.id} className="text-[12px] text-black">
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
      className="resume-template-container w-[210mm] min-h-[297mm] bg-white text-black p-8 sm:p-12 shadow-sm text-sm leading-relaxed text-start"
      dir={docDir}
      style={{ ...fontStyle, direction: docDir }}
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
