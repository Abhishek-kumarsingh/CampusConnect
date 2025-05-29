"use client"

import { useState } from 'react';
import { Bell, Menu, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRole } from './dashboard-shell';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  userRole: UserRole;
}

export function DashboardHeader({ onMenuClick, userRole }: DashboardHeaderProps) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  // Mock user data - would come from auth context in a real app
  const userData = {
    name: userRole === 'student' ? 'Alex Johnson' : 
          userRole === 'faculty' ? 'Dr. Sarah Miller' : 'Admin User',
    email: `${userRole}@example.com`,
    avatar: userRole === 'student' ? 
            'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150' : 
            userRole === 'faculty' ? 
            'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150' :
            'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
  };

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center lg:w-64">
          <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
          <div className="hidden lg:flex items-center ml-2">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Campus</span>
            <span className="text-xl font-bold text-slate-800 dark:text-white">Connect</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className={`flex-1 ${isSearchActive ? 'block' : 'hidden md:block'} max-w-md mx-4`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 w-full"
            />
            {isSearchActive && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 md:hidden" 
                onClick={() => setIsSearchActive(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {!isSearchActive && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={() => setIsSearchActive(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <ModeToggle />

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userData.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                {userRole === 'admin' && <DropdownMenuItem>Admin Panel</DropdownMenuItem>}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}