'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import LoadingSkeleton from '@/components/LoadingSkeleton';

interface BillItem {
  id: number;
  product_name: string;
  description: string;
  quantity: string;
  unit_price: string;
  total: string;
}

interface Bill {
  id: number;
  bill_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  bill_date: string;
  subtotal: string;
  discount: string;
  total: string;
  created_at: string;
  items: BillItem[];
}

export default function ViewBill() {
  const params = useParams();
  const router = useRouter();
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBill();
  }, [params.id]);

  async function loadBill() {
    try {
      const data = await api.bills.get(Number(params.id));
      setBill(data);
    } catch (err) {
      console.error('Failed to load bill:', err);
    } finally {
      setLoading(false);
    }
  }

  function handlePrint() {
    window.print();
  }

  if (loading) return <LoadingSkeleton rows={5} />;
  if (!bill) return <div className="card py-12 text-center">Bill not found.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="no-print mb-6 flex items-center justify-between">
        <button onClick={() => router.back()} className="btn-ghost">
          ← Back
        </button>
        <button onClick={handlePrint} className="btn-primary">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Bill
        </button>
      </div>

      <div className="card mx-auto max-w-2xl">
        <div className="mb-6 border-b border-[var(--border)] pb-6 text-center">
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Aradhana</h1>
          <p className="text-sm text-[var(--muted-foreground)]">307/2 Kajipara, Nayabasti, Barrackpore</p>
          <p className="text-sm text-[var(--muted-foreground)]">Phone: +91 9830000000</p>
          <p className="text-sm text-[var(--muted-foreground)]">GSTIN: 22AAAAA0000A1Z5</p>
        </div>

        <div className="mb-6 flex justify-between text-sm">
          <div>
            <p className="font-semibold">{bill.bill_number}</p>
            <p className="text-[var(--muted-foreground)]">Date: {new Date(bill.bill_date).toLocaleDateString('en-IN')}</p>
          </div>
          <div className="text-right">
            <p className="text-[var(--muted-foreground)]">Customer</p>
            <p className="font-medium">{bill.customer_name}</p>
            {bill.customer_phone && <p className="text-[var(--muted-foreground)]">{bill.customer_phone}</p>}
            {bill.customer_address && <p className="text-[var(--muted-foreground)]">{bill.customer_address}</p>}
          </div>
        </div>

        <table className="mb-6 w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="table-header">Item</th>
              <th className="table-header text-center">Qty</th>
              <th className="table-header text-right">Price</th>
              <th className="table-header text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map(item => (
              <tr key={item.id} className="border-b border-[var(--border)]">
                <td className="table-cell">
                  <p className="font-medium">{item.product_name}</p>
                  {item.description && (
                    <p className="text-xs text-[var(--muted-foreground)]">{item.description}</p>
                  )}
                </td>
                <td className="table-cell text-center">{item.quantity}</td>
                <td className="table-cell text-right">Rs {parseFloat(item.unit_price).toFixed(2)}</td>
                <td className="table-cell text-right font-medium">Rs {parseFloat(item.total).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="space-y-2 border-t border-[var(--border)] pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-[var(--muted-foreground)]">Subtotal</span>
            <span>Rs {parseFloat(bill.subtotal).toFixed(2)}</span>
          </div>
          {parseFloat(bill.discount) > 0 && (
            <>
              <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                <span>Discount ({parseFloat(bill.discount)}%)</span>
                <span>- Rs {(parseFloat(bill.subtotal) * parseFloat(bill.discount) / 100).toFixed(2)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between border-t border-[var(--border)] pt-2 text-lg font-bold">
            <span>Grand Total</span>
            <span className="text-primary-600">Rs {parseFloat(bill.total).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
