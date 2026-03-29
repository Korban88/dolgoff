import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-[#e2e8f0] px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-xl font-bold text-[#1e40af]">ДолгOFF</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <h1 className="text-3xl font-bold text-[#0f172a]">Политика обработки персональных данных</h1>
        <p className="text-sm text-[#64748b]">Редакция от 1 января 2025 г.</p>

        <section className="space-y-4 text-[#0f172a]">
          <h2 className="text-xl font-semibold">1. Общие положения</h2>
          <p className="text-[#64748b] leading-relaxed">
            Настоящая Политика определяет порядок обработки персональных данных пользователей
            сервиса ДолгOFF. Используя сервис, вы соглашаетесь с условиями настоящей Политики.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[#0f172a]">2. Какие данные мы собираем</h2>
          <ul className="list-disc list-inside space-y-2 text-[#64748b]">
            <li>Адрес электронной почты (для создания аккаунта)</li>
            <li>Хэш пароля (пароль хранится в зашифрованном виде)</li>
            <li>Данные о долгах, которые вы вводите самостоятельно (название кредитора, суммы, ставки)</li>
          </ul>
          <p className="text-[#64748b] leading-relaxed">
            Мы <strong>не собираем</strong> данные банковских карт, счетов, паспортные данные или
            другую чувствительную финансовую информацию.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[#0f172a]">3. Цели обработки данных</h2>
          <p className="text-[#64748b] leading-relaxed">
            Данные используются исключительно для предоставления функций сервиса:
            расчёта стратегий погашения долгов, отображения статистики и прогнозов.
            Данные не передаются третьим лицам и не используются в рекламных целях.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[#0f172a]">4. Права пользователя</h2>
          <p className="text-[#64748b] leading-relaxed">
            Вы вправе в любой момент удалить свой аккаунт и все связанные данные через раздел
            «Настройки». После удаления все данные безвозвратно уничтожаются.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[#0f172a]">5. Безопасность</h2>
          <p className="text-[#64748b] leading-relaxed">
            Для защиты данных применяется шифрование паролей (bcrypt), защищённые соединения (HTTPS)
            и ограниченный доступ к базе данных.
          </p>
        </section>
      </main>

      <footer className="border-t border-[#e2e8f0] px-4 py-6 bg-white mt-12">
        <div className="max-w-3xl mx-auto flex gap-4 text-sm text-[#64748b]">
          <Link href="/" className="hover:text-[#0f172a]">Главная</Link>
          <Link href="/terms" className="hover:text-[#0f172a]">Условия использования</Link>
        </div>
      </footer>
    </div>
  );
}
