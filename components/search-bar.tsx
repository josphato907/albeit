'use client'

import { useState } from 'react'
import { SearchIcon, MapPinIcon, CalendarIcon } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string, category: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')

  const categories = ['All', 'Music', 'Theatre', 'Sports', 'Entertainment']

  const handleSearch = () => {
    onSearch(query, category === 'All' ? '' : category)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="mb-12">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#00aeef] to-[#e54bad] rounded-xl p-8 md:p-12 text-white mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Buy and sell tickets safely</h1>
        <p className="text-blue-100 mb-6">Ticket authenticity and secure payment guaranteed. Sellers receive payment only after the event.</p>

        {/* Search Input */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-3 top-3 text-white opacity-70" size={20} />
            <input
              type="text"
              placeholder="Search events, artists, venues..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-white bg-opacity-90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-white text-[#00aeef] font-semibold rounded-lg hover:bg-opacity-90 transition"
          >
            Search
          </button>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-2">
          <MapPinIcon className="text-white opacity-70" size={18} />
          <span className="text-sm opacity-90">All cities</span>
          <span className="opacity-50">•</span>
          <CalendarIcon className="text-white opacity-70" size={18} />
          <span className="text-sm opacity-90">All dates</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat)
              onSearch(query, cat === 'All' ? '' : cat)
            }}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
              category === cat || (!category && cat === 'All')
                ? 'bg-[#00aeef] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
