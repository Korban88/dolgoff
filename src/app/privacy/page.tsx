import Link from "next/link";

export default function PrivacyPage() {
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
            Политика обработки персональных данных
          </h1>
          <p style={{ fontSize: "12px", letterSpacing: "0.03em", color: "#555555" }}>Редакция от 1 января 2025 г.</p>
        </div>

        <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#FFFFFF" }}>1. Общие положения</h2>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#8A8A8A" }}>
            Настоящая Политика определяет порядок обработки персональных данных пользователей
            сервиса ДолгOFF. Используя сервис, вы соглашаетесь с условиями настоящей Политики.
          </p>
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#FFFFFF" }}>2. Какие данные мы собираем</h2>
          <ul style={{ fontSize: "14px", lineHeight: 1.8, color: "#8A8A8A", paddingLeft: "20px" }}>
            <li>Адрес электронной почты (для создания аккаунта)</li>
            <li>Хэш пароля (пароль хранится в зашифрованном виде)</li>
            <li>Данные о долгах, которые вы вводите самостоятельно (название кредитора, суммы, ставки)</li>
          </ul>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#8A8A8A" }}>
            Мы <strong style={{ color: "#FFFFFF" }}>не собираем</strong> данные банковских карт, счетов, паспортные данные или
            другую чувствительную финансовую информацию.
          </p>
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#FFFFFF" }}>3. Цели обработки данных</h2>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#8A8A8A" }}>
            Данные используются исключительно для предоставления функций сервиса:
            расчёта стратегий погашения долгов, отображения статистики и прогнозов.
            Данные не передаются третьим лицам и не используются в рекламных целях.
          </p>
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#FFFFFF" }}>4. Права пользователя</h2>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#8A8A8A" }}>
            Вы вправе в любой момент удалить свой аккаунт и все связанные данные через раздел
            «Настройки». После удаления все данные безвозвратно уничтожаются.
          </p>
        </section>

        <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#FFFFFF" }}>5. Безопасность</h2>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#8A8A8A" }}>
            Для защиты данных применяется шифрование паролей (bcrypt), защищённые соединения (HTTPS)
            и ограниченный доступ к базе данных.
          </p>
        </section>
      </main>

      <footer style={{ background: "transparent", borderTop: "1px solid #1A1A1A", padding: "24px 16px", marginTop: "48px" }}>
        <div style={{ maxWidth: "768px", margin: "0 auto", display: "flex", gap: "20px" }}>
          <Link href="/" style={{ fontSize: "12px", letterSpacing: "0.03em", color: "#555555", textDecoration: "none" }}>
            Главная
          </Link>
          <Link href="/terms" style={{ fontSize: "12px", letterSpacing: "0.03em", color: "#555555", textDecoration: "none" }}>
            Условия использования
          </Link>
        </div>
      </footer>
    </div>
  );
}
