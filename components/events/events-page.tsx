"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { EventCard } from './event-card';
import { Calendar, Filter, Search, Plus } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Mock event data
const eventsData = [
  {
    id: 1,
    title: "Tech Innovators Summit",
    description: "Join the biggest tech event on campus with industry leaders and innovative showcases.",
    date: "May 15, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Student Center Ballroom",
    organizer: "Computer Science Department",
    image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "conference",
    attendees: 156,
    isRsvped: false
  },
  {
    id: 2,
    title: "Spring Music Festival",
    description: "Annual music celebration featuring student bands and professional artists.",
    date: "May 20, 2025",
    time: "5:00 PM - 10:00 PM",
    location: "Campus Amphitheater",
    organizer: "Student Activities Board",
    image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "arts",
    attendees: 320,
    isRsvped: true
  },
  {
    id: 3,
    title: "Career Fair: STEM Edition",
    description: "Connect with top employers in Science, Technology, Engineering, and Mathematics fields.",
    date: "May 18, 2025",
    time: "9:00 AM - 3:00 PM",
    location: "Engineering Building",
    organizer: "Career Center",
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "career",
    attendees: 215,
    isRsvped: false
  },
  {
    id: 4,
    title: "AI and Machine Learning Workshop",
    description: "Hands-on workshop learning the fundamentals of AI and practical applications.",
    date: "May 22, 2025",
    time: "1:00 PM - 4:00 PM",
    location: "Tech Hall 201",
    organizer: "AI Student Society",
    image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "workshop",
    attendees: 78,
    isRsvped: false
  },
  {
    id: 5,
    title: "Campus Sustainability Day",
    description: "Learn about environmental initiatives and participate in campus cleanup.",
    date: "May 25, 2025",
    time: "10:00 AM - 2:00 PM",
    location: "Campus Quad",
    organizer: "Environmental Club",
    image: "https://images.pexels.com/photos/2990644/pexels-photo-2990644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "community",
    attendees: 142,
    isRsvped: false
  },
  {
    id: 6,
    title: "Entrepreneurship Pitch Competition",
    description: "Student startups compete for funding and mentorship opportunities.",
    date: "May 30, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "Business Building Auditorium",
    organizer: "Entrepreneur Club",
    image: "https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "competition",
    attendees: 95,
    isRsvped: true
  }
];

type CategoryFilter = 'all' | 'conference' | 'arts' | 'career' | 'workshop' | 'community' | 'competition';

export function EventsPage() {
  const [events, setEvents] = useState(eventsData);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  // Filter events based on category and search term
  useEffect(() => {
    let filteredEvents = [...eventsData];
    
    // Apply category filter
    if (activeFilter !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.category === activeFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      filteredEvents = filteredEvents.filter(
        event => event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setEvents(filteredEvents);
  }, [activeFilter, searchTerm]);

  // Toggle RSVP status
  const toggleRsvp = (eventId: number) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, isRsvped: !event.isRsvped } : event
    ));
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
                <TabsTrigger value="conference">Conferences</TabsTrigger>
                <TabsTrigger value="workshop">Workshops</TabsTrigger>
                <TabsTrigger value="career">Career</TabsTrigger>
                <TabsTrigger value="arts">Arts</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="competition">Competitions</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Event Cards */}
            {events.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <div key={event.id} data-aos="fade-up" data-aos-delay={(index % 3) * 100}>
                    <EventCard event={event} onRsvpToggle={toggleRsvp} />
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
            {events.length > 0 && (
              <div className="flex justify-center mt-10">
                <Button variant="outline" size="lg">
                  Load More Events
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