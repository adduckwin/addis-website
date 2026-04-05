import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Users, 
  Percent, 
  Settings, 
  LogOut,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Search,
  Check,
  TrendingUp,
  Calendar,
  Award,
  RotateCcw,
  ShoppingBag,
  CreditCard,
  BarChart3,
  Download,
  Upload,
  RefreshCw,
  Store,
  Gift,
  Tag,
  Building2,
  Link as LinkIcon,
  Image as ImageIcon,
  Bold,
  Italic,
  List,
  Undo2,
  AlertCircle,
  Clock,
  MapPin,
  UserCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { products as allProducts } from '@/data/products'
import { blogPosts } from '@/data/blog'
import { WHOLESALE_TIERS } from '@/store/cartStore'
import Header from '@/sections/Header'
import Footer from '@/sections/Footer'
import MediaGallery from '@/pages/MediaGallery'
import { cn } from '@/lib/utils'
import { format, subDays, isWithinInterval, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

// ============================================
// ТИПЫ И ИНТЕРФЕЙСЫ
// ============================================

interface Order {
  id: string
  userId: number
  userName: string
  userType: 'retail' | 'wholesale'
  date: string
  items: { productId: string; name: string; quantity: number; price: number; weight: 250 | 1000 }[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: string
  deliveryAddress?: string
  phone?: string
}

interface ProductSales {
  productId: string
  name: string
  category: string
  totalSold: number
  revenue: number
}

interface User {
  id: number
  name: string
  email: string
  type: 'retail' | 'wholesale'
  bonusPoints: number
  ordersCount: number
  lastOrder: string
  phone?: string
  // Wholesale specific
  tier?: number
  monthlyVolume?: number
  companyName?: string
  inn?: string
  isVerified?: boolean
  // One-time discount
  oneTimeDiscount?: number
  oneTimeDiscountExpiry?: string
}

interface PromoCode {
  id: string
  code: string
  discount: number
  type: 'percentage' | 'fixed'
  minOrder?: number
  maxUses?: number
  usedCount: number
  validFrom: string
  validUntil: string
  isActive: boolean
  applicableTo: 'all' | 'retail' | 'wholesale'
}

interface ItemDiscount {
  productId: string
  discount: number
  validFrom: string
  validUntil: string
  isActive: boolean
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  date: string
  image?: string
  author: string
  tags: string[]
}

// ============================================
// МОКОВЫЕ ДАННЫЕ
// ============================================

const MOCK_ORDERS: Order[] = [
  { id: 'ORD-1001', userId: 1, userName: 'Иван Петров', userType: 'retail', date: '2025-02-08', items: [{ productId: 'addis-classic', name: 'Addis Classic 60/40', quantity: 2, price: 1700, weight: 1000 }], total: 3400, status: 'delivered', paymentMethod: 'card', deliveryAddress: 'Москва, ул. Ленина 1', phone: '+7 900 123-45-67' },
  { id: 'ORD-1002', userId: 2, userName: 'ООО Кофе Плюс', userType: 'wholesale', date: '2025-02-08', items: [{ productId: 'addis-house', name: 'Addis House Blend', quantity: 10, price: 1520, weight: 1000 }], total: 15200, status: 'processing', paymentMethod: 'invoice', phone: '+7 901 234-56-78' },
  { id: 'ORD-1003', userId: 3, userName: 'Анна Сидорова', userType: 'retail', date: '2025-02-07', items: [{ productId: 'ethiopia-filter-g3', name: 'Ethiopia Filter G3', quantity: 1, price: 560, weight: 250 }], total: 560, status: 'shipped', paymentMethod: 'card', deliveryAddress: 'Москва, ул. Пушкина 10', phone: '+7 902 345-67-89' },
  { id: 'ORD-1004', userId: 4, userName: 'ИП Смирнов', userType: 'wholesale', date: '2025-02-07', items: [{ productId: 'brazil-fine-espresso', name: 'Brazil Fine Espresso', quantity: 5, price: 1360, weight: 1000 }], total: 6800, status: 'pending', paymentMethod: 'invoice', phone: '+7 903 456-78-90' },
  { id: 'ORD-1005', userId: 5, userName: 'Кофейня "Зерно"', userType: 'wholesale', date: '2025-02-06', items: [{ productId: 'kenya-espresso', name: 'Kenya Espresso', quantity: 8, price: 2000, weight: 1000 }, { productId: 'addis-bright', name: 'Addis Bright', quantity: 5, price: 1920, weight: 1000 }], total: 25600, status: 'delivered', paymentMethod: 'card', phone: '+7 904 567-89-01' },
  { id: 'ORD-1006', userId: 6, userName: 'Мария Козлова', userType: 'retail', date: '2025-02-06', items: [{ productId: 'drip-ethiopia', name: 'Drip Ethiopia', quantity: 3, price: 650, weight: 250 }], total: 1950, status: 'delivered', paymentMethod: 'card', deliveryAddress: 'Москва, пр. Мира 25', phone: '+7 905 678-90-12' },
  { id: 'ORD-1007', userId: 7, userName: 'ООО Арома', userType: 'wholesale', date: '2025-02-05', items: [{ productId: 'colombia-espresso', name: 'Colombia Espresso', quantity: 15, price: 1615, weight: 1000 }], total: 24225, status: 'processing', paymentMethod: 'invoice', phone: '+7 906 789-01-23' },
  { id: 'ORD-1008', userId: 8, userName: 'Дмитрий Волков', userType: 'retail', date: '2025-02-05', items: [{ productId: 'capsule-classic', name: 'Capsule Classic', quantity: 2, price: 750, weight: 250 }], total: 1500, status: 'cancelled', paymentMethod: 'card', phone: '+7 907 890-12-34' },
  { id: 'ORD-1009', userId: 9, userName: 'Кафе "Утро"', userType: 'wholesale', date: '2025-02-04', items: [{ productId: 'addis-business', name: 'Addis Business 80/20', quantity: 20, price: 1487, weight: 1000 }], total: 29740, status: 'delivered', paymentMethod: 'card', phone: '+7 908 901-23-45' },
  { id: 'ORD-1010', userId: 10, userName: 'Елена Новикова', userType: 'retail', date: '2025-02-04', items: [{ productId: 'ethiopia-g2-washed', name: 'Ethiopia G2 Washed', quantity: 1, price: 620, weight: 250 }], total: 620, status: 'shipped', paymentMethod: 'card', deliveryAddress: 'Москва, ул. Гагарина 5', phone: '+7 909 012-34-56' },
  { id: 'ORD-1011', userId: 11, userName: 'Ресторан "Вкус"', userType: 'wholesale', date: '2025-02-03', items: [{ productId: 'addis-dark-roast', name: 'Addis Dark Roast', quantity: 12, price: 1402, weight: 1000 }], total: 16824, status: 'delivered', paymentMethod: 'invoice', phone: '+7 910 123-45-67' },
  { id: 'ORD-1012', userId: 12, userName: 'Ольга Морозова', userType: 'retail', date: '2025-02-03', items: [{ productId: 'peru-filter', name: 'Peru Filter', quantity: 2, price: 480, weight: 250 }], total: 960, status: 'pending', paymentMethod: 'card', phone: '+7 911 234-56-78' },
  { id: 'ORD-1013', userId: 13, userName: 'Бар "Кофеин"', userType: 'wholesale', date: '2025-02-02', items: [{ productId: 'funky-lot-colombia', name: 'Funky Lot Colombia', quantity: 6, price: 2295, weight: 1000 }], total: 13770, status: 'processing', paymentMethod: 'card', phone: '+7 912 345-67-89' },
  { id: 'ORD-1014', userId: 14, userName: 'Сергей Павлов', userType: 'retail', date: '2025-02-02', items: [{ productId: 'addis-milk-blend', name: 'Addis Milk Blend', quantity: 1, price: 500, weight: 250 }], total: 500, status: 'delivered', paymentMethod: 'card', deliveryAddress: 'Москва, ул. Тверская 15', phone: '+7 913 456-78-90' },
  { id: 'ORD-1015', userId: 15, userName: 'ООО Кофе Трейд', userType: 'wholesale', date: '2025-02-01', items: [{ productId: 'addis-ethiopia-duo', name: 'Addis Ethiopia Duo', quantity: 25, price: 1680, weight: 1000 }], total: 42000, status: 'shipped', paymentMethod: 'invoice', phone: '+7 914 567-89-01' },
]

const MOCK_USERS: User[] = [
  { id: 1, name: 'Иван Петров', email: 'ivan@example.com', type: 'retail', bonusPoints: 150, ordersCount: 5, lastOrder: '2025-02-08', phone: '+7 900 123-45-67' },
  { id: 2, name: 'ООО Кофе Плюс', email: 'info@coffeeplus.ru', type: 'wholesale', bonusPoints: 0, tier: 2, monthlyVolume: 125000, ordersCount: 12, lastOrder: '2025-02-08', companyName: 'ООО Кофе Плюс', inn: '7701234567', isVerified: true, phone: '+7 901 234-56-78' },
  { id: 3, name: 'Анна Сидорова', email: 'anna@example.com', type: 'retail', bonusPoints: 75, ordersCount: 3, lastOrder: '2025-02-07', phone: '+7 902 345-67-89' },
  { id: 4, name: 'ИП Смирнов', email: 'smirnov@business.ru', type: 'wholesale', bonusPoints: 0, tier: 1, monthlyVolume: 65000, ordersCount: 8, lastOrder: '2025-02-07', companyName: 'ИП Смирнов А.В.', inn: '7709876543', isVerified: true, phone: '+7 903 456-78-90' },
  { id: 5, name: 'Кофейня "Зерно"', email: 'zerno@cafe.ru', type: 'wholesale', bonusPoints: 0, tier: 3, monthlyVolume: 280000, ordersCount: 24, lastOrder: '2025-02-06', companyName: 'ООО Зерно', inn: '7705554433', isVerified: true, phone: '+7 904 567-89-01' },
  { id: 6, name: 'Мария Козлова', email: 'maria@example.com', type: 'retail', bonusPoints: 230, ordersCount: 7, lastOrder: '2025-02-06', phone: '+7 905 678-90-12' },
  { id: 7, name: 'ООО Арома', email: 'aroma@business.ru', type: 'wholesale', bonusPoints: 0, tier: 2, monthlyVolume: 145000, ordersCount: 15, lastOrder: '2025-02-05', companyName: 'ООО Арома', inn: '7701112233', isVerified: false, phone: '+7 906 789-01-23' },
  { id: 8, name: 'Дмитрий Волков', email: 'dmitry@example.com', type: 'retail', bonusPoints: 45, ordersCount: 2, lastOrder: '2025-02-05', phone: '+7 907 890-12-34' },
  { id: 9, name: 'Кафе "Утро"', email: 'utro@cafe.ru', type: 'wholesale', bonusPoints: 0, tier: 3, monthlyVolume: 310000, ordersCount: 28, lastOrder: '2025-02-04', companyName: 'ИП Утро', inn: '7707778888', isVerified: true, phone: '+7 908 901-23-45' },
  { id: 10, name: 'Елена Новикова', email: 'elena@example.com', type: 'retail', bonusPoints: 120, ordersCount: 4, lastOrder: '2025-02-04', phone: '+7 909 012-34-56' },
  { id: 11, name: 'Ресторан "Вкус"', email: 'vkus@rest.ru', type: 'wholesale', bonusPoints: 0, tier: 2, monthlyVolume: 180000, ordersCount: 18, lastOrder: '2025-02-03', companyName: 'ООО Вкус', inn: '7709990000', isVerified: true, phone: '+7 910 123-45-67' },
  { id: 12, name: 'Ольга Морозова', email: 'olga@example.com', type: 'retail', bonusPoints: 85, ordersCount: 3, lastOrder: '2025-02-03', phone: '+7 911 234-56-78' },
  { id: 13, name: 'Бар "Кофеин"', email: 'caffeine@bar.ru', type: 'wholesale', bonusPoints: 0, tier: 1, monthlyVolume: 45000, ordersCount: 6, lastOrder: '2025-02-02', companyName: 'ООО Кофеин', inn: '7703334444', isVerified: false, phone: '+7 912 345-67-89' },
  { id: 14, name: 'Сергей Павлов', email: 'sergey@example.com', type: 'retail', bonusPoints: 200, ordersCount: 6, lastOrder: '2025-02-02', phone: '+7 913 456-78-90' },
  { id: 15, name: 'ООО Кофе Трейд', email: 'trade@coffee.ru', type: 'wholesale', bonusPoints: 0, tier: 4, monthlyVolume: 520000, ordersCount: 35, lastOrder: '2025-02-01', companyName: 'ООО Кофе Трейд', inn: '7706667777', isVerified: true, phone: '+7 914 567-89-01' },
  { id: 16, name: 'Наталья Васильева', email: 'natalia@example.com', type: 'retail', bonusPoints: 60, ordersCount: 2, lastOrder: '2025-01-28', phone: '+7 915 678-90-12' },
  { id: 17, name: 'Кофейня "Латте"', email: 'latte@cafe.ru', type: 'wholesale', bonusPoints: 0, tier: 1, monthlyVolume: 55000, ordersCount: 9, lastOrder: '2025-01-25', companyName: 'ИП Латте', inn: '7702223333', isVerified: true, phone: '+7 916 789-01-23' },
  { id: 18, name: 'Александр Кузнецов', email: 'alex@example.com', type: 'retail', bonusPoints: 300, ordersCount: 10, lastOrder: '2025-01-20', phone: '+7 917 890-12-34' },
  { id: 19, name: 'ООО Эспрессо', email: 'espresso@biz.ru', type: 'wholesale', bonusPoints: 0, tier: 2, monthlyVolume: 110000, ordersCount: 14, lastOrder: '2025-01-18', companyName: 'ООО Эспрессо', inn: '7704445555', isVerified: true, phone: '+7 918 901-23-45' },
  { id: 20, name: 'Татьяна Лебедева', email: 'tanya@example.com', type: 'retail', bonusPoints: 95, ordersCount: 4, lastOrder: '2025-01-15', phone: '+7 919 012-34-56' },
]

const MOCK_PROMO_CODES: PromoCode[] = [
  { id: '1', code: 'WELCOME15', discount: 15, type: 'percentage', minOrder: 1000, maxUses: 100, usedCount: 45, validFrom: '2025-01-01', validUntil: '2025-12-31', isActive: true, applicableTo: 'retail' },
  { id: '2', code: 'COFFEE20', discount: 20, type: 'percentage', minOrder: 2000, maxUses: 50, usedCount: 12, validFrom: '2025-02-01', validUntil: '2025-02-28', isActive: true, applicableTo: 'retail' },
  { id: '3', code: 'WHOLESALE5', discount: 5, type: 'percentage', maxUses: 200, usedCount: 89, validFrom: '2025-01-01', validUntil: '2025-12-31', isActive: true, applicableTo: 'wholesale' },
  { id: '4', code: '500OFF', discount: 500, type: 'fixed', minOrder: 3000, maxUses: 30, usedCount: 8, validFrom: '2025-02-10', validUntil: '2025-03-10', isActive: true, applicableTo: 'all' },
  { id: '5', code: 'SUMMER10', discount: 10, type: 'percentage', maxUses: 500, usedCount: 0, validFrom: '2025-06-01', validUntil: '2025-08-31', isActive: false, applicableTo: 'retail' },
]

const MOCK_ITEM_DISCOUNTS: ItemDiscount[] = [
  { productId: 'addis-classic', discount: 10, validFrom: '2025-02-01', validUntil: '2025-02-28', isActive: true },
  { productId: 'brazil-fine-espresso', discount: 15, validFrom: '2025-02-10', validUntil: '2025-03-10', isActive: true },
]

// ============================================
// ГРУППЫ ТОВАРОВ
// ============================================

const PRODUCT_GROUPS = [
  { id: 'espresso', name: 'Эспрессо-смеси и моносорта', category: 'espresso' },
  { id: 'filter', name: 'Фильтр-кофе', category: 'filter' },
  { id: 'drip', name: 'Дрип-пакеты', category: 'drip' },
  { id: 'capsules', name: 'Капсулы', category: 'capsules' },
]

// ============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const getStatusBadge = (status: Order['status']) => {
  const styles = {
    pending: 'bg-amber-100 text-amber-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }
  const labels = {
    pending: 'Ожидает',
    processing: 'В обработке',
    shipped: 'Отправлен',
    delivered: 'Доставлен',
    cancelled: 'Отменён',
  }
  return <Badge className={styles[status]}>{labels[status]}</Badge>
}

// ============================================
// ОСНОВНОЙ КОМПОНЕНТ
// ============================================

export default function AdminPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  
  // Проверка авторизации
  useEffect(() => {
    const adminSession = sessionStorage.getItem('admin_session')
    if (adminSession !== 'active') {
      navigate('/admin-login')
    }
  }, [navigate])

  const handleLogout = () => {
    sessionStorage.removeItem('admin_session')
    sessionStorage.removeItem('admin_login_time')
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Панель администратора</h1>
                <p className="text-gray-500">Управление товарами, заказами, пользователями и настройками</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-800">Администратор</Badge>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </Button>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Sidebar */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="lg:col-span-1"
            >
              <Card className="sticky top-24">
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    {[
                      { id: 'dashboard', label: 'Обзор', icon: LayoutDashboard },
                      { id: 'products', label: 'Товары', icon: Package },
                      { id: 'blog', label: 'Блог', icon: FileText },
                      { id: 'users', label: 'Пользователи', icon: Users },
                      { id: 'retail', label: 'Розница', icon: Store },
                      { id: 'discounts', label: 'Скидки', icon: Percent },
                      { id: 'media', label: 'Медиа', icon: ImageIcon },
                      { id: 'settings', label: 'Настройки', icon: Settings },
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                            activeTab === item.id
                              ? "bg-gray-900 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm">{item.label}</span>
                          {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
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
              className="lg:col-span-4"
            >
              <AnimatePresence mode="wait">
                {activeTab === 'dashboard' && <DashboardTab key="dashboard" />}
                {activeTab === 'products' && <ProductsTab key="products" />}
                {activeTab === 'blog' && <BlogTab key="blog" />}
                {activeTab === 'users' && <UsersTab key="users" />}
                {activeTab === 'retail' && <RetailTab key="retail" />}
                {activeTab === 'discounts' && <DiscountsTab key="discounts" />}
                {activeTab === 'media' && <MediaGallery key="media" />}
                {activeTab === 'settings' && <SettingsTab key="settings" />}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// ============================================
// ВКЛАДКА: ОБЗОР (DASHBOARD)
// ============================================

function DashboardTab() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [showOrderDialog, setShowOrderDialog] = useState(false)

  // Фильтрация заказов по дате
  const filteredOrders = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return MOCK_ORDERS
    return MOCK_ORDERS.filter(order => {
      const orderDate = parseISO(order.date)
      return isWithinInterval(orderDate, { start: dateRange.from!, end: dateRange.to! })
    })
  }, [dateRange])

  // Метрики
  const metrics = useMemo(() => {
    const totalOrders = filteredOrders.length
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0)
    const avgCheck = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
    const avgItems = totalOrders > 0 
      ? Math.round(filteredOrders.reduce((sum, o) => sum + o.items.length, 0) / totalOrders * 10) / 10 
      : 0
    const retailOrders = filteredOrders.filter(o => o.userType === 'retail').length
    const wholesaleOrders = filteredOrders.filter(o => o.userType === 'wholesale').length
    
    return { totalOrders, totalRevenue, avgCheck, avgItems, retailOrders, wholesaleOrders }
  }, [filteredOrders])

  // Топ-10 товаров
  const topProducts = useMemo(() => {
    const sales: Record<string, ProductSales> = {}
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!sales[item.productId]) {
          const product = allProducts.find(p => p.id === item.productId)
          sales[item.productId] = {
            productId: item.productId,
            name: item.name,
            category: product?.category || 'unknown',
            totalSold: 0,
            revenue: 0,
          }
        }
        sales[item.productId].totalSold += item.quantity
        sales[item.productId].revenue += item.price * item.quantity
      })
    })
    return Object.values(sales)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10)
  }, [filteredOrders])

  // Счётчики продаж с момента запуска
  const [productCounters, setProductCounters] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('addis_product_counters')
    if (saved) return JSON.parse(saved)
    // Инициализация из всех заказов
    const counters: Record<string, number> = {}
    MOCK_ORDERS.forEach(order => {
      order.items.forEach(item => {
        counters[item.productId] = (counters[item.productId] || 0) + item.quantity
      })
    })
    return counters
  })

  // Сохранение счётчиков при изменении
  useEffect(() => {
    localStorage.setItem('addis_product_counters', JSON.stringify(productCounters))
  }, [productCounters])

  const resetCounters = () => {
    if (confirm('Вы уверены, что хотите сбросить все счётчики продаж?')) {
      setProductCounters({})
    }
  }

  const exportData = () => {
    const data = {
      orders: filteredOrders,
      metrics,
      topProducts,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `addis-report-${format(new Date(), 'yyyy-MM-dd')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Фильтр по дате и экспорт */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-500">Период:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[280px] justify-start text-left">
                    <Calendar className="w-4 h-4 mr-2" />
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, 'dd.MM.yyyy')} - {format(dateRange.to, 'dd.MM.yyyy')}
                        </>
                      ) : (
                        format(dateRange.from, 'dd.MM.yyyy')
                      )
                    ) : (
                      'Выберите даты'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button variant="outline" onClick={exportData}>
              <Download className="w-4 h-4 mr-2" />
              Экспорт отчёта
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Метрики */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Заказов</p>
                <p className="text-2xl font-bold">{metrics.totalOrders}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2 flex gap-2 text-xs">
              <span className="text-green-600">Р: {metrics.retailOrders}</span>
              <span className="text-blue-600">О: {metrics.wholesaleOrders}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Выручка</p>
                <p className="text-2xl font-bold">{metrics.totalRevenue.toLocaleString()} ₽</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Средний чек</p>
                <p className="text-2xl font-bold">{metrics.avgCheck.toLocaleString()} ₽</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Среднее позиций</p>
                <p className="text-2xl font-bold">{metrics.avgItems}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Последние заказы */}
        <Card>
          <CardHeader>
            <CardTitle>Заказы за период</CardTitle>
            <CardDescription>Нажмите на заказ для просмотра деталей</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {filteredOrders.map((order) => (
                  <button
                    key={order.id}
                    onClick={() => { setSelectedOrder(order); setShowOrderDialog(true) }}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{order.id}</span>
                        <Badge className={order.userType === 'wholesale' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                          {order.userType === 'wholesale' ? 'Опт' : 'Розница'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">{order.userName} • {format(parseISO(order.date), 'dd.MM.yyyy')}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{order.total.toLocaleString()} ₽</span>
                      <div className="mt-1">{getStatusBadge(order.status)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Топ-10 товаров */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Топ-10 товаров</CardTitle>
              <CardDescription>Счётчики с момента запуска</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={resetCounters}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Сбросить
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {topProducts.map((product, idx) => (
                  <div key={product.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.totalSold} шт</p>
                      <p className="text-xs text-gray-500">{product.revenue.toLocaleString()} ₽</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Диалог деталей заказа */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Заказ {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              {selectedOrder && format(parseISO(selectedOrder.date), 'dd MMMM yyyy', { locale: ru })}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Клиент</p>
                  <p className="font-medium">{selectedOrder.userName}</p>
                  <Badge className={selectedOrder.userType === 'wholesale' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                    {selectedOrder.userType === 'wholesale' ? 'Оптовый' : 'Розничный'}
                  </Badge>
                </div>
                {getStatusBadge(selectedOrder.status)}
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Товары</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{item.name} ({item.weight}г) × {item.quantity}</span>
                      <span className="text-sm font-medium">{(item.price * item.quantity).toLocaleString()} ₽</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Способ оплаты</p>
                  <p className="font-medium">{selectedOrder.paymentMethod === 'card' ? 'Карта' : 'Счёт'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Телефон</p>
                  <p className="font-medium">{selectedOrder.phone}</p>
                </div>
              </div>
              
              {selectedOrder.deliveryAddress && (
                <div>
                  <p className="text-sm text-gray-500">Адрес доставки</p>
                  <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-lg font-medium">Итого</span>
                <span className="text-2xl font-bold">{selectedOrder.total.toLocaleString()} ₽</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}


// ============================================
// ВКЛАДКА: ТОВАРЫ (PRODUCTS)
// ============================================

function ProductsTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<string>('all')
  const [showDeleted, setShowDeleted] = useState(false)
  const [editingProduct, setEditingProduct] = useState<typeof allProducts[0] | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [deletedProducts, setDeletedProducts] = useState<string[]>(() => {
    const saved = localStorage.getItem('addis_deleted_products')
    return saved ? JSON.parse(saved) : []
  })

  // Фильтрация товаров
  const filteredProducts = useMemo(() => {
    let products = allProducts.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    
    if (selectedGroup !== 'all') {
      products = products.filter(p => p.category === selectedGroup)
    }
    
    if (!showDeleted) {
      products = products.filter(p => !deletedProducts.includes(p.id))
    }
    
    return products
  }, [searchQuery, selectedGroup, showDeleted, deletedProducts])

  // Группировка товаров
  const groupedProducts = useMemo(() => {
    const groups: Record<string, typeof allProducts> = {}
    filteredProducts.forEach(product => {
      if (!groups[product.category]) groups[product.category] = []
      groups[product.category].push(product)
    })
    return groups
  }, [filteredProducts])

  const handleDelete = (productId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      const newDeleted = [...deletedProducts, productId]
      setDeletedProducts(newDeleted)
      localStorage.setItem('addis_deleted_products', JSON.stringify(newDeleted))
    }
  }

  const handleRestore = (productId: string) => {
    const newDeleted = deletedProducts.filter(id => id !== productId)
    setDeletedProducts(newDeleted)
    localStorage.setItem('addis_deleted_products', JSON.stringify(newDeleted))
  }

  const handleSaveProduct = (product: typeof allProducts[0]) => {
    // В реальном приложении здесь будет API запрос
    console.log('Saving product:', product)
    setShowEditDialog(false)
    setEditingProduct(null)
  }

  // Синхронизация с 1С
  const syncWith1C = () => {
    alert('Синхронизация с 1С запущена. Это может занять несколько минут.')
    // В реальном приложении здесь будет API запрос к 1С
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle>Управление товарами</CardTitle>
            <CardDescription>Всего товаров: {allProducts.length} | Активных: {allProducts.length - deletedProducts.length}</CardDescription>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Поиск товаров..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {PRODUCT_GROUPS.map(group => (
                  <SelectItem key={group.id} value={group.category}>{group.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <Switch checked={showDeleted} onCheckedChange={setShowDeleted} />
              <span className="text-sm text-gray-500">Показать удалённые</span>
            </div>
            <Button variant="outline" onClick={syncWith1C}>
              <RefreshCw className="w-4 h-4 mr-2" />
              1С
            </Button>
            <Button onClick={() => alert('Функция добавления товара будет доступна в полной версии')}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedProducts).map(([category, products]) => {
              const groupName = PRODUCT_GROUPS.find(g => g.category === category)?.name || category
              return (
                <div key={category}>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {groupName}
                    <Badge variant="secondary">{products.length}</Badge>
                  </h3>
                  <div className="space-y-2">
                    {products.map((product) => {
                      const isDeleted = deletedProducts.includes(product.id)
                      const isFilterCoffee = product.category === 'filter'
                      return (
                        <div 
                          key={product.id} 
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border",
                            isDeleted ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-100"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              isDeleted ? "bg-red-200" : "bg-gray-200"
                            )}>
                              <Package className="w-5 h-5 text-gray-500" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className={cn("font-medium", isDeleted && "line-through text-gray-400")}>
                                  {product.name}
                                </p>
                                {isDeleted && <Badge className="bg-red-100 text-red-800">Удалён</Badge>}
                                {isFilterCoffee && <Badge className="bg-amber-100 text-amber-800">Без скидок</Badge>}
                                {product.isNew && <Badge className="bg-green-100 text-green-800">Новинка</Badge>}
                                {product.isBestseller && <Badge className="bg-purple-100 text-purple-800">Хит</Badge>}
                              </div>
                              <p className="text-sm text-gray-500">
                                Розница: {product.price250}₽ / {product.price1000}₽ | 
                                Опт: {Math.round(product.price250 * 0.85)}₽ / {Math.round(product.price1000 * 0.85)}₽
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => { setEditingProduct(product); setShowEditDialog(true) }}
                              className="p-2 text-gray-400 hover:text-gray-600"
                              disabled={isDeleted}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {isDeleted ? (
                              <button 
                                onClick={() => handleRestore(product.id)}
                                className="p-2 text-gray-400 hover:text-green-600"
                              >
                                <Undo2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleDelete(product.id)}
                                className="p-2 text-gray-400 hover:text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Диалог редактирования товара */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактирование товара</DialogTitle>
            <DialogDescription>{editingProduct?.name}</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Название</Label>
                  <Input defaultValue={editingProduct.name} />
                </div>
                <div>
                  <Label>Тип</Label>
                  <Input defaultValue={editingProduct.type} />
                </div>
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea defaultValue={editingProduct.description} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Состав</Label>
                  <Input defaultValue={editingProduct.composition} />
                </div>
                <div>
                  <Label>Обжарка</Label>
                  <Input defaultValue={editingProduct.roast} />
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-3">Цены для розницы</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>250г (₽)</Label>
                    <Input type="number" defaultValue={editingProduct.price250} />
                  </div>
                  <div>
                    <Label>1000г (₽)</Label>
                    <Input type="number" defaultValue={editingProduct.price1000} />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Цены для опта (базовые)</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>250г (₽)</Label>
                    <Input type="number" defaultValue={Math.round(editingProduct.price250 * 0.85)} />
                  </div>
                  <div>
                    <Label>1000г (₽)</Label>
                    <Input type="number" defaultValue={Math.round(editingProduct.price1000 * 0.85)} />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Q-Grade</Label>
                  <Input defaultValue={editingProduct.qGrade} />
                </div>
                <div>
                  <Label>Рейтинг</Label>
                  <Input type="number" step="0.1" defaultValue={editingProduct.rating} />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch defaultChecked={editingProduct.isNew} />
                  <Label>Новинка</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked={editingProduct.isBestseller} />
                  <Label>Бестселлер</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch defaultChecked={editingProduct.category === 'filter'} disabled />
                  <Label>Фильтр (без скидок)</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>Отмена</Button>
                <Button onClick={() => handleSaveProduct(editingProduct)}>Сохранить</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

// ============================================
// ВКЛАДКА: БЛОГ (BLOG)
// ============================================

function BlogTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [posts, setPosts] = useState<BlogPost[]>(blogPosts.map(p => ({ ...p, author: 'Addis Coffee', tags: [] })))

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSavePost = () => {
    if (editingPost) {
      setPosts(posts.map(p => p.id === editingPost.id ? editingPost : p))
    }
    setShowEditDialog(false)
    setEditingPost(null)
  }

  const insertTag = (tag: string) => {
    if (editingPost) {
      setEditingPost({ ...editingPost, content: editingPost.content + tag })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Управление блогом</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Поиск статей..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => {
              const newPost: BlogPost = {
                id: `new-${Date.now()}`,
                title: 'Новая статья',
                slug: `new-article-${Date.now()}`,
                excerpt: '',
                content: '',
                category: 'Новости',
                date: format(new Date(), 'yyyy-MM-dd'),
                author: 'Addis Coffee',
                tags: [],
              }
              setEditingPost(newPost)
              setShowEditDialog(true)
            }}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">{post.title}</p>
                    <p className="text-sm text-gray-500">{post.category} • {post.date} • {post.author}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { setEditingPost(post); setShowEditDialog(true) }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Диалог редактирования статьи */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактирование статьи</DialogTitle>
          </DialogHeader>
          {editingPost && (
            <div className="space-y-4">
              <div>
                <Label>Заголовок</Label>
                <Input 
                  value={editingPost.title} 
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Slug (URL)</Label>
                  <Input 
                    value={editingPost.slug} 
                    onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Категория</Label>
                  <Select 
                    value={editingPost.category} 
                    onValueChange={(v) => setEditingPost({ ...editingPost, category: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Новости">Новости</SelectItem>
                      <SelectItem value="Обжарка">Обжарка</SelectItem>
                      <SelectItem value="Рецепты">Рецепты</SelectItem>
                      <SelectItem value="История">История</SelectItem>
                      <SelectItem value="Советы">Советы</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Краткое описание</Label>
                <Textarea 
                  value={editingPost.excerpt} 
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  rows={2}
                />
              </div>
              
              {/* Rich Text Toolbar */}
              <div>
                <Label>Контент</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-t-lg border">
                  <Button variant="ghost" size="sm" onClick={() => insertTag('<b></b>')}>
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => insertTag('<i></i>')}>
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="ghost" size="sm" onClick={() => insertTag('<h2></h2>')}>
                    H2
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => insertTag('<h3></h3>')}>
                    H3
                  </Button>
                  <Separator orientation="vertical" className="h-6" />
                  <Button variant="ghost" size="sm" onClick={() => insertTag('<ul>\n<li></li>\n</ul>')}>
                    <List className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => insertTag('<a href=""></a>')}>
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => insertTag('<img src="" alt="" />')}>
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                </div>
                <Textarea 
                  value={editingPost.content} 
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  rows={12}
                  className="rounded-t-none font-mono text-sm"
                  placeholder="HTML-контент статьи..."
                />
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Предпросмотр:</p>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: editingPost.content }}
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>Отмена</Button>
                <Button onClick={handleSavePost}>Сохранить</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}


// ============================================
// ВКЛАДКА: ПОЛЬЗОВАТЕЛИ (USERS)
// ============================================

function UsersTab() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showBonusDialog, setShowBonusDialog] = useState(false)
  const [showDiscountDialog, setShowDiscountDialog] = useState(false)
  const [showVerifyDialog, setShowVerifyDialog] = useState(false)
  const [bonusAmount, setBonusAmount] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [discountExpiry, setDiscountExpiry] = useState('')
  const [users, setUsers] = useState<User[]>(MOCK_USERS)

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.inn?.includes(searchQuery)
  )

  const handleAddBonus = () => {
    if (selectedUser && bonusAmount) {
      setUsers(users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, bonusPoints: u.bonusPoints + parseInt(bonusAmount) }
          : u
      ))
      setShowBonusDialog(false)
      setBonusAmount('')
      setSelectedUser(null)
    }
  }

  const handleAssignDiscount = () => {
    if (selectedUser && discountPercent && discountExpiry) {
      setUsers(users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, oneTimeDiscount: parseInt(discountPercent), oneTimeDiscountExpiry: discountExpiry }
          : u
      ))
      setShowDiscountDialog(false)
      setDiscountPercent('')
      setDiscountExpiry('')
      setSelectedUser(null)
    }
  }

  const handleVerify = () => {
    if (selectedUser) {
      setUsers(users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, isVerified: true }
          : u
      ))
      setShowVerifyDialog(false)
      setSelectedUser(null)
    }
  }

  // Проверка регулярности заказов
  const checkRegularity = (userId: number): boolean => {
    const userOrders = MOCK_ORDERS.filter(o => o.userId === userId)
    if (userOrders.length < 2) return false
    const sorted = userOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = new Date(sorted[i].date)
      const next = new Date(sorted[i + 1].date)
      const diffDays = (current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24)
      if (diffDays > 35) return false
    }
    return true
  }

  // Расчет прогресса к следующему уровню
  const getProgressToNextTier = (user: User) => {
    if (user.type !== 'wholesale') return null
    const currentTier = WHOLESALE_TIERS.find(t => t.level === (user.tier || 1))
    const nextTier = WHOLESALE_TIERS.find(t => t.level === (user.tier || 1) + 1)
    if (!nextTier) return null
    const progress = Math.min(100, ((user.monthlyVolume || 0) / nextTier.minOrder) * 100)
    return { currentTier, nextTier, progress, remaining: nextTier.minOrder - (user.monthlyVolume || 0) }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Пользователи</CardTitle>
            <CardDescription>Всего: {users.length} | Розница: {users.filter(u => u.type === 'retail').length} | Опт: {users.filter(u => u.type === 'wholesale').length}</CardDescription>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Поиск по имени, email или ИНН..."
              className="pl-10 w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-2">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium">{user.name}</p>
                        <Badge className={user.type === 'wholesale' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                          {user.type === 'wholesale' ? 'Опт' : 'Розница'}
                        </Badge>
                        {user.type === 'wholesale' && (
                          <>
                            {!user.isVerified ? (
                              <Badge className="bg-amber-100 text-amber-800">Не верифицирован</Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800"><UserCheck className="w-3 h-3 mr-1" /> Верифицирован</Badge>
                            )}
                            <Badge className="bg-gray-100 text-gray-800">{WHOLESALE_TIERS.find(t => t.level === user.tier)?.name || 'Стартовый'}</Badge>
                          </>
                        )}
                        {user.oneTimeDiscount && new Date(user.oneTimeDiscountExpiry!) > new Date() && (
                          <Badge className="bg-purple-100 text-purple-800">Скидка {user.oneTimeDiscount}%</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {user.email} • {user.phone} • {user.ordersCount} заказов
                        {user.type === 'retail' && ` • ${user.bonusPoints} бонусов`}
                      </p>
                      {user.type === 'wholesale' && user.companyName && (
                        <p className="text-xs text-gray-400">
                          {user.companyName} {user.inn && `• ИНН: ${user.inn}`} • Объём: {(user.monthlyVolume || 0).toLocaleString()} ₽
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.type === 'retail' && (
                      <>
                        <button 
                          onClick={() => { setSelectedUser(user); setShowBonusDialog(true) }}
                          className="px-3 py-1 text-sm bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200"
                          title="Начислить бонусы"
                        >
                          <Gift className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setSelectedUser(user); setShowDiscountDialog(true) }}
                          className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200"
                          title="Разовая скидка"
                        >
                          <Percent className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {user.type === 'wholesale' && !user.isVerified && (
                      <button 
                        onClick={() => { setSelectedUser(user); setShowVerifyDialog(true) }}
                        className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                        title="Верифицировать"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
                    {user.type === 'wholesale' && (
                      <button 
                        onClick={() => { setSelectedUser(user); setShowDiscountDialog(true) }}
                        className="px-3 py-1 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                      >
                        Скидка
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Диалог начисления бонусов */}
      <Dialog open={showBonusDialog} onOpenChange={setShowBonusDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Начислить бонусы</DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <>Клиент: <strong>{selectedUser.name}</strong><br />
                Текущий баланс: <strong>{selectedUser.bonusPoints} баллов</strong></>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Сумма начисления (баллов)</Label>
              <Input 
                type="number" 
                placeholder="Введите количество"
                value={bonusAmount}
                onChange={(e) => setBonusAmount(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBonusDialog(false)}>Отмена</Button>
              <Button onClick={handleAddBonus} disabled={!bonusAmount}>Начислить</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог разовой скидки */}
      <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Назначить разовую скидку</DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <>Клиент: <strong>{selectedUser.name}</strong></>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && selectedUser.type === 'wholesale' && (
            <div className="p-4 bg-gray-50 rounded-lg mb-4">
              <p className="text-sm text-gray-500 mb-2">Прогресс к следующему уровню</p>
              {getProgressToNextTier(selectedUser) ? (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gray-900 h-2 rounded-full transition-all"
                      style={{ width: `${getProgressToNextTier(selectedUser)?.progress}%` }}
                    />
                  </div>
                  <p className="text-sm">
                    Осталось: {(getProgressToNextTier(selectedUser)?.remaining || 0).toLocaleString()} ₽ 
                    до {getProgressToNextTier(selectedUser)?.nextTier?.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Регулярность: {checkRegularity(selectedUser.id) ? (
                      <span className="text-green-600">✓ Заказы каждый месяц</span>
                    ) : (
                      <span className="text-amber-600">⚠ Нерегулярные заказы</span>
                    )}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-500">Достигнут максимальный уровень</p>
              )}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <Label>Размер скидки (%)</Label>
              <Input 
                type="number" 
                min="1"
                max="100"
                placeholder="От 1 до 100"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
              />
            </div>
            <div>
              <Label>Действует до</Label>
              <Input 
                type="date"
                value={discountExpiry}
                onChange={(e) => setDiscountExpiry(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDiscountDialog(false)}>Отмена</Button>
              <Button onClick={handleAssignDiscount} disabled={!discountPercent || !discountExpiry}>Назначить</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог верификации */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Верификация компании</DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <>
                  <strong>{selectedUser.companyName}</strong><br />
                  ИНН: {selectedUser.inn}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                После верификации клиент сможет видеть оптовые цены и получать скидки.
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowVerifyDialog(false)}>Отмена</Button>
              <Button onClick={handleVerify} className="bg-green-600 hover:bg-green-700">Верифицировать</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

// ============================================
// ВКЛАДКА: РОЗНИЦА (RETAIL)
// ============================================

function RetailTab() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(MOCK_PROMO_CODES)
  const [itemDiscounts, setItemDiscounts] = useState<ItemDiscount[]>(MOCK_ITEM_DISCOUNTS)
  const [showPromoDialog, setShowPromoDialog] = useState(false)
  const [showItemDiscountDialog, setShowItemDiscountDialog] = useState(false)
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null)
  const [newItemDiscount, setNewItemDiscount] = useState<Partial<ItemDiscount>>({
    productId: '',
    discount: 10,
    validFrom: format(new Date(), 'yyyy-MM-dd'),
    validUntil: '',
    isActive: true,
  })

  const handleSavePromo = (promo: Partial<PromoCode>) => {
    if (editingPromo) {
      setPromoCodes(promoCodes.map(p => p.id === editingPromo.id ? { ...editingPromo, ...promo } as PromoCode : p))
    } else {
      const newPromo: PromoCode = {
        id: `promo-${Date.now()}`,
        code: promo.code || '',
        discount: promo.discount || 0,
        type: promo.type || 'percentage',
        minOrder: promo.minOrder,
        maxUses: promo.maxUses,
        usedCount: 0,
        validFrom: promo.validFrom || format(new Date(), 'yyyy-MM-dd'),
        validUntil: promo.validUntil || '',
        isActive: true,
        applicableTo: promo.applicableTo || 'all',
      }
      setPromoCodes([...promoCodes, newPromo])
    }
    setShowPromoDialog(false)
    setEditingPromo(null)
  }

  const togglePromoStatus = (id: string) => {
    setPromoCodes(promoCodes.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Tabs defaultValue="promocodes">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="promocodes">Промокоды</TabsTrigger>
          <TabsTrigger value="itemdiscounts">Скидки на товары</TabsTrigger>
        </TabsList>

        <TabsContent value="promocodes" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Промокоды</CardTitle>
                <CardDescription>Управление промокодами для клиентов</CardDescription>
              </div>
              <Button onClick={() => { setEditingPromo(null); setShowPromoDialog(true) }}>
                <Plus className="w-4 h-4 mr-2" />
                Создать
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {promoCodes.map((promo) => (
                  <div key={promo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Tag className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-mono font-bold text-lg">{promo.code}</p>
                          <Badge className={promo.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {promo.isActive ? 'Активен' : 'Неактивен'}
                          </Badge>
                          <Badge className={promo.type === 'percentage' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                            {promo.type === 'percentage' ? `${promo.discount}%` : `${promo.discount} ₽`}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          Использован: {promo.usedCount}{promo.maxUses ? ` / ${promo.maxUses}` : ''} • 
                          С {format(parseISO(promo.validFrom), 'dd.MM.yyyy')} по {format(parseISO(promo.validUntil), 'dd.MM.yyyy')} •
                          {promo.applicableTo === 'all' ? ' Все' : promo.applicableTo === 'retail' ? ' Розница' : ' Опт'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={promo.isActive} onCheckedChange={() => togglePromoStatus(promo.id)} />
                      <button 
                        onClick={() => { setEditingPromo(promo); setShowPromoDialog(true) }}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="itemdiscounts" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Скидки на товары</CardTitle>
                <CardDescription>Индивидуальные скидки на конкретные товары</CardDescription>
              </div>
              <Button onClick={() => setShowItemDiscountDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {itemDiscounts.map((discount) => {
                  const product = allProducts.find(p => p.id === discount.productId)
                  return (
                    <div key={discount.productId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Percent className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{product?.name}</p>
                            <Badge className={discount.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                              {discount.isActive ? 'Активна' : 'Неактивна'}
                            </Badge>
                            <Badge className="bg-red-100 text-red-800">-{discount.discount}%</Badge>
                          </div>
                          <p className="text-sm text-gray-500">
                            С {format(parseISO(discount.validFrom), 'dd.MM.yyyy')} по {format(parseISO(discount.validUntil), 'dd.MM.yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={discount.isActive} 
                          onCheckedChange={() => {
                            setItemDiscounts(itemDiscounts.map(d => 
                              d.productId === discount.productId ? { ...d, isActive: !d.isActive } : d
                            ))
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Диалог создания/редактирования промокода */}
      <Dialog open={showPromoDialog} onOpenChange={setShowPromoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPromo ? 'Редактировать' : 'Создать'} промокод</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Код</Label>
              <Input 
                defaultValue={editingPromo?.code} 
                placeholder="Например: COFFEE20"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Тип скидки</Label>
                <Select defaultValue={editingPromo?.type || 'percentage'}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Процент (%)</SelectItem>
                    <SelectItem value="fixed">Фиксированная (₽)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Размер</Label>
                <Input 
                  type="number" 
                  defaultValue={editingPromo?.discount} 
                  placeholder="20"
                />
              </div>
            </div>
            <div>
              <Label>Минимальный заказ (₽)</Label>
              <Input 
                type="number" 
                defaultValue={editingPromo?.minOrder} 
                placeholder="0"
              />
            </div>
            <div>
              <Label>Максимальное количество использований</Label>
              <Input 
                type="number" 
                defaultValue={editingPromo?.maxUses} 
                placeholder="Не ограничено"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Действует с</Label>
                <Input 
                  type="date" 
                  defaultValue={editingPromo?.validFrom || format(new Date(), 'yyyy-MM-dd')} 
                />
              </div>
              <div>
                <Label>Действует по</Label>
                <Input 
                  type="date" 
                  defaultValue={editingPromo?.validUntil} 
                />
              </div>
            </div>
            <div>
              <Label>Применяется к</Label>
              <Select defaultValue={editingPromo?.applicableTo || 'all'}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всем клиентам</SelectItem>
                  <SelectItem value="retail">Только розница</SelectItem>
                  <SelectItem value="wholesale">Только опт</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPromoDialog(false)}>Отмена</Button>
              <Button onClick={() => handleSavePromo({})}>Сохранить</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог добавления скидки на товар */}
      <Dialog open={showItemDiscountDialog} onOpenChange={setShowItemDiscountDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Добавить скидку на товар</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Товар</Label>
              <Select 
                value={newItemDiscount.productId} 
                onValueChange={(v) => setNewItemDiscount({ ...newItemDiscount, productId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите товар" />
                </SelectTrigger>
                <SelectContent>
                  {allProducts.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Скидка (%)</Label>
              <Input 
                type="number"
                min="1"
                max="99"
                value={newItemDiscount.discount}
                onChange={(e) => setNewItemDiscount({ ...newItemDiscount, discount: parseInt(e.target.value) })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>С</Label>
                <Input 
                  type="date"
                  value={newItemDiscount.validFrom}
                  onChange={(e) => setNewItemDiscount({ ...newItemDiscount, validFrom: e.target.value })}
                />
              </div>
              <div>
                <Label>По</Label>
                <Input 
                  type="date"
                  value={newItemDiscount.validUntil}
                  onChange={(e) => setNewItemDiscount({ ...newItemDiscount, validUntil: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowItemDiscountDialog(false)}>Отмена</Button>
              <Button onClick={() => {
                if (newItemDiscount.productId && newItemDiscount.validUntil) {
                  setItemDiscounts([...itemDiscounts, newItemDiscount as ItemDiscount])
                  setShowItemDiscountDialog(false)
                  setNewItemDiscount({
                    productId: '',
                    discount: 10,
                    validFrom: format(new Date(), 'yyyy-MM-dd'),
                    validUntil: '',
                    isActive: true,
                  })
                }
              }}>Добавить</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}


// ============================================
// ВКЛАДКА: СКИДКИ (DISCOUNTS)
// ============================================

function DiscountsTab() {
  const [tiers, setTiers] = useState(WHOLESALE_TIERS)
  const [editingTier, setEditingTier] = useState<typeof WHOLESALE_TIERS[0] | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [criteria, setCriteria] = useState({
    volume: true,
    regularity: true,
    loyalty: false,
  })

  const handleSaveTier = () => {
    if (editingTier) {
      setTiers(tiers.map(t => t.level === editingTier.level ? editingTier : t))
    }
    setShowEditDialog(false)
    setEditingTier(null)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Уровни оптовых скидок</CardTitle>
          <CardDescription>Настройка системы скидок для оптовых клиентов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tiers.map((tier) => (
              <div key={tier.level} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">{tier.discount}%</span>
                  </div>
                  <div>
                    <p className="font-medium text-lg">{tier.name}</p>
                    <p className="text-sm text-gray-500">Минимальный заказ: {tier.minOrder.toLocaleString()} ₽/мес</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-gray-100 text-gray-800">Уровень {tier.level}</Badge>
                  <button 
                    onClick={() => { setEditingTier(tier); setShowEditDialog(true) }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Критерии назначения скидок</CardTitle>
          <CardDescription>Автоматическое определение уровня клиента</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Объём заказов</p>
                  <p className="text-sm text-gray-500">Сумма заказов за календарный месяц</p>
                </div>
              </div>
              <Switch checked={criteria.volume} onCheckedChange={(v) => setCriteria({ ...criteria, volume: v })} />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Регулярность заказов</p>
                  <p className="text-sm text-gray-500">Минимум 1 заказ в месяц</p>
                </div>
              </div>
              <Switch checked={criteria.regularity} onCheckedChange={(v) => setCriteria({ ...criteria, regularity: v })} />
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Стаж сотрудничества</p>
                  <p className="text-sm text-gray-500">Учитывать время работы с клиентом</p>
                </div>
              </div>
              <Switch checked={criteria.loyalty} onCheckedChange={(v) => setCriteria({ ...criteria, loyalty: v })} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="w-4 h-4 text-blue-600" />
        <AlertDescription className="text-blue-700">
          <strong>Важно:</strong> Фильтр-кофе исключён из системы скидок. Оптовые цены на фильтр-кофе 
          рассчитываются отдельно и не зависят от уровня клиента.
        </AlertDescription>
      </Alert>

      {/* Диалог редактирования уровня */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Редактировать уровень</DialogTitle>
          </DialogHeader>
          {editingTier && (
            <div className="space-y-4">
              <div>
                <Label>Название</Label>
                <Input 
                  value={editingTier.name} 
                  onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Скидка (%)</Label>
                  <Input 
                    type="number"
                    value={editingTier.discount} 
                    onChange={(e) => setEditingTier({ ...editingTier, discount: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Уровень</Label>
                  <Input 
                    type="number"
                    value={editingTier.level} 
                    disabled
                  />
                </div>
              </div>
              <div>
                <Label>Минимальный заказ (₽/мес)</Label>
                <Input 
                  type="number"
                  value={editingTier.minOrder} 
                  onChange={(e) => setEditingTier({ ...editingTier, minOrder: parseInt(e.target.value) })}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowEditDialog(false)}>Отмена</Button>
                <Button onClick={handleSaveTier}>Сохранить</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

// ============================================
// ВКЛАДКА: НАСТРОЙКИ (SETTINGS)
// ============================================

function SettingsTab() {
  const [settings, setSettings] = useState({
    siteName: 'Addis Coffee',
    siteEmail: 'info@addis-coffee.ru',
    supportPhone: '+7 (999) 123-45-67',
    bonusEnabled: true,
    bonusPer100Rub: 1,
    bonusMaxUsage: 50,
    minOrderRetail: 1000,
    minOrderWholesale: 50000,
    deliveryEnabled: true,
    yandexDelivery: true,
    cdekEnabled: false,
    pekEnabled: false,
    delovieLiniiEnabled: false,
    daliEnabled: false,
    oneCEnabled: false,
    oneCUrl: '',
    oneCLogin: '',
    oneCPassword: '',
    companyApiEnabled: false,
    companyApiKey: '',
  })

  const [activeSection, setActiveSection] = useState('general')

  const saveSettings = () => {
    localStorage.setItem('addis_settings', JSON.stringify(settings))
    alert('Настройки сохранены')
  }

  const exportData = () => {
    const data = {
      products: allProducts,
      orders: MOCK_ORDERS,
      users: MOCK_USERS,
      settings,
      exportDate: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `addis-backup-${format(new Date(), 'yyyy-MM-dd')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target?.result as string)
          console.log('Imported data:', importedData)
          alert('Данные успешно импортированы. Перезагрузите страницу для применения изменений.')
        } catch {
          alert('Ошибка импорта данных')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="bonus">Бонусы</TabsTrigger>
          <TabsTrigger value="delivery">Доставка</TabsTrigger>
          <TabsTrigger value="integrations">Интеграции</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Общие настройки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Название сайта</Label>
                  <Input 
                    value={settings.siteName} 
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email для уведомлений</Label>
                  <Input 
                    value={settings.siteEmail} 
                    onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Телефон поддержки</Label>
                <Input 
                  value={settings.supportPhone} 
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Минимальный заказ (розница)</Label>
                  <Input 
                    type="number"
                    value={settings.minOrderRetail} 
                    onChange={(e) => setSettings({ ...settings, minOrderRetail: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Минимальный заказ (опт)</Label>
                  <Input 
                    type="number"
                    value={settings.minOrderWholesale} 
                    onChange={(e) => setSettings({ ...settings, minOrderWholesale: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Резервное копирование</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={exportData}>
                  <Download className="w-4 h-4 mr-2" />
                  Экспорт данных
                </Button>
                <Label className="flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Импорт данных
                  <input type="file" accept=".json" className="hidden" onChange={importData} />
                </Label>
              </div>
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <AlertDescription className="text-amber-700">
                  Импорт данных перезапишет текущие настройки. Рекомендуется сделать резервную копию перед импортом.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bonus" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Бонусная программа</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Включить бонусную программу</p>
                  <p className="text-sm text-gray-500">Клиенты смогут копить и тратить бонусы</p>
                </div>
                <Switch 
                  checked={settings.bonusEnabled} 
                  onCheckedChange={(v) => setSettings({ ...settings, bonusEnabled: v })}
                />
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Баллов за 100 ₽</Label>
                  <Input 
                    type="number"
                    value={settings.bonusPer100Rub} 
                    onChange={(e) => setSettings({ ...settings, bonusPer100Rub: parseInt(e.target.value) })}
                    disabled={!settings.bonusEnabled}
                  />
                </div>
                <div>
                  <Label>Макс. использование (%)</Label>
                  <Input 
                    type="number"
                    value={settings.bonusMaxUsage} 
                    onChange={(e) => setSettings({ ...settings, bonusMaxUsage: parseInt(e.target.value) })}
                    disabled={!settings.bonusEnabled}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="delivery" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки доставки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium">Яндекс Доставка</p>
                    <p className="text-sm text-gray-500">Для розничных заказов в Москве и МО</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.yandexDelivery} 
                  onCheckedChange={(v) => setSettings({ ...settings, yandexDelivery: v })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">СДЭК</p>
                    <p className="text-sm text-gray-500">Доставка по всей России</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.cdekEnabled} 
                  onCheckedChange={(v) => setSettings({ ...settings, cdekEnabled: v })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <TruckIcon className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">ПЭК (Первая Экспедиционная Компания)</p>
                    <p className="text-sm text-gray-500">Грузовая доставка для оптовых заказов</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.pekEnabled} 
                  onCheckedChange={(v) => setSettings({ ...settings, pekEnabled: v })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Деловые Линии</p>
                    <p className="text-sm text-gray-500">Грузоперевозки по России</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.delovieLiniiEnabled} 
                  onCheckedChange={(v) => setSettings({ ...settings, delovieLiniiEnabled: v })}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Dali (Доставка за один день)</p>
                    <p className="text-sm text-gray-500">Срочная доставка для оптовых клиентов</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.daliEnabled} 
                  onCheckedChange={(v) => setSettings({ ...settings, daliEnabled: v })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Интеграция с 1С</CardTitle>
              <CardDescription>Синхронизация цен и остатков</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Включить интеграцию</p>
                  <p className="text-sm text-gray-500">Автоматическая синхронизация с 1С</p>
                </div>
                <Switch 
                  checked={settings.oneCEnabled} 
                  onCheckedChange={(v) => setSettings({ ...settings, oneCEnabled: v })}
                />
              </div>
              <Separator />
              <div>
                <Label>URL сервера 1С</Label>
                <Input 
                  value={settings.oneCUrl} 
                  onChange={(e) => setSettings({ ...settings, oneCUrl: e.target.value })}
                  placeholder="https://1c.company.com/api"
                  disabled={!settings.oneCEnabled}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Логин</Label>
                  <Input 
                    value={settings.oneCLogin} 
                    onChange={(e) => setSettings({ ...settings, oneCLogin: e.target.value })}
                    disabled={!settings.oneCEnabled}
                  />
                </div>
                <div>
                  <Label>Пароль</Label>
                  <Input 
                    type="password"
                    value={settings.oneCPassword} 
                    onChange={(e) => setSettings({ ...settings, oneCPassword: e.target.value })}
                    disabled={!settings.oneCEnabled}
                  />
                </div>
              </div>
              <Button 
                variant="outline" 
                disabled={!settings.oneCEnabled}
                onClick={() => alert('Проверка соединения с 1С...')}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Проверить соединение
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API регистрации компаний</CardTitle>
              <CardDescription>Автозаполнение данных по ИНН</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Включить автозаполнение</p>
                  <p className="text-sm text-gray-500">Получение данных из ЕГРЮЛ/ЕГРИП по ИНН</p>
                </div>
                <Switch 
                  checked={settings.companyApiEnabled} 
                  onCheckedChange={(v) => setSettings({ ...settings, companyApiEnabled: v })}
                />
              </div>
              <Separator />
              <div>
                <Label>API-ключ</Label>
                <Input 
                  value={settings.companyApiKey} 
                  onChange={(e) => setSettings({ ...settings, companyApiKey: e.target.value })}
                  placeholder="Введите API-ключ сервиса"
                  disabled={!settings.companyApiEnabled}
                />
              </div>
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="w-4 h-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  Рекомендуемые сервисы: DaData.ru, Checko.com, Контур.Фокус
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={saveSettings} className="bg-gray-900 hover:bg-gray-800">
          <Check className="w-4 h-4 mr-2" />
          Сохранить все настройки
        </Button>
      </div>
    </motion.div>
  )
}

// Иконка грузовика
function TruckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    </svg>
  )
}
