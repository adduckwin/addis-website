import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Building2, 
  ShoppingBag, 
  Truck, 
  FileText, 
  Users, 
  LogOut,
  ChevronRight,
  Package,
  Check,
  AlertCircle,
  Download,
  TrendingUp,
  Calendar,
  Phone,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useCartStore, WHOLESALE_TIERS } from '@/store/cartStore'
import Header from '@/sections/Header'
import Footer from '@/sections/Footer'
import { cn } from '@/lib/utils'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

// Mock wholesale orders
const MOCK_WHOLESALE_ORDERS = [
  {
    id: 'ADD-OPT-2024-001',
    date: '2024-01-10',
    status: 'delivered',
    total: 125000,
    items: [
      { name: 'Addis House Blend', weight: 1000, quantity: 50, price: 1520 },
      { name: 'Addis Classic 60/40', weight: 1000, quantity: 30, price: 1360 },
    ],
    delivery: { type: 'cdek', city: 'Санкт-Петербург' },
    invoice: 'СЧ-001-2024',
  },
  {
    id: 'ADD-OPT-2024-002',
    date: '2024-01-25',
    status: 'processing',
    total: 89000,
    items: [
      { name: 'Addis Ethiopia Duo', weight: 1000, quantity: 40, price: 1680 },
    ],
    delivery: { type: 'pek', city: 'Новосибирск' },
    invoice: 'СЧ-002-2024',
  },
]

// Mock monthly stats
const MONTHLY_STATS = {
  currentMonth: 214000,
  previousMonth: 189000,
  yearTotal: 2456000,
  ordersCount: 47,
}

export default function WholesaleAccountPage() {
  const navigate = useNavigate()
  const { wholesaleCompany, setCustomerType, setWholesaleCompany, clearCart } = useCartStore()
  const [activeTab, setActiveTab] = useState('dashboard')

  const handleLogout = () => {
    setCustomerType('retail')
    setWholesaleCompany(null)
    clearCart()
    navigate('/')
  }

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { label: string; className: string }> = {
      pending: { label: 'Ожидает подтверждения', className: 'bg-[#FEF3C7] text-[#92400E]' },
      processing: { label: 'В обработке', className: 'bg-[#F0F9FF] text-[#0369A1]' },
      shipped: { label: 'Отправлен', className: 'bg-[#F5F3FF] text-[#7C3AED]' },
      delivered: { label: 'Доставлен', className: 'bg-[#F0FDF4] text-[#166534]' },
      cancelled: { label: 'Отменён', className: 'bg-[#FEF2F2] text-[#DC2626]' },
    }
    
    const config = statuses[status] || statuses.pending
    
    return (
      <Badge className={cn(config.className, 'font-normal')}>
        {config.label}
      </Badge>
    )
  }

  const getDeliveryServiceName = (type: string) => {
    const services: Record<string, string> = {
      cdek: 'СДЭК',
      pek: 'ПЭК',
      dellin: 'Деловые Линии',
      dalli: 'Dalli',
      pickup: 'Самовывоз',
    }
    return services[type] || type
  }

  // Calculate progress to next tier
  const currentTier = wholesaleCompany?.tier || WHOLESALE_TIERS[0]
  const nextTier = WHOLESALE_TIERS.find(t => t.level === currentTier.level + 1)
  const progressToNext = nextTier 
    ? Math.min(100, (MONTHLY_STATS.currentMonth / nextTier.minOrder) * 100)
    : 100

  if (!wholesaleCompany) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 text-center">
            <AlertCircle className="w-16 h-16 text-[#D97706] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-[#1F2937] mb-2">Доступ ограничен</h1>
            <p className="text-[#6B7280] mb-6">Войдите как оптовый клиент для доступа к кабинету</p>
            <Link to="/login">
              <Button className="bg-[#1F2937] hover:bg-[#374151]">Войти</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="mb-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-[#1F2937]">Оптовый кабинет</h1>
                    <Badge className="bg-[#16A34A] text-white">
                      {currentTier.name}
                    </Badge>
                  </div>
                  <p className="text-[#6B7280]">{wholesaleCompany.companyName}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-[#D1D5DB] self-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </Button>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Sidebar */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="lg:col-span-1"
              >
                <Card className="border-[#E5E7EB] sticky top-24">
                  <CardContent className="p-4">
                    {/* Company Info */}
                    <div className="mb-6 pb-6 border-b border-[#E5E7EB]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-[#1F2937] rounded-full flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-[#1F2937] text-sm">{wholesaleCompany.companyName}</p>
                          <p className="text-xs text-[#6B7280]">ИНН: {wholesaleCompany.inn}</p>
                        </div>
                      </div>
                      
                      {/* Discount Badge */}
                      <div className="bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-[#166534]">Ваша скидка</span>
                          <span className="text-2xl font-bold text-[#16A34A]">-{currentTier.discount}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1">
                      {[
                        { id: 'dashboard', label: 'Обзор', icon: TrendingUp },
                        { id: 'orders', label: 'Заказы', icon: ShoppingBag },
                        { id: 'documents', label: 'Документы', icon: FileText },
                        { id: 'delivery', label: 'Доставка', icon: Truck },
                        { id: 'company', label: 'Компания', icon: Building2 },
                      ].map((item) => {
                        const Icon = item.icon
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                              activeTab === item.id
                                ? "bg-[#1F2937] text-white"
                                : "text-[#6B7280] hover:bg-[#F5F5F5]"
                            )}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-sm">{item.label}</span>
                            {activeTab === item.id && (
                              <ChevronRight className="w-4 h-4 ml-auto" />
                            )}
                          </button>
                        )
                      })}
                    </nav>

                    {/* Manager Contact */}
                    <div className="mt-6 pt-6 border-t border-[#E5E7EB]">
                      <p className="text-xs text-[#6B7280] mb-2">Ваш менеджер</p>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#F5F5F5] rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-[#9CA3AF]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#1F2937]">Анна Петрова</p>
                          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                            <Phone className="w-3 h-3" />
                            <span>+7 (999) 123-45-67</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Main Content */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: 0.1 }}
                className="lg:col-span-3"
              >
                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Card className="border-[#E5E7EB]">
                        <CardContent className="p-4">
                          <p className="text-sm text-[#6B7280] mb-1">Заказов в этом месяце</p>
                          <p className="text-2xl font-bold text-[#1F2937]">{MONTHLY_STATS.ordersCount}</p>
                          <div className="flex items-center gap-1 mt-2 text-sm text-[#16A34A]">
                            <TrendingUp className="w-4 h-4" />
                            <span>+12% к прошлому месяцу</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-[#E5E7EB]">
                        <CardContent className="p-4">
                          <p className="text-sm text-[#6B7280] mb-1">Оборот за месяц</p>
                          <p className="text-2xl font-bold text-[#1F2937]">
                            {MONTHLY_STATS.currentMonth.toLocaleString('ru-RU')} ₽
                          </p>
                          <div className="flex items-center gap-1 mt-2 text-sm text-[#16A34A]">
                            <TrendingUp className="w-4 h-4" />
                            <span>+13% к прошлому месяцу</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-[#E5E7EB]">
                        <CardContent className="p-4">
                          <p className="text-sm text-[#6B7280] mb-1">Оборот за год</p>
                          <p className="text-2xl font-bold text-[#1F2937]">
                            {MONTHLY_STATS.yearTotal.toLocaleString('ru-RU')} ₽
                          </p>
                          <div className="flex items-center gap-1 mt-2 text-sm text-[#0284C7]">
                            <Calendar className="w-4 h-4" />
                            <span>2024 год</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Next Tier Progress */}
                    {nextTier && (
                      <Card className="border-[#E5E7EB]">
                        <CardHeader>
                          <CardTitle className="text-lg">Прогресс к следующему уровню</CardTitle>
                          <CardDescription>
                            Закажите ещё на {(nextTier.minOrder - MONTHLY_STATS.currentMonth).toLocaleString('ru-RU')} ₽ 
                            для получения скидки {nextTier.discount}%
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-[#6B7280]">{currentTier.name}</span>
                            <span className="text-sm text-[#6B7280]">{nextTier.name}</span>
                          </div>
                          <Progress value={progressToNext} className="h-2" />
                          <div className="flex items-center justify-between mt-2 text-sm">
                            <span className="text-[#16A34A] font-medium">-{currentTier.discount}%</span>
                            <span className="text-[#16A34A] font-medium">-{nextTier.discount}%</span>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Discount Criteria */}
                    <Card className="border-[#E5E7EB]">
                      <CardHeader>
                        <CardTitle className="text-lg">Критерии скидки</CardTitle>
                        <CardDescription>Как формируется ваша скидка</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-[#F0FDF4] rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#16A34A] rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-[#166534]">Объём заказов</p>
                                <p className="text-sm text-[#6B7280]">{MONTHLY_STATS.currentMonth.toLocaleString('ru-RU')} ₽ / мес</p>
                              </div>
                            </div>
                            <Badge className="bg-[#16A34A] text-white">Выполнено</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-[#F0FDF4] rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-[#16A34A] rounded-full flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-[#166534]">Регулярность заказов</p>
                                <p className="text-sm text-[#6B7280]">Минимум 1 заказ в месяц</p>
                              </div>
                            </div>
                            <Badge className="bg-[#16A34A] text-white">Выполнено</Badge>
                          </div>

                          <div className="p-4 bg-[#FEF3C7] rounded-lg">
                            <p className="text-sm text-[#92400E]">
                              <strong>💡 Важно:</strong> Для повышения скидки необходимо соблюдать 
                              ОБА критерия: объём заказов И регулярность (не реже 1 раза в месяц). 
                              Скидка пересматривается ежемесячно.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Orders */}
                    <Card className="border-[#E5E7EB]">
                      <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Последние заказы</CardTitle>
                        <button 
                          onClick={() => setActiveTab('orders')}
                          className="text-sm text-[#0284C7] hover:underline"
                        >
                          Все заказы →
                        </button>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="divide-y divide-[#E5E7EB]">
                          {MOCK_WHOLESALE_ORDERS.slice(0, 2).map((order) => (
                            <div key={order.id} className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <span className="font-medium text-[#1F2937]">{order.id}</span>
                                  {getStatusBadge(order.status)}
                                </div>
                                <span className="font-bold text-[#1F2937]">
                                  {order.total.toLocaleString('ru-RU')} ₽
                                </span>
                              </div>
                              <p className="text-sm text-[#6B7280]">
                                {new Date(order.date).toLocaleDateString('ru-RU')} • 
                                {' '}{order.items.reduce((sum, i) => sum + i.quantity, 0)} позиций
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <Card className="border-[#E5E7EB]">
                    <CardHeader className="border-b border-[#E5E7EB]">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">История заказов</CardTitle>
                        <Link to="/category/espresso">
                          <Button size="sm" className="bg-[#1F2937] hover:bg-[#374151]">
                            <ShoppingBag className="w-4 h-4 mr-2" />
                            Новый заказ
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-[#E5E7EB]">
                        {MOCK_WHOLESALE_ORDERS.map((order) => (
                          <div key={order.id} className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <p className="font-medium text-[#1F2937]">{order.id}</p>
                                  {getStatusBadge(order.status)}
                                </div>
                                <div className="flex items-center gap-3 text-sm text-[#6B7280]">
                                  <span>{new Date(order.date).toLocaleDateString('ru-RU')}</span>
                                  <span>•</span>
                                  <span>Счёт: {order.invoice}</span>
                                </div>
                              </div>
                              <div className="text-left sm:text-right">
                                <p className="text-xl font-bold text-[#1F2937]">
                                  {order.total.toLocaleString('ru-RU')} ₽
                                </p>
                                <p className="text-sm text-[#16A34A]">
                                  Экономия: {(order.total * (currentTier.discount / 100)).toLocaleString('ru-RU')} ₽
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2 mb-4">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm">
                                  <div className="w-8 h-8 bg-[#F5F5F5] rounded flex items-center justify-center">
                                    <Package className="w-4 h-4 text-[#9CA3AF]" />
                                  </div>
                                  <span className="flex-1 text-[#1F2937]">{item.name}</span>
                                  <span className="text-[#6B7280]">{item.weight} г × {item.quantity} шт</span>
                                  <span className="font-medium">
                                    {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                                <Truck className="w-4 h-4" />
                                <span>{getDeliveryServiceName(order.delivery.type)} — {order.delivery.city}</span>
                              </div>
                              <Button variant="outline" size="sm" className="border-[#D1D5DB]">
                                <Download className="w-4 h-4 mr-2" />
                                Счёт
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Documents Tab */}
                {activeTab === 'documents' && (
                  <Card className="border-[#E5E7EB]">
                    <CardHeader>
                      <CardTitle className="text-lg">Документы</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { name: 'Договор поставки №45 от 01.01.2024', type: 'PDF', date: '01.01.2024' },
                        { name: 'Прайс-лист (оптовый)', type: 'XLSX', date: '15.01.2024' },
                        { name: 'Реквизиты компании', type: 'PDF', date: '01.01.2024' },
                        { name: 'Сертификаты на продукцию', type: 'PDF', date: '10.01.2024' },
                      ].map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-[#9CA3AF]" />
                            <div>
                              <p className="font-medium text-[#1F2937]">{doc.name}</p>
                              <p className="text-sm text-[#6B7280]">{doc.type} • {doc.date}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="border-[#D1D5DB]">
                            <Download className="w-4 h-4 mr-2" />
                            Скачать
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Delivery Tab */}
                {activeTab === 'delivery' && (
                  <Card className="border-[#E5E7EB]">
                    <CardHeader>
                      <CardTitle className="text-lg">Доставка</CardTitle>
                      <CardDescription>
                        Доступные транспортные компании для доставки по России
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { name: 'СДЭК', description: 'Курьерская доставка и ПВЗ по всей России' },
                        { name: 'ПЭК', description: 'Грузоперевозки по России и СНГ' },
                        { name: 'Деловые Линии', description: 'Крупногабаритные грузы и паллеты' },
                        { name: 'Dalli', description: 'Курьерская доставка по Москве и СПб' },
                      ].map((service, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-4 border border-[#E5E7EB] rounded-lg"
                        >
                          <div className="w-12 h-12 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                            <Truck className="w-6 h-6 text-[#9CA3AF]" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-[#1F2937]">{service.name}</p>
                            <p className="text-sm text-[#6B7280]">{service.description}</p>
                          </div>
                          <Check className="w-5 h-5 text-[#16A34A]" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Company Tab */}
                {activeTab === 'company' && (
                  <Card className="border-[#E5E7EB]">
                    <CardHeader>
                      <CardTitle className="text-lg">Реквизиты компании</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#6B7280]">Название</p>
                          <p className="font-medium text-[#1F2937]">{wholesaleCompany.companyName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280]">ИНН</p>
                          <p className="font-medium text-[#1F2937]">{wholesaleCompany.inn}</p>
                        </div>
                        {wholesaleCompany.kpp && (
                          <div>
                            <p className="text-sm text-[#6B7280]">КПП</p>
                            <p className="font-medium text-[#1F2937]">{wholesaleCompany.kpp}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-[#6B7280]">Директор</p>
                          <p className="font-medium text-[#1F2937]">{wholesaleCompany.directorName}</p>
                        </div>
                      </div>

                      <Separator className="bg-[#E5E7EB]" />

                      <div>
                        <p className="text-sm text-[#6B7280] mb-1">Юридический адрес</p>
                        <p className="font-medium text-[#1F2937]">{wholesaleCompany.legalAddress}</p>
                      </div>

                      {wholesaleCompany.actualAddress && (
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Фактический адрес</p>
                          <p className="font-medium text-[#1F2937]">{wholesaleCompany.actualAddress}</p>
                        </div>
                      )}

                      <Separator className="bg-[#E5E7EB]" />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Контактный телефон</p>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-[#9CA3AF]" />
                            <span className="font-medium text-[#1F2937]">{wholesaleCompany.contactPhone}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280] mb-1">Email</p>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#9CA3AF]" />
                            <span className="font-medium text-[#1F2937]">{wholesaleCompany.contactEmail}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-4 bg-[#F0FDF4] rounded-lg">
                        <Check className="w-5 h-5 text-[#16A34A]" />
                        <span className="text-sm text-[#166534]">
                          Компания верифицирована • Доступ к оптовым ценам открыт
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
