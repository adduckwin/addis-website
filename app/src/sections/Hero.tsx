import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AddisLogo } from '@/components/AddisLogo'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Background Pattern - Addis geometric pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="triangle-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 0L60 30L30 60L0 30L30 0Z" fill="none" stroke="#000" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#triangle-pattern)"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="space-y-8"
        >
          {/* Logo Symbol */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-center"
          >
            <AddisLogo size={64} showText={false} variant="black" />
          </motion.div>

          {/* Label */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-black/40 text-sm tracking-[0.2em] uppercase font-medium"
          >
            Обжаренный кофе
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-black leading-[0.95] tracking-tight"

          >
            СДЕЛАТЬ КАЖДЫЙ
            <br />
            <span className="text-black/40">ГЛОТОК НЕЗАБЫВАЕМЫМ</span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-black/50 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Профессиональный бренд для тех, кто ценит качество.
            <br className="hidden sm:block" />
            Зерновой, молотый, дрип-пакеты — для любых форматов.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link to="/category/espresso">
              <Button
                size="lg"
                className="bg-black text-white hover:bg-black/90 rounded-none px-8 py-6 text-sm font-semibold tracking-tight group"
              >
                Смотреть кофе
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/register-wholesale">
              <Button
                size="lg"
                variant="outline"
                className="border-black/20 text-black hover:bg-black/5 rounded-none px-8 py-6 text-sm font-semibold tracking-tight"
              >
                Стать партнером
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Image Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-16 mx-auto max-w-4xl"
        >
          <div className="aspect-[21/9] bg-[#E4DCD0]/30 flex items-center justify-center border border-black/5">
            <div className="text-center">
              <AddisLogo size={48} showText={false} variant="black" className="opacity-20" />
              <p className="text-black/30 text-sm mt-4 font-medium tracking-tight">Hero Image</p>
              <p className="text-black/20 text-xs mt-1">1200 × 500 px</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-black/20"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  )
}
