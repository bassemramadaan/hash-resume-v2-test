import { ResumeData } from '../types/resume';

export interface ResumeValidationResult {
  isValid: boolean;
  missingItemsAr: string[];
  missingItemsEn: string[];
  missingItemsFr: string[];
  summaryMessageAr: string;
  summaryMessageEn: string;
  summaryMessageFr: string;
}

/**
 * Validates that minimum required resume fields are filled
 * before allowing download or payment execution.
 */
export function validateResumeMinimumRequirements(
  data: ResumeData | null | undefined,
  targetJobDescription?: string
): ResumeValidationResult {
  const missingItemsAr: string[] = [];
  const missingItemsEn: string[] = [];
  const missingItemsFr: string[] = [];

  if (!data) {
    return {
      isValid: false,
      missingItemsAr: ['بيانات السيرة الذاتية غير موجودة'],
      missingItemsEn: ['Resume data is missing'],
      missingItemsFr: ['Les données du CV sont manquantes'],
      summaryMessageAr: 'أكمل الحقول المطلوبة للتحميل والتصدير',
      summaryMessageEn: 'Complete required fields to download',
      summaryMessageFr: 'Remplissez les champs requis pour télécharger',
    };
  }

  const p = data.personalInfo;

  // 1. Full Name check
  const rawName = (p?.fullName || '').trim();
  const upperName = rawName.toUpperCase();
  const isPlaceholderName =
    !rawName ||
    upperName === 'YOUR NAME' ||
    upperName === 'YOUR FULL NAME' ||
    upperName === 'الاسم الكامل' ||
    upperName === 'FULL NAME';

  if (isPlaceholderName) {
    missingItemsAr.push('أضف اسمك الكامل');
    missingItemsEn.push('Add your full name');
    missingItemsFr.push('Ajoutez votre nom complet');
  }

  // 2. Email check
  const rawEmail = (p?.email || '').trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isInvalidEmail = !rawEmail || !emailRegex.test(rawEmail) || rawEmail.toLowerCase().includes('example.com');

  if (isInvalidEmail) {
    missingItemsAr.push('أضف بريدك الإلكتروني');
    missingItemsEn.push('Add your email');
    missingItemsFr.push('Ajoutez votre e-mail');
  }

  // 3. Job Title check
  const rawTitle = (p?.jobTitle || '').trim();
  const upperTitle = rawTitle.toUpperCase();
  const isPlaceholderTitle =
    !rawTitle ||
    upperTitle === 'TARGET JOB TITLE' ||
    upperTitle === 'JOB TITLE' ||
    upperTitle === 'المسمى الوظيفي المستهدف' ||
    upperTitle === 'المسمى الوظيفي';

  if (isPlaceholderTitle) {
    missingItemsAr.push('أضف المسمى الوظيفي');
    missingItemsEn.push('Add your target job title');
    missingItemsFr.push('Ajoutez le titre du poste');
  }

  // 4. Content section: Experience OR Education
  const hasExp =
    Array.isArray(data.experiences) &&
    data.experiences.some((e) => Boolean(e.position?.trim() || e.company?.trim()));

  const hasEdu =
    Array.isArray(data.education) &&
    data.education.some((e) => Boolean(e.institution?.trim() || e.degree?.trim()));

  if (!hasExp && !hasEdu) {
    missingItemsAr.push('أضف الخبرة العملية أو التعليم');
    missingItemsEn.push('Add work experience or education');
    missingItemsFr.push('Ajoutez des expériences ou une formation');
  }

  // 5. ATS Job Description Check
  const hasJobDesc = Boolean(targetJobDescription && targetJobDescription.trim().length >= 20);
  if (!hasJobDesc) {
    missingItemsAr.push('إجراء فحص ATS');
    missingItemsEn.push('Complete ATS check');
    missingItemsFr.push('Effectuez la vérification ATS');
  }

  // Hard blocking items are name, email, title, and (exp or edu)
  const isHardValid = missingItemsAr.length === 0 || (missingItemsAr.length === 1 && !hasJobDesc);

  return {
    isValid: isHardValid,
    missingItemsAr,
    missingItemsEn,
    missingItemsFr,
    summaryMessageAr: 'أكمل الحقول المطلوبة للتحميل والتصدير',
    summaryMessageEn: 'Complete required fields to download',
    summaryMessageFr: 'Remplissez les champs requis pour télécharger',
  };
}

