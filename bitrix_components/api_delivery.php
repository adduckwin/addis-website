<?php
/**
 * API для интеграции с логистическими службами
 * Файл: /local/api/delivery/calculate.php
 */

require_once $_SERVER['DOCUMENT_ROOT'] . '/bitrix/modules/main/include/prolog_before.php';

use Bitrix\Main\Application;
use Bitrix\Main\Web\Json;

header('Content-Type: application/json');

class DeliveryAPI
{
    private $request;
    
    public function __construct()
    {
        $this->request = Application::getInstance()->getContext()->getRequest();
    }
    
    /**
     * Расчёт стоимости доставки
     */
    public function calculate(): void
    {
        $service = $this->request->get('service');
        $city = $this->request->get('city');
        $weight = (float)$this->request->get('weight');
        
        if (!$service || !$city || !$weight) {
            $this->error('Missing required parameters');
            return;
        }
        
        switch ($service) {
            case 'cdek':
                $result = $this->calculateCDEK($city, $weight);
                break;
            case 'pek':
                $result = $this->calculatePEK($city, $weight);
                break;
            case 'dellin':
                $result = $this->calculateDellin($city, $weight);
                break;
            case 'dalli':
                $result = $this->calculateDalli($city, $weight);
                break;
            default:
                $this->error('Unknown delivery service');
                return;
        }
        
        $this->success($result);
    }
    
    /**
     * Расчёт СДЭК
     */
    private function calculateCDEK(string $city, float $weight): array
    {
        // Получаем токен
        $token = $this->getCDEKToken();
        
        $data = [
            'type' => 1, // Экспресс-доставка
            'date' => date('Y-m-d'),
            'sender' => [
                'city' => 'Москва',
            ],
            'receiver' => [
                'city' => $city,
            ],
            'packages' => [
                [
                    'weight' => $weight,
                    'length' => 20,
                    'width' => 15,
                    'height' => 10,
                ]
            ],
        ];
        
        $ch = curl_init('https://api.cdek.ru/v2/calculator/tarifflist');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token,
        ]);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $result = json_decode($response, true);
        
        if (isset($result['tariff_codes'][0])) {
            $tariff = $result['tariff_codes'][0];
            return [
                'service' => 'cdek',
                'serviceName' => 'СДЭК',
                'cost' => $tariff['delivery_sum'],
                'estimatedDays' => $tariff['period_min'] . '-' . $tariff['period_max'] . ' дней',
                'isAvailable' => true,
            ];
        }
        
        return [
            'service' => 'cdek',
            'serviceName' => 'СДЭК',
            'cost' => 0,
            'estimatedDays' => '',
            'isAvailable' => false,
            'error' => 'Delivery not available',
        ];
    }
    
    /**
     * Расчёт ПЭК
     */
    private function calculatePEK(string $city, float $weight): array
    {
        $apiKey = 'YOUR_PEK_API_KEY';
        
        $data = [
            'senderCity' => 'Москва',
            'receiverCity' => $city,
            'cargos' => [
                [
                    'weight' => $weight,
                    'volume' => 0.003, // м³
                ]
            ],
        ];
        
        $ch = curl_init('https://api.pecom.ru/v2/calculator/calculateprice');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey,
        ]);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $result = json_decode($response, true);
        
        if (isset($result['price'])) {
            return [
                'service' => 'pek',
                'serviceName' => 'ПЭК',
                'cost' => (float)$result['price'],
                'estimatedDays' => '3-7 дней',
                'isAvailable' => true,
            ];
        }
        
        return [
            'service' => 'pek',
            'serviceName' => 'ПЭК',
            'cost' => 0,
            'estimatedDays' => '',
            'isAvailable' => false,
            'error' => 'Delivery not available',
        ];
    }
    
    /**
     * Расчёт Деловые Линии
     */
    private function calculateDellin(string $city, float $weight): array
    {
        $appKey = 'YOUR_DELLIN_APP_KEY';
        
        // Получаем sessionID
        $sessionId = $this->getDellinSessionId($appKey);
        
        $data = [
            'appkey' => $appKey,
            'sessionID' => $sessionId,
            'delivery' => [
                'city' => 'Москва',
            ],
            'arrival' => [
                'city' => $city,
            ],
            'cargo' => [
                'weight' => $weight,
                'volume' => 0.003,
            ],
        ];
        
        $ch = curl_init('https://api.dellin.ru/v2/calculator');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $result = json_decode($response, true);
        
        if (isset($result['price'])) {
            return [
                'service' => 'dellin',
                'serviceName' => 'Деловые Линии',
                'cost' => (float)$result['price'],
                'estimatedDays' => '2-5 дней',
                'isAvailable' => true,
            ];
        }
        
        return [
            'service' => 'dellin',
            'serviceName' => 'Деловые Линии',
            'cost' => 0,
            'estimatedDays' => '',
            'isAvailable' => false,
            'error' => 'Delivery not available',
        ];
    }
    
    /**
     * Расчёт Dalli
     */
    private function calculateDalli(string $city, float $weight): array
    {
        $apiToken = 'YOUR_DALLI_API_TOKEN';
        
        // Проверяем доступность региона
        $availableRegions = ['Москва', 'Московская область', 'Санкт-Петербург'];
        
        if (!in_array($city, $availableRegions)) {
            return [
                'service' => 'dalli',
                'serviceName' => 'Dalli',
                'cost' => 0,
                'estimatedDays' => '',
                'isAvailable' => false,
                'error' => 'Delivery available only in Moscow and St. Petersburg',
            ];
        }
        
        $xml = '<?xml version="1.0" encoding="UTF-8"?>
        <delivery>
            <auth token="' . $apiToken . '" />
            <calc>
                <city>' . $city . '</city>
                <weight>' . $weight . '</weight>
            </calc>
        </delivery>';
        
        $ch = curl_init('https://api.dalli-service.com/');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $xml);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: text/xml']);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $xmlResult = simplexml_load_string($response);
        
        if ($xmlResult && isset($xmlResult->calc->price)) {
            return [
                'service' => 'dalli',
                'serviceName' => 'Dalli',
                'cost' => (float)$xmlResult->calc->price,
                'estimatedDays' => '1-2 дня',
                'isAvailable' => true,
            ];
        }
        
        return [
            'service' => 'dalli',
            'serviceName' => 'Dalli',
            'cost' => 0,
            'estimatedDays' => '',
            'isAvailable' => false,
            'error' => 'Delivery not available',
        ];
    }
    
    /**
     * Получить токен СДЭК
     */
    private function getCDEKToken(): string
    {
        $clientId = 'YOUR_CDEK_CLIENT_ID';
        $clientSecret = 'YOUR_CDEK_CLIENT_SECRET';
        
        $ch = curl_init('https://api.cdek.ru/v2/oauth/token');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
            'grant_type' => 'client_credentials',
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
        ]));
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $result = json_decode($response, true);
        
        return $result['access_token'] ?? '';
    }
    
    /**
     * Получить sessionID Деловых Линий
     */
    private function getDellinSessionId(string $appKey): string
    {
        $data = [
            'appkey' => $appKey,
            'login' => 'YOUR_LOGIN',
            'password' => 'YOUR_PASSWORD',
        ];
        
        $ch = curl_init('https://api.dellin.ru/v1/customers/login.json');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        
        $response = curl_exec($ch);
        curl_close($ch);
        
        $result = json_decode($response, true);
        
        return $result['sessionID'] ?? '';
    }
    
    /**
     * Успешный ответ
     */
    private function success(array $data): void
    {
        echo Json::encode([
            'success' => true,
            'data' => $data,
        ]);
    }
    
    /**
     * Ошибка
     */
    private function error(string $message): void
    {
        echo Json::encode([
            'success' => false,
            'error' => $message,
        ]);
    }
}

// Обработка запроса
$api = new DeliveryAPI();
$api->calculate();
