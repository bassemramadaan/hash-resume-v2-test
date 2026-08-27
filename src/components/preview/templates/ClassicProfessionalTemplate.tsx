import React from 'react';
import { ResumeData, ResumeSettings } from '../../../types/resume';

interface TemplateProps {
  data: ResumeData;
  settings: ResumeSettings;
}

export const ClassicProfessionalTemplate: React.FC<TemplateProps> = React.memo(({ data, settings }) => {
  const { personalInfo, experiences, education, skills, projects, certifications, languages } = data;
  const isArabic = settings.language === 'ar';
  const docDir = settings.documentDirection || (isArabic ? 'rtl' : 'ltr');
  const primaryColor = settings.primaryColor || '#111827';
  const headerLayout = settings.headerLayout || 'centered';
  const careerFocus = settings.careerFocus || 'experienced';
  const isFreshGrad = careerFocus === 'fresh-grad';

  const renderHeader = () => {
    if (headerLayout === 'two-column') {
      return (
        <header className="border-b pb-4 mb-4 border-gray-300">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-serif font-bold uppercase tracking-wide text-gray-900 mb-0.5">
                {personalInfo.fullName || (isArabic ? 'الاسم الكامل' : 'Full Name')}
              </h1>
              <p className="text-sm font-medium italic text-gray-700">
                {personalInfo.jobTitle || (isArabic ? 'مطور واجهات أمامية' : 'Frontend Developer')}
              </p>
            </div>
            <div className="text-xs text-gray-600 space-y-0.5 text-end shrink-0">
              {personalInfo.email && <div>{personalInfo.email}</div>}
              {personalInfo.phone && <div>{personalInfo.phone}</div>}
              {personalInfo.location && <div>{personalInfo.location}</div>}
              {personalInfo.linkedin && <div>{personalInfo.linkedin}</div>}
            </div>
            {settings.showPhoto && personalInfo.photoUrl && (
              <img
                src={personalInfo.photoUrl}
                alt={personalInfo.fullName}
                className="w-16 h-16 rounded-full object-cover border border-gray-400 shrink-0"
              />
            )}
          </div>
        </header>
      );
    }

    if (headerLayout === 'compact') {
      return (
        <header className="border-b pb-2.5 mb-3 border-gray-300">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
            <h1 className="text-xl font-serif font-bold uppercase tracking-wide text-gray-900">
              {personalInfo.fullName || (isArabic ? 'الاسم الكامل' : 'Full Name')}
            </h1>
            <p className="text-xs font-bold italic text-gray-700">
              {personalInfo.jobTitle || (isArabic ? 'مطور واجهات أمامية' : 'Frontend Developer')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.location && <span>• {personalInfo.location}</span>}
            {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          </div>
        </header>
      );
    }

    // Centered classic header
    return (
      <header className="text-center border-b pb-4 mb-4 border-gray-300">
        {settings.showPhoto && personalInfo.photoUrl && (
          <img
            src={personalInfo.photoUrl}
            alt={personalInfo.fullName}
            className="w-18 h-18 rounded-full object-cover border border-gray-400 mx-auto mb-2"
          />
        )}
        <h1 className="text-2xl font-serif font-bold uppercase tracking-wide text-gray-900 mb-0.5">
          {personalInfo.fullName || (isArabic ? 'الاسم الكامل' : 'Full Name')}
        </h1>
        <p className="text-sm font-medium italic text-gray-700 mb-2">
          {personalInfo.jobTitle || (isArabic ? 'مطور واجهات أمامية' : 'Frontend Developer')}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-3 text-xs text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
        </div>
      </header>
    );
  };

  const renderSummary = () =>
    personalInfo.summary ? (
      <section className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-1 border-b pb-0.5 border-gray-400">
          {isArabic ? 'الملخص المهني' : 'EXECUTIVE SUMMARY'}
        </h2>
        <p className="text-xs text-gray-800 leading-relaxed italic">{personalInfo.summary}</p>
      </section>
    ) : null;

  const renderExperience = () =>
    experiences && experiences.length > 0 ? (
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
    ) : null;

  const renderProjects = () =>
    projects && projects.length > 0 ? (
      <section className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-2 border-b pb-0.5 border-gray-400">
          {isArabic ? 'المشاريع البارزة' : 'FEATURED PROJECTS'}
        </h2>
        <div className="space-y-3">
          {(projects || []).map((p) => (
            <div key={p.id}>
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-xs text-gray-900">
                  {p.title}
                  {p.link && (
                    <span className="text-[10px] font-normal italic text-indigo-600 ml-1.5 mr-1.5 font-sans">
                      ({p.link})
                    </span>
                  )}
                </span>
                {(p.startDate || p.endDate) && (
                  <span className="text-[11px] font-semibold text-gray-600">
                    {p.startDate} {p.endDate ? `– ${p.endDate}` : ''}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-800 leading-normal">{p.description}</p>
              {p.technologies && p.technologies.length > 0 && (
                <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                  <strong>{isArabic ? 'التقنيات المستخدمة: ' : 'Tech Stack: '}</strong>
                  {p.technologies.join(' • ')}
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
    ) : null;

  const renderSkills = () =>
    skills && skills.length > 0 ? (
      <section className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-1 border-b pb-0.5 border-gray-400">
          {isArabic ? 'المهارات الرئيسية' : 'CORE SKILLS'}
        </h2>
        <p className="text-xs text-gray-800 leading-relaxed font-sans">
          {(skills || []).map((s) => s.level ? `${s.name} (${isArabic ? (s.level === 'beginner' ? 'مبتدئ' : s.level === 'intermediate' ? 'متوسط' : s.level === 'advanced' ? 'متقدم' : 'خبير') : s.level})` : s.name).join(' • ')}
        </p>
      </section>
    ) : null;

  return (
    <div
      className="w-[210mm] min-h-[297mm] bg-white text-gray-900 p-8 shadow-sm text-sm leading-relaxed text-start"
      dir={docDir}
      style={{
        fontFamily: settings.fontFamily === 'Tajawal' ? 'Tajawal, serif' : 'Georgia, serif',
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

      {/* Certifications & Languages */}
      <div className="grid grid-cols-2 gap-4 pt-1">
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
              {(languages || []).map((l) => `${l.language} (${isArabic ? (l.proficiency === 'native' ? 'اللغة الأم' : l.proficiency === 'fluent' ? 'طلاقة' : l.proficiency === 'advanced' ? 'متقدم' : l.proficiency === 'intermediate' ? 'متوسط' : 'مبتدئ') : l.proficiency})`).join(' • ')}
            </p>
          </section>
        )}
      </div>
    </div>
  );
});
