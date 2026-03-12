import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Gift, 
  Calendar, 
  User, 
  Coffee, 
  Check,
  Star,
  Info
} from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface LoyaltyProfileFormProps {
  onClose: () => void
}

const COFFEE_PREFERENCES = [
  { id: 'espresso', label: 'Эспрессо', icon: '☕' },
  { id: 'cappuccino', label: 'Капучино', icon: '🥛' },
  { id: 'filter', label: 'Фильтр-кофе', icon: '☕' },
  { id: 'pourover', label: 'Пуровер', icon: '💧' },
  { id: 'aeropress', label: 'Аэропресс', icon: '🔧' },
  { id: 'frenchpress', label: 'Френч-пресс', icon: '🇫🇷' },
]

const TASTE_PREFERENCES = [
  { id: 'chocolate', label: 'Шоколадные нотки' },
  { id: 'fruity', label: 'Фруктовая кислотность' },
  { id: 'nutty', label: 'Ореховый вкус' },
  { id: 'floral', label: 'Цветочные оттенки' },
  { id: 'caramel', label: 'Карамельная сладость' },
  { id: 'spicy', label: 'Пряные ноты' },
]

const BONUS_POINTS = {
  birthDate: 50,
  gender: 30,
  preferences: 40,
}

export function LoyaltyProfileForm({ onClose }: LoyaltyProfileFormProps) {
  const { loyaltyProfile, updateLoyaltyProfile } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  const [formData, setFormData] = useState({
    birthDate: loyaltyProfile?.birthDate || '',
    gender: loyaltyProfile?.gender || '',
    coffeePreferences: loyaltyProfile?.preferences?.filter((p: string) => 
      COFFEE_PREFERENCES.some(cp => cp.id === p)
    ) || [],
    tastePreferences: loyaltyProfile?.preferences?.filter((p: string) => 
      TASTE_PREFERENCES.some(tp => tp.id === p)
    ) || [],
  })

  const calculatePotentialPoints = () => {
    let points = 0
    if (formData.birthDate) points += BONUS_POINTS.birthDate
    if (formData.gender) points += BONUS_POINTS.gender
    if (formData.coffeePreferences.length > 0 || formData.tastePreferences.length > 0) {
      points += BONUS_POINTS.preferences
    }
    return points
  }

  const getCompletedFields = () => {
    const completed: string[] = []
    if (formData.birthDate) completed.push('birthDate')
    if (formData.gender) completed.push('gender')
    if (formData.coffeePreferences.length > 0 || formData.tastePreferences.length > 0) {
      completed.push('preferences')
    }
    return completed
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Update profile
    updateLoyaltyProfile({
      birthDate: formData.birthDate,
      gender: formData.gender as 'male' | 'female',
      preferences: [...formData.coffeePreferences, ...formData.tastePreferences],
    })
    
    setIsSubmitting(false)
    setIsComplete(true)
  }

  const togglePreference = (id: string, type: 'coffee' | 'taste') => {
    if (type === 'coffee') {
      setFormData(prev => ({
        ...prev,
        coffeePreferences: prev.coffeePreferences.includes(id)
          ? prev.coffeePreferences.filter((p: string) => p !== id)
          : [...prev.coffeePreferences, id]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        tastePreferences: prev.tastePreferences.includes(id)
          ? prev.tastePreferences.filter((p: string) => p !== id)
          : [...prev.tastePreferences, id]
      }))
    }
  }

  if (isComplete) {
    const totalPoints = calculatePotentialPoints()
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-6"
      >
        <div className="w-16 h-16 bg-[#F0FDF4] rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-[#16A34A]" />
        </div>
        <h3 className="text-xl font-bold text-[#1F2937] mb-2">
          Профиль обновлён!
        </h3>
        <p className="text-[#6B7280] mb-4">
          Вы получили <strong className="text-[#16A34A]">{totalPoints} бонусных баллов</strong>
        </p>
        <p className="text-sm text-[#6B7280] mb-6">
          Баллы начисляются на ваш счёт и будут доступны для использования при следующем заказе
        </p>
        <Button 
          onClick={onClose}
          className="bg-[#1F2937] hover:bg-[#374151] text-white"
        >
          Отлично!
        </Button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Points Preview */}
      <Card className="border-[#86EFAC] bg-gradient-to-r from-[#F0FDF4] to-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#16A34A] rounded-full flex items-center justify-center mr-3">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium text-[#1F2937]">Ваши бонусные баллы</p>
                <p className="text-2xl font-bold text-[#16A34A]">
                  {loyaltyProfile?.bonusPoints || 0}
                </p>
              </div>
            </div>
            {calculatePotentialPoints() > 0 && (
              <div className="text-right">
                <p className="text-sm text-[#6B7280]">Будет начислено</p>
                <p className="text-xl font-bold text-[#16A34A]">+{calculatePotentialPoints()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Points Legend */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {Object.entries(BONUS_POINTS).map(([field, points]) => (
          <div
            key={field}
            className={cn(
              "p-2 rounded-lg border transition-colors",
              getCompletedFields().includes(field)
                ? "bg-[#F0FDF4] border-[#86EFAC]"
                : "bg-[#F5F5F5] border-[#E5E7EB]"
            )}
          >
            <p className="text-lg font-bold text-[#16A34A]">+{points}</p>
            <p className="text-xs text-[#6B7280]">
              {field === 'birthDate' && 'Дата рождения'}
              {field === 'gender' && 'Пол'}
              {field === 'preferences' && 'Предпочтения'}
            </p>
          </div>
        ))}
      </div>

      <Separator className="bg-[#E5E7EB]" />

      {/* Birth Date */}
      <div className="space-y-2">
        <Label htmlFor="birthDate" className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          Дата рождения
          <span className="ml-2 text-xs text-[#16A34A] font-medium">+{BONUS_POINTS.birthDate} баллов</span>
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
          <span className="ml-2 text-xs text-[#16A34A] font-medium">+{BONUS_POINTS.gender} баллов</span>
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

      {/* Coffee Preferences */}
      <div className="space-y-3">
        <Label className="flex items-center">
          <Coffee className="w-4 h-4 mr-1" />
          Как вы готовите кофе?
          <span className="ml-2 text-xs text-[#16A34A] font-medium">+{BONUS_POINTS.preferences} баллов</span>
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {COFFEE_PREFERENCES.map((pref) => (
            <div
              key={pref.id}
              onClick={() => togglePreference(pref.id, 'coffee')}
              className={cn(
                "cursor-pointer p-3 rounded-lg border text-center transition-all",
                formData.coffeePreferences.includes(pref.id)
                  ? "bg-[#F0FDF4] border-[#16A34A]"
                  : "bg-white border-[#E5E7EB] hover:border-[#D1D5DB]"
              )}
            >
              <span className="text-2xl mb-1 block">{pref.icon}</span>
              <span className="text-sm text-[#1F2937]">{pref.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Taste Preferences */}
      <div className="space-y-3">
        <Label>Какие вкусы вам нравятся?</Label>
        <div className="flex flex-wrap gap-2">
          {TASTE_PREFERENCES.map((pref) => (
            <button
              key={pref.id}
              type="button"
              onClick={() => togglePreference(pref.id, 'taste')}
              className={cn(
                "px-3 py-2 rounded-full text-sm border transition-all",
                formData.tastePreferences.includes(pref.id)
                  ? "bg-[#F0FDF4] border-[#16A34A] text-[#166534]"
                  : "bg-white border-[#E5E7EB] text-[#6B7280] hover:border-[#D1D5DB]"
              )}
            >
              {formData.tastePreferences.includes(pref.id) && (
                <Check className="w-3 h-3 inline mr-1" />
              )}
              {pref.label}
            </button>
          ))}
        </div>
      </div>

      <Alert className="bg-[#F0F9FF] border-[#7DD3FC]">
        <Info className="w-4 h-4 text-[#0284C7]" />
        <AlertDescription className="text-xs text-[#0369A1]">
          Бонусные баллы начисляются за каждое заполненное поле. 
          Накапливайте баллы и используйте их для получения скидок на будущие заказы.
        </AlertDescription>
      </Alert>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="flex-1 border-[#D1D5DB]"
          onClick={onClose}
        >
          Пропустить
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-[#1F2937] hover:bg-[#374151] text-white"
          disabled={isSubmitting || calculatePotentialPoints() === 0}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Сохранение...
            </>
          ) : (
            <>
              <Gift className="w-4 h-4 mr-2" />
              Получить баллы
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
