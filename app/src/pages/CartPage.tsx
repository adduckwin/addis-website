import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Package, 
  User, 
  Building2,
  ChevronRight,
  AlertCircle,
  Gift,
  Percent,
  Truck
} from 'lucide-react'
import { useCartStore, type CustomerType } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { RetailCheckoutForm } from '@/components/cart/RetailCheckoutForm'
import { WholesaleLoginForm } from '@/components/cart/WholesaleLoginForm'
import { LoyaltyProfileForm } from '@/components/cart/LoyaltyProfileForm'
import { cn } from '@/lib/utils'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function CartPage() {
  const navigate = useNavigate()
  const [showCheckout, setShowCheckout] = useState(false)
  const [showLoyaltyForm, setShowLoyaltyForm] = useState(false)
  const [activeTab, setActiveTab] = useState<CustomerType>('retail')
  
  const {
    items,
    customerType,
    loyaltyProfile,
    wholesaleCompany,
    removeItem,
    updateQuantity,
    clearCart,
    setCustomerType,
    getSubtotal,
    getDiscount,
    getTotal,
    getTotalItems,
  } = useCartStore()

  const handleTabChange = (value: string) => {
    const type = value as CustomerType
    setActiveTab(type)
    setCustomerType(type)
  }

  const handleCheckout = () => {
    if (customerType === 'retail') {
      setShowCheckout(true)
    } else {
      if (!wholesaleCompany) {
        // Show wholesale login dialog
      } else {
        setShowCheckout(true)
      }
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-24 h-24 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-[#9CA3AF]" />
            </div>
            <h1 className="text-3xl font-bold text-[#1F2937] mb-4">
              Корзина пуста
            </h1>
            <p className="text-[#6B7280] mb-8">
              Добавьте товары из каталога, чтобы оформить заказ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate('/category/espresso')}
                className="bg-[#1F2937] hover:bg-[#374151] text-white"
              >
                Перейти в каталог
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/#categories')}
                className="border-[#D1D5DB]"
              >
                Смотреть категории
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <ShoppingCart className="w-8 h-8 text-[#1F2937]" />
            <h1 className="text-3xl font-bold text-[#1F2937]">
              Корзина
            </h1>
            <Badge variant="secondary" className="bg-[#F5F5F5] text-[#6B7280]">
              {getTotalItems()} {getTotalItems() === 1 ? 'товар' : getTotalItems() < 5 ? 'товара' : 'товаров'}
            </Badge>
          </div>
          <p className="text-[#6B7280]">
            Оформление заказа для розничных и оптовых клиентов
          </p>
        </motion.div>

        {/* Customer Type Tabs */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="mb-8"
        >
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-[#F5F5F5]">
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

            {/* Retail Tab Content */}
            <TabsContent value="retail" className="mt-6">
              {loyaltyProfile && loyaltyProfile.bonusPoints > 0 && (
                <Alert className="mb-6 bg-[#F0FDF4] border-[#86EFAC]">
                  <Gift className="w-4 h-4 text-[#16A34A]" />
                  <AlertDescription className="text-[#166534]">
                    У вас {loyaltyProfile.bonusPoints} бонусных баллов! Заполните профиль, чтобы получить больше.
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-[#16A34A] font-medium ml-2"
                      onClick={() => setShowLoyaltyForm(true)}
                    >
                      Заполнить профиль
                    </Button>
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {/* Wholesale Tab Content */}
            <TabsContent value="wholesale" className="mt-6">
              {!wholesaleCompany ? (
                <Alert className="mb-6 bg-[#FEF3C7] border-[#FCD34D]">
                  <AlertCircle className="w-4 h-4 text-[#D97706]" />
                  <AlertDescription className="text-[#92400E]">
                    Для оформления оптового заказа необходимо войти в личный кабинет или зарегистрироваться.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="mb-6 bg-[#F0FDF4] border-[#86EFAC]">
                  <Percent className="w-4 h-4 text-[#16A34A]" />
                  <AlertDescription className="text-[#166534]">
                    Ваш уровень: <strong>{wholesaleCompany.tier.name}</strong> — скидка {wholesaleCompany.tier.discount}%
                    {getSubtotal() < wholesaleCompany.tier.minOrder && (
                      <span className="block mt-1">
                        До следующего уровня: {wholesaleCompany.tier.minOrder - getSubtotal()} ₽
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="lg:col-span-2"
          >
            <Card className="border-[#E5E7EB]">
              <CardHeader className="border-b border-[#E5E7EB]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-[#1F2937]">
                    Товары в корзине
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="text-[#EF4444] hover:text-[#DC2626] hover:bg-[#FEF2F2]"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Очистить
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.product.id}-${item.weight}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "p-4 flex items-center gap-4",
                        index !== items.length - 1 && "border-b border-[#E5E7EB]"
                      )}
                    >
                      {/* Product Image Placeholder */}
                      <div className="w-20 h-20 bg-[#F5F5F5] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-8 h-8 text-[#9CA3AF]" />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="font-medium text-[#1F2937] truncate cursor-pointer hover:text-[#4B5563]"
                          onClick={() => navigate(`/product/${item.product.id}`)}
                        >
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-[#6B7280]">
                          {item.weight} г • {item.product.type}
                        </p>
                        {customerType === 'wholesale' && wholesaleCompany && (
                          <p className="text-xs text-[#16A34A]">
                            Оптовая цена с учётом скидки {wholesaleCompany.tier.discount}%
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-[#D1D5DB]"
                          onClick={() => 
                            updateQuantity(item.product.id, item.weight, item.quantity - 1)
                          }
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-[#D1D5DB]"
                          onClick={() => 
                            updateQuantity(item.product.id, item.weight, item.quantity + 1)
                          }
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="text-right min-w-[100px]">
                        <p className="font-semibold text-[#1F2937]">
                          {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                        </p>
                        <p className="text-sm text-[#6B7280]">
                          {item.price.toLocaleString('ru-RU')} ₽/шт
                        </p>
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#FEF2F2]"
                        onClick={() => removeItem(item.product.id, item.weight)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Continue Shopping */}
            <Button
              variant="ghost"
              className="mt-4 text-[#6B7280]"
              onClick={() => navigate('/category/espresso')}
            >
              ← Продолжить покупки
            </Button>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-[#E5E7EB] sticky top-24">
              <CardHeader className="border-b border-[#E5E7EB]">
                <CardTitle className="text-lg font-semibold text-[#1F2937]">
                  Итого к оплате
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-[#6B7280]">
                  <span>Товары ({getTotalItems()})</span>
                  <span>{getSubtotal().toLocaleString('ru-RU')} ₽</span>
                </div>

                {/* Discount (wholesale only) */}
                {customerType === 'wholesale' && getDiscount() > 0 && (
                  <div className="flex justify-between text-[#16A34A]">
                    <span className="flex items-center">
                      <Percent className="w-4 h-4 mr-1" />
                      Скидка опта
                    </span>
                    <span>-{getDiscount().toLocaleString('ru-RU')} ₽</span>
                  </div>
                )}

                {/* Delivery */}
                <div className="flex justify-between text-[#6B7280]">
                  <span className="flex items-center">
                    <Truck className="w-4 h-4 mr-1" />
                    Доставка
                  </span>
                  <span className="text-[#9CA3AF]">Рассчитается при оформлении</span>
                </div>

                <Separator className="bg-[#E5E7EB]" />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-[#1F2937]">Итого</span>
                  <span className="text-2xl font-bold text-[#1F2937]">
                    {getTotal().toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                {/* Minimum Order Alert (wholesale) */}
                {customerType === 'wholesale' && wholesaleCompany && getSubtotal() < wholesaleCompany.tier.minOrder && (
                  <Alert className="bg-[#FEF3C7] border-[#FCD34D]">
                    <AlertCircle className="w-4 h-4 text-[#D97706]" />
                    <AlertDescription className="text-xs text-[#92400E]">
                      Минимальная сумма заказа для уровня "{wholesaleCompany.tier.name}" — 
                      {wholesaleCompany.tier.minOrder.toLocaleString('ru-RU')} ₽
                    </AlertDescription>
                  </Alert>
                )}

                {/* Checkout Button */}
                <Button
                  className="w-full bg-[#1F2937] hover:bg-[#374151] text-white h-12 text-base"
                  onClick={handleCheckout}
                  disabled={customerType === 'wholesale' && wholesaleCompany ? getSubtotal() < wholesaleCompany.tier.minOrder : false}
                >
                  {customerType === 'retail' ? 'Оформить заказ' : 'Перейти к оформлению'}
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>

                {/* Loyalty Program Hint (retail) */}
                {customerType === 'retail' && !loyaltyProfile && (
                  <p className="text-xs text-center text-[#6B7280]">
                    <Gift className="w-3 h-3 inline mr-1" />
                    Создайте личный кабинет и получайте бонусы за каждую покупку
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {customerType === 'retail' ? 'Оформление заказа' : 'Оформление оптового заказа'}
            </DialogTitle>
            <DialogDescription>
              {customerType === 'retail' 
                ? 'Быстрое оформление без регистрации. Доставка Яндекс — Москва и МО.'
                : 'Оформление заказа с оптовыми ценами и доставкой транспортными компаниями.'
              }
            </DialogDescription>
          </DialogHeader>
          {customerType === 'retail' ? (
            <RetailCheckoutForm onClose={() => setShowCheckout(false)} />
          ) : (
            <WholesaleLoginForm onClose={() => setShowCheckout(false)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Loyalty Profile Dialog */}
      <Dialog open={showLoyaltyForm} onOpenChange={setShowLoyaltyForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Программа лояльности</DialogTitle>
            <DialogDescription>
              Заполните профиль и получайте бонусные баллы за каждое поле
            </DialogDescription>
          </DialogHeader>
          <LoyaltyProfileForm onClose={() => setShowLoyaltyForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
