import { ResumeData, ActivationState } from '../types/resume';

export const STORAGE_KEY_RESUME_DOWNLOAD_COMPLETED = 'resume_download_completed';
export const STORAGE_KEY_DOWNLOAD_COMPLETED = 'download_completed';
export const STORAGE_KEY_VERIFIED_REFERENCE = 'verified_reference';
export const STORAGE_KEY_RESUME_FINGERPRINT = 'resume_locked_fingerprint';

/**
 * Checks if the resume is effectively empty/blank
 */
export function isResumeBlank(data: ResumeData | null | undefined): boolean {
  if (!data || typeof data !== 'object') return true;

  const p = data.personalInfo;
  const hasPersonal = Boolean(
    p?.fullName?.trim() ||
    p?.email?.trim() ||
    p?.phone?.trim() ||
    p?.jobTitle?.trim() ||
    p?.summary?.trim()
  );

  const hasExp = Array.isArray(data.experiences) && data.experiences.some(
    (e) => Boolean(e.position?.trim() || e.company?.trim())
  );

  const hasEdu = Array.isArray(data.education) && data.education.some(
    (e) => Boolean(e.institution?.trim() || e.degree?.trim())
  );

  const hasSkills = Array.isArray(data.skills) && data.skills.length > 0;

  return !hasPersonal && !hasExp && !hasEdu && !hasSkills;
}

/**
 * Computes a deterministic hash fingerprint representing the core contents of a resume.
 */
export function calculateResumeFingerprint(data: ResumeData | null | undefined): string {
  if (!data || isResumeBlank(data)) return '';

  const normalized = {
    name: (data.personalInfo?.fullName || '').trim().toLowerCase(),
    email: (data.personalInfo?.email || '').trim().toLowerCase(),
    phone: (data.personalInfo?.phone || '').trim(),
    title: (data.personalInfo?.jobTitle || '').trim().toLowerCase(),
    summary: (data.personalInfo?.summary || '').trim(),
    exp: (data.experiences || []).map((e) => ({
      c: (e.company || '').trim().toLowerCase(),
      p: (e.position || '').trim().toLowerCase(),
      s: e.startDate || '',
      e: e.endDate || '',
    })),
    edu: (data.education || []).map((e) => ({
      i: (e.institution || '').trim().toLowerCase(),
      d: (e.degree || '').trim().toLowerCase(),
    })),
    skills: (data.skills || [])
      .map((s) => (typeof s === 'string' ? s : s.name || '').trim().toLowerCase())
      .sort(),
  };

  const rawStr = JSON.stringify(normalized);

  // Fast 32-bit polynomial hash
  let hash = 5381;
  for (let i = 0; i < rawStr.length; i++) {
    hash = ((hash << 5) + hash) + rawStr.charCodeAt(i);
    hash |= 0;
  }

  return `rfp_${Math.abs(hash).toString(36)}`;
}

/**
 * Removes only download completion and verified reference keys on failure or reset.
 * Strictly avoids calling localStorage.clear() or sessionStorage.clear() so draft is preserved.
 */
export function clearDownloadCompletionFlags(): void {
  try {
    if (typeof window !== 'undefined') {
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem("resume_download_completed");
        sessionStorage.removeItem("download_completed");
        sessionStorage.removeItem("verified_reference");
        sessionStorage.removeItem(STORAGE_KEY_RESUME_FINGERPRINT);
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem("resume_download_completed");
        localStorage.removeItem("download_completed");
        localStorage.removeItem("verified_reference");
        localStorage.removeItem(STORAGE_KEY_RESUME_FINGERPRINT);
      }
    }
  } catch (e) {
    // ignore
  }
}

/**
 * Validates if the locked state is authentic and matches the current resume.
 */
export function validateResumeLockState(
  activation: ActivationState | null | undefined,
  resumeData: ResumeData | null | undefined
): { isValid: boolean; fingerprint: string } {
  const currentFingerprint = calculateResumeFingerprint(resumeData);

  // A blank resume must NEVER be locked
  if (!currentFingerprint || isResumeBlank(resumeData)) {
    return { isValid: false, fingerprint: '' };
  }

  if (!activation) {
    return { isValid: false, fingerprint: currentFingerprint };
  }

  // Must have an activation code assigned
  if (!activation.isActivated || !activation.activatedCode) {
    return { isValid: false, fingerprint: currentFingerprint };
  }

  // Stored reference check (either on activation object or in storage)
  let verifiedRef = activation.verifiedReference;
  if (!verifiedRef && typeof window !== 'undefined') {
    try {
      verifiedRef =
        (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('verified_reference') : null) ||
        (typeof localStorage !== 'undefined' ? localStorage.getItem('verified_reference') : null) ||
        (typeof localStorage !== 'undefined' ? localStorage.getItem('payment_reference') : null);
    } catch {
      // Storage access blocked or restricted
    }
  }

  if (!verifiedRef) {
    return { isValid: false, fingerprint: currentFingerprint };
  }

  // Download completion check
  let wasDownloaded = false;
  if (typeof window !== 'undefined') {
    try {
      wasDownloaded =
        (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('resume_download_completed') === 'true') ||
        (typeof localStorage !== 'undefined' && localStorage.getItem('resume_download_completed') === 'true') ||
        (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('download_completed') === 'true');
    } catch {
      // Storage access blocked or restricted
    }
  }

  // Check fingerprint match
  let storedFingerprint = activation.lockedResumeFingerprint;
  if (!storedFingerprint && typeof window !== 'undefined') {
    try {
      storedFingerprint =
        (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(STORAGE_KEY_RESUME_FINGERPRINT) : null) ||
        (typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY_RESUME_FINGERPRINT) : null);
    } catch {
      // Storage access blocked or restricted
    }
  }

  if (!storedFingerprint || storedFingerprint !== currentFingerprint) {
    return { isValid: false, fingerprint: currentFingerprint };
  }

  // All 5 conditions met
  return { isValid: Boolean(activation.isResumeLocked && wasDownloaded), fingerprint: currentFingerprint };
}
