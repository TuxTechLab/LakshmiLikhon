'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import BillCard from '@/components/BillCard';
import StatsCard from '@/components/StatsCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';

interface Bill {
  id: number;
  bill_number: string;
  customer_name: string;
  total: string;
  bill_date: string;
  created_at: string;
}

export default function Dashboard() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, count: 0, latest: '' });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await api.bills.list({ limit: 5 });
      setBills(data);
      if (data.length > 0) {
        setStats({
          total: data.reduce((sum: number, b: Bill) => sum + parseFloat(b.total), 0),
          count: data.length,
          latest: data[0]?.bill_number || '',
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Dashboard</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Welcome back. Here&apos;s your billing overview.</p>
        </div>
        <Link href="/bills/new" className="btn-primary">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Bill
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Bills"
          value={loading ? '...' : String(stats.count)}
          icon="receipt"
        />
        <StatsCard
          title="Revenue"
          value={loading ? '...' : `Rs ${stats.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
          icon="currency"
        />
        <StatsCard
          title="Latest Bill"
          value={loading ? '...' : stats.latest || 'N/A'}
          icon="document"
        />
      </div>

      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent Bills</h2>
          <Link href="/bills" className="btn-ghost text-sm">
            View All →
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton rows={3} />
        ) : bills.length === 0 ? (
          <div className="py-12 text-center text-[var(--muted-foreground)]">
            <svg className="mx-auto h-12 w-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-2">No bills yet. Create your first bill!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bills.map((bill, i) => (
              <motion.div
                key={bill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <BillCard bill={bill} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
