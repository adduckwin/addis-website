# Руководство по установке 1С-Битрикс для Addis Coffee

## Содержание
1. [Требования](#требования)
2. [Установка](#установка)
3. [Настройка инфоблоков](#настройка-инфоблоков)
4. [Импорт данных](#импорт-данных)
5. [Настройка компонентов](#настройка-компонентов)
6. [Интеграции](#интеграции)

---

## Требования

### Сервер
- **OS**: Linux (Ubuntu 20.04+ / CentOS 8+)
- **Web**: Apache 2.4+ или Nginx 1.18+
- **PHP**: 8.1+
- **MySQL**: 8.0+ или MariaDB 10.6+
- **RAM**: минимум 4GB (рекомендуется 8GB)
- **Disk**: минимум 20GB SSD

### PHP Extensions
```
php8.1-cli php8.1-fpm php8.1-mysql php8.1-xml php8.1-mbstring 
php8.1-curl php8.1-zip php8.1-gd php8.1-intl php8.1-soap
```

### Лицензия
- **1С-Битрикс: Управление сайтом (Бизнес)**
- Стоимость: ~100 000 ₽
- Включает: Интернет-магазин, CRM, Маркетинг

---

## Установка

### Шаг 1: Скачать дистрибутив
```bash
cd /var/www
git clone https://github.com/bitrixdock/bitrixdock.git addis-coffee
cd addis-coffee
```

### Шаг 2: Настроить окружение
```bash
cp .env_template .env
# Отредактировать .env:
# PHP_VERSION=8.1
# MYSQL_DATABASE=addis_coffee
# MYSQL_USER=addis_user
# MYSQL_PASSWORD=your_password
```

### Шаг 3: Запустить контейнеры
```bash
docker-compose up -d
```

### Шаг 4: Установить Битрикс
1. Открыть `http://your-domain.ru`
2. Выбрать "Управление сайтом (Бизнес)"
3. Ввести лицензионный ключ
4. Создать администратора

---

## Настройка инфоблоков

### 1. Создать тип инфоблока "Каталог"
```
Админка → Контент → Инфоблоки → Типы инфоблоков → Добавить тип
- ID: catalog
- Название: Каталог
- Разделы: Да
```

### 2. Создать инфоблок "Товары"
```
Админка → Контент → Инфоблоки → Добавить инфоблок
- Тип: catalog
- Название: Товары
- Символьный код: products
- Индексация: Да
```

### 3. Добавить свойства инфоблока
Свойства из файла `BITRIX_IMPORT.sql`:
- CATEGORY (список)
- TYPE (строка)
- COMPOSITION (строка)
- ROAST (строка)
- Q_GRADE (строка)
- TASTE_PROFILE (строка)
- DESCRIPTORS (множественное)
- PRICE_250 (число)
- PRICE_1000 (число)
- WHOLESALE_PRICE_250 (число)
- WHOLESALE_PRICE_1000 (число)
- RATING (число)
- REVIEWS (число)
- TAG (строка)
- IS_NEW (список)
- IS_BESTSELLER (список)

### 4. Создать разделы
```
- Эспрессо (код: espresso)
- Фильтр (код: filter)
- Дрип-пакеты (код: drip)
```

---

## Импорт данных

### Импорт товаров через CSV
1. Подготовить CSV файл:
```csv
NAME,CODE,PREVIEW_TEXT,CATEGORY,TYPE,COMPOSITION,ROAST,Q_GRADE,TASTE_PROFILE,PRICE_250,PRICE_1000
"Addis Classic 60/40","addis-classic","Классическая смесь...","espresso","Смесь","60% арабика...","Средняя/тёмная","80-81","Горький шоколад...",450,1700
```

2. Админка → Контент → Инфоблоки → Товары → Импорт → CSV

### Импорт через API
```php
<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

CModule::IncludeModule('iblock');

$el = new CIBlockElement;

$arLoadProductArray = [
    "IBLOCK_SECTION_ID" => false,
    "IBLOCK_ID" => 1, // ID инфоблока товаров
    "NAME" => "Addis Classic 60/40",
    "CODE" => "addis-classic",
    "PREVIEW_TEXT" => "Классическая смесь для эспрессо...",
    "PROPERTY_VALUES" => [
        "CATEGORY" => "espresso",
        "TYPE" => "Смесь",
        "COMPOSITION" => "60% арабика Brazil + 40% робуста",
        "ROAST" => "Средняя/тёмная",
        "Q_GRADE" => "80-81",
        "TASTE_PROFILE" => "Горький шоколад, орех, карамель",
        "PRICE_250" => 450,
        "PRICE_1000" => 1700,
        "WHOLESALE_PRICE_250" => 383,
        "WHOLESALE_PRICE_1000" => 1445,
        "RATING" => 4.6,
        "REVIEWS" => 203,
        "TAG" => "Хит",
    ],
];

if ($PRODUCT_ID = $el->Add($arLoadProductArray)) {
    echo "Добавлен товар с ID: " . $PRODUCT_ID;
} else {
    echo "Error: " . $el->LAST_ERROR;
}
?>
```

---

## Настройка компонентов

### Главная страница
```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Addis Coffee — Обжарочное производство кофе");
?>

<!-- Hero Section -->
<?$APPLICATION->IncludeComponent(
    "bitrix:main.include",
    "",
    [
        "AREA_FILE_SHOW" => "file",
        "PATH" => "/local/templates/addis/include/hero.php",
    ],
    false
);?>

<!-- Категории -->
<?$APPLICATION->IncludeComponent(
    "bitrix:catalog.section.list",
    "addis_categories",
    [
        "IBLOCK_TYPE" => "catalog",
        "IBLOCK_ID" => "1",
        "SECTION_URL" => "/catalog/#SECTION_CODE#/",
    ],
    false
);?>

<!-- Товары недели -->
<?$APPLICATION->IncludeComponent(
    "bitrix:catalog.section",
    "addis_featured",
    [
        "IBLOCK_TYPE" => "catalog",
        "IBLOCK_ID" => "1",
        "FILTER_NAME" => "featuredFilter",
        "PAGE_ELEMENT_COUNT" => "4",
    ],
    false
);?>

<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
```

### Каталог товаров
```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Каталог кофе");
?>

<?$APPLICATION->IncludeComponent(
    "bitrix:catalog",
    "addis_catalog",
    [
        "IBLOCK_TYPE" => "catalog",
        "IBLOCK_ID" => "1",
        "SECTIONS_VIEW_MODE" => "LIST",
        "SECTIONS_SHOW_PARENT_NAME" => "Y",
        "PAGE_ELEMENT_COUNT" => "24",
        "LINE_ELEMENT_COUNT" => "3",
        "ELEMENT_SORT_FIELD" => "sort",
        "ELEMENT_SORT_ORDER" => "asc",
        "SECTION_URL" => "/catalog/#SECTION_CODE#/",
        "DETAIL_URL" => "/catalog/#SECTION_CODE#/#ELEMENT_CODE#/",
        "SECTION_ID_VARIABLE" => "SECTION_ID",
        "SEF_MODE" => "Y",
        "SEF_FOLDER" => "/catalog/",
        "SEF_URL_TEMPLATES" => [
            "sections" => "",
            "section" => "#SECTION_CODE#/",
            "element" => "#SECTION_CODE#/#ELEMENT_CODE#/",
        ],
    ],
    false
);?>

<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
```

### Корзина
```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Корзина");
?>

<?$APPLICATION->IncludeComponent(
    "bitrix:sale.basket.basket",
    "addis_cart",
    [
        "PATH_TO_ORDER" => "/cart/order/",
        "HIDE_COUPON" => "N",
        "PRICE_VAT_SHOW_VALUE" => "Y",
        "USE_PREPAYMENT" => "N",
        "QUANTITY_FLOAT" => "N",
        "ACTION_VARIABLE" => "basketAction",
        "SET_TITLE" => "Y",
    ],
    false
);?>

<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
```

### Личный кабинет
```php
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetTitle("Личный кабинет");

// Проверка авторизации
if (!$USER->IsAuthorized()) {
    LocalRedirect("/login/?backurl=" . urlencode($APPLICATION->GetCurPage()));
}
?>

<?$APPLICATION->IncludeComponent(
    "bitrix:sale.personal.section",
    "addis_account",
    [
        "SEF_MODE" => "Y",
        "SEF_FOLDER" => "/account/",
        "SEF_URL_TEMPLATES" => [
            "index" => "index.php",
            "orders" => "orders/",
            "account" => "account/",
            "private" => "private/",
            "subscribe" => "subscribe/",
            "profile" => "profiles/",
            "profile_detail" => "profiles/#ID#",
            "order_detail" => "orders/#ID#",
            "order_cancel" => "cancel/#ID#",
        ],
        "ALLOW_INNER" => "N",
        "SHOW_ACCOUNT_COMPONENT" => "Y",
        "SHOW_ACCOUNT_PAY_COMPONENT" => "Y",
    ],
    false
);?>

<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>
```

---

## Интеграции

### 1. Подключение обработчиков событий
```bash
# Скопировать файл обработчиков
cp /local/php_interface/init.php /var/www/html/bitrix/php_interface/
```

### 2. Настройка почтовых шаблонов
```
Админка → Настройки → Настройки продукта → Почтовые события → Типы почтовых событий

Добавить типы:
- ADDIS_BONUS_EARNED - Начисление бонусов
- ADDIS_WHOLESALE_REGISTER - Регистрация оптового клиента
- ADDIS_ORDER_STATUS - Изменение статуса заказа
```

### 3. Настройка интеграции с 1С
```
Админка → Магазин → Настройки → Интеграция с 1С
- URL для обмена: https://1c.addis-coffee.ru/exchange/
- Логин: addis_exchange
- Пароль: [сгенерировать]
```

### 4. Настройка платёжных систем
```
Админка → Магазин → Настройки → Платёжные системы

Добавить:
1. ЮKassa
   - shopId: [ваш ID]
   - secretKey: [ваш ключ]

2. Оплата при получении
   - Настроить ограничения (только Москва/МО)
```

### 5. Настройка доставки
```
Админка → Магазин → Настройки → Службы доставки

Добавить обработчики:
1. СДЭК - /local/api/delivery/cdek.php
2. ПЭК - /local/api/delivery/pek.php
3. Деловые Линии - /local/api/delivery/dellin.php
4. Dalli - /local/api/delivery/dalli.php
```

---

## Проверка работоспособности

### Тестирование функционала
```bash
# 1. Регистрация розничного клиента
curl -X POST https://your-domain.ru/api/register \
  -d '{"email":"test@example.com","password":"123456","type":"retail"}'

# 2. Добавление в корзину
curl -X POST https://your-domain.ru/api/cart/add \
  -d '{"product_id":1,"weight":250,"quantity":2}'

# 3. Оформление заказа
curl -X POST https://your-domain.ru/api/order/create \
  -d '{"delivery":"cdek","address":"Москва, Тверская 1"}'

# 4. Проверка бонусов
curl https://your-domain.ru/api/user/bonus
```

---

## Полезные команды

### Очистка кэша
```bash
cd /var/www/html
php bitrix/modules/main/tools/clean_cache.php
```

### Резервное копирование
```bash
# База данных
mysqldump -u root -p addis_coffee > backup_$(date +%Y%m%d).sql

# Файлы
tar -czf files_$(date +%Y%m%d).tar.gz /var/www/html/
```

### Логи
```bash
# Apache
tail -f /var/log/apache2/error.log

# Битрикс
tail -f /var/www/html/bitrix/modules/main/tools/logs/error.log
```

---

## Контакты поддержки

**Разработчик:** dev@addis-coffee.ru
**Техническая поддержка:** +7 (999) 123-45-67

---

*Руководство обновлено: 2025-01-15*
