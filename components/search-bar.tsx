'use client'

import { useState } from 'react'
import { SearchIcon, MapPinIcon, CalendarIcon } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string, category: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')

  const categories = ['Wszystko', 'Muzyka', 'Teatr', 'Sport', 'Rozrywka']

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
      <div className="bg-[#0099CC] p-8 md:p-12 text-white mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Kupuj i sprzedawaj bilety bezpiecznie</h1>
        <p className="text-white opacity-95 mb-6">Autentyczność biletów i bezpiecznej płatności gwarantowane. Sprzedawca otrzymuje zapłatę dopiero po imprezie.</p>

        {/* Search Input */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Szukaj artysty, wydarzenia lub miasta..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-8 py-3 bg-[#E54BAD] text-white font-semibold rounded-full hover:bg-opacity-90 transition whitespace-nowrap"
          >
            Szukaj
          </button>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-4 text-sm text-white opacity-90">
          <div className="flex items-center gap-2">
            <MapPinIcon size={16} />
            <span>Wszystkie miasta</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} />
            <span>Wszystkie daty</span>
          </div>
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
