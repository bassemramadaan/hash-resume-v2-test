import {
  ResumeData,
  WorkExperience,
  Education,
  SkillItem,
  Project,
  Certification,
  LanguageItem,
  Language,
} from '../types/resume';
import { createEmptyResume } from '../store/useResumeStore';

// Lazily load pdfjs-dist on demand in the browser to optimize bundle size
async function getPdfJsLib() {
  const pdfjsLib = await import('pdfjs-dist');
  if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    try {
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
        'pdfjs-dist/build/pdf.worker.min.mjs',
        import.meta.url
      ).toString();
    } catch {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;
    }
  }
  return pdfjsLib;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export interface ParseResult {
  resumeData: ResumeData;
  summary: {
    hasPersonalInfo: boolean;
    experienceCount: number;
    educationCount: number;
    skillCount: number;
    projectCount: number;
    certificationCount: number;
    languageCount: number;
    detectedName?: string;
    detectedJobTitle?: string;
  };
}

/**
 * Checks if a given resume data object has meaningful content
 */
export function isResumeEmpty(data: ResumeData): boolean {
  const p = data.personalInfo;
  const hasPersonal = Boolean(
    p.fullName?.trim() ||
    p.jobTitle?.trim() ||
    p.email?.trim() ||
    p.phone?.trim() ||
    p.summary?.trim()
  );
  const hasExp = (data.experiences || []).length > 0;
  const hasEdu = (data.education || []).length > 0;
  const hasSkills = (data.skills || []).length > 0;
  const hasProjects = (data.projects || []).length > 0;
  const hasCerts = (data.certifications || []).length > 0;
  const hasLangs = (data.languages || []).length > 0;

  return !hasPersonal && !hasExp && !hasEdu && !hasSkills && !hasProjects && !hasCerts && !hasLangs;
}

/**
 * Merges imported resume data into existing resume data without overwriting filled fields
 */
export function mergeResumeData(existing: ResumeData, incoming: ResumeData): ResumeData {
  const merged: ResumeData = {
    personalInfo: {
      fullName: existing.personalInfo.fullName || incoming.personalInfo.fullName || '',
      jobTitle: existing.personalInfo.jobTitle || incoming.personalInfo.jobTitle || '',
      email: existing.personalInfo.email || incoming.personalInfo.email || '',
      phone: existing.personalInfo.phone || incoming.personalInfo.phone || '',
      location: existing.personalInfo.location || incoming.personalInfo.location || '',
      linkedin: existing.personalInfo.linkedin || incoming.personalInfo.linkedin || '',
      github: existing.personalInfo.github || incoming.personalInfo.github || '',
      website: existing.personalInfo.website || incoming.personalInfo.website || '',
      photoUrl: existing.personalInfo.photoUrl || incoming.personalInfo.photoUrl || '',
      summary: existing.personalInfo.summary || incoming.personalInfo.summary || '',
    },
    experiences: [
      ...existing.experiences,
      ...incoming.experiences.filter(
        (inc) => !existing.experiences.some((ex) => ex.company.toLowerCase() === inc.company.toLowerCase() && ex.position.toLowerCase() === inc.position.toLowerCase())
      ),
    ],
    education: [
      ...existing.education,
      ...incoming.education.filter(
        (inc) => !existing.education.some((ex) => ex.institution.toLowerCase() === inc.institution.toLowerCase() && ex.degree.toLowerCase() === inc.degree.toLowerCase())
      ),
    ],
    skills: [
      ...existing.skills,
      ...incoming.skills.filter(
        (inc) => !existing.skills.some((ex) => ex.name.toLowerCase() === inc.name.toLowerCase())
      ),
    ],
    projects: [
      ...existing.projects,
      ...incoming.projects.filter(
        (inc) => !existing.projects.some((ex) => ex.title.toLowerCase() === inc.title.toLowerCase())
      ),
    ],
    certifications: [
      ...existing.certifications,
      ...incoming.certifications.filter(
        (inc) => !existing.certifications.some((ex) => ex.title.toLowerCase() === inc.title.toLowerCase())
      ),
    ],
    languages: [
      ...existing.languages,
      ...incoming.languages.filter(
        (inc) => !existing.languages.some((ex) => ex.language.toLowerCase() === inc.language.toLowerCase())
      ),
    ],
    customSections: existing.customSections || incoming.customSections || [],
  };

  return merged;
}

/**
 * Validates and normalizes JSON resume structure
 */
export function normalizeJsonResume(jsonObj: any): ResumeData {
  if (!jsonObj || typeof jsonObj !== 'object') {
    throw new Error('INVALID_JSON');
  }

  const base = createEmptyResume();
  const rawPersonal = jsonObj.personalInfo || jsonObj.personal || jsonObj.basics || jsonObj.contact || jsonObj.info || {};

  base.personalInfo = {
    fullName: String(rawPersonal.fullName || rawPersonal.name || rawPersonal.full_name || jsonObj.fullName || jsonObj.name || '').trim(),
    jobTitle: String(rawPersonal.jobTitle || rawPersonal.targetJobTitle || rawPersonal.title || rawPersonal.headline || rawPersonal.position || jsonObj.jobTitle || '').trim(),
    email: String(rawPersonal.email || rawPersonal.mail || jsonObj.email || '').trim(),
    phone: String(rawPersonal.phone || rawPersonal.telephone || rawPersonal.mobile || rawPersonal.tel || jsonObj.phone || '').trim(),
    location: String(rawPersonal.location || rawPersonal.city || rawPersonal.address || jsonObj.location || '').trim(),
    linkedin: String(rawPersonal.linkedin || rawPersonal.linkedInUrl || rawPersonal.linkedinUrl || jsonObj.linkedin || '').trim(),
    github: String(rawPersonal.github || rawPersonal.githubUrl || jsonObj.github || '').trim(),
    website: String(rawPersonal.website || rawPersonal.portfolio || rawPersonal.websiteUrl || jsonObj.website || '').trim(),
    photoUrl: String(rawPersonal.photoUrl || rawPersonal.photo || rawPersonal.avatar || jsonObj.photoUrl || '').trim(),
    summary: String(rawPersonal.summary || rawPersonal.about || rawPersonal.bio || rawPersonal.objective || jsonObj.summary || '').trim(),
  };

  // Experiences
  const rawExp = jsonObj.experiences || jsonObj.experience || jsonObj.workExperience || jsonObj.work_experience || jsonObj.work || [];
  if (Array.isArray(rawExp)) {
    base.experiences = rawExp.map((item: any) => ({
      id: item.id || generateId(),
      company: String(item.company || item.companyName || item.employer || item.organization || '').trim(),
      position: String(item.position || item.jobTitle || item.role || item.title || '').trim(),
      location: String(item.location || item.city || '').trim(),
      startDate: String(item.startDate || item.start || item.from || '').trim(),
      endDate: String(item.endDate || item.end || item.to || '').trim(),
      current: Boolean(item.current || item.isCurrent),
      bulletPoints: Array.isArray(item.bulletPoints)
        ? item.bulletPoints.map(String)
        : Array.isArray(item.bullets)
        ? item.bullets.map(String)
        : typeof item.description === 'string'
        ? item.description.split(/\n|•/).map((s: string) => s.trim()).filter(Boolean)
        : [],
    })).filter((e) => e.company || e.position || e.bulletPoints.length > 0);
  }

  // Education
  const rawEdu = jsonObj.education || jsonObj.educations || jsonObj.academic || jsonObj.studies || [];
  if (Array.isArray(rawEdu)) {
    base.education = rawEdu.map((item: any) => ({
      id: item.id || generateId(),
      institution: String(item.institution || item.school || item.university || item.college || '').trim(),
      degree: String(item.degree || item.degreeTitle || '').trim(),
      fieldOfStudy: String(item.fieldOfStudy || item.major || item.field || item.area || '').trim(),
      startDate: String(item.startDate || item.start || item.from || '').trim(),
      endDate: String(item.endDate || item.end || item.to || '').trim(),
      gpa: String(item.gpa || item.grade || item.score || '').trim() || undefined,
      description: String(item.description || '').trim() || undefined,
    })).filter((e) => e.institution || e.degree);
  }

  // Skills
  const rawSkills = jsonObj.skills || jsonObj.skillList || jsonObj.keywords || [];
  if (Array.isArray(rawSkills)) {
    base.skills = rawSkills.map((item: any) => {
      if (typeof item === 'string') {
        return {
          id: generateId(),
          name: item.trim(),
          category: 'technical' as const,
        };
      }
      return {
        id: item.id || generateId(),
        name: String(item.name || item.skill || item.title || '').trim(),
        category: (item.category || 'technical') as any,
        level: item.level,
      };
    }).filter((s) => s.name);
  }

  // Projects
  const rawProjects = jsonObj.projects || jsonObj.portfolioProjects || [];
  if (Array.isArray(rawProjects)) {
    base.projects = rawProjects.map((item: any) => ({
      id: item.id || generateId(),
      title: String(item.title || item.name || '').trim(),
      description: String(item.description || item.summary || '').trim(),
      technologies: Array.isArray(item.technologies) ? item.technologies.map(String) : [],
      link: String(item.link || item.url || item.github || '').trim() || undefined,
      startDate: String(item.startDate || item.start || '').trim() || undefined,
      endDate: String(item.endDate || item.end || '').trim() || undefined,
    })).filter((p) => p.title);
  }

  // Certifications
  const rawCerts = jsonObj.certifications || jsonObj.certificates || jsonObj.courses || [];
  if (Array.isArray(rawCerts)) {
    base.certifications = rawCerts.map((item: any) => ({
      id: item.id || generateId(),
      title: String(item.title || item.name || '').trim(),
      issuer: String(item.issuer || item.organization || item.authority || '').trim(),
      date: String(item.date || item.issueDate || item.year || '').trim(),
      credentialUrl: String(item.credentialUrl || item.url || '').trim() || undefined,
    })).filter((c) => c.title);
  }

  // Languages
  const rawLangs = jsonObj.languages || jsonObj.languagesList || [];
  if (Array.isArray(rawLangs)) {
    base.languages = rawLangs.map((item: any) => {
      if (typeof item === 'string') {
        return {
          id: generateId(),
          language: item.trim(),
          proficiency: 'fluent' as const,
        };
      }
      return {
        id: item.id || generateId(),
        language: String(item.language || item.name || '').trim(),
        proficiency: item.proficiency || 'fluent',
      };
    }).filter((l) => l.language);
  }

  if (isResumeEmpty(base)) {
    throw new Error('INVALID_JSON');
  }

  return base;
}

/**
 * Extracts raw lines from PDF ArrayBuffer via pdfjs-dist
 */
async function extractTextFromPdf(arrayBuffer: ArrayBuffer, language: Language): Promise<string[]> {
  const isAr = language === 'ar';
  const pdfjsLib = await getPdfJsLib();

  let pdfDoc: any;
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    });
    pdfDoc = await loadingTask.promise;
  } catch (err: any) {
    if (err?.name === 'PasswordException' || err?.message?.toLowerCase()?.includes('password') || err?.message?.toLowerCase()?.includes('encrypted')) {
      throw new Error(isAr ? 'ملف الـ PDF محمي بكلمة مرور. يرجى رفع ملف غير مقفل.' : 'This PDF is password protected. Please upload an unlocked PDF.');
    }
    throw new Error(isAr ? 'تعذر فتح ملف الـ PDF. يرجى التأكد من سلامة الملف.' : 'Could not open PDF file. Please ensure the file is valid.');
  }

  const lines: string[] = [];
  let totalRawChars = 0;

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const items = textContent.items as Array<{ str: string; transform: number[] }>;

    if (!items || items.length === 0) continue;

    // Group items by vertical position (Y-coord) to reconstruct lines accurately
    const lineMap: { y: number; text: string }[] = [];

    for (const item of items) {
      if (!item.str) continue;
      totalRawChars += item.str.trim().length;

      const y = Math.round(item.transform[5]);
      const existingLine = lineMap.find((l) => Math.abs(l.y - y) <= 4);
      if (existingLine) {
        existingLine.text += (existingLine.text ? ' ' : '') + item.str.trim();
      } else {
        lineMap.push({ y, text: item.str.trim() });
      }
    }

    // Sort descending by Y (top to bottom of page)
    lineMap.sort((a, b) => b.y - a.y);
    for (const l of lineMap) {
      const clean = l.text.trim();
      if (clean) lines.push(clean);
    }
  }

  if (totalRawChars < 30 || lines.length === 0) {
    throw new Error(
      isAr
        ? 'يبدو أن ملف PDF هذا عبارة عن صورة ممسوحة ضوئياً. يرجى رفع ملف نصي أو إدخال البيانات يدوياً.'
        : 'This PDF appears to be scanned or image-only. Please upload a text-based PDF or enter the details manually.'
    );
  }

  return lines;
}

/**
 * Intelligent client-side rule-based CV parser for English and Arabic text
 */
export function parseCvTextLines(lines: string[]): ResumeData {
  const resume = createEmptyResume();
  const allText = lines.join('\n');

  // 1. Extract Contact Info & Links
  const emailMatch = allText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) resume.personalInfo.email = emailMatch[0].trim();

  const phoneMatch = allText.match(/(?:\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/);
  if (phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 8) {
    resume.personalInfo.phone = phoneMatch[0].trim();
  }

  const linkedinMatch = allText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) {
    resume.personalInfo.linkedin = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`;
  }

  const githubMatch = allText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  if (githubMatch) {
    resume.personalInfo.github = githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`;
  }

  // 2. Identify Sections
  interface SectionHeader {
    type: 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages';
    lineIndex: number;
    title: string;
  }

  const SECTION_PATTERNS: Array<{
    type: SectionHeader['type'];
    regex: RegExp;
  }> = [
    {
      type: 'summary',
      regex: /^(?:النبذة\s+الشخصية|الملخص\s+المهني|الملخص|الهدف\s+المهني|نبذة\s+عني|نبذة\s+شخصية|Professional\s+Summary|Executive\s+Summary|Summary|Profile|About\s+Me|Objective)(?:[:\-\s]|$)/i,
    },
    {
      type: 'experience',
      regex: /^(?:الخبرات\s+المهنية|الخبرة\s+المهنية|الخبرات\s+السابقة|الخبرات|سجل\s+العمل|التاريخ\s+المهني|الخبرة|Work\s+Experience|Professional\s+Experience|Experience|Employment\s+History|Work\s+History)(?:[:\-\s]|$)/i,
    },
    {
      type: 'education',
      regex: /^(?:المؤهلات\s+التعليمية|المؤهل\s+الدراسي|التعليم|الشهادات\s+الأكاديمية|الدرجات\s+العلمية|المؤهل\s+العلمي|Education|Academic\s+Background|Academic\s+History|Qualifications)(?:[:\-\s]|$)/i,
    },
    {
      type: 'skills',
      regex: /^(?:المهارات\s+التقنية|المهارات\s+المهنية|المهارات|الكفاءات|القدرات|المهارات\s+والخبرات|Skills|Technical\s+Skills|Key\s+Skills|Core\s+Competencies|Expertise|Proficiencies)(?:[:\-\s]|$)/i,
    },
    {
      type: 'projects',
      regex: /^(?:المشاريع\s+السابقة|أبرز\s+المشاريع|المشاريع|الأعمال|المشاريع\s+الشخصية|Projects|Key\s+Projects|Personal\s+Projects|Notable\s+Projects)(?:[:\-\s]|$)/i,
    },
    {
      type: 'certifications',
      regex: /^(?:الشهادات\s+المهنية|الدورات\s+التدريبية|الشهادات|التراخيص|الدورات|Certifications|Certificates|Courses|Licenses|Accreditations)(?:[:\-\s]|$)/i,
    },
    {
      type: 'languages',
      regex: /^(?:اللغات\s+المتقنة|اللغات|Languages|Language\s+Proficiency)(?:[:\-\s]|$)/i,
    },
  ];

  const detectedHeaders: SectionHeader[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Section headers are usually short (< 40 chars)
    if (line.length > 45) continue;

    for (const pat of SECTION_PATTERNS) {
      if (pat.regex.test(line)) {
        detectedHeaders.push({
          type: pat.type,
          lineIndex: i,
          title: line,
        });
        break;
      }
    }
  }

  // 3. Extract Name & Job Title from top lines (before first section)
  const firstHeaderIndex = detectedHeaders.length > 0 ? detectedHeaders[0].lineIndex : Math.min(6, lines.length);
  const headerLines = lines.slice(0, firstHeaderIndex).filter((l) => {
    // Filter out email, phone, links
    return (
      !l.includes('@') &&
      !l.match(/linkedin\.com/i) &&
      !l.match(/github\.com/i) &&
      !l.match(/(?:\+?\d{1,4}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}/)
    );
  });

  if (headerLines.length > 0) {
    // First valid clean line is usually Name
    resume.personalInfo.fullName = headerLines[0].replace(/^(Name|الاسم|Full Name)\s*[:\-]/i, '').trim();
    if (headerLines.length > 1) {
      resume.personalInfo.jobTitle = headerLines[1].replace(/^(Title|المسمى الوظيفي|Position)\s*[:\-]/i, '').trim();
    }
  }

  // Look for location keywords
  const locationPatterns = [
    /Cairo|Alexandria|Giza|Riyadh|Jeddah|Dammam|Dubai|Abu Dhabi|Amman|Beirut|London|Paris|New York/i,
    /القاهرة|الإسكندرية|الجيزة|الرياض|جدة|الدمام|دبي|أبوظبي|عمان|بيروت|مصر|السعودية|الإمارات/,
  ];
  for (let i = 0; i < Math.min(8, lines.length); i++) {
    for (const lp of locationPatterns) {
      if (lp.test(lines[i])) {
        resume.personalInfo.location = lines[i].trim();
        break;
      }
    }
    if (resume.personalInfo.location) break;
  }

  // 4. Parse Sections Content
  for (let i = 0; i < detectedHeaders.length; i++) {
    const current = detectedHeaders[i];
    const next = detectedHeaders[i + 1];
    const sectionLines = lines.slice(current.lineIndex + 1, next ? next.lineIndex : undefined);

    switch (current.type) {
      case 'summary':
        resume.personalInfo.summary = sectionLines.join(' ').trim();
        break;

      case 'skills': {
        const rawSkillsText = sectionLines.join(' ');
        const splitSkills = rawSkillsText
          .split(/[,•|/;\n\t]+/)
          .map((s) => s.trim())
          .filter((s) => s.length >= 2 && s.length <= 40);

        const uniqueSkills = Array.from(new Set(splitSkills));
        resume.skills = uniqueSkills.map((s) => ({
          id: generateId(),
          name: s,
          category: 'technical',
        }));
        break;
      }

      case 'experience': {
        let currentExp: WorkExperience | null = null;
        for (const line of sectionLines) {
          const isBullet = /^[•\-*–\d.]\s+/.test(line);
          const cleanLine = line.replace(/^[•\-*–\d.]\s+/, '').trim();

          // Check if line looks like a job header (Company / Title or dates)
          const hasDate = /(?:\b(?:19|20)\d{2}\b|Present|Current|الآن|حتى الآن)/i.test(line);

          if (!isBullet && (hasDate || !currentExp || currentExp.bulletPoints.length > 0)) {
            // Start a new experience item
            if (currentExp) {
              resume.experiences.push(currentExp);
            }

            const parts = line.split(/[-|–,]/).map((p) => p.trim());
            currentExp = {
              id: generateId(),
              position: parts[0] || 'Software Engineer',
              company: parts[1] || parts[0] || '',
              location: parts[2] || '',
              startDate: '2021',
              endDate: 'Present',
              current: /Present|Current|الآن/i.test(line),
              bulletPoints: [],
            };
          } else if (currentExp) {
            currentExp.bulletPoints.push(cleanLine);
          }
        }
        if (currentExp) {
          resume.experiences.push(currentExp);
        }
        break;
      }

      case 'education': {
        let currentEdu: Education | null = null;
        for (const line of sectionLines) {
          const isEduHeader = /(?:Bachelor|Master|PhD|BSc|MSc|Diploma|University|College|Institute|بكالوريوس|ماجستير|دبلوم|دكتوراه|جامعة|كلية|معهد)/i.test(line);

          if (isEduHeader || !currentEdu) {
            if (currentEdu) {
              resume.education.push(currentEdu);
            }
            const parts = line.split(/[-|,–]/).map((p) => p.trim());
            currentEdu = {
              id: generateId(),
              degree: parts[0] || 'Bachelor Degree',
              institution: parts[1] || parts[0] || 'University',
              fieldOfStudy: parts[2] || '',
              startDate: '2017',
              endDate: '2021',
            };
          } else if (currentEdu && !currentEdu.description) {
            currentEdu.description = line.trim();
          }
        }
        if (currentEdu) {
          resume.education.push(currentEdu);
        }
        break;
      }

      case 'projects': {
        let currentProj: Project | null = null;
        for (const line of sectionLines) {
          const isBullet = /^[•\-*–\d.]\s+/.test(line);
          const cleanLine = line.replace(/^[•\-*–\d.]\s+/, '').trim();

          if (!isBullet && (!currentProj || currentProj.description)) {
            if (currentProj) {
              resume.projects.push(currentProj);
            }
            currentProj = {
              id: generateId(),
              title: cleanLine,
              description: '',
              technologies: [],
            };
          } else if (currentProj) {
            currentProj.description = currentProj.description
              ? `${currentProj.description} ${cleanLine}`
              : cleanLine;
          }
        }
        if (currentProj) {
          resume.projects.push(currentProj);
        }
        break;
      }

      case 'certifications': {
        for (const line of sectionLines) {
          const clean = line.replace(/^[•\-*–\d.]\s+/, '').trim();
          if (clean.length > 3) {
            const parts = clean.split(/[-|,–]/).map((p) => p.trim());
            resume.certifications.push({
              id: generateId(),
              title: parts[0] || clean,
              issuer: parts[1] || 'Accredited Issuer',
              date: parts[2] || '',
            });
          }
        }
        break;
      }

      case 'languages': {
        const rawLangs = sectionLines.join(' ').split(/[,•|/;\n\t]+/).map((s) => s.trim()).filter(Boolean);
        for (const lang of rawLangs) {
          if (lang.length >= 2 && lang.length <= 25) {
            resume.languages.push({
              id: generateId(),
              language: lang,
              proficiency: 'fluent',
            });
          }
        }
        break;
      }
    }
  }

  return resume;
}

/**
 * Main client-side resume file parser (JSON & PDF)
 * Completely 100% in-browser, zero external API calls or tracking
 */
export async function parseResumeFile(
  file: File,
  language: Language = 'ar'
): Promise<ParseResult> {
  const isAr = language === 'ar';

  // 1. File Size Check (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error(
      isAr ? 'يجب ألا يتجاوز حجم الملف 10 ميجابايت.' : 'The file must be 10 MB or smaller.'
    );
  }

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  // 2. JSON Parser
  if (fileName.endsWith('.json') || fileType.includes('json')) {
    try {
      const text = await file.text();
      const jsonObj = JSON.parse(text);
      const resumeData = normalizeJsonResume(jsonObj);

      return {
        resumeData,
        summary: {
          hasPersonalInfo: Boolean(resumeData.personalInfo.fullName || resumeData.personalInfo.email),
          experienceCount: resumeData.experiences.length,
          educationCount: resumeData.education.length,
          skillCount: resumeData.skills.length,
          projectCount: resumeData.projects.length,
          certificationCount: resumeData.certifications.length,
          languageCount: resumeData.languages.length,
          detectedName: resumeData.personalInfo.fullName,
          detectedJobTitle: resumeData.personalInfo.jobTitle,
        },
      };
    } catch (err: any) {
      if (err.message === 'INVALID_JSON') {
        throw new Error(
          isAr
            ? 'ملف JSON هذا ليس تصديراً صالحاً للسيرة الذاتية.'
            : 'This JSON file is not a valid Hash Resume export.'
        );
      }
      throw new Error(
        isAr
          ? 'ملف JSON غير صالح أو به أخطاء في التنسيق.'
          : 'Invalid JSON file. Please verify the file format.'
      );
    }
  }

  // 3. PDF Parser
  if (fileName.endsWith('.pdf') || fileType.includes('pdf')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const extractedLines = await extractTextFromPdf(arrayBuffer, language);
      const resumeData = parseCvTextLines(extractedLines);

      if (isResumeEmpty(resumeData)) {
        throw new Error(
          isAr
            ? 'لم نتمكن من استخراج نصوص واضحة من ملف PDF هذا.'
            : 'We could not extract readable text from this PDF.'
        );
      }

      return {
        resumeData,
        summary: {
          hasPersonalInfo: Boolean(resumeData.personalInfo.fullName || resumeData.personalInfo.email),
          experienceCount: resumeData.experiences.length,
          educationCount: resumeData.education.length,
          skillCount: resumeData.skills.length,
          projectCount: resumeData.projects.length,
          certificationCount: resumeData.certifications.length,
          languageCount: resumeData.languages.length,
          detectedName: resumeData.personalInfo.fullName,
          detectedJobTitle: resumeData.personalInfo.jobTitle,
        },
      };
    } catch (err: any) {
      // Re-throw user-friendly messages directly
      if (err.message && (
        err.message.includes('PDF') ||
        err.message.includes('ممسوحة') ||
        err.message.includes('ميجابايت') ||
        err.message.includes('نصوص')
      )) {
        throw err;
      }
      throw new Error(
        isAr
          ? 'فشل استيراد السيرة الذاتية. يرجى تجربة ملف آخر أو إدخال البيانات يدوياً.'
          : 'Import failed. Please try another file or fill in the form manually.'
      );
    }
  }

  // 4. Unsupported File Type
  throw new Error(
    isAr
      ? 'يرجى رفع ملف سيرة ذاتية بصيغة PDF أو JSON.'
      : 'Please upload a PDF or JSON resume file.'
  );
}
