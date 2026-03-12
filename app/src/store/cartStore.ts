import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/data/products'

export interface CartItem {
  product: Product
  weight: 250 | 1000
  quantity: number
  price: number
}

export type CustomerType = 'retail' | 'wholesale'

export interface WholesaleTier {
  level: 1 | 2 | 3 | 4
  name: string
  discount: number
  minOrder: number
}

export const WHOLESALE_TIERS: WholesaleTier[] = [
  { level: 1, name: 'Стартовый', discount: 15, minOrder: 50000 },
  { level: 2, name: 'Базовый', discount: 20, minOrder: 100000 },
  { level: 3, name: 'Продвинутый', discount: 25, minOrder: 200000 },
  { level: 4, name: 'Партнёрский', discount: 30, minOrder: 500000 },
]

export interface LoyaltyProfile {
  birthDate?: string
  gender?: 'male' | 'female'
  preferences?: string[]
  bonusPoints: number
  completedFields: string[]
}

export interface WholesaleCompany {
  inn: string
  kpp?: string
  companyName: string
  legalAddress: string
  actualAddress?: string
  directorName: string
  contactPhone: string
  contactEmail: string
  tier: WholesaleTier
  isVerified: boolean
  verificationDate?: string
}

interface CartState {
  items: CartItem[]
  customerType: CustomerType
  loyaltyProfile: LoyaltyProfile | null
  wholesaleCompany: WholesaleCompany | null
  
  // Actions
  addItem: (product: Product, weight: 250 | 1000, quantity?: number) => void
  removeItem: (productId: string, weight: 250 | 1000) => void
  updateQuantity: (productId: string, weight: 250 | 1000, quantity: number) => void
  clearCart: () => void
  setCustomerType: (type: CustomerType) => void
  updateLoyaltyProfile: (profile: Partial<LoyaltyProfile>) => void
  setWholesaleCompany: (company: WholesaleCompany | null) => void
  
  // Getters
  getTotalItems: () => number
  getSubtotal: () => number
  getDiscount: () => number
  getTotal: () => number
  getWholesalePrice: (basePrice: number) => number
  getBonusPointsForField: (field: string) => number
}

const BONUS_POINTS: Record<string, number> = {
  birthDate: 50,
  gender: 30,
  preferences: 40,
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      customerType: 'retail',
      loyaltyProfile: null,
      wholesaleCompany: null,

      addItem: (product, weight, quantity = 1) => {
        const { items } = get()
        const existingItem = items.find(
          item => item.product.id === product.id && item.weight === weight
        )
        
        const basePrice = weight === 250 ? product.price250 : product.price1000
        const price = get().getWholesalePrice(basePrice)

        if (existingItem) {
          set({
            items: items.map(item =>
              item.product.id === product.id && item.weight === weight
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({
            items: [...items, { product, weight, quantity, price }],
          })
        }
      },

      removeItem: (productId, weight) => {
        const { items } = get()
        set({
          items: items.filter(
            item => !(item.product.id === productId && item.weight === weight)
          ),
        })
      },

      updateQuantity: (productId, weight, quantity) => {
        const { items } = get()
        if (quantity <= 0) {
          get().removeItem(productId, weight)
          return
        }
        set({
          items: items.map(item =>
            item.product.id === productId && item.weight === weight
              ? { ...item, quantity }
              : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      setCustomerType: (type) => set({ customerType: type }),

      updateLoyaltyProfile: (profile) => {
        const { loyaltyProfile } = get()
        const newProfile = { ...loyaltyProfile, ...profile }
        
        // Calculate bonus points for completed fields
        let bonusPoints = 0
        const completedFields: string[] = []
        
        Object.entries(BONUS_POINTS).forEach(([field, points]) => {
          if (newProfile[field as keyof LoyaltyProfile]) {
            bonusPoints += points
            completedFields.push(field)
          }
        })
        
        set({
          loyaltyProfile: {
            ...newProfile,
            bonusPoints,
            completedFields,
          } as LoyaltyProfile,
        })
      },

      setWholesaleCompany: (company) => set({ wholesaleCompany: company }),

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        )
      },

      getDiscount: () => {
        const { customerType, wholesaleCompany, items } = get()
        
        if (customerType === 'wholesale' && wholesaleCompany) {
          const subtotal = items.reduce(
            (sum, item) => {
              const basePrice = item.weight === 250 
                ? item.product.price250 
                : item.product.price1000
              return sum + basePrice * item.quantity
            },
            0
          )
          const discountedTotal = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          )
          return subtotal - discountedTotal
        }
        
        return 0
      },

      getTotal: () => {
        return get().getSubtotal()
      },

      getWholesalePrice: (basePrice) => {
        const { customerType, wholesaleCompany } = get()
        
        if (customerType === 'wholesale' && wholesaleCompany) {
          const discount = wholesaleCompany.tier.discount
          return Math.round(basePrice * (1 - discount / 100))
        }
        
        return basePrice
      },

      getBonusPointsForField: (field) => {
        return BONUS_POINTS[field] || 0
      },
    }),
    {
      name: 'addis-cart',
    }
  )
)
