import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ArrowLeft, Filter } from 'lucide-react'
import { getProductsByCategory, products, type Product } from '@/data/products'
import Header from '@/sections/Header'
import Footer from '@/sections/Footer'

// Product placeholder
const ProductPlaceholder = () => (
  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-100">
    <div className="text-center">
      <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
        <svg viewBox="0 0 40 40" fill="none" className="w-6 h-6">
          <rect x="10" y="8" width="20" height="24" rx="2" fill="#D1D5DB" />
        </svg>
      </div>
      <p className="text-gray-400 text-xs">Image</p>
      <p className="text-gray-300 text-[10px]">400 × 400</p>
    </div>
  </div>
)

// Product card
const ProductCard = ({ product, index }: { product: Product; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <Link
      to={`/product/${product.id}`}
      className="group block bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all"
    >
      <div className="relative">
        <ProductPlaceholder />
        {product.tag && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-gray-900 text-white text-xs rounded-full">
            {product.tag}
          </span>
        )}
        {product.isNew && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            Новинка
          </span>
        )}
      </div>
      <div className="p-5">
        <p className="text-gray-400 text-sm mb-1">{product.type}</p>
        <h3 className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors mb-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-gray-400 text-sm">({product.reviews})</span>
        </div>
        <p className="font-semibold text-lg">от {product.price250} ₽</p>
      </div>
    </Link>
  </motion.div>
)

const categoryInfo: Record<string, { title: string; description: string }> = {
  espresso: {
    title: 'Кофе для эспрессо',
    description: 'Классические смеси и моносорта для приготовления настоящего итальянского эспрессо',
  },
  filter: {
    title: 'Фильтр-кофе',
    description: 'Моносорта для альтернативных методов заваривания: V60, кемекс, аэропресс',
  },
  drip: {
    title: 'Дрип-пакеты',
    description: 'Удобный формат для офиса, путешествий и быстрого приготовления',
  },
  capsules: {
    title: 'Кофе в капсулах',
    description: 'Совместимы с Nespresso. Идеальны для дома и офиса',
  },
}

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>()
  const validCategory = category && ['espresso', 'filter', 'drip', 'capsules'].includes(category)
    ? category as Product['category']
    : null

  if (!validCategory) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-32 pb-20">
          <div className="max-w-[1400px] mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Категория не найдена</h1>
            <p className="text-gray-500 mb-8">Запрашиваемая категория не существует</p>
            <Link to="/">
              <button className="px-6 py-3 bg-gray-900 text-white rounded-full">
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Вернуться на главную
              </button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const categoryProducts = getProductsByCategory(validCategory)
  const info = categoryInfo[validCategory]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        {/* Hero */}
        <section className="py-16 md:py-24 bg-[#FAFAF8]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <Link to="/" className="hover:text-gray-600">Главная</Link>
                <span>/</span>
                <span className="text-gray-900">{info.title}</span>
              </nav>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                {info.title}
              </h1>
              <p className="text-gray-500 text-lg max-w-2xl">{info.description}</p>
              <p className="text-gray-400 mt-4">{categoryProducts.length} товаров</p>
            </motion.div>
          </div>
        </section>

        {/* Products */}
        <section className="py-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            {/* Filter bar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                  <Filter className="w-4 h-4" />
                  Фильтры
                </button>
              </div>
              <p className="text-gray-400 text-sm">Сортировка: по популярности</p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* All Products Section */}
        <section className="py-16 bg-[#FAFAF8]">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Весь ассортимент</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products
                .filter(p => p.category !== validCategory)
                .slice(0, 4)
                .map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
