import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Building2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Check,
  Phone,
  MapPin,
  Briefcase,
  Percent,
  AlertCircle,
  Info,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { useCartStore, WHOLESALE_TIERS } from '@/store/cartStore'
import Header from '@/sections/Header'
import Footer from '@/sections/Footer'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function WholesaleRegisterPage() {
  const navigate = useNavigate()
  const { setWholesaleCompany } = useCartStore()
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    // Company info
    companyName: '',
    inn: '',
    kpp: '',
    ogrn: '',
    legalAddress: '',
    actualAddress: '',
    
    // Director info
    directorName: '',
    directorPosition: 'Генеральный директор',
    
    // Contact info
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    
    // Account
    password: '',
    confirmPassword: '',
    
    // Agreements
    agreeTerms: false,
    agreeProcessing: false,
  })

  const isFormValid = () => {
    return (
      formData.companyName.trim() &&
      formData.inn.trim() &&
      formData.inn.length >= 10 &&
      formData.legalAddress.trim() &&
      formData.directorName.trim() &&
      formData.contactPhone.trim() &&
      formData.contactEmail.trim() &&
      formData.password.trim() &&
      formData.password.length >= 6 &&
      formData.password === formData.confirmPassword &&
      formData.agreeTerms &&
      formData.agreeProcessing
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Save wholesale company (pending verification)
    setWholesaleCompany({
      inn: formData.inn,
      kpp: formData.kpp,
      companyName: formData.companyName,
      legalAddress: formData.legalAddress,
      actualAddress: formData.actualAddress,
      directorName: formData.directorName,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
      tier: WHOLESALE_TIERS[0], // Starting tier
      isVerified: false,
    })
    
    setIsLoading(false)
    setIsComplete(true)
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <Header />
        
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="max-w-xl mx-auto text-center"
            >
              <div className="w-20 h-20 bg-[#FEF3C7] rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-[#D97706]" />
              </div>
              
              <h1 className="text-3xl font-bold text-[#1F2937] mb-3">
                Заявка отправлена
              </h1>
              
              <p className="text-[#6B7280] mb-6">
                Ваша заявка на регистрацию оптового клиента принята. 
                Наш менеджер свяжется с вами в ближайшее время для подтверждения.
              </p>

              <Card className="border-[#FCD34D] bg-[#FFFBEB] mb-6">
                <CardContent className="p-6 text-left">
                  <p className="text-sm text-[#92400E] mb-2">Реквизиты компании:</p>
                  <p className="font-medium text-[#1F2937]">{formData.companyName}</p>
                  <p className="text-sm text-[#6B7280]">ИНН: {formData.inn}</p>
                  <p className="text-sm text-[#6B7280]">Email: {formData.contactEmail}</p>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/login')}
                  className="w-full bg-[#1F2937] hover:bg-[#374151] text-white h-11"
                >
                  Перейти на страницу входа
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/category/espresso')}
                  className="w-full border-[#D1D5DB]"
                >
                  Смотреть каталог
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
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937] mb-3">
                Регистрация оптового клиента
              </h1>
              <p className="text-[#6B7280]">
                Заполните форму для получения доступа к оптовым ценам и специальным условиям
              </p>
            </motion.div>

            {/* Tier Info */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="mb-6"
            >
              <Card className="border-[#86EFAC] bg-gradient-to-r from-[#F0FDF4] to-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#16A34A] rounded-full flex items-center justify-center">
                      <Percent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1F2937]">Система скидок</p>
                      <p className="text-sm text-[#6B7280]">До 30% на весь ассортимент</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {WHOLESALE_TIERS.map((tier) => (
                      <div 
                        key={tier.level} 
                        className="text-center p-2 bg-white rounded-lg border border-[#E5E7EB]"
                      >
                        <p className="text-lg font-bold text-[#16A34A]">-{tier.discount}%</p>
                        <p className="text-xs text-[#6B7280]">{tier.name}</p>
                        <p className="text-xs text-[#9CA3AF]">от {tier.minOrder.toLocaleString('ru-RU')} ₽</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Registration Form */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Card className="border-[#E5E7EB]">
                <CardHeader className="border-b border-[#E5E7EB]">
                  <CardTitle className="text-lg flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Данные организации
                  </CardTitle>
                  <CardDescription>
                    Укажите реквизиты вашей компании
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6">
                  {error && (
                    <Alert className="mb-4 bg-[#FEF2F2] border-[#FECACA]">
                      <AlertCircle className="w-4 h-4 text-[#EF4444]" />
                      <AlertDescription className="text-[#DC2626]">{error}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Company Info Section */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Полное название организации *</Label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                          <Input
                            id="companyName"
                            placeholder='ООО "Компания"'
                            className="pl-10"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="inn">ИНН *</Label>
                          <Input
                            id="inn"
                            placeholder="7701234567"
                            maxLength={12}
                            value={formData.inn}
                            onChange={(e) => setFormData({ ...formData, inn: e.target.value.replace(/\D/g, '') })}
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="kpp">КПП</Label>
                          <Input
                            id="kpp"
                            placeholder="770101001"
                            maxLength={9}
                            value={formData.kpp}
                            onChange={(e) => setFormData({ ...formData, kpp: e.target.value.replace(/\D/g, '') })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="ogrn">ОГРН</Label>
                          <Input
                            id="ogrn"
                            placeholder="1157746123456"
                            maxLength={15}
                            value={formData.ogrn}
                            onChange={(e) => setFormData({ ...formData, ogrn: e.target.value.replace(/\D/g, '') })}
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
                          placeholder="г. Москва, ул. Примерная, д. 1, офис 101"
                          value={formData.legalAddress}
                          onChange={(e) => setFormData({ ...formData, legalAddress: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="actualAddress" className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          Фактический адрес (если отличается)
                        </Label>
                        <Input
                          id="actualAddress"
                          placeholder="г. Москва, ул. Складская, д. 5"
                          value={formData.actualAddress}
                          onChange={(e) => setFormData({ ...formData, actualAddress: e.target.value })}
                        />
                      </div>
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Director Info Section */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-[#1F2937] flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" />
                        Руководитель
                      </h4>

                      <div className="space-y-2">
                        <Label htmlFor="directorName">ФИО директора *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                          <Input
                            id="directorName"
                            placeholder="Иванов Иван Иванович"
                            className="pl-10"
                            value={formData.directorName}
                            onChange={(e) => setFormData({ ...formData, directorName: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="directorPosition">Должность</Label>
                        <Input
                          id="directorPosition"
                          placeholder="Генеральный директор"
                          value={formData.directorPosition}
                          onChange={(e) => setFormData({ ...formData, directorPosition: e.target.value })}
                        />
                      </div>
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Contact Info Section */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-[#1F2937] flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        Контактное лицо
                      </h4>

                      <div className="space-y-2">
                        <Label htmlFor="contactName">ФИО контактного лица</Label>
                        <Input
                          id="contactName"
                          placeholder="Петров Петр Петрович"
                          value={formData.contactName}
                          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactPhone">Телефон *</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                            <Input
                              id="contactPhone"
                              type="tel"
                              placeholder="+7 (999) 999-99-99"
                              className="pl-10"
                              value={formData.contactPhone}
                              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="contactEmail">Email *</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                            <Input
                              id="contactEmail"
                              type="email"
                              placeholder="company@example.com"
                              className="pl-10"
                              value={formData.contactEmail}
                              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Account Section */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-[#1F2937] flex items-center">
                        <Lock className="w-4 h-4 mr-2" />
                        Данные для входа
                      </h4>

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
                    </div>

                    <Separator className="bg-[#E5E7EB]" />

                    {/* Agreements */}
                    <div className="space-y-3">
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
                            условиями сотрудничества
                          </Link>
                          {' '}и подтверждаю достоверность предоставленных данных *
                        </Label>
                      </div>
                      
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="agreeProcessing"
                          checked={formData.agreeProcessing}
                          onCheckedChange={(checked) => 
                            setFormData({ ...formData, agreeProcessing: checked as boolean })
                          }
                          required
                        />
                        <Label htmlFor="agreeProcessing" className="text-sm leading-tight cursor-pointer">
                          Я согласен на обработку персональных данных в соответствии с{' '}
                          <Link to="/privacy" target="_blank" className="text-[#0284C7] hover:underline">
                            Политикой конфиденциальности
                          </Link>
                          {' '}*'
                        </Label>
                      </div>
                    </div>

                    <Alert className="bg-[#F0F9FF] border-[#7DD3FC]">
                      <Info className="w-4 h-4 text-[#0284C7]" />
                      <AlertDescription className="text-xs text-[#0369A1]">
                        После отправки заявки наш менеджер проверит предоставленные данные 
                        и свяжется с вами для подтверждения регистрации. 
                        Обычно это занимает 1–2 рабочих дня.
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
                          Отправка заявки...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Отправить заявку
                        </>
                      )}
                    </Button>

                    <p className="text-center text-sm text-[#6B7280]">
                      Уже есть доступ?{' '}
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
