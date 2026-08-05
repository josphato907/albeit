import { Metadata } from 'next'
import EventDetailsClient from '@/components/event-details-client'
import { mockEvents } from '@/lib/events'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const eventId = parseInt(id, 10)
  
  // Check mock events - if not found, client will look in localStorage
  const event = mockEvents.find((e) => e.id === eventId)
  
  return {
    title: event ? `${event.title} | AleBilet` : 'Event Details | AleBilet',
    description: event ? event.description : 'Event details',
  }
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const eventId = parseInt(id, 10)
  
  // Check mock events first, then client will look in localStorage for dynamic events
  const event = mockEvents.find((e) => e.id === eventId)

  return <EventDetailsClient event={event || null} eventId={eventId} />
}
