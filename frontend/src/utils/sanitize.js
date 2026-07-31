/**
 * Sanitizes input string to prevent XSS attacks.
 * Escapes HTML characters and trims whitespace.
 * @param {string} str - Raw user input
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

/**
 * Strips all HTML tags entirely.
 * @param {string} str 
 * @returns {string} Plain text
 */
export const stripHtml = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
};
