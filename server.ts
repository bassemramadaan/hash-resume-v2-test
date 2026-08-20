import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
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

// ==========================================
// API ROUTES
// ==========================================

// 1. Healthcheck
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "Hash Resume API",
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  });
});

// 2. AI: Enhance Bullet Point
app.post("/api/ai/enhance-bullet", async (req, res) => {
  try {
    const { bulletText, jobTitle, language = "ar" } = req.body;
    if (!bulletText || bulletText.trim().length === 0) {
      return res.status(400).json({ error: "bulletText is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured",
        fallbackSuggestions: [
          language === "ar"
            ? `قاد تنفيذ وتسليم المبادرات الرئيسية بنجاح، مما ساهم في تحسين كفاءة العمل بنسبة 25%.`
            : `Successfully led and delivered key initiatives, increasing overall team efficiency by 25%.`,
          language === "ar"
            ? `طور وحدث العمليات التشغيلية، مما أدى لتقليل الأخطاء وتحسين الإنتاجية.`
            : `Developed and optimized operational workflows, reducing errors and boosting productivity.`,
          language === "ar"
            ? `أدار الاتصالات والتعاون مع الأطراف المعنية لتحقيق أهداف المشروع في الوقت المحدد.`
            : `Managed cross-functional stakeholder communications to achieve project milestones on schedule.`,
        ],
      });
    }

    const isArabic = language === "ar";
    const prompt = isArabic
      ? `أنت خبير صياغة سير ذاتية مخصص لنظام ATS. قم بتحسين هذه النقطة للخبرة العملية للوظيفة: "${jobTitle || 'المسمى الوظيفي'}"
النقطة الحالية: "${bulletText}"

المطلوب: قدم 3 اقتراحات صياغة احترافية مختلفة، بصيغة أفعال مبنية للمعلوم مع إدراج أرقام وإنجازات وقابليتها للقرائية عبر أجهزة ATS.
أعد النتيجة بتنسيق JSON فقط بالشكل التالي:
{
  "suggestions": [
    "النقطة المحسنة الأولى مع أرقام وإنجازات...",
    "النقطة المحسنة الثانية...",
    "النقطة المحسنة الثالثة..."
  ]
}`
      : `You are an expert ATS resume writer. Optimize this work experience bullet point for the role of "${jobTitle || 'Job Title'}".
Current Bullet: "${bulletText}"

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
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err: any) {
    console.error("Error in /api/ai/enhance-bullet:", err);
    return res.status(500).json({
      error: err.message || "Failed to generate bullet enhancement",
    });
  }
});

// 3. AI: Generate Summary
app.post("/api/ai/generate-summary", async (req, res) => {
  try {
    const { jobTitle, yearsOfExperience, keySkills, targetIndustry, language = "ar" } = req.body;

    const ai = getGeminiClient();
    if (!ai) {
      const fallbackSummary = language === "ar"
        ? `${jobTitle || 'محترف'} شغوف ومبتكر يملك خبرة متميزة تزيد عن ${yearsOfExperience || 'عدة'} سنوات في مجالات ${keySkills || 'تطوير الأعمال والتخطيط الإستراتيجي'}. متخصص في تحقيق النتائج بفاعلية، ورفع الكفاءة التشغيلية، وقيادة الفرق بنجاح.`
        : `Results-driven ${jobTitle || 'Professional'} with ${yearsOfExperience || 'several'} years of proven experience in ${keySkills || 'business development and strategic planning'}. Recognized for optimizing operational efficiency and delivering strong business value.`;
      
      return res.json({ summary: fallbackSummary });
    }

    const isArabic = language === "ar";
    const prompt = isArabic
      ? `أنت خبير في كتابة السير الذاتية ومجال الموارد البشرية في مصر والشرق الأوسط.
اكتب ملخصاً مهنياً (Professional Summary) جذاباً ومحسناً لنظام ATS في 3 أسطر قصيرة ومباشرة باللغة العربية.
المسمى الوظيفي: ${jobTitle}
سنوات الخبرة: ${yearsOfExperience || '1-3'} سنوات
أبرز المهارات: ${keySkills || 'التواصل، إدارة المشاريع، حل المشكلات'}
المجال المستهدف: ${targetIndustry || 'العام'}

أعد النتيجة بتنسيق JSON بالشكل التالي:
{
  "summary": "الملخص المهني المقترح..."
}`
      : `You are a professional resume writer and HR specialist.
Write a compelling, ATS-optimized 3-sentence professional summary for:
Job Title: ${jobTitle}
Years of Experience: ${yearsOfExperience || '1-3'}
Key Skills: ${keySkills || 'Communication, Project Management'}
Target Industry: ${targetIndustry || 'General'}

Return JSON format:
{
  "summary": "Generated professional summary..."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (err: any) {
    console.error("Error in /api/ai/generate-summary:", err);
    return res.status(500).json({ error: err.message || "Failed to generate summary" });
  }
});

// 4. AI: Suggest Skills
app.post("/api/ai/suggest-skills", async (req, res) => {
  try {
    const { jobTitle, language = "ar" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        technicalSkills: language === "ar" ? ["إدارة البيانات", "التحليل الإحصائي", "حل المشكلات التقنية"] : ["Data Analysis", "Technical Troubleshooting", "Reporting"],
        softSkills: language === "ar" ? ["التواصل الفعال", "العمل الجماعي", "إدارة الوقت"] : ["Effective Communication", "Teamwork", "Time Management"],
        tools: language === "ar" ? ["Microsoft Excel", "Google Docs", "Slack"] : ["Microsoft Excel", "Google Suite", "Slack"],
      });
    }

    const isArabic = language === "ar";
    const prompt = isArabic
      ? `اقترح مهارات مناسبة ومطلوبة في سوق العمل المصري والعربي للمسمى الوظيفي: "${jobTitle}".
قسم المهارات إلى 3 فئات (مهارات تقنية، مهارات شخصية، أدوات وبرامج).
أعد النتيجة بتنسيق JSON:
{
  "technicalSkills": ["مهارة1", "مهارة2", "مهارة3", "مهارة4"],
  "softSkills": ["مهارة1", "مهارة2", "مهارة3"],
  "tools": ["أداة1", "أداة2", "أداة3"]
}`
      : `Suggest high-demand resume skills for the job title: "${jobTitle}".
Categorize into technical skills, soft skills, and tools.
Return JSON:
{
  "technicalSkills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
  "softSkills": ["Skill 1", "Skill 2", "Skill 3"],
  "tools": ["Tool 1", "Tool 2", "Tool 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err: any) {
    console.error("Error in /api/ai/suggest-skills:", err);
    return res.status(500).json({ error: err.message || "Failed to suggest skills" });
  }
});

// 4.5. AI: Quick Inline Transform (Metrics, Polish, Translation)
app.post("/api/ai/quick-transform", async (req, res) => {
  try {
    const { text, type = "polish", role = "محترف", language = "ar" } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "text is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      let fallbackText = text;
      if (type === "metric") {
        fallbackText = language === "ar"
          ? `${text.trim()}، مما ساهم في تحقيق زيادة بنسبة 35% في كفاءة الأداء وخفض التكاليف التشغيلية.`
          : `${text.trim()}, delivering a 35% increase in team throughput and operational efficiency.`;
      } else if (type === "polish") {
        fallbackText = language === "ar"
          ? `قيادة وتطوير ${text.trim()} وتطبيق أفضل المعايير القياسية لضمان الجودة وتحقيق الأهداف المحددة.`
          : `Spearheaded and executed ${text.trim()}, applying industry best practices to achieve key strategic goals.`;
      } else if (type === "translate_en") {
        fallbackText = `Managed and successfully delivered ${text.trim()} with high precision and measurable impact.`;
      }
      return res.json({ resultText: fallbackText });
    }

    let prompt = "";
    if (type === "metric") {
      prompt = language === "ar"
        ? `أنت خبير صياغة سير ذاتية ATS. أعد صياغة هذه الجملة للوظيفة (${role}) مع إضافة أرقام وإنجازات ونسب مئوية واقعية (KPIs / Metrics):
النص: "${text}"
أعد النتيجة بتنسيق JSON: {"resultText": "النص المحسن مع الأرقام"}`
        : `You are an expert ATS resume writer. Rewrite this sentence for a (${role}) to include compelling, realistic quantifiable metrics and percentages (% / KPIs):
Input text: "${text}"
Return JSON: {"resultText": "Enhanced text with metrics"}`;
    } else if (type === "polish") {
      prompt = language === "ar"
        ? `أنت خبير توظيف. حسّن صياغة هذه الجملة لتكون احترافية ومباشرة وتبدأ بفعل قوي مبني للمعلوم ومحسنة لـ ATS:
النص: "${text}"
أعد النتيجة بتنسيق JSON: {"resultText": "النص المحسن والمهني"}`
        : `You are a recruitment specialist. Polish and enhance this sentence with strong action verbs and professional ATS phrasing:
Input text: "${text}"
Return JSON: {"resultText": "Polished text"}`;
    } else if (type === "translate_en") {
      prompt = `Translate and professionally optimize this resume text into high-impact, ATS-friendly professional English for a (${role}):
Input text: "${text}"
Return JSON: {"resultText": "Professional English translation"}`;
    } else if (type === "translate_ar") {
      prompt = `ترجم وحسّن هذا النص ليصبح صياغة مهنية عربية ممتازة ومناسبة للسير الذاتية:
النص: "${text}"
أعد النتيجة بتنسيق JSON: {"resultText": "الترجمة العربية المهنية"}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ resultText: parsed.resultText || text });
  } catch (err: any) {
    console.error("Error in /api/ai/quick-transform:", err);
    return res.status(500).json({ error: err.message || "Failed to transform text" });
  }
});

// 5. AI: ATS Resume Analyzer
app.post("/api/ai/ats-analyzer", async (req, res) => {
  try {
    const { resumeData, jobDescription, language = "ar" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Calculate local heuristic score if AI is unavailable
      let score = 70;
      const suggestions: string[] = [];
      const missingKeywords: string[] = [];

      if (!resumeData.personalInfo?.summary || resumeData.personalInfo.summary.length < 30) {
        score -= 10;
        suggestions.push(language === "ar" ? "أضف ملخصاً مهنياً يلخص أبرز نقاط قوتك في 3 أسطر." : "Add a complete professional summary highlighting your key strengths.");
      }
      if (!resumeData.experiences || resumeData.experiences.length === 0) {
        score -= 20;
        suggestions.push(language === "ar" ? "أضف خبرة عملية واحدة على الأقل مع نقاط تفصيلية للأنشطة." : "Add at least one work experience with impact bullet points.");
      }
      if (!resumeData.skills || resumeData.skills.length < 5) {
        score -= 10;
        suggestions.push(language === "ar" ? "أضف على الأقل 5 مهارات ذات صلة بالوظيفة المستهدفة." : "Include at least 5 relevant skills.");
      }

      return res.json({
        score: Math.max(score, 50),
        verdict: score >= 80 ? (language === "ar" ? "ممتاز وجاهز للتقديم" : "Excellent & Ready") : (language === "ar" ? "جيد ويحتاج تحسينات بسيطة" : "Good with minor improvements needed"),
        strengths: language === "ar" ? ["تنسيق واضح وسهل القراءة ببرامج ATS", "معلومات الاتصال المباشرة موجودة"] : ["Clear ATS-friendly formatting", "Complete contact details"],
        missingKeywords: missingKeywords.length ? missingKeywords : (language === "ar" ? ["إدارة الأداء", "التخطيط التنفيذي"] : ["Performance Management", "Strategic Execution"]),
        actionPoints: suggestions.length ? suggestions : [language === "ar" ? "أضف أرقاماً ومقاييس إنجاز لكل نقطة خبرة." : "Add quantifiable metrics to experience bullet points."],
      });
    }

    const isArabic = language === "ar";
    const prompt = isArabic
      ? `أنت نظام فحص سير ذاتية آلي (ATS) ومسؤول توظيف محترف. قم بتحليل السيرة الذاتية التالية مقارنة بالمتطلبات:

بيانات السيرة الذاتية:
${JSON.stringify(resumeData, null, 2)}

الوصف الوظيفي المستهدف (إن وجد):
"${jobDescription || 'غير محدد - تحليل عام لنظام ATS'}"

المطلوب: أعد تقييماً شاملاً بتنسيق JSON دقيق:
{
  "score": 85, // درجة من 0 إلى 100
  "verdict": "تقييم عام مختصر في 5 كلمات",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "missingKeywords": ["كلمة مفتاحية هامة مفقودة 1", "كلمة 2"],
  "actionPoints": ["توصية عمل قابلة للتطبيق 1", "توصية 2", "توصية 3"]
}`
      : `You are an automated Applicant Tracking System (ATS) and professional recruiter. Analyze the following resume:

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Target Job Description (if any):
"${jobDescription || 'General ATS Analysis'}"

Provide a detailed evaluation JSON:
{
  "score": 85, // integer 0-100
  "verdict": "Short verdict phrase",
  "strengths": ["Strength 1", "Strength 2"],
  "missingKeywords": ["Keyword 1", "Keyword 2"],
  "actionPoints": ["Action point 1", "Action point 2"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (err: any) {
    console.error("Error in /api/ai/ats-analyzer:", err);
    return res.status(500).json({ error: err.message || "Failed to analyze resume" });
  }
});

// 5b. AI: Parse uploaded Resume File (PDF / JSON / Text) into structured ResumeData
app.post("/api/ai/parse-resume", async (req, res) => {
  try {
    const { base64Data, mimeType, textContent, rawJson, language = "ar" } = req.body;

    // 1. If raw JSON is provided directly
    if (rawJson && typeof rawJson === "object") {
      return res.json({ success: true, resumeData: rawJson });
    }

    const ai = getGeminiClient();

    // 2. If Gemini AI is available and base64Data or textContent is present
    if (ai) {
      const systemPrompt = `You are an expert AI Resume Parser. Extract all structured resume information from the attached CV document into clean JSON format matching the schema below.
Ensure language is preserved (Arabic or English as in the document).

Required JSON format:
{
  "personalInfo": {
    "fullName": "Name extracted from CV",
    "jobTitle": "Job title or headline",
    "email": "Email address",
    "phone": "Phone number",
    "location": "City, Country",
    "linkedin": "LinkedIn profile link or username",
    "github": "GitHub link or username",
    "summary": "Professional summary or bio paragraph"
  },
  "experiences": [
    {
      "id": "exp-1",
      "company": "Company Name",
      "jobTitle": "Job Title",
      "startDate": "Start Date e.g. 2021",
      "endDate": "End Date e.g. Present",
      "isCurrent": false,
      "location": "Location",
      "description": "Short description",
      "bullets": ["Bullet achievement 1", "Bullet achievement 2"]
    }
  ],
  "education": [
    {
      "id": "edu-1",
      "institution": "University / School",
      "degree": "Degree Name e.g. Bachelor of Computer Science",
      "fieldOfStudy": "Field of Study",
      "startDate": "Start Year",
      "endDate": "End Year",
      "grade": "Grade / GPA if mentioned"
    }
  ],
  "skills": [
    { "id": "sk-1", "name": "Skill Name", "category": "Technical", "level": "Expert" }
  ],
  "projects": [
    {
      "id": "proj-1",
      "title": "Project Name",
      "description": "Project Description",
      "technologies": ["Tech1", "Tech2"],
      "link": "Link if any"
    }
  ],
  "certifications": [
    {
      "id": "cert-1",
      "name": "Certification Name",
      "issuer": "Issuer",
      "issueDate": "Year"
    }
  ],
  "languages": [
    { "id": "lang-1", "name": "Arabic", "proficiency": "Native" }
  ]
}`;

      let contentsPayload: any[] = [];

      if (base64Data && mimeType) {
        // Strip data url prefix if present
        const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, "");
        contentsPayload = [
          {
            inlineData: {
              mimeType: mimeType || "application/pdf",
              data: cleanBase64,
            },
          },
          systemPrompt,
        ];
      } else if (textContent) {
        contentsPayload = [
          `Resume Raw Text Content:\n\n${textContent}\n\n${systemPrompt}`,
        ];
      }

      if (contentsPayload.length > 0) {
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: contentsPayload,
          config: {
            responseMimeType: "application/json",
          },
        });

        const text = response.text || "{}";
        const parsed = JSON.parse(text);
        if (parsed.personalInfo || parsed.experiences || parsed.skills) {
          return res.json({ success: true, resumeData: parsed });
        }
      }
    }

    // 3. Fallback Heuristic Extractor if Gemini is unavailable or failed
    const textToScan = textContent || "";
    const emailMatch = textToScan.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = textToScan.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}/);

    const fallbackData = {
      personalInfo: {
        fullName: textToScan.split("\n")[0]?.trim() || (language === "ar" ? "مستخدم جديد" : "New Candidate"),
        jobTitle: language === "ar" ? "محترف متكافئ" : "Professional Candidate",
        email: emailMatch ? emailMatch[0] : "",
        phone: phoneMatch ? phoneMatch[0] : "",
        location: language === "ar" ? "القاهرة، مصر" : "Cairo, Egypt",
        linkedin: "",
        github: "",
        summary: textToScan.slice(0, 300) || (language === "ar" ? "تم استخراج البيانات المتاحة من الملف المرفق." : "Extracted data from uploaded document."),
      },
      experiences: [
        {
          id: `exp-${Date.now()}`,
          company: language === "ar" ? "شركة سابقة" : "Previous Company",
          jobTitle: language === "ar" ? "خبرة عمل مستخرجة" : "Extracted Work Role",
          startDate: "2021",
          endDate: "2024",
          isCurrent: false,
          location: "",
          description: textToScan.slice(0, 150),
          bullets: [
            language === "ar" ? "تم استخراج هذه الخبرة تلقائياً من السيرة الذاتية المرفوعة." : "Extracted from uploaded resume file.",
          ],
        },
      ],
      education: [],
      skills: [
        { id: `sk-1`, name: "Management", category: "General", level: "Intermediate" },
        { id: `sk-2`, name: "Communication", category: "General", level: "Expert" },
      ],
      projects: [],
      certifications: [],
      languages: [],
    };

    return res.json({ success: true, resumeData: fallbackData });
  } catch (err: any) {
    console.error("Error in /api/ai/parse-resume:", err);
    return res.status(500).json({ error: err.message || "Failed to parse resume file" });
  }
});

// 6. Activation Code Verification (Google Apps Script Integration)
app.post("/api/verify-code", async (req, res) => {
  try {
    const { code, reference } = req.body;
    if (!code || typeof code !== "string") {
      return res.status(400).json({ success: false, valid: false, message: "كود التفعيل مطلوب" });
    }

    const cleanCode = code.trim().toUpperCase();
    const cleanReference = reference ? String(reference).trim() : "";

    // Check Google Apps Script URL from environment variable
    const gasUrl = process.env.VITE_PAYMENT_API_URL || process.env.GAS_VERIFY_URL;
    if (!gasUrl) {
      return res.status(500).json({
        success: false,
        valid: false,
        message: "خدمة التحقق من الدفع غير مهيأة في الخادم.",
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
      });

      if (gasResponse.ok) {
        const data = await gasResponse.json();
        if (data && data.success && data.status === "USED") {
          return res.json({
            success: true,
            valid: true,
            status: "USED",
            remainingDownloads: data.remainingDownloads || 1,
            message: data.message || "تم التحقق من كود التفعيل بنجاح!",
            activatedCode: cleanCode,
          });
        }
        return res.status(400).json({
          success: false,
          valid: false,
          message: data?.message || "كود التفعيل غير صالح أو لم يتم تأكيد الدفع بعد.",
        });
      }
    } catch {
      return res.status(503).json({
        success: false,
        valid: false,
        message: "تعذر الاتصال بنظام التحقق من الدفع حالياً. يرجى المحاولة مرة أخرى بعد قليل.",
      });
    }

    return res.status(400).json({
      success: false,
      valid: false,
      message: "فشل التحقق من كود التفعيل. يرجى التأكد من صحة الكود أو التواصل مع الدعم الفني.",
    });
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
