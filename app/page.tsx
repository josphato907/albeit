'use client'

import { useState } from 'react'
import Header from '@/components/header'
import SearchBar from '@/components/search-bar'
import EventGrid from '@/components/event-grid'
import Footer from '@/components/footer'
import { mockEvents } from '@/lib/events'

export default function Page() {
  const [filteredEvents, setFilteredEvents] = useState(mockEvents)

  const handleSearch = (query: string, category: string) => {
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
