'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheckIcon } from 'lucide-react'
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

interface EventDetailsClientProps {
  event: Event | undefined
}

export default function EventDetailsClient({ event }: EventDetailsClientProps) {
  const [user, setUser] = useState<{ name: string; balance: number } | null>(null)
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('alebiletUser')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
    }
  }, [])

  const getTicketOffers = (evt: Event): TicketOffer[] => {
    const basePrice = [519, 360, 400, 799, 240, 200][evt.id - 1] || 300
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
    if (!event) return

    const offer = getTicketOffers(event).find((o) => o.id === offerId)
    if (!offer) return

    const totalPrice = offer.price * (quantities[offerId] || 1)
    if (user.balance < totalPrice) {
      alert(`Insufficient balance. You need ${totalPrice} zł but only have ${user.balance} zł`)
      return
    }

    const newBalance = user.balance - totalPrice
    const updatedUser = { ...user, balance: newBalance }
    localStorage.setItem('alebiletUser', JSON.stringify(updatedUser))
    setUser(updatedUser)
    window.dispatchEvent(new Event('userLoggedIn'))
    
    setPurchaseSuccess(true)
    setTimeout(() => setPurchaseSuccess(false), 3000)
  }

  if (!event) {
    return (
      <>
        <Header />
        <main className="flex-grow flex items-center justify-center bg-gray-50 min-h-screen">
          <div className="text-center">
            <p className="text-gray-500 text-lg">Event not found</p>
            <Link href="/" className="text-[#00aeef] hover:underline mt-2 inline-block">
              Back to Events
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const offers = getTicketOffers(event)

  return (
    <>
      <Header />
      <main className="bg-gray-50 min-h-screen flex flex-col">
        <div className="max-w-7xl mx-auto px-4 py-6 w-full flex-grow">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#00aeef] font-semibold mb-6 hover:underline"
          >
            <ArrowLeft size={20} />
            Back to Events
          </Link>

          {purchaseSuccess && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
              <span className="text-lg">✓</span>
              <span className="font-semibold">Purchase successful! Your balance has been updated.</span>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <span className="inline-block bg-[#00aeef] text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
                  {event.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                <p className="text-gray-600 mb-4">{event.artist}</p>

                <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    <span>{event.date}, {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📍</span>
                    <span>{event.location}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{event.description}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-[#00aeef] mb-4 flex items-center gap-2">
                <span className="text-3xl">🎫</span>
                Ticket offers available
              </h2>

              <div className="space-y-4">
                {offers.map((offer) => (
                  <div key={offer.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                      <div className="md:col-span-2">
                        <h3 className="text-lg font-bold text-[#00aeef] mb-1">{offer.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{offer.description}</p>
                        {offer.verified && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <span className="inline-block w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">✓</span>
                            <span>Verified e-ticket (PDF)</span>
                          </div>
                        )}
                      </div>

                      <div className="text-center md:text-right">
                        <p className="text-sm text-gray-600 mb-1">Price</p>
                        <p className="text-2xl font-bold text-[#00aeef]">{offer.price * (quantities[offer.id] || 1)} PLN</p>
                      </div>

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

            <div className="lg:col-span-1">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-bold text-[#00aeef] mb-4 flex items-center gap-2">
                  <ShieldCheckIcon size={20} />
                  AleBilet Security
                </h3>
                <p className="text-sm text-gray-700">
                  When you buy from this auction, you&apos;re protected by the Ticket Guarantee Program. You&apos;ll receive your exact seats, and your ticket will be downloaded directly from the system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
