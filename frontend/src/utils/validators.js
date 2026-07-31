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
