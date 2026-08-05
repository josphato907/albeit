import { Metadata } from 'next'
import EventDetailsClient from '@/components/event-details-client'
import { mockEvents } from '@/lib/events'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const eventId = parseInt(id, 10)
  
  // First check mock events, then check if it's a timestamp-based ID from dynamic events
  let event = mockEvents.find((e) => e.id === eventId)
  
  // If not found in mock events, it might be a timestamp-based ID from localStorage
  // We'll pass null and let the client-side component handle finding it
  if (!event && eventId > 1000000000) {
    // This is likely a timestamp ID, client will fetch from localStorage
    event = {
      id: eventId,
      title: 'Loading...',
      artist: '',
      date: '',
      time: '',
      location: '',
      category: '',
      price: 0,
      image: '',
      description: 'Loading event details...',
      available: 0,
    }
  }
  
  return {
    title: event ? `${event.title} | AleBilet` : 'Event Not Found | AleBilet',
    description: event ? event.description : 'Event not found',
  }
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const eventId = parseInt(id, 10)
  
  // First check mock events
  let event = mockEvents.find((e) => e.id === eventId)
  
  // If not found and it looks like a timestamp ID, pass null to let client handle it
  if (!event && eventId > 1000000000) {
    event = null
  }

  return <EventDetailsClient event={event} eventId={eventId} />
}
