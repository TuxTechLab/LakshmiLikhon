'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth';
import { ThemeProvider } from '@/lib/theme';
import { Toaster } from '@/components/Toast';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen">
          {children}
        </div>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
