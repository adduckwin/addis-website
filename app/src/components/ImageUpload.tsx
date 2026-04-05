import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Check, AlertCircle, Cloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { uploadImage, isConfigured as isCloudinaryConfigured, type CloudinaryUploadResult } from '@/lib/cloudinary'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  onUpload: (fileName: string, url: string, publicId?: string) => void
  accept?: string
  maxSize?: number // MB
  className?: string
}

export function ImageUpload({ onUpload, accept = 'image/*', maxSize = 10, className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const isCloudinary = isCloudinaryConfigured()

  const processFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Можно загружать только изображения')
      return
    }
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Файл слишком большой (макс. ${maxSize} МБ)`)
      return
    }

    setError(null)
    setUploading(true)
    setUploadProgress(0)

    // Показываем превью сразу
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    try {
      if (isCloudinary) {
        // Загрузка в Cloudinary
        setUploadProgress(30)
        const result: CloudinaryUploadResult = await uploadImage(file, 'addis')
        setUploadProgress(100)

        const fileName = file.name.replace(/\s+/g, '-').toLowerCase()
        onUpload(fileName, result.secure_url, result.public_id)
      } else {
        // Fallback: localStorage (base64)
        setUploadProgress(60)
        await new Promise(resolve => setTimeout(resolve, 300)) // Имитация загрузки

        const dataUrl = await new Promise<string>((resolve) => {
          const r = new FileReader()
          r.onload = () => resolve(r.result as string)
          r.readAsDataURL(file)
        })
        setUploadProgress(100)

        const fileName = file.name.replace(/\s+/g, '-').toLowerCase()
        onUpload(fileName, dataUrl)
      }
      setUploading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки')
      setUploading(false)
      setUploadProgress(0)
    }
  }, [maxSize, onUpload, isCloudinary])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }, [processFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }, [processFile])

  const clearPreview = () => {
    setPreview(null)
    setError(null)
    setUploadProgress(0)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={cn('space-y-3', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Индикатор режима */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isCloudinary ? (
            <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
              <Cloud className="w-3 h-3 mr-1" />
              Cloudinary
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
              Локальное хранилище
            </Badge>
          )}
        </div>
        <span className="text-xs text-gray-400">до {maxSize} МБ</span>
      </div>

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative group rounded-lg overflow-hidden border-2 border-green-200 bg-green-50"
          >
            <img src={preview} alt="Preview" className="w-full aspect-square object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

            {/* Прогресс загрузки */}
            {uploading && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-3/4">
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-white text-xs text-center mt-2">{uploadProgress}%</p>
                </div>
              </div>
            )}

            {/* Успешная загрузка */}
            {!uploading && (
              <>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={clearPreview}
                    className="p-1.5 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded-full">
                  <Check className="w-3 h-3" />
                  Загружено
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => inputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                isDragging
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
              )}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-500">
                    {isCloudinary ? 'Загрузка в Cloudinary...' : 'Обработка...'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                    isDragging ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-400"
                  )}>
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Перетащите изображение сюда
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      или нажмите для выбора • PNG, JPG, WebP
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  )
}

// Компонент для отображения существующего изображения с возможностью замены
interface ImageEditorProps {
  src?: string
  alt?: string
  onUpload: (fileName: string, url: string, publicId?: string) => void
  className?: string
  placeholder?: React.ReactNode
}

export function ImageEditor({ src, alt = 'Image', onUpload, className, placeholder }: ImageEditorProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <div className="space-y-3">
        <ImageUpload onUpload={(fileName, url, publicId) => {
          onUpload(fileName, url, publicId)
          setIsEditing(false)
        }} />
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="w-full">
          Отмена
        </Button>
      </div>
    )
  }

  if (src) {
    return (
      <div className={cn('relative group', className)}>
        <img src={src} alt={alt} className="w-full aspect-square object-cover rounded-lg" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>
            <Upload className="w-4 h-4 mr-1" />
            Заменить
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {placeholder || (
        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Upload className="w-8 h-8 mx-auto mb-2" />
            <p className="text-xs">Нет изображения</p>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center">
        <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>
          <Upload className="w-4 h-4 mr-1" />
          Загрузить
        </Button>
      </div>
    </div>
  )
}
