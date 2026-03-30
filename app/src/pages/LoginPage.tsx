import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  User, 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Check,
  AlertCircle,
  Gift,
  Percent,
  Truck,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useCartStore, WHOLESALE_TIERS } from '@/store/cartStore'
import Header from '@/sections/Header'
import Footer from '@/sections/Footer'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setCustomerType, setWholesaleCompany, customerType } = useCartStore()
  
  const typeFromUrl = searchParams.get('type') as 'retail' | 'wholesale' | null
  const [activeTab, setActiveTab] = useState<'retail' | 'wholesale'>(typeFromUrl || customerType)
  
  // Устанавливаем тип клиента из URL при загрузке
  useEffect(() => {
    if (typeFromUrl) {
      setCustomerType(typeFromUrl)
    }
  }, [typeFromUrl, setCustomerType])
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Retail login form
  const [retailForm, setRetailForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  
  // Wholesale login form
  const [wholesaleForm, setWholesaleForm] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const handleRetailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock successful login
    setCustomerType('retail')
    setIsLoading(false)
    navigate('/account')
  }

  const handleWholesaleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock successful login
    setCustomerType('wholesale')
    setWholesaleCompany({
      inn: '7701234567',
      companyName: 'ООО "Кофе Партнёр"',
      legalAddress: 'г. Москва, ул. Примерная, д. 1',
      directorName: 'Иванов Иван Иванович',
      contactPhone: '+7 (999) 999-99-99',
      contactEmail: wholesaleForm.email,
      tier: WHOLESALE_TIERS[1],
      isVerified: true,
      verificationDate: new Date().toISOString(),
    })
    
    setIsLoading(false)
    navigate('/account')
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center mb-10"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-3">
                Вход в личный кабинет
              </h1>
              <p className="text-[#6B7280] max-w-xl mx-auto">
                Войдите для доступа к истории заказов, бонусным баллам и персональным предложениям
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Login Form */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="lg:col-span-3"
              >
                <Card className="border-[#E5E7EB]">
                  <CardHeader className="border-b border-[#E5E7EB]">
                    <Tabs 
                      value={activeTab} 
                      onValueChange={(v) => setActiveTab(v as 'retail' | 'wholesale')}
                    >
                      <TabsList className="grid w-full grid-cols-2 bg-[#F5F5F5]">
                        <TabsTrigger 
                          value="retail"
                          className="data-[state=active]:bg-white data-[state=active]:text-[#1F2937]"
                        >
                          <User className="w-4 h-4 mr-2" />
                          Розничный клиент
                        </TabsTrigger>
                        <TabsTrigger 
                          value="wholesale"
                          className="data-[state=active]:bg-white data-[state=active]:text-[#1F2937]"
                        >
                          <Building2 className="w-4 h-4 mr-2" />
                          Оптовый клиент
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    {error && (
                      <Alert className="mb-4 bg-[#FEF2F2] border-[#FECACA]">
                        <AlertCircle className="w-4 h-4 text-[#EF4444]" />
                        <AlertDescription className="text-[#DC2626]">{error}</AlertDescription>
                      </Alert>
                    )}

                    {activeTab === 'retail' ? (
                      <form onSubmit={handleRetailLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="retail-email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                            <Input
                              id="retail-email"
                              type="email"
                              placeholder="your@email.com"
                              className="pl-10"
                              value={retailForm.email}
                              onChange={(e) => setRetailForm({ ...retailForm, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="retail-password">Пароль</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                            <Input
                              id="retail-password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="••••••••"
                              className="pl-10 pr-10"
                              value={retailForm.password}
                              onChange={(e) => setRetailForm({ ...retailForm, password: e.target.value })}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="retail-remember"
                              checked={retailForm.rememberMe}
                              onCheckedChange={(checked) => 
                                setRetailForm({ ...retailForm, rememberMe: checked as boolean })
                              }
                            />
                            <Label htmlFor="retail-remember" className="text-sm cursor-pointer">
                              Запомнить меня
                            </Label>
                          </div>
                          <Link 
                            to="/forgot-password" 
                            className="text-sm text-[#0284C7] hover:underline"
                          >
                            Забыли пароль?
                          </Link>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-[#1F2937] hover:bg-[#374151] text-white h-11"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
                              Вход...
                            </>
                          ) : (
                            <>
                              Войти
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>

                        <Separator className="my-4" />

                        <p className="text-center text-sm text-[#6B7280]">
                          Ещё нет аккаунта?{' '}
                          <Link 
                            to="/register" 
                            className="text-[#0284C7] hover:underline font-medium"
                          >
                            Зарегистрироваться
                          </Link>
                        </p>
                      </form>
                    ) : (
                      <form onSubmit={handleWholesaleLogin} className="space-y-4">
                        <Alert className="bg-[#F0F9FF] border-[#7DD3FC]">
                          <Building2 className="w-4 h-4 text-[#0284C7]" />
                          <AlertDescription className="text-xs text-[#0369A1]">
                            Для доступа к оптовым ценам необходимо заключить договор и пройти верификацию
                          </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                          <Label htmlFor="wholesale-email">Email компании</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                            <Input
                              id="wholesale-email"
                              type="email"
                              placeholder="company@example.com"
                              className="pl-10"
                              value={wholesaleForm.email}
                              onChange={(e) => setWholesaleForm({ ...wholesaleForm, email: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="wholesale-password">Пароль</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                            <Input
                              id="wholesale-password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="••••••••"
                              className="pl-10 pr-10"
                              value={wholesaleForm.password}
                              onChange={(e) => setWholesaleForm({ ...wholesaleForm, password: e.target.value })}
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="wholesale-remember"
                              checked={wholesaleForm.rememberMe}
                              onCheckedChange={(checked) => 
                                setWholesaleForm({ ...wholesaleForm, rememberMe: checked as boolean })
                              }
                            />
                            <Label htmlFor="wholesale-remember" className="text-sm cursor-pointer">
                              Запомнить меня
                            </Label>
                          </div>
                          <Link 
                            to="/forgot-password" 
                            className="text-sm text-[#0284C7] hover:underline"
                          >
                            Забыли пароль?
                          </Link>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-[#1F2937] hover:bg-[#374151] text-white h-11"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="animate-spin mr-2">⏳</span>
                              Вход...
                            </>
                          ) : (
                            <>
                              Войти
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>

                        <Separator className="my-4" />

                        <p className="text-center text-sm text-[#6B7280]">
                          Нет доступа к опту?{' '}
                          <Link 
                            to="/register-wholesale" 
                            className="text-[#0284C7] hover:underline font-medium"
                          >
                            Подать заявку
                          </Link>
                        </p>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Benefits */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card className="border-[#E5E7EB] h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {activeTab === 'retail' ? 'Преимущества аккаунта' : 'Оптовое сотрудничество'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeTab === 'retail' ? (
                      <>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#F0FDF4] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Gift className="w-5 h-5 text-[#16A34A]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#1F2937]">Бонусная программа</p>
                            <p className="text-sm text-[#6B7280]">
                              Получайте баллы за покупки и заполнение профиля
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#F0F9FF] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Star className="w-5 h-5 text-[#0284C7]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#1F2937]">Персональные скидки</p>
                            <p className="text-sm text-[#6B7280]">
                              Специальные предложения для постоянных клиентов
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#F5F3FF] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Truck className="w-5 h-5 text-[#7C3AED]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#1F2937]">Быстрое оформление</p>
                            <p className="text-sm text-[#6B7280]">
                              Сохранённые адреса и данные для быстрого заказа
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Check className="w-5 h-5 text-[#D97706]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#1F2937]">История заказов</p>
                            <p className="text-sm text-[#6B7280]">
                              Отслеживайте все свои покупки в одном месте
                            </p>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#F0FDF4] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Percent className="w-5 h-5 text-[#16A34A]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#1F2937]">До 30% скидки</p>
                            <p className="text-sm text-[#6B7280]">
                              4 уровня скидок в зависимости от объёма заказов
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#F0F9FF] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Truck className="w-5 h-5 text-[#0284C7]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#1F2937]">Доставка ТК</p>
                            <p className="text-sm text-[#6B7280]">
                              СДЭК, ПЭК, Деловые Линии, Dalli по всей России
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#F5F3FF] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Building2 className="w-5 h-5 text-[#7C3AED]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#1F2937]">Закрытый каталог</p>
                            <p className="text-sm text-[#6B7280]">
                              Доступ к специальным позициям и оптовым упаковкам
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#FEF3C7] rounded-lg flex items-center justify-center flex-shrink-0">
                            <Check className="w-5 h-5 text-[#D97706]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#1F2937]">Персональный менеджер</p>
                            <p className="text-sm text-[#6B7280]">
                              Индивидуальное обслуживание и консультации
                            </p>
                          </div>
                        </div>

                        <Separator className="bg-[#E5E7EB]" />

                        <div className="space-y-2">
                          <p className="font-medium text-sm text-[#1F2937]">Уровни скидок:</p>
                          {WHOLESALE_TIERS.map((tier) => (
                            <div 
                              key={tier.level} 
                              className="flex justify-between text-sm"
                            >
                              <span className="text-[#6B7280]">{tier.name}</span>
                              <span className="font-medium text-[#16A34A]">-{tier.discount}%</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
