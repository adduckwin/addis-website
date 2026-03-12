import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Check,
  Phone,
  Calendar,
  Gift,
  Star,
  Info,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/store/cartStore'
import Header from '@/sections/Header'
import Footer from '@/sections/Footer'
import { cn } from '@/lib/utils'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const BONUS_POINTS = {
  birthDate: 50,
  gender: 30,
  phone: 20,
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { updateLoyaltyProfile } = useCartStore()
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    gender: '',
    agreePrivacy: false,
    agreeTerms: false,
    subscribeNews: true,
  })

  const calculateBonusPoints = () => {
    let points = 0
    if (formData.birthDate) points += BONUS_POINTS.birthDate
    if (formData.gender) points += BONUS_POINTS.gender
    if (formData.phone) points += BONUS_POINTS.phone
    return points
  }

  const isFormValid = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.email.trim() &&
      formData.password.trim() &&
      formData.password.length >= 6 &&
      formData.password === formData.confirmPassword &&
      formData.agreePrivacy &&
      formData.agreeTerms
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Save loyalty profile data
    updateLoyaltyProfile({
      birthDate: formData.birthDate,
      gender: formData.gender as 'male' | 'female',
    })
    
    setIsLoading(false)
    setIsComplete(true)
  }

  if (isComplete) {
    const bonusPoints = calculateBonusPoints()
    
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Header />
        
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="max-w-md mx-auto text-center"
            >
              <div className="w-20 h-20 bg-[#F0FDF4] rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-[#16A34A]" />
              </div>
              
              <h1 className="text-3xl font-bold text-[#1F2937] mb-3">
                Добро пожаловать!
              </h1>
              
              <p className="text-[#6B7280] mb-6">
                Ваш аккаунт успешно создан. Теперь вы можете совершать покупки и получать бонусы.
              </p>

              {bonusPoints > 0 && (
                <Card className="border-[#86EFAC] bg-gradient-to-r from-[#F0FDF4] to-white mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 bg-[#16A34A] rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-[#6B7280]">Вам начислено</p>
                        <p className="text-2xl font-bold text-[#16A34A]">{bonusPoints} баллов</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/account')}
                  className="w-full bg-[#1F2937] hover:bg-[#374151] text-white h-11"
                >
                  Перейти в личный кабинет
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/category/espresso')}
                  className="w-full border-[#D1D5DB]"
                >
                  Продолжить покупки
                </Button>
              </div>
            </motion.div>
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
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-3">
                Создать аккаунт
              </h1>
              <p className="text-[#6B7280]">
                Зарегистрируйтесь и получите бонусные баллы за заполнение профиля
              </p>
            </motion.div>

            {/* Bonus Points Preview */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="mb-6"
            >
              <div className="grid grid-cols-3 gap-3">
                <div className={cn(
                  "p-3 rounded-lg border text-center transition-colors",
                  formData.birthDate ? "bg-[#F0FDF4] border-[#86EFAC]" : "bg-[#F5F5F5] border-[#E5E7EB]"
                )}>
                  <Calendar className={cn(
                    "w-5 h-5 mx-auto mb-1",
                    formData.birthDate ? "text-[#16A34A]" : "text-[#9CA3AF]"
                  )} />
                  <p className="text-lg font-bold text-[#16A34A]">+{BONUS_POINTS.birthDate}</p>
                  <p className="text-xs text-[#6B7280]">Дата рождения</p>
                </div>
                
                <div className={cn(
                  "p-3 rounded-lg border text-center transition-colors",
                  formData.gender ? "bg-[#F0FDF4] border-[#86EFAC]" : "bg-[#F5F5F5] border-[#E5E7EB]"
                )}>
                  <User className={cn(
                    "w-5 h-5 mx-auto mb-1",
                    formData.gender ? "text-[#16A34A]" : "text-[#9CA3AF]"
                  )} />
                  <p className="text-lg font-bold text-[#16A34A]">+{BONUS_POINTS.gender}</p>
                  <p className="text-xs text-[#6B7280]">Пол</p>
                </div>
                
                <div className={cn(
                  "p-3 rounded-lg border text-center transition-colors",
                  formData.phone ? "bg-[#F0FDF4] border-[#86EFAC]" : "bg-[#F5F5F5] border-[#E5E7EB]"
                )}>
                  <Phone className={cn(
                    "w-5 h-5 mx-auto mb-1",
                    formData.phone ? "text-[#16A34A]" : "text-[#9CA3AF]"
                  )} />
                  <p className="text-lg font-bold text-[#16A34A]">+{BONUS_POINTS.phone}</p>
                  <p className="text-xs text-[#6B7280]">Телефон</p>
                </div>
              </div>
            </motion.div>

            {/* Registration Form */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Card className="border-[#E5E7EB]">
                <CardHeader className="border-b border-[#E5E7EB]">
                  <CardTitle className="text-lg">Регистрация</CardTitle>
                  <CardDescription>
                    Заполните все поля, чтобы получить максимум бонусов
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6">
                  {error && (
                    <Alert className="mb-4 bg-[#FEF2F2] border-[#FECACA]">
                      <AlertCircle className="w-4 h-4 text-[#EF4444]" />
                      <AlertDescription className="text-[#DC2626]">{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Имя *</Label>
                        <Input
                          id="firstName"
                          placeholder="Иван"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Фамилия *</Label>
                        <Input
                          id="lastName"
                          placeholder="Иванов"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center">
                        Телефон
                        <span className="ml-2 text-xs text-[#16A34A]">+{BONUS_POINTS.phone} баллов</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+7 (999) 999-99-99"
                          className="pl-10"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Birth Date */}
                    <div className="space-y-2">
                      <Label htmlFor="birthDate" className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Дата рождения
                        <span className="ml-2 text-xs text-[#16A34A]">+{BONUS_POINTS.birthDate} баллов</span>
                      </Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      />
                      <p className="text-xs text-[#6B7280]">
                        Мы пришлём вам подарок в день рождения 🎁
                      </p>
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <Label className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        Пол
                        <span className="ml-2 text-xs text-[#16A34A]">+{BONUS_POINTS.gender} баллов</span>
                      </Label>
                      <RadioGroup
                        value={formData.gender}
                        onValueChange={(value) => setFormData({ ...formData, gender: value })}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <Label htmlFor="male" className="cursor-pointer">Мужской</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <Label htmlFor="female" className="cursor-pointer">Женский</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password">Пароль *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Минимум 6 символов"
                          className="pl-10 pr-10"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          minLength={6}
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

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Подтверждение пароля *</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                        <Input
                          id="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          className="pl-10"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          required
                        />
                      </div>
                      {formData.password && formData.confirmPassword && 
                        formData.password !== formData.confirmPassword && (
                        <p className="text-xs text-[#EF4444]">Пароли не совпадают</p>
                      )}
                    </div>

                    {/* Agreements */}
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="agreePrivacy"
                          checked={formData.agreePrivacy}
                          onCheckedChange={(checked) => 
                            setFormData({ ...formData, agreePrivacy: checked as boolean })
                          }
                          required
                        />
                        <Label htmlFor="agreePrivacy" className="text-sm leading-tight cursor-pointer">
                          Я согласен с{' '}
                          <Link to="/privacy" target="_blank" className="text-[#0284C7] hover:underline">
                            Политикой конфиденциальности
                          </Link>
                          {' '}*'
                        </Label>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="agreeTerms"
                          checked={formData.agreeTerms}
                          onCheckedChange={(checked) => 
                            setFormData({ ...formData, agreeTerms: checked as boolean })
                          }
                          required
                        />
                        <Label htmlFor="agreeTerms" className="text-sm leading-tight cursor-pointer">
                          Я согласен с{' '}
                          <Link to="/terms" target="_blank" className="text-[#0284C7] hover:underline">
                            Условиями продажи
                          </Link>
                          {' '}*'
                        </Label>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="subscribeNews"
                          checked={formData.subscribeNews}
                          onCheckedChange={(checked) => 
                            setFormData({ ...formData, subscribeNews: checked as boolean })
                          }
                        />
                        <Label htmlFor="subscribeNews" className="text-sm leading-tight cursor-pointer">
                          Получать новости и специальные предложения
                        </Label>
                      </div>
                    </div>

                    <Alert className="bg-[#F0F9FF] border-[#7DD3FC]">
                      <Info className="w-4 h-4 text-[#0284C7]" />
                      <AlertDescription className="text-xs text-[#0369A1]">
                        Регистрируясь, вы автоматически加入ляете в программу лояльности 
                        и начинаете получать бонусные баллы за покупки.
                      </AlertDescription>
                    </Alert>

                    <Button
                      type="submit"
                      className="w-full bg-[#1F2937] hover:bg-[#374151] text-white h-11"
                      disabled={!isFormValid() || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Регистрация...
                        </>
                      ) : (
                        <>
                          <Gift className="w-4 h-4 mr-2" />
                          Создать аккаунт
                          {calculateBonusPoints() > 0 && ` (+${calculateBonusPoints()} баллов)`}
                        </>
                      )}
                    </Button>

                    <p className="text-center text-sm text-[#6B7280]">
                      Уже есть аккаунт?{' '}
                      <Link to="/login" className="text-[#0284C7] hover:underline font-medium">
                        Войти
                      </Link>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
