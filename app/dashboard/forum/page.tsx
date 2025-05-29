"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, ThumbsUp, Clock, Pin, Users, Plus, Search } from 'lucide-react';

interface Discussion {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
  };
  category: string;
  course?: {
    _id: string;
    title: string;
    code: string;
  };
  tags: string[];
  replies: any[];
  likes: string[];
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ForumPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: ''
  });

  useEffect(() => {
    fetchDiscussions();
  }, [selectedCategory]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/discussions?${params}`, {
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setDiscussions(data.discussions);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch discussions",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while fetching discussions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscussion = async () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const discussionData = {
        ...newDiscussion,
        tags: newDiscussion.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await fetch('/api/discussions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(discussionData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        });
        setIsCreateDialogOpen(false);
        setNewDiscussion({ title: '', content: '', category: 'general', tags: '' });
        fetchDiscussions();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create discussion",
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const categories = [
    { name: "All", value: "all", count: discussions.length },
    { name: "General", value: "general", count: discussions.filter(d => d.category === 'general').length },
    { name: "Academic", value: "academic", count: discussions.filter(d => d.category === 'academic').length },
    { name: "Announcements", value: "announcements", count: discussions.filter(d => d.category === 'announcements').length },
    { name: "Help", value: "help", count: discussions.filter(d => d.category === 'help').length },
    { name: "Events", value: "events", count: discussions.filter(d => d.category === 'events').length },
    { name: "Other", value: "other", count: discussions.filter(d => d.category === 'other').length }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'faculty':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Discussion Forum</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Connect with classmates, ask questions, and share knowledge
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Discussion</DialogTitle>
              <DialogDescription>
                Start a new discussion topic for the community.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  placeholder="Enter discussion title"
                  value={newDiscussion.title}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={newDiscussion.category} onValueChange={(value) => setNewDiscussion({ ...newDiscussion, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="academic">Academic</SelectItem>
                    <SelectItem value="announcements">Announcements</SelectItem>
                    <SelectItem value="help">Help</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  placeholder="Write your discussion content..."
                  className="min-h-[120px]"
                  value={newDiscussion.content}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, content: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tags (optional)</label>
                <Input
                  placeholder="Enter tags separated by commas"
                  value={newDiscussion.tags}
                  onChange={(e) => setNewDiscussion({ ...newDiscussion, tags: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateDiscussion}>
                Create Discussion
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className={`flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors ${
                    selectedCategory === category.value ? 'bg-blue-100 dark:bg-blue-900' : ''
                  }`}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  <span className="text-sm">{category.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Forum Posts */}
        <div className="lg:col-span-3 space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
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
              ))}
            </div>
          ) : discussions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No discussions found</h3>
                <p className="text-muted-foreground text-center">
                  Be the first to start a discussion in this category!
                </p>
              </CardContent>
            </Card>
          ) : (
            discussions.map((discussion) => (
              <Card key={discussion._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {discussion.isPinned && (
                        <Pin className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-lg hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                          {discussion.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {discussion.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {discussion.author.name}
                          </span>
                          <Badge className={getRoleColor(discussion.author.role)}>
                            {discussion.author.role}
                          </Badge>
                          {discussion.course && (
                            <>
                              <span className="text-xs text-slate-500">•</span>
                              <span className="text-xs text-slate-500">{discussion.course.code}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">{discussion.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {discussion.content.length > 200
                      ? `${discussion.content.substring(0, 200)}...`
                      : discussion.content
                    }
                  </p>

                  {discussion.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {discussion.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{discussion.replies.length} replies</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        <span>{discussion.likes.length} likes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{discussion.views} views</span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">
                      {new Date(discussion.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
