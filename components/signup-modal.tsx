'use client'

import { useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
  onSignInClick: () => void
}

export default function SignUpModal({ isOpen, onClose, onSignInClick }: SignUpModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Imię i nazwisko jest wymagane'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email jest wymagany'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Proszę wprowadzić prawidłowy email'
    }

    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Hasło musi mieć co najmniej 6 znaków'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Numer telefonu jest wymagany'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      const userData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        balance: 0, // New users get initial balance
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem('alebiletUser', JSON.stringify(userData))
      // Trigger a storage event to notify other components
      window.dispatchEvent(new Event('userLoggedIn'))
      setFormData({ fullName: '', email: '', password: '', phone: '' })
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close modal"
          >
            <X size={24} className="text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-[#00aeef] text-center">Witaj w AleBilet</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imię i nazwisko</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="np. Jan Kowalski"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aeef] transition ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Adres e-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="np. nazwa@domena.pl"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aeef] transition ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hasło</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aeef] transition pr-12 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff size={20} className="text-gray-600" />
                ) : (
                  <Eye size={20} className="text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Numer telefonu</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+48 123 456 789"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aeef] transition ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#e54bad] text-white font-bold rounded-lg hover:bg-opacity-90 transition text-lg"
          >
            Zarejestruj się
          </button>
        </form>

        {/* Divider */}
        <div className="px-6 py-2">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">lub</span>
            </div>
          </div>
        </div>

        {/* Google Sign-Up */}
        <div className="px-6 pb-6">
          <button className="w-full py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Kontynuuj z Google
          </button>
        </div>

        {/* Sign In Link */}
        <div className="px-6 pb-6 text-center">
          <p className="text-gray-600 text-sm">
            Masz już konto?{' '}
            <button
              onClick={() => {
                onClose()
                onSignInClick()
              }}
              className="text-[#00aeef] font-semibold hover:underline transition"
            >
              Zaloguj się
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
