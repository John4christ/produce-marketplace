/**
 * Formats a number to Nigerian Naira currency.
 * @param {number} amount 
 * @returns {string} e.g. "₦4.99"
 */
export const formatCurrency = (amount) => {
  const numeric = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
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
