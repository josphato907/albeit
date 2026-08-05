'use client'

import { useState, useEffect } from 'react'
import { Save, X } from 'lucide-react'

export default function AdminPaymentSettings() {
  const [showSettings, setShowSettings] = useState(false)
  const [blikDetails, setBlikDetails] = useState({
    name: 'BLIK',
    blikNumber: '+48234167876',
    accountRef: 'telephone_Transfer-V4NR7P',
  })
  const [revolutDetails, setRevolutDetails] = useState({
    accountHolder: '',
    accountNumber: '',
    routingCode: '',
    iban: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  useEffect(() => {
    // Load payment details from localStorage
    const stored = localStorage.getItem('alebiletPaymentMethods')
    if (stored) {
      try {
        const methods = JSON.parse(stored)
        if (methods.blik) setBlikDetails(methods.blik)
        if (methods.revolut) setRevolutDetails(methods.revolut)
      } catch (e) {
        console.log('[v0] Error loading payment methods:', e)
      }
    }
  }, [])

  const handleSavePaymentMethods = async () => {
    try {
      setIsSaving(true)
      const paymentMethods = {
        blik: blikDetails,
        revolut: revolutDetails,
      }
      localStorage.setItem('alebiletPaymentMethods', JSON.stringify(paymentMethods))
      setSaveMessage('Payment methods saved successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('[v0] Error saving payment methods:', error)
      setSaveMessage('Error saving payment methods')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="mb-8">
      <button
        onClick={() => setShowSettings(!showSettings)}
        className="px-4 py-2 bg-[#00aeef] text-white font-semibold rounded-lg hover:bg-opacity-90 transition"
      >
        {showSettings ? 'Hide Payment Settings' : 'Payment Method Settings'}
      </button>

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>

            <div className="p-8">
              <h1 className="text-3xl font-bold text-[#00aeef] mb-8">Payment Method Settings</h1>

              {saveMessage && (
                <div className={`p-4 rounded-lg mb-6 ${saveMessage.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {saveMessage}
                </div>
              )}

              {/* BLIK Settings */}
              <div className="mb-8 border-2 border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#e54bad]">blik</span> Payment Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Name</label>
                    <input
                      type="text"
                      value={blikDetails.name}
                      onChange={(e) => setBlikDetails({ ...blikDetails, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#e54bad]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">BLIK Number</label>
                    <input
                      type="text"
                      value={blikDetails.blikNumber}
                      onChange={(e) => setBlikDetails({ ...blikDetails, blikNumber: e.target.value })}
                      placeholder="e.g., +48234167876"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#e54bad]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Reference</label>
                    <input
                      type="text"
                      value={blikDetails.accountRef}
                      onChange={(e) => setBlikDetails({ ...blikDetails, accountRef: e.target.value })}
                      placeholder="e.g., telephone_Transfer-V4NR7P"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#e54bad]"
                    />
                  </div>
                </div>
              </div>

              {/* Revolut Settings */}
              <div className="mb-8 border-2 border-gray-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#00D6FF]">R</span> Revolut Payment Details
                </h2>
                <p className="text-sm text-gray-600 mb-4">Enter your Revolut account details below. Leave blank to disable Revolut payments.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                    <input
                      type="text"
                      value={revolutDetails.accountHolder}
                      onChange={(e) => setRevolutDetails({ ...revolutDetails, accountHolder: e.target.value })}
                      placeholder="e.g., John Doe"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                    <input
                      type="text"
                      value={revolutDetails.accountNumber}
                      onChange={(e) => setRevolutDetails({ ...revolutDetails, accountNumber: e.target.value })}
                      placeholder="e.g., 1234567890"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Routing/Sort Code</label>
                    <input
                      type="text"
                      value={revolutDetails.routingCode}
                      onChange={(e) => setRevolutDetails({ ...revolutDetails, routingCode: e.target.value })}
                      placeholder="e.g., 083600"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IBAN</label>
                    <input
                      type="text"
                      value={revolutDetails.iban}
                      onChange={(e) => setRevolutDetails({ ...revolutDetails, iban: e.target.value })}
                      placeholder="e.g., GB12REVO12345678901234"
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowSettings(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePaymentMethods}
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-[#00aeef] text-white font-semibold rounded-lg hover:bg-opacity-90 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  {isSaving ? 'Saving...' : 'Save Payment Methods'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
