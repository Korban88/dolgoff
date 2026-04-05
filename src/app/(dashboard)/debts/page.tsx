import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/debt-calculator";

function getRateColor(rate: number): string {
  if (rate > 30) return "#FF4D4D";
  if (rate > 20) return "#FFA04D";
  if (rate > 10) return "#4D9FFF";
  return "#4DFF91";
}

function getProgressGradient(rate: number): string {
  if (rate > 30) return "linear-gradient(90deg, #FF4D4D, #FFA04D)";
  if (rate > 20) return "linear-gradient(90deg, #FFA04D, #B5F562)";
  return "linear-gradient(90deg, #B5F562, #4DFF91)";
}

function getTagBg(color: string): string {
  if (color === "#FF4D4D") return "rgba(255,77,77,0.12)";
  if (color === "#4DFF91") return "rgba(77,255,145,0.10)";
  if (color === "#4D9FFF") return "rgba(77,159,255,0.12)";
  return "rgba(255,255,255,0.08)";
}

function getSmartTag(
  debt: { id: string; interestRate: number; currentBalance: number; minimumPayment: number },
  allDebts: typeof debt[]
): { label: string; color: string } | null {
  if (allDebts.length < 2) return null;
  const maxRate    = Math.max(...allDebts.map((d) => d.interestRate));
  const minBalance = Math.min(...allDebts.map((d) => d.currentBalance));
  if (debt.interestRate === maxRate)      return { label: "Высокая ставка",     color: "#FF4D4D" };
  if (debt.currentBalance === minBalance) return { label: "Наименьший остаток", color: "#4DFF91" };
  return null;
}

export default async function DebtsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const debts = await prisma.debt.findMany({
    where: { userId: session.user.id },
    orderBy: { interestRate: "desc" },
  });

  const activeDebts = debts.filter((d) => !d.isClosed);
  const closedDebts = debts.filter((d) => d.isClosed);

  const totalBalance    = activeDebts.reduce((s, d) => s + d.currentBalance, 0);
  const totalMinPayment = activeDebts.reduce((s, d) => s + d.minimumPayment, 0);
  const weightedRate    =
    totalBalance > 0
      ? activeDebts.reduce((s, d) => s + d.interestRate * d.currentBalance, 0) / totalBalance
      : 0;

  const activeForTags = activeDebts.map((d) => ({
    id: d.id,
    interestRate: d.interestRate,
    currentBalance: d.currentBalance,
    minimumPayment: d.minimumPayment,
  }));

  return (
    <div className="max-w-3xl mx-auto" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.02em", color: "#FFFFFF" }}>
            Мои долги
          </h1>
          <p style={{ fontSize: "13px", color: "#555555", marginTop: "2px" }}>
            Все кредиты в одном месте
          </p>
        </div>
        <Button
          nativeButton={false} render={<Link href="/debts/new" />}
          className="h-9 px-4 text-[13px] font-semibold transition-all duration-200"
          style={{ background: "#B5F562", color: "#0A0A0A", borderRadius: "12px" }}
        >
          <Plus className="w-3.5 h-3.5 mr-1" />+ Новый долг
        </Button>
      </div>

      {/* ── Summary strip ── */}
      {activeDebts.length > 0 && (
        <div
          style={{
            background: "var(--surface-base)",
            borderRadius: "var(--radius-button)",
            padding: "16px 24px",
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px 32px",
          }}
          className="sm:grid-cols-4"
        >
          {[
            { label: "Кредитов",      value: String(activeDebts.length),          sub: "активных" },
            { label: "Общий остаток", value: formatCurrency(totalBalance),          sub: "" },
            { label: "Взвеш. ставка", value: `${weightedRate.toFixed(1)}%`,        sub: "годовых" },
            { label: "Платёж / мес",  value: formatCurrency(totalMinPayment),       sub: "минимум" },
          ].map(({ label, value, sub }) => (
            <div key={label}>
              <p style={{ fontSize: "11px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em", color: "#8A8A8A", marginBottom: "4px" }}>
                {label}
              </p>
              <p style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.025em", color: "#FFFFFF", lineHeight: 1 }}>
                {value}
              </p>
              {sub && (
                <p style={{ fontSize: "11px", color: "#555555", marginTop: "2px" }}>{sub}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {activeDebts.length === 0 && (
        <div
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border-card)",
            borderRadius: "16px",
            padding: "64px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "56px", height: "56px", borderRadius: "14px",
              background: "var(--surface-elevated)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <Plus style={{ width: "28px", height: "28px", color: "#555555" }} />
          </div>
          <p style={{ fontWeight: 600, color: "#FFFFFF", marginBottom: "8px" }}>Долгов пока нет</p>
          <p style={{ fontSize: "13px", color: "#8A8A8A", maxWidth: "280px", margin: "0 auto 24px" }}>
            Добавьте первый кредит — и увидите полную картину и план погашения
          </p>
          <Button
            nativeButton={false} render={<Link href="/debts/new" />}
            className="px-6 h-10 font-semibold text-[13px]"
            style={{ background: "#B5F562", color: "#0A0A0A", borderRadius: "12px" }}
          >
            Добавить первый долг
          </Button>
        </div>
      )}

      {/* ── Active debts ── */}
      {activeDebts.length > 0 && (
        <div>
          <p style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", color: "#555555", marginBottom: "12px", paddingLeft: "2px" }}>
            Активные · {activeDebts.length}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {activeDebts.map((debt) => {
              const tag = getSmartTag(
                { id: debt.id, interestRate: debt.interestRate, currentBalance: debt.currentBalance, minimumPayment: debt.minimumPayment },
                activeForTags
              );
              const progressPercent =
                debt.originalBalance && debt.originalBalance > 0 && debt.originalBalance >= debt.currentBalance
                  ? Math.max(0, Math.round((1 - debt.currentBalance / debt.originalBalance) * 100))
                  : null;
              const rateColor = getRateColor(debt.interestRate);

              return (
                <div
                  key={debt.id}
                  className="debt-card"
                  style={{
                    background: "var(--surface-card)",
                    border: "1px solid var(--border-card)",
                    borderRadius: "var(--radius-card)",
                    padding: "20px 24px",
                  }}
                >
                  {/* Top row */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>

                    {/* Left: name + badges + rate */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Name row */}
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
                        <span style={{
                          width: "10px", height: "10px", borderRadius: "50%",
                          background: rateColor, flexShrink: 0, display: "inline-block",
                          boxShadow: `0 0 6px ${rateColor}60`,
                        }} />
                        <span style={{ fontSize: "15px", fontWeight: 600, color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {debt.creditorName}
                        </span>
                      </div>

                      {/* Badges row */}
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px", paddingLeft: "18px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 500, color: "#555555", background: "rgba(255,255,255,0.05)", borderRadius: "var(--radius-badge)", padding: "3px 8px" }}>
                          {debt.debtType}
                        </span>
                        {tag && (
                          <span style={{ fontSize: "11px", fontWeight: 600, color: tag.color, background: getTagBg(tag.color), borderRadius: "var(--radius-badge)", padding: "3px 10px" }}>
                            {tag.label}
                          </span>
                        )}
                      </div>

                      {/* Rate + min payment */}
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingLeft: "18px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: rateColor }}>{debt.interestRate}% год.</span>
                        <span style={{ fontSize: "13px", color: "#555555" }}>мин. {formatCurrency(debt.minimumPayment)}</span>
                      </div>
                    </div>

                    {/* Right: balance + edit */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "10px", flexShrink: 0 }}>
                      <span style={{ fontSize: "28px", fontWeight: 700, letterSpacing: "-0.025em", color: "#FFFFFF", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                        {formatCurrency(debt.currentBalance)}
                      </span>
                      <Link
                        href={`/debts/${debt.id}/edit`}
                        className="debt-edit-btn"
                        style={{
                          width: "28px", height: "28px", borderRadius: "6px",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "#8A8A8A",
                        }}
                      >
                        <Pencil style={{ width: "13px", height: "13px" }} />
                      </Link>
                    </div>
                  </div>

                  {/* Progress bar */}
                  {progressPercent !== null && (
                    <div style={{ marginTop: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#555555", marginBottom: "6px" }}>
                        <span>Погашено</span>
                        <span style={{ fontWeight: 600, color: "#8A8A8A" }}>{progressPercent}%</span>
                      </div>
                      <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                        <div style={{
                          width: `${progressPercent}%`, height: "100%", borderRadius: "3px",
                          background: getProgressGradient(debt.interestRate),
                          transition: "width 700ms ease",
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Closed debts ── */}
      {closedDebts.length > 0 && (
        <div>
          <p style={{ fontSize: "10.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", color: "#555555", marginBottom: "12px", paddingLeft: "2px" }}>
            Закрытые · {closedDebts.length}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {closedDebts.map((debt) => (
              <div
                key={debt.id}
                className="debt-closed-card"
                style={{
                  background: "var(--surface-base)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-card)",
                  padding: "16px 24px",
                  opacity: 0.5,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 500, color: "#8A8A8A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {debt.creditorName}
                      </span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600, color: "#4DFF91", background: "rgba(77,255,145,0.08)", borderRadius: "6px", padding: "3px 8px" }}>
                        <CheckCircle2 style={{ width: "10px", height: "10px" }} />
                        Закрыт
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#555555" }}>{debt.debtType}</p>
                  </div>
                  <Link
                    href={`/debts/${debt.id}/edit`}
                    style={{
                      width: "28px", height: "28px", borderRadius: "8px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#555555", flexShrink: 0,
                    }}
                  >
                    <Pencil style={{ width: "12px", height: "12px" }} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
