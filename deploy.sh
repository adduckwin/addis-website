#!/bin/bash

# 🚀 Скрипт деплоя для Addis Coffee
# Использование: ./deploy.sh "Описание изменений"
# Пример: ./deploy.sh "Добавил чай в каталог"

MESSAGE="${1:-Обновление сайта}"
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo ""
echo "========================================"
echo "  🚀 DEPLOY SCRIPT - ADDIS COFFEE"
echo "========================================"
echo ""

# Переход в папку проекта
cd "$(dirname "$0")/app" || exit 1

echo -e "${BLUE}📦 Шаг 1/5: Установка зависимостей...${NC}"
npm install --silent
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка установки зависимостей!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Зависимости установлены${NC}"

echo ""
echo -e "${BLUE}🔨 Шаг 2/5: Сборка проекта...${NC}"
npm run build --silent
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка сборки!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Сборка успешна${NC}"

echo ""
echo -e "${BLUE}📝 Шаг 3/5: Добавление изменений...${NC}"
cd ..
git add app/
echo -e "${GREEN}✅ Изменения добавлены${NC}"

echo ""
echo -e "${BLUE}💾 Шаг 4/5: Коммит...${NC}"
git commit -m "$MESSAGE"
if [ $? -ne 0 ]; then
    echo -e "${RED}⚠️ Нет изменений для коммита или ошибка коммита${NC}"
fi
echo -e "${GREEN}✅ Коммит создан${NC}"

echo ""
echo -e "${BLUE}📤 Шаг 5/5: Отправка на GitHub...${NC}"
echo -e "${RED}⚠️ ВНИМАНИЕ: Сейчас потребуется ввести логин и токен GitHub${NC}"
echo -e "   Логин: ${BLUE}adduckwin${NC}"
echo -e "   Токен: ${BLUE}ваш personal access token${NC}"
echo ""
git push origin main
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Ошибка пуша! Проверьте логин/токен${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Пуш успешен${NC}"

echo ""
echo "========================================"
echo -e "  ${GREEN}✅ ДЕПЛОЙ ЗАВЕРШЁН!${NC}"
echo "========================================"
echo ""
echo "🌐 Сайт обновится через 2-3 минуты:"
echo "   https://adduckwin.github.io/addis-website/"
echo ""
echo "📝 Коммит: $MESSAGE"
echo "⏰ Время: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
