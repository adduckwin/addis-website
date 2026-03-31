<?php
/**
 * Обработчики событий для 1С-Битрикс
 * Файл: /local/php_interface/init.php
 */

use Bitrix\Main\Loader;
use Bitrix\Sale\Order;
use Bitrix\Main\EventManager;

// Подключаем модуль sale
Loader::includeModule('sale');
Loader::includeModule('iblock');

/**
 * ============================================
 * 1. БОНУСНАЯ ПРОГРАММА
 * ============================================
 */

/**
 * Начисление бонусов при смене статуса заказа на "Выполнен"
 */
EventManager::getInstance()->addEventHandler(
    'sale',
    'OnSaleStatusOrderChange',
    'OnOrderStatusChangeHandler'
);

function OnOrderStatusChangeHandler($event)
{
    $order = $event->getParameter('ENTITY');
    $value = $event->getParameter('VALUE');
    
    // Если заказ выполнен (статус F)
    if ($value === 'F') {
        $orderId = $order->getId();
        $userId = $order->getUserId();
        $price = $order->getPrice();
        
        // Рассчитываем бонусы: 1 балл за каждые 100 ₽
        $bonusPoints = floor($price / 100);
        
        if ($bonusPoints > 0 && $userId > 0) {
            // Получаем текущие бонусы пользователя
            $user = new CUser;
            $userData = CUser::GetByID($userId)->Fetch();
            $currentBonus = (int)$userData['UF_BONUS_POINTS'];
            
            // Начисляем новые бонусы
            $newBonus = $currentBonus + $bonusPoints;
            $user->Update($userId, [
                'UF_BONUS_POINTS' => $newBonus
            ]);
            
            // Записываем в свойство заказа
            $propertyCollection = $order->getPropertyCollection();
            $bonusProperty = $propertyCollection->getItemByOrderPropertyCode('BONUS_EARNED');
            if ($bonusProperty) {
                $bonusProperty->setValue($bonusPoints);
            }
            
            // Отправляем email уведомление
            $arEventFields = [
                'ORDER_ID' => $orderId,
                'USER_ID' => $userId,
                'BONUS_POINTS' => $bonusPoints,
                'TOTAL_BONUS' => $newBonus,
                'EMAIL' => $userData['EMAIL'],
            ];
            
            CEvent::Send('ADDIS_BONUS_EARNED', 's1', $arEventFields);
        }
    }
}

/**
 * Списание бонусов при оплате заказа
 */
EventManager::getInstance()->addEventHandler(
    'sale',
    'OnSaleOrderBeforeSaved',
    'OnOrderBeforeSaveHandler'
);

function OnOrderBeforeSaveHandler($event)
{
    $order = $event->getParameter('ENTITY');
    $userId = $order->getUserId();
    
    if ($userId <= 0) {
        return;
    }
    
    // Получаем использованные бонусы из свойства заказа
    $propertyCollection = $order->getPropertyCollection();
    $bonusUsedProperty = $propertyCollection->getItemByOrderPropertyCode('BONUS_USED');
    
    if ($bonusUsedProperty) {
        $bonusUsed = (int)$bonusUsedProperty->getValue();
        
        if ($bonusUsed > 0) {
            // Получаем текущие бонусы пользователя
            $user = new CUser;
            $userData = CUser::GetByID($userId)->Fetch();
            $currentBonus = (int)$userData['UF_BONUS_POINTS'];
            
            // Проверяем достаточно ли бонусов
            if ($currentBonus >= $bonusUsed) {
                // Списываем бонусы
                $newBonus = $currentBonus - $bonusUsed;
                $user->Update($userId, [
                    'UF_BONUS_POINTS' => $newBonus
                ]);
            } else {
                // Недостаточно бонусов - отменяем использование
                $bonusUsedProperty->setValue(0);
            }
        }
    }
}

/**
 * ============================================
 * 2. ИНТЕГРАЦИЯ С 1С
 * ============================================
 */

/**
 * Отправка заказа в 1С при создании
 */
EventManager::getInstance()->addEventHandler(
    'sale',
    'OnSaleOrderEntitySaved',
    'OnOrderSavedHandler'
);

function OnOrderSavedHandler($event)
{
    $order = $event->getParameter('ENTITY');
    $orderId = $order->getId();
    
    // Формируем данные для 1С
    $orderData = prepareOrderDataFor1C($order);
    
    // Отправляем в 1С
    $result = sendOrderTo1C($orderData);
    
    if ($result['success']) {
        // Сохраняем ID заказа в 1С
        $order->setField('ADDITIONAL_INFO', json_encode([
            '1C_ORDER_ID' => $result['order1CId']
        ]));
    } else {
        // Логируем ошибку
        AddMessage2Log('1C Integration Error: ' . $result['error'], 'addis.1c');
    }
}

/**
 * Подготовка данных заказа для 1С
 */
function prepareOrderDataFor1C(Order $order): array
{
    $propertyCollection = $order->getPropertyCollection();
    
    // Получаем свойства заказа
    $phoneProp = $propertyCollection->getPhone();
    $emailProp = $propertyCollection->getUserEmail();
    $nameProp = $propertyCollection->getPayerName();
    
    // Получаем товары
    $basket = $order->getBasket();
    $items = [];
    
    foreach ($basket->getBasketItems() as $basketItem) {
        $items[] = [
            'sku' => $basketItem->getField('PRODUCT_XML_ID'),
            'name' => $basketItem->getField('NAME'),
            'quantity' => $basketItem->getQuantity(),
            'price' => $basketItem->getPrice(),
            'weight' => $basketItem->getField('WEIGHT') ?: 1000,
        ];
    }
    
    // Определяем тип заказа
    $userId = $order->getUserId();
    $user = CUser::GetByID($userId)->Fetch();
    $orderType = $user['UF_CUSTOMER_TYPE'] === 'wholesale' ? 'wholesale' : 'retail';
    
    return [
        'orderId' => 'ADD-' . $order->getId(),
        'orderType' => $orderType,
        'customer' => [
            'name' => $nameProp ? $nameProp->getValue() : '',
            'phone' => $phoneProp ? $phoneProp->getValue() : '',
            'email' => $emailProp ? $emailProp->getValue() : '',
            'inn' => $user['UF_INN'] ?? null,
            'companyName' => $user['UF_COMPANY_NAME'] ?? null,
        ],
        'items' => $items,
        'delivery' => [
            'type' => getDeliveryType($order),
            'address' => getDeliveryAddress($order),
            'cost' => $order->getDeliveryPrice(),
        ],
        'payment' => [
            'type' => getPaymentType($order),
            'status' => $order->isPaid() ? 'paid' : 'pending',
        ],
        'total' => $order->getPrice(),
    ];
}

/**
 * Отправка заказа в 1С через REST API
 */
function sendOrderTo1C(array $orderData): array
{
    $apiUrl = 'https://1c.addis-coffee.ru/api/v1/order/create';
    $apiKey = 'YOUR_1C_API_KEY';
    
    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($orderData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey,
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        $result = json_decode($response, true);
        return [
            'success' => true,
            'order1CId' => $result['order1CId'] ?? null,
        ];
    }
    
    return [
        'success' => false,
        'error' => 'HTTP ' . $httpCode . ': ' . $response,
    ];
}

/**
 * Получить тип доставки
 */
function getDeliveryType(Order $order): string
{
    $shipmentCollection = $order->getShipmentCollection();
    foreach ($shipmentCollection as $shipment) {
        if (!$shipment->isSystem()) {
            $service = $shipment->getDeliveryService();
            return $service ? $service->getName() : 'unknown';
        }
    }
    return 'unknown';
}

/**
 * Получить адрес доставки
 */
function getDeliveryAddress(Order $order): string
{
    $propertyCollection = $order->getPropertyCollection();
    $addressProp = $propertyCollection->getItemByOrderPropertyCode('ADDRESS');
    
    return $addressProp ? $addressProp->getValue() : '';
}

/**
 * Получить тип оплаты
 */
function getPaymentType(Order $order): string
{
    $paymentCollection = $order->getPaymentCollection();
    foreach ($paymentCollection as $payment) {
        $paySystem = $payment->getPaySystem();
        return $paySystem ? $paySystem->getName() : 'unknown';
    }
    return 'unknown';
}

/**
 * ============================================
 * 3. ВЕРИФИКАЦИЯ ОПТОВЫХ КЛИЕНТОВ
 * ============================================
 */

/**
 * Обработка регистрации оптового клиента
 */
EventManager::getInstance()->addEventHandler(
    'main',
    'OnAfterUserRegister',
    'OnUserRegisterHandler'
);

function OnUserRegisterHandler(&$arFields)
{
    $userId = $arFields['USER_ID'];
    $customerType = $arFields['UF_CUSTOMER_TYPE'];
    
    if ($customerType === 'wholesale') {
        // Добавляем пользователя в группу "на модерации"
        $groupId = getGroupIdByCode('WHOLESALE_PENDING');
        if ($groupId) {
            CUser::SetUserGroup($userId, [$groupId]);
        }
        
        // Отправляем уведомление менеджеру
        $arEventFields = [
            'USER_ID' => $userId,
            'COMPANY_NAME' => $arFields['UF_COMPANY_NAME'],
            'INN' => $arFields['UF_INN'],
            'EMAIL' => $arFields['EMAIL'],
            'PHONE' => $arFields['PERSONAL_PHONE'],
        ];
        
        CEvent::Send('ADDIS_WHOLESALE_REGISTER', 's1', $arEventFields);
    }
}

/**
 * ============================================
 * 4. ПОЛУЧЕНИЕ ID ГРУППЫ ПО КОДУ
 * ============================================
 */
function getGroupIdByCode(string $code): int
{
    $group = CGroup::GetList(
        $by = 'c_sort',
        $order = 'asc',
        ['STRING_ID' => $code]
    )->Fetch();
    
    return $group ? (int)$group['ID'] : 0;
}
