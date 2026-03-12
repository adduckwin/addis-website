import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Building2, 
  User, 
  Lock, 
  ArrowRight, 
  Check,
  Percent,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Briefcase
} from 'lucide-react'
import { useCartStore, WHOLESALE_TIERS } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface WholesaleLoginFormProps {
  onClose: () => void
}

type AuthMode = 'login' | 'register'

interface LoginFormData {
  email: string
  password: string
}

interface RegisterFormData {
  companyName: string
  inn: string
  kpp: string
  legalAddress: string
  actualAddress: string
  directorName: string
  contactPhone: string
  contactEmail: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
}

export function WholesaleLoginForm({ onClose }: WholesaleLoginFormProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTierInfo, setShowTierInfo] = useState(false)
  
  const { setWholesaleCompany, wholesaleCompany } = useCartStore()

  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: '',
  })

  const [registerData, setRegisterData] = useState<RegisterFormData>({
    companyName: '',
    inn: '',
    kpp: '',
    legalAddress: '',
    actualAddress: '',
    directorName: '',
    contactPhone: '',
    contactEmail: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call for wholesale login
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock successful login
    setWholesaleCompany({
      inn: '7701234567',
      companyName: 'ООО "Кофе Партнёр"',
      legalAddress: 'г. Москва, ул. Примерная, д. 1',
      directorName: 'Иванов Иван Иванович',
      contactPhone: '+7 (999) 999-99-99',
      contactEmail: loginData.email,
      tier: WHOLESALE_TIERS[1], // Base tier
      isVerified: true,
      verificationDate: new Date().toISOString(),
    })
    
    setIsSubmitting(false)
    onClose()
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call for registration
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock successful registration (pending verification)
    setWholesaleCompany({
      inn: registerData.inn,
      companyName: registerData.companyName,
      legalAddress: registerData.legalAddress,
      actualAddress: registerData.actualAddress,
      directorName: registerData.directorName,
      contactPhone: registerData.contactPhone,
      contactEmail: registerData.contactEmail,
      tier: WHOLESALE_TIERS[0], // Starting tier
      isVerified: false,
    })
    
    setIsSubmitting(false)
  }

  const isLoginValid = () => {
    return loginData.email.trim() && loginData.password.trim()
  }

  const isRegisterValid = () => {
    return (
      registerData.companyName.trim() &&
      registerData.inn.trim() &&
      registerData.inn.length >= 10 &&
      registerData.legalAddress.trim() &&
      registerData.directorName.trim() &&
      registerData.contactPhone.trim() &&
      registerData.contactEmail.trim() &&
      registerData.password.trim() &&
      registerData.password.length >= 6 &&
      registerData.password === registerData.confirmPassword &&
      registerData.agreeTerms
    )
  }

  // Show pending verification state
  if (wholesaleCompany && !wholesaleCompany.isVerified) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-20 h-20 bg-[#FEF3C7] rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10 text-[#D97706]" />
        </div>
        <h3 className="text-2xl font-bold text-[#1F2937] mb-2">
          Регистрация принята
        </h3>
        <p className="text-[#6B7280] mb-6">
          Ваша заявка на регистрацию отправлена на рассмотрение. 
          Мы свяжемся с вами в ближайшее время для подтверждения.
        </p>
        <div className="bg-[#F5F5F5] rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-[#6B7280] mb-2">Реквизиты компании:</p>
          <p className="font-medium text-[#1F2937]">{wholesaleCompany.companyName}</p>
          <p className="text-sm text-[#6B7280]">ИНН: {wholesaleCompany.inn}</p>
        </div>
        <Button 
          onClick={onClose}
          className="bg-[#1F2937] hover:bg-[#374151] text-white"
        >
          Понятно
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tier Info Button */}
      <button
        onClick={() => setShowTierInfo(!showTierInfo)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between p-3 bg-[#F0FDF4] rounded-lg">
          <div className="flex items-center">
            <Percent className="w-5 h-5 text-[#16A34A] mr-2" />
            <span className="text-sm font-medium text-[#166534]">
              Узнать о системе скидок
            </span>
          </div>
          <ArrowRight className={cn(
            "w-4 h-4 text-[#16A34A] transition-transform",
            showTierInfo && "rotate-90"
          )} />
        </div>
      </button>

      {/* Tier Info Panel */}
      <AnimatePresence>
        {showTierInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-[#86EFAC]">
              <CardContent className="p-4">
                <h4 className="font-medium text-[#1F2937] mb-3">
                  Система оптовых скидок
                </h4>
                <div className="space-y-2">
                  {WHOLESALE_TIERS.map((tier, index) => (
                    <div
                      key={tier.level}
                      className={cn(
                        "flex items-center justify-between p-2 rounded",
                        index === 0 && "bg-[#F0FDF4]"
                      )}
                    >
                      <div className="flex items-center">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mr-2",
                          index === 0 ? "bg-[#16A34A] text-white" : "bg-[#E5E7EB] text-[#6B7280]"
                        )}>
                          {tier.level}
                        </div>
                        <div>
                          <p className="font-medium text-[#1F2937]">{tier.name}</p>
                          <p className="text-xs text-[#6B7280]">
                            от {tier.minOrder.toLocaleString('ru-RU')} ₽/мес
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#16A34A]">-{tier.discount}%</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#6B7280] mt-3">
                  * Скидка применяется автоматически на основе объёма заказов
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as AuthMode)}>
        <TabsList className="grid w-full grid-cols-2 bg-[#F5F5F5]">
          <TabsTrigger 
            value="login"
            className="data-[state=active]:bg-white data-[state=active]:text-[#1F2937]"
          >
            <User className="w-4 h-4 mr-2" />
            Вход
          </TabsTrigger>
          <TabsTrigger 
            value="register"
            className="data-[state=active]:bg-white data-[state=active]:text-[#1F2937]"
          >
            <Building2 className="w-4 h-4 mr-2" />
            Регистрация
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="mt-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="company@example.com"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Пароль *</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1F2937] hover:bg-[#374151] text-white"
              disabled={!isLoginValid() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Вход...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Войти
                </>
              )}
            </Button>

            <p className="text-xs text-center text-[#6B7280]">
              Для получения доступа к оптовым ценам необходимо заключить договор
            </p>
          </form>
        </TabsContent>

        <TabsContent value="register" className="mt-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="flex items-center">
                <Building2 className="w-4 h-4 mr-1" />
                Название организации *
              </Label>
              <Input
                id="companyName"
                placeholder='ООО "Компания"'
                value={registerData.companyName}
                onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inn">ИНН *</Label>
                <Input
                  id="inn"
                  placeholder="7701234567"
                  maxLength={12}
                  value={registerData.inn}
                  onChange={(e) => setRegisterData({ ...registerData, inn: e.target.value.replace(/\D/g, '') })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kpp">КПП</Label>
                <Input
                  id="kpp"
                  placeholder="770101001"
                  maxLength={9}
                  value={registerData.kpp}
                  onChange={(e) => setRegisterData({ ...registerData, kpp: e.target.value.replace(/\D/g, '') })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="legalAddress" className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Юридический адрес *
              </Label>
              <Input
                id="legalAddress"
                placeholder="г. Москва, ул. Примерная, д. 1"
                value={registerData.legalAddress}
                onChange={(e) => setRegisterData({ ...registerData, legalAddress: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="actualAddress" className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Фактический адрес
              </Label>
              <Input
                id="actualAddress"
                placeholder="г. Москва, ул. Примерная, д. 1"
                value={registerData.actualAddress}
                onChange={(e) => setRegisterData({ ...registerData, actualAddress: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="directorName" className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                ФИО директора *
              </Label>
              <Input
                id="directorName"
                placeholder="Иванов Иван Иванович"
                value={registerData.directorName}
                onChange={(e) => setRegisterData({ ...registerData, directorName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Контактный телефон *
                </Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  placeholder="+7 (999) 999-99-99"
                  value={registerData.contactPhone}
                  onChange={(e) => setRegisterData({ ...registerData, contactPhone: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail" className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Контактный email *
                </Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="company@example.com"
                  value={registerData.contactEmail}
                  onChange={(e) => setRegisterData({ ...registerData, contactEmail: e.target.value })}
                />
              </div>
            </div>

            <Separator className="bg-[#E5E7EB]" />

            <div className="space-y-2">
              <Label htmlFor="regPassword">Пароль *</Label>
              <Input
                id="regPassword"
                type="password"
                placeholder="Минимум 6 символов"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтверждение пароля *</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              />
              {registerData.password && registerData.confirmPassword && 
                registerData.password !== registerData.confirmPassword && (
                <p className="text-xs text-[#EF4444]">Пароли не совпадают</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeTerms"
                checked={registerData.agreeTerms}
                onCheckedChange={(checked) => 
                  setRegisterData({ ...registerData, agreeTerms: checked as boolean })
                }
              />
              <Label htmlFor="agreeTerms" className="text-sm leading-tight cursor-pointer">
                Я согласен с{' '}
                <a href="#/terms" target="_blank" className="text-[#0284C7] hover:underline">
                  условиями сотрудничества
                </a>
                {' '}и подтверждаю достоверность предоставленных данных *
              </Label>
            </div>

            <Alert className="bg-[#F0F9FF] border-[#7DD3FC]">
              <AlertCircle className="w-4 h-4 text-[#0284C7]" />
              <AlertDescription className="text-xs text-[#0369A1]">
                После регистрации ваш аккаунт будет проверен менеджером. 
                Доступ к оптовым ценам будет открыт после подтверждения.
              </AlertDescription>
            </Alert>

            <Button
              type="submit"
              className="w-full bg-[#1F2937] hover:bg-[#374151] text-white"
              disabled={!isRegisterValid() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Регистрация...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Зарегистрироваться
                </>
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
