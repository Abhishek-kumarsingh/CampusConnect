"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, FileText, GraduationCap, MessageSquare, Users } from "lucide-react";
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Mock data for faculty dashboard
const upcomingClasses = [
  { id: 1, code: "CS 301", name: "Data Structures", time: "Today, 1:00 PM", room: "Tech 305", students: 42 },
  { id: 2, code: "CS 401", name: "Algorithms", time: "Today, 3:00 PM", room: "Tech 207", students: 35 },
  { id: 3, code: "CS 201", name: "Programming Fundamentals", time: "Tomorrow, 10:00 AM", room: "Tech 301", students: 55 }
];

const pendingAssignments = [
  { id: 1, title: "Midterm Project", course: "CS 301", dueDate: "May 15", submissions: 28, totalStudents: 42 },
  { id: 2, title: "Algorithm Analysis", course: "CS 401", dueDate: "May 18", submissions: 12, totalStudents: 35 }
];

const studentRequests = [
  { id: 1, student: "Alex Johnson", type: "Extension Request", course: "CS 301", date: "May 8" },
  { id: 2, student: "Jamie Smith", type: "Grade Inquiry", course: "CS 401", date: "May 7" },
  { id: 3, student: "Taylor Brown", type: "Meeting Request", course: "CS 201", date: "May 9" }
];

export function FacultyDashboard() {
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
          <h1 className="text-2xl font-bold tracking-tight">Faculty Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Dr. Miller! Here's your teaching overview.</p>
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            May 10, 2025
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" data-aos="fade-up">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Teaching this semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">132</div>
            <p className="text-xs text-muted-foreground">Total enrolled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Active this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Office Hours</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Tue/Thu</div>
            <p className="text-xs text-muted-foreground">2:00 - 4:00 PM</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4" data-aos="fade-up">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="grading">Grading</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upcoming Classes */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Today's Classes</CardTitle>
                <CardDescription>Your teaching schedule for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingClasses.map((course) => (
                  <div key={course.id} className="flex justify-between items-start pb-3 border-b last:border-0 border-slate-200 dark:border-slate-700">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{course.code}</Badge>
                        <h3 className="font-medium text-sm">{course.name}</h3>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span className="text-xs text-slate-500">{course.time}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">Room: {course.room}</div>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 text-slate-500 mr-1" />
                      <span className="text-xs text-slate-500">{course.students} students</span>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">View full schedule</Button>
              </CardFooter>
            </Card>
            
            {/* Pending Assignments */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Assignment Status</CardTitle>
                <CardDescription>Track student submissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingAssignments.map((assignment) => (
                  <div key={assignment.id} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-sm">{assignment.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium">{assignment.course}</span>
                          <span className="text-xs text-slate-500">Due {assignment.dueDate}</span>
                        </div>
                      </div>
                      <Badge>
                        {assignment.submissions}/{assignment.totalStudents} Submitted
                      </Badge>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                      <div 
                        className="bg-indigo-600 dark:bg-indigo-400 h-1.5 rounded-full" 
                        style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">Create new assignment</Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Student Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Student Requests</CardTitle>
              <CardDescription>Pending requests requiring your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentRequests.map((request) => (
                  <div key={request.id} className="flex justify-between items-start py-3 border-b last:border-0 border-slate-200 dark:border-slate-700">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        {request.student.split(' ').map(name => name[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{request.student}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{request.course}</Badge>
                          <span className="text-xs text-slate-500">{request.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary">{request.type}</Badge>
                      <Button variant="ghost" size="sm">Review</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="ml-auto">View all requests</Button>
            </CardFooter>
          </Card>
          
          {/* Forum Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Course Discussions</CardTitle>
              <CardDescription>Recent activity in your course forums</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-start py-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex gap-3">
                  <MessageSquare className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">Question about final project requirements</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">CS 301</Badge>
                      <span className="text-xs text-slate-500">Today at 11:30 AM</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">3 unread replies</Badge>
              </div>
              <div className="flex justify-between items-start py-3 border-b-0">
                <div className="flex gap-3">
                  <MessageSquare className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-sm">Algorithm complexity analysis help</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">CS 401</Badge>
                      <span className="text-xs text-slate-500">Yesterday at 4:15 PM</span>
                    </div>
                  </div>
                </div>
                <Badge variant="secondary">5 unread replies</Badge>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="ml-auto">View all discussions</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Manage your course materials and student rosters</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This tab would contain a comprehensive list of all courses you're teaching.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>View student profiles and academic progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This tab would show student information, attendance, and performance metrics.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="grading">
          <Card>
            <CardHeader>
              <CardTitle>Grading Center</CardTitle>
              <CardDescription>Review and grade student submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This tab would provide tools for reviewing and grading assignments.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}