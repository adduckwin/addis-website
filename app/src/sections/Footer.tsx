import { Link } from 'react-router-dom'
import { Send } from 'lucide-react'
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
                href="https://vk.com/addis_coffee"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-black/80 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.073 2H8.937C5.106 2 2 5.106 2 8.937v6.126C2 18.894 5.106 22 8.937 22h6.126C18.894 22 22 18.894 22 15.063V8.937C22 5.106 18.894 2 15.073 2zM17.89 15.77c-.265.293-.58.54-.93.736-.32.18-.66.31-1.01.38-.33.07-.67.1-1.01.1-.32 0-.64-.03-.95-.1-.3-.07-.58-.18-.85-.33-.26-.14-.5-.32-.72-.53-.21-.2-.4-.43-.56-.68-.15-.24-.27-.5-.36-.77-.09-.27-.14-.55-.14-.84 0-.28.05-.55.14-.81.09-.26.21-.5.37-.72.16-.22.35-.41.57-.57.22-.16.46-.28.72-.37.26-.09.53-.13.81-.13.27 0 .53.04.78.13.25.09.48.22.69.38.21.16.39.35.54.57.15.22.26.46.33.72.07.26.1.53.1.81 0 .29-.04.57-.12.84-.08.27-.2.52-.35.75-.15.23-.33.43-.54.61-.21.18-.45.32-.71.43-.26.11-.54.17-.83.17-.28 0-.55-.05-.81-.15-.26-.1-.49-.24-.7-.42-.21-.18-.38-.39-.52-.63-.14-.24-.23-.5-.28-.78-.05-.28-.06-.56-.03-.84.03-.28.1-.55.21-.8.11-.25.26-.48.45-.68.19-.2.41-.37.66-.5.25-.13.52-.22.8-.27.28-.05.57-.06.85-.02.28.04.55.12.8.24.25.12.47.28.66.47.19.19.34.41.45.65.11.24.17.5.18.77.01.27-.03.53-.11.78-.08.25-.2.48-.36.68z"/>
                </svg>
              </a>
              <a
                href="https://t.me/addis_coffee"
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
