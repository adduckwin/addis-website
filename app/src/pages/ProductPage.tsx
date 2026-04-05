import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ArrowLeft, ShoppingBag, Check, Package, Coffee, Info, Plus, Minus, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getProductById, products, type Product } from '@/data/products'
import { useCartStore } from '@/store/cartStore'
import Header from '@/sections/Header'
import Footer from '@/sections/Footer'
import { cn } from '@/lib/utils'

// Product image component
const ProductImage = ({ product }: { product?: Product }) => {
  if (product?.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
        className="w-full aspect-square object-cover rounded-2xl"
      />
    )
  }
  return (
    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border border-gray-100">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-xl flex items-center justify-center">
          <ImageIcon className="w-10 h-10 text-gray-300" />
        </div>
        <p className="text-gray-400 text-sm">Нет изображения</p>
      </div>
    </div>
  )
}

// Related products
const RelatedProducts = ({ currentProduct }: { currentProduct: Product }) => {
  const related = products
    .filter(p => p.category === currentProduct.category && p.id !== currentProduct.id)
    .slice(0, 3)

  return (
    <section className="py-16 bg-[#FAFAF8]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Похожие товары</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {related.map(product => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all"
            >
              <ProductImage product={product} />
              <div className="p-4">
                <p className="text-gray-400 text-sm">{product.type}</p>
                <h3 className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                  {product.name}
                </h3>
                <p className="font-semibold mt-2">от {product.price250} ₽</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const product = id ? getProductById(id) : undefined
  const [selectedWeight, setSelectedWeight] = useState<250 | 1000>(250)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)
  const { addItem, getWholesalePrice, customerType, wholesaleCompany } = useCartStore()

  const handleAddToCart = () => {
    if (product) {
      addItem(product, selectedWeight, quantity)
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    }
  }

  const getCurrentPrice = () => {
    if (!product) return 0
    const basePrice = selectedWeight === 250 ? product.price250 : product.price1000
    return getWholesalePrice(basePrice)
  }

  const getOriginalPrice = () => {
    if (!product) return 0
    return selectedWeight === 250 ? product.price250 : product.price1000
  }

  const hasDiscount = customerType === 'wholesale' && wholesaleCompany && getCurrentPrice() < getOriginalPrice()

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-32 pb-20">
          <div className="max-w-[1400px] mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Товар не найден</h1>
            <p className="text-gray-500 mb-8">Запрашиваемый продукт не существует</p>
            <Link to="/">
              <Button className="rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Вернуться на главную
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-24 pb-20">
        {/* Breadcrumbs */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-gray-600">Главная</Link>
            <span>/</span>
            <Link to={`/#${product.category}`} className="hover:text-gray-600 capitalize">
              {product.category === 'espresso' ? 'Эспрессо' :
               product.category === 'filter' ? 'Фильтр' :
               product.category === 'drip' ? 'Дрип-пакеты' : 'Капсулы'}
            </Link>
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        {/* Product */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductImage product={product} />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Tags */}
              <div className="flex items-center gap-3">
                {product.tag && (
                  <span className="px-3 py-1 bg-gray-900 text-white text-sm rounded-full">
                    {product.tag}
                  </span>
                )}
                {product.isNew && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                    Новинка
                  </span>
                )}
              </div>

              {/* Title */}
              <div>
                <p className="text-gray-400 text-sm mb-2">{product.type}</p>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-lg">{product.rating}</span>
                </div>
                <span className="text-gray-400">({product.reviews} отзывов)</span>
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">{product.description}</p>

              {/* Price */}
              <div className="bg-gray-50 rounded-xl p-6">
                {/* Weight Selection */}
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => setSelectedWeight(250)}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-lg border-2 transition-all",
                      selectedWeight === 250
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    )}
                  >
                    <p className={cn("text-xs", selectedWeight === 250 ? "text-gray-300" : "text-gray-400")}>
                      250 г
                    </p>
                    <p className="font-bold">{getWholesalePrice(product.price250)} ₽</p>
                    {hasDiscount && selectedWeight === 250 && (
                      <p className="text-xs text-gray-400 line-through">{product.price250} ₽</p>
                    )}
                  </button>
                  <button
                    onClick={() => setSelectedWeight(1000)}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-lg border-2 transition-all",
                      selectedWeight === 1000
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    )}
                  >
                    <p className={cn("text-xs", selectedWeight === 1000 ? "text-gray-300" : "text-gray-400")}>
                      1000 г
                    </p>
                    <p className="font-bold">{getWholesalePrice(product.price1000)} ₽</p>
                    {hasDiscount && selectedWeight === 1000 && (
                      <p className="text-xs text-gray-400 line-through">{product.price1000} ₽</p>
                    )}
                  </button>
                </div>

                {/* Wholesale Badge */}
                {customerType === 'wholesale' && wholesaleCompany && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      Оптовая цена со скидкой <strong>{wholesaleCompany.tier.discount}%</strong>
                    </p>
                  </div>
                )}

                {/* Quantity */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Количество</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button 
                  className={cn(
                    "w-full rounded-full transition-all",
                    addedToCart
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-900 hover:bg-gray-800"
                  )}
                  onClick={handleAddToCart}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Добавлено!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Добавить в корзину
                    </>
                  )}
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Coffee className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Обжарка</p>
                    <p className="text-gray-500 text-sm">{product.roast}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Q-Grade</p>
                    <p className="text-gray-500 text-sm">{product.qGrade}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Состав</p>
                    <p className="text-gray-500 text-sm">{product.composition}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Профиль</p>
                    <p className="text-gray-500 text-sm">{product.tasteProfile}</p>
                  </div>
                </div>
              </div>

              {/* Descriptors */}
              <div>
                <p className="font-medium text-gray-900 mb-3">Дескрипторы вкуса</p>
                <div className="flex flex-wrap gap-2">
                  {product.descriptors.map((desc, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {desc}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts currentProduct={product} />
      </main>
      <Footer />
    </div>
  )
}
