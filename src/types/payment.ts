/**
 * Payment & Activation Type Definitions
 */

export interface PaymentStatusResponse {
  status: 'pending' | 'approved' | 'rejected' | string;
  codes?: string[];
  email?: string;
  message?: string;
}

export interface ProcessedPaymentCodes {
  /**
   * Code automatically used for the current resume download
   */
  activatedCode: string;
  /**
   * Remaining unused codes (empty array [] for 50 EGP plan)
   */
  remainingCodes: string[];
}

/**
 * Derives activatedCode and remainingCodes from the response codes array:
 * - If length = 1 (50 EGP plan): activatedCode = codes[0], remainingCodes = []
 * - If length = 3 (120 EGP plan): activatedCode = codes[0], remainingCodes = [codes[1], codes[2]]
 */
export function parsePaymentCodes(codes: string[] = []): ProcessedPaymentCodes {
  if (!codes || codes.length === 0) {
    return { activatedCode: '', remainingCodes: [] };
  }
  if (codes.length === 1) {
    return {
      activatedCode: codes[0],
      remainingCodes: [],
    };
  }
  return {
    activatedCode: codes[0],
    remainingCodes: codes.slice(1),
  };
}
