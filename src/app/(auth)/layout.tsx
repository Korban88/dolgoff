export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ background: "var(--bg-page)" }}>
      {/* Left panel — purple gradient */}
      <div
        className="hidden lg:flex flex-col justify-between p-12"
        style={{
          background: "linear-gradient(135deg, #6C5CE7 0%, #8B7CF7 55%, #A78BFA 100%)",
        }}
      >
        <div>
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-[10px] flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.20)" }}
            >
              <span className="text-white font-bold text-[14px]">Д</span>
            </div>
            <span className="text-[18px] font-bold text-white tracking-tight">ДолгOFF</span>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-[30px] font-bold leading-snug text-white">
            Первый шаг<br />к финансовой ясности
          </h2>
          <p className="text-[15px] leading-relaxed max-w-sm" style={{ color: "rgba(255,255,255,0.70)" }}>
            Соберите все долги в одном месте и увидите чёткий путь к свободе. Только цифры — без стресса.
          </p>
          <div className="space-y-3 pt-2">
            {[
              "Расчёт всех стратегий погашения",
              "Точная дата закрытия каждого долга",
              "Симулятор доплат и экономии",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(255,255,255,0.20)" }}
                >
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.80)" }}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Glassmorphism stats */}
          <div
            className="grid grid-cols-2 gap-3 mt-4"
          >
            {[
              { label: "Стратегий расчёта", value: "3" },
              { label: "Минут на старт", value: "5" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-[14px] px-4 py-3"
                style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
              >
                <p className="text-[24px] font-bold text-white tabular-nums">{value}</p>
                <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.60)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.35)" }}>
          Инструмент для расчётов. Не является финансовой консультацией.
        </p>
      </div>

      {/* Right form panel */}
      <div
        className="flex items-center justify-center p-6"
        style={{ background: "var(--bg-page)" }}
      >
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 text-center">
            <div className="flex items-center gap-2 justify-center mb-2">
              <div
                className="w-8 h-8 rounded-[10px] flex items-center justify-center"
                style={{ background: "var(--accent-primary)" }}
              >
                <span className="text-white font-bold text-[14px]">Д</span>
              </div>
              <span
                className="text-[20px] font-bold tracking-tight"
                style={{ color: "var(--text-primary)" }}
              >
                ДолгOFF
              </span>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
