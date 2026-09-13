'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface Bill {
  id: number;
  bill_number: string;
  customer_name: string;
  total: string;
  bill_date: string;
}

export default function BillCard({ bill }: { bill: Bill }) {
  return (
    <Link href={`/bills/${bill.id}`}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
            <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-[var(--foreground)]">{bill.bill_number}</p>
            <p className="text-sm text-[var(--muted-foreground)]">{bill.customer_name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-[var(--foreground)]">Rs {parseFloat(bill.total).toFixed(2)}</p>
          <p className="text-xs text-[var(--muted-foreground)]">
            {new Date(bill.bill_date).toLocaleDateString('en-IN')}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
