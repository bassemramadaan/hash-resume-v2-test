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

  if (method === 'POST') {
    // For POST requests in Google Apps Script, pass text/plain with JSON string to avoid CORS preflight issues
    const response = await fetch(PAYMENT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(options?.body || params),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'تعذر الاتصال بخدمة الدفع.');
    }
    return result;
  }

  const url = new URL(PAYMENT_API_URL);
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url.toString());
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'تعذر الاتصال بخدمة الدفع.');
  }

  return result;
}

export interface SubmitPaymentRequest {
  reference: string;
  senderInfo: string;
  email: string;
  amount: string;
}

export async function submitPayment(req: SubmitPaymentRequest) {
  return await callPaymentApi(
    {},
    {
      method: 'POST',
      body: {
        action: 'submitPayment',
        reference: req.reference,
        senderInfo: req.senderInfo,
        email: req.email,
        amount: req.amount,
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
    // Send state-modifying verify request via POST to keep code/reference out of URL
    return await callPaymentApi(
      {},
      {
        method: 'POST',
        body: {
          action: 'verify',
          code: code,
          reference: reference,
        },
      }
    );
  } catch (err: any) {
    // If direct Google Apps Script POST fails, fallback to backend verify-code proxy
    try {
      const serverRes = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, reference }),
      });
      const data = await serverRes.json();
      if (serverRes.ok && data.valid && data.status === 'USED') {
        return {
          success: true,
          status: 'USED',
          message: data.message || 'تم تفعيل الكود بنجاح!',
          remainingDownloads: data.remainingDownloads || 1,
        };
      }
    } catch {
      // ignore proxy fetch errors and fail closed below
    }

    // Fail closed: Never return synthetic success on network/verification error
    return {
      success: false,
      message: err.message || 'فشل التحقق من كود التفعيل. يرجى التأكد من الكود أو المحاولة مرة أخرى.',
    };
  }
}


