/**
 * Payment Service layer communicating with Google Apps Script API or payment gateway via VITE_PAYMENT_API_URL
 */

import { PaymentStatusResponse } from '../types/payment';

const PAYMENT_API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PAYMENT_API_URL) || '';

export async function callPaymentApi(
  params: Record<string, string>,
  options?: { method?: 'GET' | 'POST'; body?: any }
) {
  if (!PAYMENT_API_URL) {
    throw new Error('خدمة الدفع غير مهيأة حالياً. يرجى التواصل مع الدعم الفني.');
  }

  const method = options?.method || 'GET';
  const actionName = (method === 'POST' ? options?.body?.action : params.action) || 'unknown';

  // Safe debugging: Log only action name and HTTP method (never code, email, reference, URL, or env variables)
  console.log(`[Payment API] Request: method=${method}, action=${actionName}`);

  if (method === 'POST') {
    // For POST requests in Google Apps Script, pass text/plain with JSON string to avoid CORS preflight issues
    const response = await fetch(PAYMENT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(options?.body || params),
    });

    let result: any = null;
    try {
      result = await response.json();
    } catch {
      result = null;
    }

    // Safe debugging: Log only method, action, response status, success/status
    console.log(
      `[Payment API] Response: method=${method}, action=${actionName}, httpStatus=${response.status}, success=${result?.success}, status=${result?.status}`
    );

    if (!response.ok || !result || result.success !== true) {
      throw new Error(result?.message || 'تعذر تسجيل عملية التحويل.');
    }
    return result;
  }

  const url = new URL(PAYMENT_API_URL);
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url.toString());
  let result: any = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }

  // Safe debugging: Log only method, action, response status, success/status
  console.log(
    `[Payment API] Response: method=${method}, action=${actionName}, httpStatus=${response.status}, success=${result?.success}, status=${result?.status}`
  );

  if (!response.ok || !result) {
    throw new Error(result?.message || 'تعذر الاتصال بخدمة الدفع.');
  }

  return result;
}

export interface SubmitPaymentRequest {
  reference: string;
  senderInfo?: string;
  email: string;
  amount: '50' | '120';
}

export async function submitPayment(req: SubmitPaymentRequest) {
  const cleanRef = (req.reference || '').trim();
  const cleanEmail = (req.email || '').trim();
  const cleanSender = (req.senderInfo || '').trim() || 'InstaPay';
  const cleanAmount = req.amount === '120' ? '120' : '50';

  if (!cleanRef || !cleanEmail || !cleanAmount) {
    throw new Error('جميع الحقول الإلزامية مطلوبة (المرجع، البريد الإلكتروني، والمبلغ).');
  }

  return await callPaymentApi(
    {},
    {
      method: 'POST',
      body: {
        action: 'submitPayment',
        reference: cleanRef,
        senderInfo: cleanSender,
        email: cleanEmail,
        amount: cleanAmount,
      },
    }
  );
}

export async function checkPaymentStatus(reference: string) {
  return await callPaymentApi({
    action: 'checkStatus',
    reference: reference,
  });
}

export async function verifyActivationCode(code: string, reference: string) {
  try {
    const response = await fetch('/api/verify-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: code ? code.trim().toUpperCase() : '',
        reference: reference ? reference.trim() : '',
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (
      response.ok &&
      data.success &&
      (data.status === 'USED' || data.status === 'APPROVED' || data.status === 'ACTIVE' || data.valid === true)
    ) {
      return {
        success: true,
        status: data.status || 'USED',
        message: data.message || 'تم تفعيل الكود بنجاح!',
        remainingDownloads: data.remainingDownloads || 1,
      };
    }

    // Fail closed
    return {
      success: false,
      message: data.message || 'فشل التحقق من كود التفعيل. يرجى التأكد من صحة الكود أو التواصل مع الدعم الفني.',
    };
  } catch (err: any) {
    // Fail closed: Never return synthetic success on network/verification error
    return {
      success: false,
      message: 'تعذر الاتصال بخدمة التحقق من الدفع حالياً. يرجى المحاولة مرة أخرى بعد قليل.',
    };
  }
}


