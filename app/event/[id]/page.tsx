'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, ShieldCheckIcon, TicketIcon } from 'lucide-react'
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

interface TicketOffer {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  verified: boolean
}

// Mock events data
const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Metallica Live Concert',
    artist: 'Metallica',
    date: '2024-12-15',
    time: '19:00',
    location: 'National Stadium',
    category: 'Music',
    price: 519,
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
    price: 360,
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
    price: 400,
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
    price: 799,
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
    price: 240,
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
    price: 200,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=400&fit=crop',
    description: 'Laugh out loud with the funniest comedians in town.',
    available: 300,
  },
]

export default function EventDetailsPage() {
  const params = useParams()
  const [event, setEvent] = useState<Event | null>(null)
  const [user, setUser] = useState<{ name: string; balance: number } | null>(null)
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const getTicketOffers = (event: Event): TicketOffer[] => {
    const basePrice = [519, 360, 400, 799, 240, 200][event.id - 1] || 300
    return [
      {
        id: 'standard',
        name: 'Standing (Piate)',
        description: 'Row: CAT I Sect: General Admission',
        price: Math.floor(basePrice * 0.7),
        quantity: 1,
        verified: true,
      },
      {
        id: 'seated',
        name: 'Seated (Stand 8)',
        description: 'Row: 14 Seat: 1-10',
        price: Math.floor(basePrice * 0.9),
        quantity: 1,
        verified: true,
      },
    ]
  }

  useEffect(() => {
    if (!params?.id) {
      setIsLoading(false)
      return
    }
    
    const eventId = parseInt(params.id as string, 10)
    // Find event by ID from local mock data
    const foundEvent = mockEvents.find((e) => e.id === eventId)
    if (foundEvent) {
      setEvent(foundEvent)
      // Initialize quantities
      const initialQuantities: { [key: string]: number } = {}
      getTicketOffers(foundEvent).forEach((offer) => {
        initialQuantities[offer.id] = 1
      })
      setQuantities(initialQuantities)
    }

    // Get user data from localStorage
    const storedUser = localStorage.getItem('alebiletUser')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
    }
    
    setIsLoading(false)
  }, [params?.id])

  const handleQuantityChange = (offerId: string, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [offerId]: Math.max(1, (prev[offerId] || 1) + change),
    }))
  }

  const handleBuyNow = (offerId: string) => {
    if (!user) {
      alert('Please sign in to purchase tickets')
      return
    }
    const offer = getTicketOffers(event!).find((o) => o.id === offerId)
    if (!offer) return

    const totalPrice = offer.price * (quantities[offerId] || 1)
    if (user.balance < totalPrice) {
      alert(`Insufficient balance. You need ${totalPrice} zł but only have ${user.balance} zł`)
      return
    }

    // Update balance in localStorage
    const newBalance = user.balance - totalPrice
    const updatedUser = { ...user, balance: newBalance }
    localStorage.setItem('alebiletUser', JSON.stringify(updatedUser))
    setUser(updatedUser)
    window.dispatchEvent(new Event('userLoggedIn'))
    
    // Show success message
    setPurchaseSuccess(true)
    setTimeout(() => setPurchaseSuccess(false), 3000)
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Loading event...</p>
        </div>
        <Footer />
      </>
    )
  }

  if (!event) {
    return (
      <>
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-gray-500">Event not found</p>
        </div>
        <Footer />
      </>
    )
  }

  const ticketOffers = getTicketOffers(event)

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen flex flex-col">
        <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-grow">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#00aeef] font-semibold mb-6 hover:underline"
          >
            <ArrowLeft size={20} />
            Back to Events
          </Link>

          {/* Loading State */}
          {!event ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg font-semibold">Event not found</p>
              <p className="text-gray-400 mt-2">The event you are looking for does not exist.</p>
            </div>
          ) : (
            <>
              {/* Success Notification */}
              {purchaseSuccess && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span className="font-semibold">Purchase successful! Your balance has been updated.</span>
                </div>
              )}

              {/* Event Header */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Event Image */}
              <div className="md:col-span-1">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              {/* Event Info */}
              <div className="md:col-span-2">
                <span className="inline-block bg-[#00aeef] text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
                  {event.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>

                <div className="space-y-2 text-gray-600 mb-4">
                  <p>
                    <span className="font-semibold">Date:</span> {event.date} {event.time}
                  </p>
                  <p>
                    <span className="font-semibold">Location:</span> {event.location}
                  </p>
                  <p>
                    <span className="font-semibold">Artist:</span> {event.artist}
                  </p>
                </div>

                {user && (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">{user.name}</span> ({user.balance} zł)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Ticket Offers */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-[#00aeef]">
                  Ticket offers available
                </h2>

                <div className="space-y-4">
                  {ticketOffers.map((offer) => (
                    <div key={offer.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        {/* Ticket Info */}
                        <div className="md:col-span-2">
                          <h3 className="text-lg font-bold text-[#00aeef] mb-1">{offer.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                          {offer.verified && (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <span className="inline-block w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                                ✓
                              </span>
                              <span>Verified e-ticket (PDF)</span>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="text-center md:text-right">
                          <p className="text-sm text-gray-600 mb-1">Price</p>
                          <p className="text-2xl font-bold text-[#00aeef]">{offer.price} PLN</p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-right">
                            <p className="text-xs text-gray-600">Quantity</p>
                            <div className="flex items-center border border-gray-300 rounded-lg mt-1">
                              <button
                                onClick={() => handleQuantityChange(offer.id, -1)}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100 font-semibold"
                              >
                                −
                              </button>
                              <span className="px-3 py-1 font-semibold">{quantities[offer.id] || 1}</span>
                              <button
                                onClick={() => handleQuantityChange(offer.id, 1)}
                                className="px-2 py-1 text-gray-600 hover:bg-gray-100 font-semibold"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => handleBuyNow(offer.id)}
                            className="px-6 py-2 bg-[#e54bad] text-white font-bold rounded-lg hover:bg-opacity-90 transition whitespace-nowrap"
                          >
                            Buy now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Event Details Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Event details</h3>

                <p className="text-sm text-gray-600 mb-4">{event.details}</p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <ShieldCheckIcon size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                    <div className="text-xs text-gray-700">
                      <p className="font-semibold mb-1">AleBilet Security</p>
                      <p>
                        When you buy from this auction, you&apos;re protected by the Ticket Guarantee Program. Your ticket
                        will be downloaded directly from the system.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
