/**
 * Smart SMS & Transfer Receipt Parser (خاصية اللصق الذكي لرسائل التحويل)
 * Automatically extracts transaction references, amounts, and providers from
 * InstaPay, Vodafone Cash, and Egyptian Bank notifications.
 */

export interface ParsedTransferResult {
  isValid: boolean;
  reference: string;
  amount?: '50' | '120' | string;
  provider?: 'instapay' | 'vodafone' | 'bank' | 'wallet';
  senderOrPayee?: string;
  summaryAr: string;
  summaryEn: string;
}

const ARABIC_DIGITS: Record<string, string> = {
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
};

export function normalizeArabicDigits(text: string): string {
  if (!text) return '';
  return text.replace(/[٠-٩]/g, (digit) => ARABIC_DIGITS[digit] || digit);
}

export function parseTransferMessage(rawText: string): ParsedTransferResult {
  if (!rawText || typeof rawText !== 'string') {
    return {
      isValid: false,
      reference: '',
      summaryAr: 'لم يتم العثور على نص للتحليل',
      summaryEn: 'No text provided for parsing',
    };
  }

  const normalized = normalizeArabicDigits(rawText.trim());

  // 1. Detect Provider
  let provider: 'instapay' | 'vodafone' | 'bank' | 'wallet' = 'instapay';
  const lower = normalized.toLowerCase();

  if (
    lower.includes('instapay') ||
    normalized.includes('إنستاباي') ||
    normalized.includes('انستاباي') ||
    lower.includes('ipn.eg') ||
    lower.includes('@instapay')
  ) {
    provider = 'instapay';
  } else if (
    lower.includes('vodafone') ||
    normalized.includes('فودافون') ||
    lower.includes('orange') ||
    normalized.includes('أورانج') ||
    normalized.includes('اورانج') ||
    lower.includes('etisalat') ||
    normalized.includes('اتصالات') ||
    lower.includes('we cash') ||
    normalized.includes('وي كاش') ||
    normalized.includes('محفظة')
  ) {
    provider = 'vodafone';
  } else if (
    lower.includes('cib') ||
    lower.includes('nbe') ||
    normalized.includes('الأهلي') ||
    normalized.includes('الاهلي') ||
    normalized.includes('بنك مصر') ||
    lower.includes('qnb') ||
    lower.includes('banque misr') ||
    lower.includes('alexbank')
  ) {
    provider = 'bank';
  }

  // 2. Extract Reference / Transaction Number
  // Priority A: Labelled reference patterns
  // Examples:
  // "مرجع: 104829104829" or "المرجع 104829104829" or "رقم العملية: 202409280123"
  // "رقم المعاملة 987654321" or "Ref: 987654321" or "Transaction ID: 987654321"
  // "RRN: 104829104829" or "كود التحويل: 104829104829"
  const labelledRefRegex =
    /(?:مرجع|المرجع|رقم\s*المرجع|رقم\s*العملية|رقم\s*المعاملة|عملية\s*رقم|معاملة\s*رقم|كود\s*العملية|كود\s*التحويل|الرقم\s*المرجعي|ref(?:erence)?|txn?(?:\s*id)?|transaction(?:\s*id)?|rrn)\s*[:#=\-\s]?\s*([A-Za-z0-9\-_]{6,26})/i;

  let foundRef = '';
  const labelledMatch = normalized.match(labelledRefRegex);

  if (labelledMatch && labelledMatch[1]) {
    // Strip leading punctuation or noise
    foundRef = labelledMatch[1].replace(/^[#:\s]+|[#:\s]+$/g, '');
  }

  // Priority B: If no labelled reference found, look for standalone candidate reference numbers (6-20 digits)
  // We must skip Egyptian phone numbers like 010xxxxxxxx, 011xxxxxxxx, 012xxxxxxxx, 015xxxxxxxx
  if (!foundRef) {
    const numbers = normalized.match(/\b\d{6,20}\b/g) || [];
    for (const num of numbers) {
      const isEgyptianPhone = /^01[0125]\d{8}$/.test(num);
      const isDateOnly = /^(19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/.test(num);
      if (!isEgyptianPhone && !isDateOnly) {
        foundRef = num;
        break;
      }
    }
  }

  // Priority C: Check if user literally just pasted a clean reference string
  if (!foundRef && /^[A-Za-z0-9\-_]{6,26}$/.test(normalized)) {
    foundRef = normalized;
  }

  // 3. Extract Amount (e.g. 50 or 120 EGP)
  // Matches: "مبلغ 50.00 جم" or "50 جنيه" or "EGP 50.00" or "بمبلغ 120 ج.م"
  let parsedAmount: '50' | '120' | string | undefined = undefined;

  const amountRegexA =
    /(?:مبلغ|بقيمة|قيمة|بمبلغ|amount|egp|جم|جنيه|ج\.م)\s*[:#=\-\s]?\s*(\d+(?:\.\d+)?)/i;
  const amountRegexB =
    /(\d+(?:\.\d+)?)\s*(?:egp|جم|جنيه|ج\.م)/i;

  const matchAmtA = normalized.match(amountRegexA);
  const matchAmtB = normalized.match(amountRegexB);

  const rawAmtStr = matchAmtA?.[1] || matchAmtB?.[1];
  if (rawAmtStr) {
    const num = Math.round(parseFloat(rawAmtStr));
    if (num === 50) parsedAmount = '50';
    else if (num === 120) parsedAmount = '120';
    else if (num > 0) parsedAmount = String(num);
  } else {
    // Check if 50 or 120 is standalone in the text
    if (/\b120\b/.test(normalized)) parsedAmount = '120';
    else if (/\b50\b/.test(normalized)) parsedAmount = '50';
  }

  // 4. Extract Sender / Payee if present
  let senderOrPayee = '';
  const senderMatch = normalized.match(/(?:من|from|بواسطة)\s+([^\n,،.]+)/i);
  if (senderMatch && senderMatch[1]) {
    const s = senderMatch[1].trim();
    if (s.length > 2 && s.length < 40) {
      senderOrPayee = s;
    }
  }

  const isValid = Boolean(foundRef && foundRef.length >= 6);

  const summaryAr = isValid
    ? `تم استخراج رقم المرجع بنجاح (${foundRef})${parsedAmount ? ` بمبلغ ${parsedAmount} ج.م` : ''}`
    : 'لم يتم العثور على رقم مرجع صالح في النص الملصوق';

  const summaryEn = isValid
    ? `Reference extracted successfully (${foundRef})${parsedAmount ? ` Amount: ${parsedAmount} EGP` : ''}`
    : 'No valid reference number found in the pasted text';

  return {
    isValid,
    reference: foundRef,
    amount: parsedAmount,
    provider,
    senderOrPayee,
    summaryAr,
    summaryEn,
  };
}
