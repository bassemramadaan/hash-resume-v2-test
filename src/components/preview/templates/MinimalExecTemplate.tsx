import React from 'react';
import { ResumeData, ResumeSettings } from '../../../types/resume';
import { getTemplateFontFamily, getHeadingFontFamily } from '../../../utils/resumeFonts';

interface TemplateProps {
  data: ResumeData;
  settings: ResumeSettings;
}

export const MinimalExecTemplate: React.FC<TemplateProps> = React.memo(({ data, settings }) => {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = data;
  const isArabic = settings.language === 'ar';
  const docDir = settings.documentDirection || (isArabic ? 'rtl' : 'ltr');
  const primaryColor = settings.primaryColor || '#001639';
  const headerLayout = settings.headerLayout || 'centered';
  const careerFocus = settings.careerFocus || 'experienced';
  const isFreshGrad = careerFocus === 'fresh-grad';

  const bodyFont = getTemplateFontFamily(settings.fontFamily, settings.language);
  const headingFont = getHeadingFontFamily(settings.headingFontFamily, settings.fontFamily, settings.language);

  const renderHeader = () => {
    if (headerLayout === 'two-column') {
      return (
        <header className="mb-5 border-b pb-4 border-gray-200">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                {personalInfo.fullName || (isArabic ? 'الاسم الكامل' : 'Full Name')}
              </h1>
              <p className="text-sm font-bold mt-0.5 text-[#001639]" style={{ color: primaryColor }}>
                {personalInfo.jobTitle || (isArabic ? 'مطور واجهات أمامية' : 'Frontend Developer')}
              </p>
            </div>
            <div className="flex flex-col gap-0.5 text-xs text-gray-500 font-mono text-end shrink-0">
              {personalInfo.email && <span><bdi>{personalInfo.email}</bdi></span>}
              {personalInfo.phone && <span><bdi>{personalInfo.phone}</bdi></span>}
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.linkedin && <span><bdi>{personalInfo.linkedin}</bdi></span>}
            </div>
            {settings.showPhoto && personalInfo.photoUrl && (
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className="w-16 h-16 rounded-full object-cover border shrink-0"
                style={{ borderColor: primaryColor }}
              />
            )}
          </div>
        </header>
      );
    }

    if (headerLayout === 'compact') {
      return (
        <header className="mb-4 border-b pb-2.5 border-gray-200">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
            <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
              {personalInfo.fullName || (isArabic ? 'الاسم الكامل' : 'Full Name')}
            </h1>
            <p className="text-xs font-bold text-[#001639]" style={{ color: primaryColor }}>
              {personalInfo.jobTitle || (isArabic ? 'مطور واجهات أمامية' : 'Frontend Developer')}
            </p>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-gray-500 font-mono">
            {personalInfo.email && <bdi>{personalInfo.email}</bdi>}
            {personalInfo.phone && <bdi>• {personalInfo.phone}</bdi>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
            {personalInfo.linkedin && <bdi>• {personalInfo.linkedin}</bdi>}
          </div>
        </header>
      );
    }

    // Centered layout
    return (
      <header className="mb-5 text-center">
        {settings.showPhoto && personalInfo.photoUrl && (
          <img
            src={personalInfo.photoUrl}
            alt={personalInfo.fullName}
            className="w-18 h-18 rounded-full object-cover border mx-auto mb-2"
            style={{ borderColor: primaryColor }}
          />
        )}
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
          {personalInfo.fullName || (isArabic ? 'الاسم الكامل' : 'Full Name')}
        </h1>
        <p className="text-sm font-bold text-[#001639] mt-0.5" style={{ color: primaryColor }}>
          {personalInfo.jobTitle || (isArabic ? 'مطور واجهات أمامية' : 'Frontend Developer')}
        </p>

        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-2 font-mono">
          {personalInfo.email && <bdi>{personalInfo.email}</bdi>}
          {personalInfo.phone && <bdi>• {personalInfo.phone}</bdi>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <bdi>• {personalInfo.linkedin}</bdi>}
        </div>
      </header>
    );
  };

  const renderSummary = () =>
    personalInfo.summary ? (
      <section className="mb-4">
        <p
          className="text-xs text-gray-700 leading-normal border-l-2 pl-3 py-0.5"
          style={{ borderColor: primaryColor }}
        >
          {personalInfo.summary}
        </p>
      </section>
    ) : null;

  const renderExperience = () =>
    experiences && experiences.length > 0 ? (
      <section className="mb-4">
        <h2
          className="text-xs font-bold uppercase tracking-wider text-[#001639] mb-2.5 border-b pb-1 border-gray-200"
          style={{ color: primaryColor }}
        >
          {isArabic ? 'الخبرة العملية' : 'EXPERIENCE'}
        </h2>
        <div className="space-y-3.5">
          {(experiences || []).map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-xs text-gray-900">
                  {exp.position} — <span className="font-semibold text-gray-600">{exp.company}</span>
                </h3>
                <bdi className="date-range text-[11px] text-gray-500 font-sans">
                  {exp.startDate} - {exp.current ? (isArabic ? 'حتى الآن' : 'Present') : exp.endDate}
                </bdi>
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
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#001639] mb-2.5 border-b pb-1 border-gray-200" style={{ color: primaryColor }}>
          {isArabic ? 'المشاريع' : 'PROJECTS'}
        </h2>
        <div className="space-y-3">
          {(projects || []).map((p) => (
            <div key={p.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-xs text-gray-900">
                  {p.title}
                  {p.link && (
                    <span
                      className="text-[10px] font-normal underline ml-2 mr-2"
                      style={{ color: primaryColor }}
                      dir="ltr"
                    >
                      {p.link}
                    </span>
                  )}
                </h3>
                {(p.startDate || p.endDate) && (
                  <bdi className="date-range text-[11px] text-gray-500 font-sans">
                    {p.startDate} {p.endDate ? `- ${p.endDate}` : ''}
                  </bdi>
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
        <h2
          className="text-xs font-bold uppercase tracking-wider text-[#001639] mb-2 border-b pb-1 border-gray-200"
          style={{ color: primaryColor }}
        >
          {isArabic ? 'التعليم' : 'EDUCATION'}
        </h2>
        <div className="space-y-1.5">
          {(education || []).map((edu) => (
            <div key={edu.id} className="flex justify-between text-xs">
              <div>
                <span className="font-bold text-gray-900">{edu.degree}</span> ({edu.fieldOfStudy})
                <p className="text-gray-600">{edu.institution}</p>
              </div>
              <bdi className="date-range text-[11px] text-gray-500 font-sans">{edu.startDate} - {edu.endDate}</bdi>
            </div>
          ))}
        </div>
      </section>
    ) : null;

  const renderSkills = () =>
    skills && skills.length > 0 ? (
      <section className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#001639] mb-2 border-b pb-1 border-gray-200" style={{ color: primaryColor }}>
          {isArabic ? 'المهارات والتقنيات' : 'SKILLS'}
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {(skills || []).map((s) => (
            <span key={s.id} className="text-xs bg-gray-50 text-gray-800 px-2 py-0.5 border rounded-xs inline-flex items-center gap-1.5">
              <span>{s.name}</span>
              {s.level && (
                <span
                  className="text-[9px] font-bold uppercase"
                  style={{ color: primaryColor }}
                >
                  ({isArabic ? (s.level === 'beginner' ? 'مبتدئ' : s.level === 'intermediate' ? 'متوسط' : s.level === 'advanced' ? 'متقدم' : 'خبير') : s.level})
                </span>
              )}
            </span>
          ))}
        </div>
      </section>
    ) : null;

  return (
    <div
      className="resume-template-container w-[210mm] min-h-[297mm] bg-white text-gray-900 p-8 shadow-sm text-sm leading-relaxed text-start"
      dir={docDir}
      style={{
        fontFamily: bodyFont,
        ['--heading-font' as any]: headingFont,
        direction: docDir,
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
      <div className="grid grid-cols-2 gap-4 mt-2 pt-2 border-t border-gray-100">
        {certifications && certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#001639] mb-1.5 border-b pb-1 border-gray-200" style={{ color: primaryColor }}>
              {isArabic ? 'الشهادات' : 'CERTIFICATIONS'}
            </h2>
            <div className="space-y-1 text-xs text-gray-800">
              {(certifications || []).map((c) => (
                <div key={c.id}>
                  <span className="font-semibold">{c.title}</span> – {c.issuer} ({c.date})
                </div>
              ))}
            </div>
          </section>
        )}

        {languages && languages.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#001639] mb-1.5 border-b pb-1 border-gray-200" style={{ color: primaryColor }}>
              {isArabic ? 'اللغات' : 'LANGUAGES'}
            </h2>
            <div className="flex flex-wrap gap-3 text-xs">
              {(languages || []).map((l) => (
                <div key={l.id} className="text-gray-800">
                  <span className="font-semibold">{l.language}</span> ({isArabic ? (l.proficiency === 'native' ? 'اللغة الأم' : l.proficiency === 'fluent' ? 'طلاقة' : l.proficiency === 'advanced' ? 'متقدم' : l.proficiency === 'intermediate' ? 'متوسط' : 'مبتدئ') : l.proficiency})
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
});
