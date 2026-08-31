import { ResumeData, RedFlagItem } from '../types/resume';

const SENSITIVE_PATTERNS = [
  {
    category: 'sensitive_info' as const,
    regex: /(الديانة|ديانة\s*:|مسلم[ة]?|مسيحي[ة]?|\b(muslim|christian|islam|christianity|religion)\b)/i,
    titleAr: 'ذكر الديانة أو المعتقد الديني',
    titleEn: 'Mentioning Religion or Beliefs',
    descAr: 'تم رصد ذكر للديانة في نصوص السيرة الذاتية. معايير الـ ATS والتوظيف العالمية تعتبر هذا من البيانات المحظورة لتجنب التحيز.',
    descEn: 'Religion detected in resume text. International ATS standards strictly discourage this to prevent hiring bias.',
    suggAr: 'احذف أي إشارة للديانة تماماً لحماية سيرتك من الاستبعاد التلقائي.',
    suggEn: 'Remove all references to religion to ensure bias-free ATS parsing.',
    fixAction: 'remove_sensitive' as const,
  },
  {
    category: 'sensitive_info' as const,
    regex: /(الحالة\s+الاجتماعية|حالة\s+اجتماعية|أعزب|عازب|متزوج[ة]?|مطلق[ة]?|ارمل[ة]?|\b(marital\s*status|single|married|divorced|widowed)\b)/i,
    titleAr: 'ذكر الحالة الاجتماعية (Marital Status)',
    titleEn: 'Mentioning Marital Status',
    descAr: 'تم رصد ذكر للحالة الاجتماعية (أعزب / متزوج). هذه المعلومة غير مطلوبة في أنظمة التوظيف الحديثة وتستهلك مساحة ثمينة.',
    descEn: 'Marital status detected. Modern hiring standards consider this unnecessary personal data.',
    suggAr: 'احذف الحالة الاجتماعية واستغل المساحة لإبراز مهارة أو إنجاز عملي.',
    suggEn: 'Remove marital status and use the space for skills or achievements.',
    fixAction: 'remove_sensitive' as const,
  },
  {
    category: 'sensitive_info' as const,
    regex: /(الرقم\s+القومي|رقم\s+البطاقة|رقم\s+قومي|\b(national\s*id|id\s*number|passport\s*no|ssn)\b|\b\d{14}\b)/i,
    titleAr: 'ذكر الرقم القومي أو بيانات الهوية الحساسة',
    titleEn: 'Mentioning National ID or Sensitive Numbers',
    descAr: 'تم رصد رقم قومي أو رقم وثيقة شخصية. يشكل هذا خطراً على خصوصيتك ولا تطلبه الشركات في مرحلة التقديم الأولى.',
    descEn: 'National ID or sensitive identifier detected. This exposes your privacy and is never required on a resume.',
    suggAr: 'احذف الرقم القومي فوراً واكتفِ بوسائل الاتصال المهنية (البريد والهاتف ورابط LinkedIn).',
    suggEn: 'Remove identification numbers immediately for security.',
    fixAction: 'remove_sensitive' as const,
  },
  {
    category: 'sensitive_info' as const,
    regex: /(موقف\s+التجنيد|الخدمة\s+العسكرية|معافى\s+(نهائي|مؤقت)?|أدى\s+الخدمة|\b(military\s*status|military\s*service)\b)/i,
    titleAr: 'ذكر موقف التجنيد في السيرة الدولية',
    titleEn: 'Mentioning Military Service Status',
    descAr: 'موقف التجنيد مطلوب فقط في الوظائف الحكومية المحلية بمصر وليس في شركات القطاع الخاص أو الشركات العالمية.',
    descEn: 'Military status is unnecessary for international and private sector job applications.',
    suggAr: 'يمكن حذفه من السيرة الدولية الموجهة للشركات الخاصة ومتعدية الجنسيات.',
    suggEn: 'Remove military status unless specifically mandated by a local government entity.',
    fixAction: 'remove_sensitive' as const,
  },
  {
    category: 'sensitive_info' as const,
    regex: /(تاريخ\s+الميلاد|تاريخ\s+ميلاد|العمر\s*:|\b(date\s*of\s*birth|dob|birth\s*date|age\s*:)\b)/i,
    titleAr: 'ذكر تاريخ الميلاد أو العمر الدقيق',
    titleEn: 'Mentioning Exact Date of Birth / Age',
    descAr: 'تاريخ الميلاد قد يعرض السيرة للتحيز العمري (Ageism) وتمنعه المعايير الدولية للتوظيف.',
    descEn: 'Exact date of birth may trigger age bias and is omitted in modern ATS standard resumes.',
    suggAr: 'احذف تاريخ الميلاد ودع خبراتك ومشاريعك تعبر عن مستواك المهني.',
    suggEn: 'Remove date of birth to focus purely on professional qualifications.',
    fixAction: 'remove_sensitive' as const,
  },
];

const UNPROFESSIONAL_EMAIL_KEYWORDS = [
  'rockstar', 'gamer', 'king', 'queen', 'prince', 'princess', 'cutegirl', 'badboy',
  'lover', 'killer', 'ninja', 'boss', 'shadow', 'devil', 'angel', 'hack', 'cool',
  'superman', 'batman', 'xxx', 'hotboy', 'beast', 'darkness', 'sweetie', 'playboy',
  'dude', 'bro', 'star', 'queen', 'tiger', 'lion', 'beast', 'demon', 'ghost',
];

/**
 * Parses approximate month/year string to a timestamp (in ms)
 */
function parseDateStringToTime(dateStr: string): number | null {
  if (!dateStr || !dateStr.trim()) return null;
  const clean = dateStr.trim().toLowerCase();

  if (clean.includes('present') || clean.includes('حتى الآن') || clean.includes('الان') || clean.includes('current')) {
    return Date.now();
  }

  // Check format: YYYY-MM or MM/YYYY or YYYY
  const yearMonthMatch = clean.match(/(\d{4})[-/.](\d{1,2})/) || clean.match(/(\d{1,2})[-/.](\d{4})/);
  if (yearMonthMatch) {
    if (yearMonthMatch[1].length === 4) {
      const year = parseInt(yearMonthMatch[1], 10);
      const month = parseInt(yearMonthMatch[2], 10) - 1;
      return new Date(year, month, 1).getTime();
    } else {
      const month = parseInt(yearMonthMatch[1], 10) - 1;
      const year = parseInt(yearMonthMatch[2], 10);
      return new Date(year, month, 1).getTime();
    }
  }

  // Check 4-digit year only: e.g. 2022
  const yearMatch = clean.match(/\b(19\d\d|20\d\d)\b/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1], 10);
    return new Date(year, 0, 1).getTime();
  }

  const parsed = Date.parse(clean);
  return isNaN(parsed) ? null : parsed;
}

/**
 * Main Analyzer that detects red flags across ResumeData
 */
export function detectResumeRedFlags(data: ResumeData): RedFlagItem[] {
  const flags: RedFlagItem[] = [];

  const { personalInfo, experiences, education, skills, projects } = data;

  // 1. Check Unprofessional Email Address
  if (personalInfo.email && personalInfo.email.trim()) {
    const email = personalInfo.email.trim().toLowerCase();
    const localPart = email.split('@')[0] || '';

    let hasUnprofessionalKeyword = false;
    let foundKeyword = '';

    for (const kw of UNPROFESSIONAL_EMAIL_KEYWORDS) {
      if (localPart.includes(kw)) {
        hasUnprofessionalKeyword = true;
        foundKeyword = kw;
        break;
      }
    }

    const hasExcessiveNumbers = /\d{4,}$/.test(localPart);

    if (hasUnprofessionalKeyword || hasExcessiveNumbers) {
      const cleanName = (personalInfo.fullName || 'firstname.lastname')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '.')
        .replace(/\.+/g, '.');
      const suggestedEmail = `${cleanName}@gmail.com`;

      flags.push({
        id: 'email_unprofessional',
        category: 'email',
        severity: 'critical',
        titleAr: 'بريد إلكتروني غير رسمي (Unprofessional Email)',
        titleEn: 'Unprofessional Email Handle',
        descriptionAr: `البريد الإلكتروني الحالي (${personalInfo.email}) يحتوي على كلمات غير رسمية (${foundKeyword || 'أرقام متتالية'}). يترك هذا انطباعاً سلبياً لدى 76% من مدراء التوظيف.`,
        descriptionEn: `Your email address (${personalInfo.email}) contains informal keywords or excessive digits. Recruiters prefer clean, professional formats.`,
        suggestionAr: `استخدم بريداً احترافياً بصيغة الاسم: ${suggestedEmail}`,
        suggestionEn: `Switch to a clean professional email like: ${suggestedEmail}`,
        autoFixable: true,
        fixAction: 'clean_email',
        offendingText: personalInfo.email,
      });
    }
  } else {
    flags.push({
      id: 'email_missing',
      category: 'contact',
      severity: 'critical',
      titleAr: 'البريد الإلكتروني مفقود',
      titleEn: 'Missing Email Address',
      descriptionAr: 'لا يمكن لمسؤولي التوظيف التواصل معك لعدم وجود بريد إلكتروني.',
      descriptionEn: 'Recruiters have no direct way to send you an interview invite without an email.',
      suggestionAr: 'أضف بريدك الإلكتروني المهني في قسم البيانات الشخصية.',
      suggestionEn: 'Add your professional email in the Personal Info section.',
    });
  }

  // 2. Check Missing Phone Number (Recommended, non-blocking)
  if (!personalInfo.phone || !personalInfo.phone.trim()) {
    flags.push({
      id: 'phone_missing',
      category: 'contact',
      severity: 'warning',
      titleAr: 'موصى به: إضافة رقم هاتف',
      titleEn: 'Recommended: Add a phone number',
      descriptionAr: 'أضف رمز الدولة إذا كنت ترغب في تمكين مسؤولي التوظيف من الاتصال بك مباشرة.',
      descriptionEn: 'Include a country code if you want recruiters to call you directly.',
      suggestionAr: 'أضف رقم هاتفك مع رمز الدولة إذا كنت ترغب في تلقي مكالمات هاتفية مباشرة.',
      suggestionEn: 'Include a country code if you want recruiters to call you directly.',
    });
  }

  // 3. Check Sensitive / Discriminatory Information across texts
  const allTextsToScan = [
    personalInfo.summary || '',
    personalInfo.location || '',
    personalInfo.jobTitle || '',
    ...(experiences || []).map((e) => `${e?.position || ''} ${e?.company || ''} ${(e?.bulletPoints || []).join(' ')}`),
    ...(data.customSections || []).map((c) => `${c?.sectionTitle || ''} ${(c?.items || []).map((i) => `${i?.title || ''} ${i?.description || ''}`).join(' ')}`),
  ].join(' ');

  for (const pattern of SENSITIVE_PATTERNS) {
    const match = allTextsToScan.match(pattern.regex);
    if (match) {
      flags.push({
        id: `sensitive_${pattern.category}_${match[0]}`,
        category: 'sensitive_info',
        severity: 'critical',
        titleAr: pattern.titleAr,
        titleEn: pattern.titleEn,
        descriptionAr: pattern.descAr,
        descriptionEn: pattern.descEn,
        suggestionAr: pattern.suggAr,
        suggestionEn: pattern.suggEn,
        autoFixable: true,
        fixAction: 'remove_sensitive',
        offendingText: match[0],
      });
    }
  }

  // 4. Check Unexplained Employment Gaps
  if (experiences && experiences.length >= 2) {
    const datedExps = experiences
      .map((e) => ({
        id: e.id,
        company: e.company,
        position: e.position,
        startTime: parseDateStringToTime(e.startDate),
        endTime: e.current ? Date.now() : parseDateStringToTime(e.endDate),
        startDate: e.startDate,
        endDate: e.endDate,
      }))
      .filter((e) => e.startTime !== null && e.endTime !== null)
      .sort((a, b) => (b.startTime as number) - (a.startTime as number));

    for (let i = 0; i < datedExps.length - 1; i++) {
      const currentJob = datedExps[i];
      const previousJob = datedExps[i + 1];

      if (currentJob.startTime && previousJob.endTime) {
        const gapMs = currentJob.startTime - previousJob.endTime;
        const gapMonths = Math.round(gapMs / (1000 * 60 * 60 * 24 * 30.4));

        if (gapMonths >= 8) {
          flags.push({
            id: `gap_${currentJob.id}_${previousJob.id}`,
            category: 'gap',
            severity: 'warning',
            titleAr: `فجوة وظيفية غير مفسرة (${gapMonths} أشهر)`,
            titleEn: `Unexplained Employment Gap (~${gapMonths} months)`,
            descriptionAr: `توجد فجوة زمنية قرابة ${gapMonths} شهراً بين انتهاء عملك في (${previousJob.company}) وبداية عملك في (${currentJob.company}). يسأل مدراء التوظيف عادة عن هذه الفترات.`,
            descriptionEn: `There is an unexplained gap of ~${gapMonths} months between (${previousJob.company}) and (${currentJob.company}). Recruiters will likely question this period.`,
            suggestionAr: `أضف مشاريع شخصية، تدريباً حراً، أو دراسات وشهادات قمت بها خلال هذه الفترة لسد الفجوة باحترافية.`,
            suggestionEn: `Add freelance projects, self-study, or certifications earned during this gap to demonstrate continuous growth.`,
          });
        }
      }
    }
  }

  // 5. Check Fresh Graduate suitability
  const hasNoExperience = !experiences || experiences.length === 0;
  const hasEducation = education && education.length > 0;
  const hasProjects = projects && projects.length > 0;

  if (hasNoExperience && (hasEducation || hasProjects)) {
    flags.push({
      id: 'fresh_grad_mode_tip',
      category: 'format',
      severity: 'tip',
      titleAr: 'تفعيل نمط حديثي التخرج (Fresh Graduate Focus)',
      titleEn: 'Switch to Fresh Graduate Focus Mode',
      descriptionAr: 'بما أنك تبدأ مسيرتك المهنية وليس لديك خبرات سابقة متعددة، يُفضل تقديم قسم التعليم والمشاريع والمهارات في أعلى السيرة.',
      descriptionEn: 'As an entry-level candidate, prioritizing Education and Projects over Work Experience highlights your strongest assets.',
      suggestionAr: 'فعّل "نمط حديثي التخرج" بضغطة زر لنقل التعليم والمشاريع للأعلى تلقائياً.',
      suggestionEn: 'Activate Fresh Graduate Mode to automatically position Education and Projects first.',
      autoFixable: true,
      fixAction: 'reorder_fresh_grad',
    });
  }

  return flags;
}

/**
 * Auto-fix helper for Red Flags
 */
export function sanitizeSensitiveText(text: string): string {
  if (!text) return '';
  let result = text;
  for (const pattern of SENSITIVE_PATTERNS) {
    result = result.replace(pattern.regex, '').replace(/\s{2,}/g, ' ').trim();
  }
  return result;
}
