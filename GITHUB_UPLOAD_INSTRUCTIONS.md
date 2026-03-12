# Инструкция по загрузке на GitHub Pages

## Быстрый способ (через веб-интерфейс)

### Шаг 1: Создайте репозиторий
1. Зайдите на https://github.com
2. Нажмите зелёную кнопку "+" → "New repository"
3. Название: `addis-website`
4. Сделайте публичным (Public)
5. Нажмите "Create repository"

### Шаг 2: Загрузите файлы
1. В новом репозитории нажмите "uploading an existing file"
2. Перетащите ВСЕ файлы из папки `dist` (index.html, assets/, images/)
3. Напишите комментарий: "Initial commit"
4. Нажмите "Commit changes"

### Шаг 3: Включите GitHub Pages
1. Зайдите в Settings → Pages (слева в меню)
2. В разделе "Source" выберите "Deploy from a branch"
3. Выберите ветку "main" и папку "/ (root)"
4. Нажмите "Save"

### Шаг 4: Дождитесь публикации
- Через 2-5 минут сайт будет доступен по адресу:
- `https://ВАШ_НИК.github.io/addis-website`

---

## Альтернатива: Через Git командной строки

```bash
# Перейдите в папку с сайтом
cd /путь/к/addis-website

# Инициализируйте git
git init
git add .
git commit -m "Initial commit"

# Привяжите к GitHub (замените ВАШ_НИК)
git remote add origin https://github.com/ВАШ_НИК/addis-website.git
git branch -M main
git push -u origin main
```

---

## Файлы для загрузки

В папке `/mnt/okcomputer/output/addis-website/` находятся все файлы сайта:
- `index.html` — главная страница
- `assets/` — CSS и JavaScript
- `images/` — картинки

---

## Нужна помощь?

Если не получается — напишите мне, я помогу шаг за шагом!
