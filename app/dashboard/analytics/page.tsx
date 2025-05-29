"use client"

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Award,
  Clock,
  Target,
  Activity
} from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuth();

  // Mock analytics data - in real app, fetch from API
  const overviewStats = [
    {
      title: "Total Students",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Courses",
      value: "24",
      change: "+3",
      trend: "up",
      icon: BookOpen,
      color: "text-green-600"
    },
    {
      title: "Avg. Attendance",
      value: "87.5%",
      change: "-2.1%",
      trend: "down",
      icon: Calendar,
      color: "text-orange-600"
    },
    {
      title: "Assignment Completion",
      value: "92.3%",
      change: "+5.2%",
      trend: "up",
      icon: Award,
      color: "text-purple-600"
    }
  ];

  const coursePerformance = [
    {
      course: "Data Structures (CS301)",
      students: 45,
      avgGrade: 85.2,
      attendance: 89.5,
      assignments: 94.2,
      trend: "up"
    },
    {
      course: "Web Development (CS205)",
      students: 38,
      avgGrade: 88.7,
      attendance: 92.1,
      assignments: 96.8,
      trend: "up"
    },
    {
      course: "Database Systems (CS401)",
      students: 32,
      avgGrade: 82.4,
      attendance: 85.3,
      assignments: 89.7,
      trend: "down"
    },
    {
      course: "Software Engineering (CS402)",
      students: 28,
      avgGrade: 86.9,
      attendance: 88.7,
      assignments: 92.1,
      trend: "up"
    }
  ];

  const recentActivity = [
    {
      type: "assignment",
      title: "New assignment submitted",
      course: "CS301",
      time: "2 hours ago",
      count: 12
    },
    {
      type: "grade",
      title: "Grades updated",
      course: "CS205",
      time: "4 hours ago",
      count: 25
    },
    {
      type: "attendance",
      title: "Attendance recorded",
      course: "CS401",
      time: "1 day ago",
      count: 30
    },
    {
      type: "discussion",
      title: "Forum posts",
      course: "CS402",
      time: "2 days ago",
      count: 8
    }
  ];

  if (user?.role === 'student') {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Analytics Not Available
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Analytics features are only available for faculty and administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          {user?.role === 'faculty' 
            ? 'Monitor your course performance and student engagement'
            : 'Comprehensive analytics across all courses and departments'
          }
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Course Performance</TabsTrigger>
          <TabsTrigger value="students">Student Analytics</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Course Performance Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Course Performance Overview</CardTitle>
                <CardDescription>Average grades and attendance across courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coursePerformance.map((course) => (
                    <div key={course.course} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{course.course}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">{course.avgGrade}%</span>
                          {course.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${course.avgGrade}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates across your courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                        <Activity className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>{activity.course}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                      <Badge variant="secondary">{activity.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Performance Details</CardTitle>
              <CardDescription>Detailed metrics for each course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {coursePerformance.map((course) => (
                  <Card key={course.course}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{course.course}</CardTitle>
                        <Badge variant="outline">{course.students} students</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-blue-600">{course.avgGrade}%</p>
                          <p className="text-sm text-slate-600">Average Grade</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">{course.attendance}%</p>
                          <p className="text-sm text-slate-600">Attendance Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-purple-600">{course.assignments}%</p>
                          <p className="text-sm text-slate-600">Assignment Completion</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students">
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Student analytics will be displayed here</p>
          </div>
        </TabsContent>

        <TabsContent value="engagement">
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Engagement metrics will be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
