'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft,
  Share2,
  Heart,
  UserPlus,
  UserMinus
} from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  organizer: {
    _id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
  };
  attendees: any[];
  maxAttendees?: number;
  isApproved: boolean;
  isPublic: boolean;
  requirements?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${params.id}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setEvent(data.event);
      } else {
        toast({
          title: 'Error',
          description: 'Event not found',
          variant: 'destructive',
        });
        router.push('/events');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load event details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async () => {
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please login to RSVP for events',
        variant: 'destructive',
      });
      return;
    }

    try {
      setRsvpLoading(true);
      const response = await fetch(`/api/events/${params.id}/rsvp`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Success',
          description: data.message,
        });
        fetchEvent(); // Refresh event data
      } else {
        const data = await response.json();
        toast({
          title: 'Error',
          description: data.error || 'Failed to update RSVP',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setRsvpLoading(false);
    }
  };

  const isUserRegistered = () => {
    if (!user || !event) return false;
    return event.attendees.some(attendee => attendee._id === user.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      social: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      sports: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      cultural: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      workshop: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      seminar: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      conference: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
            <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <Button onClick={() => router.push('/events')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Event Details Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Badge className={getCategoryColor(event.category)}>
                  {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </Badge>
                <CardTitle className="text-3xl">{event.title}</CardTitle>
                <CardDescription className="text-lg">
                  {event.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Event Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{formatDate(event.date)}</p>
                    <p className="text-sm text-muted-foreground">Date</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{formatTime(event.time)}</p>
                    <p className="text-sm text-muted-foreground">Time</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{event.location}</p>
                    <p className="text-sm text-muted-foreground">Location</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {event.attendees.length}
                      {event.maxAttendees && ` / ${event.maxAttendees}`} attendees
                    </p>
                    <p className="text-sm text-muted-foreground">Registration</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {event.organizer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{event.organizer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.organizer.role} • {event.organizer.department}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            {event.requirements && (
              <div>
                <h3 className="font-semibold mb-2">Requirements</h3>
                <p className="text-muted-foreground">{event.requirements}</p>
              </div>
            )}

            {/* Contact Info */}
            {(event.contactEmail || event.contactPhone) && (
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="space-y-1">
                  {event.contactEmail && (
                    <p className="text-sm">Email: {event.contactEmail}</p>
                  )}
                  {event.contactPhone && (
                    <p className="text-sm">Phone: {event.contactPhone}</p>
                  )}
                </div>
              </div>
            )}

            {/* RSVP Button */}
            <div className="flex justify-center pt-4">
              <Button
                size="lg"
                onClick={handleRSVP}
                disabled={rsvpLoading || !user}
                className="min-w-[200px]"
              >
                {rsvpLoading ? (
                  'Processing...'
                ) : isUserRegistered() ? (
                  <>
                    <UserMinus className="mr-2 h-4 w-4" />
                    Cancel RSVP
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    RSVP Now
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
