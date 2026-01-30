import { useCatalogView } from '@/context/CatalogViewContext'

export function ProductCardSkeleton() {
  const { view } = useCatalogView()
  return (
    <div className={`rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800/50 animate-pulse ${view === 'compact' ? 'rounded-xl' : ''}`}>
      <div className="aspect-square bg-gray-200 dark:bg-gray-700" />
      <div className={view === 'compact' ? 'p-3' : 'p-4'}>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 mt-2 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  )
}
