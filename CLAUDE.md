# ДолгOFF — руководство для новых сессий

Это действующий проект. Не переписывай с нуля. Читай этот файл целиком перед любой работой.

---

## Что это

**ДолгOFF** — dark-premium fintech веб-сервис. Пользователь вводит свои кредиты, видит срок погашения, переплату и эффект от сценариев погашения. Это **калькулятор, не финансовый консультант**.

Юридически важно — никогда не использовать в UI:
- «рекомендуем», «советуем», «вам нужно», «лучший вариант для вас»

---

## Стек

| Технология | Версия | Важные особенности |
|---|---|---|
| Next.js | 16.2.1 | Middleware → `proxy.ts` (не `middleware.ts`); Turbopack по умолчанию |
| Prisma | 7.6.0 | Требует `@prisma/adapter-pg`; генерирует в `src/generated/prisma`; импорт из `@/generated/prisma/client` |
| shadcn/ui | latest | Построен на **@base-ui/react** (не Radix); нет `asChild` → используй `render={<Link href="..." />}` + **`nativeButton={false}`** обязателен когда render — не `<button>` |
| NextAuth | v5 beta | JWT strategy, Credentials provider |
| Zod | v4 | `z.email()` — не `z.string().email()` |
| Recharts | v3 | Tooltip formatter: `(value) => [formatCurrency(Number(value)), "label"]` |
| PostgreSQL | 16 | Docker на порту 5432 |
| Tailwind | v4 | CSS-first config через `globals.css` |
| Framer Motion | latest | Используется в `life-equivalents.tsx` для AnimatePresence |

---

## Структура проекта

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx       # Двухколоночный: слева purple-gradient панель, справа форма
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx       # Sidebar (desktop) + BottomNav (mobile); footer с дисклеймером
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Server: загружает долги из БД, редирект если нет
│   │   │   └── dashboard-client.tsx  # Client: весь UI дашборда
│   │   ├── debts/
│   │   │   ├── page.tsx          # Server Component — список долгов (hover только через CSS-классы!)
│   │   │   ├── new/page.tsx      # Форма добавления
│   │   │   └── [id]/edit/page.tsx  # Форма редактирования
│   │   ├── simulator/
│   │   │   ├── page.tsx          # Server: загружает долги
│   │   │   └── simulator-client.tsx  # Client: слайдер, карточки, график
│   │   ├── learn/
│   │   │   ├── page.tsx          # Список обучающих статей
│   │   │   └── [slug]/page.tsx   # Статья
│   │   └── settings/page.tsx     # Смена пароля + удаление аккаунта
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth handler
│   │   ├── auth/register/route.ts       # POST регистрация
│   │   ├── debts/route.ts               # GET/POST
│   │   ├── debts/[id]/route.ts          # GET/PUT/DELETE (проверка владельца)
│   │   └── user/
│   │       ├── route.ts          # DELETE аккаунта
│   │       └── password/route.ts # PUT смена пароля
│   ├── page.tsx         # Лендинг
│   ├── privacy/page.tsx # Политика ПД
│   └── terms/page.tsx   # Пользовательское соглашение
├── components/
│   ├── ui/
│   │   ├── button.tsx, input.tsx, label.tsx, card.tsx
│   │   ├── dialog.tsx, select.tsx, tabs.tsx, tooltip.tsx
│   │   ├── badge.tsx, progress.tsx, alert.tsx
│   │   ├── metric-card.tsx      # Карточка метрики (icon + label + value + sub)
│   │   └── dropdown-menu.tsx
│   ├── dashboard/
│   │   ├── dashboard-hero.tsx   # Герой: дата закрытия + метрики + кнопки
│   │   ├── scenario-cards.tsx   # 3 сценария с доплатой
│   │   ├── payoff-summary.tsx   # Сводка: общий долг, мин. платёж, ставка
│   │   ├── debt-progress-list.tsx  # Список долгов с прогресс-барами
│   │   ├── cost-of-inaction.tsx # Цена бездействия (проценты в месяц)
│   │   └── payoff-chart.tsx     # Recharts AreaChart — график погашения
│   ├── dashboard-nav.tsx    # Sidebar (240px, #111111) + BottomNav
│   ├── debt-form.tsx        # Форма добавления/редактирования долга
│   ├── share-modal.tsx      # Диалог share с preview-карточкой
│   ├── life-equivalents.tsx # «Ощутить переплату» — эквиваленты в реальных вещах
│   └── freedom-calculator.tsx  # Калькулятор финансовой свободы
├── hooks/
│   └── use-animated-number.ts  # RAF-based animated counter
├── lib/
│   ├── auth.ts              # NextAuth config
│   ├── debt-calculator.ts   # Чистая библиотека расчётов (без React)
│   ├── life-equivalents.ts  # Данные и логика для life-equivalents
│   ├── prisma.ts            # Prisma client с PrismaPg adapter
│   ├── share.ts             # Генераторы анонимного share-текста
│   └── utils.ts
├── generated/prisma/        # Авто-генерация Prisma (не редактировать)
└── proxy.ts                 # Auth middleware для Next.js 16
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

## Цветовая палитра (dark premium fintech)

Все цвета жёстко заданы через CSS custom properties в `src/app/globals.css`.

```
--bg-page:          #0A0A0A   ← фон страницы (html, body)
--bg-surface:       #1A1A1A   ← карточки
--bg-surface-hover: #222222   ← карточки при hover
--bg-sidebar:       #111111   ← сайдбар
--bg-input:         #141414   ← инпуты, вложенные блоки

--border-default:   #2A2A2A   ← основные бордеры
--border-light:     #222222   ← лёгкие разделители
--border-focus:     #B5F562   ← фокус / активный элемент

--text-primary:     #FFFFFF
--text-secondary:   #8A8A8A
--text-tertiary:    #555555

--accent-primary:         #B5F562   ← lime, основной акцент
--accent-primary-hover:   #A3E550
--accent-primary-light:   rgba(181,245,98,0.10)

--color-success:    #4DFF91   ← экономия, выигрыш
--color-warning:    #FFA04D   ← переплата, предупреждения
--color-danger:     #FF4D4D   ← только destructive actions, кнопка «Сбросить»
--color-info:       #4D9FFF
```

**Нельзя**: красный для отображения долгов. Только для destructive-кнопок и системных ошибок.

### Цветовое кодирование процентных ставок (debt cards)
```
> 30% → #FF4D4D  (danger)
> 20% → #FFA04D  (warning)
≤ 20% → #4DFF91  (success)
```

---

## Типографика

Шрифт: **Inter** (next/font/google), variable `--font-inter`, subsets: latin + cyrillic.

```
h1:    28px / 700 / letter-spacing -0.02em
h2:    22px / 600 / letter-spacing -0.015em
body:  14px / line-height 1.5
small: 12px / letter-spacing 0.03em  (class: .text-small или .metric-label)
```

Числовые значения: всегда `font-variant-numeric: tabular-nums` (class: `.tabular-nums`).

---

## CSS utility классы (globals.css)

```css
.metric-label     /* 12px, uppercase, letter-spacing 0.03em, --text-tertiary */
.metric-value     /* bold, tabular-nums, --text-primary */
.text-small       /* 12px, letter-spacing 0.03em, --text-tertiary */
.tabular-nums     /* font-variant-numeric: tabular-nums */
.card-surface     /* bg-surface + border + shadow + border-radius 16px */
.badge-pill       /* inline-flex, border-radius 8px, padding 3px 10px */
.transition-smooth /* transition: all 0.2s cubic-bezier(0.4,0,0.2,1) */
.animate-fade-in-up /* fadeInUp 350ms */

/* Server Component hover (нет event handlers!) */
.debt-card          /* border 1px #2A2A2A; :hover → #3A3A3A */
.debt-edit-btn      /* color #8A8A8A; :hover → #FFFFFF */
.debt-closed-card   /* opacity 0.5; :hover → 0.75 */
.sim-quick-btn      /* :hover → border-color #B5F562 */
.sim-back-link      /* :hover → color #FFFFFF */
```

---

## Компоненты — ключевые детали

### `dashboard-client.tsx` — структура сверху вниз
1. **DashboardHero** — дата закрытия (36px/white) + переплата + общий платёж + 2 кнопки
2. **PayoffSummary** — 3 метрики: общий остаток, взвешенная ставка, мин. платёж
3. **ScenarioCards** — 3 карточки доплат (выделенная — lime border + bg rgba lime 0.05)
4. **DebtProgressList** — список долгов с dot-индикатором, прогресс-барами, тегами
5. **CostOfInaction** — проценты в месяц, переплата без действий
6. **PayoffChart** — Recharts AreaChart, две линии (текущий / с доплатой)
7. **LifeEquivalents** — эквиваленты переплаты в реальных вещах (> 1000₽)
8. **FreedomCalculator** — что можно делать после погашения
9. **Action bar** — Симулятор / + Долг / Поделиться (ShareModal)

### `simulator-client.tsx` — ключевые детали
- Дебаунс 80мс: `extra` → `calcExtra` (не вызывает лишних расчётов при скролле)
- Анимированные числа: `useAnimatedNumber` (RAF-based)
- Слайдер: трек `#2A2A2A` 6px, заполнение `#B5F562`, thumb белый 20px с border `#B5F562`
- Быстрые кнопки: `#1A1A1A`/border `#2A2A2A`/radius 8px; hover через CSS-класс `.sim-quick-btn`
- 3 impact-карточки: 24px padding, 28px значения; «Экономия» при hasSavings: border `#B5F562` + rgba lime bg
- Блок новой даты: `border-left: 3px solid #B5F562`, radius 12px
- Sticky CTA на мобильном (bottom: 64px = над BottomNav), появляется при hasSavings
- Табы стратегий: активный `#B5F562` bg + `#0A0A0A` текст

### `dashboard-nav.tsx` — Sidebar + BottomNav
- Sidebar: `width: 240px`, `background: #111111`, нет border-right
- Лого: 20px / 700 / #FFFFFF, без иконки
- Nav items: padding `10px 16px`, gap `4px`, radius `12px`
- Активный: bg `#1A1A1A`, текст `#FFFFFF`, иконка `#B5F562`
- Hover: bg `#151515`, только CSS transition
- BottomNav (mobile): `#111111`, активный цвет `#B5F562`

### `payoff-chart.tsx`
- Кастомный `CustomTooltip`: bg `#1A1A1A`, border `#2A2A2A`
- CartesianGrid: stroke `#2A2A2A` (не `var(--border-light)` — важно для тёмной темы)
- Baseline: серый пунктир `#555555`; Best: сплошная `#4DFF91`

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

## Известные паттерны и ловушки

### Base UI / shadcn
- `<Button render={<Link href="...">}>` → **обязательно** `nativeButton={false}`, иначе консольное предупреждение
- Нет `asChild` — это Base UI, не Radix
- `<Dialog>` — state-controlled; `<DialogTrigger>` не нужен; только `open={state}` + `onOpenChange`

### Next.js Server Components
- **Server Component не может иметь `onMouseEnter`/`onMouseLeave`** — ломает сборку
- Hover в Server Components — только через CSS-классы в `globals.css`
- `debts/page.tsx` — Server Component; все интерактивные hover'ы через `.debt-card`, `.debt-edit-btn`, `.debt-closed-card`

### Recharts
- Tooltip `formatter` получает `ValueType | undefined` → всегда `Number(value)`
- `CustomTooltip` pattern лучше встроенного `formatter` для полного контроля стилей

### Tailwind v4
- **`border-l-{color}`** в dynamic className — писать полные строки-литералы, иначе JIT не включит
- CSS-first конфиг — нет `tailwind.config.ts`, только `@theme inline` в `globals.css`

### Zod v4
- `z.email()` — не `z.string().email()`

### Select / Tabs (Base UI)
- `onValueChange` получает `(value: string | null, eventDetails)` → `(v) => setState(v ?? "")`
- Tabs: `(v) => setStrategy(v as Strategy)`

### Хук `useAnimatedNumber`
- RAF-based, стартует из текущего промежуточного значения при прерывании
- Принимает целевое число, возвращает анимированное

---

## Команды

```bash
npm run dev          # запуск разработки (Turbopack)
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
