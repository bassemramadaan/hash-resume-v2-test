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
    id: 'Cairo',
    nameAr: 'كايرو (Cairo)',
    nameEn: 'Cairo (Modern Geometric)',
    fontFamily: "'Cairo', 'Tajawal', system-ui, sans-serif",
    category: 'sans',
    descriptionAr: 'خط هندسي عصري وجريء وواضح في الطباعة',
    descriptionEn: 'Modern, punchy geometric Arabic sans',
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
    id: 'Readex Pro',
    nameAr: 'ريديكس برو (Readex Pro)',
    nameEn: 'Readex Pro (Ultra Clear Body)',
    fontFamily: "'Readex Pro', 'Tajawal', system-ui, sans-serif",
    category: 'sans',
    descriptionAr: 'فائق الوضوح ومريح جداً للعين أثناء قراءة الفقرات الطويلة',
    descriptionEn: 'Ultra-clear typography optimized for paragraphs and body text',
  },
  {
    id: 'Noto Sans Arabic',
    nameAr: 'نوتو سانس (Noto Sans Arabic)',
    nameEn: 'Noto Sans Arabic (Universal)',
    fontFamily: "'Noto Sans Arabic', 'Tajawal', system-ui, sans-serif",
    category: 'sans',
    descriptionAr: 'خط عالمي موحد متزن للغاية ومتوافق مع جميع الأنظمة',
    descriptionEn: 'Universal balanced Arabic sans for global ATS compatibility',
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
    id: 'Plus Jakarta Sans',
    nameAr: 'بلس جاكارتا (Plus Jakarta Sans)',
    nameEn: 'Plus Jakarta Sans (Modern Executive)',
    fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif",
    category: 'sans',
    descriptionAr: 'خط عصري فاخر يعكس القيادة والحداثة في كبرى الشركات العالمية',
    descriptionEn: 'Premium modern corporate sans for leadership & tech roles',
  },
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
    id: 'Calibri',
    nameAr: 'كاليبرا (Calibri / Arial)',
    nameEn: 'Calibri / Arial (Corporate Standard)',
    fontFamily: "Calibri, Arial, 'Helvetica Neue', sans-serif",
    category: 'sans',
    descriptionAr: 'الخط القياسي الكلاسيكي الأكثر انتشاراً في السير الذاتية بالشركات',
    descriptionEn: 'Classic corporate standard font used widely across industries',
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
