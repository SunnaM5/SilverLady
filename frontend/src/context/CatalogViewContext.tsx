import React, { createContext, useContext, useEffect, useState } from 'react'
import type { CatalogView } from '@/types'

const STORAGE_KEY = 'silverlady_catalog_view'

const CatalogViewContext = createContext<{
  view: CatalogView
  setView: (v: CatalogView) => void
} | null>(null)

export function CatalogViewProvider({ children }: { children: React.ReactNode }) {
  const [view, setViewState] = useState<CatalogView>(() => {
    if (typeof window === 'undefined') return 'classic'
    const stored = localStorage.getItem(STORAGE_KEY) as CatalogView | null
    return stored === 'compact' ? 'compact' : 'classic'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, view)
  }, [view])

  const setView = (v: CatalogView) => setViewState(v)

  return (
    <CatalogViewContext.Provider value={{ view, setView }}>
      {children}
    </CatalogViewContext.Provider>
  )
}

export function useCatalogView() {
  const ctx = useContext(CatalogViewContext)
  if (!ctx) throw new Error('useCatalogView must be used within CatalogViewProvider')
  return ctx
}
