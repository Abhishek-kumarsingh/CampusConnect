"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Check, Clock, Flag, ShieldAlert, Users, AlertTriangle, LineChart 
} from "lucide-react";
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock data for admin dashboard
const userStats = [
  { id: 1, label: "Total Users", value: "15,234", icon: Users, change: "+12%" },
  { id: 2, label: "Active Today", value: "1,876", icon: Check, change: "+5%" },
  { id: 3, label: "New Accounts", value: "267", icon: Users, change: "+18%" },
  { id: 4, label: "Issues Reported", value: "12", icon: Flag, change: "-3%" },
];

const activityData = [
  { name: 'Mon', Students: 2400, Faculty: 400 },
  { name: 'Tue', Students: 1398, Faculty: 300 },
  { name: 'Wed', Students: 9800, Faculty: 500 },
  { name: 'Thu', Students: 3908, Faculty: 400 },
  { name: 'Fri', Students: 4800, Faculty: 380 },
  { name: 'Sat', Students: 3800, Faculty: 300 },
  { name: 'Sun', Students: 4300, Faculty: 200 },
];

const moduleUsageData = [
  { name: 'Dashboard', usage: 95 },
  { name: 'Events', usage: 85 },
  { name: 'Forum', usage: 78 },
  { name: 'Groups', usage: 65 },
  { name: 'Resources', usage: 60 },
  { name: 'Chat', usage: 45 },
];

const pendingApprovals = [
  { id: 1, title: "Student Government Debate", type: "Event", requester: "Student Council", date: "May 15" },
  { id: 2, title: "Engineering Club", type: "New Group", requester: "James Wilson", date: "May 12" },
  { id: 3, title: "Career Workshop", type: "Event", requester: "Career Center", date: "May 20" },
];

export function AdminDashboard() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Campus system overview and management</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            May 10, 2025
          </Button>
          <Button variant="destructive" size="sm">
            <ShieldAlert className="mr-2 h-4 w-4" />
            System Alerts (2)
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-aos="fade-up">
        {userStats.map((stat) => (
          <Card key={stat.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs flex items-center ${stat.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {stat.change.startsWith('+') ? <span className="mr-1">↑</span> : <span className="mr-1">↓</span>}
                {stat.change} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Activity Chart */}
            <Card className="col-span-1" data-aos="fade-right">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Activity</CardTitle>
                    <CardDescription>Daily active users over time</CardDescription>
                  </div>
                  <LineChart className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={activityData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorFaculty" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                    <XAxis dataKey="name" className="text-xs text-slate-600 dark:text-slate-400" />
                    <YAxis className="text-xs text-slate-600 dark:text-slate-400" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--popover-foreground))'
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="Students" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorStudents)" />
                    <Area type="monotone" dataKey="Faculty" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorFaculty)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Module Usage Chart */}
            <Card className="col-span-1" data-aos="fade-left">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Feature Usage</CardTitle>
                    <CardDescription>Most popular platform features</CardDescription>
                  </div>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={moduleUsageData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barSize={40}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" vertical={false} />
                    <XAxis dataKey="name" className="text-xs text-slate-600 dark:text-slate-400" />
                    <YAxis className="text-xs text-slate-600 dark:text-slate-400" />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--popover))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--popover-foreground))'
                      }}
                      formatter={(value) => [`${value}%`, 'Usage']}
                    />
                    <Bar dataKey="usage" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Pending Approvals Card */}
          <Card data-aos="fade-up">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Pending Approvals</CardTitle>
                  <CardDescription>Items requiring admin review</CardDescription>
                </div>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingApprovals.map((item) => (
                  <div key={item.id} className="flex justify-between items-start py-3 border-b last:border-0 border-slate-200 dark:border-slate-700">
                    <div>
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{item.type}</Badge>
                        <span className="text-xs text-slate-500">Requested by: {item.requester}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Date: {item.date}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Reject</Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="ml-auto">View all pending items</Button>
            </CardFooter>
          </Card>
          
          {/* System Status */}
          <Card data-aos="fade-up">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Platform health and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Server Status</div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">Online</Badge>
                  </div>
                  <div className="text-xs text-slate-500">Last restarted: 14 days ago</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Database</div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">Healthy</Badge>
                  </div>
                  <div className="text-xs text-slate-500">1.2TB used (48%)</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium">Cache</div>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Warning</Badge>
                  </div>
                  <div className="text-xs text-slate-500">Purge recommended</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">System Logs</Button>
              <Button variant="outline" size="sm" className="ml-2">Maintenance</Button>
              <Button variant="ghost" size="sm" className="ml-auto">Full Report</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This tab would contain user management tools for administrators.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="approvals">
          <Card>
            <CardHeader>
              <CardTitle>Approval Queue</CardTitle>
              <CardDescription>Review and approve pending requests</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This tab would contain a comprehensive list of all items pending approval.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure platform behavior and appearance</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This tab would contain system-wide configuration options.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}