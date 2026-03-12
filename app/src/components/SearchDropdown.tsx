import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Package, FileText, ArrowRight } from 'lucide-react'
import { products } from '@/data/products'
import { blogPosts } from '@/data/blog'

// Транслитерация: кириллица ↔ латиница
const TRANSLIT_MAP: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
  'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
  'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
  'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '',
  'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
  'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'e': 'е', 'yo': 'ё',
  'zh': 'ж', 'z': 'з', 'i': 'и', 'y': 'ы', 'k': 'к', 'l': 'л', 'm': 'м',
  'n': 'н', 'o': 'о', 'p': 'п', 'r': 'р', 's': 'с', 't': 'т', 'u': 'у',
  'f': 'ф', 'h': 'х', 'ts': 'ц', 'ch': 'ч', 'sh': 'ш', 'sch': 'щ',
  'yu': 'ю', 'ya': 'я'
}

// Функция транслитерации
function transliterate(text: string): string {
  let result = ''
  let i = 0
  while (i < text.length) {
    const char = text[i].toLowerCase()
    // Проверяем двухбуквенные комбинации
    if (i < text.length - 1) {
      const twoChars = char + text[i + 1].toLowerCase()
      if (TRANSLIT_MAP[twoChars]) {
        result += TRANSLIT_MAP[twoChars]
        i += 2
        continue
      }
    }
    result += TRANSLIT_MAP[char] || char
    i++
  }
  return result
}

// Функция для создания всех вариантов поиска
function createSearchVariants(query: string): string[] {
  const variants = [query.toLowerCase()]
  const translit = transliterate(query)
  if (translit !== query.toLowerCase()) {
    variants.push(translit)
  }
  return variants
}

// Нечёткий поиск (Levenshtein distance)
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        )
      }
    }
  }
  return matrix[b.length][a.length]
}

// Функция проверки совпадения с учётом опечаток
function fuzzyMatch(text: string, query: string, maxDistance: number = 2): boolean {
  const normalizedText = text.toLowerCase()
  const normalizedQuery = query.toLowerCase()
  
  // Точное совпадение
  if (normalizedText.includes(normalizedQuery)) return true
  
  // Транслитерация
  const translitQuery = transliterate(normalizedQuery)
  if (normalizedText.includes(translitQuery)) return true
  
  // Нечёткий поиск для слов
  const textWords = normalizedText.split(/\s+/)
  const queryWords = normalizedQuery.split(/\s+/)
  
  for (const queryWord of queryWords) {
    let found = false
    for (const textWord of textWords) {
      if (textWord.includes(queryWord) || 
          levenshteinDistance(textWord, queryWord) <= maxDistance ||
          levenshteinDistance(textWord, transliterate(queryWord)) <= maxDistance) {
        found = true
        break
      }
    }
    if (!found) return false
  }
  return true
}

interface SearchDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchDropdown({ isOpen, onClose }: SearchDropdownProps) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return { products: [], blog: [] }
    
    const searchVariants = createSearchVariants(query)
    
    const filteredProducts = products.filter(p => {
      const searchText = `${p.name} ${p.tasteProfile} ${p.type} ${p.descriptors.join(' ')}`
      return searchVariants.some(variant => fuzzyMatch(searchText, variant))
    }).slice(0, 5)
    
    const filteredBlog = blogPosts.filter(post => {
      const searchText = `${post.title} ${post.excerpt} ${post.tags.join(' ')}`
      return searchVariants.some(variant => fuzzyMatch(searchText, variant))
    }).slice(0, 3)
    
    return { products: filteredProducts, blog: filteredBlog }
  }, [query])

  const allResults = [...results.products, ...results.blog]
  const hasResults = allResults.length > 0

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`)
    onClose()
    setQuery('')
  }

  const handleBlogClick = (slug: string) => {
    navigate(`/blog/${slug}`)
    onClose()
    setQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, allResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      const item = allResults[selectedIndex]
      if ('id' in item && typeof item.id === 'string' && item.id.startsWith('addis')) {
        handleProductClick(item.id)
      } else if ('slug' in item) {
        handleBlogClick(item.slug)
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, width: 40, height: 40 }}
      animate={{ opacity: 1, width: 400, height: 'auto' }}
      exit={{ opacity: 0, width: 40, height: 40 }}
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
      style={{ maxWidth: 'calc(100vw - 2rem)' }}
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Поиск..."
          className="w-full pl-12 pr-10 py-3 text-base outline-none"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelectedIndex(-1) }}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus() }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {query.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-100 max-h-[400px] overflow-y-auto"
          >
            {!hasResults ? (
              <div className="p-6 text-center text-gray-500">
                <Search className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Ничего не найдено</p>
                <p className="text-xs text-gray-400 mt-1">Попробуйте другой запрос</p>
              </div>
            ) : (
              <div className="py-2">
                {/* Products */}
                {results.products.length > 0 && (
                  <>
                    <p className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Товары
                    </p>
                    {results.products.map((product, idx) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          selectedIndex === idx ? 'bg-gray-100' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs text-gray-500 truncate">{product.tasteProfile.slice(0, 40)}...</p>
                        </div>
                        <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                          {product.price250} ₽
                        </span>
                      </button>
                    ))}
                  </>
                )}

                {/* Blog */}
                {results.blog.length > 0 && (
                  <>
                    <p className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider border-t border-gray-100">
                      Статьи
                    </p>
                    {results.blog.map((post, idx) => (
                      <button
                        key={post.id}
                        onClick={() => handleBlogClick(post.slug)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          selectedIndex === results.products.length + idx ? 'bg-gray-100' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{post.title}</p>
                          <p className="text-xs text-gray-500 truncate">{post.excerpt.slice(0, 50)}...</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
