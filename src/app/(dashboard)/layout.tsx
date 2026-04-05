import { Sidebar, BottomNav } from "@/components/dashboard-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-page)" }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <main className="flex-1 p-5 md:p-8 md:px-8 pb-24 md:pb-8 animate-page-in">
          {children}
        </main>
        <footer
          className="px-5 md:px-8 py-4"
          style={{ background: "transparent", borderTop: "1px solid #1A1A1A" }}
        >
          <p style={{ fontSize: "12px", letterSpacing: "0.03em", color: "#555555" }}>
            ДолгOFF — инструмент для расчётов. Не является финансовой консультацией.
            Результаты носят исключительно информационный характер.
          </p>
        </footer>
      </div>
      <BottomNav />
    </div>
  );
}
