# 🔍 Проверка структуры проекта Addis Coffee

## ✅ Полная структура файлов и компонентов

### 📁 Директория проекта
```
/workspace/
├── app/                          # Основное React-приложение
│   ├── src/
│   │   ├── App.tsx              # Маршрутизация (15 routes)
│   │   ├── main.tsx             # Точка входа
│   │   ├── components/          # UI компоненты
│   │   │   ├── ui/             # shadcn/ui компоненты (40+ файлов)
│   │   │   ├── cart/           # Компоненты корзины
│   │   │   │   ├── CartIcon.tsx
│   │   │   │   ├── LoyaltyProfileForm.tsx
│   │   │   │   ├── RetailCheckoutForm.tsx
│   │   │   │   └── WholesaleLoginForm.tsx
│   │   │   ├── SearchDropdown.tsx   # Поиск с fuzzy search
│   │   │   ├── SearchDialog.tsx
│   │   │   └── AddisLogo.tsx
│   │   ├── sections/           # Секции главной страницы
│   │   │   ├── Header.tsx      # Навигация + поиск + корзина
│   │   │   ├── Hero.tsx        # Баннер
│   │   │   ├── Categories.tsx  # Категории товаров
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── About.tsx       # О компании
│   │   │   ├── HoReCa.tsx      # Для бизнеса
│   │   │   ├── Process.tsx     # Процесс обжарки
│   │   │   ├── Logistics.tsx   # Доставка
│   │   │   ├── Testimonials.tsx
│   │   │   ├── CTA.tsx
│   │   │   └── Footer.tsx      # Подвал со ссылками
│   │   ├── pages/              # Страницы приложения (15 файлов)
│   │   │   ├── HomePage.tsx
│   │   │   ├── CategoryPage.tsx
│   │   │   ├── ProductPage.tsx
│   │   │   ├── BlogPage.tsx
│   │   │   ├── BlogPostPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── WholesaleRegisterPage.tsx
│   │   │   ├── AccountPage.tsx
│   │   │   ├── WholesaleAccountPage.tsx
│   │   │   ├── AdminLoginPage.tsx
│   │   │   ├── AdminPage.tsx
│   │   │   ├── PrivacyPage.tsx
│   │   │   └── TermsPage.tsx
│   │   ├── store/              # Zustand stores
│   │   │   └── cartStore.ts    # Корзина + лояльность + опт
│   │   ├── data/               # Статические данные
│   │   │   ├── products.ts     # 50 товаров
│   │   │   └── blog.ts         # 15 статей
│   │   ├── types/              # TypeScript типы
│   │   │   └── order.ts
│   │   ├── hooks/              # Кастомные хуки
│   │   │   └── use-mobile.ts
│   │   └── lib/                # Утилиты
│   │       └── utils.ts
│   ├── public/                 # Статические файлы
│   ├── dist/                   # Сборка
│   └── package.json
├── images/                     # Изображения для сайта
├── assets/                     # CSS/JS ассеты
├── bitrix_components/          # Компоненты для Битрикс
├── ADDIS_SITE_MAP.md          # Карта сайта
├── TECHNICAL_DOCUMENTATION.md # Тех. документация
└── README_DOCUMENTATION.md    # README
```

---

## 🔗 Логические переходы между страницами

### 1. Главная страница (/) → Все разделы
```
HomePage.tsx
├── Header → навигация ко всем разделам
├── Hero → /category/espresso, /register-wholesale
├── Categories → /category/:category
├── FeaturedProducts → /product/:id
├── About → секция #about (скролл)
├── HoReCa → секция #horeca (скролл), /register-wholesale
├── Process → секция #process (скролл)
├── Logistics → секция #logistics (скролл)
├── Testimonials → секция #testimonials (скролл)
├── CTA → /category/espresso
└── Footer → все основные ссылки
```

### 2. Каталог товаров
```
CategoryPage.tsx (/category/:category)
├── Хлебные крошки → / (Главная)
├── Карточки товаров → /product/:id
└── Фильтры по категории
```

### 3. Страница товара
```
ProductPage.tsx (/product/:id)
├── Хлебные крошки → / → /category/:category
├── Кнопка "В корзину" → CartStore → /cart
├── Похожие товары → /product/:other_id
└── Кнопка "Назад к категории" → /category/:category
```

### 4. Блог
```
BlogPage.tsx (/blog)
├── Хлебные крошки → / (Главная)
└── Карточки статей → /blog/:slug

BlogPostPage.tsx (/blog/:slug)
├── Хлебные крошки → / → /blog
├── Похожие статьи → /blog/:other_slug
└── Кнопка "Назад" → /blog
```

### 5. Корзина
```
CartPage.tsx (/cart)
├── Пустая корзина → /category/espresso, /#categories
├── Товар из корзины → /product/:id
├── Розничное оформление → RetailCheckoutForm → API 1C
├── Оптовое оформление → WholesaleLoginForm → /login?type=wholesale
└── Профиль лояльности → LoyaltyProfileForm
```

### 6. Авторизация и регистрация
```
LoginPage.tsx (/login)
├── Вкладка "Розница" → после входа → /account
├── Вкладка "Опт" → после входа → /wholesale-account
├── Ссылка "Регистрация" → /register
└── Ссылка "Регистрация опта" → /register-wholesale

RegisterPage.tsx (/register)
├── После регистрации → /login
├── Ссылка на /privacy, /terms
└── Ссылка "Уже есть аккаунт" → /login

WholesaleRegisterPage.tsx (/register-wholesale)
├── После регистрации → /login
├── Ссылка на /terms, /privacy
└── Ссылка "Уже есть аккаунт" → /login
```

### 7. Личные кабинеты
```
AccountPage.tsx (/account) - Розница
├── Информация о профиле
├── История заказов
├── Бонусные баллы
├── Профиль лояльности
└── Кнопка "Выйти" → /

WholesaleAccountPage.tsx (/wholesale-account) - Опт
├── Информация о компании
├── Уровень скидки (4 уровня)
├── История заказов
├── Документы
└── Кнопка "Выйти" → /
```

### 8. Админ-панель
```
AdminLoginPage.tsx (/admin-login)
└── После входа → /admin

AdminPage.tsx (/admin)
├── Dashboard - статистика
├── Товары - управление каталогом
├── Блог - управление статьями
├── Пользователи - управление клиентами
├── Заказы - обработка заказов
├── Скидки - управление уровнями
└── Настройки
```

### 9. Юридическая информация
```
PrivacyPage.tsx (/privacy)
└── Ссылки из: Footer, CartPage, RegisterPage

TermsPage.tsx (/terms)
└── Ссылки из: Footer, CartPage, RegisterPage
```

---

## 🔄 User Flow сценарии

### 👤 Розничный клиент
```
Главная → Каталог → Товар → Корзина → Оформление → Заказ
   ↓         ↓         ↓        ↓         ↓
  Блог    Категория  Детали  Checkout  Подтверждение
```

### 🏢 Оптовый клиент
```
Главная → HoReCa → Регистрация опта → Вход → ЛК опта → Заказ через менеджера
```

### 🔐 Администратор
```
/admin-login → /admin → Управление (товары/блог/заказы/пользователи)
```

---

## 💾 State Management (Zustand)

### cartStore.ts
```typescript
interface CartState {
  items: CartItem[]              // Товары в корзине
  customerType: 'retail' | 'wholesale'
  loyaltyProfile: LoyaltyProfile | null
  wholesaleCompany: WholesaleCompany | null
  
  // Actions
  addItem, removeItem, updateQuantity
  setCustomerType, updateLoyaltyProfile, setWholesaleCompany
  
  // Getters
  getTotalItems, getSubtotal, getDiscount, getTotal
  getWholesalePrice, getBonusPointsForField
}
```

---

## 🔌 API Интеграции

### 1С:Предприятие
- POST `/api/v1/order/create` - Создание заказа
- GET `/api/v1/order/{id}` - Получение заказа
- POST `/api/v1/products/sync` - Синхронизация товаров

### Логистика
- СДЭК API - расчёт доставки
- ПЭК API - расчёт доставки
- Деловые Линии API - расчёт доставки
- Dalli (Яндекс) - доставка по Москве

### Платежи
- ЮKassa / Сбербанк / Тинькофф

---

## ✅ Проверка целостности

### Все маршруты определены в App.tsx:
- [x] `/` - HomePage
- [x] `/category/:category` - CategoryPage
- [x] `/product/:id` - ProductPage
- [x] `/blog` - BlogPage
- [x] `/blog/:slug` - BlogPostPage
- [x] `/cart` - CartPage
- [x] `/login` - LoginPage
- [x] `/register` - RegisterPage
- [x] `/register-wholesale` - WholesaleRegisterPage
- [x] `/account` - AccountPage
- [x] `/wholesale-account` - WholesaleAccountPage
- [x] `/admin-login` - AdminLoginPage
- [x] `/admin` - AdminPage
- [x] `/privacy` - PrivacyPage
- [x] `/terms` - TermsPage

### Все компоненты импортированы корректно:
- [x] Header/Footer на всех страницах
- [x] SearchDropdown в Header
- [x] CartIcon в Header
- [x] Все UI компоненты shadcn/ui

### Логические переходы работают:
- [x] Навигация через Link (react-router-dom)
- [x] Навигация через useNavigate
- [x] Скролл к секциям на главной
- [x] Возврат на главную из личных кабинетов

### Поиск работает:
- [x] Транслитерация латин↔кириллица
- [x] Fuzzy search (Levenshtein distance)
- [x] Переход на /product/:id или /blog/:slug

---

## 📊 Итоговая статистика

| Метрика | Значение |
|---------|----------|
| Всего страниц | 15 |
| Всего компонентов UI | 40+ |
| Товаров в каталоге | 50 |
| Статей в блоге | 15 |
| Уровней оптовых скидок | 4 |
| Типов клиентов | 2 (розница/опт) |
| Языков | 1 (русский) |
| Сборка | ✅ Успешна |

---

*Проверка выполнена: 2025-01-XX*
*Статус: ✅ Все взаимосвязи корректны*
