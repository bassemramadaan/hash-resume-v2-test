/**
 * Helper to produce friendly, human-centered error messages for API and AI service calls.
 */

export function parseApiError(err: unknown, isAr: boolean = true): string {
  // 1. Offline / Network disconnection
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return isAr
      ? 'يبدو أن اتصال الإنترنت منقطع. يرجى التحقق من الشبكة ثم إعادة المحاولة.'
      : 'You appear to be offline. Please check your internet connection and try again.';
  }

  const msg = (err instanceof Error ? err.message : String(err)).toLowerCase();

  // 2. Fetch / Network failures
  if (msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('load failed') || msg.includes('econnrefused')) {
    return isAr
      ? 'تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت وإعادة المحاولة.'
      : 'Unable to connect to the server. Please check your connection and try again.';
  }

  // 3. Request Timeout
  if (msg.includes('timeout') || msg.includes('timed out') || msg.includes('deadline_exceeded') || msg.includes('504')) {
    return isAr
      ? 'استغرقت المعالجة وقتاً أطول من المتوقع بسبب ضغط الشبكة. يرجى المحاولة مجدداً.'
      : 'The request timed out due to network latency. Please try again.';
  }

  // 4. Rate Limiting / Quota
  if (msg.includes('429') || msg.includes('quota') || msg.includes('resource_exhausted')) {
    return isAr
      ? 'تم استهلاك رصيد الطلبات المؤقت. يمكنك المحاولة بعد قليل أو المتابعة بالتحرير اليدوي.'
      : 'Request quota temporarily reached. Please try again shortly or continue editing manually.';
  }

  // 5. Default friendly error
  return isAr
    ? 'نعتذر، واجهنا صعوبة مؤقتة في معالجة الطلب. يرجى المحاولة مرة أخرى.'
    : 'A temporary issue occurred while processing your request. Please try again.';
}
