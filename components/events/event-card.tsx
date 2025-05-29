import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  image: string;
  category: string;
  attendees: number;
  isRsvped: boolean;
}

interface EventCardProps {
  event: Event;
  onRsvpToggle: (eventId: string) => void;
}

export function EventCard({ event, onRsvpToggle }: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'conference':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'arts':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'career':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'workshop':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'community':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300';
      case 'competition':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all border-slate-200 dark:border-slate-700">
      <div
        className="relative h-48 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={event.image}
          alt={event.title}
          className={cn(
            "object-cover w-full h-full transition-transform duration-500",
            isHovered ? "scale-110" : "scale-100"
          )}
        />
        <div className="absolute top-4 left-4">
          <Badge className={cn("text-xs font-medium", getCategoryColor(event.category))}>
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg line-clamp-1">{event.title}</h3>
        </div>
        <div className="flex items-center text-sm text-slate-500 mt-1">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          {event.date} • {event.time}
        </div>
        <div className="flex items-center text-sm text-slate-500 mt-1">
          <MapPin className="h-3.5 w-3.5 mr-1" />
          {event.location}
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">{event.description}</p>
        <div className="flex items-center mt-4 text-sm">
          <Users className="h-4 w-4 text-slate-400 mr-1" />
          <span className="text-slate-500">{event.attendees} attending</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/events/${event.id}`}>Details</Link>
        </Button>
        <Button
          size="sm"
          variant={event.isRsvped ? "secondary" : "default"}
          onClick={() => onRsvpToggle(event.id)}
        >
          {event.isRsvped ? "Cancel RSVP" : "RSVP"}
        </Button>
      </CardFooter>
    </Card>
  );
}