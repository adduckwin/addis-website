import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Coffee, Users, Settings, ArrowRight, Check } from 'lucide-react'

const services = [
  {
    icon: Coffee,
    title: 'Индивидуальный подбор кофе',
    description: 'Подберём профиль под вашу концепцию и целевую аудиторию',
  },
  {
    icon: Users,
    title: 'Обучение бариста',
    description: 'Проведём тренинг для вашей команды по приготовлению и сервировке',
  },
  {
    icon: Settings,
    title: 'Настройка оборудования',
    description: 'Поможем с выбором и базовой настройкой кофейного оборудования',
  },
]

const benefits = [
  '4-уровневая система скидок',
  'Индивидуальные условия',
  'Закреплённый менеджер',
  'API интеграция с 1C',
]

export default function HoReCa() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="horeca" className="py-24 md:py-32 bg-[#E4DCD0]/20" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.2em] uppercase text-black/40 mb-4 font-medium">
            Для бизнеса
          </p>
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black mb-6 leading-tight"
          >
            Станьте надёжным партнёром
            <span className="text-black/40 block mt-2">в мире кофейного искусства</span>
          </h2>
          <p className="text-black/50 text-lg max-w-2xl mx-auto leading-relaxed">
            Специальные условия для кофеен, ресторанов и отелей. 
            Полный спектр услуг и индивидуальный подход.
          </p>
        </motion.div>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.2 + index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="group p-8 bg-white border border-black/5 hover:border-black/10 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 bg-black flex items-center justify-center mb-6 group-hover:bg-black/80 transition-all duration-300">
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-black text-xl font-bold mb-3 tracking-tight">
                {service.title}
              </h3>
              <p className="text-black/50 leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Benefits + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white border border-black/5 p-8 md:p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 
                className="text-2xl font-bold text-black mb-6 tracking-tight"
              >
                Преимущества партнёрства
              </h3>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-black flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-black/60 font-medium tracking-tight">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center md:text-right">
              <Link
                to="/register-wholesale"
                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-semibold hover:bg-black/90 transition-colors group tracking-tight"
              >
                Стать партнёром
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-black/40 text-sm mt-4 font-medium tracking-tight">
                Или свяжитесь с нами: +7 (999) 000-00-00
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
