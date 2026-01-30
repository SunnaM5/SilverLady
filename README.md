# SilverLady — Silver Jewelry

Production-ready интернет-магазин серебряных украшений (кольца, серьги, комплекты, браслеты, цепочки).
Единый репозиторий: Django + DRF (backend + admin) и React + Vite (frontend).
В продакшне — одно приложение (Django раздаёт SPA через WhiteNoise).

## Стек

- **Backend:** Django 4.x, Django REST Framework, PostgreSQL, WhiteNoise, Gunicorn
- **Frontend:** React 18, Vite 5, TypeScript, Tailwind CSS, Framer Motion, react-i18next, react-router-dom
- **Dev:** Vite на порту 5173, Django API на 8000, proxy `/api` и `/media` на backend
- **Prod:** `vite build` → статика в `backend/frontend_dist` → Django раздаёт SPA и static/media

---

## Быстрый старт (разработка)

### 1. Окружение и БД

```bash
# Клонировать репозиторий
cd SilverLady

# Backend: виртуальное окружение
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
```

Создайте `.env` в корне репозитория (скопируйте из `.env.example`):

```bash
cp .env.example .env
```

В `.env` задайте `POSTGRES_*` для локальной БД (или используйте SQLite для быстрого теста — см. ниже).

### 2. База данных

**Вариант A: PostgreSQL (рекомендуется)**

Установите PostgreSQL, создайте БД `silverlady` и пользователя. В `.env`:

```
POSTGRES_DB=silverlady
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

**Вариант B: SQLite (без установки PostgreSQL)**

В `backend/config/settings.py` временно замените `DATABASES` на:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

### 3. Миграции и суперпользователь

```bash
cd backend
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_shop --clear   # опционально: тестовые категории и товары
```

### 4. Запуск backend и frontend

В двух терминалах:

**Терминал 1 — Django:**

```bash
cd backend
python manage.py runserver 8000
```

**Терминал 2 — Vite:**

```bash
cd frontend
npm install
npm run dev
```

- Сайт: **http://localhost:5173**
- API: **http://localhost:8000/api/**
- Админка: **http://localhost:8000/admin/** (логин из `createsuperuser`)

Добавление товаров: зайдите в `/admin`, создайте категории (Catalog → Categories), затем товары (Catalog → Products). У товара можно добавить картинки (Product images, одна из них — main image).

---

## Production: одно приложение (без Docker)

### 1. Сборка фронта

```bash
cd frontend
npm ci
npm run build
```

Сборка кладёт результат в `frontend/dist/` (с `base: '/static/'`).

### 2. Копирование в backend

Скопируйте содержимое `frontend/dist/` в `backend/frontend_dist/`:

```bash
# из корня репозитория
mkdir -p backend/frontend_dist
cp -r frontend/dist/* backend/frontend_dist/
```

(На Windows: `xcopy frontend\dist\* backend\frontend_dist\ /E /I`.)

### 3. Запуск Django

```bash
cd backend
export DEBUG=0
export DJANGO_SECRET_KEY=your-production-secret-key
export ALLOWED_HOSTS=your-domain.com,www.your-domain.com

python manage.py migrate
python manage.py collectstatic --noinput
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 2 --threads 4
```

Сайт доступен на порту 8000. Статика и SPA отдаются через WhiteNoise; media — через Django (в проде лучше отдавать media через Nginx/CDN).

---

## Production: Docker

### Сборка и запуск

```bash
# из корня репозитория
cp .env.example .env
# отредактируйте .env: DJANGO_SECRET_KEY, POSTGRES_*, ALLOWED_HOSTS

docker compose up --build -d
```

- Сайт: **http://localhost:8000**
- Миграции и `collectstatic` выполняются при старте контейнера (см. `backend/entrypoint.sh`).

### Первый запуск: суперпользователь и seed

```bash
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py seed_shop --clear
```

Админка: **http://localhost:8000/admin/**.

---

## Структура проекта

```
SilverLady/
├── backend/
│   ├── config/          # Django settings, urls, wsgi, SPA view
│   ├── shop/            # app: Category, Product, ProductImage, API, admin, seed
│   ├── frontend_dist/   # после копирования из frontend/dist — не в git
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── public/         # favicon.svg, index.html не здесь
│   ├── src/
│   │   ├── api/        # client для /api
│   │   ├── components/ # Header, Footer, ProductCard, ProductCardSkeleton
│   │   ├── context/    # Theme, CatalogView
│   │   ├── i18n/       # ru, uz, en
│   │   ├── pages/      # Home, Catalog, Product, Cart, About, Support
│   │   └── store/      # cart (localStorage)
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts   # proxy /api, /media; base /static/ in prod
├── .env.example
├── docker-compose.yml
├── Dockerfile          # multi-stage: frontend build → backend + static
└── README.md
```

---

## Важные моменты

- **Favicon / брендинг:** в `frontend/public/favicon.svg` — минималистичная «S» в серебристом стиле. В production можно добавить `favicon.ico` или `apple-touch-icon.png` (180×180) в `frontend/public/` и обновить ссылки в `frontend/index.html`.
- **Тема (светлая/тёмная)** и **вид каталога (Classic/Compact)** сохраняются в `localStorage`.
- **Языки (RU/UZ/EN):** переключатель в хедере, выбор сохраняется в `localStorage`. Товары и категории в БД с полями `*_ru`, `*_uz`, `*_en`.
- **Корзина:** только в `localStorage`; оформление заказа — кнопка «Оформить в Telegram», открывается чат с @zxsvgh с готовым текстом (список товаров, итог).
- **Заказ одного товара:** «Заказать в Telegram» использует API `GET /api/share/telegram-link/?product=slug&qty=1&lang=ru` и открывает t.me/zxsvgh?text=...
- **График и доставка:** в описании товара и в футере указано: «Работаем ежедневно с 10:00 до 22:00 (UZT). Доставка по Узбекистану через Яндекс.»

---

## Критерии приёмки (чек-лист)

- [x] Вкладка: title «SilverLady — Silver Jewelry», favicon S/SL в серебристом стиле
- [x] Дизайн: премиальный, luxury-minimal, лучше эталона каталога
- [x] Карточки: hover zoom, тень, reveal кнопок; scroll reveal stagger; layout при смене фильтров
- [x] Два вида карточек (Classic / Compact), выбор в localStorage
- [x] Тема светлая/тёмная, иконка луна/солнце, сохранение в localStorage
- [x] Три языка RU/UZ/EN, сохранение в localStorage
- [x] Корзина в localStorage, qty/remove/total, «Оформить в Telegram»
- [x] Техподдержка и заказ в Telegram (@zxsvgh), автосообщение
- [x] В описании товара и футере: 10:00–22:00, доставка через Яндекс
- [x] Единый деплой: один домен, Django отдаёт SPA и static/media
