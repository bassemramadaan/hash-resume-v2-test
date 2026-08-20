export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      valid: false,
      message: "Method not allowed",
    });
  }

  try {
    console.log("[verify-proxy] verify-proxy reached");

    const { code, reference } = req.body || {};
    if (!code || typeof code !== "string") {
      return res.status(400).json({
        success: false,
        valid: false,
        message: "كود التفعيل مطلوب",
      });
    }

    const cleanCode = code.trim().toUpperCase();
    const cleanReference = reference ? String(reference).trim() : "";

    const gasUrl =
      process.env.PAYMENT_API_URL ||
      process.env.VITE_PAYMENT_API_URL ||
      process.env.GAS_VERIFY_URL;

    if (!gasUrl) {
      console.log("[verify-proxy] Error: PAYMENT_API_URL is missing in environment");
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

      console.log(`[verify-proxy] GAS HTTP status: ${gasResponse.status}`);

      const rawText = await gasResponse.text();
      let data: any = null;
      try {
        data = JSON.parse(rawText);
      } catch {
        data = null;
      }

      console.log(`[verify-proxy] GAS response success: ${data?.success}`);
      console.log(`[verify-proxy] GAS response status: ${data?.status}`);

      // Strict acceptance: accept only { success: true, status: "USED" }
      if (gasResponse.ok && data && data.success === true && data.status === "USED") {
        return res.status(200).json({
          success: true,
          valid: true,
          status: "USED",
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
    } catch (gasErr: any) {
      console.log(`[verify-proxy] GAS request failed: ${gasErr?.name || "FetchError"}`);
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
