import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useCatalogView } from '@/context/CatalogViewContext'
import { addToCart } from '@/store/cart'
import { getTelegramOrderUrl } from '@/api/client'
import type { ProductListItem } from '@/types'

interface ProductCardProps {
  product: ProductListItem
  index?: number
  layout?: boolean
}

export function ProductCard({ product, index = 0, layout }: ProductCardProps) {
  const { t, i18n } = useTranslation()
  const { view } = useCatalogView()
  const lang = (i18n.language || 'ru') as 'ru' | 'uz' | 'en'
  const name = product[`name_${lang}`] ?? product.name_ru
  const price = parseFloat(product.price)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      slug: product.slug,
      name,
      price,
      image: product.main_image,
    })
  }

  const handleOrderTelegram = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = await getTelegramOrderUrl({
      product: product.slug,
      qty: 1,
      lang,
    })
    window.open(url, '_blank')
  }

  const content = (
    <>
      <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
        {product.main_image ? (
          <motion.img
            src={product.main_image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            layout={layout}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">—</div>
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 dark:bg-black/40">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleAddToCart}
            disabled={!product.in_stock}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('addToCart')}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleOrderTelegram}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium text-sm shadow-lg hover:bg-indigo-500"
          >
            {t('orderInTelegram')}
          </motion.button>
        </div>
      </div>
      <div className={view === 'compact' ? 'p-3' : 'p-4'}>
        <h3 className={`font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors ${view === 'compact' ? 'text-sm' : ''}`}>
          {name}
        </h3>
        <p className={`mt-1 font-medium text-gray-600 dark:text-gray-400 ${view === 'compact' ? 'text-xs' : 'text-sm'}`}>
          {price.toLocaleString()} сум
        </p>
        {!product.in_stock && (
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">{t('outOfStock')}</p>
        )}
      </div>
    </>
  )

  if (view === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        layout={layout}
      >
        <Link to={`/product/${product.slug}`} className="group block">
          <motion.div
            whileHover={{ y: -2 }}
            className="rounded-xl overflow-hidden bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 shadow-soft dark:shadow-soft-dark hover:shadow-soft-dark dark:hover:shadow-glow-dark transition-all duration-300 flex flex-col"
          >
            {content}
          </motion.div>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      layout={layout}
    >
      <Link to={`/product/${product.slug}`} className="group block">
        <motion.div
          whileHover={{ y: -4 }}
          className="rounded-2xl overflow-hidden bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 shadow-soft dark:shadow-soft-dark hover:shadow-soft-dark dark:hover:shadow-glow-dark transition-all duration-300"
        >
          {content}
        </motion.div>
      </Link>
    </motion.div>
  )
}
