// Cloudinary сервис для загрузки и управления изображениями
// Документация: https://cloudinary.com/documentation/upload_images_api

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || ''
const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET || ''

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  url: string
  width: number
  height: number
  format: string
  bytes: number
  created_at: string
}

export interface CloudinaryImage {
  publicId: string
  url: string
  secureUrl: string
  width: number
  height: number
  format: string
  createdAt: string
}

/**
 * Загрузка изображения в Cloudinary
 * Использует unsigned upload preset для клиентской загрузки
 */
export async function uploadImage(file: File, folder = 'addis'): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary не настроен. Заполните VITE_CLOUDINARY_CLOUD_NAME и VITE_CLOUDINARY_UPLOAD_PRESET в .env')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', folder)

  const response = await fetch(UPLOAD_URL, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Ошибка загрузки изображения')
  }

  return response.json()
}

/**
 * Удаление изображения из Cloudinary
 * Требует API_KEY и API_SECRET (только серверная часть)
 * Для клиентского удаления используйте admin-панель или ручное удаление
 */
export async function deleteImage(publicId: string): Promise<{ result: string }> {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
    throw new Error('Для удаления нужны API_KEY и API_SECRET')
  }

  // Генерация подписи (в продакшене лучше делать через бэкенд)
  const timestamp = Math.round(Date.now() / 1000)
  const signature = await generateSignature(publicId, timestamp)

  const formData = new FormData()
  formData.append('public_id', publicId)
  formData.append('signature', signature)
  formData.append('api_key', API_KEY)
  formData.append('timestamp', timestamp.toString())

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
    {
      method: 'POST',
      body: formData,
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'Ошибка удаления изображения')
  }

  return response.json()
}

/**
 * Генерация URL изображения с оптимизацией
 */
export function getImageUrl(
  publicId: string,
  options?: {
    width?: number
    height?: number
    quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | number
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png'
    crop?: 'fill' | 'fit' | 'limit' | 'thumb'
  }
): string {
  if (!CLOUD_NAME) return ''

  const transformations: string[] = []

  if (options?.width) transformations.push(`w_${options.width}`)
  if (options?.height) transformations.push(`h_${options.height}`)
  if (options?.quality) transformations.push(`q_${options.quality}`)
  if (options?.format) transformations.push(`f_${options.format}`)
  if (options?.crop) transformations.push(`c_${options.crop}`)

  const transformation = transformations.length > 0 ? transformations.join(',') + '/' : ''

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformation}${publicId}`
}

/**
 * Получение миниатюры изображения
 */
export function getThumbnail(publicId: string, size = 200): string {
  return getImageUrl(publicId, {
    width: size,
    height: size,
    quality: 'auto:eco',
    format: 'auto',
    crop: 'fill',
  })
}

/**
 * Генерация подписи для API запросов
 * В продакшене лучше делать это на бэкенде
 */
async function generateSignature(publicId: string, timestamp: number): Promise<string> {
  const message = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`
  const encoder = new TextEncoder()
  const data = encoder.encode(message)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Проверка настройки Cloudinary
 */
export function isConfigured(): boolean {
  return !!(CLOUD_NAME && UPLOAD_PRESET)
}

/**
 * Получение конфигурации для отображения
 */
export function getConfig() {
  return {
    cloudName: CLOUD_NAME,
    uploadPreset: UPLOAD_PRESET,
    isConfigured: isConfigured(),
  }
}
