import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  User, 
  ShoppingBag, 
  Star, 
  Gift, 
  MapPin, 
  CreditCard, 
  Settings, 
  LogOut,
  ChevronRight,
  Package,
  Truck,
  Check,
  Clock,
  AlertCircle,
  Edit,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/cartStore'
import Header from '@/sections/Header'
import Footer from '@/sections/Footer'
import { cn } from '@/lib/utils'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

// Mock orders data
const MOCK_ORDERS = [
  {
    id: 'ADD-2024-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 2450,
    items: [
      { name: 'Addis House Blend', weight: 250, quantity: 2, price: 520 },
      { name: 'Addis Ethiopia Duo', weight: 250, quantity: 1, price: 580 },
    ],
    delivery: { type: 'yandex', address: 'г. Москва, ул. Тверская, д. 1' },
    bonusEarned: 24,
  },
  {
    id: 'ADD-2024-002',
    date: '2024-01-28',
    status: 'processing',
    total: 1700,
    items: [
      { name: 'Addis Classic 60/40', weight: 1000, quantity: 1, price: 1700 },
    ],
    delivery: { type: 'yandex', address: 'г. Москва, ул. Тверская, д. 1' },
    bonusEarned: 17,
  },
]

// Mock addresses
const MOCK_ADDRESSES = [
  {
    id: 1,
    name: 'Дом',
    address: 'г. Москва, ул. Тверская, д. 1, кв. 101',
    isDefault: true,
  },
  {
    id: 2,
    name: 'Работа',
    address: 'г. Москва, ул. Арбат, д. 10, офис 505',
    isDefault: false,
  },
]

export default function AccountPage() {
  const navigate = useNavigate()
  const { loyaltyProfile, setCustomerType, clearCart } = useCartStore()
  const [activeTab, setActiveTab] = useState('orders')

  const handleLogout = () => {
    setCustomerType('retail')
    clearCart()
    navigate('/')
  }

  const getStatusBadge = (status: string) => {
    const statuses: Record<string, { label: string; className: string; icon: any }> = {
      pending: { label: 'Ожидает подтверждения', className: 'bg-[#FEF3C7] text-[#92400E]', icon: Clock },
      processing: { label: 'В обработке', className: 'bg-[#F0F9FF] text-[#0369A1]', icon: Package },
      shipped: { label: 'Отправлен', className: 'bg-[#F5F3FF] text-[#7C3AED]', icon: Truck },
      delivered: { label: 'Доставлен', className: 'bg-[#F0FDF4] text-[#166534]', icon: Check },
      cancelled: { label: 'Отменён', className: 'bg-[#FEF2F2] text-[#DC2626]', icon: AlertCircle },
    }
    
    const config = statuses[status] || statuses.pending
    const Icon = config.icon
    
    return (
      <Badge className={cn(config.className, 'font-normal')}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
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
                  <h1 className="text-3xl font-bold text-[#1F2937]">Личный кабинет</h1>
                  <p className="text-[#6B7280]">Управляйте заказами, бонусами и настройками</p>
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
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#E5E7EB]">
                      <div className="w-12 h-12 bg-[#1F2937] rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1F2937]">Иван Иванов</p>
                        <p className="text-sm text-[#6B7280]">ivan@example.com</p>
                      </div>
                    </div>

                    {/* Bonus Card */}
                    <div className="bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] rounded-lg p-4 mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-5 h-5 text-[#16A34A]" />
                        <span className="text-sm text-[#166534]">Бонусные баллы</span>
                      </div>
                      <p className="text-3xl font-bold text-[#16A34A]">
                        {loyaltyProfile?.bonusPoints || 0}
                      </p>
                      <p className="text-xs text-[#6B7280] mt-1">
                        1 балл = 1 ₽ при оплате заказа
                      </p>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1">
                      {[
                        { id: 'orders', label: 'Мои заказы', icon: ShoppingBag },
                        { id: 'bonuses', label: 'Бонусная программа', icon: Gift },
                        { id: 'addresses', label: 'Адреса доставки', icon: MapPin },
                        { id: 'payment', label: 'Способы оплаты', icon: CreditCard },
                        { id: 'profile', label: 'Профиль', icon: Settings },
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
                {/* Orders Tab */}
                {activeTab === 'orders' && (
                  <Card className="border-[#E5E7EB]">
                    <CardHeader className="border-b border-[#E5E7EB]">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">История заказов</CardTitle>
                        <Link to="/category/espresso">
                          <Button size="sm" className="bg-[#1F2937] hover:bg-[#374151]">
                            <Plus className="w-4 h-4 mr-2" />
                            Новый заказ
                          </Button>
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {MOCK_ORDERS.length === 0 ? (
                        <div className="p-8 text-center">
                          <Package className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
                          <p className="text-[#6B7280] mb-4">У вас пока нет заказов</p>
                          <Link to="/category/espresso">
                            <Button className="bg-[#1F2937] hover:bg-[#374151]">
                              Перейти в каталог
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="divide-y divide-[#E5E7EB]">
                          {MOCK_ORDERS.map((order) => (
                            <div key={order.id} className="p-4 sm:p-6">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                <div>
                                  <div className="flex items-center gap-3 mb-1">
                                    <p className="font-medium text-[#1F2937]">Заказ {order.id}</p>
                                    {getStatusBadge(order.status)}
                                  </div>
                                  <p className="text-sm text-[#6B7280]">
                                    {new Date(order.date).toLocaleDateString('ru-RU', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                    })}
                                  </p>
                                </div>
                                <div className="text-left sm:text-right">
                                  <p className="text-xl font-bold text-[#1F2937]">{order.total} ₽</p>
                                  <p className="text-sm text-[#16A34A]">+{order.bonusEarned} баллов</p>
                                </div>
                              </div>

                              <div className="space-y-2 mb-4">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 bg-[#F5F5F5] rounded flex items-center justify-center">
                                      <Package className="w-4 h-4 text-[#9CA3AF]" />
                                    </div>
                                    <span className="flex-1 text-[#1F2937]">{item.name}</span>
                                    <span className="text-[#6B7280]">{item.weight} г × {item.quantity}</span>
                                    <span className="font-medium">{item.price * item.quantity} ₽</span>
                                  </div>
                                ))}
                              </div>

                              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                                <Truck className="w-4 h-4" />
                                <span>{order.delivery.address}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Bonuses Tab */}
                {activeTab === 'bonuses' && (
                  <Card className="border-[#E5E7EB]">
                    <CardHeader className="border-b border-[#E5E7EB]">
                      <CardTitle className="text-lg">Бонусная программа</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] rounded-xl p-6 mb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-[#166534] mb-1">Ваш баланс</p>
                            <p className="text-4xl font-bold text-[#16A34A]">
                              {loyaltyProfile?.bonusPoints || 0} баллов
                            </p>
                          </div>
                          <div className="w-16 h-16 bg-[#16A34A] rounded-full flex items-center justify-center">
                            <Gift className="w-8 h-8 text-white" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium text-[#1F2937]">Как получить больше баллов?</h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-[#F5F5F5] rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <ShoppingBag className="w-5 h-5 text-[#1F2937]" />
                              <span className="font-medium text-[#1F2937]">Покупки</span>
                            </div>
                            <p className="text-sm text-[#6B7280]">
                              Получайте 1 балл за каждые 100 ₽ в чеке
                            </p>
                          </div>
                          
                          <div className="p-4 bg-[#F5F5F5] rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-5 h-5 text-[#1F2937]" />
                              <span className="font-medium text-[#1F2937]">Профиль</span>
                            </div>
                            <p className="text-sm text-[#6B7280]">
                              Заполните профиль и получите до 120 баллов
                            </p>
                          </div>
                        </div>

                        <div className="p-4 bg-[#F0F9FF] rounded-lg border border-[#7DD3FC]">
                          <p className="text-sm text-[#0369A1]">
                            <strong>💡 Подсказка:</strong> Бонусные баллы начисляются после доставки заказа 
                            и могут быть использованы при оплате следующих покупок.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                  <Card className="border-[#E5E7EB]">
                    <CardHeader className="border-b border-[#E5E7EB]">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Адреса доставки</CardTitle>
                        <Button size="sm" variant="outline" className="border-[#D1D5DB]">
                          <Plus className="w-4 h-4 mr-2" />
                          Добавить
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {MOCK_ADDRESSES.map((address) => (
                          <div
                            key={address.id}
                            className={cn(
                              "p-4 rounded-lg border",
                              address.isDefault
                                ? "border-[#16A34A] bg-[#F0FDF4]"
                                : "border-[#E5E7EB]"
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <MapPin className={cn(
                                  "w-5 h-5 mt-0.5",
                                  address.isDefault ? "text-[#16A34A]" : "text-[#9CA3AF]"
                                )} />
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-[#1F2937]">{address.name}</span>
                                    {address.isDefault && (
                                      <Badge className="bg-[#16A34A] text-white text-xs">
                                        По умолчанию
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-[#6B7280]">{address.address}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button className="p-2 text-[#9CA3AF] hover:text-[#1F2937] transition-colors">
                                  <Edit className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Payment Tab */}
                {activeTab === 'payment' && (
                  <Card className="border-[#E5E7EB]">
                    <CardHeader className="border-b border-[#E5E7EB]">
                      <CardTitle className="text-lg">Способы оплаты</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="text-center py-8">
                        <CreditCard className="w-12 h-12 text-[#D1D5DB] mx-auto mb-4" />
                        <p className="text-[#6B7280] mb-4">У вас пока нет сохранённых карт</p>
                        <Button className="bg-[#1F2937] hover:bg-[#374151]">
                          <Plus className="w-4 h-4 mr-2" />
                          Добавить карту
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <Card className="border-[#E5E7EB]">
                    <CardHeader className="border-b border-[#E5E7EB]">
                      <CardTitle className="text-lg">Личные данные</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm text-[#6B7280]">Имя</Label>
                            <p className="font-medium text-[#1F2937]">Иван</p>
                          </div>
                          <div>
                            <Label className="text-sm text-[#6B7280]">Фамилия</Label>
                            <p className="font-medium text-[#1F2937]">Иванов</p>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-[#6B7280]">Email</Label>
                          <p className="font-medium text-[#1F2937]">ivan@example.com</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-[#6B7280]">Телефон</Label>
                          <p className="font-medium text-[#1F2937]">+7 (999) 999-99-99</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-[#6B7280]">Дата рождения</Label>
                          <p className="font-medium text-[#1F2937]">
                            {loyaltyProfile?.birthDate || 'Не указана'}
                          </p>
                        </div>
                        
                        <div>
                          <Label className="text-sm text-[#6B7280]">Пол</Label>
                          <p className="font-medium text-[#1F2937]">
                            {loyaltyProfile?.gender === 'male' ? 'Мужской' : 
                             loyaltyProfile?.gender === 'female' ? 'Женский' : 'Не указан'}
                          </p>
                        </div>

                        <Button variant="outline" className="border-[#D1D5DB]">
                          <Edit className="w-4 h-4 mr-2" />
                          Редактировать профиль
                        </Button>
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
