"use client"

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, Clock, Calendar } from 'lucide-react';

export default function CoursesPage() {
  const { user } = useAuth();

  // Mock courses data - in real app, fetch from API
  const courses = [
    {
      id: 1,
      name: "Data Structures and Algorithms",
      code: "CS301",
      instructor: "Dr. Jane Faculty",
      semester: "Spring 2024",
      credits: 3,
      enrolled: 45,
      maxStudents: 50,
      schedule: "MWF 10:00-11:00 AM",
      room: "CS Building 201",
      description: "Fundamental data structures and algorithms for efficient programming.",
      status: user?.role === 'student' ? 'enrolled' : 'teaching'
    },
    {
      id: 2,
      name: "Web Development",
      code: "CS205",
      instructor: "Prof. John Smith",
      semester: "Spring 2024",
      credits: 4,
      enrolled: 38,
      maxStudents: 40,
      schedule: "TTh 2:00-4:00 PM",
      room: "CS Building 301",
      description: "Modern web development using React, Node.js, and databases.",
      status: user?.role === 'student' ? 'enrolled' : 'available'
    },
    {
      id: 3,
      name: "Database Systems",
      code: "CS401",
      instructor: "Dr. Sarah Wilson",
      semester: "Spring 2024",
      credits: 3,
      enrolled: 32,
      maxStudents: 35,
      schedule: "MWF 1:00-2:00 PM",
      room: "CS Building 105",
      description: "Database design, SQL, and database management systems.",
      status: user?.role === 'student' ? 'available' : 'teaching'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enrolled':
      case 'teaching':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'available':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Courses</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          {user?.role === 'student' 
            ? 'View your enrolled courses and explore available options'
            : user?.role === 'faculty'
            ? 'Manage your teaching assignments and course materials'
            : 'Oversee all courses and academic programs'
          }
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                  <CardDescription className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    {course.code}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(course.status)}>
                  {course.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {course.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-500" />
                  <span>Instructor: {course.instructor}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>{course.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span>{course.credits} Credits • {course.room}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-slate-500" />
                  <span>{course.enrolled}/{course.maxStudents} Students</span>
                </div>
              </div>

              <div className="pt-2">
                <Button className="w-full" variant="outline">
                  {user?.role === 'student' 
                    ? course.status === 'enrolled' ? 'View Course' : 'Enroll'
                    : user?.role === 'faculty'
                    ? course.status === 'teaching' ? 'Manage Course' : 'View Details'
                    : 'Manage Course'
                  }
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {user?.role === 'faculty' && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your courses and academic responsibilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button>Create New Course</Button>
              <Button variant="outline">Import Roster</Button>
              <Button variant="outline">Grade Assignments</Button>
              <Button variant="outline">Course Analytics</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
