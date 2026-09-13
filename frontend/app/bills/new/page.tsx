'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

interface Item {
  product_name: string;
  description: string;
  quantity: string;
  unit_price: string;
}

export default function CreateBill() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
  const [items, setItems] = useState<Item[]>([
    { product_name: '', description: '', quantity: '1', unit_price: '' },
  ]);
  const [discount, setDiscount] = useState('0');

  function addItem() {
    setItems([...items, { product_name: '', description: '', quantity: '1', unit_price: '' }]);
  }

  function removeItem(index: number) {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof Item, value: string) {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  }

  function getItemTotal(item: Item): number {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unit_price) || 0;
    return qty * price;
  }

  function getSubtotal(): number {
    return items.reduce((sum, item) => sum + getItemTotal(item), 0);
  }

  function getDiscountAmount(): number {
    return (getSubtotal() * (parseFloat(discount) || 0)) / 100;
  }

  function getTotal(): number {
    return getSubtotal() - getDiscountAmount();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const billData = {
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_address: customer.address,
        discount: parseFloat(discount) || 0,
        items: items.map(item => ({
          product_name: item.product_name,
          description: item.description,
          quantity: parseFloat(item.quantity) || 1,
          unit_price: parseFloat(item.unit_price) || 0,
        })),
      };

      const result = await api.bills.create(billData);
      router.push(`/bills/${result.id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to create bill');
    } finally {
      setSaving(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Create Bill</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Fill in the details to create a new bill.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Customer Information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label mb-1 block">Name *</label>
              <input
                type="text"
                required
                className="input"
                placeholder="Customer name"
                value={customer.name}
                onChange={e => setCustomer({ ...customer, name: e.target.value })}
              />
            </div>
            <div>
              <label className="label mb-1 block">Phone</label>
              <input
                type="tel"
                className="input"
                placeholder="Phone number"
                value={customer.phone}
                onChange={e => setCustomer({ ...customer, phone: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label mb-1 block">Address</label>
              <input
                type="text"
                className="input"
                placeholder="Customer address"
                value={customer.address}
                onChange={e => setCustomer({ ...customer, address: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Items</h2>
            <button type="button" onClick={addItem} className="btn-secondary text-sm">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-lg border border-[var(--border)] bg-[var(--background)] p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--muted-foreground)]">
                      Item {index + 1}
                    </span>
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="btn-ghost text-xs text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="lg:col-span-2">
                      <label className="label mb-1 block text-xs">Product Name *</label>
                      <input
                        type="text"
                        required
                        className="input"
                        placeholder="Product name"
                        value={item.product_name}
                        onChange={e => updateItem(index, 'product_name', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label mb-1 block text-xs">Quantity *</label>
                      <input
                        type="number"
                        required
                        min="0.01"
                        step="0.01"
                        className="input"
                        value={item.quantity}
                        onChange={e => updateItem(index, 'quantity', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label mb-1 block text-xs">Unit Price *</label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        className="input"
                        placeholder="0.00"
                        value={item.unit_price}
                        onChange={e => updateItem(index, 'unit_price', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="label mb-1 block text-xs">Description</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="Optional description"
                        value={item.description}
                        onChange={e => updateItem(index, 'description', e.target.value)}
                      />
                    </div>
                    <div className="flex items-end">
                      <div className="w-full rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-2.5 text-sm">
                        <span className="text-[var(--muted-foreground)]">Total: </span>
                        <span className="font-medium">Rs {getItemTotal(item).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="card">
          <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Subtotal</span>
              <span className="font-medium">Rs {getSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--muted-foreground)]">Discount (%)</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  className="input w-24 text-right"
                  value={discount}
                  onChange={e => setDiscount(e.target.value)}
                />
                <span className="text-sm text-[var(--muted-foreground)]">%</span>
              </div>
            </div>
            {getDiscountAmount() > 0 && (
              <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                <span>Discount Amount</span>
                <span>- Rs {getDiscountAmount().toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-[var(--border)] pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Grand Total</span>
                <span className="text-primary-600">Rs {getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? (
              <>
                <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Bill
              </>
            )}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
}
