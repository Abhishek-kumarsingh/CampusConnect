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
import { Users, MessageSquare, Calendar, Settings, Plus, Search, Lock, Globe } from 'lucide-react';

interface Group {
  _id: string;
  name: string;
  description: string;
  type: string;
  creator: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  members: any[];
  admins: any[];
  course?: {
    _id: string;
    title: string;
    code: string;
  };
  maxMembers?: number;
  isPrivate: boolean;
  tags: string[];
  meetingSchedule?: {
    day: string;
    time: string;
    location: string;
    frequency: string;
  };
  joinRequests: any[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function GroupsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    type: 'study',
    maxMembers: 20,
    isPrivate: false,
    tags: '',
    meetingSchedule: {
      day: '',
      time: '',
      location: '',
      frequency: 'weekly'
    }
  });

  useEffect(() => {
    fetchGroups();
  }, [filter]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter === 'myGroups') {
        params.append('myGroups', 'true');
      } else if (filter !== 'all') {
        params.append('type', filter);
      }

      const response = await fetch(`/api/groups?${params}`, {
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setGroups(data.groups);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch groups",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while fetching groups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroup.name.trim() || !newGroup.description.trim()) {
      toast({
        title: "Error",
        description: "Name and description are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const groupData = {
        ...newGroup,
        tags: newGroup.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(groupData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        });
        setIsCreateDialogOpen(false);
        setNewGroup({
          name: '',
          description: '',
          type: 'study',
          maxMembers: 20,
          isPrivate: false,
          tags: '',
          meetingSchedule: { day: '', time: '', location: '', frequency: 'weekly' }
        });
        fetchGroups();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create group",
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

  const handleJoinGroup = async (groupId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        });
        fetchGroups();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to join group",
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

  const handleLeaveGroup = async (groupId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: data.message,
        });
        fetchGroups();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to leave group",
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'study':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'project':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'club':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'social':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'academic':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'other':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Groups</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Join study groups, collaborate on projects, and connect with peers
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
              <DialogDescription>
                Start a new group to collaborate with your peers.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Group Name</label>
                <Input
                  placeholder="Enter group name"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  placeholder="Describe your group's purpose and activities..."
                  className="min-h-[100px]"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Group Type</label>
                  <Select value={newGroup.type} onValueChange={(value) => setNewGroup({ ...newGroup, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="study">Study Group</SelectItem>
                      <SelectItem value="project">Project Team</SelectItem>
                      <SelectItem value="club">Club</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Max Members</label>
                  <Input
                    type="number"
                    min="2"
                    max="100"
                    value={newGroup.maxMembers}
                    onChange={(e) => setNewGroup({ ...newGroup, maxMembers: parseInt(e.target.value) || 20 })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Meeting Day</label>
                  <Select value={newGroup.meetingSchedule.day} onValueChange={(value) => setNewGroup({
                    ...newGroup,
                    meetingSchedule: { ...newGroup.meetingSchedule, day: value }
                  })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monday">Monday</SelectItem>
                      <SelectItem value="Tuesday">Tuesday</SelectItem>
                      <SelectItem value="Wednesday">Wednesday</SelectItem>
                      <SelectItem value="Thursday">Thursday</SelectItem>
                      <SelectItem value="Friday">Friday</SelectItem>
                      <SelectItem value="Saturday">Saturday</SelectItem>
                      <SelectItem value="Sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Meeting Time</label>
                  <Input
                    type="time"
                    value={newGroup.meetingSchedule.time}
                    onChange={(e) => setNewGroup({
                      ...newGroup,
                      meetingSchedule: { ...newGroup.meetingSchedule, time: e.target.value }
                    })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Frequency</label>
                  <Select value={newGroup.meetingSchedule.frequency} onValueChange={(value) => setNewGroup({
                    ...newGroup,
                    meetingSchedule: { ...newGroup.meetingSchedule, frequency: value }
                  })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="irregular">Irregular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Meeting Location</label>
                <Input
                  placeholder="e.g., Library Room 201"
                  value={newGroup.meetingSchedule.location}
                  onChange={(e) => setNewGroup({
                    ...newGroup,
                    meetingSchedule: { ...newGroup.meetingSchedule, location: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tags (optional)</label>
                <Input
                  placeholder="Enter tags separated by commas"
                  value={newGroup.tags}
                  onChange={(e) => setNewGroup({ ...newGroup, tags: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={newGroup.isPrivate}
                  onChange={(e) => setNewGroup({ ...newGroup, isPrivate: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="isPrivate" className="text-sm font-medium">
                  Private Group (requires approval to join)
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateGroup}>
                Create Group
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All Groups
            </Button>
            <Button
              variant={filter === 'myGroups' ? 'default' : 'outline'}
              onClick={() => setFilter('myGroups')}
            >
              My Groups
            </Button>
            <Button
              variant={filter === 'study' ? 'default' : 'outline'}
              onClick={() => setFilter('study')}
            >
              Study Groups
            </Button>
            <Button
              variant={filter === 'project' ? 'default' : 'outline'}
              onClick={() => setFilter('project')}
            >
              Projects
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Groups Grid */}
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
        ) : filteredGroups.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No groups found</h3>
                <p className="text-muted-foreground text-center">
                  {filter === 'myGroups'
                    ? 'You haven\'t joined any groups yet. Create or join a group to get started!'
                    : 'No groups match your current filter. Try a different filter or create a new group.'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredGroups.map((group) => {
            const isMember = group.members.some((member: any) => member._id === user?.id);
            const isCreator = group.creator._id === user?.id;
            const isAdmin = group.admins.some((admin: any) => admin._id === user?.id);
            const hasPendingRequest = group.joinRequests.some((request: any) => request === user?.id);

            return (
              <Card key={group._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={getTypeColor(group.type)}>
                          {group.type.charAt(0).toUpperCase() + group.type.slice(1)}
                        </Badge>
                        {group.isPrivate && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Lock className="h-3 w-3" />
                            Private
                          </Badge>
                        )}
                        {!group.isPrivate && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            Public
                          </Badge>
                        )}
                      </div>
                    </div>
                    {(isMember || isAdmin) && (
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
                      <span>{group.members.length}/{group.maxMembers || 'Unlimited'} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-slate-500" />
                      <span>Created by {group.creator.name}</span>
                    </div>
                    {group.meetingSchedule?.day && group.meetingSchedule?.time && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-xs">
                          {group.meetingSchedule.frequency} on {group.meetingSchedule.day}s at {group.meetingSchedule.time}
                          {group.meetingSchedule.location && ` in ${group.meetingSchedule.location}`}
                        </span>
                      </div>
                    )}
                    {group.course && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                          Course: {group.course.code} - {group.course.title}
                        </span>
                      </div>
                    )}
                  </div>

                  {group.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {group.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="pt-2">
                    {isMember ? (
                      <div className="space-y-2">
                        <Button className="w-full" variant="outline">
                          View Group
                        </Button>
                        {!isCreator && (
                          <Button
                            className="w-full"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleLeaveGroup(group._id)}
                          >
                            Leave Group
                          </Button>
                        )}
                      </div>
                    ) : hasPendingRequest ? (
                      <Button className="w-full" variant="outline" disabled>
                        Request Pending
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handleJoinGroup(group._id)}
                        disabled={group.maxMembers ? group.members.length >= group.maxMembers : false}
                      >
                        {group.maxMembers && group.members.length >= group.maxMembers
                          ? 'Group Full'
                          : group.isPrivate
                          ? 'Request to Join'
                          : 'Join Group'
                        }
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {groups.filter(group => group.members.some((member: any) => member._id === user?.id)).length}
                </p>
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
                <p className="text-2xl font-bold">
                  {groups.filter(group => group.creator._id === user?.id).length}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Groups Created</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{groups.length}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Groups</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
