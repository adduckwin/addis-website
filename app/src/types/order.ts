import type { CartItem } from '@/store/cartStore'

export interface RetailOrder {
  id: string
  createdAt: string
  customer: {
    fullName: string
    phone: string
    email?: string
  }
  delivery: {
    type: 'yandex'
    address: string
    city: string
    region: string
    apartment?: string
    entrance?: string
    floor?: string
    intercom?: string
    comment?: string
    date?: string
    timeInterval?: string
  }
  items: CartItem[]
  subtotal: number
  deliveryCost: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  trackingNumber?: string
}

export interface WholesaleOrder {
  id: string
  createdAt: string
  company: {
    inn: string
    companyName: string
    legalAddress: string
    contactPhone: string
    contactEmail: string
    directorName: string
  }
  delivery: {
    type: 'cdek' | 'pek' | 'dellin' | 'dalli' | 'pickup'
    address?: string
    terminalId?: string
    city: string
    region: string
    comment?: string
  }
  items: CartItem[]
  subtotal: number
  discount: number
  discountTier: number
  deliveryCost: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  paymentType: 'prepayment' | 'postpayment'
  trackingNumber?: string
  invoiceNumber?: string
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'

export interface YandexDeliveryCalculation {
  address: string
  cost: number
  estimatedDays: number
  availableIntervals: string[]
  isAvailable: boolean
}

export interface DeliveryCalculation {
  service: 'cdek' | 'pek' | 'dellin' | 'dalli' | 'yandex'
  serviceName: string
  cost: number
  estimatedDays: string
  isAvailable: boolean
  error?: string
}

// 1C Enterprise API Integration Types
export interface Order1CRequest {
  orderId: string
  orderType: 'retail' | 'wholesale'
  customer: {
    name: string
    phone: string
    email?: string
    inn?: string
    companyName?: string
  }
  items: {
    sku: string
    name: string
    quantity: number
    price: number
    weight: number
  }[]
  delivery: {
    type: string
    address: string
    cost: number
  }
  payment: {
    type: string
    status: string
  }
  total: number
}

export interface Order1CResponse {
  success: boolean
  order1CId?: string
  error?: string
  message?: string
}
