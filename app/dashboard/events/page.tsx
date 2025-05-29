"use client"

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CreateEventDialog } from '@/components/events/create-event-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  Plus,
  Star,
  ExternalLink
} from 'lucide-react';

export default function DashboardEventsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      } else {
        // Fallback to mock data if API fails
        setEvents(mockEvents);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRSVP = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Successfully registered for the event!',
        });
        fetchEvents(); // Refresh events to update registration status
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to register for event',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Mock events data - fallback when API is not available
  const mockEvents = [
    {
      id: 1,
      title: "Tech Innovators Summit 2024",
      description: "Join the biggest tech event on campus with industry leaders, innovative showcases, and networking opportunities.",
      date: "2024-06-05",
      time: "10:00 AM",
      location: "Student Center Ballroom",
      category: "Conference",
      organizer: "Dr. Jane Faculty",
      maxAttendees: 200,
      currentAttendees: 156,
      isRegistered: true,
      isFavorite: true,
      tags: ["Technology", "Innovation", "Networking"],
      image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg"
    },
    {
      id: 2,
      title: "AI & Machine Learning Workshop",
      description: "Hands-on workshop covering the fundamentals of artificial intelligence and machine learning.",
      date: "2024-06-12",
      time: "2:00 PM",
      location: "Computer Science Lab 301",
      category: "Workshop",
      organizer: "Dr. Jane Faculty",
      maxAttendees: 50,
      currentAttendees: 32,
      isRegistered: false,
      isFavorite: false,
      tags: ["AI", "Machine Learning", "Programming"],
      image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg"
    },
    {
      id: 3,
      title: "Campus Hackathon 2024",
      description: "48-hour coding marathon where students collaborate to build innovative solutions.",
      date: "2024-06-19",
      time: "6:00 PM",
      location: "Engineering Building",
      category: "Hackathon",
      organizer: "Admin User",
      maxAttendees: 100,
      currentAttendees: 78,
      isRegistered: true,
      isFavorite: false,
      tags: ["Coding", "Competition", "Innovation"],
      image: "https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg"
    },
    {
      id: 4,
      title: "Career Fair 2024",
      description: "Meet with top employers and explore internship and job opportunities.",
      date: "2024-06-25",
      time: "9:00 AM",
      location: "Main Gymnasium",
      category: "Career",
      organizer: "Career Services",
      maxAttendees: 500,
      currentAttendees: 234,
      isRegistered: false,
      isFavorite: true,
      tags: ["Career", "Jobs", "Networking"],
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'conference':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'workshop':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'hackathon':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'career':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Events</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Discover and register for campus events, workshops, and activities
          </p>
        </div>
        {(user?.role === 'faculty' || user?.role === 'admin') && (
          <CreateEventDialog onEventCreated={fetchEvents} />
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search events..."
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

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="registered">My Events</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid gap-6">
            {events.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                        {event.isFavorite && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <CardDescription className="text-base">
                        {event.description}
                      </CardDescription>
                      <div className="flex items-center gap-2 mt-3">
                        <Badge className={getCategoryColor(event.category)}>
                          {event.category}
                        </Badge>
                        {event.isRegistered && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Registered
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">
                        {event.currentAttendees}/{event.maxAttendees} attendees
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {typeof event.organizer === 'string'
                            ? event.organizer.split(' ').map(n => n[0]).join('')
                            : event.organizer?.name?.split(' ').map(n => n[0]).join('') || 'OR'
                          }
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Organized by {typeof event.organizer === 'string' ? event.organizer : event.organizer?.name || 'Unknown Organizer'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Button
                        size="sm"
                        disabled={event.isRegistered || loading}
                        onClick={() => handleRSVP(event.id)}
                      >
                        {event.isRegistered ? 'Registered' : 'Register'}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {event.tags.map((tag) => (
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

        <TabsContent value="registered">
          <div className="grid gap-6">
            {events.filter(event => event.isRegistered).map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span>{formatDate(event.date)}</span>
                      <span>{event.time}</span>
                      <span>{event.location}</span>
                    </div>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <div className="grid gap-6">
            {events.filter(event => event.isFavorite).map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                  <CardDescription>{event.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span>{formatDate(event.date)}</span>
                      <span>{event.time}</span>
                      <span>{event.location}</span>
                    </div>
                    <Button size="sm">
                      {event.isRegistered ? 'Registered' : 'Register'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400">Upcoming events will be displayed here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
