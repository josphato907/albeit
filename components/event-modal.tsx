'use client'

import { useState } from 'react'
import { X, CalendarIcon, MapPinIcon, UsersIcon, ShoppingCartIcon } from 'lucide-react'

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

interface EventModalProps {
  event: Event
  onClose: () => void
}

export default function EventModal({ event, onClose }: EventModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [step, setStep] = useState<'details' | 'checkout'>('details')

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pl-PL', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  const handleAddToCart = () => {
    setStep('checkout')
  }

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackgroundClick}
    >
      <div className="bg-white rounded-lg max-w-2xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="relative h-64 overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition"
          >
            <X size={24} />
          </button>
          <div className="absolute top-4 left-4 bg-[#e54bad] text-white px-3 py-1 rounded-full text-sm font-semibold">
            {event.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {step === 'details' ? (
            <>
              {/* Event Title and Artist */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{event.artist}</p>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
                <div className="flex gap-3">
                  <CalendarIcon className="text-[#00aeef] flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(event.date)} at {event.time}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPinIcon className="text-[#00aeef] flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">{event.location}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <UsersIcon className="text-[#00aeef] flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Available</p>
                    <p className="font-semibold text-gray-900">{event.available} tickets</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="text-2xl font-bold text-[#00aeef] flex-shrink-0">{event.price} zł</div>
                  <div>
                    <p className="text-sm text-gray-600">Price per ticket</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-2">About This Event</h2>
                <p className="text-gray-600 leading-relaxed">{event.description}</p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-gray-700 font-semibold">Number of Tickets:</span>
                <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(event.available, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-[#00aeef] text-white font-bold rounded-lg hover:bg-opacity-90 transition flex items-center justify-center gap-2 text-lg"
              >
                <ShoppingCartIcon size={20} />
                Continue to Checkout - {event.price * quantity} zł
              </button>
            </>
          ) : (
            <>
              {/* Checkout */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">{event.title}</span>
                  <span className="font-semibold">{event.price} zł</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm mb-4 pb-4 border-b border-gray-200">
                  <span>Quantity: {quantity}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-[#00aeef]">{event.price * quantity} zł</span>
                </div>
              </div>

              {/* Payment Options */}
              <div className="space-y-3 mb-6">
                <label className="flex items-center p-3 border-2 border-[#00aeef] rounded-lg cursor-pointer bg-blue-50">
                  <input type="radio" name="payment" defaultChecked className="mr-3" />
                  <span className="font-semibold text-gray-900">BLIK</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                  <input type="radio" name="payment" className="mr-3" />
                  <span className="font-semibold text-gray-900">Credit Card</span>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                  <input type="radio" name="payment" className="mr-3" />
                  <span className="font-semibold text-gray-900">Bank Transfer</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('details')}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-900 font-bold rounded-lg hover:border-gray-400 transition"
                >
                  Back
                </button>
                <button className="flex-1 py-3 bg-[#e54bad] text-white font-bold rounded-lg hover:bg-opacity-90 transition">
                  Pay Now
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
