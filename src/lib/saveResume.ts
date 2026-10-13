import { supabase, isSupabaseConfigured } from './supabase';
import type { ResumeData } from '../types/resume';

/**
 * احفظ السيرة الذاتية في Supabase
 * بترجع الـ id بتاع السيرة لو نجحت، أو null لو فشلت
 */
export async function saveResumeToSupabase(
  resumeData: ResumeData
): Promise<{ id: string } | null> {
  // لو Supabase مش متظبط، متحاولش تحفظ
  if (!isSupabaseConfigured) {
    console.warn('[saveResume] Supabase not configured, skipping save');
    return null;
  }

  try {
    const personal = (resumeData.personalInfo || {}) as Partial<ResumeData['personalInfo']>;

    // استخرج البلد/المدينة من location لو موجودة
    const locationParts = (personal.location || '').split(',').map((s) => s.trim());
    const city = locationParts[0] || null;
    const country = locationParts[locationParts.length - 1] || null;

    // احسب سنوات الخبرة من الـ experiences
    const yearsExperience = estimateYearsExperience(resumeData.experiences || []);

    // هات المجال من الـ job title (تقديري)
    const field = guessFieldFromTitle(personal.jobTitle || '');

    const { data, error } = await supabase
      .from('cvs')
      .insert({
        full_name: personal.fullName || 'Unknown',
        email: personal.email || null,
        phone: personal.phone || null,
        job_title: personal.jobTitle || null,
        years_experience: yearsExperience,
        field,
        country,
        city,
        resume_data: resumeData as unknown as Record<string, unknown>,
        allow_sharing: true, // ⚠️ مهم: غيّرها لموافقة حقيقية من المستخدم لاحقاً
        status: 'active',
      })
      .select('id')
      .single();

    if (error) {
      console.error('[saveResume] Supabase error:', error);
      return null;
    }

    console.log('[saveResume] Saved with id:', data.id);
    return { id: data.id };
  } catch (err) {
    console.error('[saveResume] Unexpected error:', err);
    return null;
  }
}

/**
 * تقدير سنوات الخبرة من قايمة الشغل
 */
function estimateYearsExperience(
  experiences: Array<{ startDate?: string; endDate?: string; current?: boolean }>
): number | null {
  if (!experiences.length) return null;

  let totalMonths = 0;
  for (const exp of experiences) {
    if (!exp.startDate) continue;
    const start = new Date(exp.startDate);
    if (isNaN(start.getTime())) continue;

    const end = exp.current || !exp.endDate ? new Date() : new Date(exp.endDate);
    if (isNaN(end.getTime())) continue;

    const months = Math.max(
      0,
      (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth())
    );
    totalMonths += months;
  }

  return totalMonths > 0 ? Math.round(totalMonths / 12) : null;
}

/**
 * تخمين المجال من الـ job title
 */
function guessFieldFromTitle(title: string): string | null {
  const t = title.toLowerCase();
  if (/engineer|developer|programmer|software|data|devops/i.test(t)) return 'engineering';
  if (/market|seo|content|social media/i.test(t)) return 'marketing';
  if (/account|finance|audit/i.test(t)) return 'finance';
  if (/doctor|nurse|medical|pharma/i.test(t)) return 'medical';
  if (/teach|professor|tutor/i.test(t)) return 'education';
  if (/design|ui|ux|graphic/i.test(t)) return 'design';
  if (/sale|business development/i.test(t)) return 'sales';
  if (/hr|recruit|talent/i.test(t)) return 'hr';
  return null;
}
