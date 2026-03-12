import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Package, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { products } from '@/data/products'
import { blogPosts } from '@/data/blog'

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return { products: [], blog: [] }
    
    const searchTerm = query.toLowerCase()
    
    const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.tasteProfile.toLowerCase().includes(searchTerm) ||
      p.type.toLowerCase().includes(searchTerm) ||
      p.descriptors.some(d => d.toLowerCase().includes(searchTerm))
    ).slice(0, 5)
    
    const filteredBlog = blogPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    ).slice(0, 3)
    
    return { products: filteredProducts, blog: filteredBlog }
  }, [query])

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`)
    onOpenChange(false)
    setQuery('')
  }

  const handleBlogClick = (slug: string) => {
    navigate(`/blog/${slug}`)
    onOpenChange(false)
    setQuery('')
  }

  const hasResults = results.products.length > 0 || results.blog.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="sr-only">Поиск</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Поиск по товарам и статьям..."
              className="pl-10 pr-10 h-12 text-base"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </DialogHeader>

        <AnimatePresence>
          {query && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="max-h-[60vh] overflow-y-auto"
            >
              {!hasResults ? (
                <div className="p-8 text-center text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Ничего не найдено</p>
                  <p className="text-sm mt-1">Попробуйте другой запрос</p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {/* Products */}
                  {results.products.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                        Товары
                      </p>
                      <div className="space-y-1">
                        {results.products.map(product => (
                          <button
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-left transition-colors"
                          >
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{product.name}</p>
                              <p className="text-sm text-gray-500 truncate">{product.tasteProfile}</p>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {product.price250} ₽
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Blog */}
                  {results.blog.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                        Статьи
                      </p>
                      <div className="space-y-1">
                        {results.blog.map(post => (
                          <button
                            key={post.id}
                            onClick={() => handleBlogClick(post.slug)}
                            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 text-left transition-colors"
                          >
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <FileText className="w-5 h-5 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{post.title}</p>
                              <p className="text-sm text-gray-500 truncate">{post.excerpt.slice(0, 60)}...</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!query && (
          <div className="p-4 text-center text-sm text-gray-400">
            Введите название товара, вкус или тему статьи
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
