import { ResumeData } from '../types/resume';

/**
 * Pure selector function to compute the completion score of a resume.
 * Returns a number between 0 and 100.
 */
export function calculateCompletionScore(resumeData: ResumeData): number {
  if (!resumeData) return 0;
  let score = 0;

  if (resumeData.personalInfo?.fullName?.trim()) score += 15;
  if (resumeData.personalInfo?.email?.trim() || resumeData.personalInfo?.phone?.trim()) score += 15;
  if (resumeData.personalInfo?.summary?.trim()) score += 10;
  if (
    resumeData.experiences &&
    resumeData.experiences.length > 0 &&
    resumeData.experiences.some((e) => e.position?.trim())
  ) score += 25;
  if (
    resumeData.education &&
    resumeData.education.length > 0 &&
    resumeData.education.some((e) => e.institution?.trim())
  ) score += 15;
  if (resumeData.skills && resumeData.skills.length >= 2) score += 10;
  if (
    (resumeData.projects && resumeData.projects.length > 0) ||
    (resumeData.certifications && resumeData.certifications.length > 0)
  ) score += 10;

  return Math.min(100, score);
}
