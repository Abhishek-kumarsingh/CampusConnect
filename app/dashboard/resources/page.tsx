"use client"

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Eye, 
  BookOpen, 
  Video, 
  Link, 
  Search,
  Filter,
  Upload,
  Star,
  Clock
} from 'lucide-react';

export default function ResourcesPage() {
  const { user } = useAuth();

  // Mock resources data - in real app, fetch from API
  const resources = [
    {
      id: 1,
      title: "Data Structures Cheat Sheet",
      description: "Comprehensive guide covering all major data structures with time complexities and implementation examples.",
      type: "document",
      course: "CS301",
      author: "Dr. Jane Faculty",
      fileSize: "2.5 MB",
      downloads: 245,
      rating: 4.8,
      uploadDate: "2024-01-15",
      tags: ["Data Structures", "Algorithms", "Reference"]
    },
    {
      id: 2,
      title: "React Hooks Tutorial Series",
      description: "Complete video series covering useState, useEffect, useContext, and custom hooks with practical examples.",
      type: "video",
      course: "CS205",
      author: "Prof. John Smith",
      duration: "3h 45m",
      views: 1250,
      rating: 4.9,
      uploadDate: "2024-01-20",
      tags: ["React", "JavaScript", "Web Development"]
    },
    {
      id: 3,
      title: "SQL Practice Problems",
      description: "Collection of SQL exercises ranging from basic queries to advanced joins and subqueries.",
      type: "document",
      course: "CS401",
      author: "Dr. Sarah Wilson",
      fileSize: "1.8 MB",
      downloads: 189,
      rating: 4.7,
      uploadDate: "2024-01-18",
      tags: ["SQL", "Database", "Practice"]
    },
    {
      id: 4,
      title: "Machine Learning Fundamentals",
      description: "Interactive online course covering supervised and unsupervised learning algorithms.",
      type: "link",
      course: "CS501",
      author: "External Resource",
      url: "https://ml-course.example.com",
      rating: 4.6,
      uploadDate: "2024-01-22",
      tags: ["Machine Learning", "AI", "Online Course"]
    },
    {
      id: 5,
      title: "Campus Library Study Guide",
      description: "Essential guide for making the most of campus library resources and study spaces.",
      type: "document",
      course: "General",
      author: "Campus Library",
      fileSize: "950 KB",
      downloads: 567,
      rating: 4.5,
      uploadDate: "2024-01-10",
      tags: ["Study Tips", "Library", "Academic Success"]
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'link':
        return <Link className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'video':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'link':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Resources</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Access course materials, study guides, and educational content
          </p>
        </div>
        {(user?.role === 'faculty' || user?.role === 'admin') && (
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Resource
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search resources..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resource Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="links">External Links</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-6">
            {resources.map((resource) => (
              <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                        {getTypeIcon(resource.type)}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {resource.description}
                        </CardDescription>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={getTypeColor(resource.type)}>
                            {resource.type}
                          </Badge>
                          <Badge variant="outline">{resource.course}</Badge>
                          <span className="text-sm text-slate-500">by {resource.author}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {renderStars(resource.rating)}
                        <span className="text-sm text-slate-600 ml-1">
                          {resource.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      {resource.type === 'document' && (
                        <>
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span>{resource.downloads} downloads</span>
                          </div>
                          <span>Size: {resource.fileSize}</span>
                        </>
                      )}
                      {resource.type === 'video' && (
                        <>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{resource.views} views</span>
                          </div>
                          <span>Duration: {resource.duration}</span>
                        </>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Uploaded {new Date(resource.uploadDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {resource.type === 'document' && (
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                      {resource.type === 'link' && (
                        <Button size="sm">
                          <Link className="h-4 w-4 mr-1" />
                          Open
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {resource.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Document resources will be displayed here</p>
          </div>
        </TabsContent>

        <TabsContent value="videos">
          <div className="text-center py-8">
            <Video className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Video resources will be displayed here</p>
          </div>
        </TabsContent>

        <TabsContent value="links">
          <div className="text-center py-8">
            <Link className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">External link resources will be displayed here</p>
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Your favorite resources will be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
