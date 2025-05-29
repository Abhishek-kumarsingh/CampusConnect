"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, Clock, FileText, MessageSquare, Pencil, Users } from "lucide-react";
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Mock data for dashboard
const upcomingEvents = [
  { id: 1, title: "Computer Science Society Meeting", date: "Today, 3:00 PM", location: "Tech Hall 201", type: "club" },
  { id: 2, title: "Career Fair: Tech Companies", date: "Tomorrow, 10:00 AM", location: "Student Center", type: "career" },
  { id: 3, title: "AI Workshop", date: "May 15, 2:00 PM", location: "Engineering Building", type: "workshop" }
];

const assignments = [
  { id: 1, title: "Data Structures Project", course: "CS 301", dueDate: "May 12", status: "in-progress", progress: 65 },
  { id: 2, title: "Physics Lab Report", course: "PHYS 201", dueDate: "May 14", status: "not-started", progress: 0 },
  { id: 3, title: "Literature Review", course: "ENG 202", dueDate: "May 18", status: "in-progress", progress: 30 }
];

const courses = [
  { id: 1, code: "CS 301", name: "Data Structures", instructor: "Dr. Miller", nextClass: "Today, 1:00 PM", room: "Tech 305" },
  { id: 2, code: "PHYS 201", name: "Physics II", instructor: "Dr. Johnson", nextClass: "Tomorrow, 11:00 AM", room: "Science 201" },
  { id: 3, code: "ENG 202", name: "English Literature", instructor: "Prof. Williams", nextClass: "Wednesday, 2:00 PM", room: "Arts 102" }
];

const discussionUpdates = [
  { id: 1, title: "Help with Java inheritance concept", course: "CS 301", replies: 4, lastUpdate: "2 hours ago" },
  { id: 2, title: "Study group for Physics midterm", course: "PHYS 201", replies: 7, lastUpdate: "Yesterday" }
];

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  studentId?: string;
  facultyId?: string;
  isDemo?: boolean;
}

interface StudentDashboardProps {
  user?: User;
}

export function StudentDashboard({ user }: StudentDashboardProps) {
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
          <h1 className="text-2xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name || 'Student'}! Here's what's happening.</p>
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
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Enrolled this semester</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <Pencil className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Coming up today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Active memberships</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4" data-aos="fade-up">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="forums">Forums</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upcoming Events */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Events happening in the next few days</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex justify-between items-start pb-3 border-b last:border-0 border-slate-200 dark:border-slate-700">
                    <div>
                      <h3 className="font-medium text-sm">{event.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span className="text-xs text-slate-500">{event.date}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{event.location}</div>
                    </div>
                    <Badge variant={event.type === 'club' ? 'default' : event.type === 'career' ? 'secondary' : 'outline'}>
                      {event.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">View all events</Button>
              </CardFooter>
            </Card>

            {/* Assignments Summary */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Assignment Progress</CardTitle>
                <CardDescription>Track your current assignments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignments.map((assignment) => (
                  <div key={assignment.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-sm">{assignment.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-medium">{assignment.course}</span>
                          <span className="text-xs text-slate-500">Due {assignment.dueDate}</span>
                        </div>
                      </div>
                      <Badge variant={assignment.status === 'in-progress' ? 'outline' : 'secondary'}>
                        {assignment.status === 'in-progress' ? 'In Progress' : 'Not Started'}
                      </Badge>
                    </div>
                    <Progress value={assignment.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto">View all assignments</Button>
              </CardFooter>
            </Card>
          </div>

          {/* Courses Row */}
          <Card>
            <CardHeader>
              <CardTitle>Current Courses</CardTitle>
              <CardDescription>Your enrolled courses this semester</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <Card key={course.id} className="bg-slate-50 dark:bg-slate-800/50 border">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{course.code}</Badge>
                      </div>
                      <CardTitle className="text-base mt-2">{course.name}</CardTitle>
                      <CardDescription className="text-xs">{course.instructor}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-xs pb-2">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>Next class: {course.nextClass}</span>
                      </div>
                      <div className="mt-1 text-slate-500">Room: {course.room}</div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="ghost" size="sm" className="text-xs">View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Forum Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Forum Activity</CardTitle>
              <CardDescription>Stay updated on your discussion threads</CardDescription>
            </CardHeader>
            <CardContent>
              {discussionUpdates.map((discussion) => (
                <div key={discussion.id} className="flex justify-between items-start py-3 border-b last:border-0 border-slate-200 dark:border-slate-700">
                  <div className="flex gap-3">
                    <MessageSquare className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm">{discussion.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{discussion.course}</Badge>
                        <span className="text-xs text-slate-500">{discussion.lastUpdate}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">{discussion.replies} replies</Badge>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="ml-auto">View all discussions</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>All Assignments</CardTitle>
              <CardDescription>Manage your coursework and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This tab would contain a comprehensive list of all assignments with filtering options.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Class Schedule</CardTitle>
              <CardDescription>Your weekly academic calendar</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This tab would contain a calendar view of your course schedule.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forums">
          <Card>
            <CardHeader>
              <CardTitle>Discussion Forums</CardTitle>
              <CardDescription>Engage with your academic community</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This tab would show forums and threads you're participating in.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}