import Link from "next/link";

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A" }}>
      <header style={{ background: "#0A0A0A", borderBottom: "1px solid #1A1A1A", padding: "16px" }}>
        <div style={{ maxWidth: "768px", margin: "0 auto" }}>
          <Link href="/" style={{ fontSize: "20px", fontWeight: 700, color: "#B5F562", textDecoration: "none" }}>
            ДолгOFF
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: "768px", margin: "0 auto", padding: "48px 16px", display: "flex", flexDirection: "column", gap: "32px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "8px" }}>
            Пользовательское соглашение
          </h1>
          <p style={{ fontSize: "12px", letterSpacing: "0.03em", color: "#555555" }}>Редакция от 1 января 2025 г.</p>
        </div>

        <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#FFFFFF" }}>1. Назначение сервиса</h2>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#8A8A8A" }}>
            ДолгOFF — это информационный инструмент для самостоятельного расчёта стратегий погашения долгов.
            Сервис является <strong style={{ color: "#FFFFFF" }}>калькулятором</strong>, а не финансовым консультантом.
          </p>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#8A8A8A" }}>
            Все расчёты носят исключительно ориентировочный характер. Сервис не оказывает
            финансовых консультационных, юридических или иных профессиональных услуг.
          </p>
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#FFFFFF" }}>2. Ограничение ответственности</h2>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#8A8A8A" }}>
            Сервис предоставляется «как есть». Расчёты основаны на данных, введённых пользователем.
            Реальные условия кредитования зависят от договоров с кредиторами и могут отличаться
            от расчётных.
          </p>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#8A8A8A" }}>
            Пользователь самостоятельно принимает все финансовые решения и несёт за них ответственность.
            Сервис не несёт ответственности за финансовые решения, принятые на основе его расчётов.
          </p>
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#FFFFFF" }}>3. Использование сервиса</h2>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#8A8A8A" }}>
            Регистрируясь, пользователь подтверждает, что достиг 18 лет и использует сервис
            в личных некоммерческих целях.
          </p>
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#FFFFFF" }}>4. Удаление аккаунта</h2>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#8A8A8A" }}>
            Пользователь может удалить аккаунт и все данные в любое время через раздел «Настройки».
            Удаление необратимо.
          </p>
        </section>
      </main>

      <footer style={{ background: "transparent", borderTop: "1px solid #1A1A1A", padding: "24px 16px", marginTop: "48px" }}>
        <div style={{ maxWidth: "768px", margin: "0 auto", display: "flex", gap: "20px" }}>
          <Link href="/" style={{ fontSize: "12px", letterSpacing: "0.03em", color: "#555555", textDecoration: "none" }}>
            Главная
          </Link>
          <Link href="/privacy" style={{ fontSize: "12px", letterSpacing: "0.03em", color: "#555555", textDecoration: "none" }}>
            Политика конфиденциальности
          </Link>
        </div>
      </footer>
    </div>
  );
}
