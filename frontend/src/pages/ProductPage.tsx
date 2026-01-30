import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getProduct, getProducts, getTelegramOrderUrl } from '@/api/client'
import { addToCart } from '@/store/cart'
import type { ProductDetail, ProductListItem } from '@/types'
import { ProductCard } from '@/components/ProductCard'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [similar, setSimilar] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [mainImageIndex, setMainImageIndex] = useState(0)
  const [qty, setQty] = useState(1)

  const lang = (i18n.language || 'ru') as 'ru' | 'uz' | 'en'

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    getProduct(slug)
      .then((p) => {
        setProduct(p)
        setMainImageIndex(0)
        return getProducts({
          category: p.category_slug,
          sort: 'newest',
        })
      })
      .then((data) => {
        setSimilar(data.results.filter((p) => p.slug !== slug).slice(0, 4))
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-12">{t('catalog')} — not found</p>
        )}
      </div>
    )
  }

  const name = product[`name_${lang}`] ?? product.name_ru
  const description = product[`description_${lang}`] ?? product.description_ru
  const categoryTitle = product[`category_title_${lang}`] ?? product.category_title_ru
  const price = parseFloat(product.price)
  const images = product.images?.length ? product.images : product.main_image ? [{ id: 0, image: product.main_image, is_main: true }] : []
  const mainImage = images[mainImageIndex]?.image ?? product.main_image

  const handleAddToCart = () => {
    addToCart({
      slug: product.slug,
      name,
      price,
      image: product.main_image,
      quantity: qty,
    })
  }

  const handleOrderTelegram = async () => {
    const url = await getTelegramOrderUrl({
      product: product.slug,
      qty,
      lang,
    })
    window.open(url, '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
      >
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            {mainImage ? (
              <img
                src={mainImage}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">—</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => setMainImageIndex(i)}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    mainImageIndex === i
                      ? 'border-indigo-600 dark:border-indigo-400'
                      : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <img src={img.image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <Link
            to={`/catalog?category=${product.category_slug}`}
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {categoryTitle}
          </Link>
          <h1 className="mt-2 text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
            {name}
          </h1>
          <p className="mt-4 text-xl font-medium text-gray-900 dark:text-white">
            {price.toLocaleString()} сум
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {product.in_stock ? t('inStock') : t('outOfStock')}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                −
              </button>
              <span className="px-4 py-2 min-w-[3rem] text-center font-medium text-gray-900 dark:text-white">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                +
              </button>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={!product.in_stock}
              className="px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('addToCart')}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleOrderTelegram}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors shadow-soft dark:shadow-glow-dark"
            >
              {t('orderInTelegram')}
            </motion.button>
          </div>

          {description && (
            <div className="mt-8 prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{description}</p>
            </div>
          )}

          <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">{t('deliveryNote')}</p>
          </div>
        </div>
      </motion.div>

      {similar.length > 0 && (
        <section className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {t('similarProducts')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {similar.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
