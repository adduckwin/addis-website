import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Search, Flame, ClipboardCheck, Truck } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Отбор',
    description: 'Тщательный контроль качества зёрен на каждом этапе',
  },
  {
    number: '02',
    icon: Flame,
    title: 'Обжарка',
    description: 'Индивидуальный профиль обжарки под каждый сорт',
  },
  {
    number: '03',
    icon: ClipboardCheck,
    title: 'Дегустация',
    description: 'Каппинг каждой партии для контроля качества',
  },
  {
    number: '04',
    icon: Truck,
    title: 'Доставка',
    description: 'Свежий кофе доставляем в течение 24 часов',
  },
]

export default function Process() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="process" className="py-24 md:py-32 bg-white" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-sm tracking-[0.2em] uppercase text-black/40 mb-4 font-medium">
            Процесс
          </p>
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black leading-tight"
          >
            От зерна до чашки
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting Line - Desktop */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
            className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-px bg-black/10 origin-left"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + index * 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="text-center"
              >
                {/* Icon */}
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-8 bg-black">
                  <step.icon className="w-8 h-8 text-white" />
                  {/* Number badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#D95700] text-white text-xs font-bold flex items-center justify-center">
                    {step.number}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-black mb-3 tracking-tight">{step.title}</h3>
                <p className="text-black/50 leading-relaxed font-medium tracking-tight">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
