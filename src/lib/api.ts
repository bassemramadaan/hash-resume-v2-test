// src/lib/api.ts
const API_BASE = '';

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: { error?: string; errorEn?: string; [key: string]: any } = {}
  ) {
    super(data.error || data.errorEn || 'Request failed');
    this.name = 'ApiError';
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(res.status, data);
  }

  return data as T;
}

// ==================== AI Endpoints ====================
export const aiApi = {
  enhanceBullet: (body: { bulletText: string; jobTitle?: string; language?: string }) =>
    apiRequest<{ suggestions: string[]; fallbackSuggestions?: string[]; error?: string; errorEn?: string }>('/api/ai/enhance-bullet', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  generateSummary: (body: { jobTitle?: string; yearsOfExperience?: string; keySkills?: string; targetIndustry?: string; language?: string }) =>
    apiRequest<{ summary: string; error?: string; errorEn?: string }>('/api/ai/generate-summary', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  suggestSkills: (body: { jobTitle?: string; language?: string }) =>
    apiRequest<{ technicalSkills: string[]; softSkills: string[]; tools: string[]; error?: string; errorEn?: string }>('/api/ai/suggest-skills', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  quickTransform: (body: { text: string; type: string; role?: string; language?: string }) =>
    apiRequest<{ resultText: string; error?: string; errorEn?: string }>('/api/ai/quick-transform', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  atsAnalyze: (body: { resumeData: unknown; jobDescription?: string; language?: string }) =>
    apiRequest<{
      score: number;
      verdict: string;
      strengths: string[];
      missingKeywords: string[];
      actionPoints: string[];
      error?: string;
      errorEn?: string;
    }>('/api/ai/ats-analyzer', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  suggestKeywords: (body: { jobTitle?: string; domain?: string; language?: string }) =>
    apiRequest<{
      technical: string[];
      tools: string[];
      softSkills: string[];
      metricsExamples?: string[];
      error?: string;
      errorEn?: string;
    }>('/api/ai/suggest-keywords', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  quantifyAchievement: (body: { text: string; jobTitle?: string; language?: string }) =>
    apiRequest<{ options: string[]; error?: string; errorEn?: string }>('/api/ai/quantify-achievement', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

// ==================== Payment Endpoints ====================
export const paymentApi = {
  verifyCode: (body: { code: string; reference?: string }) =>
    apiRequest<{
      success: boolean;
      valid: boolean;
      remainingDownloads?: number;
      message?: string;
      messageEn?: string;
    }>('/api/verify-code', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
};

// ==================== Health Check ====================
export const healthApi = {
  check: () =>
    apiRequest<{ status: string; aiEnabled: boolean; geminiConfigured?: boolean }>('/api/health'),
};
