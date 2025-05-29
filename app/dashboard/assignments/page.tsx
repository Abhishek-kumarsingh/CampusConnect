'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Plus, 
  Search, 
  BookOpen,
  CheckCircle,
  AlertCircle,
  XCircle,
  Users
} from 'lucide-react';

interface Assignment {
  _id: string;
  title: string;
  description: string;
  course: string;
  instructor: {
    name: string;
    email: string;
  };
  dueDate: string;
  maxPoints: number;
  isPublished: boolean;
  submissionStatus?: 'not_submitted' | 'submitted' | 'graded' | 'late';
  grade?: number;
  feedback?: string;
  submissions?: any[];
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/assignments', {
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setAssignments(data.assignments);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch assignments",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while fetching assignments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'graded':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'late':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case 'not_submitted':
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'graded':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'late':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'not_submitted':
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && assignment.submissionStatus === 'not_submitted';
    if (activeTab === 'submitted') return matchesSearch && ['submitted', 'graded'].includes(assignment.submissionStatus || '');
    if (activeTab === 'graded') return matchesSearch && assignment.submissionStatus === 'graded';
    
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground">
            {user?.role === 'student' 
              ? 'View and submit your assignments' 
              : 'Manage and grade student assignments'
            }
          </p>
        </div>
        {user?.role === 'faculty' && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Assignment
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({assignments.length})</TabsTrigger>
          {user?.role === 'student' && (
            <>
              <TabsTrigger value="pending">
                Pending ({assignments.filter(a => a.submissionStatus === 'not_submitted').length})
              </TabsTrigger>
              <TabsTrigger value="submitted">
                Submitted ({assignments.filter(a => ['submitted', 'graded'].includes(a.submissionStatus || '')).length})
              </TabsTrigger>
              <TabsTrigger value="graded">
                Graded ({assignments.filter(a => a.submissionStatus === 'graded').length})
              </TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No assignments found</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm ? 'Try adjusting your search criteria' : 'No assignments available at the moment'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredAssignments.map((assignment) => (
                <Card key={assignment._id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {assignment.title}
                          {user?.role === 'student' && getStatusIcon(assignment.submissionStatus)}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {assignment.course}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {assignment.instructor.name}
                          </span>
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className="text-xs">
                          {assignment.maxPoints} points
                        </Badge>
                        {user?.role === 'student' && assignment.submissionStatus && (
                          <Badge className={getStatusColor(assignment.submissionStatus)}>
                            {assignment.submissionStatus.replace('_', ' ')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {assignment.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Due: {formatDate(assignment.dueDate)}
                        </span>
                        {isOverdue(assignment.dueDate) && assignment.submissionStatus === 'not_submitted' && (
                          <Badge variant="destructive" className="text-xs">
                            Overdue
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {user?.role === 'student' && assignment.grade && (
                          <Badge variant="secondary">
                            Grade: {assignment.grade}/{assignment.maxPoints}
                          </Badge>
                        )}
                        <Button variant="outline" size="sm">
                          {user?.role === 'student' ? 'View Details' : 'Manage'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
