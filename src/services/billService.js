const billRepository = require('../repositories/billRepository');
const { calculateTotals } = require('../utils/helpers');

async function createBill({ customer_name, customer_phone, customer_address, bill_date, items, discount }) {
  if (!customer_name || !customer_name.trim()) {
    throw { status: 400, message: 'Customer name is required' };
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw { status: 400, message: 'At least one item is required' };
  }

  for (const item of items) {
    if (!item.product_name || !item.product_name.trim()) {
      throw { status: 400, message: 'Product name is required for all items' };
    }
    if (!item.quantity || parseFloat(item.quantity) <= 0) {
      throw { status: 400, message: 'Quantity must be positive' };
    }
    if (item.unit_price === undefined || parseFloat(item.unit_price) < 0) {
      throw { status: 400, message: 'Unit price cannot be negative' };
    }
  }

  const parsedDiscount = parseFloat(discount) || 0;
  if (parsedDiscount < 0) {
    throw { status: 400, message: 'Discount cannot be negative' };
  }

  const calculatedItems = items.map(item => ({
    ...item,
    quantity: parseFloat(item.quantity),
    unit_price: parseFloat(item.unit_price),
    total: parseFloat(item.quantity) * parseFloat(item.unit_price),
  }));

  const { subtotal, total } = calculateTotals(calculatedItems, parsedDiscount);

  return billRepository.create({
    customer_name: customer_name.trim(),
    customer_phone: customer_phone?.trim() || null,
    customer_address: customer_address?.trim() || null,
    bill_date: bill_date || new Date().toISOString().split('T')[0],
    items: calculatedItems,
    subtotal,
    discount: parsedDiscount,
    total,
  });
}

async function getBills(options) {
  return billRepository.findAll(options);
}

async function getBillById(id) {
  const bill = await billRepository.findById(id);
  if (!bill) {
    throw { status: 404, message: 'Bill not found' };
  }
  return bill;
}

async function searchBills(query) {
  return billRepository.findAll({ search: query });
}

async function getBillCount() {
  return billRepository.count();
}

module.exports = { createBill, getBills, getBillById, searchBills, getBillCount };
