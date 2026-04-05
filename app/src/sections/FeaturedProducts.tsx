import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Star, ArrowRight } from 'lucide-react'
import { getBestsellers, getNewProducts, products, type Product } from '@/data/products'
import { AddisLogo } from '@/components/AddisLogo'

// Product image component
const ProductImage = ({ product }: { product: Product }) => {
  if (product.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
        className="w-full aspect-square object-cover"
      />
    )
  }
  return (
    <div className="aspect-square bg-[#E4DCD0]/20 flex items-center justify-center">
      <div className="text-center">
        <AddisLogo size={40} showText={false} variant="black" className="opacity-20" />
        <p className="text-black/30 text-xs mt-2 font-medium tracking-tight">Product</p>
        <p className="text-black/20 text-[10px]">400 × 400</p>
      </div>
    </div>
  )
}

// Product card
const ProductCard = ({ product, index }: { product: Product; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.5,
      delay: index * 0.1,
      ease: [0.25, 0.46, 0.45, 0.94],
    }}
  >
    <Link
      to={`/product/${product.id}`}
      className="group block bg-white overflow-hidden border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <ProductImage product={product} />
        {product.tag && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-black text-white text-xs font-semibold tracking-tight">
            {product.tag}
          </div>
        )}
        {product.isNew && (
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-[#D95700] text-white text-xs font-semibold tracking-tight">
            Новинка
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 border-t border-black/5">
        <p className="text-black/40 text-sm mb-1 font-medium tracking-tight">{product.type}</p>
        <h3 className="font-bold text-lg text-black mb-2 group-hover:text-black/70 transition-colors tracking-tight">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#D95700] text-[#D95700]" />
            <span className="text-sm font-semibold text-black/70">{product.rating}</span>
          </div>
          <span className="text-black/40 text-sm font-medium">({product.reviews})</span>
        </div>

        {/* Price */}
        <p className="font-bold text-lg text-black tracking-tight">от {product.price250} ₽</p>
      </div>
    </Link>
  </motion.div>
)

export default function FeaturedProducts() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const bestsellers = getBestsellers()
  const newProducts = getNewProducts()
  
  // Combine bestsellers and new products to get 4 items
  const featuredProducts: Product[] = [...bestsellers]
  
  // Add new products if needed
  for (const product of newProducts) {
    if (featuredProducts.length >= 4) break
    if (!featuredProducts.find(p => p.id === product.id)) {
      featuredProducts.push(product)
    }
  }
  
  // Add more products if still less than 4
  for (const product of products) {
    if (featuredProducts.length >= 4) break
    if (!featuredProducts.find(p => p.id === product.id)) {
      featuredProducts.push(product)
    }
  }

  return (
    <section className="py-24 md:py-32 bg-[#E4DCD0]/10" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
        >
          <div>
            <p className="text-sm tracking-[0.2em] uppercase text-black/40 mb-4 font-medium">
              Популярное
            </p>
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black leading-tight"
            >
              Сорта недели
            </h2>
          </div>
          <Link
            to="/category/espresso"
            className="mt-6 md:mt-0 inline-flex items-center text-sm font-semibold text-black/60 hover:text-black transition-colors group tracking-tight"
          >
            Смотреть всё
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuredProducts.slice(0, 4).map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
