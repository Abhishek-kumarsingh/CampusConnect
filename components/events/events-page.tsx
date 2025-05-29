"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { EventCard } from './event-card';
import { Calendar, Filter, Search, Plus, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
  };
  attendees: any[];
  tags: string[];
  image?: string;
  isApproved: boolean;
  isPublic: boolean;
  maxAttendees?: number;
  createdAt: string;
  updatedAt: string;
}

type CategoryFilter = 'all' | 'hackathon' | 'seminar' | 'workshop' | 'conference' | 'social' | 'sports' | 'other';

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  // Fetch events from API
  const fetchEvents = async (resetPage = false) => {
    try {
      setLoading(true);
      const currentPage = resetPage ? 1 : page;

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '9',
        upcoming: 'true'
      });

      if (activeFilter !== 'all') {
        params.append('category', activeFilter);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/events?${params}`);
      const data = await response.json();

      if (response.ok) {
        if (resetPage) {
          setEvents(data.events);
          setPage(1);
        } else {
          setEvents(prev => [...prev, ...data.events]);
        }
        setHasMore(data.pagination.page < data.pagination.pages);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch events",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while fetching events",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and refetch on filter/search changes
  useEffect(() => {
    fetchEvents(true);
  }, [activeFilter, searchTerm]);

  // Toggle RSVP status
  const toggleRsvp = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to RSVP for events",
        variant: "destructive",
      });
      return;
    }

    try {
      const event = events.find(e => e._id === eventId);
      const isCurrentlyRsvped = event?.attendees.some(a => a._id === user.id);

      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: isCurrentlyRsvped ? 'DELETE' : 'POST',
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        // Update local state
        setEvents(events.map(event =>
          event._id === eventId ? data.event : event
        ));

        toast({
          title: "Success",
          description: data.message,
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update RSVP",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
    fetchEvents();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-indigo-600 dark:bg-indigo-900 text-white py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4" data-aos="fade-up">Campus Events</h1>
            <p className="text-xl max-w-3xl mx-auto mb-8" data-aos="fade-up" data-aos-delay="100">
              Discover and participate in exciting events happening across campus
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto" data-aos="fade-up" data-aos-delay="200">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-indigo-200" />
                <Input
                  placeholder="Search events..."
                  className="pl-10 bg-indigo-700/50 border-indigo-500 text-white placeholder:text-indigo-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="secondary" className="whitespace-nowrap">
                <Calendar className="mr-2 h-4 w-4" />
                View Calendar
              </Button>
            </div>
          </div>
        </section>

        {/* Events Content */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Top Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div className="flex items-center">
                <Filter className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-xl font-semibold">Filter by Category</h2>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </div>

            {/* Category Tabs */}
            <Tabs defaultValue="all" value={activeFilter} onValueChange={(value) => setActiveFilter(value as CategoryFilter)} className="mb-8">
              <TabsList className="bg-slate-100 dark:bg-slate-800">
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="hackathon">Hackathons</TabsTrigger>
                <TabsTrigger value="seminar">Seminars</TabsTrigger>
                <TabsTrigger value="workshop">Workshops</TabsTrigger>
                <TabsTrigger value="conference">Conferences</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
                <TabsTrigger value="sports">Sports</TabsTrigger>
                <TabsTrigger value="other">Other</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Event Cards */}
            {loading && events.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                    <div className="animate-pulse">
                      <div className="bg-slate-200 dark:bg-slate-700 h-48 rounded-lg mb-4"></div>
                      <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded mb-2"></div>
                      <div className="bg-slate-200 dark:bg-slate-700 h-4 rounded w-3/4 mb-4"></div>
                      <div className="bg-slate-200 dark:bg-slate-700 h-8 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <div key={event._id} data-aos="fade-up" data-aos-delay={(index % 3) * 100}>
                    <EventCard
                      event={{
                        id: event._id,
                        title: event.title,
                        description: event.description,
                        date: new Date(event.date).toLocaleDateString(),
                        time: event.time,
                        location: event.location,
                        organizer: event.organizer.name,
                        image: event.image || "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                        category: event.category,
                        attendees: event.attendees.length,
                        isRsvped: user ? event.attendees.some(a => a._id === user.id) : false
                      }}
                      onRsvpToggle={() => toggleRsvp(event._id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
                <Button variant="outline" onClick={() => {
                  setActiveFilter('all');
                  setSearchTerm('');
                }}>
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Show More Button */}
            {events.length > 0 && hasMore && (
              <div className="flex justify-center mt-10">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More Events'
                  )}
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}