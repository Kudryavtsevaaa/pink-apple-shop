# Розовое яблоко

Интернет-магазин косметики: React (frontend) + FastAPI (backend) + PostgreSQL.

## Запуск

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env       # при необходимости
python seed_db.py          # тестовые данные
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm start                  # http://localhost:3000
```

Переменная `REACT_APP_API_URL` должна указывать на API (по умолчанию `http://localhost:8000/api`).

## PWA

Service worker собирается только в production:

```bash
cd frontend
npm run build
npm run serve:pwa          # http://localhost:3000
```

Для установки и офлайн-режима нужен **HTTPS** (кроме `localhost`).

## Установка на iPhone

1. Разверните frontend по HTTPS (Vercel, Netlify, свой сервер).
2. Откройте сайт в **Safari** (не во встроенном браузере Instagram/Telegram).
3. Нажмите «Поделиться» → **«На экран Домой»**.
4. Подтвердите — иконка появится на рабочем столе.

Приложение откроется без адресной строки (`display: standalone`). Ранее просмотренные страницы и каталог могут работать офлайн за счёт кэша; оформление заказа требует сеть.

На iPhone нет системного баннера «Установить» — в приложении показывается подсказка с шагами.

## Структура

```
pink-apple-shop/
├── backend/app/     # API, модели, роутеры
└── frontend/src/    # React, PWA (Workbox + CRACO)
```
