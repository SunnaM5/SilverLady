import { Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from '@/context/ThemeContext'
import { CatalogViewProvider } from '@/context/CatalogViewContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { HomePage } from '@/pages/HomePage'
import { CatalogPage } from '@/pages/CatalogPage'
import { ProductPage } from '@/pages/ProductPage'
import { CartPage } from '@/pages/CartPage'
import { AboutPage } from '@/pages/AboutPage'
import { SupportPage } from '@/pages/SupportPage'

function Layout() {
  const location = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/support" element={<SupportPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <CatalogViewProvider>
        <Layout />
      </CatalogViewProvider>
    </ThemeProvider>
  )
}
