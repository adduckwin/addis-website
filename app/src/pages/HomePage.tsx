import Header from '@/sections/Header'
import Hero from '@/sections/Hero'
import Categories from '@/sections/Categories'
import FeaturedProducts from '@/sections/FeaturedProducts'
import About from '@/sections/About'
import HoReCa from '@/sections/HoReCa'
import Process from '@/sections/Process'
import Logistics from '@/sections/Logistics'
import Testimonials from '@/sections/Testimonials'
import CTA from '@/sections/CTA'
import Footer from '@/sections/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-16">
        <Hero />
        <Categories />
        <FeaturedProducts />
        <About />
        <HoReCa />
        <Process />
        <Logistics />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
