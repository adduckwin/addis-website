import { Link } from 'react-router-dom'
import { Instagram, Send } from 'lucide-react'
import { AddisLogo } from '@/components/AddisLogo'

const footerLinks = {
  catalog: {
    title: 'Каталог',
    links: [
      { name: 'Эспрессо', href: '/category/espresso' },
      { name: 'Фильтр', href: '/category/filter' },
      { name: 'Дрип-пакеты', href: '/category/drip' },
    ],
  },
  company: {
    title: 'Компания',
    links: [
      { name: 'О нас', href: '/#about' },
      { name: 'Производство', href: '/#process' },
      { name: 'Блог', href: '/blog' },
      { name: 'Контакты', href: '/#contacts' },
    ],
  },
  business: {
    title: 'Для бизнеса',
    links: [
      { name: 'HoReCa', href: '/#horeca' },
      { name: 'Стать партнёром', href: '/register-wholesale' },
    ],
  },
}

export default function Footer() {
  return (
    <footer id="contacts" className="bg-white border-t border-black/5">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-6">
              <AddisLogo size={32} showText={true} variant="black" />
            </Link>
            <p className="text-black/50 leading-relaxed max-w-sm mb-6">
              Обжаренный кофе. Зерновой, молотый, дрип-пакеты — для любых форматов и нужд.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-black/80 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-black/80 transition-all"
              >
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-black mb-4 tracking-tight">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-black/50 hover:text-black transition-colors font-medium tracking-tight"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-black/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-black/40 text-sm font-medium tracking-tight">
            © 2025 Addis. Все права защищены.
          </p>
          <div className="flex items-center gap-6 text-sm text-black/40">
            <Link to="/privacy" className="hover:text-black transition-colors font-medium tracking-tight">
              Политика конфиденциальности
            </Link>
            <Link to="/terms" className="hover:text-black transition-colors font-medium tracking-tight">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
