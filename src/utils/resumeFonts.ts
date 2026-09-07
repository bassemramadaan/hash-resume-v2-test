/**
 * Centralized Font Resolution and Management for Hash Resume
 * Ensures 100% consistency across Desktop and Mobile preview, templates, and PDF rendering.
 */

export interface FontOption {
  id: string;
  nameAr: string;
  nameEn: string;
  fontFamily: string;
  category: 'sans' | 'serif';
  descriptionAr: string;
  descriptionEn: string;
}

export const ARABIC_FONTS: FontOption[] = [
  {
    id: 'Tajawal',
    nameAr: 'تجوال (Tajawal)',
    nameEn: 'Tajawal (Elegant Sans)',
    fontFamily: "'Tajawal', system-ui, -apple-system, sans-serif",
    category: 'sans',
    descriptionAr: 'أنيق ومقروء جداً — متوافق مع كافة أنظمة الفرز الآلي (الافتراضي)',
    descriptionEn: 'Clean, elegant and highly readable modern Arabic sans',
  },
  {
    id: 'IBM Plex Sans Arabic',
    nameAr: 'آي بي إم بليكس (IBM Plex Sans Arabic)',
    nameEn: 'IBM Plex Sans Arabic (Corporate)',
    fontFamily: "'IBM Plex Sans Arabic', 'Tajawal', system-ui, sans-serif",
    category: 'sans',
    descriptionAr: 'خط مؤسسي رسمي فائق الدقة ممتاز لشركات التكنولوجيا والـ ATS',
    descriptionEn: 'Corporate, high-precision technical sans',
  },
  {
    id: 'Cairo',
    nameAr: 'كايرو (Cairo)',
    nameEn: 'Cairo (Modern Geometric)',
    fontFamily: "'Cairo', 'Tajawal', system-ui, sans-serif",
    category: 'sans',
    descriptionAr: 'خط هندسي عصري وجريء وواضح في الطباعة',
    descriptionEn: 'Modern, punchy geometric Arabic sans',
  },
  {
    id: 'Almarai',
    nameAr: 'المراعي (Almarai)',
    nameEn: 'Almarai (Formal Sans)',
    fontFamily: "'Almarai', 'Tajawal', system-ui, sans-serif",
    category: 'sans',
    descriptionAr: 'خط رسمي متزن وهادئ للوظائف الإدارية والتنفيذية',
    descriptionEn: 'Balanced, formal sans for executive roles',
  },
  {
    id: 'Alexandria',
    nameAr: 'الإسكندرية (Alexandria)',
    nameEn: 'Alexandria (Sharp Executive)',
    fontFamily: "'Alexandria', 'Tajawal', system-ui, sans-serif",
    category: 'sans',
    descriptionAr: 'خط حديث وعصري مستوحى من الطراز المعماري',
    descriptionEn: 'Contemporary architectural-inspired sans',
  },
];

export const ENGLISH_FONTS: FontOption[] = [
  {
    id: 'Inter',
    nameAr: 'إنتر (Inter)',
    nameEn: 'Inter (Modern Standard)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    category: 'sans',
    descriptionAr: 'المعيار العالمي للتصميم النظيف وسهولة القراءة التامة',
    descriptionEn: 'The global standard for digital readability & ATS scanning',
  },
  {
    id: 'Roboto',
    nameAr: 'روبوتو (Roboto)',
    nameEn: 'Roboto (Technical Sans)',
    fontFamily: "'Roboto', 'Inter', system-ui, sans-serif",
    category: 'sans',
    descriptionAr: 'خط تقني واضح للمهندسين والمطورين والتقنيين',
    descriptionEn: 'Technical and structured sans for STEM and engineering',
  },
  {
    id: 'Georgia',
    nameAr: 'جورجيا (Georgia)',
    nameEn: 'Georgia (Executive Serif)',
    fontFamily: "Georgia, Cambria, 'Times New Roman', serif",
    category: 'serif',
    descriptionAr: 'خط كلاسيكي رسمي وموثوق للمناصب الإدارية والقانونية والمالية',
    descriptionEn: 'Distinguished, classic serif for law, finance, and management',
  },
  {
    id: 'Playfair Display',
    nameAr: 'بلايفير (Playfair Display)',
    nameEn: 'Playfair Display (Editorial Serif)',
    fontFamily: "'Playfair Display', Georgia, serif",
    category: 'serif',
    descriptionAr: 'خط تحريري راقٍ ومميز للتصميم والإعلام والتسويق',
    descriptionEn: 'Refined editorial serif for creative and executive resumes',
  },
];

/**
 * Returns the exact CSS fontFamily string for templates based on chosen font and document language.
 * Protects against cross-language font mismatch (e.g. setting 'Georgia' for Arabic text).
 */
export function getTemplateFontFamily(
  fontFamily?: string,
  language: 'ar' | 'en' | 'fr' | string = 'ar',
  preferredCategory?: 'sans' | 'serif'
): string {
  const isArabic = language === 'ar';

  if (isArabic) {
    const matchedAr = ARABIC_FONTS.find((f) => f.id === fontFamily);
    if (matchedAr) {
      return matchedAr.fontFamily;
    }
    // Fallback for Arabic if an English font was saved in state
    if (preferredCategory === 'serif') {
      return "'Amiri', 'Tajawal', serif";
    }
    return "'Tajawal', 'IBM Plex Sans Arabic', 'Cairo', sans-serif";
  }

  // English / French / Other
  const matchedEn = ENGLISH_FONTS.find((f) => f.id === fontFamily);
  if (matchedEn) {
    return matchedEn.fontFamily;
  }

  // If user had an Arabic font selected while switching to English, fallback gracefully
  if (preferredCategory === 'serif') {
    return "Georgia, Cambria, 'Times New Roman', serif";
  }
  return "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
}

/**
 * Returns the exact CSS fontFamily string for Headings and Titles (h1, h2, h3, job titles).
 * If headingFontFamily is specified and differs from body, it resolves it.
 * Otherwise, falls back to the resolved body fontFamily so styling remains harmonious by default.
 */
export function getHeadingFontFamily(
  headingFontFamily?: string,
  bodyFontFamily?: string,
  language: 'ar' | 'en' | 'fr' | string = 'ar',
  preferredCategory?: 'sans' | 'serif'
): string {
  if (headingFontFamily && headingFontFamily.trim() !== '' && headingFontFamily !== 'same') {
    return getTemplateFontFamily(headingFontFamily, language, preferredCategory);
  }
  return getTemplateFontFamily(bodyFontFamily, language, preferredCategory);
}
