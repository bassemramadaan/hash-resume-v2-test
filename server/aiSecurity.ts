import crypto from 'crypto';

export interface RateLimitResult {
  allowed: boolean;
  reason?: string;
  reasonAr?: string;
  retryAfterSeconds?: number;
}

export interface AiConfig {
  aiEnabled: boolean;
  featureFlags: {
    summary: boolean;
    ats: boolean;
    assistant: boolean;
    experience: boolean;
    skills: boolean;
    parse: boolean;
  };
  geminiModel: string | null;
  geminiApiKey: string | null;
  hasSharedStore: boolean;
}

// ---------------------------------------------------------------------------
// 1. Configuration & Feature Flags
// ---------------------------------------------------------------------------
export function getAiConfig(): AiConfig {
  const geminiApiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;
  // If GEMINI_API_KEY is present, AI features are enabled unless explicitly disabled via AI_ENABLED='false'
  const aiEnabled = Boolean(geminiApiKey) && process.env.AI_ENABLED !== 'false';
  const geminiModel = (process.env.GEMINI_MODEL ? process.env.GEMINI_MODEL.trim() : null) || 'gemini-3.1-flash-lite';

  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  const hasSharedStore = Boolean(kvUrl && kvToken);

  return {
    aiEnabled,
    featureFlags: {
      summary: process.env.AI_SUMMARY_ENABLED !== 'false',
      ats: process.env.AI_ATS_ENABLED !== 'false',
      assistant: process.env.AI_ASSISTANT_ENABLED !== 'false',
      experience: process.env.AI_EXPERIENCE_ENABLED !== 'false',
      skills: process.env.AI_SKILLS_ENABLED !== 'false',
      parse: process.env.AI_PARSE_ENABLED !== 'false',
    },
    geminiModel,
    geminiApiKey,
    hasSharedStore,
  };
}

// ---------------------------------------------------------------------------
// 2. Production Shared Store Adapter (Vercel KV / Upstash Redis via REST API)
// ---------------------------------------------------------------------------
class SharedStore {
  private url: string | null = null;
  private token: string | null = null;
  private memoryFallback: Map<string, { val: string; exp: number }> = new Map();

  constructor() {
    this.url = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/$/, '');
    this.token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';
  }

  public isConfigured(): boolean {
    return Boolean(this.url && this.token);
  }

  private async executeCommand(command: (string | number)[]): Promise<any> {
    if (!this.url || !this.token) {
      return null;
    }

    try {
      const res = await fetch(this.url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
      });

      if (!res.ok) {
        return null;
      }

      const data = await res.json();
      return data?.result;
    } catch {
      return null;
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    if (this.isConfigured()) {
      const raw = await this.executeCommand(['GET', key]);
      if (!raw) return null;
      try {
        return JSON.parse(raw);
      } catch {
        return raw as unknown as T;
      }
    }

    // Local dev memory fallback
    if (process.env.NODE_ENV !== 'production') {
      const entry = this.memoryFallback.get(key);
      if (!entry) return null;
      if (entry.exp > 0 && Date.now() > entry.exp) {
        this.memoryFallback.delete(key);
        return null;
      }
      try {
        return JSON.parse(entry.val);
      } catch {
        return entry.val as unknown as T;
      }
    }

    return null;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
    const valStr = typeof value === 'string' ? value : JSON.stringify(value);

    if (this.isConfigured()) {
      const cmd = ttlSeconds ? ['SET', key, valStr, 'EX', ttlSeconds] : ['SET', key, valStr];
      const res = await this.executeCommand(cmd);
      return res === 'OK';
    }

    // Local dev memory fallback
    if (process.env.NODE_ENV !== 'production') {
      const exp = ttlSeconds ? Date.now() + ttlSeconds * 1000 : 0;
      this.memoryFallback.set(key, { val: valStr, exp });
      return true;
    }

    return false;
  }

  async incr(key: string, ttlSeconds: number): Promise<number> {
    if (this.isConfigured()) {
      const count = await this.executeCommand(['INCR', key]);
      if (typeof count === 'number') {
        if (count === 1) {
          await this.executeCommand(['EXPIRE', key, ttlSeconds]);
        }
        return count;
      }
      return 1;
    }

    // Local dev memory fallback
    if (process.env.NODE_ENV !== 'production') {
      const now = Date.now();
      const entry = this.memoryFallback.get(key);
      let count = 1;
      if (entry && (entry.exp === 0 || entry.exp > now)) {
        count = parseInt(entry.val, 10) + 1;
        this.memoryFallback.set(key, { val: String(count), exp: entry.exp });
      } else {
        this.memoryFallback.set(key, { val: '1', exp: now + ttlSeconds * 1000 });
      }
      return count;
    }

    return 1;
  }

  async acquireLock(key: string, ttlSeconds: number): Promise<boolean> {
    if (this.isConfigured()) {
      // SET key "1" NX EX ttlSeconds
      const res = await this.executeCommand(['SET', key, '1', 'NX', 'EX', ttlSeconds]);
      return res === 'OK';
    }

    // Local dev memory fallback
    if (process.env.NODE_ENV !== 'production') {
      const now = Date.now();
      const entry = this.memoryFallback.get(key);
      if (entry && (entry.exp === 0 || entry.exp > now)) {
        return false;
      }
      this.memoryFallback.set(key, { val: '1', exp: now + ttlSeconds * 1000 });
      return true;
    }

    return true;
  }

  async releaseLock(key: string): Promise<void> {
    if (this.isConfigured()) {
      await this.executeCommand(['DEL', key]);
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      this.memoryFallback.delete(key);
    }
  }
}

export const sharedStore = new SharedStore();

// ---------------------------------------------------------------------------
// 3. PII Sanitizer & Input Length Controls
// ---------------------------------------------------------------------------
export const INPUT_LIMITS = {
  bulletText: 500,
  quickTransformText: 1500,
  summaryCombined: 2000,
  jobDescription: 2500,
  atsResumePayload: 8000,
  resumeRawText: 15000,
};

export function sanitizeText(text: string, maxLength: number): string {
  if (!text || typeof text !== 'string') return '';
  
  // Remove email patterns
  let cleaned = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL_REDACTED]');
  // Remove phone patterns (Egyptian & International formats)
  cleaned = cleaned.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}/g, '[PHONE_REDACTED]');
  // Remove URLs that might contain tokens
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '[LINK_REDACTED]');
  
  return cleaned.trim().slice(0, maxLength);
}

export function sanitizeResumeForAts(resume: any): any {
  if (!resume || typeof resume !== 'object') return {};

  const cleanExperiences = Array.isArray(resume.experiences)
    ? resume.experiences.slice(0, 8).map((exp: any) => ({
        company: typeof exp.company === 'string' ? exp.company.slice(0, 80) : '',
        position: typeof exp.position === 'string' ? exp.position.slice(0, 80) : '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        current: Boolean(exp.current),
        bulletPoints: Array.isArray(exp.bulletPoints)
          ? exp.bulletPoints.slice(0, 6).map((b: any) => sanitizeText(String(b || ''), 300))
          : [],
      }))
    : [];

  const cleanEducation = Array.isArray(resume.education)
    ? resume.education.slice(0, 5).map((edu: any) => ({
        institution: typeof edu.institution === 'string' ? edu.institution.slice(0, 80) : '',
        degree: typeof edu.degree === 'string' ? edu.degree.slice(0, 80) : '',
        fieldOfStudy: typeof edu.fieldOfStudy === 'string' ? edu.fieldOfStudy.slice(0, 80) : '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
      }))
    : [];

  const cleanSkills = Array.isArray(resume.skills)
    ? resume.skills.slice(0, 30).map((s: any) => ({
        name: typeof s.name === 'string' ? s.name.slice(0, 40) : '',
        category: s.category || 'technical',
      }))
    : [];

  const cleanProjects = Array.isArray(resume.projects)
    ? resume.projects.slice(0, 5).map((p: any) => ({
        title: typeof p.title === 'string' ? p.title.slice(0, 80) : '',
        description: sanitizeText(String(p.description || ''), 300),
      }))
    : [];

  return {
    jobTitle: typeof resume.personalInfo?.jobTitle === 'string' ? resume.personalInfo.jobTitle.slice(0, 100) : '',
    summary: sanitizeText(String(resume.personalInfo?.summary || ''), 600),
    experiences: cleanExperiences,
    education: cleanEducation,
    skills: cleanSkills,
    projects: cleanProjects,
  };
}

// ---------------------------------------------------------------------------
// 4. Deterministic Caching & Deduplication
// ---------------------------------------------------------------------------
export function computeAiCacheKey(featureName: string, modelName: string, payload: any): string {
  const serialized = JSON.stringify(payload);
  const hash = crypto.createHash('sha256').update(`${featureName}:${modelName}:${serialized}`).digest('hex');
  return `cache:ai:${featureName}:${hash}`;
}

export async function getCachedAiResponse<T = any>(cacheKey: string): Promise<T | null> {
  return await sharedStore.get<T>(cacheKey);
}

export async function setCachedAiResponse(cacheKey: string, data: any, ttlSeconds: number = 86400): Promise<void> {
  if (!data) return;
  await sharedStore.set(cacheKey, data, ttlSeconds);
}

// ---------------------------------------------------------------------------
// 5. Rate Limiting Logic (Global + Feature Specific)
// ---------------------------------------------------------------------------
export function getClientIp(req: any): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers['x-real-ip'];
  if (typeof realIp === 'string' && realIp.length > 0) {
    return realIp.trim();
  }
  return req.socket?.remoteAddress || '127.0.0.1';
}

export async function checkRateLimit(
  clientIp: string,
  feature: 'bullet' | 'summary' | 'skills' | 'transform' | 'ats' | 'parse' | 'chat'
): Promise<RateLimitResult> {
  // In development mode or local testing, do not artificially throttle user requests
  if (process.env.NODE_ENV !== 'production') {
    return { allowed: true };
  }

  const safeIp = clientIp.replace(/[^a-zA-Z0-9:._-]/g, '');

  // 1. Global Concurrent Request Lock (Max 1 in-progress per IP)
  const concurrentKey = `lock:concurrent:${safeIp}`;
  const acquiredLock = await sharedStore.acquireLock(concurrentKey, 30);
  if (!acquiredLock) {
    return {
      allowed: false,
      reason: 'A previous AI request is already in progress. Please wait a moment.',
      reasonAr: 'هناك طلب ذكي قيد المعالجة حالياً. يرجى الانتظار بضع ثوانٍ قبل إرسال طلب جديد.',
      retryAfterSeconds: 4,
    };
  }

  // 2. Global Hourly Limit: Max 100 requests / hour
  const globalHourKey = `ratelimit:global:hour:${safeIp}`;
  const globalHourCount = await sharedStore.incr(globalHourKey, 3600);
  if (globalHourCount > 100) {
    return {
      allowed: false,
      reason: 'Hourly AI request limit reached. Please try again in a few moments.',
      reasonAr: 'لقد وصلت للحد الأقصى المسموح به من طلبات الذكاء الاصطناعي لهذه الساعة. يرجى المحاولة بعد قليل أو الاستمرار بالتحرير اليدوي.',
      retryAfterSeconds: 1800,
    };
  }

  // 3. Global Daily Limit: Max 300 requests / day
  const globalDayKey = `ratelimit:global:day:${safeIp}`;
  const globalDayCount = await sharedStore.incr(globalDayKey, 86400);
  if (globalDayCount > 300) {
    return {
      allowed: false,
      reason: 'Daily AI request limit reached.',
      reasonAr: 'تم استهلاك رصيد الطلبات اليومي المتاح. يتجدد الرصيد تلقائياً غداً، ويمكنك إكمال وتعديل سيرتك الذاتية يدوياً في أي وقت.',
      retryAfterSeconds: 86400,
    };
  }

  // 4. Feature-Specific Limits
  const featureLimits: Record<string, { max: number; ttl: number; nameEn: string; nameAr: string }> = {
    bullet: { max: 50, ttl: 86400, nameEn: 'Bullet Enhancer', nameAr: 'تحسين الصياغة' },
    summary: { max: 30, ttl: 86400, nameEn: 'Summary Generator', nameAr: 'توليد الملخص المهني' },
    skills: { max: 30, ttl: 86400, nameEn: 'Skills Recommender', nameAr: 'اقتراح المهارات' },
    transform: { max: 50, ttl: 86400, nameEn: 'Quick Transform', nameAr: 'التحويل السريع' },
    ats: { max: 20, ttl: 600, nameEn: 'ATS Scan', nameAr: 'فحص ATS' },
    parse: { max: 60, ttl: 86400, nameEn: 'CV Parser & Auto-Fill', nameAr: 'استيراد السيرة الذاتية' },
    chat: { max: 120, ttl: 86400, nameEn: 'AI Resume Copilot', nameAr: 'مساعد المحادثة الذكي' },
  };

  const limitConfig = featureLimits[feature];
  if (limitConfig) {
    const featureKey = `ratelimit:feature:${feature}:${safeIp}`;
    const featureCount = await sharedStore.incr(featureKey, limitConfig.ttl);
    if (featureCount > limitConfig.max) {
      return {
        allowed: false,
        reason: `Limit reached for ${limitConfig.nameEn} (${limitConfig.max} per interval).`,
        reasonAr: `تم استهلاك الرصيد المتاح لميزة "${limitConfig.nameAr}" (${limitConfig.max} مرات). يمكنك المتابعة يدوياً أو المحاولة في الجلسة القادمة.`,
        retryAfterSeconds: limitConfig.ttl,
      };
    }
  }

  return { allowed: true };
}

export async function releaseConcurrencyLock(clientIp: string): Promise<void> {
  const safeIp = clientIp.replace(/[^a-zA-Z0-9:._-]/g, '');
  await sharedStore.releaseLock(`lock:concurrent:${safeIp}`);
}

export async function checkVerifyRateLimit(clientIp: string): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  const safeIp = clientIp.replace(/[^a-zA-Z0-9:._-]/g, '');
  const verifyKey = `ratelimit:verify:${safeIp}`;
  // Max 10 attempts per 10 minutes (600 seconds) to prevent brute-force attacks
  const count = await sharedStore.incr(verifyKey, 600);
  if (count > 10) {
    return { allowed: false, retryAfterSeconds: 600 };
  }
  return { allowed: true };
}

// ---------------------------------------------------------------------------
// 6. Safe Aggregate Logging Only (Zero PII, Zero Secret Exposure)
// ---------------------------------------------------------------------------
export function logAiMetric(meta: {
  feature: string;
  model: string;
  httpStatus: number;
  latencyMs: number;
  cached: boolean;
  rateLimitBlocked?: boolean;
  error?: string;
}): void {
  const record = {
    timestamp: new Date().toISOString(),
    feature: meta.feature,
    model: meta.model,
    status: meta.httpStatus,
    latencyMs: meta.latencyMs,
    cached: meta.cached,
    blocked: Boolean(meta.rateLimitBlocked),
  };

  // Structured single line aggregate log (Safe for Vercel/Cloud Run log parsers)
  console.log(`[AI_METRIC] ${JSON.stringify(record)}`);
}
