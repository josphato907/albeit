'use client'

import { useState } from 'react'
import Header from '@/components/header'
import SearchBar from '@/components/search-bar'
import EventGrid from '@/components/event-grid'
import EventModal from '@/components/event-modal'

const mockEvents = [
  {
    id: 1,
    title: 'Metallica Live Concert',
    artist: 'Metallica',
    date: '2024-12-15',
    time: '19:00',
    location: 'National Stadium',
    category: 'Music',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=400&fit=crop',
    description: 'Experience the legendary Metallica live on stage with their greatest hits.',
    available: 250,
  },
  {
    id: 2,
    title: 'Shakespeare: Hamlet',
    artist: 'National Theatre',
    date: '2024-12-10',
    time: '19:30',
    location: 'Opera House',
    category: 'Theatre',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1503095396546-bebc2677da3d?w=500&h=400&fit=crop',
    description: 'A classic rendition of Shakespeare\'s most iconic tragedy.',
    available: 180,
  },
  {
    id: 3,
    title: 'Poland vs Spain Football Match',
    artist: 'UEFA Nations League',
    date: '2024-12-12',
    time: '20:45',
    location: 'National Stadium',
    category: 'Sports',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=400&fit=crop',
    description: 'International football match between Poland and Spain.',
    available: 5000,
  },
  {
    id: 4,
    title: 'EDM Festival 2024',
    artist: 'Various Artists',
    date: '2024-12-20',
    time: '22:00',
    location: 'Festival Grounds',
    category: 'Music',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=400&fit=crop',
    description: 'Experience the biggest EDM festival with world-class DJs.',
    available: 1000,
  },
  {
    id: 5,
    title: 'Jazz Nights Series',
    artist: 'Local Jazz Quartet',
    date: '2024-12-18',
    time: '20:00',
    location: 'Jazz Club Downtown',
    category: 'Music',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=500&h=400&fit=crop',
    description: 'An evening of smooth jazz performances.',
    available: 150,
  },
  {
    id: 6,
    title: 'Comedy Night with Stand-up Stars',
    artist: 'Multiple Comedians',
    date: '2024-12-14',
    time: '20:30',
    location: 'Comedy Hall',
    category: 'Entertainment',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=400&fit=crop',
    description: 'Laugh out loud with the funniest comedians in town.',
    available: 300,
  },
]

export default function Page() {
  const [selectedEvent, setSelectedEvent] = useState<typeof mockEvents[0] | null>(null)
  const [filteredEvents, setFilteredEvents] = useState(mockEvents)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query: string, category: string) => {
    setSearchQuery(query)
    let results = mockEvents

    if (query) {
      results = results.filter(
        (event) =>
          event.title.toLowerCase().includes(query.toLowerCase()) ||
          event.artist.toLowerCase().includes(query.toLowerCase())
      )
    }

    if (category) {
      results = results.filter((event) => event.category === category)
    }

    setFilteredEvents(results)
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SearchBar onSearch={handleSearch} />
        <EventGrid events={filteredEvents} onSelectEvent={setSelectedEvent} />
      </div>
      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </main>
  )
}
