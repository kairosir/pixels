# Pixels - Миллион пикселей

Интерактивная площадка, где каждый может купить свой пиксель за $1 и оставить свой след в истории интернета.

## Технологии

- Frontend: Next.js (App Router), Tailwind CSS
- Canvas/Renderer: HTML Canvas
- Backend/API: Next.js API Routes
- ORM: Prisma
- База данных: PostgreSQL (Neon.tech)
- Аутентификация: NextAuth.js (Google)
- Платежи: Stripe

## Установка

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/pixels.git
cd pixels
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` и заполните его необходимыми переменными окружения:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/pixels"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

STRIPE_SECRET_KEY=""
STRIPE_PUBLISHABLE_KEY=""

NEXT_PUBLIC_URL="http://localhost:3000"
```

4. Настройте базу данных:
```bash
npx prisma db push
```

## Запуск

1. Запустите сервер разработки:
```bash
npm run dev
```

2. Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Основные функции

- 🎨 Интерактивное поле 1000x1000 пикселей
- 💰 Покупка пикселей за $1 каждый
- 🎯 Выбор цвета и добавление сообщения
- 👤 Личный кабинет с историей покупок
- 🔍 Масштабирование и перемещение по полю
- 💳 Безопасные платежи через Stripe

## Структура проекта

```
src/
  ├── app/                    # Страницы приложения (App Router)
  │   ├── api/               # API-маршруты
  │   ├── auth/              # Страницы аутентификации
  │   ├── dashboard/         # Личный кабинет
  │   └── payment/           # Страницы оплаты
  ├── components/            # React компоненты
  └── lib/                   # Утилиты и конфигурация
```

## Лицензия

MIT
