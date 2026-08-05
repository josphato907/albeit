'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import SearchBar from '@/components/search-bar'
import EventGrid from '@/components/event-grid'
import Footer from '@/components/footer'
import { mockEvents } from '@/lib/events'

interface Event {
  id: number
  title: string
  artist: string
  date: string
  time: string
  location: string
  category: string
  price: number
  image: string
  description: string
  available: number
}

export default function Page() {
  const [events, setEvents] = useState<Event[]>(mockEvents)
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents)

  useEffect(() => {
    // Load events from localStorage
    const stored = localStorage.getItem('alebiletEvents')
    if (stored) {
      const parsedEvents = JSON.parse(stored)
      setEvents(parsedEvents)
      setFilteredEvents(parsedEvents)
    }
  }, [])

  const handleSearch = (query: string, category: string) => {
    let results = events

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
    <>
      <main className="bg-gray-50 min-h-screen flex flex-col">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 flex-grow">
          <SearchBar onSearch={handleSearch} />
          <EventGrid events={filteredEvents} />
        </div>
      </main>
      <Footer />
    </>
  )
}
