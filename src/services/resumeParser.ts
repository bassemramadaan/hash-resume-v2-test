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
 * Supports multi-column layouts, sorts by X/Y coordinates, and normalizes Arabic presentation forms
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

  interface PlacedItem {
    str: string;
    x: number;
    y: number;
  }

  const allLines: string[] = [];
  let totalRawChars = 0;

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const textContent = await page.getTextContent();
    const rawItems = (textContent.items || []) as Array<{ str: string; transform: number[] }>;

    if (!rawItems || rawItems.length === 0) continue;

    const items: PlacedItem[] = [];
    for (const it of rawItems) {
      if (!it.str) continue;
      // Normalize NFKC converts Arabic presentation forms (e.g. \uFE80) into standard Unicode Arabic letters
      const normalized = it.str.normalize('NFKC').trim();
      if (!normalized) continue;
      totalRawChars += normalized.length;

      items.push({
        str: normalized,
        x: Math.round(it.transform?.[4] || 0),
        y: Math.round(it.transform?.[5] || 0),
      });
    }

    if (items.length === 0) continue;

    // Detect if page has two distinct columns (sidebar vs main content)
    let minX = Infinity;
    let maxX = -Infinity;
    for (const item of items) {
      if (item.x < minX) minX = item.x;
      if (item.x > maxX) maxX = item.x;
    }

    const pageWidth = maxX - minX;
    let columnSplitX: number | null = null;

    if (pageWidth > 260 && items.length > 12) {
      const candidateLeft = minX + pageWidth * 0.22;
      const candidateRight = minX + pageWidth * 0.60;

      // Check unique X starting positions for a gutter
      const sortedX = [...new Set(items.map((it) => it.x))].sort((a, b) => a - b);
      let bestGap = 0;
      let bestSplit = 0;

      for (let j = 0; j < sortedX.length - 1; j++) {
        const x1 = sortedX[j];
        const x2 = sortedX[j + 1];
        if (x1 >= candidateLeft && x2 <= candidateRight) {
          const gap = x2 - x1;
          if (gap > bestGap && gap >= 18) {
            bestGap = gap;
            bestSplit = (x1 + x2) / 2;
          }
        }
      }

      if (bestGap >= 18) {
        const leftCount = items.filter((it) => it.x < bestSplit).length;
        const rightCount = items.filter((it) => it.x >= bestSplit).length;
        if (leftCount >= 4 && rightCount >= 4) {
          columnSplitX = bestSplit;
        }
      }
    }

    const extractLinesFromItems = (itemList: PlacedItem[]) => {
      // Group items by vertical position with 4px tolerance
      const lineMap: { y: number; items: PlacedItem[] }[] = [];
      for (const item of itemList) {
        const existing = lineMap.find((l) => Math.abs(l.y - item.y) <= 4);
        if (existing) {
          existing.items.push(item);
        } else {
          lineMap.push({ y: item.y, items: [item] });
        }
      }

      // Sort lines top to bottom (Y descending in PDF coordinate space)
      lineMap.sort((a, b) => b.y - a.y);

      const pageLines: string[] = [];
      for (const line of lineMap) {
        // Sort items left-to-right on the same line
        line.items.sort((a, b) => a.x - b.x);
        const joined = line.items.map((it) => it.str).join(' ').trim();
        if (joined) {
          pageLines.push(joined);
        }
      }
      return pageLines;
    };

    if (columnSplitX !== null) {
      // Multi-column page: extract columns separately to prevent sidebar text interleaving with main body
      const leftItems = items.filter((it) => it.x < columnSplitX);
      const rightItems = items.filter((it) => it.x >= columnSplitX);

      const leftLines = extractLinesFromItems(leftItems);
      const rightLines = extractLinesFromItems(rightItems);

      // In English/standard CVs, sidebar is often on the left, but header name can be on top
      allLines.push(...leftLines);
      allLines.push(...rightLines);
    } else {
      // Single-column flow
      allLines.push(...extractLinesFromItems(items));
    }
  }

  if (totalRawChars < 20 || allLines.length === 0) {
    throw new Error(
      isAr
        ? 'يبدو أن ملف PDF هذا عبارة عن صورة ممسوحة ضوئياً. يرجى رفع ملف نصي أو إدخال البيانات يدوياً.'
        : 'This PDF appears to be scanned or image-only. Please upload a text-based PDF or enter the details manually.'
    );
  }

  return allLines;
}

/**
 * Robust candidate name detector from lines & email address
 */
function detectCandidateName(lines: string[], email?: string, maxSearchLines: number = 8): string {
  // 1. Explicit name line: Name: Bassem Ramadan or الاسم: باسم رمضان
  for (const line of lines.slice(0, Math.min(15, lines.length))) {
    const m = line.match(/^(?:Name|Full Name|الاسم|اسم المرشح)\s*[:\-]\s*(.+)$/i);
    if (m && m[1].trim()) return m[1].trim();
  }

  // Action verbs or resume buzzwords to reject as names
  const nonNameWords = /^(?:building|developing|developed|managing|managed|created|creating|implemented|designing|designed|working|worked|handling|handled|spearheaded|leading|responsible|seeking|passionate|motivated|experienced|تطوير|بناء|تصميم|إدارة|تنفيذ|خبرة|العمل|مسؤول|باحث)/i;

  // 2. Look in header lines (before first section header) for a clean name candidate
  const searchLimit = Math.min(maxSearchLines, lines.length);
  for (const line of lines.slice(0, searchLimit)) {
    const clean = line.replace(/^[•\-*–\d.]\s+/, '').trim();
    if (clean.includes('@') || clean.includes('http') || clean.includes('.com') || clean.includes('www.')) continue;
    if (/\d/.test(clean)) continue;
    if (clean.length < 3 || clean.length > 35) continue;
    
    // Skip common headings, titles, prepositions or locations
    if (/summary|experience|education|skills|profile|contact|cairo|egypt|giza|riyadh|dubai|القاهرة|مصر|الرياض/i.test(clean)) continue;
    if (/(?:engineer|developer|designer|manager|architect|specialist|consultant|analyst|officer|lead|frontend|backend|fullstack|software|devops|مطور|مهندس|مصمم|محاسب|مدير|أخصائي|مستشار)/i.test(clean)) continue;
    if (/\b(?:at|in|with|for|and|to|from)\b/i.test(clean)) continue;
    if (nonNameWords.test(clean)) continue;

    const words = clean.split(/\s+/);
    if (words.length >= 2 && words.length <= 4) {
      return clean;
    }
  }

  // 3. Fallback to extracting from email username: bassemramadaan17@gmail.com -> "Bassem Ramadaan"
  if (email) {
    const rawUser = email.split('@')[0];
    const username = rawUser.replace(/\d+/g, '').replace(/[._-]+/g, ' ').trim();
    if (username.length >= 3) {
      return username
        .split(' ')
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    }
  }

  return '';
}

/**
 * Robust job title detector from CV lines
 */
function detectCandidateJobTitle(lines: string[], fullName: string, maxSearchLines: number = 8): string {
  const titleKeywords = [
    'developer', 'engineer', 'designer', 'manager', 'lead', 'architect',
    'specialist', 'consultant', 'analyst', 'officer', 'coordinator', 'director',
    'frontend', 'backend', 'fullstack', 'full stack', 'software', 'devops',
    'مطور', 'مهندس', 'مصمم', 'محاسب', 'مدير', 'أخصائي', 'مستشار', 'محلل', 'مسؤول', 'مبرمج'
  ];

  const searchLimit = Math.min(maxSearchLines, lines.length);
  for (const line of lines.slice(0, searchLimit)) {
    const clean = line.trim();
    if (clean === fullName || clean.includes('@') || clean.includes('http')) continue;
    if (clean.length > 50) continue;
    const lower = clean.toLowerCase();
    if (titleKeywords.some((kw) => lower.includes(kw))) {
      return clean.replace(/^(?:Title|Job Title|المسمى الوظيفي|الوظيفة)\s*[:\-]\s*/i, '').trim();
    }
  }
  return '';
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
      regex: /(?:النبذة\s+الشخصية|الملخص\s+المهني|الملخص|الهدف\s+المهني|نبذة\s+عني|نبذة\s+شخصية|نبذة|سيرة\s+ذاتية|عني|المقدمة|professional\s+summary|executive\s+summary|summary|profile|about\s+me|objective|career\s+objective|overview|bio)/i,
    },
    {
      type: 'experience',
      regex: /(?:الخبرات\s+المهنية|الخبرات\s+العملية|الخبرة\s+المهنية|الخبرة\s+العملية|الخبرات\s+السابقة|الخبرات|الخبرة|سجل\s+العمل|التاريخ\s+المهني|التاريخ\s+الوظيفي|الوظائف\s+السابقة|المناصب\s+السابقة|العمل|work\s+experience|professional\s+experience|experience|employment\s+history|work\s+history|career\s+history)/i,
    },
    {
      type: 'education',
      regex: /(?:المؤهلات\s+التعليمية|المؤهلات\s+العلمية|المؤهل\s+الدراسي|التعليم|الشهادات\s+الأكاديمية|الدرجات\s+العلمية|المؤهل\s+العلمي|الدراسة|التحصيل\s+العلمي|education|academic\s+background|academic\s+history|qualifications|educational\s+background|degrees)/i,
    },
    {
      type: 'skills',
      regex: /(?:المهارات\s+التقنية|المهارات\s+المهنية|المهارات\s+الشخصية|المهارات|الكفاءات|القدرات|المهارات\s+والخبرات|أبرز\s+المهارات|الأدوات|skills|technical\s+skills|key\s+skills|core\s+competencies|expertise|proficiencies|tools\s*(&|and)?\s*technologies|technologies)/i,
    },
    {
      type: 'projects',
      regex: /(?:المشاريع\s+السابقة|أبرز\s+المشاريع|المشاريع\s+الشخصية|المشاريع|الأعمال|أعمالي|projects|key\s+projects|personal\s+projects|notable\s+projects|portfolio)/i,
    },
    {
      type: 'certifications',
      regex: /(?:الشهادات\s+المهنية|الدورات\s+التدريبية|الشهادات|التراخيص|الدورات|الاعتمادات|certifications|certificates|courses|licenses|training)/i,
    },
    {
      type: 'languages',
      regex: /(?:اللغات\s+المتقنة|اللغات|languages|language\s+proficiency|language\s+skills)/i,
    },
  ];

  const detectedHeaders: SectionHeader[] = [];

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine || rawLine.length > 50) continue;

    // Clean leading bullets, numbers, emojis, dashes, colons
    const cleanLine = rawLine
      .replace(/^[\p{P}\p{S}\d\s]+|[\p{P}\p{S}\s]+$/gu, '')
      .trim();

    if (!cleanLine || cleanLine.length > 40) continue;

    for (const pat of SECTION_PATTERNS) {
      if (pat.regex.test(cleanLine)) {
        detectedHeaders.push({
          type: pat.type,
          lineIndex: i,
          title: cleanLine,
        });
        break;
      }
    }
  }

  // 3. Extract Name & Job Title (strictly search before first section header)
  const firstHeaderIndex = detectedHeaders.length > 0 ? detectedHeaders[0].lineIndex : 8;
  resume.personalInfo.fullName = detectCandidateName(lines, resume.personalInfo.email, firstHeaderIndex);
  resume.personalInfo.jobTitle = detectCandidateJobTitle(lines, resume.personalInfo.fullName, firstHeaderIndex);

  // Look for location keywords
  const locationPatterns = [
    /Cairo|Alexandria|Giza|Riyadh|Jeddah|Dammam|Dubai|Abu Dhabi|Amman|Beirut|London|Paris|New York/i,
    /القاهرة|الإسكندرية|الجيزة|الرياض|جدة|الدمام|دبي|أبوظبي|عمان|بيروت|مصر|السعودية|الإمارات/,
  ];
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    for (const lp of locationPatterns) {
      if (lp.test(lines[i])) {
        resume.personalInfo.location = lines[i].trim();
        break;
      }
    }
    if (resume.personalInfo.location) break;
  }

  // 4. Parse Sections Content if headers detected
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
          const hasDate = /(?:\b(?:19|20)\d{2}\b|Present|Current|الآن|حتى الآن)/i.test(line);

          if (!isBullet && (hasDate || !currentExp || currentExp.bulletPoints.length > 0)) {
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
          } else if (currentExp && cleanLine) {
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
          } else if (currentEdu && !currentEdu.description && line.trim()) {
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

  // 5. Fallback Heuristics: if section detection missed items due to stylized PDF formatting
  if (resume.skills.length === 0) {
    const commonSkills = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'HTML', 'CSS',
      'SQL', 'Git', 'Docker', 'AWS', 'Tailwind', 'MongoDB', 'Next.js', 'Excel',
      'Figma', 'UI/UX', 'Project Management', 'Communication', 'Problem Solving',
      'إدارة المشاريع', 'التواصل الفعال', 'حل المشكلات', 'العمل الجماعي'
    ];
    for (const skill of commonSkills) {
      if (new RegExp(`\\b${skill}\\b`, 'i').test(allText)) {
        resume.skills.push({
          id: generateId(),
          name: skill,
          category: 'technical',
        });
      }
    }
  }

  if (resume.experiences.length === 0) {
    // Scan for lines with date ranges (e.g. 2021 - 2024 or 2020 - Present)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const dateMatch = line.match(/\b(20\d{2}|19\d{2})\s*(?:[-–]|to|إلى|حتى)\s*(20\d{2}|Present|Current|الآن|حتى الآن)\b/i);
      if (dateMatch) {
        const posLine = i > 0 ? lines[i - 1] : line;
        resume.experiences.push({
          id: generateId(),
          position: posLine.slice(0, 50).trim(),
          company: line.replace(dateMatch[0], '').trim() || 'Company',
          location: '',
          startDate: dateMatch[1],
          endDate: dateMatch[2],
          current: /Present|Current|الآن/i.test(dateMatch[2]),
          bulletPoints: lines.slice(i + 1, i + 3).map((b) => b.replace(/^[•\-*–\d.]\s+/, '').trim()).filter(Boolean),
        });
        if (resume.experiences.length >= 3) break;
      }
    }
  }

  if (resume.education.length === 0) {
    // Scan for degree keywords
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/(?:Bachelor|Master|PhD|BSc|MSc|University|College|بكالوريوس|ماجستير|دبلوم|جامعة|كلية)/i.test(line)) {
        resume.education.push({
          id: generateId(),
          degree: line.slice(0, 60).trim(),
          institution: i + 1 < lines.length && lines[i + 1].length < 60 ? lines[i + 1].trim() : 'University',
          fieldOfStudy: '',
          startDate: '2018',
          endDate: '2022',
        });
        break;
      }
    }
  }

  return resume;
}

/**
 * Main client-side resume file parser (JSON & PDF)
 * Uses AI for intelligent extraction with automatic resilient local fallback
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
      const rawText = extractedLines.join('\n');

      // Attempt AI Transformation First for maximum accuracy and ATS quality
      if (rawText.length >= 25) {
        try {
          const res = await fetch('/api/ai/parse-and-transform', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rawText, language }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.success && data?.resumeData && !isResumeEmpty(data.resumeData)) {
              const aiResume = data.resumeData as ResumeData;
              return {
                resumeData: aiResume,
                summary: {
                  hasPersonalInfo: Boolean(aiResume.personalInfo.fullName || aiResume.personalInfo.email),
                  experienceCount: (aiResume.experiences || []).length,
                  educationCount: (aiResume.education || []).length,
                  skillCount: (aiResume.skills || []).length,
                  projectCount: (aiResume.projects || []).length,
                  certificationCount: (aiResume.certifications || []).length,
                  languageCount: (aiResume.languages || []).length,
                  detectedName: aiResume.personalInfo.fullName,
                  detectedJobTitle: aiResume.personalInfo.jobTitle,
                },
              };
            }
          }
        } catch (aiErr) {
          console.warn('AI parser bypassed, using enhanced local parser:', aiErr);
        }
      }

      // Enhanced resilient local rule-based parser fallback
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

/**
 * Extracts all raw text from a PDF or Text file for AI processing
 */
export async function extractFileRawText(file: File, language: Language = 'ar'): Promise<string> {
  const isAr = language === 'ar';
  const fileName = file.name.toLowerCase();

  if (file.size > 10 * 1024 * 1024) {
    throw new Error(isAr ? 'يجب ألا يتجاوز حجم الملف 10 ميجابايت.' : 'File must be 10 MB or smaller.');
  }

  if (fileName.endsWith('.txt') || fileName.endsWith('.json') || file.type.includes('text')) {
    return await file.text();
  }

  if (fileName.endsWith('.pdf') || file.type.includes('pdf')) {
    const arrayBuffer = await file.arrayBuffer();
    const lines = await extractTextFromPdf(arrayBuffer, language);
    return lines.join('\n');
  }

  throw new Error(isAr ? 'يرجى رفع ملف بصيغة PDF أو TXT.' : 'Please upload a PDF or TXT file.');
}

/**
 * Parses raw text directly into structured ATS ResumeData
 */
export function parseResumeText(text: string, language: Language = 'ar'): ParseResult {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const resumeData = parseCvTextLines(lines);
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
}


