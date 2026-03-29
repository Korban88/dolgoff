# ДолгOFF — руководство для новых сессий

Это действующий проект. Не переписывай с нуля. Читай этот файл целиком перед любой работой.

---

## Что это

**ДолгOFF** — calm fintech веб-сервис. Пользователь вводит свои кредиты, видит срок погашения, переплату и эффект от сценариев погашения. Это **калькулятор, не финансовый консультант**.

Юридически важно — никогда не использовать в UI:
- «рекомендуем», «советуем», «вам нужно», «лучший вариант для вас»

---

## Стек

| Технология | Версия | Важные особенности |
|---|---|---|
| Next.js | 16.2.1 | Middleware → `proxy.ts` (не `middleware.ts`); Turbopack по умолчанию |
| Prisma | 7.6.0 | Требует `@prisma/adapter-pg`; генерирует в `src/generated/prisma`; импорт из `@/generated/prisma/client` |
| shadcn/ui | latest | Построен на **@base-ui/react** (не Radix); нет `asChild` → используй `render={<Link href="..." />}` |
| NextAuth | v5 beta | JWT strategy, Credentials provider |
| Zod | v4 | `z.email()` — не `z.string().email()` |
| Recharts | v3 | Tooltip formatter: `(value) => [formatCurrency(Number(value)), "label"]` |
| PostgreSQL | 16 | Docker на порту 5432 |
| Tailwind | v4 | CSS-first config через `globals.css` |

---

## Структура проекта

```
src/
├── app/
│   ├── (auth)/          # login, register — центрированная карточка, мотивационная панель слева
│   ├── (dashboard)/
│   │   ├── layout.tsx   # sidebar (desktop) + bottom nav (mobile), bg-[#f4f7fb]
│   │   ├── dashboard/   # главный экран — outcome-first
│   │   ├── debts/       # список + CRUD долгов
│   │   ├── simulator/   # симулятор «Что если»
│   │   └── settings/    # смена пароля + удаление аккаунта
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth handler
│   │   ├── auth/register/       # POST регистрация
│   │   ├── debts/               # GET/POST + [id] GET/PUT/DELETE
│   │   └── user/                # DELETE аккаунта; /password PUT
│   ├── page.tsx         # лендинг
│   ├── privacy/         # политика ПД
│   └── terms/           # пользовательское соглашение
├── components/
│   ├── ui/              # shadcn компоненты
│   ├── dashboard-nav.tsx   # Sidebar + BottomNav
│   ├── debt-form.tsx       # форма добавления/редактирования долга
│   └── share-modal.tsx     # диалог share с preview-карточкой
├── hooks/
│   └── use-animated-number.ts  # RAF-based animated counter
├── lib/
│   ├── auth.ts              # NextAuth config
│   ├── debt-calculator.ts   # чистая библиотека расчётов (без React)
│   ├── prisma.ts            # Prisma client с PrismaPg adapter
│   ├── share.ts             # генераторы анонимного share-текста
│   └── utils.ts
├── generated/prisma/        # авто-генерация Prisma (не редактировать)
└── proxy.ts                 # auth middleware для Next.js 16
```

---

## Запуск локально

```bash
# 1. База данных (нужен Docker)
docker compose up -d

# 2. Зависимости (если первый раз)
npm install

# 3. Миграции (если первый раз или новая схема)
npx prisma migrate dev

# 4. Dev-сервер
npm run dev -- --hostname 0.0.0.0
# → http://localhost:3000
```

`.env` файл (не в репо — создать вручную):
```
DATABASE_URL="postgresql://dolgoff:dolgoff_dev@localhost:5432/dolgoff"
NEXTAUTH_SECRET="<случайная строка>"
NEXTAUTH_URL="http://localhost:3000"
```

Сгенерировать секрет: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`

---

## Ключевые файлы — что делают

### `src/lib/debt-calculator.ts`
Чистая библиотека. Функции:
- `calculatePayoff(debts, strategy, extraMonthly)` → `PayoffResult`
- `compareStrategies(debts, extraMonthly)` → `Record<Strategy | "minimum", PayoffResult>`
- `formatCurrency(amount)`, `formatMonths(months)` — русская локаль

Стратегии: `avalanche` (высокая ставка), `snowball` (малый остаток), `proportional` (по доле).

### `src/app/(dashboard)/dashboard/dashboard-client.tsx`
Outcome-first дашборд. Структура сверху вниз:
1. **Hero** — «Вы закроете долги через X» + «Переплата Y» (4xl/5xl цифры, градиентные карточки)
2. **Quick Win** — демо +5 000₽/мес → экономия и ускорение (ведёт в симулятор)
3. **Вторичные метрики** — общий долг + мин. платёж (2xl)
4. **Список долгов** — левый бордер по ставке, бейдж «Самая высокая ставка», прогресс-бар
5. **Стратегии** — умное состояние: при 0 доплаты показывает info-блок вместо мёртвой таблицы
6. **График погашения** — Recharts LineChart с маркерами закрытия
7. **Action bar** — Симулятор / Добавить долг / Поделиться (через ShareModal)

### `src/app/(dashboard)/simulator/simulator-client.tsx`
- Дебаунс 80мс на слайдере (`extra` → `calcExtra`)
- Анимированные числа через `useAnimatedNumber`
- 3 impact-карточки: Новый срок / Экономия (зеленеет) / Переплата
- Sticky CTA на мобильном — появляется над bottom nav при наличии экономии
- ShareModal со сценарием

---

## Цветовая палитра

```
primary:        #1e40af  (синий — контроль)
primary-light:  #3b82f6
success:        #059669  (зелёный — выигрыш, экономия)
warning:        #f59e0b  (янтарный — переплата)
surface:        #f4f7fb / #f8fafc
text-primary:   #0f172a
text-secondary: #64748b
text-muted:     #94a3b8
border:         #e2e8f0
```

**Нельзя**: красный для долгов (только для системных ошибок / destructive actions).

---

## Левый бордер по ставке (debt cards)

```typescript
rate > 30% → border-l-orange-400
rate > 20% → border-l-amber-400
rate > 10% → border-l-blue-400
rate ≤ 10% → border-l-emerald-400
```

---

## Prisma schema (ключевые модели)

```prisma
model User   { id, email (unique), passwordHash, debts[], plans[] }
model Debt   { id, userId, creditorName, debtType, currentBalance,
               originalBalance?, interestRate, minimumPayment,
               paymentDay?, isClosed, snapshots[] }
model DebtSnapshot { id, debtId, balance, recordedAt }
model Plan   { id, userId, strategy, extraMonthlyPayment }
```

---

## Известные паттерны / ловушки

- **Select `onValueChange`** принимает `(value: string | null, eventDetails)` — всегда делай `(v) => setState(v ?? "")`
- **Dialog** — state-controlled, `<DialogTrigger>` не нужен; просто `open={state}` + `onOpenChange`
- **Tabs `onValueChange`** — то же что Select; `(v) => setStrategy(v as Strategy)`
- **Recharts Tooltip** `formatter` — приходит `ValueType | undefined`, всегда `Number(value)`
- **`border-l-{color}`** в dynamic className — пиши полные строки как литералы, иначе Tailwind JIT не включит
- **`useAnimatedNumber`** — RAF хук, стартует из текущего промежуточного значения при прерывании

---

## Команды

```bash
npm run dev          # запуск разработки
npm run build        # production сборка
npm test             # vitest (10 тестов, все зелёные)
npx prisma studio    # GUI для базы данных
```

---

## GitHub

Репозиторий: https://github.com/Korban88/dolgoff (private)

```bash
git add -A
git commit -m "feat: ..."
git push
```
