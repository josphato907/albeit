'use client'

import { useState } from 'react'
import Link from 'next/link'
import SignInModal from './signin-modal'

export default function Header() {
  const [isSignInOpen, setIsSignInOpen] = useState(false)

  const handleRegisterClick = () => {
    setIsSignInOpen(false)
    // In a real app, you'd navigate to registration or open a register modal
    console.log('Navigate to registration')
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00aeef] to-[#e54bad] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🎟</span>
            </div>
            <span className="text-xl font-bold text-gray-900">AleBilet</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#" className="text-gray-600 hover:text-gray-900 font-medium transition">
              Events
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 font-medium transition">
              My Tickets
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 font-medium transition">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSignInOpen(true)}
              className="px-4 py-2 text-[#00aeef] font-semibold hover:bg-blue-50 rounded-lg transition"
            >
              Sign In
            </button>
            <button className="px-4 py-2 bg-[#00aeef] text-white font-semibold rounded-lg hover:bg-opacity-90 transition">
              Sign Up
            </button>
          </div>
        </div>
      </header>
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onRegisterClick={handleRegisterClick}
      />
    </>
  )
}
