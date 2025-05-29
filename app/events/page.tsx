import { Metadata } from 'next';
import { EventsPage } from '@/components/events/events-page';

export const metadata: Metadata = {
  title: 'Events - CampusConnect',
  description: 'Browse and join campus events',
};

export default function EventsRoute() {
  return <EventsPage />;
}