'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import SignInModal from './signin-modal'
import SignUpModal from './signup-modal'

interface UserData {
  name: string
  email: string
  balance: number
}

export default function Header() {
  const [isSignInOpen, setIsSignInOpen] = useState(false)
  const [isSignUpOpen, setIsSignUpOpen] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)

  useEffect(() => {
    // Check if user is logged in on component mount
    const storedUser = localStorage.getItem('alebiletUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // Listen for login events
    const handleUserLoggedIn = () => {
      const storedUser = localStorage.getItem('alebiletUser')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }

    window.addEventListener('userLoggedIn', handleUserLoggedIn)
    return () => window.removeEventListener('userLoggedIn', handleUserLoggedIn)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('alebiletUser')
    setUser(null)
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <style>{`
              .logo-container {
                cursor: pointer;
                font-size: 20px;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 6px;
                color: #00aeef;
              }
              .logo-container .ticket-emoji {
                font-size: 24px;
              }
              .logo-dot {
                color: #e54bad;
              }
            `}</style>
            <div className="logo-container">
              <span className="ticket-emoji">🎟</span>
              AleBilet<span className="logo-dot">.pl</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="#" className="text-gray-600 hover:text-gray-900 font-medium transition">
              Eventy
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 font-medium transition">
              Moje Bilety
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 font-medium transition">
              O Nas
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{user.name}</p>
                    <p className="text-xs text-[#00aeef] font-semibold">{user.balance.toFixed(2)} zł</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition border border-gray-300"
                >
                  Wyloguj się
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsSignInOpen(true)}
                  className="px-4 py-2 text-[#00aeef] font-semibold hover:bg-blue-50 rounded-lg transition"
                >
                  Zaloguj się
                </button>
                <button
                  onClick={() => setIsSignUpOpen(true)}
                  className="px-4 py-2 bg-[#00aeef] text-white font-semibold rounded-lg hover:bg-opacity-90 transition"
                >
                  Zarejestruj się
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onRegisterClick={() => {
          setIsSignInOpen(false)
          setIsSignUpOpen(true)
        }}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSignInClick={() => {
          setIsSignUpOpen(false)
          setIsSignInOpen(true)
        }}
      />
    </>
  )
}
