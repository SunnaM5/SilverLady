import type { CartItem } from '@/types'

const STORAGE_KEY = 'silverlady_cart'

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function save(items: CartItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

let listeners: (() => void)[] = []

export function getCart(): CartItem[] {
  return load()
}

export function addToCart(item: Omit<CartItem, 'quantity'> & { quantity?: number }) {
  const items = load()
  const existing = items.find((i) => i.slug === item.slug)
  const qty = item.quantity ?? 1
  if (existing) {
    existing.quantity += qty
  } else {
    items.push({ ...item, quantity: qty })
  }
  save(items)
  listeners.forEach((fn) => fn())
}

export function setQuantity(slug: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(slug)
    return
  }
  const items = load()
  const i = items.find((x) => x.slug === slug)
  if (i) {
    i.quantity = quantity
    save(items)
    listeners.forEach((fn) => fn())
  }
}

export function removeFromCart(slug: string) {
  const items = load().filter((i) => i.slug !== slug)
  save(items)
  listeners.forEach((fn) => fn())
}

export function getCartTotal(): number {
  return load().reduce((sum, i) => sum + i.price * i.quantity, 0)
}

export function getCartCount(): number {
  return load().reduce((sum, i) => sum + i.quantity, 0)
}

export function subscribe(fn: () => void) {
  listeners.push(fn)
  return () => {
    listeners = listeners.filter((l) => l !== fn)
  }
}
