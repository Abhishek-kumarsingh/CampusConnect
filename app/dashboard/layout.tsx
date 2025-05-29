'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Don't wrap the main dashboard page since it has its own DashboardShell
  const isMainDashboard = pathname === '/dashboard';

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="flex">
          <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
            <div className="p-6">
              <Skeleton className="h-8 w-32 mb-4" />
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 p-6">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // For the main dashboard page, render children directly (it has its own DashboardShell)
  if (isMainDashboard) {
    return <>{children}</>;
  }

  // For all other dashboard pages, wrap in DashboardShell
  return (
    <DashboardShell userRole={user.role} user={user}>
      {children}
    </DashboardShell>
  );
}
