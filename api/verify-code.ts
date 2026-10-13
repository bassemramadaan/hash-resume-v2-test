// In-memory rate limiting map for serverless execution
const ipAttemptMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipAttemptMap.get(ip);
  if (!record || now > record.resetAt) {
    ipAttemptMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 }); // 10 min window
    return true;
  }
  if (record.count >= 10) {
    return false; // Exceeded 10 attempts in 10 minutes
  }
  record.count += 1;
  return true;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      valid: false,
      message: "Method not allowed",
    });
  }

  // Rate Limiting check
  const clientIp =
    (typeof req.headers?.["x-forwarded-for"] === "string"
      ? req.headers["x-forwarded-for"].split(",")[0].trim()
      : req.socket?.remoteAddress) || "127.0.0.1";

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      success: false,
      valid: false,
      message: "تم تجاوز عدد محاولات التحقق المسموح بها (10 محاولات). يرجى الانتظار 10 دقائق قبل المحاولة مجدداً لحماية الحساب.",
    });
  }

  try {
    const { code, reference } = req.body || {};
    if (!code || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "كود التفعيل مطلوب",
      });
    }

    const cleanCode = code.trim().toUpperCase();
    const cleanReference = reference ? String(reference).trim().slice(0, 120) : "";

    // Security guard: prevent oversized or invalid code format attacks
    if (cleanCode.length < 3 || cleanCode.length > 64 || !/^[A-Z0-9\-_]+$/i.test(cleanCode)) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "صيغة كود التفعيل غير صالحة",
      });
    }

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

      // Strict acceptance: accept only { success: true, status: "USED" } or approved
      if (
        gasResponse.ok &&
        data &&
        (data.success === true || data.valid === true) &&
        (data.status === "USED" || data.status === "APPROVED" || data.status === "ACTIVE" || data.valid === true)
      ) {
        return res.status(200).json({
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
    } catch {
      return res.status(503).json({
        success: false,
        valid: false,
        message: "تعذر الاتصال بنظام التحقق من الدفع حالياً. يرجى المحاولة مرة أخرى بعد قليل.",
      });
    }
  } catch {
    return res.status(500).json({
      success: false,
      valid: false,
      message: "حدث خطأ في الخادم أثناء التحقق",
    });
  }
}
