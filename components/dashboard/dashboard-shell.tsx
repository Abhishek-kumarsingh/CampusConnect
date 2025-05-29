"use client"

import { useState, useEffect } from 'react';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardHeader } from './dashboard-header';
import { StudentDashboard } from './student-dashboard';
import { FacultyDashboard } from './faculty-dashboard';
import { AdminDashboard } from './admin-dashboard';
import { cn } from '@/lib/utils';

export type UserRole = 'student' | 'faculty' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  studentId?: string;
  facultyId?: string;
  isDemo?: boolean;
}

interface DashboardShellProps {
  userRole: UserRole;
  user?: User;
  children?: React.ReactNode;
}

export function DashboardShell({ userRole, user, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  // Load sidebar collapse state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      setSidebarCollapsed(JSON.parse(saved));
    }
  }, []);

  // Save sidebar collapse state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const renderDashboard = () => {
    // If children are provided, render them instead of default dashboards
    if (children) {
      return children;
    }

    // Default dashboard rendering for the main dashboard page
    switch (userRole) {
      case 'student':
        return <StudentDashboard user={user} />;
      case 'faculty':
        return <FacultyDashboard user={user} />;
      case 'admin':
        return <AdminDashboard user={user} />;
      default:
        return <StudentDashboard user={user} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <DashboardSidebar
        userRole={userRole}
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      <div className={cn(
        "flex-1 flex flex-col overflow-hidden transition-all duration-300",
        "lg:ml-64", // Default margin for expanded sidebar
        sidebarCollapsed && "lg:ml-16" // Reduced margin for collapsed sidebar
      )}>
        <DashboardHeader
          onMenuClick={toggleSidebar}
          userRole={userRole}
          user={user}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="flex-1 overflow-y-auto pb-10">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {renderDashboard()}
          </div>
        </main>
      </div>
    </div>
  );
}