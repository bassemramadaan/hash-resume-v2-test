const fs = require('fs');

let code = fs.readFileSync('server.ts', 'utf8');

// 1. Add getErrorMessage helper
const errorHelper = `
// ==========================================
// AI MIDDLEWARE & UTILITIES
// ==========================================

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  return String(err);
};

interface AiMiddlewareOptions {
  featureKey: keyof ReturnType<typeof getAiConfig>["featureFlags"];
  rateLimitFeature: string;
  unavailableMessageAr: string;
  unavailableMessageEn: string;
  fallbackData: (req: express.Request) => any;
}

const aiMiddleware = (options: AiMiddlewareOptions) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    const config = getAiConfig();
    const clientIp = getClientIp(req);
    
    (req as any).aiStartTime = Date.now();
    (req as any).aiConfig = config;

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

`;

code = code.replace('// ==========================================\n// API ROUTES\n// ==========================================', errorHelper + '// ==========================================\n// API ROUTES\n// ==========================================');

// 2. Fix catch (err: any) to catch (err: unknown)
code = code.replace(/catch \(err: any\)/g, 'catch (err: unknown)');
code = code.replace(/catch \(gasErr: any\)/g, 'catch (gasErr: unknown)');
code = code.replace(/error: err\?\.message/g, 'error: getErrorMessage(err)');
code = code.replace(/error: gasErr\?\.message/g, 'error: getErrorMessage(gasErr)');

// We need to write this modified code to a file so we can manually review it
fs.writeFileSync('server.refactored.ts', code);
console.log('Refactor script completed');
