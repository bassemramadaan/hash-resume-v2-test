/**
 * Generates unique, collision-resistant IDs for resume elements (experiences, skills, etc.)
 * Uses Web Crypto API (crypto.randomUUID) when available, with a random fallback.
 */
export const generateId = (prefix: string = 'id'): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID().substring(0, 8)}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};
