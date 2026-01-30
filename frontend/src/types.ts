// Auto-generated basic types for SilverLady frontend

export type CatalogView = 'classic' | 'compact'

export interface Category {
  id: number
  slug: string
  title_ru: string
  title_uz: string
  title_en: string
}

export interface ProductImage {
  id: number
  image: string | null
  is_main: boolean
}

export interface ProductListItem {
  id: number
  slug: string
  name_ru: string
  name_uz: string
  name_en: string
  price: string
  category_slug: string
  in_stock: boolean
  is_featured: boolean
  is_new: boolean
  main_image: string | null
  created_at: string
}

export interface ProductDetail {
  id: number
  slug: string
  name_ru: string
  name_uz: string
  name_en: string
  description_ru?: string
  description_uz?: string
  description_en?: string
  price: string
  main_image?: string
  category_slug: string
  category_title_ru?: string
  category_title_uz?: string
  category_title_en?: string
  in_stock: boolean
  is_featured: boolean
  is_new: boolean
  images?: ProductImage[]
  created_at?: string
  updated_at?: string
}

export interface PaginatedProducts {
  count: number
  next: string | null
  previous: string | null
  results: ProductListItem[]
}

export interface CartItem {
  slug: string
  name: string
  price: number
  image?: string | null
  quantity: number
}
