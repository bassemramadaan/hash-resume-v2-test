import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import {
  getAiConfig,
  checkRateLimit,
  releaseConcurrencyLock,
  sanitizeText,
  sanitizeResumeForAts,
  computeAiCacheKey,
  getCachedAiResponse,
  setCachedAiResponse,
  getClientIp,
  logAiMetric,
  INPUT_LIMITS,
} from "./server/aiSecurity";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Single Gemini Client factory
const getGeminiClient = (apiKey: string | null) => {
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

/**
 * Resilient JSON extractor that strips markdown fences (```json ... ```)
 * or captures embedded JSON objects/arrays if the LLM adds text.
 */
function safeParseGeminiJson(text: string | undefined | null, fallback: any = {}): any {
  if (!text || typeof text !== 'string') return fallback;
  try {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(clean);
  } catch {
    try {
      const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch {
      // ignore
    }
    return fallback;
  }
}


// ==========================================
// AI MIDDLEWARE & UTILITIES
// ==========================================

import { Request, Response, NextFunction } from "express";

interface AiRouteOptions {
  featureKey: keyof ReturnType<typeof getAiConfig>["featureFlags"];
  rateLimitFeature: "bullet" | "summary" | "skills" | "transform" | "ats";
  unavailableMessageAr: string;
  unavailableMessageEn: string;
  fallbackData: (req: Request) => any;
}

const aiMiddleware = (options: AiRouteOptions) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const config = getAiConfig();
    const clientIp = getClientIp(req);
    
    (req as any).aiStartTime = Date.now();
    (req as any).aiConfig = config;
    (req as any).clientIp = clientIp;

    // 1. Check Kill-Switch & Feature Flag
    if (!config.aiEnabled || !config.featureFlags[options.featureKey]) {
      sendAiUnavailable(res, options.unavailableMessageAr, options.unavailableMessageEn, 503, options.fallbackData(req));
      return;
    }

    // 2. Check Model and API Key configuration
    if (!config.geminiModel || !config.geminiApiKey) {
      sendAiUnavailable(res, "إعدادات نموذج الذكاء الاصطناعي غير متوفرة بالخادم.", "AI model configuration is missing on the server.");
      return;
    }

    // 3. Rate Limit Check
    const rateLimit = await checkRateLimit(clientIp, options.rateLimitFeature);
    if (!rateLimit.allowed) {
      logAiMetric({
        feature: options.rateLimitFeature as any,
        model: config.geminiModel,
        httpStatus: 429,
        latencyMs: 0,
        cached: false,
        rateLimitBlocked: true,
      });
      res.status(429).json({
        error: rateLimit.reasonAr,
        errorEn: rateLimit.reason,
        retryAfterSeconds: rateLimit.retryAfterSeconds,
      });
      return;
    }

    next();
  };
};

// ==========================================
// API ROUTES
// ==========================================

// 1. Healthcheck
app.get("/api/health", (_req, res) => {
  const config = getAiConfig();
  res.json({
    status: "ok",
    app: "Hash Resume API",
    aiEnabled: config.aiEnabled,
    geminiConfigured: Boolean(config.geminiApiKey && config.geminiModel),
    sharedStoreConfigured: config.hasSharedStore,
  });
});

// Helper for AI Unavailable response
const sendAiUnavailable = (
  res: express.Response,
  messageAr: string = "خدمات الذكاء الاصطناعي غير مفعلة أو غير متوفرة حالياً.",
  messageEn: string = "AI services are temporarily disabled or unavailable.",
  status: number = 503,
  fallbackData?: any
) => {
  return res.status(status).json({
    success: false,
    available: false,
    error: messageAr,
    errorEn: messageEn,
    ...fallbackData,
  });
};

// 2. AI: Enhance Bullet Point
app.post("/api/ai/enhance-bullet", aiMiddleware({
  featureKey: "assistant",
  rateLimitFeature: "bullet",
  unavailableMessageAr: "ميزة تحسين الصياغة الذكية غير مفعلة حالياً.",
  unavailableMessageEn: "AI Bullet Enhancer is currently disabled.",
  fallbackData: (req) => ({
        fallbackSuggestions: [
          req.body.language === "en"
            ? "Successfully spearheaded core operational initiatives, driving a 25% increase in team performance."
            : "قاد تنفيذ وتسليم المبادرات الرئيسية بنجاح، مما ساهم في تحسين كفاءة العمل بنسبة 25%.",
          req.body.language === "en"
            ? "Optimized cross-functional workflows, reducing execution cycle time and elevating delivery quality."
            : "طور وحدث العمليات التشغيلية، مما أدى لتقليل الأخطاء وتحسين جودة المخرجات.",
          req.body.language === "en"
            ? "Collaborated with key stakeholders to align project goals and achieve milestones on schedule."
            : "أدار الاتصالات والتعاون مع الأطراف المعنية لتحقيق أهداف المشروع وفق الجدول الزمني.",
        ],
      })
}), async (req, res) => {
  const startTime = (req as any).aiStartTime || Date.now();
  const clientIp = (req as any).clientIp || getClientIp(req);
  const config = (req as any).aiConfig || getAiConfig();



  // 3. Input Validation & Restrictions
  const rawBullet = typeof req.body.bulletText === "string" ? req.body.bulletText : "";
  const rawJobTitle = typeof req.body.jobTitle === "string" ? req.body.jobTitle : "";
  const language = req.body.language === "en" ? "en" : "ar";

  if (!rawBullet.trim()) {
    return res.status(400).json({ error: "نص النقطة مطلوب", errorEn: "bulletText is required" });
  }

  if (rawBullet.length > INPUT_LIMITS.bulletText) {
    return res.status(413).json({
      error: `تجاوز النص الحد الأقصى المسموح به (${INPUT_LIMITS.bulletText} حرف).`,
      errorEn: `Input text exceeds the maximum limit of ${INPUT_LIMITS.bulletText} characters.`,
    });
  }

  // 4. Sanitize inputs (Strip PII)
  const sanitizedBullet = sanitizeText(rawBullet, INPUT_LIMITS.bulletText);
  const sanitizedJobTitle = sanitizeText(rawJobTitle, 100);

  // 5. Check Cache
  const cacheKey = computeAiCacheKey("bullet", config.geminiModel, {
    b: sanitizedBullet,
    j: sanitizedJobTitle,
    l: language,
  });

  const cached = await getCachedAiResponse(cacheKey);
  if (cached) {
    logAiMetric({
      feature: "enhance-bullet",
      model: config.geminiModel,
      httpStatus: 200,
      latencyMs: Date.now() - startTime,
      cached: true,
    });
    return res.json(cached);
  }



  try {
    const ai = getGeminiClient(config.geminiApiKey);
    if (!ai) {
      throw new Error("Failed to initialize AI client");
    }

    const isArabic = language === "ar";
    const prompt = isArabic
      ? `أنت خبير صياغة سير ذاتية مخصص لنظام ATS. قم بتحسين هذه النقطة للخبرة العملية للوظيفة: "${sanitizedJobTitle || 'المسمى الوظيفي'}"
النقطة الحالية: "${sanitizedBullet}"

المطلوب: قدم 3 اقتراحات صياغة احترافية مختلفة، بصيغة أفعال مبنية للمعلوم مع إدراج أرقام وإنجازات وقابليتها للقرائية عبر أجهزة ATS.
أعد النتيجة بتنسيق JSON فقط بالشكل التالي:
{
  "suggestions": [
    "النقطة المحسنة الأولى مع أرقام وإنجازات...",
    "النقطة المحسنة الثانية...",
    "النقطة المحسنة الثالثة..."
  ]
}`
      : `You are an expert ATS resume writer. Optimize this work experience bullet point for the role of "${sanitizedJobTitle || 'Job Title'}".
Current Bullet: "${sanitizedBullet}"

Requirement: Provide 3 distinct high-impact action-oriented bullet points using strong action verbs and quantified impact that pass ATS scanners easily.
Return ONLY JSON in this format:
{
  "suggestions": [
    "First enhanced action bullet with metrics...",
    "Second enhanced action bullet...",
    "Third enhanced action bullet..."
  ]
}`;

    const response = await ai.models.generateContent({
      model: config.geminiModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = safeParseGeminiJson(response.text, {});
    if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
      throw new Error("Invalid structure returned by AI");
    }

    // Cache successful response for 24h
    await setCachedAiResponse(cacheKey, parsed, 86400);

    logAiMetric({
      feature: "enhance-bullet",
      model: config.geminiModel,
      httpStatus: 200,
      latencyMs: Date.now() - startTime,
      cached: false,
    });

    return res.json(parsed);
  } catch (err: unknown) {
    logAiMetric({
      feature: "enhance-bullet",
      model: config.geminiModel,
      httpStatus: 500,
      latencyMs: Date.now() - startTime,
      cached: false,
      error: err instanceof Error ? err.message : String(err),
    });
    return res.status(500).json({
      error: "تعذر معالجة الطلب عبر الذكاء الاصطناعي حالياً.",
      errorEn: "Failed to process bullet enhancement via AI.",
    });
  } finally {
    await releaseConcurrencyLock(clientIp);
  }
});

// 3. AI: Generate Summary
app.post("/api/ai/generate-summary", aiMiddleware({
  featureKey: "summary",
  rateLimitFeature: "summary",
  unavailableMessageAr: "ميزة إنشاء الملخص المهني بالذكاء الاصطناعي غير مفعلة حالياً.",
  unavailableMessageEn: "AI Summary Generator is currently disabled.",
  fallbackData: (req) => ({
        summary:
          req.body.language === "en"
            ? `Results-driven professional with a solid track record in optimizing operational workflows and delivering measurable business impact.`
            : `محترف شغوف يمتلك خبرة متميزة في تطوير العمليات ورفع الكفاءة التشغيلية وتحقيق الأهداف المؤسسية بدقة.`,
      })
}), async (req, res) => {
  const startTime = (req as any).aiStartTime || Date.now();
  const clientIp = (req as any).clientIp || getClientIp(req);
  const config = (req as any).aiConfig || getAiConfig();



  // 3. Input Validation & Restrictions
  const { jobTitle = "", yearsOfExperience = "", keySkills = "", targetIndustry = "", language = "ar" } = req.body;
  const lang = language === "en" ? "en" : "ar";

  const totalInputLength =
    String(jobTitle).length + String(yearsOfExperience).length + String(keySkills).length + String(targetIndustry).length;

  if (totalInputLength > INPUT_LIMITS.summaryCombined) {
    return res.status(413).json({
      error: `تجاوزت البيانات المدخلة الحد الأقصى المسموح به (${INPUT_LIMITS.summaryCombined} حرف).`,
      errorEn: `Summary inputs exceed the maximum allowed length of ${INPUT_LIMITS.summaryCombined} characters.`,
    });
  }

  // 4. Sanitize inputs (Strip PII)
  const cleanJobTitle = sanitizeText(String(jobTitle), 100);
  const cleanExp = sanitizeText(String(yearsOfExperience), 50);
  const cleanSkills = sanitizeText(String(keySkills), 300);
  const cleanIndustry = sanitizeText(String(targetIndustry), 100);

  // 5. Check Cache
  const cacheKey = computeAiCacheKey("summary", config.geminiModel, {
    t: cleanJobTitle,
    e: cleanExp,
    s: cleanSkills,
    i: cleanIndustry,
    l: lang,
  });

  const cached = await getCachedAiResponse(cacheKey);
  if (cached) {
    logAiMetric({
      feature: "generate-summary",
      model: config.geminiModel,
      httpStatus: 200,
      latencyMs: Date.now() - startTime,
      cached: true,
    });
    return res.json(cached);
  }



  try {
    const ai = getGeminiClient(config.geminiApiKey);
    if (!ai) throw new Error("Failed to initialize AI client");

    const isArabic = lang === "ar";
    const prompt = isArabic
      ? `أنت خبير في كتابة السير الذاتية ومجال الموارد البشرية.
اكتب ملخصاً مهنياً (Professional Summary) جذاباً ومحسناً لنظام ATS في 3 أسطر قصيرة ومباشرة باللغة العربية.
المسمى الوظيفي: ${cleanJobTitle || 'محترف'}
سنوات الخبرة: ${cleanExp || '1-3'}
أبرز المهارات: ${cleanSkills || 'التواصل، إدارة المشاريع، حل المشكلات'}
المجال المستهدف: ${cleanIndustry || 'العام'}

أعد النتيجة بتنسيق JSON بالشكل التالي:
{
  "summary": "الملخص المهني المقترح..."
}`
      : `You are a professional resume writer and HR specialist.
Write a compelling, ATS-optimized 3-sentence professional summary for:
Job Title: ${cleanJobTitle || 'Professional'}
Years of Experience: ${cleanExp || '1-3'}
Key Skills: ${cleanSkills || 'Communication, Project Management'}
Target Industry: ${cleanIndustry || 'General'}

Return JSON format:
{
  "summary": "Generated professional summary..."
}`;

    const response = await ai.models.generateContent({
      model: config.geminiModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = safeParseGeminiJson(response.text, {});
    if (!parsed.summary) {
      throw new Error("Invalid structure returned by AI");
    }

    await setCachedAiResponse(cacheKey, parsed, 86400);

    logAiMetric({
      feature: "generate-summary",
      model: config.geminiModel,
      httpStatus: 200,
      latencyMs: Date.now() - startTime,
      cached: false,
    });

    return res.json(parsed);
  } catch (err: unknown) {
    logAiMetric({
      feature: "generate-summary",
      model: config.geminiModel,
      httpStatus: 500,
      latencyMs: Date.now() - startTime,
      cached: false,
      error: err instanceof Error ? err.message : String(err),
    });
    return res.status(500).json({
      error: "تعذر توليد الملخص المهني حالياً.",
      errorEn: "Failed to generate professional summary.",
    });
  } finally {
    await releaseConcurrencyLock(clientIp);
  }
});

// 4. AI: Suggest Skills
app.post("/api/ai/suggest-skills", aiMiddleware({
  featureKey: "skills",
  rateLimitFeature: "skills",
  unavailableMessageAr: "ميزة اقتراح المهارات الذكية غير مفعلة حالياً.",
  unavailableMessageEn: "AI Skill Suggestion is currently disabled.",
  fallbackData: (req) => ({
        technicalSkills: req.body.language === "en" ? ["Data Analysis", "Reporting", "Process Improvement"] : ["إدارة البيانات", "التحليل الإحصائي", "تحسين العمليات"],
        softSkills: req.body.language === "en" ? ["Effective Communication", "Team Leadership", "Problem Solving"] : ["التواصل الفعال", "القيادة والعمل الجماعي", "حل المشكلات"],
        tools: req.body.language === "en" ? ["Microsoft Excel", "Google Workspace", "Slack"] : ["Microsoft Excel", "Google Suite", "Slack"],
      })
}), async (req, res) => {
  const startTime = (req as any).aiStartTime || Date.now();
  const clientIp = (req as any).clientIp || getClientIp(req);
  const config = (req as any).aiConfig || getAiConfig();



  const rawJobTitle = typeof req.body.jobTitle === "string" ? req.body.jobTitle : "";
  const language = req.body.language === "en" ? "en" : "ar";
  const cleanJobTitle = sanitizeText(rawJobTitle, 100);

  // 3. Check Cache
  const cacheKey = computeAiCacheKey("skills", config.geminiModel, {
    j: cleanJobTitle,
    l: language,
  });

  const cached = await getCachedAiResponse(cacheKey);
  if (cached) {
    logAiMetric({
      feature: "suggest-skills",
      model: config.geminiModel,
      httpStatus: 200,
      latencyMs: Date.now() - startTime,
      cached: true,
    });
    return res.json(cached);
  }



  try {
    const ai = getGeminiClient(config.geminiApiKey);
    if (!ai) throw new Error("Failed to initialize AI client");

    const isArabic = language === "ar";
    const prompt = isArabic
      ? `اقترح مهارات مناسبة ومطلوبة في سوق العمل للمسمى الوظيفي: "${cleanJobTitle || 'محترف'}".
قسم المهارات إلى 3 فئات (مهارات تقنية، مهارات شخصية، أدوات وبرامج).
أعد النتيجة بتنسيق JSON:
{
  "technicalSkills": ["مهارة1", "مهارة2", "مهارة3", "مهارة4"],
  "softSkills": ["مهارة1", "مهارة2", "مهارة3"],
  "tools": ["أداة1", "أداة2", "أداة3"]
}`
      : `Suggest high-demand resume skills for the job title: "${cleanJobTitle || 'Professional'}".
Categorize into technical skills, soft skills, and tools.
Return JSON:
{
  "technicalSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
  "softSkills": ["Skill 1", "Skill 2", "Skill 3"],
  "tools": ["Tool 1", "Tool 2", "Tool 3"]
}`;

    const response = await ai.models.generateContent({
      model: config.geminiModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = safeParseGeminiJson(response.text, {});
    await setCachedAiResponse(cacheKey, parsed, 86400);

    logAiMetric({
      feature: "suggest-skills",
      model: config.geminiModel,
      httpStatus: 200,
      latencyMs: Date.now() - startTime,
      cached: false,
    });

    return res.json(parsed);
  } catch (err: unknown) {
    logAiMetric({
      feature: "suggest-skills",
      model: config.geminiModel,
      httpStatus: 500,
      latencyMs: Date.now() - startTime,
      cached: false,
      error: err instanceof Error ? err.message : String(err),
    });
    return res.status(500).json({
      error: "تعذر اقتراح المهارات حالياً.",
      errorEn: "Failed to suggest skills.",
    });
  } finally {
    await releaseConcurrencyLock(clientIp);
  }
});

// 5. AI: Quick Inline Transform (Metrics, Polish, Translation)
app.post("/api/ai/quick-transform", aiMiddleware({
  featureKey: "experience",
  rateLimitFeature: "transform",
  unavailableMessageAr: "ميزة التحويل السريع غير مفعلة حالياً.",
  unavailableMessageEn: "Quick Transform is currently disabled.",
  fallbackData: (req) => ({ resultText: req.body.text || "" })
}), async (req, res) => {
  const startTime = (req as any).aiStartTime || Date.now();
  const clientIp = (req as any).clientIp || getClientIp(req);
  const config = (req as any).aiConfig || getAiConfig();



  const { text = "", type = "polish", role = "محترف", language = "ar" } = req.body;
  if (!String(text).trim()) {
    return res.status(400).json({ error: "النص مطلوب", errorEn: "text is required" });
  }

  if (String(text).length > INPUT_LIMITS.quickTransformText) {
    return res.status(413).json({
      error: `تجاوز النص الحد الأقصى (${INPUT_LIMITS.quickTransformText} حرف).`,
      errorEn: `Text exceeds maximum allowed limit of ${INPUT_LIMITS.quickTransformText} characters.`,
    });
  }

  // 3. Sanitize inputs
  const cleanText = sanitizeText(String(text), INPUT_LIMITS.quickTransformText);
  const cleanRole = sanitizeText(String(role), 80);
  const lang = language === "en" ? "en" : "ar";

  // 4. Check Cache
  const cacheKey = computeAiCacheKey("transform", config.geminiModel, {
    t: cleanText,
    ty: type,
    r: cleanRole,
    l: lang,
  });

  const cached = await getCachedAiResponse(cacheKey);
  if (cached) {
    logAiMetric({
      feature: "quick-transform",
      model: config.geminiModel,
      httpStatus: 200,
      latencyMs: Date.now() - startTime,
      cached: true,
    });
    return res.json(cached);
  }



  try {
    const ai = getGeminiClient(config.geminiApiKey);
    if (!ai) throw new Error("Failed to initialize AI client");

    let prompt = "";
    if (type === "metric") {
      prompt = lang === "ar"
        ? `أنت خبير صياغة سير ذاتية ATS. أعد صياغة هذه الجملة للوظيفة (${cleanRole}) مع إضافة أرقام وإنجازات ونسب مئوية واقعية (KPIs / Metrics):
النص: "${cleanText}"
أعد النتيجة بتنسيق JSON: {"resultText": "النص المحسن مع الأرقام"}`
        : `You are an expert ATS resume writer. Rewrite this sentence for a (${cleanRole}) to include compelling, realistic quantifiable metrics and percentages (% / KPIs):
Input text: "${cleanText}"
Return JSON: {"resultText": "Enhanced text with metrics"}`;
    } else if (type === "polish") {
      prompt = lang === "ar"
        ? `أنت خبير توظيف. حسّن صياغة هذه الجملة لتكون احترافية ومباشرة وتبدأ بفعل قوي مبني للمعلوم ومحسنة لـ ATS:
النص: "${cleanText}"
أعد النتيجة بتنسيق JSON: {"resultText": "النص المحسن والمهني"}`
        : `You are a recruitment specialist. Polish and enhance this sentence with strong action verbs and professional ATS phrasing:
Input text: "${cleanText}"
Return JSON: {"resultText": "Polished text"}`;
    } else if (type === "translate_en") {
      prompt = `Translate and professionally optimize this resume text into high-impact, ATS-friendly professional English for a (${cleanRole}):
Input text: "${cleanText}"
Return JSON: {"resultText": "Professional English translation"}`;
    } else if (type === "translate_ar") {
      prompt = `ترجم وحسّن هذا النص ليصبح صياغة مهنية عربية ممتازة ومناسبة للسير الذاتية:
النص: "${cleanText}"
أعد النتيجة بتنسيق JSON: {"resultText": "الترجمة العربية المهنية"}` ;
    }

    const response = await ai.models.generateContent({
      model: config.geminiModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = safeParseGeminiJson(response.text, {});
    const resultPayload = { resultText: parsed.resultText || cleanText };

    await setCachedAiResponse(cacheKey, resultPayload, 86400);

    logAiMetric({
      feature: "quick-transform",
      model: config.geminiModel,
      httpStatus: 200,
      latencyMs: Date.now() - startTime,
      cached: false,
    });

    return res.json(resultPayload);
  } catch (err: unknown) {
    logAiMetric({
      feature: "quick-transform",
      model: config.geminiModel,
      httpStatus: 500,
      latencyMs: Date.now() - startTime,
      cached: false,
      error: err instanceof Error ? err.message : String(err),
    });
    return res.status(500).json({
      error: "تعذر تحويل النص حالياً.",
      errorEn: "Failed to transform text.",
    });
  } finally {
    await releaseConcurrencyLock(clientIp);
  }
});

// 6. AI: ATS Resume Analyzer
app.post("/api/ai/ats-analyzer", aiMiddleware({
  featureKey: "ats",
  rateLimitFeature: "ats",
  unavailableMessageAr: "خدمة فحص ATS بالذكاء الاصطناعي غير مفعلة حالياً.",
  unavailableMessageEn: "AI ATS Analyzer is currently disabled.",
  fallbackData: (req) => ({
        score: 82,
        verdict: req.body.language === "en" ? "Good ATS Compatibility" : "توافق جيد مع نظام ATS",
        strengths: req.body.language === "en" ? ["Standard structure", "Clear sections"] : ["تنسيق قياسي منظم", "أقسام واضحة وسهلة القراءة"],
        missingKeywords: req.body.language === "en" ? ["KPI Metrics", "Team Leadership"] : ["مؤشرات الأداء (KPIs)", "إدارة وقيادة الفرق"],
        actionPoints: req.body.language === "en" ? ["Quantify achievements with metrics"] : ["أضف أرقاماً ومقاييس إنجاز واضحة في الخبرات"],
      })
}), async (req, res) => {
  const startTime = (req as any).aiStartTime || Date.now();
  const clientIp = (req as any).clientIp || getClientIp(req);
  const config = (req as any).aiConfig || getAiConfig();



  const { resumeData, jobDescription = "", language = "ar" } = req.body;
  const lang = language === "en" ? "en" : "ar";

  if (!resumeData || typeof resumeData !== "object") {
    return res.status(400).json({ error: "بيانات السيرة الذاتية مطلوبة", errorEn: "resumeData is required" });
  }

  // 3. Sanitize inputs (Strip PII & enforce maximum character limits)
  const cleanResume = sanitizeResumeForAts(resumeData);
  const cleanJd = sanitizeText(String(jobDescription), INPUT_LIMITS.jobDescription);

  const resumePayloadString = JSON.stringify(cleanResume);
  if (resumePayloadString.length > INPUT_LIMITS.atsResumePayload) {
    return res.status(413).json({
      error: `تجاوز حجم بيانات السيرة الذاتية الحد المسموح (${INPUT_LIMITS.atsResumePayload} حرف).`,
      errorEn: `Resume payload exceeds maximum limit of ${INPUT_LIMITS.atsResumePayload} characters.`,
    });
  }

  // 4. Check Cache
  const cacheKey = computeAiCacheKey("ats", config.geminiModel, {
    r: cleanResume,
    jd: cleanJd,
    l: lang,
  });

  const cached = await getCachedAiResponse(cacheKey);
  if (cached) {
    logAiMetric({
      feature: "ats-analyzer",
      model: config.geminiModel,
      httpStatus: 200,
      latencyMs: Date.now() - startTime,
      cached: true,
    });
    return res.json(cached);
  }



  try {
    const ai = getGeminiClient(config.geminiApiKey);
    if (!ai) throw new Error("Failed to initialize AI client");

    const isArabic = lang === "ar";
    const prompt = isArabic
      ? `أنت نظام فحص سير ذاتية آلي (ATS) ومسؤول توظيف محترف. قم بتحليل السيرة الذاتية التالية مقارنة بالمتطلبات:

بيانات السيرة الذاتية (مستخلصة ومطهرة):
${JSON.stringify(cleanResume, null, 2)}

الوصف الوظيفي المستهدف:
"${cleanJd || 'تحليل قياسي لنظام ATS'}"

المطلوب: أعد تقييماً شاملاً بتنسيق JSON دقيق:
{
  "score": 85, // درجة من 0 إلى 100
  "verdict": "تقييم عام مختصر في 5 كلمات",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "missingKeywords": ["كلمة مفتاحية هامة مفقودة 1", "كلمة 2"],
  "actionPoints": ["توصية عمل قابلة للتطبيق 1", "توصية 2", "توصية 3"]
}`
      : `You are an automated Applicant Tracking System (ATS) and professional recruiter. Analyze the following sanitized resume:

Resume Data:
${JSON.stringify(cleanResume, null, 2)}

Target Job Description:
"${cleanJd || 'General ATS Analysis'}"

Provide a detailed evaluation JSON:
{
  "score": 85, // integer 0-100
  "verdict": "Short verdict phrase",
  "strengths": ["Strength 1", "Strength 2"],
  "missingKeywords": ["Keyword 1", "Keyword 2"],
  "actionPoints": ["Action point 1", "Action point 2"]
}`;

    const response = await ai.models.generateContent({
      model: config.geminiModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = safeParseGeminiJson(response.text, {});
    await setCachedAiResponse(cacheKey, parsed, 86400);

    logAiMetric({
      feature: "ats-analyzer",
      model: config.geminiModel,
      httpStatus: 200,
      latencyMs: Date.now() - startTime,
      cached: false,
    });

    return res.json(parsed);
  } catch (err: unknown) {
    logAiMetric({
      feature: "ats-analyzer",
      model: config.geminiModel,
      httpStatus: 500,
      latencyMs: Date.now() - startTime,
      cached: false,
      error: err instanceof Error ? err.message : String(err),
    });
    return res.status(500).json({
      error: "تعذر فحص السيرة الذاتية عبر نظام ATS حالياً.",
      errorEn: "Failed to analyze resume via ATS.",
    });
  } finally {
    await releaseConcurrencyLock(clientIp);
  }
});

// 7. AI: Domain & Role Keywords Suggestions
app.post("/api/ai/suggest-keywords", aiMiddleware({
  featureKey: "skills",
  rateLimitFeature: "skills",
  unavailableMessageAr: "ميزة اقتراح الكلمات المفتاحية غير مفعلة حالياً.",
  unavailableMessageEn: "Keyword suggestions are currently disabled.",
  fallbackData: (req) => ({
        technical: ["SQL", "Data Analysis", "Project Lifecycle", "Process Optimization"],
        tools: ["Microsoft Excel", "Jira", "Google Analytics"],
        softSkills: ["Problem Solving", "Team Leadership", "Effective Communication"]
      })
}), async (req, res) => {
  const startTime = (req as any).aiStartTime || Date.now();
  const clientIp = (req as any).clientIp || getClientIp(req);
  const config = (req as any).aiConfig || getAiConfig();



  const { jobTitle = "محترف", domain = "", language = "ar" } = req.body;
  const cleanTitle = sanitizeText(String(jobTitle), 100);
  const cleanDomain = sanitizeText(String(domain), 100);
  const lang = language === "en" ? "en" : "ar";

  const cacheKey = computeAiCacheKey("keywords", config.geminiModel, {
    t: cleanTitle,
    d: cleanDomain,
    l: lang,
  });

  const cached = await getCachedAiResponse(cacheKey);
  if (cached) {
    logAiMetric({
      feature: "suggest-keywords",
      model: config.geminiModel,
      httpStatus: 200,
      latencyMs: Date.now() - startTime,
      cached: true,
    });
    return res.json(cached);
  }



  try {
    const ai = getGeminiClient(config.geminiApiKey);
    if (!ai) throw new Error("Failed to initialize AI client");

    const isArabic = lang === "ar";
    const prompt = isArabic
      ? `أنت خبير توظيف وخبير في أنظمة ATS.
اقترح قائمة من أهم الكلمات المفتاحية الأكثر طلباً في سوق العمل لوظيفة: "${cleanTitle}" ومجال: "${cleanDomain || cleanTitle}".
المطلوب: أعد النتيجة بتنسيق JSON دقيق يحتوي على:
{
  "technical": ["كلمة 1", "كلمة 2", "كلمة 3", "كلمة 4", "كلمة 5"],
  "tools": ["أداة 1", "أداة 2", "أداة 3", "أداة 4"],
  "softSkills": ["مهارة 1", "مهارة 2", "مهارة 3"],
  "metricsExamples": ["مثال إنجاز 1 مع أرقام", "مثال إنجاز 2 مع نسب مئوية"]
}`
      : `You are an HR recruiter and ATS expert.
Suggest top high-demand ATS keywords for the job title: "${cleanTitle}" and field: "${cleanDomain || cleanTitle}".
Return JSON format:
{
  "technical": ["Keyword 1", "Keyword 2", "Keyword 3", "Keyword 4", "Keyword 5"],
  "tools": ["Tool 1", "Tool 2", "Tool 3", "Tool 4"],
  "softSkills": ["Skill 1", "Skill 2", "Skill 3"],
  "metricsExamples": ["Example accomplishment with metric 1", "Example accomplishment with percentage 2"]
}`;

    const response = await ai.models.generateContent({
      model: config.geminiModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = safeParseGeminiJson(response.text, {});
    await setCachedAiResponse(cacheKey, parsed, 86400);

    logAiMetric({
      feature: "suggest-keywords",
      model: config.geminiModel,
      httpStatus: 200,
      latencyMs: Date.now() - startTime,
      cached: false,
    });

    return res.json(parsed);
  } catch (err: unknown) {
    logAiMetric({
      feature: "suggest-keywords",
      model: config.geminiModel,
      httpStatus: 500,
      latencyMs: Date.now() - startTime,
      cached: false,
      error: err instanceof Error ? err.message : String(err),
    });
    return res.status(500).json({
      error: "تعذر توليد الكلمات المفتاحية حالياً.",
      errorEn: "Failed to generate keyword suggestions.",
    });
  } finally {
    await releaseConcurrencyLock(clientIp);
  }
});

// 8. AI: Quantify Responsibilities into Measurable Achievements (STAR Method)
app.post("/api/ai/quantify-achievement", aiMiddleware({
  featureKey: "experience",
  rateLimitFeature: "bullet",
  unavailableMessageAr: "ميزة صياغة الإنجازات غير مفعلة حالياً.",
  unavailableMessageEn: "Achievement quantification is currently disabled.",
  fallbackData: (req) => ({
        quantifiedAchievement: req.body.text
          ? `${req.body.text}، مما حقق نمواً بنسبة 35% وزيادة الكفاءة التشغيلية.`
          : "حسّنت كفاءة العمليات بنسبة 30% من خلال أتمتة الإجراءات اليومية."
      })
}), async (req, res) => {
  const startTime = (req as any).aiStartTime || Date.now();
  const clientIp = (req as any).clientIp || getClientIp(req);
  const config = (req as any).aiConfig || getAiConfig();



  const { text = "", jobTitle = "محترف", language = "ar" } = req.body;
  if (!String(text).trim()) {
    return res.status(400).json({ error: "النص مطلوب", errorEn: "text is required" });
  }

  const cleanText = sanitizeText(String(text), INPUT_LIMITS.bulletText);
  const cleanRole = sanitizeText(String(jobTitle), 80);
  const lang = language === "en" ? "en" : "ar";

  const cacheKey = computeAiCacheKey("quantify", config.geminiModel, {
    t: cleanText,
    r: cleanRole,
    l: lang,
  });

  const cached = await getCachedAiResponse(cacheKey);
  if (cached) {
    logAiMetric({
      feature: "quantify-achievement",
      model: config.geminiModel,
      httpStatus: 200,
      latencyMs: Date.now() - startTime,
      cached: true,
    });
    return res.json(cached);
  }



  try {
    const ai = getGeminiClient(config.geminiApiKey);
    if (!ai) throw new Error("Failed to initialize AI client");

    const isArabic = lang === "ar";
    const prompt = isArabic
      ? `أنت خبير صياغة سير ذاتية احترافية ومسؤول توظيف.
حول هذه المسؤولية العادية أو الوصف العام لوظيفة (${cleanRole}) إلى إنجاز قوي وقابل للقياس باستخدام منهجية STAR مع إضافة أرقام ونسب مئوية واقعية (مثل: "قللت زمن الاستجابة 35%" بدلاً من "مسؤول عن تحسين الأداء"):
النص الأصلي: "${cleanText}"

أعد 3 خيارات مختلفة الصياغة بتنسيق JSON:
{
  "options": [
    "صياغة 1 قوية ومباشرة مع نسبة مئوية",
    "صياغة 2 تركز على توفير الوقت أو التكلفة",
    "صياغة 3 تركز على قيادة الفريق أو جودة المخرجات"
  ]
}`
      : `You are an executive resume writer and ATS specialist.
Convert this passive or task-based responsibility for a (${cleanRole}) into a high-impact quantifiable achievement using the STAR method with realistic numbers, percentages, and KPIs (e.g., "Reduced response latency by 35%" instead of "Responsible for performance tuning"):
Input text: "${cleanText}"

Return 3 high-impact options in JSON format:
{
  "options": [
    "Option 1: Direct accomplishment with metric percentage",
    "Option 2: Focus on efficiency and cost/time reduction",
    "Option 3: Focus on leadership and quality excellence"
  ]
}`;

    const response = await ai.models.generateContent({
      model: config.geminiModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = safeParseGeminiJson(response.text, {});
    const resultPayload = {
      options: Array.isArray(parsed.options) && parsed.options.length > 0
        ? parsed.options
        : [
            isArabic
              ? `${cleanText}، مما زاد الكفاءة التشغيلية بنسبة 35%.`
              : `${cleanText}, improving operational efficiency by 35%.`
          ]
    };

    await setCachedAiResponse(cacheKey, resultPayload, 86400);

    logAiMetric({
      feature: "quantify-achievement",
      model: config.geminiModel,
      httpStatus: 200,
      latencyMs: Date.now() - startTime,
      cached: false,
    });

    return res.json(resultPayload);
  } catch (err: unknown) {
    logAiMetric({
      feature: "quantify-achievement",
      model: config.geminiModel,
      httpStatus: 500,
      latencyMs: Date.now() - startTime,
      cached: false,
      error: err instanceof Error ? err.message : String(err),
    });
    return res.status(500).json({
      error: "تعذر صياغة الإنجاز حالياً.",
      errorEn: "Failed to quantify achievement.",
    });
  } finally {
    await releaseConcurrencyLock(clientIp);
  }
});

// 7. Client-Side Resume Parsing Notice (Zero Gemini Calls Consumed)
app.post("/api/ai/parse-resume", async (req, res) => {
  // Parsing is natively executed 100% in-browser on the client side via pdfjs-dist
  const { rawJson } = req.body || {};
  if (rawJson && typeof rawJson === "object") {
    return res.json({ success: true, resumeData: rawJson });
  }

  return res.json({
    success: true,
    clientSideNotice: "Resume parsing is processed client-side without API consumption.",
    resumeData: null,
  });
});

// 8. Activation Code Verification (Google Apps Script Integration - 100% Preserved)
app.post("/api/verify-code", async (req, res) => {
  try {
    const { code, reference } = req.body || {};
    if (!code || typeof code !== "string") {
      return res.status(400).json({ success: false, valid: false, message: "كود التفعيل مطلوب" });
    }

    const cleanCode = code.trim().toUpperCase();
    const cleanReference = reference ? String(reference).trim() : "";

    const gasUrl =
      process.env.PAYMENT_API_URL ||
      process.env.VITE_PAYMENT_API_URL ||
      process.env.GAS_VERIFY_URL;

    if (!gasUrl) {
      return res.status(500).json({
        success: false,
        valid: false,
        message: "خدمة التحقق من الدفع غير مهيأة في متغيرات الخادم.",
      });
    }

    try {
      const gasResponse = await fetch(gasUrl, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "verify",
          code: cleanCode,
          reference: cleanReference,
        }),
        redirect: "follow",
      });

      const rawText = await gasResponse.text();
      let data: any = null;
      try {
        data = JSON.parse(rawText);
      } catch {
        data = null;
      }

      if (
        gasResponse.ok &&
        data &&
        data.success === true &&
        (data.status === "USED" || data.status === "APPROVED" || data.status === "ACTIVE" || data.valid === true)
      ) {
        return res.json({
          success: true,
          valid: true,
          status: data.status || "USED",
          remainingDownloads: data.remainingDownloads || 1,
          message: data.message || "تم التحقق من كود التفعيل بنجاح!",
        });
      }

      return res.status(400).json({
        success: false,
        valid: false,
        status: data?.status || "INVALID",
        message: data?.message || "كود التفعيل غير صالح أو لم يتم تأكيد الدفع بعد.",
      });
    } catch (gasErr: unknown) {
      return res.status(503).json({
        success: false,
        valid: false,
        message: "تعذر الاتصال بنظام التحقق من الدفع حالياً. يرجى المحاولة مرة أخرى بعد قليل.",
      });
    }
  } catch {
    return res.status(500).json({ success: false, valid: false, message: "حدث خطأ في الخادم أثناء التحقق" });
  }
});

// ==========================================
// VITE MIDDLEWARE / STATIC SERVING
// ==========================================
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Hash Resume Server listening on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
