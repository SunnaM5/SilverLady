// import { useEffect, useState, useCallback } from 'react'
// import { useSearchParams } from 'react-router-dom'
// import { motion, AnimatePresence } from 'framer-motion'
// import { useTranslation } from 'react-i18next'
// import { getCategories, getProducts } from '@/api/client'
// import { useCatalogView } from '@/context/CatalogViewContext'
// import type { Category } from '@/types'
// import type { ProductListItem } from '@/types'
// import { ProductCard } from '@/components/ProductCard'
// import { ProductCardSkeleton } from '@/components/ProductCardSkeleton'

// export function CatalogPage() {
//   const { t, i18n } = useTranslation()
//   const [searchParams, setSearchParams] = useSearchParams()
//   const { view, setView } = useCatalogView()

//   const category = searchParams.get('category') || ''
//   const search = searchParams.get('search') || ''
//   const minPrice = searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined
//   const maxPrice = searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined
//   const inStock = searchParams.get('in_stock') === 'true'
//   const sort = searchParams.get('sort') || 'newest'
//   const page = Number(searchParams.get('page') || 1)

//   const [categories, setCategories] = useState<Category[]>([])
//   const [products, setProducts] = useState<ProductListItem[]>([])
//   const [totalCount, setTotalCount] = useState(0)
//   const [loading, setLoading] = useState(true)

//   const updateParams = useCallback(
//     (updates: Record<string, string | number | undefined>) => {
//       const next = new URLSearchParams(searchParams)
//       Object.entries(updates).forEach(([key, value]) => {
//         if (value === undefined || value === '' || value === false) {
//           next.delete(key)
//         } else {
//           next.set(key, String(value))
//         }
//       })
//       next.delete('page')
//       setSearchParams(next, { replace: true })
//     },
//     [searchParams, setSearchParams]
//   )

//   useEffect(() => {
//     getCategories().then(setCategories)
//   }, [])

//   useEffect(() => {
//     setLoading(true)
//     getProducts({
//       category: category || undefined,
//       search: search || undefined,
//       min_price: minPrice,
//       max_price: maxPrice,
//       in_stock: inStock || undefined,
//       sort: sort === 'newest' ? undefined : sort,
//       page,
//     })
//       .then((data) => {
//         setProducts(data.results)
//         setTotalCount(data.count)
//       })
//       .finally(() => setLoading(false))
//   }, [category, search, minPrice, maxPrice, inStock, sort, page])

//   const lang = (i18n.language || 'ru') as 'ru' | 'uz' | 'en'

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
//       <motion.h1
//         initial={{ opacity: 0, y: 12 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-6 sm:mb-8"
//       >
//         {t('catalog')}
//       </motion.h1>

//       <div className="flex flex-col lg:flex-row gap-8">
//         <motion.aside
//           initial={{ opacity: 0, x: -12 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.1 }}
//           className="lg:w-56 shrink-0 space-y-6"
//         >
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               {t('categories')}
//             </label>
//             <select
//               value={category}
//               onChange={(e) => updateParams({ category: e.target.value })}
//               className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
//             >
//               <option value="">{t('allCategories')}</option>
//               {categories.map((c) => (
//                 <option key={c.slug} value={c.slug}>
//                   {c[`title_${lang}`] ?? c.title_ru}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//               {t('filterPrice')}
//             </label>
//             <div className="flex gap-2">
//               <input
//                 type="number"
//                 placeholder="Min"
//                 value={minPrice ?? ''}
//                 onChange={(e) => updateParams({ min_price: e.target.value ? Number(e.target.value) : undefined })}
//                 className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500"
//               />
//               <input
//                 type="number"
//                 placeholder="Max"
//                 value={maxPrice ?? ''}
//                 onChange={(e) => updateParams({ max_price: e.target.value ? Number(e.target.value) : undefined })}
//                 className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={inStock}
//                 onChange={(e) => updateParams({ in_stock: e.target.checked ? 'true' : undefined })}
//                 className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
//               />
//               <span className="text-sm text-gray-700 dark:text-gray-300">{t('filterInStock')}</span>
//             </label>
//           </div>
//         </motion.aside>

//         <div className="flex-1 min-w-0">
//           <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
//             <div className="flex flex-wrap items-center gap-3">
//               <select
//                 value={sort}
//                 onChange={(e) => updateParams({ sort: e.target.value })}
//                 className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500"
//               >
//                 <option value="newest">{t('sortNewest')}</option>
//                 <option value="price_asc">{t('sortPriceAsc')}</option>
//                 <option value="price_desc">{t('sortPriceDesc')}</option>
//               </select>
//               <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
//                 <button
//                   type="button"
//                   onClick={() => setView('classic')}
//                   className={`px-3 py-2 text-sm font-medium transition-colors ${
//                     view === 'classic'
//                       ? 'bg-indigo-600 text-white dark:bg-indigo-500'
//                       : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
//                   }`}
//                   title={t('viewClassic')}
//                 >
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
//                   </svg>
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setView('compact')}
//                   className={`px-3 py-2 text-sm font-medium transition-colors ${
//                     view === 'compact'
//                       ? 'bg-indigo-600 text-white dark:bg-indigo-500'
//                       : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
//                   }`}
//                   title={t('viewCompact')}
//                 >
//                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//             <p className="text-sm text-gray-600 dark:text-gray-400">
//               {totalCount} {t('catalog').toLowerCase()}
//             </p>
//           </div>

//           <AnimatePresence mode="wait">
//             {loading ? (
//               <motion.div
//                 key="skeleton"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 className={`grid gap-4 sm:gap-6 ${
//                   view === 'compact'
//                     ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
//                     : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
//                 }`}
//               >
//                 {Array.from({ length: 8 }).map((_, i) => (
//                   <ProductCardSkeleton key={i} />
//                 ))}
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="products"
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 layout
//                 className={`grid gap-4 sm:gap-6 ${
//                   view === 'compact'
//                     ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
//                     : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
//                 }`}
//               >
//                 <AnimatePresence mode="popLayout">
//                   {products.map((product, i) => (
//                     <ProductCard key={product.id} product={product} index={i} layout />
//                   ))}
//                 </AnimatePresence>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {!loading && products.length === 0 && (
//             <motion.p
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center text-gray-500 dark:text-gray-400 py-12"
//             >
//               {t('catalog')} — {t('emptyCatalog')}.
//             </motion.p>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }


import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getCategories, getProducts } from '@/api/client'
import { useCatalogView } from '@/context/CatalogViewContext'
import type { Category, ProductListItem } from '@/types'
import { ProductCard } from '@/components/ProductCard'
import { ProductCardSkeleton } from '@/components/ProductCardSkeleton'

type Lang = 'ru' | 'uz' | 'en'

function unwrapList<T>(data: any): T[] {
  if (Array.isArray(data)) return data
  if (data && Array.isArray(data.results)) return data.results
  return []
}

function pickTitle(obj: any, lang: Lang) {
  // поддержка разных схем: title_ru / name_ru и т.п.
  return (
    obj?.[`title_${lang}`] ??
    obj?.title_ru ??
    obj?.[`name_${lang}`] ??
    obj?.name_ru ??
    obj?.slug ??
    ''
  )
}

export function CatalogPage() {
  const { t, i18n } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { view, setView } = useCatalogView()

  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const minPrice = searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined
  const maxPrice = searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined
  const inStock = searchParams.get('in_stock') === 'true'
  const sort = searchParams.get('sort') || 'newest'
  const page = Number(searchParams.get('page') || 1)

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const updateParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const next = new URLSearchParams(searchParams)
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '' || value === false) {
          next.delete(key)
        } else {
          next.set(key, String(value))
        }
      })
      next.delete('page')
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams]
  )

  const lang = ((i18n.language || 'ru') as Lang) ?? 'ru'

  // ✅ Категории: поддержка пагинации DRF (results)
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const data: any = await getCategories()
        const list = unwrapList<Category>(data)
        if (alive) setCategories(list)
      } catch (e: any) {
        if (!alive) return
        setCategories([])
        setError(e?.message ? String(e.message) : 'Ошибка загрузки категорий')
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  // ✅ Товары: тоже безопасно, + count
  useEffect(() => {
    let alive = true
    setLoading(true)
    setError(null)

    getProducts({
      category: category || undefined,
      search: search || undefined,
      min_price: minPrice,
      max_price: maxPrice,
      in_stock: inStock || undefined,
      sort: sort === 'newest' ? undefined : sort,
      page,
    })
      .then((data: any) => {
        if (!alive) return
        const list = unwrapList<ProductListItem>(data)
        setProducts(list)
        setTotalCount(typeof data?.count === 'number' ? data.count : list.length)
      })
      .catch((e: any) => {
        if (!alive) return
        setProducts([])
        setTotalCount(0)
        setError(e?.message ? String(e.message) : 'Ошибка загрузки товаров')
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [category, search, minPrice, maxPrice, inStock, sort, page])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white mb-6 sm:mb-8"
      >
        {t('catalog')}
      </motion.h1>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <motion.aside
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:w-56 shrink-0 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('categories')}
            </label>
            <select
              value={category}
              onChange={(e) => updateParams({ category: e.target.value })}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            >
              <option value="">{t('allCategories')}</option>
              {categories.map((c: any) => (
                <option key={c.slug ?? c.id} value={c.slug}>
                  {pickTitle(c, lang)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('filterPrice')}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice ?? ''}
                onChange={(e) => updateParams({ min_price: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice ?? ''}
                onChange={(e) => updateParams({ max_price: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => updateParams({ in_stock: e.target.checked ? 'true' : undefined })}
                className="rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{t('filterInStock')}</span>
            </label>
          </div>
        </motion.aside>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={sort}
                onChange={(e) => updateParams({ sort: e.target.value })}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="newest">{t('sortNewest')}</option>
                <option value="price_asc">{t('sortPriceAsc')}</option>
                <option value="price_desc">{t('sortPriceDesc')}</option>
              </select>

              <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setView('classic')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    view === 'classic'
                      ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                      : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title={t('viewClassic')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() => setView('compact')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    view === 'compact'
                      ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                      : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title={t('viewCompact')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              {totalCount} {t('catalog').toLowerCase()}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`grid gap-4 sm:gap-6 ${
                  view === 'compact'
                    ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                }`}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                layout
                className={`grid gap-4 sm:gap-6 ${
                  view === 'compact'
                    ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
                    : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                }`}
              >
                <AnimatePresence mode="popLayout">
                  {products.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} layout />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {!loading && products.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 dark:text-gray-400 py-12"
            >
              {t('catalog')} — {t('emptyCatalog')}.
            </motion.p>
          )}
        </div>
      </div>
    </div>
  )
}
