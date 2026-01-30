import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { getCart, setQuantity, removeFromCart, getCartTotal, subscribe } from '@/store/cart'
import type { CartItem } from '@/types'

export function CartPage() {
  const { t, i18n } = useTranslation()
  const [items, setItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)

  const refresh = () => {
    setItems(getCart())
    setTotal(getCartTotal())
  }

  useEffect(() => {
    refresh()
    const unsub = subscribe(refresh)
    return unsub
  }, [])

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{t('emptyCart')}</p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
          >
            {t('goToCatalog')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    )
  }

  const handleCheckout = async () => {
    const lines: string[] = ['🛒 Заказ из корзины SilverLady', '']
    let totalSum = 0
    for (const item of items) {
      const sum = item.price * item.quantity
      totalSum += sum
      lines.push(`${item.name}`)
      lines.push(`Цена: ${item.price.toLocaleString()} сум × ${item.quantity} = ${sum.toLocaleString()} сум`)
      lines.push('')
    }
    lines.push(`Итого: ${totalSum.toLocaleString()} сум`)
    const text = lines.join('\n')
    const url = `https://t.me/zxsvgh?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-8"
      >
        {t('cart')}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <motion.div
              key={item.slug}
              layout
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 shadow-soft dark:shadow-soft-dark"
            >
              <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">—</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.slug}`}
                  className="font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-2"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {item.price.toLocaleString()} сум × {item.quantity} = {(item.price * item.quantity).toLocaleString()} сум
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.slug, item.quantity - 1)}
                      className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                    >
                      −
                    </button>
                    <span className="px-3 py-1 min-w-[2rem] text-center text-sm font-medium text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.slug, item.quantity + 1)}
                      className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.slug)}
                    className="text-sm text-red-600 dark:text-red-400 hover:underline"
                  >
                    {t('remove')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-24 p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('total')}</h2>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {total.toLocaleString()} сум
            </p>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              className="mt-6 w-full px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors shadow-soft dark:shadow-glow-dark"
            >
              {t('checkoutInTelegram')}
            </motion.button>
            <Link
              to="/catalog"
              className="mt-4 block text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {t('goToCatalog')}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
