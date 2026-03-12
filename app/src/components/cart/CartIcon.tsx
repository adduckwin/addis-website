import { useNavigate } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { cn } from '@/lib/utils'

interface CartIconProps {
  className?: string
}

export function CartIcon({ className }: CartIconProps) {
  const navigate = useNavigate()
  const { getTotalItems } = useCartStore()
  const itemCount = getTotalItems()

  return (
    <button
      onClick={() => navigate('/cart')}
      className={cn(
        "relative p-2 transition-colors hover:bg-black/5",
        className
      )}
      aria-label="Корзина"
    >
      <ShoppingCart className="w-5 h-5 text-black" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#D95700] text-white text-xs font-semibold flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  )
}
