'use client'

import { useState } from 'react'
import { X, Upload } from 'lucide-react'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  eventTitle: string
  ticketName: string
  unitPrice: number
  quantity: number
  onConfirmPayment: () => void
}

export default function CheckoutModal({
  isOpen,
  onClose,
  eventTitle,
  ticketName,
  unitPrice,
  quantity,
  onConfirmPayment,
}: CheckoutModalProps) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'blik' | 'card'>('blik')
  const [filePath, setFilePath] = useState<string>('')
  const [cardFullName, setCardFullName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')

  const subtotal = unitPrice * quantity
  const serviceFee = subtotal * 0.03
  const total = subtotal + serviceFee

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          {/* Order Summary */}
          <h1 className="text-3xl font-bold text-[#00aeef] mb-8">Order Summary</h1>

          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-8">
            <div className="space-y-3">
              <div className="text-lg font-semibold text-gray-800">{eventTitle}</div>
              <div className="flex justify-between text-gray-700">
                <span className="text-gray-600">
                  {ticketName} (x {quantity})
                </span>
                <span className="font-semibold">{subtotal.toFixed(2)} PLN</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span className="text-gray-600">Service fee (3%)</span>
                <span className="font-semibold">{serviceFee.toFixed(2)} PLN</span>
              </div>
              <div className="border-t border-green-300 pt-3 flex justify-between text-lg font-bold text-green-700">
                <span>Total to pay</span>
                <span>{total.toFixed(2)} PLN</span>
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aeef]">
              <option value={quantity}>{quantity}</option>
            </select>
          </div>

          {/* Delivery and Contact Details */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#00aeef] mb-4">Delivery and contact details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 border-2 border-[#00aeef] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aeef]"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#00aeef] mb-4">Payment method</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setPaymentMethod('blik')}
                className={`p-4 rounded-lg border-2 transition ${
                  paymentMethod === 'blik'
                    ? 'border-[#00aeef] bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="text-2xl font-bold text-[#e54bad] mb-1">blik</div>
                <div className="text-sm text-gray-700 font-medium">BLIK payment</div>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-lg border-2 transition ${
                  paymentMethod === 'card'
                    ? 'border-[#00aeef] bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="text-2xl mb-1">💳</div>
                <div className="text-sm text-gray-700 font-medium">Payment card</div>
              </button>
            </div>

            {/* BLIK Payment Instructions */}
            {paymentMethod === 'blik' && (
              <div className="bg-gray-900 text-white rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold mb-3">Payment Instructions</h3>
                <div className="text-sm space-y-2 mb-4">
                  <p>1. Make a direct transfer to the following details:</p>
                  <div className="bg-black bg-opacity-50 p-3 rounded text-xs space-y-1 font-mono">
                    <p>Name: BLIk</p>
                    <p>BLIK: +48234167876</p>
                    <p>Account Ref: telephone_Transfer-V4NR7P</p>
                  </div>
                </div>
                <div className="text-lg font-bold text-yellow-400">Amount to be paid: PLN {total.toFixed(2)}</div>
              </div>
            )}

            {/* Card Payment Instructions and Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-6 mb-6">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
                  <p className="text-gray-700 font-medium mb-2">Card Details</p>
                  <p className="text-gray-600 text-sm mb-4">Enter your card information securely</p>
                  
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={cardFullName}
                        onChange={(e) => setCardFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00aeef]"
                      />
                    </div>

                    {/* Card Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, '')
                          if (/^\d*$/.test(value) && value.length <= 16) {
                            const formatted = value.replace(/(\d{4})/g, '$1 ').trim()
                            setCardNumber(formatted)
                          }
                        }}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00aeef] font-mono"
                      />
                    </div>

                    {/* CVV and Expiry */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input
                          type="text"
                          value={cardCvv}
                          onChange={(e) => {
                            const value = e.target.value
                            if (/^\d*$/.test(value) && value.length <= 3) {
                              setCardCvv(value)
                            }
                          }}
                          placeholder="123"
                          maxLength={3}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00aeef] font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '')
                            if (value.length <= 4) {
                              if (value.length <= 2) {
                                setCardExpiry(value)
                              } else {
                                setCardExpiry(`${value.slice(0, 2)}/${value.slice(2, 4)}`)
                              }
                            }
                          }}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00aeef] font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-white rounded border border-blue-200">
                    <p className="text-xs text-gray-600">🔒 Your payment information is secure and encrypted</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-[#00aeef]">Amount to be paid: PLN {total.toFixed(2)}</div>
                </div>
              </div>
            )}

            {/* Send Transfer Information */}
            {paymentMethod === 'blik' && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
                <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-[#00aeef] font-semibold">Send transfer information</p>
                <p className="text-sm text-gray-600">Click to attach a PDF or photo</p>
                <input
                  type="file"
                  className="mt-2"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFilePath(e.target.files[0].name)
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirmPayment}
              className="flex-1 px-6 py-3 bg-[#e54bad] text-white font-semibold rounded-lg hover:bg-opacity-90 transition"
            >
              Confirm payment and order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
