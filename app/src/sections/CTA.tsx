import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AddisLogo } from '@/components/AddisLogo'

export default function CTA() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="contacts" className="py-24 md:py-32 bg-black" ref={ref}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="flex justify-center mb-8">
            <AddisLogo size={48} showText={false} variant="white" />
          </div>
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-6 leading-tight"
          >
            Станьте частью Addis
          </h2>
          <p className="text-white/60 text-lg mb-10 leading-relaxed">
            Оставьте заявку на бесплатную дегустацию для вашего заведения
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Ваш email"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-14 px-6 rounded-none"
            />
            <Button
              type="submit"
              className="bg-white text-black hover:bg-white/90 h-14 px-8 font-semibold group tracking-tight rounded-none"
            >
              Оставить заявку
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <p className="text-white/40 text-sm mt-6 font-medium tracking-tight">
            Или напишите нам на{' '}
            <a href="mailto:info@addis.coffee" className="text-white/60 hover:text-white transition-colors">
              info@addis.coffee
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
