import { CalendarIcon, MapPinIcon, UsersIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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
  available: number
}

interface EventGridProps {
  events: Event[]
  onSelectEvent?: (event: Event) => void
}

export default function EventGrid({ events, onSelectEvent }: EventGridProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pl-PL', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Events</h2>
        <span className="text-sm text-gray-600">{events.length} events found</span>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No events found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/event/${event.id}`}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer group block"
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute top-3 right-3 bg-[#e54bad] text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {event.category}
                </div>
                {event.available < 100 && (
                  <div className="absolute bottom-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Only {event.available} left
                  </div>
                )}
              </div>

              {/* Event Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{event.artist}</p>

                {/* Event Details */}
                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={16} className="text-[#00aeef]" />
                    <span>
                      {formatDate(event.date)} at {event.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon size={16} className="text-[#00aeef]" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UsersIcon size={16} className="text-[#00aeef]" />
                    <span>{event.available} tickets available</span>
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-[#00aeef]">
                    {event.price} zł
                  </div>
                  <button className="px-4 py-2 bg-[#00aeef] text-white font-semibold rounded-lg hover:bg-opacity-90 transition text-sm">
                    View Details
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
