import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { AddisLogo } from '@/components/AddisLogo'

const categories = [
  {
    id: 'espresso',
    name: 'Для эспрессо',
    count: '15 позиций',
    description: 'Классические и авторские смеси',
    image: '/images/category-espresso.jpg',
  },
  {
    id: 'filter',
    name: 'Для фильтра',
    count: '15 позиций',
    description: 'Моносорта для альтернативы',
    image: '/images/category-filter.jpg',
  },
  {
    id: 'drip',
    name: 'Дрип-пакеты',
    count: '10 позиций',
    description: 'Удобный формат для офиса',
    image: '/images/category-drip.jpg',
  },
  {
    id: 'tea',
    name: 'Чай',
    count: '30 позиций',
    description: 'Чёрный, зелёный, белый, улун, пуэр',
    image: '/images/products.png',
  },
]

// Category image component
const CategoryImage = ({ src, name }: { src?: string; name: string }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="w-full aspect-[4/3] object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const placeholder = target.nextElementSibling as HTMLElement | null
          if (placeholder) placeholder.style.display = 'flex'
        }}
      />
    )
  }
  return (
    <div className="aspect-[4/3] flex items-center justify-center bg-[#E4DCD0]/20">
      <div className="text-center">
        <AddisLogo size={48} showText={false} variant="black" className="opacity-20" />
        <p className="text-black/30 text-xs mt-3 font-medium tracking-tight">Image</p>
        <p className="text-black/20 text-[10px]">400 × 300</p>
      </div>
    </div>
  )
}

export default function Categories() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="coffee" className="py-24 md:py-32 bg-white" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-sm tracking-[0.2em] uppercase text-black/40 mb-4 font-medium">
            Каталог
          </p>
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black leading-tight"
          >
            Выберите свой кофе
          </h2>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <Link
                to={`/category/${category.id}`}
                className="group relative bg-white overflow-hidden border border-black/5 hover:border-black/10 transition-all duration-300 hover:shadow-lg block"
              >
                {/* Image */}
                <div className="relative">
                  <CategoryImage src={category.image} name={category.name} />
                  <div
                    className="absolute inset-0 aspect-[4/3] hidden items-center justify-center bg-[#E4DCD0]/20"
                    style={{ display: 'none' }}
                  >
                    <div className="text-center">
                      <AddisLogo size={48} showText={false} variant="black" className="opacity-20" />
                      <p className="text-black/30 text-xs mt-3 font-medium tracking-tight">Image</p>
                      <p className="text-black/20 text-[10px]">400 × 300</p>
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6 bg-white border-t border-black/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-black/40 text-sm mb-1 font-medium tracking-tight">{category.count}</p>
                      <h3 className="text-black text-xl font-bold mb-2 tracking-tight">
                        {category.name}
                      </h3>
                      <p className="text-black/50 text-sm font-medium tracking-tight">{category.description}</p>
                    </div>
                    <div className="w-10 h-10 bg-black flex items-center justify-center group-hover:bg-black/80 transition-all duration-300 flex-shrink-0 ml-4">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
