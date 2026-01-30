import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-6"
      >
        {t('aboutTitle')}
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="prose prose-gray dark:prose-invert max-w-none"
      >
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{t('aboutText')}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
      >
        <p className="text-sm text-gray-700 dark:text-gray-300">{t('deliveryNote')}</p>
      </motion.div>
    </div>
  )
}
