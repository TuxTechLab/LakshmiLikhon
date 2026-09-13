/**
 * Format a number as currency (no currency symbol, just formatted number)
 */
function formatNumber(num) {
  return Number(num).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Calculate bill totals from items
 * @param {Array} items - Array of items with quantity and unit_price
 * @param {number} discountPercent - Discount percentage (0-100)
 */
function calculateTotals(items, discountPercent = 0) {
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = parseFloat(item.quantity) * parseFloat(item.unit_price);
    return sum + itemTotal;
  }, 0);

  const discountAmount = parseFloat(((subtotal * discountPercent) / 100).toFixed(2));
  const total = Math.max(0, parseFloat((subtotal - discountAmount).toFixed(2)));

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    discount_amount: discountAmount,
    total,
  };
}

module.exports = { formatNumber, calculateTotals };
