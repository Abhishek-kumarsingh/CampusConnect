"use client"

import { useState } from 'react';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardHeader } from './dashboard-header';
import { StudentDashboard } from './student-dashboard';
import { FacultyDashboard } from './faculty-dashboard';
import { AdminDashboard } from './admin-dashboard';

export type UserRole = 'student' | 'faculty' | 'admin';

interface DashboardShellProps {
  userRole: UserRole;
}

export function DashboardShell({ userRole }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderDashboard = () => {
    switch (userRole) {
      case 'student':
        return <StudentDashboard />;
      case 'faculty':
        return <FacultyDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <StudentDashboard />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <DashboardSidebar
        userRole={userRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={toggleSidebar} userRole={userRole} />
        
        <main className="flex-1 overflow-y-auto pb-10">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {renderDashboard()}
          </div>
        </main>
      </div>
    </div>
  );
}