import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white mt-16 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#00aeef] to-[#e54bad] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎟</span>
              </div>
              <span className="text-xl font-bold">AleBilet</span>
            </div>
            <p className="text-gray-400 text-sm">
              Discover and book tickets for concerts, theater, sports events and more across Poland.
            </p>
          </div>

          {/* Browse Section */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Przeglądaj</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-[#00aeef] transition">
                  Koncerty
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#00aeef] transition">
                  Teatr
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#00aeef] transition">
                  Sport
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#00aeef] transition">
                  Rozrywka
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Pomoc</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-[#00aeef] transition">
                  Często Zadawane Pytania
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#00aeef] transition">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#00aeef] transition">
                  Bezpieczeństwo
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-[#00aeef] transition">
                  Warunki użytkowania
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Kontakt</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-[#00aeef]">📧</span>
                <a href="mailto:support@alebilet.pl" className="hover:text-[#00aeef] transition">
                  support@alebilet.pl
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#00aeef]">📱</span>
                <a href="tel:+48123456789" className="hover:text-[#00aeef] transition">
                  +48 123 456 789
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#00aeef]">📍</span>
                <span>Warsaw, Poland</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 pt-8">
          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-6">
            <Link href="#" className="text-gray-400 hover:text-[#00aeef] transition text-lg">
              Facebook
            </Link>
            <Link href="#" className="text-gray-400 hover:text-[#00aeef] transition text-lg">
              Instagram
            </Link>
            <Link href="#" className="text-gray-400 hover:text-[#00aeef] transition text-lg">
              Twitter
            </Link>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 border-t border-neutral-800 pt-8">
            <p>&copy; 2024 AleBilet. Wszystkie prawa zastrzeżone.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-[#00aeef] transition">
                Polityka prywatności
              </Link>
              <Link href="#" className="hover:text-[#00aeef] transition">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
