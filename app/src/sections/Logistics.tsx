import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Truck, MapPin, Package, Clock } from 'lucide-react'

const deliveryPartners = [
  { name: 'СДЭК', description: 'Доставка по всей России' },
  { name: 'ПЭК', description: 'Грузоперевозки по РФ' },
  { name: 'Деловые Линии', description: 'Надёжная логистика' },
]

const localDelivery = {
  name: 'Dali',
  description: 'Курьерская доставка',
  regions: ['Москва', 'Московская область', 'Санкт-Петербург'],
}

export default function Logistics() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 md:py-32 bg-white" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.2em] uppercase text-black/40 mb-4 font-medium">
            Доставка
          </p>
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-black mb-6 leading-tight"
          >
            Логистические решения
          </h2>
          <p className="text-black/50 text-lg max-w-2xl mx-auto leading-relaxed">
            Доставляем кофе в любую точку России. Выбирайте удобный способ доставки.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* National Delivery */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-black flex items-center justify-center">
                <Truck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black tracking-tight">По всей России</h3>
                <p className="text-black/50 font-medium tracking-tight">Транспортные компании</p>
              </div>
            </div>

            <div className="space-y-4">
              {deliveryPartners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between p-5 bg-[#E4DCD0]/20 border border-black/5 hover:border-black/10 transition-colors"
                >
                  <div>
                    <p className="font-bold text-black tracking-tight">{partner.name}</p>
                    <p className="text-black/50 text-sm font-medium tracking-tight">{partner.description}</p>
                  </div>
                  <Package className="w-5 h-5 text-black/30" />
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-2 text-black/50 text-sm font-medium tracking-tight">
              <Clock className="w-4 h-4" />
              <span>Срок доставки: 2-7 рабочих дней</span>
            </div>
          </motion.div>

          {/* Local Delivery */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-[#D95700] flex items-center justify-center">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-black tracking-tight">Курьерская доставка</h3>
                <p className="text-black/50 font-medium tracking-tight">Быстро и удобно</p>
              </div>
            </div>

            <div className="p-6 bg-black text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-2xl font-bold tracking-tight">{localDelivery.name}</p>
                  <p className="text-white/60 font-medium tracking-tight">{localDelivery.description}</p>
                </div>
                <Truck className="w-8 h-8 text-white/40" />
              </div>

              <div className="space-y-3">
                <p className="text-white/60 text-sm mb-3 font-medium tracking-tight">Доступно в:</p>
                {localDelivery.regions.map((region) => (
                  <div
                    key={region}
                    className="flex items-center gap-3"
                  >
                    <div className="w-2 h-2 bg-[#D95700]" />
                    <span className="font-medium tracking-tight">{region}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2 text-white/60 text-sm font-medium tracking-tight">
                <Clock className="w-4 h-4" />
                <span>Срок доставки: 1-2 рабочих дня</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-black flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-black mb-2 tracking-tight">Безопасная упаковка</h4>
            <p className="text-black/50 text-sm font-medium tracking-tight">Кофе приходит в идеальном состоянии</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-black flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-black mb-2 tracking-tight">Отслеживание заказа</h4>
            <p className="text-black/50 text-sm font-medium tracking-tight">Следите за доставкой онлайн</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-black flex items-center justify-center">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-black mb-2 tracking-tight">Бесплатная доставка</h4>
            <p className="text-black/50 text-sm font-medium tracking-tight">При заказе от 5000 ₽</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
