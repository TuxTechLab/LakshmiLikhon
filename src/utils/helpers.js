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
 */
function calculateTotals(items, discount = 0) {
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = parseFloat(item.quantity) * parseFloat(item.unit_price);
    return sum + itemTotal;
  }, 0);

  const total = Math.max(0, subtotal - parseFloat(discount));

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
  };
}

module.exports = { formatNumber, calculateTotals };
