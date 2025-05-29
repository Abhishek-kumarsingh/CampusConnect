"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Users, Clock, Calendar, Plus, GraduationCap } from 'lucide-react';

interface Course {
  _id: string;
  title: string;
  code: string;
  description: string;
  instructor: {
    _id: string;
    name: string;
    email: string;
    department?: string;
  };
  department: string;
  credits: number;
  semester: string;
  year: number;
  schedule: {
    days: string[];
    time: string;
    location: string;
  };
  enrolledStudents: any[];
  maxStudents?: number;
  prerequisites?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CoursesPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    code: '',
    description: '',
    department: '',
    credits: 3,
    semester: 'Spring',
    year: new Date().getFullYear(),
    schedule: {
      days: [],
      time: '',
      location: ''
    },
    maxStudents: 50,
    prerequisites: ''
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/courses', {
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setCourses(data.courses);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch courses",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while fetching courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!newCourse.title.trim() || !newCourse.code.trim() || !newCourse.description.trim()) {
      toast({
        title: "Error",
        description: "Title, code, and description are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const courseData = {
        ...newCourse,
        prerequisites: newCourse.prerequisites.split(',').map(p => p.trim()).filter(p => p)
      };

      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(courseData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        });
        setIsCreateDialogOpen(false);
        setNewCourse({
          title: '',
          code: '',
          description: '',
          department: '',
          credits: 3,
          semester: 'Spring',
          year: new Date().getFullYear(),
          schedule: { days: [], time: '', location: '' },
          maxStudents: 50,
          prerequisites: ''
        });
        fetchCourses();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create course",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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
        {(['faculty', 'admin'].includes(user?.role || '')) && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Course
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogDescription>
                  Add a new course to the curriculum.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Course Title</label>
                    <Input
                      placeholder="e.g., Data Structures and Algorithms"
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Course Code</label>
                    <Input
                      placeholder="e.g., CS301"
                      value={newCourse.code}
                      onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Course description..."
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Department</label>
                    <Input
                      placeholder="e.g., Computer Science"
                      value={newCourse.department}
                      onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Credits</label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={newCourse.credits}
                      onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) || 3 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium">Semester</label>
                    <Select value={newCourse.semester} onValueChange={(value) => setNewCourse({ ...newCourse, semester: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fall">Fall</SelectItem>
                        <SelectItem value="Spring">Spring</SelectItem>
                        <SelectItem value="Summer">Summer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Year</label>
                    <Input
                      type="number"
                      min="2020"
                      max="2030"
                      value={newCourse.year}
                      onChange={(e) => setNewCourse({ ...newCourse, year: parseInt(e.target.value) || new Date().getFullYear() })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Max Students</label>
                    <Input
                      type="number"
                      min="1"
                      value={newCourse.maxStudents}
                      onChange={(e) => setNewCourse({ ...newCourse, maxStudents: parseInt(e.target.value) || 50 })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Schedule Time</label>
                    <Input
                      placeholder="e.g., 10:00-11:00"
                      value={newCourse.schedule.time}
                      onChange={(e) => setNewCourse({
                        ...newCourse,
                        schedule: { ...newCourse.schedule, time: e.target.value }
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      placeholder="e.g., CS Building 201"
                      value={newCourse.schedule.location}
                      onChange={(e) => setNewCourse({
                        ...newCourse,
                        schedule: { ...newCourse.schedule, location: e.target.value }
                      })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Prerequisites (optional)</label>
                  <Input
                    placeholder="Enter prerequisites separated by commas"
                    value={newCourse.prerequisites}
                    onChange={(e) => setNewCourse({ ...newCourse, prerequisites: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCourse}>
                  Create Course
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))
        ) : courses.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground text-center">
                  {user?.role === 'faculty' || user?.role === 'admin'
                    ? 'Create your first course to get started!'
                    : 'No courses are available at the moment.'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          courses.map((course) => {
            const isInstructor = course.instructor._id === user?.id;
            const isEnrolled = course.enrolledStudents.some((s: any) => s._id === user?.id);

            return (
              <Card key={course._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        {course.code}
                      </CardDescription>
                    </div>
                    <Badge className={
                      isInstructor ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      isEnrolled ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                    }>
                      {isInstructor ? 'Teaching' : isEnrolled ? 'Enrolled' : 'Available'}
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
                      <span>Instructor: {course.instructor.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span>{course.schedule.time} • {course.schedule.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span>{course.credits} Credits • {course.semester} {course.year}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-slate-500" />
                      <span>{course.enrolledStudents.length}/{course.maxStudents || 'Unlimited'} Students</span>
                    </div>
                  </div>

                  {course.prerequisites && course.prerequisites.length > 0 && (
                    <div className="text-xs text-slate-500">
                      <span className="font-medium">Prerequisites:</span> {course.prerequisites.join(', ')}
                    </div>
                  )}

                  <div className="pt-2">
                    <Button className="w-full" variant="outline">
                      {user?.role === 'student'
                        ? isEnrolled ? 'View Course' : 'Enroll'
                        : isInstructor
                        ? 'Manage Course'
                        : 'View Details'
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
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
