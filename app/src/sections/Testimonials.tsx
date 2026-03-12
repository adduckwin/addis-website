import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { AddisLogo } from '@/components/AddisLogo'

const testimonials = [
  {
    quote: 'Addis стал нашим фирменным кофе. Гости отмечают стабильность вкуса, а мы ценим простоту работы с поставщиком.',
    author: 'Анна Ковалёва',
    role: 'Владелица кофейни "Morning Brew"',
  },
  {
    quote: 'Наконец-то нашли кофе, который нравится и нам, и нашим гостям. Отличное соотношение цены и качества.',
    author: 'Михаил Петров',
    role: 'Шеф-бариста "Coffee Lab"',
  },
  {
    quote: 'Перешли на Addis полгода назад и ни разу не пожалели. Стабильное качество и отличная поддержка.',
    author: 'Елена Сидорова',
    role: 'Управляющая сети "Daily Coffee"',
  },
]

export default function Testimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [current, setCurrent] = useState(0)

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length)
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  return (
    <section className="py-24 md:py-32 bg-[#E4DCD0]/10" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Quote */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <Quote className="w-12 h-12 text-black/10 mb-8" />
            
            <div className="relative min-h-[200px]">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{
                    opacity: current === index ? 1 : 0,
                    y: current === index ? 0 : 20,
                  }}
                  transition={{ duration: 0.4 }}
                  className={`${current === index ? 'relative' : 'absolute inset-0'}`}
                >
                  <blockquote 
                    className="text-2xl md:text-3xl lg:text-4xl text-black/80 leading-snug mb-8"
                  >
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div>
                    <p className="font-bold text-lg text-black tracking-tight">{testimonial.author}</p>
                    <p className="text-black/40 font-medium tracking-tight">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-12">
              <button
                onClick={prev}
                className="w-12 h-12 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="w-12 h-12 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="ml-4 text-sm text-black/40 font-medium tracking-tight">
                {current + 1} / {testimonials.length}
              </span>
            </div>
          </motion.div>

          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="hidden lg:block"
          >
            <div className="aspect-square bg-[#E4DCD0]/30 flex items-center justify-center border border-black/5">
              <div className="text-center">
                <AddisLogo size={64} showText={false} variant="black" className="opacity-20" />
                <p className="text-black/30 text-sm mt-4 font-medium tracking-tight">Portrait</p>
                <p className="text-black/20 text-xs mt-1">600 × 600 px</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
