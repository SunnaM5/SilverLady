import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const SUPPORT_URL = 'https://t.me/zxsvgh'

export function SupportPage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-6"
      >
        {t('supportTitle')}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-gray-600 dark:text-gray-400 mb-8"
      >
        {t('supportText')}
      </motion.p>
      <motion.a
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        href={SUPPORT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors shadow-soft dark:shadow-glow-dark"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09-.01-1.56 1-4.4 2.93-.42.29-.8.43-1.14.42-.38-.01-1.1-.21-1.64-.39-.67-.22-1.2-.34-1.15-.72.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
        </svg>
        t.me/zxsvgh
      </motion.a>
    </div>
  )
}
