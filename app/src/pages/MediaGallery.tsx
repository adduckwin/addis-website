import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Search,
  Package,
  Link as LinkIcon,
  X,
  Check,
  Cloud,
  HardDrive,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ImageUpload as ImageUploader } from '@/components/ImageUpload'
import { products as allProducts } from '@/data/products'
import { isConfigured as isCloudinaryConfigured } from '@/lib/cloudinary'

// Хранилище метаданных изображений в localStorage
// Сами изображения хранятся в Cloudinary (или base64 как fallback)
const MEDIA_META_KEY = 'addis_media_meta'
const PRODUCT_IMAGES_KEY = 'addis_product_images'

interface MediaItem {
  fileName: string
  url: string
  publicId?: string // Cloudinary public_id
  uploadedAt: string
  size?: string
  isCloudinary: boolean
}

interface MediaGalleryProps {
  onBack?: () => void
}

export default function MediaGallery({ onBack }: MediaGalleryProps) {
  const [media, setMedia] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem(MEDIA_META_KEY)
    return saved ? JSON.parse(saved) : []
  })
  const [productImages, setProductImages] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem(PRODUCT_IMAGES_KEY)
    return saved ? JSON.parse(saved) : {}
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null)
  const [linkingProduct, setLinkingProduct] = useState<string | null>(null)
  const [showUpload, setShowUpload] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unlinked' | 'linked'>('all')

  const isCloudinary = isCloudinaryConfigured()

  useEffect(() => {
    localStorage.setItem(MEDIA_META_KEY, JSON.stringify(media))
  }, [media])

  useEffect(() => {
    localStorage.setItem(PRODUCT_IMAGES_KEY, JSON.stringify(productImages))
  }, [productImages])

  const handleUpload = (fileName: string, url: string, publicId?: string) => {
    // Проверяем дубликаты
    const exists = media.find(m => m.fileName === fileName)
    if (exists) {
      setMedia(prev => prev.map(m =>
        m.fileName === fileName
          ? { ...m, url, publicId, uploadedAt: new Date().toISOString() }
          : m
      ))
    } else {
      setMedia(prev => [...prev, {
        fileName,
        url,
        publicId,
        uploadedAt: new Date().toISOString(),
        isCloudinary: !!publicId,
      }])
    }
    setShowUpload(false)
  }

  const handleDelete = (item: MediaItem) => {
    setMedia(prev => prev.filter(m => m.fileName !== item.fileName))
    // Удаляем привязки к товарам
    setProductImages(prev => {
      const next = { ...prev }
      Object.keys(next).forEach(productId => {
        if (next[productId] === item.fileName) delete next[productId]
      })
      return next
    })
    setSelectedImage(null)
  }

  const handleLinkProduct = (productId: string) => {
    if (!selectedImage) return
    setProductImages(prev => ({ ...prev, [productId]: selectedImage.fileName }))
    setLinkingProduct(null)
  }

  const handleUnlinkProduct = (productId: string) => {
    setProductImages(prev => {
      const next = { ...prev }
      delete next[productId]
      return next
    })
  }

  // Фильтрация
  const filteredMedia = media.filter(m => {
    const matchesSearch = m.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    if (filter === 'all') return matchesSearch
    const isLinked = Object.values(productImages).includes(m.fileName)
    if (filter === 'linked') return matchesSearch && isLinked
    if (filter === 'unlinked') return matchesSearch && !isLinked
    return matchesSearch
  })

  // Товары для привязки
  const productsForLinking = allProducts.filter(p =>
    !productImages[p.id] || productImages[p.id] === selectedImage?.fileName
  )

  // Статистика
  const linkedCount = Object.keys(productImages).length
  const cloudinaryCount = media.filter(m => m.isCloudinary).length
  const localCount = media.length - cloudinaryCount

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Медиагалерея
              </CardTitle>
              <CardDescription>
                Загружено: {media.length} • Привязано к товарам: {linkedCount}
                {isCloudinary && (
                  <span className="ml-2">
                    ☁️ Cloudinary: {cloudinaryCount} • Локально: {localCount}
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {onBack && (
                <Button variant="outline" onClick={onBack}>
                  Назад
                </Button>
              )}
              <Button onClick={() => setShowUpload(!showUpload)}>
                <Upload className="w-4 h-4 mr-2" />
                Загрузить
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Cloudinary Info Banner */}
      {!isCloudinary && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <HardDrive className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Режим локального хранилища
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  Изображения сохраняются в base64 в localStorage (лимит ~5-10 МБ).
                  Для продакшена подключите Cloudinary — создайте бесплатный аккаунт на{' '}
                  <a
                    href="https://cloudinary.com/users/register/free"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-amber-800"
                  >
                    cloudinary.com
                  </a>
                  {' '}и добавьте переменные в <code className="bg-amber-100 px-1 rounded">.env</code>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload */}
      {showUpload && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Загрузка изображения</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowUpload(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ImageUploader onUpload={handleUpload} maxSize={10} />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Поиск по имени файла..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {[
            { id: 'all' as const, label: 'Все' },
            { id: 'linked' as const, label: 'Привязанные' },
            { id: 'unlinked' as const, label: 'Свободные' },
          ].map(f => (
            <Button
              key={f.id}
              variant={filter === f.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredMedia.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">
              {media.length === 0 ? 'Нет загруженных изображений' : 'Нет изображений по фильтру'}
            </p>
            {media.length === 0 && (
              <Button onClick={() => setShowUpload(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Загрузить первое изображение
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => {
            const linkedProducts = Object.entries(productImages)
              .filter(([, fileName]) => fileName === item.fileName)
              .map(([productId]) => allProducts.find(p => p.id === productId))
              .filter(Boolean)

            return (
              <motion.div
                key={item.fileName}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group-hover:border-gray-900 transition-colors">
                  <img src={item.url} alt={item.fileName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                  {/* Badges */}
                  <div className="absolute top-1.5 left-1.5 flex gap-1">
                    {item.isCloudinary && (
                      <Badge className="bg-blue-600 text-white text-[10px] px-1.5 py-0">
                        <Cloud className="w-2.5 h-2.5" />
                      </Badge>
                    )}
                    {linkedProducts.length > 0 && (
                      <Badge className="bg-green-600 text-white text-[10px] px-1.5 py-0">
                        <LinkIcon className="w-2.5 h-2.5 mr-0.5" />
                        {linkedProducts.length}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate" title={item.fileName}>
                  {item.fileName}
                </p>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Image Detail Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-2xl">
          {selectedImage && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <DialogTitle>{selectedImage.fileName}</DialogTitle>
                  {selectedImage.isCloudinary ? (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs">
                      <Cloud className="w-3 h-3 mr-1" />
                      Cloudinary
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-amber-50 text-amber-700 text-xs">
                      Локально
                    </Badge>
                  )}
                </div>
                <DialogDescription>
                  Загружено: {new Date(selectedImage.uploadedAt).toLocaleDateString('ru-RU')}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.fileName}
                    className="w-full rounded-lg"
                  />
                  {selectedImage.isCloudinary && (
                    <a
                      href={selectedImage.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Открыть в оригинале
                    </a>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Привязанные товары</h4>
                    {Object.entries(productImages)
                      .filter(([, fileName]) => fileName === selectedImage.fileName)
                      .map(([productId]) => {
                        const product = allProducts.find(p => p.id === productId)
                        if (!product) return null
                        return (
                          <div key={productId} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg mb-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            <span className="text-sm flex-1 truncate">{product.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUnlinkProduct(productId)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        )
                      })}
                    {Object.entries(productImages).filter(([, fileName]) => fileName === selectedImage.fileName).length === 0 && (
                      <p className="text-sm text-gray-400">Не привязано к товарам</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setLinkingProduct(selectedImage.fileName)}
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Привязать к товару
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(selectedImage)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Удалить
                      {selectedImage.isCloudinary && ' из Cloudinary'}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Link Product Dialog */}
      <Dialog open={!!linkingProduct} onOpenChange={() => setLinkingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Привязать к товару</DialogTitle>
            <DialogDescription>
              Выберите товар для привязки изображения
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-80 overflow-auto">
            {productsForLinking.map(product => (
              <button
                key={product.id}
                onClick={() => handleLinkProduct(product.id)}
                className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.category}</p>
                </div>
                <Check className="w-4 h-4 text-gray-300" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
