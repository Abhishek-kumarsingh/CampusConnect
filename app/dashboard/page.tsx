import { Metadata } from 'next';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export const metadata: Metadata = {
  title: 'Dashboard - CampusConnect',
  description: 'Your campus dashboard and activity center',
};

export default function DashboardPage() {
  // For demo purposes, we're simulating a student dashboard
  // In a real app, you'd fetch the user role from authentication
  return (
    <DashboardShell userRole="student" />
  );
}