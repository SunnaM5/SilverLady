import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'
import { setStoredLanguage } from '@/i18n'
import { getCartCount, subscribe } from '@/store/cart'
import { useEffect, useState } from 'react'

const LANG_OPTIONS = [
  { code: 'ru', label: 'RU' },
  { code: 'uz', label: 'UZ' },
  { code: 'en', label: 'EN' },
] as const

export function Header() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [cartCount, setCartCount] = useState(getCartCount())
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const unsub = subscribe(() => setCartCount(getCartCount()))
    return unsub
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const setLang = (code: string) => {
    i18n.changeLanguage(code)
    setStoredLanguage(code)
  }

  const supportUrl = 'https://t.me/zxsvgh'

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50 shadow-soft dark:shadow-soft-dark'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <span className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {t('siteName')}
            </span>
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2L9 8h6l-3 6 4-6H9l3-6z" />
            </svg>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {t('home')}
            </Link>
            <Link
              to="/catalog"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {t('catalog')}
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {t('about')}
            </Link>
          </nav>

          <form onSubmit={handleSearch} className="hidden sm:block flex-1 max-w-xs mx-4">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
            />
          </form>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              {LANG_OPTIONS.map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`px-2 py-1.5 text-xs font-medium transition-colors ${
                    i18n.language === code
                      ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                      : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <motion.button
              type="button"
              onClick={toggleTheme}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label={theme === 'light' ? 'Switch to dark' : 'Switch to light'}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </motion.button>

            <a
              href={supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {t('support')}
            </a>

            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-medium">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="sm:hidden pb-3">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 text-sm"
          />
        </form>
      </div>
    </motion.header>
  )
}
