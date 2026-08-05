'use client'

import { useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'

interface SignInModalProps {
  isOpen: boolean
  onClose: () => void
  onRegisterClick: () => void
}

export default function SignInModal({ isOpen, onClose, onRegisterClick }: SignInModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Extract name from email (first part before @)
      const name = email.split('@')[0]
      const userData = {
        name,
        email,
        balance: 0, // Default balance for new users
        lastLogin: new Date().toISOString(),
      }
      localStorage.setItem('alebiletUser', JSON.stringify(userData))
      // Trigger a storage event to notify other components
      window.dispatchEvent(new Event('userLoggedIn'))
      onClose()
    }, 1000)
  }

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked')
    // Implement Google OAuth here
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition"
        >
          <X size={24} className="text-gray-600" />
        </button>

        {/* Modal content */}
        <div className="p-8">
          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-[#00aeef] mb-8">
            Witaj w AleBilet
          </h1>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email field */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Adres email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@applicant.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent transition"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">Hasło</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aeef] focus:border-transparent transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#e54bad] text-white font-bold rounded-lg hover:bg-opacity-90 transition disabled:opacity-70 mt-6"
            >
              {isLoading ? 'Logowanie...' : 'Zaloguj się'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="text-gray-500 text-sm">lub</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
            >
              <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="20">
                G
              </text>
            </svg>
            Zaloguj się przez Google
          </button>

          {/* Register link */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Nie masz konta?{' '}
            <button
              onClick={onRegisterClick}
              className="text-[#00aeef] font-semibold hover:underline transition"
            >
              Zarejestruj się
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
