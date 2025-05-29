"use client"

import { useState } from 'react';
import { DashboardSidebar } from './dashboard-sidebar';
import { DashboardHeader } from './dashboard-header';
import { StudentDashboard } from './student-dashboard';
import { FacultyDashboard } from './faculty-dashboard';
import { AdminDashboard } from './admin-dashboard';

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
}

export function DashboardShell({ userRole, user }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderDashboard = () => {
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
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMenuClick={toggleSidebar} userRole={userRole} user={user} />

        <main className="flex-1 overflow-y-auto pb-10">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {renderDashboard()}
          </div>
        </main>
      </div>
    </div>
  );
}