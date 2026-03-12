-- =====================================================
-- SQL-скрипты для импорта данных в 1С-Битрикс
-- Addis Coffee Migration
-- =====================================================

-- =====================================================
-- 1. СОЗДАНИЕ ИНФОБЛОКА ТОВАРОВ
-- =====================================================

-- Создание типа инфоблока
INSERT INTO b_iblock_type (ID, SECTIONS, EDIT_FILE_BEFORE, EDIT_FILE_AFTER, IN_RSS, SORT) 
VALUES ('catalog', 'Y', '', '', 'N', 500);

-- Локализация типа инфоблока
INSERT INTO b_iblock_type_lang (IBLOCK_TYPE_ID, LID, NAME, SECTION_NAME, ELEMENT_NAME) 
VALUES ('catalog', 'ru', 'Каталог', 'Разделы', 'Товары');

-- =====================================================
-- 2. СОЗДАНИЕ СВОЙСТВ ИНФОБЛОКА ТОВАРОВ
-- =====================================================

-- Свойство: Категория (CATEGORY)
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED, MULTIPLE) 
VALUES ([IBLOCK_ID], 'Категория', 'Y', 100, 'CATEGORY', 'L', 'Y', 'N');

-- Значения списка для категории
INSERT INTO b_iblock_property_enum (PROPERTY_ID, VALUE, DEF, SORT, XML_ID) VALUES
([PROPERTY_ID], 'Эспрессо', 'N', 100, 'espresso'),
([PROPERTY_ID], 'Фильтр', 'N', 200, 'filter'),
([PROPERTY_ID], 'Дрип-пакеты', 'N', 300, 'drip');

-- Свойство: Тип (TYPE)
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED) 
VALUES ([IBLOCK_ID], 'Тип', 'Y', 200, 'TYPE', 'S', 'Y');

-- Свойство: Состав (COMPOSITION)
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED) 
VALUES ([IBLOCK_ID], 'Состав', 'Y', 300, 'COMPOSITION', 'S', 'Y');

-- Свойство: Обжарка (ROAST)
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED) 
VALUES ([IBLOCK_ID], 'Обжарка', 'Y', 400, 'ROAST', 'S', 'Y');

-- Свойство: Q-Grade (Q_GRADE)
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED) 
VALUES ([IBLOCK_ID], 'Q-Grade', 'Y', 500, 'Q_GRADE', 'S', 'Y');

-- Свойство: Вкусовой профиль (TASTE_PROFILE)
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED) 
VALUES ([IBLOCK_ID], 'Вкусовой профиль', 'Y', 600, 'TASTE_PROFILE', 'S', 'Y');

-- Свойство: Дескрипторы (DESCRIPTORS) - множественное
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED, MULTIPLE) 
VALUES ([IBLOCK_ID], 'Дескрипторы', 'Y', 700, 'DESCRIPTORS', 'S', 'N', 'Y');

-- Свойство: Цена 250г (PRICE_250)
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED) 
VALUES ([IBLOCK_ID], 'Цена 250г', 'Y', 800, 'PRICE_250', 'N', 'Y');

-- Свойство: Цена 1000г (PRICE_1000)
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED) 
VALUES ([IBLOCK_ID], 'Цена 1000г', 'Y', 900, 'PRICE_1000', 'N', 'Y');

-- Свойство: Оптовая цена 250г (WHOLESALE_PRICE_250)
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED) 
VALUES ([IBLOCK_ID], 'Оптовая цена 250г', 'Y', 1000, 'WHOLESALE_PRICE_250', 'N', 'Y');

-- Свойство: Оптовая цена 1000г (WHOLESALE_PRICE_1000)
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED) 
VALUES ([IBLOCK_ID], 'Оптовая цена 1000г', 'Y', 1100, 'WHOLESALE_PRICE_1000', 'N', 'Y');

-- Свойство: Рейтинг (RATING)
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED) 
VALUES ([IBLOCK_ID], 'Рейтинг', 'Y', 1200, 'RATING', 'N', 'N');

-- Свойство: Количество отзывов (REVIEWS)
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED) 
VALUES ([IBLOCK_ID], 'Количество отзывов', 'Y', 1300, 'REVIEWS', 'N', 'N');

-- Свойство: Тег (TAG)
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED) 
VALUES ([IBLOCK_ID], 'Тег', 'Y', 1400, 'TAG', 'S', 'N');

-- Свойство: Новинка (IS_NEW)
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED) 
VALUES ([IBLOCK_ID], 'Новинка', 'Y', 1500, 'IS_NEW', 'L', 'N');

-- Значения для IS_NEW
INSERT INTO b_iblock_property_enum (PROPERTY_ID, VALUE, DEF, SORT, XML_ID) VALUES
([PROPERTY_ID], 'Да', 'N', 100, 'Y'),
([PROPERTY_ID], 'Нет', 'Y', 200, 'N');

-- Свойство: Бестселлер (IS_BESTSELLER)
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED) 
VALUES ([IBLOCK_ID], 'Бестселлер', 'Y', 1600, 'IS_BESTSELLER', 'L', 'N');

-- Значения для IS_BESTSELLER
INSERT INTO b_iblock_property_enum (PROPERTY_ID, VALUE, DEF, SORT, XML_ID) VALUES
([PROPERTY_ID], 'Да', 'N', 100, 'Y'),
([PROPERTY_ID], 'Нет', 'Y', 200, 'N');

-- =====================================================
-- 3. СОЗДАНИЕ ИНФОБЛОКА БЛОГА
-- =====================================================

-- Создание типа инфоблока
INSERT INTO b_iblock_type (ID, SECTIONS, EDIT_FILE_BEFORE, EDIT_FILE_AFTER, IN_RSS, SORT) 
VALUES ('content', 'Y', '', '', 'Y', 400);

-- Локализация типа инфоблока
INSERT INTO b_iblock_type_lang (IBLOCK_TYPE_ID, LID, NAME, SECTION_NAME, ELEMENT_NAME) 
VALUES ('content', 'ru', 'Контент', 'Разделы', 'Элементы');

-- Свойство: Категория (CATEGORY)
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED) 
VALUES ([BLOG_IBLOCK_ID], 'Категория', 'Y', 100, 'CATEGORY', 'S', 'Y');

-- Свойство: Автор (AUTHOR)
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED) 
VALUES ([BLOG_IBLOCK_ID], 'Автор', 'Y', 200, 'AUTHOR', 'S', 'Y');

-- Свойство: Время чтения (READ_TIME)
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED) 
VALUES ([BLOG_IBLOCK_ID], 'Время чтения', 'Y', 300, 'READ_TIME', 'S', 'N');

-- Свойство: Теги (TAGS) - множественное
INSERT INTO b_iblock_property (IBLOCK_ID, NAME, ACTIVE, SORT, CODE, PROPERTY_TYPE, IS_REQUIRED, MULTIPLE) 
VALUES ([BLOG_IBLOCK_ID], 'Теги', 'Y', 400, 'TAGS', 'S', 'N', 'Y');

-- =====================================================
-- 4. СОЗДАНИЕ ПОЛЬЗОВАТЕЛЬСКИХ СВОЙСТВ (UF_)
-- =====================================================

-- Тип клиента
INSERT INTO b_user_field (ENTITY_ID, FIELD_NAME, USER_TYPE_ID, XML_ID, SORT, MULTIPLE, MANDATORY, SHOW_FILTER, SHOW_IN_LIST, EDIT_IN_LIST, IS_SEARCHABLE) 
VALUES ('USER', 'UF_CUSTOMER_TYPE', 'enumeration', '', 100, 'N', 'N', 'I', 'Y', 'Y', 'N');

INSERT INTO b_user_field_enum (USER_FIELD_ID, VALUE, DEF, SORT) VALUES
([UF_ID], 'retail', 'Y', 100),
([UF_ID], 'wholesale', 'N', 200);

-- Дата рождения
INSERT INTO b_user_field (ENTITY_ID, FIELD_NAME, USER_TYPE_ID, XML_ID, SORT, MULTIPLE, MANDATORY, SHOW_FILTER, SHOW_IN_LIST, EDIT_IN_LIST, IS_SEARCHABLE) 
VALUES ('USER', 'UF_BIRTH_DATE', 'date', '', 200, 'N', 'N', 'I', 'Y', 'Y', 'N');

-- Пол
INSERT INTO b_user_field (ENTITY_ID, FIELD_NAME, USER_TYPE_ID, XML_ID, SORT, MULTIPLE, MANDATORY, SHOW_FILTER, SHOW_IN_LIST, EDIT_IN_LIST, IS_SEARCHABLE) 
VALUES ('USER', 'UF_GENDER', 'enumeration', '', 300, 'N', 'N', 'I', 'Y', 'Y', 'N');

INSERT INTO b_user_field_enum (USER_FIELD_ID, VALUE, DEF, SORT) VALUES
([UF_ID], 'male', 'N', 100),
([UF_ID], 'female', 'N', 200);

-- Бонусные баллы
INSERT INTO b_user_field (ENTITY_ID, FIELD_NAME, USER_TYPE_ID, XML_ID, SORT, MULTIPLE, MANDATORY, SHOW_FILTER, SHOW_IN_LIST, EDIT_IN_LIST, IS_SEARCHABLE) 
VALUES ('USER', 'UF_BONUS_POINTS', 'integer', '', 400, 'N', 'N', 'I', 'Y', 'Y', 'N');

-- Название компании
INSERT INTO b_user_field (ENTITY_ID, FIELD_NAME, USER_TYPE_ID, XML_ID, SORT, MULTIPLE, MANDATORY, SHOW_FILTER, SHOW_IN_LIST, EDIT_IN_LIST, IS_SEARCHABLE) 
VALUES ('USER', 'UF_COMPANY_NAME', 'string', '', 500, 'N', 'N', 'I', 'Y', 'Y', 'Y');

-- ИНН
INSERT INTO b_user_field (ENTITY_ID, FIELD_NAME, USER_TYPE_ID, XML_ID, SORT, MULTIPLE, MANDATORY, SHOW_FILTER, SHOW_IN_LIST, EDIT_IN_LIST, IS_SEARCHABLE) 
VALUES ('USER', 'UF_INN', 'string', '', 600, 'N', 'N', 'I', 'Y', 'Y', 'Y');

-- КПП
INSERT INTO b_user_field (ENTITY_ID, FIELD_NAME, USER_TYPE_ID, XML_ID, SORT, MULTIPLE, MANDATORY, SHOW_FILTER, SHOW_IN_LIST, EDIT_IN_LIST, IS_SEARCHABLE) 
VALUES ('USER', 'UF_KPP', 'string', '', 700, 'N', 'N', 'I', 'Y', 'Y', 'N');

-- Юридический адрес
INSERT INTO b_user_field (ENTITY_ID, FIELD_NAME, USER_TYPE_ID, XML_ID, SORT, MULTIPLE, MANDATORY, SHOW_FILTER, SHOW_IN_LIST, EDIT_IN_LIST, IS_SEARCHABLE) 
VALUES ('USER', 'UF_LEGAL_ADDRESS', 'string', '', 800, 'N', 'N', 'I', 'Y', 'Y', 'N');

-- ФИО директора
INSERT INTO b_user_field (ENTITY_ID, FIELD_NAME, USER_TYPE_ID, XML_ID, SORT, MULTIPLE, MANDATORY, SHOW_FILTER, SHOW_IN_LIST, EDIT_IN_LIST, IS_SEARCHABLE) 
VALUES ('USER', 'UF_DIRECTOR_NAME', 'string', '', 900, 'N', 'N', 'I', 'Y', 'Y', 'N');

-- Уровень скидки
INSERT INTO b_user_field (ENTITY_ID, FIELD_NAME, USER_TYPE_ID, XML_ID, SORT, MULTIPLE, MANDATORY, SHOW_FILTER, SHOW_IN_LIST, EDIT_IN_LIST, IS_SEARCHABLE) 
VALUES ('USER', 'UF_WHOLESALE_TIER', 'enumeration', '', 1000, 'N', 'N', 'I', 'Y', 'Y', 'N');

INSERT INTO b_user_field_enum (USER_FIELD_ID, VALUE, DEF, SORT) VALUES
([UF_ID], '1', 'Y', 100),
([UF_ID], '2', 'N', 200),
([UF_ID], '3', 'N', 300),
([UF_ID], '4', 'N', 400);

-- Верифицирован
INSERT INTO b_user_field (ENTITY_ID, FIELD_NAME, USER_TYPE_ID, XML_ID, SORT, MULTIPLE, MANDATORY, SHOW_FILTER, SHOW_IN_LIST, EDIT_IN_LIST, IS_SEARCHABLE) 
VALUES ('USER', 'UF_IS_VERIFIED', 'boolean', '', 1100, 'N', 'N', 'I', 'Y', 'Y', 'N');

-- =====================================================
-- 5. СОЗДАНИЕ ГРУПП ПОЛЬЗОВАТЕЛЕЙ
-- =====================================================

-- Оптовые клиенты (на модерации)
INSERT INTO b_group (NAME, STRING_ID, C_SORT, ACTIVE, DESCRIPTION) 
VALUES ('Оптовые клиенты (на модерации)', 'WHOLESALE_PENDING', 500, 'Y', 'Оптовые клиенты, ожидающие верификации');

-- Оптовые клиенты (Стартовый)
INSERT INTO b_group (NAME, STRING_ID, C_SORT, ACTIVE, DESCRIPTION) 
VALUES ('Оптовые клиенты (Стартовый -15%)', 'WHOLESALE_TIER_1', 510, 'Y', 'Оптовые клиенты со скидкой 15%');

-- Оптовые клиенты (Базовый)
INSERT INTO b_group (NAME, STRING_ID, C_SORT, ACTIVE, DESCRIPTION) 
VALUES ('Оптовые клиенты (Базовый -20%)', 'WHOLESALE_TIER_2', 520, 'Y', 'Оптовые клиенты со скидкой 20%');

-- Оптовые клиенты (Продвинутый)
INSERT INTO b_group (NAME, STRING_ID, C_SORT, ACTIVE, DESCRIPTION) 
VALUES ('Оптовые клиенты (Продвинутый -25%)', 'WHOLESALE_TIER_3', 530, 'Y', 'Оптовые клиенты со скидкой 25%');

-- Оптовые клиенты (Партнёрский)
INSERT INTO b_group (NAME, STRING_ID, C_SORT, ACTIVE, DESCRIPTION) 
VALUES ('Оптовые клиенты (Партнёрский -30%)', 'WHOLESALE_TIER_4', 540, 'Y', 'Оптовые клиенты со скидкой 30%');

-- =====================================================
-- 6. СТАТУСЫ ЗАКАЗОВ
-- =====================================================

-- Добавление кастомных статусов
INSERT INTO b_sale_status (ID, SORT, NOTIFY, COLOR) VALUES
('PENDING', 100, 'Y', 'FF9800'),
('CONFIRMED', 200, 'Y', '2196F3'),
('PROCESSING', 300, 'Y', '9C27B0'),
('SHIPPED', 400, 'Y', '673AB7'),
('DELIVERED', 500, 'Y', '4CAF50'),
('CANCELLED', 600, 'Y', 'F44336'),
('RETURNED', 700, 'Y', '795548');

-- Локализация статусов
INSERT INTO b_sale_status_lang (STATUS_ID, LID, NAME, DESCRIPTION) VALUES
('PENDING', 'ru', 'Ожидает подтверждения', 'Заказ ожидает подтверждения менеджером'),
('CONFIRMED', 'ru', 'Подтверждён', 'Заказ подтверждён, готовится к сборке'),
('PROCESSING', 'ru', 'В обработке', 'Заказ собирается на складе'),
('SHIPPED', 'ru', 'Отправлен', 'Заказ передан в доставку'),
('DELIVERED', 'ru', 'Доставлен', 'Заказ успешно доставлен'),
('CANCELLED', 'ru', 'Отменён', 'Заказ отменён'),
('RETURNED', 'ru', 'Возврат', 'Заказ возвращён');

-- =====================================================
-- 7. СЛУЖБЫ ДОСТАВКИ
-- =====================================================

-- СДЭК
INSERT INTO b_sale_delivery_srv (NAME, ACTIVE, SORT, DESCRIPTION, CLASS_NAME, CURRENCY) 
VALUES ('СДЭК', 'Y', 100, 'Доставка по всей России', '\\Bitrix\\Sale\\Delivery\\Services\\EmptyDeliveryService', 'RUB');

-- ПЭК
INSERT INTO b_sale_delivery_srv (NAME, ACTIVE, SORT, DESCRIPTION, CLASS_NAME, CURRENCY) 
VALUES ('ПЭК', 'Y', 200, 'Грузоперевозки по РФ', '\\Bitrix\\Sale\\Delivery\\Services\\EmptyDeliveryService', 'RUB');

-- Деловые Линии
INSERT INTO b_sale_delivery_srv (NAME, ACTIVE, SORT, DESCRIPTION, CLASS_NAME, CURRENCY) 
VALUES ('Деловые Линии', 'Y', 300, 'Надёжная логистика', '\\Bitrix\\Sale\\Delivery\\Services\\EmptyDeliveryService', 'RUB');

-- Dalli
INSERT INTO b_sale_delivery_srv (NAME, ACTIVE, SORT, DESCRIPTION, CLASS_NAME, CURRENCY) 
VALUES ('Dalli (Москва/СПб)', 'Y', 400, 'Курьерская доставка', '\\Bitrix\\Sale\\Delivery\\Services\\EmptyDeliveryService', 'RUB');

-- =====================================================
-- 8. ПЛАТЁЖНЫЕ СИСТЕМЫ
-- =====================================================

-- Онлайн оплата
INSERT INTO b_sale_pay_system (NAME, ACTIVE, SORT, DESCRIPTION, CLASS_NAME, CURRENCY) 
VALUES ('Онлайн оплата', 'Y', 100, 'Оплата банковской картой', '\\Bitrix\\Sale\\PaySystem\\CashPaySystem', 'RUB');

-- Оплата при получении
INSERT INTO b_sale_pay_system (NAME, ACTIVE, SORT, DESCRIPTION, CLASS_NAME, CURRENCY) 
VALUES ('Оплата при получении', 'Y', 200, 'Наличными или картой курьеру', '\\Bitrix\\Sale\\PaySystem\\CashPaySystem', 'RUB');

-- Безналичный расчёт (для опта)
INSERT INTO b_sale_pay_system (NAME, ACTIVE, SORT, DESCRIPTION, CLASS_NAME, CURRENCY) 
VALUES ('Безналичный расчёт', 'Y', 300, 'Оплата по счёту для юр. лиц', '\\Bitrix\\Sale\\PaySystem\\CashPaySystem', 'RUB');

-- =====================================================
-- ПРИМЕЧАНИЕ
-- =====================================================
-- [IBLOCK_ID] - заменить на реальный ID инфоблока товаров
-- [BLOG_IBLOCK_ID] - заменить на реальный ID инфоблока блога
-- [PROPERTY_ID] - заменить на реальный ID свойства
-- [UF_ID] - заменить на реальный ID пользовательского поля
-- =====================================================
