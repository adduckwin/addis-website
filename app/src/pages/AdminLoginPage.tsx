import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Header from '@/sections/Header'
import Footer from '@/sections/Footer'

// Конфигурация безопасности
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION = 30 * 60 * 1000 // 30 минут
const ADMIN_CREDENTIALS = {
  login: 'admin_addis',
  password: 'AddisSecure2025!'
}

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutEnd, setLockoutEnd] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)

  // Проверка блокировки при загрузке
  useEffect(() => {
    const lockoutData = localStorage.getItem('admin_lockout')
    if (lockoutData) {
      const { endTime } = JSON.parse(lockoutData)
      if (Date.now() < endTime) {
        setIsLocked(true)
        setLockoutEnd(endTime)
      } else {
        localStorage.removeItem('admin_lockout')
        localStorage.removeItem('admin_attempts')
      }
    }
    
    const savedAttempts = localStorage.getItem('admin_attempts')
    if (savedAttempts) {
      setAttempts(parseInt(savedAttempts, 10))
    }
  }, [])

  // Таймер обратного отсчёта
  useEffect(() => {
    if (!isLocked || !lockoutEnd) return
    
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockoutEnd - Date.now()) / 1000)
      if (remaining <= 0) {
        setIsLocked(false)
        setLockoutEnd(null)
        setAttempts(0)
        localStorage.removeItem('admin_lockout')
        localStorage.removeItem('admin_attempts')
        clearInterval(interval)
      } else {
        setTimeLeft(remaining)
      }
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isLocked, lockoutEnd])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isLocked) return
    
    // Проверка учётных данных
    if (login === ADMIN_CREDENTIALS.login && password === ADMIN_CREDENTIALS.password) {
      // Успешная авторизация
      sessionStorage.setItem('admin_session', 'active')
      sessionStorage.setItem('admin_login_time', Date.now().toString())
      localStorage.removeItem('admin_attempts')
      localStorage.removeItem('admin_lockout')
      navigate('/admin')
    } else {
      // Неудачная попытка
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      localStorage.setItem('admin_attempts', newAttempts.toString())
      
      if (newAttempts >= MAX_ATTEMPTS) {
        // Блокировка
        const endTime = Date.now() + LOCKOUT_DURATION
        setIsLocked(true)
        setLockoutEnd(endTime)
        localStorage.setItem('admin_lockout', JSON.stringify({ endTime, attempts: newAttempts }))
        setError(`Слишком много попыток. Доступ заблокирован на 30 минут.`)
      } else {
        const remaining = MAX_ATTEMPTS - newAttempts
        setError(`Неверный логин или пароль. Осталось попыток: ${remaining}`)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-gray-200 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Вход для администратора</CardTitle>
                <CardDescription>
                  Доступ ограничен. Несанкционированный вход преследуется по закону.
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {isLocked ? (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <AlertDescription className="text-red-700">
                      <p className="font-medium">Доступ заблокирован</p>
                      <p className="text-sm mt-1">
                        Повторите попытку через: <strong>{formatTime(timeLeft)}</strong>
                      </p>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <Alert className="bg-red-50 border-red-200">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <AlertDescription className="text-red-700">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="admin-login">Логин</Label>
                      <Input
                        id="admin-login"
                        type="text"
                        placeholder="Введите логин"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        disabled={isLocked}
                        autoComplete="off"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="admin-password">Пароль</Label>
                      <div className="relative">
                        <Input
                          id="admin-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Введите пароль"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          disabled={isLocked}
                          autoComplete="off"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg text-sm text-amber-700">
                      <Lock className="w-4 h-4 flex-shrink-0" />
                      <p>После {MAX_ATTEMPTS} неудачных попыток доступ будет заблокирован на 30 минут.</p>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-gray-900 hover:bg-gray-800"
                      disabled={isLocked || !login || !password}
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Войти
                    </Button>

                    <div className="text-center">
                      <a
                        href="/login"
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        ← Вернуться к обычному входу
                      </a>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
