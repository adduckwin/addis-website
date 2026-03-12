import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  MapPin, 
  Calendar, 
  Truck, 
  Check,
  CreditCard,
  FileText
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

interface RetailCheckoutFormProps {
  onClose: () => void
}

interface FormData {
  fullName: string
  phone: string
  email: string
  city: string
  address: string
  apartment: string
  entrance: string
  floor: string
  intercom: string
  comment: string
  deliveryDate: string
  deliveryTime: string
  agreePrivacy: boolean
  agreeTerms: boolean
}

const DELIVERY_INTERVALS = [
  { value: '09:00-13:00', label: '09:00 — 13:00' },
  { value: '13:00-17:00', label: '13:00 — 17:00' },
  { value: '17:00-21:00', label: '17:00 — 21:00' },
  { value: '09:00-21:00', label: '09:00 — 21:00 (в течение дня)' },
]

export function RetailCheckoutForm({ onClose }: RetailCheckoutFormProps) {
  const [step, setStep] = useState<'form' | 'delivery' | 'confirm'>('form')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    city: 'Москва',
    address: '',
    apartment: '',
    entrance: '',
    floor: '',
    intercom: '',
    comment: '',
    deliveryDate: '',
    deliveryTime: '09:00-21:00',
    agreePrivacy: false,
    agreeTerms: false,
  })

  const { items, getSubtotal, clearCart } = useCartStore()

  const calculateDelivery = () => {
    // Simulate Yandex delivery calculation for Moscow/MO
    // In production, this would call Yandex Delivery API
    const baseCost = 350
    const isMO = !formData.city.toLowerCase().includes('москва')
    const cost = isMO ? baseCost + 150 : baseCost
    setDeliveryCost(cost)
    setStep('delivery')
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    // Prepare order data for 1C Enterprise API
    const orderData = {
      orderType: 'retail',
      customer: {
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
      },
      delivery: {
        type: 'yandex',
        city: formData.city,
        address: formData.address,
        apartment: formData.apartment,
        entrance: formData.entrance,
        floor: formData.floor,
        intercom: formData.intercom,
        comment: formData.comment,
        date: formData.deliveryDate,
        timeInterval: formData.deliveryTime,
        cost: deliveryCost,
      },
      items: items.map(item => ({
        sku: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        weight: item.weight,
      })),
      subtotal: getSubtotal(),
      deliveryCost,
      total: getSubtotal() + (deliveryCost || 0),
    }

    // TODO: Send to 1C Enterprise API
    console.log('Order data for 1C:', orderData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setOrderComplete(true)
    clearCart()
  }

  const isFormValid = () => {
    return (
      formData.fullName.trim() &&
      formData.phone.trim() &&
      formData.city.trim() &&
      formData.address.trim() &&
      formData.deliveryDate &&
      formData.agreePrivacy &&
      formData.agreeTerms
    )
  }

  if (orderComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-20 h-20 bg-[#F0FDF4] rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-[#16A34A]" />
        </div>
        <h3 className="text-2xl font-bold text-[#1F2937] mb-2">
          Заказ успешно оформлен!
        </h3>
        <p className="text-[#6B7280] mb-6">
          Мы свяжемся с вами в ближайшее время для подтверждения заказа.
        </p>
        <div className="bg-[#F5F5F5] rounded-lg p-4 mb-6 text-left">
          <p className="text-sm text-[#6B7280]">
            Номер заказа будет отправлен на номер {formData.phone}
          </p>
        </div>
        <Button 
          onClick={onClose}
          className="bg-[#1F2937] hover:bg-[#374151] text-white"
        >
          Вернуться на главную
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-6">
        {['Контакты', 'Доставка', 'Подтверждение'].map((label, index) => {
          const stepNames = ['form', 'delivery', 'confirm']
          const currentStepIndex = stepNames.indexOf(step)
          const isActive = index <= currentStepIndex
          const isCurrent = index === currentStepIndex
          
          return (
            <div key={label} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  isCurrent && "bg-[#1F2937] text-white",
                  isActive && !isCurrent && "bg-[#10B981] text-white",
                  !isActive && "bg-[#E5E7EB] text-[#9CA3AF]"
                )}
              >
                {isActive && !isCurrent ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span
                className={cn(
                  "ml-2 text-sm hidden sm:block",
                  isActive ? "text-[#1F2937]" : "text-[#9CA3AF]"
                )}
              >
                {label}
              </span>
              {index < 2 && (
                <div className="w-8 h-px bg-[#E5E7EB] mx-2" />
              )}
            </div>
          )
        })}
      </div>

      {step === 'form' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-medium text-[#1F2937] flex items-center">
              <User className="w-4 h-4 mr-2" />
              Контактная информация
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">ФИО *</Label>
                <Input
                  id="fullName"
                  placeholder="Иванов Иван Иванович"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+7 (999) 999-99-99"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email (необязательно)</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <Separator className="bg-[#E5E7EB]" />

          {/* Delivery Address */}
          <div className="space-y-4">
            <h4 className="font-medium text-[#1F2937] flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              Адрес доставки
            </h4>
            
            <Alert className="bg-[#F0F9FF] border-[#7DD3FC]">
              <Truck className="w-4 h-4 text-[#0284C7]" />
              <AlertDescription className="text-[#0369A1]">
                Доставка осуществляется Яндекс Доставкой по Москве и Московской области
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="city">Город *</Label>
              <Input
                id="city"
                placeholder="Москва"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <p className="text-xs text-[#6B7280]">
                Доставка доступна только по Москве и Московской области
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Адрес (улица, дом) *</Label>
              <Input
                id="address"
                placeholder="ул. Тверская, д. 1"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="apartment">Квартира</Label>
                <Input
                  id="apartment"
                  placeholder="101"
                  value={formData.apartment}
                  onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="entrance">Подъезд</Label>
                <Input
                  id="entrance"
                  placeholder="1"
                  value={formData.entrance}
                  onChange={(e) => setFormData({ ...formData, entrance: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="floor">Этаж</Label>
                <Input
                  id="floor"
                  placeholder="5"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="intercom">Домофон</Label>
                <Input
                  id="intercom"
                  placeholder="101"
                  value={formData.intercom}
                  onChange={(e) => setFormData({ ...formData, intercom: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="comment">Комментарий курьеру</Label>
              <Input
                id="comment"
                placeholder="Например: позвонить за 30 минут"
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              />
            </div>
          </div>

          <Separator className="bg-[#E5E7EB]" />

          {/* Delivery Date */}
          <div className="space-y-4">
            <h4 className="font-medium text-[#1F2937] flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Дата и время доставки
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Дата доставки *</Label>
              <Input
                id="deliveryDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Интервал доставки</Label>
              <RadioGroup
                value={formData.deliveryTime}
                onValueChange={(value) => setFormData({ ...formData, deliveryTime: value })}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
              >
                {DELIVERY_INTERVALS.map((interval) => (
                  <div key={interval.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={interval.value} id={interval.value} />
                    <Label htmlFor={interval.value} className="text-sm cursor-pointer">
                      {interval.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <Separator className="bg-[#E5E7EB]" />

          {/* Agreements */}
          <div className="space-y-4">
            <h4 className="font-medium text-[#1F2937] flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Соглашения
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="privacy"
                  checked={formData.agreePrivacy}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, agreePrivacy: checked as boolean })
                  }
                />
                <Label htmlFor="privacy" className="text-sm leading-tight cursor-pointer">
                  Я согласен с{' '}
                  <a href="#/privacy" target="_blank" className="text-[#0284C7] hover:underline">
                    Политикой конфиденциальности
                  </a>
                  {' '}*'
                </Label>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, agreeTerms: checked as boolean })
                  }
                />
                <Label htmlFor="terms" className="text-sm leading-tight cursor-pointer">
                  Я согласен с{' '}
                  <a href="#/terms" target="_blank" className="text-[#0284C7] hover:underline">
                    Условиями продажи
                  </a>
                  {' '}*'
                </Label>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-[#1F2937] hover:bg-[#374151] text-white h-12"
            onClick={calculateDelivery}
            disabled={!isFormValid()}
          >
            Рассчитать стоимость доставки
          </Button>
        </motion.div>
      )}

      {step === 'delivery' && deliveryCost !== null && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card className="border-[#10B981]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Truck className="w-6 h-6 text-[#10B981] mr-3" />
                  <div>
                    <p className="font-medium text-[#1F2937]">Яндекс Доставка</p>
                    <p className="text-sm text-[#6B7280]">
                      {formData.city}, {formData.address}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#1F2937]">{deliveryCost} ₽</p>
                  <p className="text-sm text-[#6B7280]">1–2 дня</p>
                </div>
              </div>
              
              <Separator className="bg-[#E5E7EB] my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Товары</span>
                  <span>{getSubtotal().toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Доставка</span>
                  <span>{deliveryCost.toLocaleString('ru-RU')} ₽</span>
                </div>
                <Separator className="bg-[#E5E7EB]" />
                <div className="flex justify-between">
                  <span className="font-medium text-[#1F2937]">Итого к оплате</span>
                  <span className="text-xl font-bold text-[#1F2937]">
                    {(getSubtotal() + deliveryCost).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 border-[#D1D5DB]"
              onClick={() => setStep('form')}
            >
              Назад
            </Button>
            <Button
              className="flex-1 bg-[#1F2937] hover:bg-[#374151] text-white"
              onClick={() => setStep('confirm')}
            >
              Продолжить
            </Button>
          </div>
        </motion.div>
      )}

      {step === 'confirm' && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="bg-[#F5F5F5] rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-[#1F2937]">Проверьте данные заказа</h4>
            
            <div className="space-y-1">
              <p className="text-sm text-[#6B7280]">Получатель</p>
              <p className="text-[#1F2937]">{formData.fullName}</p>
              <p className="text-[#1F2937]">{formData.phone}</p>
            </div>
            
            <Separator className="bg-[#E5E7EB]" />
            
            <div className="space-y-1">
              <p className="text-sm text-[#6B7280]">Адрес доставки</p>
              <p className="text-[#1F2937]">{formData.city}, {formData.address}</p>
              {formData.apartment && <p className="text-[#6B7280]">кв. {formData.apartment}</p>}
            </div>
            
            <Separator className="bg-[#E5E7EB]" />
            
            <div className="space-y-1">
              <p className="text-sm text-[#6B7280]">Доставка</p>
              <p className="text-[#1F2937]">{formData.deliveryDate}, {formData.deliveryTime}</p>
              <p className="text-[#1F2937]">Яндекс Доставка — {deliveryCost} ₽</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 border-[#D1D5DB]"
              onClick={() => setStep('delivery')}
              disabled={isSubmitting}
            >
              Назад
            </Button>
            <Button
              className="flex-1 bg-[#1F2937] hover:bg-[#374151] text-white"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Оформление...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Подтвердить заказ
                </>
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
