import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="bg-white border-b border-[#e2e8f0] px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="text-xl font-bold text-[#1e40af]">ДолгOFF</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <h1 className="text-3xl font-bold text-[#0f172a]">Пользовательское соглашение</h1>
        <p className="text-sm text-[#64748b]">Редакция от 1 января 2025 г.</p>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[#0f172a]">1. Назначение сервиса</h2>
          <p className="text-[#64748b] leading-relaxed">
            ДолгOFF — это информационный инструмент для самостоятельного расчёта стратегий погашения долгов.
            Сервис является <strong>калькулятором</strong>, а не финансовым консультантом.
          </p>
          <p className="text-[#64748b] leading-relaxed">
            Все расчёты носят исключительно ориентировочный характер. Сервис не оказывает
            финансовых консультационных, юридических или иных профессиональных услуг.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[#0f172a]">2. Ограничение ответственности</h2>
          <p className="text-[#64748b] leading-relaxed">
            Сервис предоставляется «как есть». Расчёты основаны на данных, введённых пользователем.
            Реальные условия кредитования зависят от договоров с кредиторами и могут отличаться
            от расчётных.
          </p>
          <p className="text-[#64748b] leading-relaxed">
            Пользователь самостоятельно принимает все финансовые решения и несёт за них ответственность.
            Сервис не несёт ответственности за финансовые решения, принятые на основе его расчётов.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[#0f172a]">3. Использование сервиса</h2>
          <p className="text-[#64748b] leading-relaxed">
            Регистрируясь, пользователь подтверждает, что достиг 18 лет и использует сервис
            в личных некоммерческих целях.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-[#0f172a]">4. Удаление аккаунта</h2>
          <p className="text-[#64748b] leading-relaxed">
            Пользователь может удалить аккаунт и все данные в любое время через раздел «Настройки».
            Удаление необратимо.
          </p>
        </section>
      </main>

      <footer className="border-t border-[#e2e8f0] px-4 py-6 bg-white mt-12">
        <div className="max-w-3xl mx-auto flex gap-4 text-sm text-[#64748b]">
          <Link href="/" className="hover:text-[#0f172a]">Главная</Link>
          <Link href="/privacy" className="hover:text-[#0f172a]">Политика конфиденциальности</Link>
        </div>
      </footer>
    </div>
  );
}
