/**
 * Formats a number to USD currency.
 * @param {number} amount 
 * @returns {string} e.g. "$4.99"
 */
export const formatCurrency = (amount) => {
  const numeric = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(numeric);
};

/**
 * Formats number with commas for stats display.
 * @param {number} num 
 * @returns {string} e.g. "15,400"
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US').format(num);
};
