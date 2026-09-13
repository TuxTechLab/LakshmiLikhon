'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import BillCard from '@/components/BillCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';

interface Bill {
  id: number;
  bill_number: string;
  customer_name: string;
  total: string;
  bill_date: string;
  created_at: string;
}

export default function BillHistory() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    loadBills();
  }, []);

  async function loadBills() {
    setLoading(true);
    try {
      const data = await api.bills.list();
      setBills(data);
    } catch (err) {
      console.error('Failed to load bills:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) {
      loadBills();
      return;
    }
    setSearching(true);
    try {
      const data = await api.bills.search(search);
      setBills(data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Bill History</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Search and view all your bills.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Search by bill number, customer name, or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input flex-1"
        />
        <button type="submit" className="btn-primary" disabled={searching}>
          {searching ? (
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
          Search
        </button>
      </form>

      {loading || searching ? (
        <LoadingSkeleton rows={5} />
      ) : bills.length === 0 ? (
        <div className="card py-12 text-center text-[var(--muted-foreground)]">
          <p>{search ? 'No bills found matching your search.' : 'No bills yet.'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bills.map((bill, i) => (
            <motion.div
              key={bill.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <BillCard bill={bill} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
