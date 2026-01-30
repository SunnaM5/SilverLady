const BASE = '/api'

export async function getCategories(): Promise<import('@/types').Category[]> {
  const r = await fetch(`${BASE}/categories/`)
  if (!r.ok) throw new Error('Failed to fetch categories')
  return r.json()
}

export async function getProducts(params: {
  category?: string
  search?: string
  min_price?: number
  max_price?: number
  in_stock?: boolean
  sort?: string
  page?: number
}): Promise<import('@/types').PaginatedProducts> {
  const search = new URLSearchParams()
  if (params.category) search.set('category', params.category)
  if (params.search) search.set('search', params.search)
  if (params.min_price != null) search.set('min_price', String(params.min_price))
  if (params.max_price != null) search.set('max_price', String(params.max_price))
  if (params.in_stock === true) search.set('in_stock', 'true')
  if (params.sort) search.set('sort', params.sort)
  if (params.page) search.set('page', String(params.page))
  const r = await fetch(`${BASE}/products/?${search}`)
  if (!r.ok) throw new Error('Failed to fetch products')
  return r.json()
}

export async function getProduct(slug: string): Promise<import('@/types').ProductDetail> {
  const r = await fetch(`${BASE}/products/${slug}/`)
  if (!r.ok) throw new Error('Product not found')
  return r.json()
}

const TELEGRAM_USER = 'zxsvgh'

export function getTelegramSupportUrl(): string {
  return `https://t.me/${TELEGRAM_USER}`
}

export async function getTelegramOrderUrl(params: {
  product?: string
  qty?: number
  from?: 'cart'
  lang?: string
}): Promise<string> {
  const search = new URLSearchParams()
  if (params.product) search.set('product', params.product)
  if (params.qty != null) search.set('qty', String(params.qty))
  if (params.from) search.set('from', params.from)
  if (params.lang) search.set('lang', params.lang)
  const r = await fetch(`${BASE}/share/telegram-link/?${search}`)
  if (!r.ok) throw new Error('Failed to get Telegram link')
  const data = await r.json()
  return data.url
}
