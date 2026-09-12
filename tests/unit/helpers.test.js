const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { calculateTotals, formatNumber } = require('../../src/utils/helpers');

describe('calculateTotals', function () {
  it('should calculate subtotal for single item', function () {
    const items = [{ quantity: 5, unit_price: 100 }];
    const result = calculateTotals(items);
    assert.equal(result.subtotal, 500);
    assert.equal(result.total, 500);
  });

  it('should calculate subtotal for multiple items', function () {
    const items = [
      { quantity: 2, unit_price: 100 },
      { quantity: 3, unit_price: 50 },
    ];
    const result = calculateTotals(items);
    assert.equal(result.subtotal, 350);
    assert.equal(result.total, 350);
  });

  it('should apply discount', function () {
    const items = [{ quantity: 10, unit_price: 100 }];
    const result = calculateTotals(items, 50);
    assert.equal(result.subtotal, 1000);
    assert.equal(result.total, 950);
  });

  it('should handle zero discount', function () {
    const items = [{ quantity: 1, unit_price: 200 }];
    const result = calculateTotals(items, 0);
    assert.equal(result.subtotal, 200);
    assert.equal(result.total, 200);
  });

  it('should not go below zero total', function () {
    const items = [{ quantity: 1, unit_price: 50 }];
    const result = calculateTotals(items, 100);
    assert.equal(result.subtotal, 50);
    assert.equal(result.total, 0);
  });

  it('should handle decimal quantities and prices', function () {
    const items = [{ quantity: 1.5, unit_price: 33.33 }];
    const result = calculateTotals(items);
    assert.equal(result.subtotal, 49.99);
  });

  it('should handle empty items', function () {
    const result = calculateTotals([]);
    assert.equal(result.subtotal, 0);
    assert.equal(result.total, 0);
  });
});

describe('formatNumber', function () {
  it('should format number with 2 decimals', function () {
    assert.equal(formatNumber(100), '100.00');
  });

  it('should format decimal number', function () {
    assert.equal(formatNumber(1234.5), '1,234.50');
  });
});
