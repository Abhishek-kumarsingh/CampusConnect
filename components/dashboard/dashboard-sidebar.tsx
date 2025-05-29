"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { UserRole } from './dashboard-shell';
import { LayoutDashboard, CalendarDays, MessageSquare, Users, PenTool, FileText, BookOpen, BarChart3, Settings, HelpCircle, DivideIcon as LucideIcon } from 'lucide-react';

interface SidebarNavProps {
  items: {
    href: string;
    title: string;
    icon: LucideIcon;
    forRoles: UserRole[];
  }[];
  userRole: UserRole;
}

function SidebarNav({ items, userRole }: SidebarNavProps) {
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
                "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-600 dark:text-slate-300 transition-all hover:text-slate-900 dark:hover:text-slate-50",
                pathname === item.href && "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-medium"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
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
}

export function DashboardSidebar({ userRole, isOpen, onClose }: DashboardSidebarProps) {
  const navigationItems = [
    {
      href: "/dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      forRoles: ['student', 'faculty', 'admin']
    },
    {
      href: "/dashboard/events",
      title: "Events",
      icon: CalendarDays,
      forRoles: ['student', 'faculty', 'admin']
    },
    {
      href: "/dashboard/forum",
      title: "Discussion Forum",
      icon: MessageSquare,
      forRoles: ['student', 'faculty', 'admin']
    },
    {
      href: "/dashboard/groups",
      title: "Groups",
      icon: Users,
      forRoles: ['student', 'faculty', 'admin']
    },
    {
      href: "/dashboard/assignments",
      title: "Assignments",
      icon: PenTool,
      forRoles: ['student', 'faculty']
    },
    {
      href: "/dashboard/courses",
      title: "Courses",
      icon: BookOpen,
      forRoles: ['student', 'faculty', 'admin']
    },
    {
      href: "/dashboard/resources",
      title: "Resources",
      icon: FileText,
      forRoles: ['student', 'faculty', 'admin']
    },
    {
      href: "/dashboard/analytics",
      title: "Analytics",
      icon: BarChart3,
      forRoles: ['faculty', 'admin']
    },
    {
      href: "/dashboard/settings",
      title: "Settings",
      icon: Settings,
      forRoles: ['student', 'faculty', 'admin']
    },
    {
      href: "/dashboard/help",
      title: "Help & Support",
      icon: HelpCircle,
      forRoles: ['student', 'faculty', 'admin']
    },
  ];

  // Sidebar for mobile (Sheet component)
  const mobileSidebar = (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="p-0 w-72">
        <div className="space-y-4 py-4">
          <div className="px-4 py-2 flex items-center">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Campus</span>
            <span className="text-xl font-bold text-slate-800 dark:text-white">Connect</span>
          </div>
          <div className="px-3">
            <h2 className="mb-2 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              MAIN NAVIGATION
            </h2>
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <SidebarNav items={navigationItems} userRole={userRole} />
            </ScrollArea>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop sidebar
  const desktopSidebar = (
    <div className="hidden lg:flex h-screen w-64 flex-col fixed inset-y-0 z-50">
      <div className="flex flex-col h-full border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="h-16 flex items-center border-b border-slate-200 dark:border-slate-700 px-6">
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Campus</span>
          <span className="text-xl font-bold text-slate-800 dark:text-white">Connect</span>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto pt-5 pb-4">
          <div className="flex-1 flex flex-col px-3 gap-6">
            <div>
              <h2 className="mb-2 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                MAIN NAVIGATION
              </h2>
              <SidebarNav items={navigationItems} userRole={userRole} />
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 p-4">
          <Button variant="outline" className="w-full justify-start">
            <span className="text-sm">Log out</span>
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