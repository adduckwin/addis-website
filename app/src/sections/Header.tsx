import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, Search, User, Home } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { CartIcon } from '@/components/cart/CartIcon'
import { SearchDropdown } from '@/components/SearchDropdown'
import { AddisLogo } from '@/components/AddisLogo'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  const isAccountPage = ['/account', '/wholesale-account', '/admin'].includes(location.pathname)

  // Проверка авторизации админа
  useEffect(() => {
    const adminSession = sessionStorage.getItem('admin_session')
    if (adminSession === 'active') {
      setIsAdmin(true)
    }
  }, [location])

  // Отслеживание скролла
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Функция для перехода на страницу с секцией
  const navigateToPageWithSection = (path: string, sectionId?: string) => {
    if (sectionId) {
      window.location.href = `${path}#${sectionId}`
    } else {
      window.location.href = path
    }
    setIsOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md border-b border-black/5' 
            : 'bg-white'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <AddisLogo size={32} showText={true} variant="black" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/category/espresso"
                className="text-sm font-medium text-black/60 hover:text-black transition-colors tracking-tight"
              >
                Кофе
              </Link>
              <Link
                to="/#about"
                onClick={(e) => {
                  e.preventDefault()
                  navigateToPageWithSection('/', 'about')
                }}
                className="text-sm font-medium text-black/60 hover:text-black transition-colors tracking-tight cursor-pointer"
              >
                О нас
              </Link>
              <Link
                to="/#horeca"
                onClick={(e) => {
                  e.preventDefault()
                  navigateToPageWithSection('/', 'horeca')
                }}
                className="text-sm font-medium text-black/60 hover:text-black transition-colors tracking-tight cursor-pointer"
              >
                HoReCa
              </Link>
              <Link
                to="/blog"
                className="text-sm font-medium text-black/60 hover:text-black transition-colors tracking-tight"
              >
                Блог
              </Link>
              {/* Скрытая ссылка для админа (видна только авторизованным) */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-sm font-medium text-[#D95700] hover:text-[#B84800] transition-colors tracking-tight"
                >
                  Админ
                </Link>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="p-2 text-black/60 hover:text-black transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
                <SearchDropdown isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
              </div>

              <CartIcon />
              
              {/* Возврат на главную для ЛК */}
              {isAccountPage ? (
                <Link to="/" className="hidden sm:block">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-black/60 hover:text-black hover:bg-black/5"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    На главную
                  </Button>
                </Link>
              ) : (
                <Link to="/login" className="hidden sm:block">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-black/60 hover:text-black hover:bg-black/5"
                  >
                    <User className="w-5 h-5 mr-2" />
                    Войти
                  </Button>
                </Link>
              )}

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <button
                    className="md:hidden p-2 text-black/60 hover:text-black transition-colors"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-80 bg-white border-l border-black/5">
                  <div className="flex flex-col h-full pt-12">
                    <nav className="flex flex-col gap-6">
                      <Link
                        to="/"
                        onClick={() => setIsOpen(false)}
                        className="text-2xl font-bold text-black hover:text-black/60 transition-colors tracking-tight"
                      >
                        Главная
                      </Link>
                      <Link
                        to="/category/espresso"
                        onClick={() => setIsOpen(false)}
                        className="text-2xl font-bold text-black hover:text-black/60 transition-colors tracking-tight"
                      >
                        Кофе
                      </Link>
                      <Link
                        to="/#about"
                        onClick={() => {
                          navigateToPageWithSection('/', 'about')
                        }}
                        className="text-2xl font-bold text-black hover:text-black/60 transition-colors tracking-tight text-left cursor-pointer"
                      >
                        О нас
                      </Link>
                      <Link
                        to="/#horeca"
                        onClick={() => {
                          navigateToPageWithSection('/', 'horeca')
                        }}
                        className="text-2xl font-bold text-black hover:text-black/60 transition-colors tracking-tight text-left cursor-pointer"
                      >
                        HoReCa
                      </Link>
                      <Link
                        to="/blog"
                        onClick={() => setIsOpen(false)}
                        className="text-2xl font-bold text-black hover:text-black/60 transition-colors tracking-tight"
                      >
                        Блог
                      </Link>
                      {/* Скрытая ссылка для админа в мобильном меню */}
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setIsOpen(false)}
                          className="text-2xl font-bold text-[#D95700] hover:text-[#B84800] transition-colors tracking-tight"
                        >
                          Админ
                        </Link>
                      )}
                      <div className="pt-6 border-t border-black/10">
                        <p className="text-sm text-black/40 mb-4 font-medium tracking-tight">Личный кабинет</p>
                        <div className="flex flex-col gap-3">
                          <Link
                            to="/login"
                            onClick={() => setIsOpen(false)}
                            className="text-lg text-black/60 hover:text-black font-medium tracking-tight"
                          >
                            Вход
                          </Link>
                          <Link
                            to="/register"
                            onClick={() => setIsOpen(false)}
                            className="text-lg text-black/60 hover:text-black font-medium tracking-tight"
                          >
                            Регистрация
                          </Link>
                        </div>
                      </div>
                      <div className="pt-6 border-t border-black/10">
                        <p className="text-sm text-black/40 mb-4 font-medium tracking-tight">Категории</p>
                        <div className="flex flex-col gap-3">
                          <Link
                            to="/category/espresso"
                            onClick={() => setIsOpen(false)}
                            className="text-lg text-black/60 hover:text-black font-medium tracking-tight"
                          >
                            Эспрессо
                          </Link>
                          <Link
                            to="/category/filter"
                            onClick={() => setIsOpen(false)}
                            className="text-lg text-black/60 hover:text-black font-medium tracking-tight"
                          >
                            Фильтр
                          </Link>
                          <Link
                            to="/category/drip"
                            onClick={() => setIsOpen(false)}
                            className="text-lg text-black/60 hover:text-black font-medium tracking-tight"
                          >
                            Дрип-пакеты
                          </Link>
                        </div>
                      </div>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  )
}
