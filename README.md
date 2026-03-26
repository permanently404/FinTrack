# 💰 FinTrack

> Fullstack веб-приложение для учёта личных финансов с аутентификацией, аналитикой и отчётами

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_15-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express.js_5-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL_16-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_6-2D3748?logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white)

---

## 📸 Скриншоты

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/818c87ca-26db-40cb-a85c-bc8b8c6282ff" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/51d85a7d-b2e9-4b45-9916-215448f93941" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a6856d9b-5d97-4fb2-aec7-e5d382cedd43" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/1e314167-9f10-410f-b3fa-144e4fc38ece" />


---

## ✨ Возможности

- 🔐 **JWT-аутентификация** — access-токен (15 мин) + refresh-токен (7 дней), автоматическое обновление с очередью запросов
- 💳 **CRUD транзакций** — создание, редактирование, удаление доходов и расходов
- 🔍 **Фильтрация и поиск** — по типу, категории, диапазону дат, поиск по названию
- 📊 **Дашборд** — общая аналитика: доходы, расходы, баланс
- 📋 **Ежемесячные отчёты** — разбивка по категориям с графиками (Chart.js)
- 🌙 **Тёмная тема** — переключение светлой/тёмной темы
- 📱 **Адаптивный дизайн** — мобильное меню с гамбургером, десктопный сайдбар
- ⚡ **SSR с авторизацией** — серверный рендеринг дашборда через cookie-based токены

---

## 🛠 Стек технологий

| Слой | Технологии |
|------|-----------|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4, Zustand, TanStack React Query, Axios, Chart.js, next-themes |
| **Backend** | Express.js 5, TypeScript, Prisma 6, bcryptjs, jsonwebtoken |
| **База данных** | PostgreSQL 16 |
| **Инфраструктура** | Docker Compose |

---

## 🏗 Архитектурные решения

**JWT с двумя токенами (access + refresh)**
Access-токен живёт 15 минут и передаётся в заголовке Authorization. Refresh-токен — 7 дней, используется для бесшовного обновления. Это баланс между безопасностью (короткий access) и UX (пользователь не перелогинивается каждые 15 минут).

**Очередь запросов при обновлении токена**
Когда access-токен истекает, Axios-интерцептор перехватывает 401-ответ и отправляет refresh-запрос. Все параллельные запросы ставятся в очередь и повторяются после получения нового токена — это предотвращает race condition при множественных одновременных запросах.

**Zustand вместо Redux**
Для управления auth-состоянием выбран Zustand — минимальный boilerplate, встроенная поддержка persist в localStorage, нет необходимости в middleware и action creators для простого стора.

**SSR + авторизация через cookies**
Next.js серверные компоненты читают access-токен из cookie для SSR-запросов к API. Это позволяет рендерить дашборд с данными на сервере без лишних клиентских запросов.

**Индексация базы данных**
Поля `date`, `type`, `category`, `userId` покрыты индексами — фильтрация и сортировка работают без full table scan.

---

## 🚀 Быстрый старт

### Требования

- Node.js 18+
- Docker и Docker Compose

### Установка

```bash
# 1. Клонировать репозиторий
git clone https://github.com/permanently404/FinTrack.git
cd FinTrack

# 2. Поднять базу данных
docker compose up -d

# 3. Настроить backend
cd backend
cp .env.example .env
# Отредактируйте .env — укажите свои JWT_SECRET и JWT_REFRESH_SECRET
npm install
npx prisma migrate dev
npm run seed    # Заполнить тестовыми данными (опционально)
npm run dev     # Запустится на http://localhost:4000

# 4. Настроить frontend (в отдельном терминале)
cd ../frontend
npm install
npm run dev     # Запустится на http://localhost:3000
```

---

## 📡 API эндпоинты

### Аутентификация (публичные)

| Метод | Путь | Описание |
|-------|------|----------|
| `POST` | `/api/auth/register` | Регистрация (email, password, name) |
| `POST` | `/api/auth/login` | Вход (email, password) → access + refresh токены |
| `POST` | `/api/auth/refresh` | Обновление access-токена |

### Транзакции (защищённые — Bearer token)

| Метод | Путь | Описание |
|-------|------|----------|
| `GET` | `/api/transactions` | Список с фильтрацией и пагинацией |
| `GET` | `/api/transactions/stats` | Агрегация: доходы, расходы, баланс |
| `GET` | `/api/transactions/:id` | Получить транзакцию по ID |
| `POST` | `/api/transactions` | Создать транзакцию |
| `PUT` | `/api/transactions/:id` | Обновить транзакцию |
| `DELETE` | `/api/transactions/:id` | Удалить транзакцию |

**Параметры фильтрации** `GET /api/transactions`:
`category`, `type`, `dateFrom`, `dateTo`, `search`, `page`, `limit`

---

## 📁 Структура проекта

```
FinTrack/
├── docker-compose.yml
│
├── backend/
│   ├── src/
│   │   ├── server.ts              # Express-приложение, CORS, подключение роутов
│   │   ├── routes/
│   │   │   ├── auth.ts            # Регистрация, логин, refresh
│   │   │   └── transactions.ts    # CRUD + статистика + фильтрация
│   │   ├── middleware/
│   │   │   └── auth.ts            # JWT-валидация Bearer-токена
│   │   └── lib/
│   │       └── jwt.ts             # Генерация и верификация токенов
│   └── prisma/
│       ├── schema.prisma          # Модели User и Transaction
│       └── seed.ts                # Сидирование тестовых данных
│
└── frontend/
    └── src/
        ├── app/
        │   ├── dashboard/         # Дашборд с аналитикой (SSR)
        │   ├── transactions/      # Список транзакций
        │   ├── reports/[month]/   # Ежемесячный отчёт
        │   ├── login/             # Страница входа
        │   └── register/          # Страница регистрации
        ├── api/
        │   ├── axios.ts           # HTTP-клиент + интерцепторы refresh
        │   ├── auth.ts            # API-вызовы авторизации
        │   └── transactions.ts    # API-вызовы транзакций + React Query хуки
        ├── components/
        │   ├── layout/            # Sidebar, Header, AppShell
        │   └── providers/         # AuthGuard
        ├── store/
        │   └── authStore.ts       # Zustand — состояние авторизации
        └── types/
            └── index.ts           # TypeScript типы и интерфейсы
```

---

## 🗄 Схема базы данных

```
┌──────────────────┐       ┌──────────────────────┐
│      User        │       │     Transaction      │
├──────────────────┤       ├──────────────────────┤
│ id       (UUID)  │──┐    │ id          (UUID)   │
│ email    (unique)│  │    │ title       (String) │
│ password (hash)  │  │    │ amount      (Float)  │
│ name     (opt)   │  │    │ type        (String) │
│ createdAt        │  │    │ category    (String) │
└──────────────────┘  │    │ date        (String) │
                      │    │ description (opt)    │
                      └───>│ userId      (FK)     │
                           │ createdAt            │
                           └──────────────────────┘
```

---

## 🗺 Roadmap

- [x] MVP — CRUD транзакций
- [x] JWT-аутентификация (access + refresh)
- [x] Дашборд с аналитикой
- [x] Ежемесячные отчёты с графиками
- [x] Тёмная тема
- [x] Адаптивный дизайн
- [ ] Деплой (Vercel + Railway / VPS)
- [ ] Экспорт данных в CSV/PDF
- [ ] Бюджеты и лимиты по категориям
- [ ] Повторяющиеся транзакции
- [ ] E2E тесты (Playwright)

