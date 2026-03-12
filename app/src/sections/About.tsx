import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { AddisLogo } from '@/components/AddisLogo'

const stats = [
  { value: '17', label: 'сортов кофе' },
  { value: '4', label: 'страны происхождения' },
  { value: '2', label: 'собственные обжарки' },
]

export default function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="py-24 md:py-32 bg-white" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="order-2 lg:order-1"
          >
            <p className="text-sm tracking-[0.2em] uppercase text-black/40 mb-4 font-medium">
              О бренде
            </p>
            
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black mb-8 leading-tight"
            >
              Addis — новый профессиональный бренд
              <span className="text-black/40 block mt-2">для тех, кто ценит качество.</span>
            </h2>

            <div className="space-y-6 text-black/60 leading-relaxed">
              <p>
                Мы создали Addis для профессионалов кофейной индустрии. 
                Наша миссия — сделать каждый глоток кофе незабываемым, 
                а работу с ним максимально удобной и эффективной.
              </p>
              <p>
                Мы говорим на одном языке с бариста и собственниками кофеен. 
                Бренд всегда рядом, чтобы помочь достичь идеала — 
                от подбора кофейных профилей до обучения и настройки оборудования.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-black/10">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <p 
                    className="text-3xl md:text-4xl font-bold text-black mb-1"
                  >
                    {stat.value}
                  </p>
                  <p className="text-black/40 text-sm font-medium tracking-tight">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="order-1 lg:order-2"
          >
            <div className="aspect-[4/3] bg-[#E4DCD0]/30 flex items-center justify-center border border-black/5">
              <div className="text-center">
                <AddisLogo size={64} showText={false} variant="black" className="opacity-20" />
                <p className="text-black/30 text-sm mt-4 font-medium tracking-tight">About Image</p>
                <p className="text-black/20 text-xs mt-1">800 × 600 px</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
