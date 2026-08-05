import { Metadata } from 'next'
import EventDetailsClient from '@/components/event-details-client'
import { mockEvents } from '@/lib/events'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const eventId = parseInt(id, 10)
  const event = mockEvents.find((e) => e.id === eventId)
  
  return {
    title: event ? `${event.title} | AleBilet` : 'Event Not Found | AleBilet',
    description: event ? event.description : 'Event not found',
  }
}

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const eventId = parseInt(id, 10)
  const event = mockEvents.find((e) => e.id === eventId)

  return <EventDetailsClient event={event} />
}
