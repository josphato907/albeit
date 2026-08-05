'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X } from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'

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

export default function AdminPanel() {
  const [events, setEvents] = useState<Event[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    artist: '',
    date: '',
    time: '',
    location: '',
    category: 'Music',
    price: 0,
    image: '',
    description: '',
    available: 0,
  })

  // Load events from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('alebiletEvents')
    if (stored) {
      setEvents(JSON.parse(stored))
    } else {
      // Load from API initially
      fetchEvents()
    }
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data)
      localStorage.setItem('alebiletEvents', JSON.stringify(data))
    } catch (error) {
      console.error('[v0] Error fetching events:', error)
    }
  }

  const saveEvents = (updatedEvents: Event[]) => {
    setEvents(updatedEvents)
    localStorage.setItem('alebiletEvents', JSON.stringify(updatedEvents))
  }

  const handleAddEvent = () => {
    setEditingId(null)
    setFormData({
      title: '',
      artist: '',
      date: '',
      time: '',
      location: '',
      category: 'Music',
      price: 0,
      image: '',
      description: '',
      available: 0,
    })
    setShowForm(true)
  }

  const handleEditEvent = (event: Event) => {
    setEditingId(event.id)
    setFormData(event)
    setShowForm(true)
  }

  const handleDeleteEvent = (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const updated = events.filter((e) => e.id !== id)
      saveEvents(updated)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.title ||
      !formData.date ||
      !formData.time ||
      !formData.location ||
      !formData.price
    ) {
      alert('Please fill in all required fields')
      return
    }

    if (editingId) {
      // Edit existing event
      const updated = events.map((e) =>
        e.id === editingId ? { ...e, ...formData } : e
      )
      saveEvents(updated)
    } else {
      // Add new event
      const newEvent: Event = {
        id: Math.max(0, ...events.map((e) => e.id)) + 1,
        title: formData.title || '',
        artist: formData.artist || '',
        date: formData.date || '',
        time: formData.time || '',
        location: formData.location || '',
        category: formData.category || 'Music',
        price: formData.price || 0,
        image: formData.image || '',
        description: formData.description || '',
        available: formData.available || 0,
      }
      saveEvents([...events, newEvent])
    }

    setShowForm(false)
    setEditingId(null)
  }

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen flex flex-col">
        <div className="flex-1 container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Event Management</h1>
            <button
              onClick={handleAddEvent}
              className="flex items-center gap-2 px-6 py-3 bg-[#e54bad] text-white font-semibold rounded-lg hover:bg-opacity-90 transition"
            >
              <Plus size={20} />
              Add New Event
            </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Form Close Button */}
                <div className="sticky top-0 flex items-center justify-between p-6 border-b bg-white">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingId ? 'Edit Event' : 'Add New Event'}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Event Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Name *
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Enter event name"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00aeef]"
                      required
                    />
                  </div>

                  {/* Artist */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Artist/Organizer
                    </label>
                    <input
                      type="text"
                      value={formData.artist || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, artist: e.target.value })
                      }
                      placeholder="Enter artist or organizer name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00aeef]"
                    />
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={formData.date || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00aeef]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Time *
                      </label>
                      <input
                        type="time"
                        value={formData.time || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, time: e.target.value })
                        }
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00aeef]"
                        required
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Venue/Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="Enter venue or location"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00aeef]"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category || 'Music'}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00aeef]"
                    >
                      <option value="Music">Music</option>
                      <option value="Theatre">Theatre</option>
                      <option value="Sports">Sports</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Comedy">Comedy</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ticket Price (PLN) *
                    </label>
                    <input
                      type="number"
                      value={formData.price || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="Enter ticket price"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00aeef]"
                      required
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00aeef]"
                    />
                    {formData.image && (
                      <div className="mt-3 w-full h-40 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={formData.image}
                          alt="Event preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src =
                              'https://via.placeholder.com/400x300?text=Image+Error'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Available Tickets */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Available Tickets
                    </label>
                    <input
                      type="number"
                      value={formData.available || 0}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          available: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="Enter number of available tickets"
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00aeef]"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Enter event description"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#00aeef]"
                    />
                  </div>

                  {/* Form Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-[#00aeef] text-white font-semibold rounded-lg hover:bg-opacity-90 transition"
                    >
                      {editingId ? 'Update Event' : 'Add Event'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Events List */}
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No events found. Add your first event!</p>
              </div>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md p-6 flex gap-6 items-start"
                >
                  {/* Event Image */}
                  <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/300?text=Image+Error'
                      }}
                    />
                  </div>

                  {/* Event Details */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-semibold">Artist:</span> {event.artist || 'N/A'}
                      </p>
                      <p>
                        <span className="font-semibold">Date:</span> {event.date} at{' '}
                        {event.time}
                      </p>
                      <p>
                        <span className="font-semibold">Location:</span> {event.location}
                      </p>
                      <p>
                        <span className="font-semibold">Category:</span> {event.category}
                      </p>
                      <p>
                        <span className="font-semibold">Price:</span> {event.price} PLN
                      </p>
                      <p>
                        <span className="font-semibold">Available:</span> {event.available}{' '}
                        tickets
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                    >
                      <Edit2 size={18} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
