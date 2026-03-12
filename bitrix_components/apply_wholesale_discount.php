<?php
/**
 * Компонент: Применение оптовых скидок
 * Файл: /local/components/addis/wholesale.price/component.php
 */

if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED !== true) {
    die();
}

class WholesalePriceComponent extends CBitrixComponent
{
    // Уровни скидок
    private const WHOLESALE_TIERS = [
        'WHOLESALE_TIER_1' => 0.15, // Стартовый -15%
        'WHOLESALE_TIER_2' => 0.20, // Базовый -20%
        'WHOLESALE_TIER_3' => 0.25, // Продвинутый -25%
        'WHOLESALE_TIER_4' => 0.30, // Партнёрский -30%
    ];

    /**
     * Получить скидку для пользователя
     */
    public function getUserDiscount(int $userId): float
    {
        $userGroups = CUser::GetUserGroup($userId);
        
        foreach (self::WHOLESALE_TIERS as $groupCode => $discount) {
            $groupId = $this->getGroupIdByCode($groupCode);
            if (in_array($groupId, $userGroups)) {
                return $discount;
            }
        }
        
        return 0; // Розничная цена
    }

    /**
     * Применить скидку к цене
     */
    public function applyDiscount(float $price, float $discount): float
    {
        return round($price * (1 - $discount), 2);
    }

    /**
     * Получить ID группы по коду
     */
    private function getGroupIdByCode(string $code): int
    {
        $group = CGroup::GetList(
            $by = 'c_sort',
            $order = 'asc',
            ['STRING_ID' => $code]
        )->Fetch();
        
        return $group ? (int)$group['ID'] : 0;
    }

    /**
     * Получить оптовую цену товара
     */
    public function getWholesalePrice(int $productId, int $weight = 1000): float
    {
        // Получаем свойства товара
        $res = CIBlockElement::GetProperty(
            $this->arParams['IBLOCK_ID'],
            $productId,
            [],
            ['CODE' => $weight == 250 ? 'WHOLESALE_PRICE_250' : 'WHOLESALE_PRICE_1000']
        );
        
        if ($prop = $res->Fetch()) {
            return (float)$prop['VALUE'];
        }
        
        return 0;
    }

    public function executeComponent()
    {
        global $USER;
        
        $userId = $USER->GetID();
        $discount = $this->getUserDiscount($userId);
        
        $this->arResult['DISCOUNT_PERCENT'] = $discount * 100;
        $this->arResult['DISCOUNT_COEFFICIENT'] = 1 - $discount;
        
        $this->includeComponentTemplate();
    }
}
