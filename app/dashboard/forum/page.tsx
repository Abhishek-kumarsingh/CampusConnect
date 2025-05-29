"use client"

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, ThumbsUp, Clock, Pin, Users } from 'lucide-react';

export default function ForumPage() {
  const { user } = useAuth();

  // Mock forum posts data - in real app, fetch from API
  const forumPosts = [
    {
      id: 1,
      title: "Help with Data Structures Assignment",
      content: "I'm struggling with implementing a binary search tree. Can someone explain the insertion algorithm?",
      author: "John Student",
      authorRole: "student",
      course: "CS301",
      category: "Academic Help",
      replies: 8,
      likes: 12,
      isPinned: false,
      createdAt: "2 hours ago",
      lastActivity: "30 minutes ago"
    },
    {
      id: 2,
      title: "Study Group for Database Systems Final",
      content: "Looking to form a study group for the upcoming Database Systems final exam. Meeting this weekend at the library.",
      author: "Sarah Wilson",
      authorRole: "student",
      course: "CS401",
      category: "Study Groups",
      replies: 15,
      likes: 25,
      isPinned: true,
      createdAt: "1 day ago",
      lastActivity: "1 hour ago"
    },
    {
      id: 3,
      title: "Web Development Project Showcase",
      content: "Share your web development projects here! Let's see what amazing things everyone has built.",
      author: "Dr. Jane Faculty",
      authorRole: "faculty",
      course: "CS205",
      category: "Projects",
      replies: 32,
      likes: 45,
      isPinned: true,
      createdAt: "3 days ago",
      lastActivity: "2 hours ago"
    },
    {
      id: 4,
      title: "Campus Hackathon Team Formation",
      content: "Looking for team members for the upcoming campus hackathon. Need frontend and backend developers!",
      author: "Alex Chen",
      authorRole: "student",
      course: "General",
      category: "Events",
      replies: 6,
      likes: 18,
      isPinned: false,
      createdAt: "5 hours ago",
      lastActivity: "1 hour ago"
    }
  ];

  const categories = [
    { name: "All", count: forumPosts.length },
    { name: "Academic Help", count: 1 },
    { name: "Study Groups", count: 1 },
    { name: "Projects", count: 1 },
    { name: "Events", count: 1 },
    { name: "General", count: 0 }
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
        <Button>New Post</Button>
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
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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
          {forumPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {post.isPinned && (
                      <Pin className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-lg hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">
                        {post.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {post.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {post.author}
                        </span>
                        <Badge className={getRoleColor(post.authorRole)}>
                          {post.authorRole}
                        </Badge>
                        <span className="text-xs text-slate-500">•</span>
                        <span className="text-xs text-slate-500">{post.course}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">{post.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  {post.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.replies} replies</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.likes} likes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Last activity {post.lastActivity}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{post.createdAt}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
