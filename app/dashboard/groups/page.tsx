"use client"

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageSquare, Calendar, Settings, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function GroupsPage() {
  const { user } = useAuth();

  // Mock groups data - in real app, fetch from API
  const groups = [
    {
      id: 1,
      name: "CS Study Group",
      description: "A collaborative study group for Computer Science students. We meet weekly to discuss coursework and prepare for exams.",
      type: "Study Group",
      members: 24,
      maxMembers: 30,
      isPrivate: false,
      isMember: true,
      lastActivity: "2 hours ago",
      upcomingEvent: "Study Session - Tomorrow 3:00 PM",
      tags: ["Computer Science", "Study", "Exams"]
    },
    {
      id: 2,
      name: "Web Dev Enthusiasts",
      description: "For students passionate about web development. Share projects, discuss latest frameworks, and collaborate on coding challenges.",
      type: "Interest Group",
      members: 18,
      maxMembers: 25,
      isPrivate: false,
      isMember: true,
      lastActivity: "1 day ago",
      upcomingEvent: "React Workshop - Friday 6:00 PM",
      tags: ["Web Development", "React", "JavaScript"]
    },
    {
      id: 3,
      name: "Database Design Team",
      description: "Advanced group focused on database design patterns and optimization techniques. Working on real-world projects.",
      type: "Project Group",
      members: 12,
      maxMembers: 15,
      isPrivate: true,
      isMember: false,
      lastActivity: "3 hours ago",
      upcomingEvent: "Project Review - Monday 2:00 PM",
      tags: ["Database", "SQL", "Design Patterns"]
    },
    {
      id: 4,
      name: "AI Research Circle",
      description: "Graduate students and faculty discussing latest AI research papers and working on machine learning projects.",
      type: "Research Group",
      members: 8,
      maxMembers: 12,
      isPrivate: true,
      isMember: user?.role === 'faculty',
      lastActivity: "5 hours ago",
      upcomingEvent: "Paper Discussion - Wednesday 4:00 PM",
      tags: ["AI", "Machine Learning", "Research"]
    },
    {
      id: 5,
      name: "Campus Hackathon Team",
      description: "Team preparing for the upcoming campus hackathon. Looking for motivated developers to join our squad!",
      type: "Competition Team",
      members: 6,
      maxMembers: 8,
      isPrivate: false,
      isMember: false,
      lastActivity: "1 hour ago",
      upcomingEvent: "Team Meeting - Today 7:00 PM",
      tags: ["Hackathon", "Competition", "Innovation"]
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Study Group':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Interest Group':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Project Group':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Research Group':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Competition Team':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Groups</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Join study groups, collaborate on projects, and connect with peers
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search groups..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">All Groups</Button>
            <Button variant="outline">My Groups</Button>
            <Button variant="outline">Public</Button>
          </div>
        </CardContent>
      </Card>

      {/* Groups Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{group.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getTypeColor(group.type)}>
                      {group.type}
                    </Badge>
                    {group.isPrivate && (
                      <Badge variant="outline">Private</Badge>
                    )}
                  </div>
                </div>
                {group.isMember && (
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {group.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-500" />
                  <span>{group.members}/{group.maxMembers} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-slate-500" />
                  <span>Last activity {group.lastActivity}</span>
                </div>
                {group.upcomingEvent && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span className="text-xs">{group.upcomingEvent}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1">
                {group.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="pt-2">
                <Button 
                  className="w-full" 
                  variant={group.isMember ? "outline" : "default"}
                >
                  {group.isMember ? 'View Group' : 'Join Group'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Groups Joined</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">15</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Messages Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Upcoming Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
