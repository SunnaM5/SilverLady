import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { t } = useTranslation()
  const supportUrl = 'https://t.me/zxsvgh'

  return (
    <footer className="bg-gray-100 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('siteName')}
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('siteTagline')}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              {t('footerSchedule')}
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('footerDelivery')}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
              {t('support')}
            </h3>
            <a
              href={supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              t.me/zxsvgh
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-500">{t('footerRights')}</p>
          <div className="flex gap-6">
            <Link to="/catalog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              {t('catalog')}
            </Link>
            <Link to="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              {t('about')}
            </Link>
            <a href={supportUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
              {t('support')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
