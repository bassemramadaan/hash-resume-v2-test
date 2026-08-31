const fs = require('fs');

let code = fs.readFileSync('server.refactored.ts', 'utf8');

// The blocks to remove from endpoints:
const killSwitchRegex = /\/\/\ 1\.\ Check Kill-Switch \& Feature Flag[\s\S]*?\/\/ 2\.\ Check Model and API Key/g;
const apiKeyRegex = /\/\/\ 2\.\ Check Model and API Key[\s\S]*?\/\/ 3\.\ Input Validation/g;
const rateLimitRegex = /\/\/\ [0-9]+\.\ (Rate Limit Check|Check Rate Limit)[\s\S]*?if \(!rateLimit\.allowed\) \{[\s\S]*?return res\.status\(429\)\.json\(\{[\s\S]*?\}\);\n  \}/g;
const initStartRegex = /  const startTime = Date\.now\(\);\n  const clientIp = getClientIp\(req\);\n  const config = getAiConfig\(\);\n/g;

// Now, we need to apply the middleware to the app.post calls
// For enhance-bullet:
code = code.replace(
  'app.post("/api/ai/enhance-bullet", async (req, res) => {',
  `app.post("/api/ai/enhance-bullet", aiMiddleware({
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
  const startTime = (req as any).aiStartTime;
  const config = (req as any).aiConfig;
  const clientIp = getClientIp(req);`
);

// For generate-summary:
code = code.replace(
  'app.post("/api/ai/generate-summary", async (req, res) => {',
  `app.post("/api/ai/generate-summary", aiMiddleware({
  featureKey: "summary",
  rateLimitFeature: "summary",
  unavailableMessageAr: "ميزة إنشاء الملخص المهني بالذكاء الاصطناعي غير مفعلة حالياً.",
  unavailableMessageEn: "AI Summary Generator is currently disabled.",
  fallbackData: (req) => ({
    summary: req.body.language === "en"
      ? "Results-driven professional with a solid track record in optimizing operational workflows and delivering measurable business impact."
      : "محترف شغوف يمتلك خبرة متميزة في تطوير العمليات ورفع الكفاءة التشغيلية وتحقيق الأهداف المؤسسية بدقة.",
  })
}), async (req, res) => {
  const startTime = (req as any).aiStartTime;
  const config = (req as any).aiConfig;
  const clientIp = getClientIp(req);`
);

// For suggest-skills:
code = code.replace(
  'app.post("/api/ai/suggest-skills", async (req, res) => {',
  `app.post("/api/ai/suggest-skills", aiMiddleware({
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
  const startTime = (req as any).aiStartTime;
  const config = (req as any).aiConfig;
  const clientIp = getClientIp(req);`
);

// For quick-transform:
code = code.replace(
  'app.post("/api/ai/quick-transform", async (req, res) => {',
  `app.post("/api/ai/quick-transform", aiMiddleware({
  featureKey: "experience",
  rateLimitFeature: "transform",
  unavailableMessageAr: "ميزة التحويل السريع غير مفعلة حالياً.",
  unavailableMessageEn: "Quick Transform is currently disabled.",
  fallbackData: (req) => ({ resultText: req.body.text || "" })
}), async (req, res) => {
  const startTime = (req as any).aiStartTime;
  const config = (req as any).aiConfig;
  const clientIp = getClientIp(req);`
);

// For ats-analyzer:
code = code.replace(
  'app.post("/api/ai/ats-analyzer", async (req, res) => {',
  `app.post("/api/ai/ats-analyzer", aiMiddleware({
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
  const startTime = (req as any).aiStartTime;
  const config = (req as any).aiConfig;
  const clientIp = getClientIp(req);`
);

// For suggest-keywords:
code = code.replace(
  'app.post("/api/ai/suggest-keywords", async (req, res) => {',
  `app.post("/api/ai/suggest-keywords", aiMiddleware({
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
  const startTime = (req as any).aiStartTime;
  const config = (req as any).aiConfig;
  const clientIp = getClientIp(req);`
);

// For quantify-achievement:
code = code.replace(
  'app.post("/api/ai/quantify-achievement", async (req, res) => {',
  `app.post("/api/ai/quantify-achievement", aiMiddleware({
  featureKey: "experience",
  rateLimitFeature: "bullet",
  unavailableMessageAr: "ميزة صياغة الإنجازات غير مفعلة حالياً.",
  unavailableMessageEn: "Achievement quantification is currently disabled.",
  fallbackData: (req) => ({
    quantifiedAchievement: req.body.text
      ? \`\${req.body.text}، مما حقق نمواً بنسبة 35% وزيادة الكفاءة التشغيلية.\`
      : "حسّنت كفاءة العمليات بنسبة 30% من خلال أتمتة الإجراءات اليومية."
  })
}), async (req, res) => {
  const startTime = (req as any).aiStartTime;
  const config = (req as any).aiConfig;
  const clientIp = getClientIp(req);`
);

// Remove the duplicated logic
code = code.replace(initStartRegex, '');
code = code.replace(killSwitchRegex, '// 3. Input Validation');
code = code.replace(apiKeyRegex, '// 3. Input Validation');
// Note: Some don't have "3. Input Validation" comment because they are simple, e.g., suggest-skills.
// We can just manually clean it up if regex is too messy.

fs.writeFileSync('server.stripped.ts', code);
console.log('Done mapping middlewares. Need manual cleanup for regex.');
