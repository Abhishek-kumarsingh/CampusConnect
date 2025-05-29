"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { UserRole } from './dashboard-shell';
import { useAuth } from '@/lib/auth-context';
import {
  LayoutDashboard,
  CalendarDays,
  MessageSquare,
  Users,
  PenTool,
  FileText,
  BookOpen,
  BarChart3,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Bell,
  LogOut,
  type LucideIcon
} from 'lucide-react';

interface SidebarNavProps {
  items: {
    href: string;
    title: string;
    icon: LucideIcon;
    forRoles: UserRole[];
    badge?: number;
  }[];
  userRole: UserRole;
  isCollapsed: boolean;
}

function SidebarNav({ items, userRole, isCollapsed }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="grid items-start gap-2 text-sm">
      {items
        .filter(item => item.forRoles.includes(userRole))
        .map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300 transition-all hover:text-slate-900 dark:hover:text-slate-50 relative group",
                pathname === item.href && "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-medium",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="truncate">{item.title}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </>
              )}
              {isCollapsed && item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                  {item.title}
                </div>
              )}
            </Link>
          );
        })}
    </nav>
  );
}

interface DashboardSidebarProps {
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  user?: any;
}

export function DashboardSidebar({ userRole, isOpen, onClose, isCollapsed, onToggleCollapse, user }: DashboardSidebarProps) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };
  // Mock notification counts - in real app, fetch from API
  const getNotificationCount = (route: string) => {
    const mockCounts: Record<string, number> = {
      '/dashboard/assignments': userRole === 'student' ? 3 : userRole === 'faculty' ? 5 : 0,
      '/dashboard/notifications': userRole === 'student' ? 7 : userRole === 'faculty' ? 4 : userRole === 'admin' ? 12 : 0,
      '/dashboard/forum': 2,
      '/dashboard/events': 1,
    };
    return mockCounts[route] || 0;
  };

  const navigationItems = [
    {
      href: "/dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      forRoles: ['student', 'faculty', 'admin'] as UserRole[]
    },
    {
      href: "/dashboard/assignments",
      title: "Assignments",
      icon: PenTool,
      forRoles: ['student', 'faculty'] as UserRole[],
      badge: getNotificationCount('/dashboard/assignments')
    },
    {
      href: "/dashboard/events",
      title: "Events",
      icon: CalendarDays,
      forRoles: ['student', 'faculty', 'admin'] as UserRole[],
      badge: getNotificationCount('/dashboard/events')
    },
    {
      href: "/dashboard/courses",
      title: "Courses",
      icon: BookOpen,
      forRoles: ['student', 'faculty', 'admin'] as UserRole[]
    },
    {
      href: "/dashboard/forum",
      title: "Discussion Forum",
      icon: MessageSquare,
      forRoles: ['student', 'faculty', 'admin'] as UserRole[],
      badge: getNotificationCount('/dashboard/forum')
    },
    {
      href: "/dashboard/notifications",
      title: "Notifications",
      icon: Bell,
      forRoles: ['student', 'faculty', 'admin'] as UserRole[],
      badge: getNotificationCount('/dashboard/notifications')
    },
    {
      href: "/dashboard/groups",
      title: "Groups",
      icon: Users,
      forRoles: ['student', 'faculty', 'admin'] as UserRole[]
    },
    {
      href: "/dashboard/resources",
      title: "Resources",
      icon: FileText,
      forRoles: ['student', 'faculty', 'admin'] as UserRole[]
    },
    {
      href: "/dashboard/analytics",
      title: "Analytics",
      icon: BarChart3,
      forRoles: ['faculty', 'admin'] as UserRole[]
    },
    {
      href: "/dashboard/settings",
      title: "Settings",
      icon: Settings,
      forRoles: ['student', 'faculty', 'admin'] as UserRole[]
    },
    {
      href: "/dashboard/help",
      title: "Help & Support",
      icon: HelpCircle,
      forRoles: ['student', 'faculty', 'admin'] as UserRole[]
    },
  ];

  // Sidebar for mobile (Sheet component)
  const mobileSidebar = (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 w-72">
        <div className="flex flex-col h-full">
          <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Campus</span>
                <span className="text-xl font-bold text-slate-800 dark:text-white">Connect</span>
              </div>
            </div>
            {user && (
              <div className="mt-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 px-3 py-4">
            <h2 className="mb-2 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              MAIN NAVIGATION
            </h2>
            <ScrollArea className="h-[calc(100vh-12rem)]">
              <SidebarNav items={navigationItems} userRole={userRole} isCollapsed={false} />
            </ScrollArea>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 p-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="text-sm">Log out</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop sidebar
  const desktopSidebar = (
    <div className={cn(
      "hidden lg:flex h-screen flex-col fixed inset-y-0 z-50 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        {/* Header */}
        <div className="h-16 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-4">
          {!isCollapsed && (
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Campus</span>
              <span className="text-xl font-bold text-slate-800 dark:text-white">Connect</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* User Info */}
        {user && (
          <div className={cn(
            "border-b border-slate-200 dark:border-slate-700 p-4",
            isCollapsed && "px-2"
          )}>
            <div className={cn(
              "flex items-center gap-3",
              isCollapsed && "justify-center"
            )}>
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {user.role}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-1 flex flex-col overflow-y-auto pt-4 pb-4">
          <div className={cn("flex-1 flex flex-col gap-6", isCollapsed ? "px-2" : "px-3")}>
            <div>
              {!isCollapsed && (
                <h2 className="mb-2 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  MAIN NAVIGATION
                </h2>
              )}
              <SidebarNav items={navigationItems} userRole={userRole} isCollapsed={isCollapsed} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-slate-700 p-4">
          <Button
            variant="outline"
            className={cn(
              "w-full",
              isCollapsed ? "justify-center px-0" : "justify-start"
            )}
            onClick={handleLogout}
            title={isCollapsed ? "Log out" : undefined}
          >
            <LogOut className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
            {!isCollapsed && <span className="text-sm">Log out</span>}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {mobileSidebar}
      {desktopSidebar}
    </>
  );
}