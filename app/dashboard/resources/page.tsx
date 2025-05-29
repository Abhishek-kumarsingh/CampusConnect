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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
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
  Clock,
  Heart,
  ExternalLink,
  Image,
  Music
} from 'lucide-react';

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  externalUrl?: string;
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  course?: {
    _id: string;
    title: string;
    code: string;
  };
  subject?: string;
  tags: string[];
  downloads: number;
  likes: string[];
  isPublic: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ResourcesPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'document',
    category: 'other',
    externalUrl: '',
    subject: '',
    tags: '',
    isPublic: true
  });

  useEffect(() => {
    fetchResources();
  }, [activeTab, selectedCategory]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (activeTab !== 'all') {
        if (activeTab === 'documents') params.append('type', 'document');
        else if (activeTab === 'videos') params.append('type', 'video');
        else if (activeTab === 'links') params.append('type', 'link');
        else if (activeTab === 'myResources') params.append('myResources', 'true');
      }

      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/resources?${params}`, {
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setResources(data.resources);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch resources",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while fetching resources",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = async () => {
    if (!newResource.title.trim() || !newResource.description.trim()) {
      toast({
        title: "Error",
        description: "Title and description are required",
        variant: "destructive",
      });
      return;
    }

    if (!newResource.externalUrl.trim()) {
      toast({
        title: "Error",
        description: "External URL is required (file upload will be implemented later)",
        variant: "destructive",
      });
      return;
    }

    try {
      const resourceData = {
        ...newResource,
        tags: newResource.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(resourceData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        });
        setIsCreateDialogOpen(false);
        setNewResource({
          title: '',
          description: '',
          type: 'document',
          category: 'other',
          externalUrl: '',
          subject: '',
          tags: '',
          isPublic: true
        });
        fetchResources();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create resource",
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

  const handleLikeResource = async (resourceId: string) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}/like`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        // Update the resource in the list
        setResources(prev => prev.map(resource =>
          resource._id === resourceId
            ? {
                ...resource,
                likes: data.liked
                  ? [...resource.likes, user?.id || '']
                  : resource.likes.filter(id => id !== user?.id)
              }
            : resource
        ));
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to like resource",
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

  const handleDownloadResource = async (resourceId: string) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}/download`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        // Update download count
        setResources(prev => prev.map(resource =>
          resource._id === resourceId
            ? { ...resource, downloads: data.downloads }
            : resource
        ));

        // Open download URL
        if (data.downloadUrl) {
          window.open(data.downloadUrl, '_blank');
        }
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to download resource",
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



  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'link':
        return <ExternalLink className="h-5 w-5" />;
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'audio':
        return <Music className="h-5 w-5" />;
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
      case 'image':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'audio':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    resource.uploadedBy.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



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
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload New Resource</DialogTitle>
                <DialogDescription>
                  Share educational content with the community.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    placeholder="Enter resource title"
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Describe the resource content..."
                    className="min-h-[100px]"
                    value={newResource.description}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <Select value={newResource.type} onValueChange={(value) => setNewResource({ ...newResource, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="link">External Link</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="audio">Audio</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Select value={newResource.category} onValueChange={(value) => setNewResource({ ...newResource, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lecture_notes">Lecture Notes</SelectItem>
                        <SelectItem value="assignments">Assignments</SelectItem>
                        <SelectItem value="textbooks">Textbooks</SelectItem>
                        <SelectItem value="references">References</SelectItem>
                        <SelectItem value="tutorials">Tutorials</SelectItem>
                        <SelectItem value="tools">Tools</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">External URL</label>
                  <Input
                    placeholder="https://example.com/resource"
                    value={newResource.externalUrl}
                    onChange={(e) => setNewResource({ ...newResource, externalUrl: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    File upload feature will be implemented later. For now, please provide a link to the resource.
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Subject (optional)</label>
                  <Input
                    placeholder="e.g., Computer Science, Mathematics"
                    value={newResource.subject}
                    onChange={(e) => setNewResource({ ...newResource, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tags (optional)</label>
                  <Input
                    placeholder="Enter tags separated by commas"
                    value={newResource.tags}
                    onChange={(e) => setNewResource({ ...newResource, tags: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newResource.isPublic}
                    onChange={(e) => setNewResource({ ...newResource, isPublic: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="isPublic" className="text-sm font-medium">
                    Make this resource public
                  </label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateResource}>
                  Upload Resource
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="links">External Links</TabsTrigger>
          <TabsTrigger value="myResources">My Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-6">
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
            ) : filteredResources.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                  <p className="text-muted-foreground text-center">
                    {searchTerm
                      ? 'No resources match your search criteria. Try different keywords.'
                      : activeTab === 'myResources'
                      ? 'You haven\'t uploaded any resources yet. Upload your first resource to get started!'
                      : 'No resources are available in this category.'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredResources.map((resource) => {
                const isLiked = resource.likes.includes(user?.id || '');
                const isOwner = resource.uploadedBy._id === user?.id;

                return (
                  <Card key={resource._id} className="hover:shadow-lg transition-shadow">
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
                                {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                              </Badge>
                              <Badge variant="outline">
                                {resource.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </Badge>
                              {resource.course && (
                                <Badge variant="outline">{resource.course.code}</Badge>
                              )}
                              <span className="text-sm text-slate-500">by {resource.uploadedBy.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLikeResource(resource._id)}
                            className={isLiked ? 'text-red-500' : ''}
                          >
                            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="ml-1">{resource.likes.length}</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span>{resource.downloads} downloads</span>
                          </div>
                          {resource.fileSize && (
                            <span>Size: {(resource.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
                          )}
                          {resource.subject && (
                            <span>Subject: {resource.subject}</span>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Uploaded {new Date(resource.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {resource.type === 'link' ? (
                            <Button
                              size="sm"
                              onClick={() => handleDownloadResource(resource._id)}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Open Link
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleDownloadResource(resource._id)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>

                      {resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {resource.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* Other tab contents will show the same filtered resources */}
        {['documents', 'videos', 'links', 'myResources'].map(tabValue => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-4">
            <div className="grid gap-6">
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
              ) : filteredResources.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    {tabValue === 'documents' && <FileText className="h-12 w-12 text-muted-foreground mb-4" />}
                    {tabValue === 'videos' && <Video className="h-12 w-12 text-muted-foreground mb-4" />}
                    {tabValue === 'links' && <ExternalLink className="h-12 w-12 text-muted-foreground mb-4" />}
                    {tabValue === 'myResources' && <Upload className="h-12 w-12 text-muted-foreground mb-4" />}
                    <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                    <p className="text-muted-foreground text-center">
                      {searchTerm
                        ? 'No resources match your search criteria. Try different keywords.'
                        : tabValue === 'myResources'
                        ? 'You haven\'t uploaded any resources yet. Upload your first resource to get started!'
                        : `No ${tabValue} resources are available.`
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                // Same resource cards as in "all" tab
                filteredResources.map((resource) => {
                  const isLiked = resource.likes.includes(user?.id || '');
                  const isOwner = resource.uploadedBy._id === user?.id;

                  return (
                    <Card key={resource._id} className="hover:shadow-lg transition-shadow">
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
                                  {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                                </Badge>
                                <Badge variant="outline">
                                  {resource.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </Badge>
                                {resource.course && (
                                  <Badge variant="outline">{resource.course.code}</Badge>
                                )}
                                <span className="text-sm text-slate-500">by {resource.uploadedBy.name}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLikeResource(resource._id)}
                              className={isLiked ? 'text-red-500' : ''}
                            >
                              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                              <span className="ml-1">{resource.likes.length}</span>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              <span>{resource.downloads} downloads</span>
                            </div>
                            {resource.fileSize && (
                              <span>Size: {(resource.fileSize / (1024 * 1024)).toFixed(1)} MB</span>
                            )}
                            {resource.subject && (
                              <span>Subject: {resource.subject}</span>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>Uploaded {new Date(resource.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {resource.type === 'link' ? (
                              <Button
                                size="sm"
                                onClick={() => handleDownloadResource(resource._id)}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Open Link
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleDownloadResource(resource._id)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Download
                              </Button>
                            )}
                          </div>
                        </div>

                        {resource.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {resource.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
