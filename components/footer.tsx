'use client'

import Link from 'next/link'
import { CalendarIcon, MapPinIcon } from 'lucide-react'

export default function Footer() {
  const featuredEvents = [
    {
      category: 'FESTIVALS',
      categoryColor: 'text-[#00aeef]',
      title: 'Sunrise Festival 2026',
      date: '24/07/2026',
      location: 'Podzele Airport, Kołobrzeg',
    },
    {
      category: 'THEATER',
      categoryColor: 'text-[#e54bad]',
      title: 'Krzysztof Materna - Good evening to all',
      date: '20/11/2026',
      location: 'Capitol Musical Theatre, Wroclaw',
    },
    {
      category: 'CONCERTS',
      categoryColor: 'text-[#00aeef]',
      title: 'rtert',
      date: '5/08/2026',
      location: 'PGE, Warsaw',
    },
  ]

  return (
    <footer className="bg-white mt-16">
      {/* How it works section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#00aeef] mb-2">Jak to działa?</h2>
          <div className="w-12 h-1 bg-[#e54bad] mb-8"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-[#00aeef] mb-3">Dla kupujących</h3>
              <p className="text-gray-600 text-sm">
                Otrzymasz ważne bilety na czas lub zwrot pieniędzy. Płatność jest zwalniana sprzedawcy dopiero po imprezie.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-bold text-[#e54bad] mb-3">Dla sprzedawców</h3>
              <p className="text-gray-600 text-sm">
                Wystawiaj bilety bezpłatnie. Przesyłaj pliki PDF i otrzymuj płatności automatycznie na swoje konto bankowe.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Events Section */}
      <div className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {featuredEvents.map((event, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <p className={`text-xs font-bold ${event.categoryColor} mb-2`}>{event.category}</p>
                <h4 className="font-semibold text-gray-900 mb-3">{event.title}</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={16} className="text-gray-400" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon size={16} className="text-gray-400" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dark Footer */}
      <div className="bg-gray-900 text-white pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
            {/* About Section */}
            <div>
              <h3 className="font-bold text-lg mb-4">O nas</h3>
              <p className="text-gray-400 text-sm">
                AleBilet to wiodąca platforma wtórnego rynku biletów w Polsce. Gwarantujemy bezpieczne zakupy i łatwy odsprzedaż niewykorzystanych biletów.
              </p>
            </div>

            {/* Categories Section */}
            <div>
              <h3 className="font-bold text-lg mb-4">Kategorie</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="#" className="hover:text-[#00aeef] transition">
                    Koncerty
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#00aeef] transition">
                    Sport
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#00aeef] transition">
                    Festiwale
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[#00aeef] transition">
                    Teatr
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help and Contact Section */}
            <div>
              <h3 className="font-bold text-lg mb-4">Pomoc i kontakt</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="mailto:pomoc@alebilet.pl" className="hover:text-[#00aeef] transition">
                    Email: pomoc@alebilet.pl
                  </a>
                </li>
                <li>
                  <a href="tel:+48123456789" className="hover:text-[#00aeef] transition">
                    Infolinia: +48 22 123 45 67
                  </a>
                </li>
                <li className="text-gray-500">Pon - Pt: 9:00 - 17:00</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
            <p>&copy; 2026 AleBilet.pl Replica - Created for pair programming demonstration.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
