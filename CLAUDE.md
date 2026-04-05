Проект: ДолгOFF

Стек:
- Next.js 16
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL

Текущее состояние:
- приложение работает локально через npm run dev
- адрес: http://localhost:3000
- Docker используется только для базы данных
- база поднимается через docker compose up -d
- контейнер базы: dolgoff-db-1
- порт базы: 5432

Запуск проекта:
1. Запустить Docker
2. В папке проекта выполнить:
   docker compose up -d
3. Запустить приложение:
   npm run dev
4. Открыть:
   http://localhost:3000

Важно:
- frontend НЕ запускается через Docker
- docker-compose.yml содержит только PostgreSQL
- проект работает в dev-режиме локально
