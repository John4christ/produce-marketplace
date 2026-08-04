/**
 * Validates an email address.
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates a phone number (basic international format).
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^\+?\d{7,15}$/.test(cleaned);
};

/**
 * Returns whether a value is non-empty after trimming.
 * @param {string} value
 * @returns {boolean}
 */
export const isRequired = (value) => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Validates search query input for safe length and safe characters.
 * @param {string} query 
 * @returns {{isValid: boolean, error?: string}}
 */
export const validateSearchQuery = (query) => {
  if (!query) return { isValid: true };
  if (query.length > 100) {
    return { isValid: false, error: 'Search query is too long (max 100 characters)' };
  }
  return { isValid: true };
};
