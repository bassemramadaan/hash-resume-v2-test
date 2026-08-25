import React from 'react';
import { ResumeData, ResumeSettings } from '../../../types/resume';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface TemplateProps {
  data: ResumeData;
  settings: ResumeSettings;
}

export const ModernAtsTemplate: React.FC<TemplateProps> = React.memo(({ data, settings }) => {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = data;
  const isArabic = settings.language === 'ar';
  const primaryColor = settings.primaryColor || '#1e40af';
  const headerLayout = settings.headerLayout || 'centered';
  const careerFocus = settings.careerFocus || 'experienced';

  const fontStyle = {
    fontFamily: settings.fontFamily === 'Tajawal' ? 'Tajawal, sans-serif' : 'Inter, sans-serif',
  };

  // Render Header by selected layout
  const renderHeader = () => {
    if (headerLayout === 'two-column') {
      return (
        <header className="border-b-2 pb-4 mb-5" style={{ borderColor: primaryColor }}>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-0.5">
                {personalInfo.fullName || (isArabic ? 'الاسم الكامل' : 'Full Name')}
              </h1>
              <p className="text-sm font-semibold" style={{ color: primaryColor }}>
                {personalInfo.jobTitle || (isArabic ? 'المسمى الوظيفي المستهدف' : 'Target Job Title')}
              </p>
            </div>

            {/* Right-aligned column contact info */}
            <div className="text-xs text-gray-600 space-y-1 text-end shrink-0">
              {personalInfo.email && (
                <div className="flex items-center justify-end gap-1.5">
                  <span>{personalInfo.email}</span>
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center justify-end gap-1.5">
                  <span>{personalInfo.phone}</span>
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center justify-end gap-1.5">
                  <span>{personalInfo.location}</span>
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center justify-end gap-1.5">
                  <span>{personalInfo.linkedin}</span>
                  <Linkedin className="w-3.5 h-3.5 text-gray-400" />
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-center justify-end gap-1.5">
                  <span>{personalInfo.github}</span>
                  <Github className="w-3.5 h-3.5 text-gray-400" />
                </div>
              )}
            </div>

            {settings.showPhoto && personalInfo.photoUrl && (
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className="w-18 h-18 rounded-full object-cover border-2 shadow-xs shrink-0"
                style={{ borderColor: primaryColor }}
              />
            )}
          </div>
        </header>
      );
    }

    if (headerLayout === 'compact') {
      return (
        <header className="border-b pb-2.5 mb-3.5" style={{ borderColor: primaryColor }}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-1.5">
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              {personalInfo.fullName || (isArabic ? 'الاسم الكامل' : 'Full Name')}
            </h1>
            <p className="text-xs font-bold" style={{ color: primaryColor }}>
              {personalInfo.jobTitle || (isArabic ? 'المسمى الوظيفي المستهدف' : 'Target Job Title')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-600">
            {personalInfo.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-gray-400" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-gray-400" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span>{personalInfo.location}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin className="w-3 h-3 text-gray-400" />
                <span>{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-1">
                <Github className="w-3 h-3 text-gray-400" />
                <span>{personalInfo.github}</span>
              </div>
            )}
          </div>
        </header>
      );
    }

    // Centered layout (default)
    return (
      <header className="border-b-2 pb-4 mb-4 text-center" style={{ borderColor: primaryColor }}>
        {settings.showPhoto && personalInfo.photoUrl && (
          <img
            src={personalInfo.photoUrl}
            alt={personalInfo.fullName}
            className="w-20 h-20 rounded-full object-cover border-2 shadow-xs mx-auto mb-2"
            style={{ borderColor: primaryColor }}
          />
        )}
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-0.5">
          {personalInfo.fullName || (isArabic ? 'الاسم الكامل' : 'Full Name')}
        </h1>
        <p className="text-sm font-semibold mb-2" style={{ color: primaryColor }}>
          {personalInfo.jobTitle || (isArabic ? 'المسمى الوظيفي المستهدف' : 'Target Job Title')}
        </p>

        {/* Contact Details Grid */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-600">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-3.5 h-3.5 text-gray-400" />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-1">
              <Github className="w-3.5 h-3.5 text-gray-400" />
              <span>{personalInfo.github}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </header>
    );
  };

  // Section renderers
  const renderSummary = () =>
    personalInfo.summary ? (
      <section key="summary" className="mb-4">
        <h2
          className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-1 border-b"
          style={{ color: primaryColor, borderColor: `${primaryColor}30` }}
        >
          {isArabic ? 'الملخص المهني' : 'PROFESSIONAL SUMMARY'}
        </h2>
        <p className="text-gray-700 text-xs leading-normal">{personalInfo.summary}</p>
      </section>
    ) : null;

  const renderExperience = () =>
    experiences && experiences.length > 0 ? (
      <section key="experiences" className="mb-4">
        <h2
          className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b"
          style={{ color: primaryColor, borderColor: `${primaryColor}30` }}
        >
          {isArabic ? 'الخبرات العملية' : 'WORK EXPERIENCE'}
        </h2>
        <div className="space-y-3.5">
          {(experiences || []).map((exp) => (
            <div key={exp.id} className="relative pl-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="font-bold text-gray-900 text-xs">
                  {exp.position}{' '}
                  <span className="font-semibold text-gray-600">| {exp.company}</span>
                </h3>
                <span className="text-[11px] font-medium text-gray-500">
                  {exp.startDate} - {exp.current ? (isArabic ? 'حتى الآن' : 'Present') : exp.endDate}
                </span>
              </div>
              {exp.location && (
                <p className="text-[11px] text-gray-500 mb-1">{exp.location}</p>
              )}
              {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-700">
                  {(exp.bulletPoints || []).map((bullet, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    ) : null;

  const renderEducation = () =>
    education && education.length > 0 ? (
      <section key="education" className="mb-4">
        <h2
          className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b"
          style={{ color: primaryColor, borderColor: `${primaryColor}30` }}
        >
          {isArabic ? 'التعليم والمؤهلات' : 'EDUCATION'}
        </h2>
        <div className="space-y-2">
          {(education || []).map((edu) => (
            <div key={edu.id} className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900 text-xs">
                  {edu.degree} - {edu.fieldOfStudy}
                </h3>
                <p className="text-xs text-gray-600">{edu.institution}</p>
                {edu.gpa && <p className="text-[11px] text-gray-500">{edu.gpa}</p>}
              </div>
              <span className="text-[11px] text-gray-500">
                {edu.startDate} - {edu.endDate}
              </span>
            </div>
          ))}
        </div>
      </section>
    ) : null;

  const renderSkills = () =>
    skills && skills.length > 0 ? (
      <section key="skills" className="mb-4">
        <h2
          className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
          style={{ color: primaryColor, borderColor: `${primaryColor}30` }}
        >
          {isArabic ? 'المهارات والتقنيات' : 'SKILLS & COMPETENCIES'}
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {(skills || []).map((skill) => (
            <span
              key={skill.id}
              className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded-sm text-[11px] font-medium border border-gray-200 inline-flex items-center gap-1.5"
            >
              <span>{skill.name}</span>
              {skill.level && (
                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded-xs uppercase leading-none scale-90">
                  {skill.level}
                </span>
              )}
            </span>
          ))}
        </div>
      </section>
    ) : null;

  const renderProjects = () =>
    projects && projects.length > 0 ? (
      <section key="projects" className="mb-4">
        <h2
          className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
          style={{ color: primaryColor, borderColor: `${primaryColor}30` }}
        >
          {isArabic ? 'المشاريع والإنجازات' : 'KEY PROJECTS'}
        </h2>
        <div className="space-y-2">
          {(projects || []).map((proj) => (
            <div key={proj.id}>
              <div className="flex justify-between items-baseline">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 text-xs">{proj.title}</h3>
                  {proj.link && (
                    <span className="text-[10px] text-blue-600 underline">{proj.link}</span>
                  )}
                </div>
                {(proj.startDate || proj.endDate) && (
                  <span className="text-[10px] text-gray-500 font-medium">
                    {proj.startDate} {proj.endDate ? `– ${proj.endDate}` : ''}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-700">{proj.description}</p>
              {proj.technologies && proj.technologies.length > 0 && (
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {isArabic ? 'التقنيات المستخدمة: ' : 'Tech Stack: '}
                  {proj.technologies.join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    ) : null;

  // Build section sequence based on Career Focus (Fresh Grad vs Experienced)
  const isFreshGrad = careerFocus === 'fresh-grad';

  return (
    <div
      className="w-[210mm] min-h-[297mm] bg-white text-gray-900 p-8 shadow-sm transition-all duration-200 text-sm leading-relaxed text-start"
      dir={isArabic ? 'rtl' : 'ltr'}
      style={{ ...fontStyle, direction: isArabic ? 'rtl' : 'ltr' }}
    >
      {/* Header */}
      {renderHeader()}

      {/* Summary */}
      {renderSummary()}

      {/* Dynamic Order: If fresh-grad -> Education & Projects & Skills first */}
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
      <div className="grid grid-cols-2 gap-4 pt-1">
        {certifications && certifications.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
              style={{ color: primaryColor, borderColor: `${primaryColor}30` }}
            >
              {isArabic ? 'الشهادات المعتمدة' : 'CERTIFICATIONS'}
            </h2>
            <div className="space-y-1.5">
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
            <h2
              className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b"
              style={{ color: primaryColor, borderColor: `${primaryColor}30` }}
            >
              {isArabic ? 'اللغات' : 'LANGUAGES'}
            </h2>
            <div className="flex flex-wrap gap-2 text-xs">
              {(languages || []).map((lang) => (
                <div key={lang.id} className="text-gray-800">
                  <span className="font-semibold">{lang.language}</span> ({lang.proficiency})
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
});
