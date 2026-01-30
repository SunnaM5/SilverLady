import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { getCategories, getProducts } from '@/api/client'
import type { Category, ProductListItem } from '@/types'
import { ProductCard } from '@/components/ProductCard'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export function HomePage() {
  const { t, i18n } = useTranslation()
  const [categories, setCategories] = useState<Category[]>([])
  const [featured, setFeatured] = useState<ProductListItem[]>([])

  useEffect(() => {
    getCategories().then(setCategories)
    getProducts({ sort: 'newest' }).then((data) => setFeatured(data.results.slice(0, 8)))
  }, [])

  const lang = (i18n.language || 'ru') as 'ru' | 'uz' | 'en'

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 dark:text-white tracking-tight"
          >
            {t('heroTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-4 text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            {t('heroSubtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-soft dark:shadow-soft-dark"
            >
              {t('catalog')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-8"
            >
              {t('categories')}
            </motion.h2>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
            >
              {categories.map((cat) => {
                const title = cat[`title_${lang}`] ?? cat.title_ru
                return (
                  <motion.div key={cat.slug} variants={item}>
                    <Link
                      to={`/catalog?category=${cat.slug}`}
                      className="block p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-soft dark:hover:shadow-soft-dark transition-all group"
                    >
                      <span className="text-base font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {title}
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="py-16 sm:py-20 bg-gray-50/50 dark:bg-gray-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-8"
            >
              {t('catalog')}
            </motion.h2>
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {featured.map((product, i) => (
                <motion.div key={product.id} variants={item}>
                  <ProductCard product={product} index={i} />
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-10 text-center"
            >
              <Link
                to="/catalog"
                className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                {t('catalog')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-10 text-center"
          >
            {t('advantages')}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 shadow-soft dark:shadow-soft-dark">
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="mt-4 font-medium text-gray-900 dark:text-white">{t('advantage1')}</h3>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 shadow-soft dark:shadow-soft-dark">
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <h3 className="mt-4 font-medium text-gray-900 dark:text-white">{t('advantage2')}</h3>
            </div>
            <div className="text-center p-6 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 shadow-soft dark:shadow-soft-dark">
              <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 font-medium text-gray-900 dark:text-white">{t('advantage3')}</h3>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

