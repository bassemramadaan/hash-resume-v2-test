/**
 * Payment Service layer communicating with Google Apps Script API or payment gateway via VITE_PAYMENT_API_URL
 */

import { PaymentStatusResponse } from '../types/payment';

const PAYMENT_API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PAYMENT_API_URL) || '';

export async function callPaymentApi(params: Record<string, string>) {
  if (!PAYMENT_API_URL) {
    throw new Error('خدمة الدفع غير مهيأة (VITE_PAYMENT_API_URL غير محدد).');
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
  return await callPaymentApi({
    action: 'submitPayment',
    reference: req.reference,
    senderInfo: req.senderInfo,
    email: req.email,
    amount: req.amount
  });
}

export async function checkPaymentStatus(reference: string) {
  return await callPaymentApi({
    action: 'checkStatus',
    reference: reference
  });
}

export async function verifyActivationCode(code: string, reference: string) {
  try {
    return await callPaymentApi({
      action: 'verify',
      code: code,
      reference: reference
    });
  } catch (err: any) {
    // If external Google Apps Script fails, check backend verify-code proxy
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


