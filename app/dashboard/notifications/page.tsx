'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  BellOff, 
  Calendar, 
  FileText, 
  GraduationCap, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2
} from 'lucide-react';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'assignment' | 'event' | 'announcement' | 'grade' | 'system' | 'reminder';
  sender: {
    name: string;
    email: string;
    role: string;
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  isReadByUser: boolean;
  readAt?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const unreadOnly = activeTab === 'unread';
      const response = await fetch(`/api/notifications?unread=${unreadOnly}`, {
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        setNotifications(data.notifications);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch notifications",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while fetching notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setNotifications(notifications.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isReadByUser: true, readAt: new Date().toISOString() }
            : notif
        ));
        toast({
          title: "Success",
          description: "Notification marked as read",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    }
  };

  const markAsUnread = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setNotifications(notifications.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isReadByUser: false, readAt: undefined }
            : notif
        ));
        toast({
          title: "Success",
          description: "Notification marked as unread",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as unread",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'grade':
        return <GraduationCap className="h-5 w-5 text-purple-500" />;
      case 'system':
        return <Settings className="h-5 w-5 text-gray-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-indigo-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.isReadByUser).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
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
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated with important announcements and updates
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} unread
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({unreadCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground text-center">
                  {activeTab === 'unread' 
                    ? "You're all caught up! No unread notifications." 
                    : "No notifications available at the moment."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card 
                  key={notification._id} 
                  className={`hover:shadow-md transition-all cursor-pointer ${
                    !notification.isReadByUser 
                      ? 'border-l-4 border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20' 
                      : ''
                  }`}
                  onClick={() => !notification.isReadByUser && markAsRead(notification._id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        {getTypeIcon(notification.type)}
                        <div className="space-y-1">
                          <CardTitle className="text-base flex items-center gap-2">
                            {notification.title}
                            {!notification.isReadByUser && (
                              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                            )}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            From {notification.sender.name} • {formatTimeAgo(notification.createdAt)}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(notification.priority)} variant="secondary">
                          {notification.priority}
                        </Badge>
                        <div className="flex gap-1">
                          {notification.isReadByUser ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsUnread(notification._id);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <BellOff className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification._id);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
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
