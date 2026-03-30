export interface DebtInput {
  id: string;
  creditorName: string;
  debtType: string;
  currentBalance: number;
  interestRate: number; // годовая в процентах
  minimumPayment: number;
}

export interface DebtMonthState {
  id: string;
  creditorName: string;
  balance: number;
  payment: number;
  interestCharged: number;
  principalPaid: number;
  isClosed: boolean;
}

export interface MonthlySnapshot {
  month: number;
  debts: DebtMonthState[];
  totalBalance: number;
  totalPayment: number;
  totalInterest: number;
}

export interface PayoffResult {
  schedule: MonthlySnapshot[];
  totalMonths: number;
  totalPaid: number;
  totalInterestPaid: number;
  debtClosures: { id: string; creditorName: string; closedAtMonth: number }[];
}

export type Strategy = "avalanche" | "snowball" | "proportional";

export function calculatePayoff(
  debts: DebtInput[],
  strategy: Strategy,
  extraMonthly: number
): PayoffResult {
  if (debts.length === 0) {
    return {
      schedule: [],
      totalMonths: 0,
      totalPaid: 0,
      totalInterestPaid: 0,
      debtClosures: [],
    };
  }

  const SAFETY_LIMIT = 600;
  const schedule: MonthlySnapshot[] = [];
  const debtClosures: { id: string; creditorName: string; closedAtMonth: number }[] = [];

  // Mutable state
  let balances = debts.map((d) => d.currentBalance);
  let closed = debts.map(() => false);
  let totalPaid = 0;
  let totalInterestPaid = 0;
  let month = 0;

  while (month < SAFETY_LIMIT) {
    const activeIndices = debts
      .map((_, i) => i)
      .filter((i) => !closed[i]);

    if (activeIndices.length === 0) break;

    month++;

    // 1. Calculate monthly interest for each active debt
    const interests = debts.map((d, i) =>
      closed[i] ? 0 : balances[i] * (d.interestRate / 100 / 12)
    );

    // 2. Assign minimum payments
    const payments = debts.map((d, i) =>
      closed[i] ? 0 : Math.min(d.minimumPayment, balances[i] + interests[i])
    );

    // 3. Total extra = extraMonthly + freed up minimums from already-closed debts (handled naturally)
    const totalMinimumPaid = payments.reduce((s, p) => s + p, 0);
    let extra = extraMonthly;

    // Distribute extra according to strategy
    const activeActive = activeIndices.filter((i) => !closed[i]);

    if (activeActive.length > 0) {
      let targets: number[];

      if (strategy === "avalanche") {
        // Highest interest rate first
        targets = [...activeActive].sort(
          (a, b) => debts[b].interestRate - debts[a].interestRate
        );
      } else if (strategy === "snowball") {
        // Smallest balance first
        targets = [...activeActive].sort(
          (a, b) => balances[a] - balances[b]
        );
      } else {
        // proportional: distribute by balance proportion
        const totalBalance = activeActive.reduce((s, i) => s + balances[i], 0);
        if (totalBalance > 0) {
          for (const i of activeActive) {
            const share = (balances[i] / totalBalance) * extra;
            payments[i] += share;
          }
          extra = 0;
        }
        targets = [];
      }

      // For avalanche/snowball: waterfall extra payment
      for (const idx of targets) {
        if (extra <= 0) break;
        const maxExtra =
          balances[idx] + interests[idx] - payments[idx];
        const applied = Math.min(extra, Math.max(0, maxExtra));
        payments[idx] += applied;
        extra -= applied;
      }
    }

    // 4. Apply payments, track closures
    const monthDebts: DebtMonthState[] = debts.map((d, i) => {
      if (closed[i]) {
        return {
          id: d.id,
          creditorName: d.creditorName,
          balance: 0,
          payment: 0,
          interestCharged: 0,
          principalPaid: 0,
          isClosed: true,
        };
      }

      const interest = interests[i];
      const payment = payments[i];
      const principal = payment - interest;
      const newBalance = Math.max(0, balances[i] - principal);

      if (newBalance <= 0.01) {
        // Debt closed — carry over overpayment as extra next month (already handled by 0 balance)
        const actualPayment = balances[i] + interest;
        totalPaid += actualPayment;
        totalInterestPaid += interest;
        balances[i] = 0;
        closed[i] = true;
        debtClosures.push({ id: d.id, creditorName: d.creditorName, closedAtMonth: month });

        return {
          id: d.id,
          creditorName: d.creditorName,
          balance: 0,
          payment: actualPayment,
          interestCharged: interest,
          principalPaid: balances[i],
          isClosed: true,
        };
      }

      totalPaid += payment;
      totalInterestPaid += interest;
      balances[i] = newBalance;

      return {
        id: d.id,
        creditorName: d.creditorName,
        balance: newBalance,
        payment,
        interestCharged: interest,
        principalPaid: principal,
        isClosed: false,
      };
    });

    const totalBalance = balances.reduce((s, b) => s + b, 0);
    const totalPayment = monthDebts.reduce((s, d) => s + d.payment, 0);
    const totalInterest = monthDebts.reduce((s, d) => s + d.interestCharged, 0);

    schedule.push({
      month,
      debts: monthDebts,
      totalBalance,
      totalPayment,
      totalInterest,
    });
  }

  return {
    schedule,
    totalMonths: month,
    totalPaid,
    totalInterestPaid,
    debtClosures,
  };
}

export function compareStrategies(
  debts: DebtInput[],
  extraMonthly: number
): Record<Strategy | "minimum", PayoffResult> {
  return {
    minimum: calculatePayoff(debts, "avalanche", 0),
    avalanche: calculatePayoff(debts, "avalanche", extraMonthly),
    snowball: calculatePayoff(debts, "snowball", extraMonthly),
    proportional: calculatePayoff(debts, "proportional", extraMonthly),
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMonths(months: number): string {
  if (months === 0) return "0 месяцев";
  const years = Math.floor(months / 12);
  const rem = months % 12;
  const parts: string[] = [];
  if (years > 0) {
    const y = years % 100;
    const y1 = y % 10;
    let label = "лет";
    if (y >= 11 && y <= 19) label = "лет";
    else if (y1 === 1) label = "год";
    else if (y1 >= 2 && y1 <= 4) label = "года";
    parts.push(`${years} ${label}`);
  }
  if (rem > 0) {
    const m = rem % 100;
    const m1 = m % 10;
    let label = "месяцев";
    if (m >= 11 && m <= 19) label = "месяцев";
    else if (m1 === 1) label = "месяц";
    else if (m1 >= 2 && m1 <= 4) label = "месяца";
    parts.push(`${rem} ${label}`);
  }
  return parts.join(" ");
}

export function getMonthlyInterestCost(debts: DebtInput[]): number {
  return debts.reduce((sum, d) => sum + d.currentBalance * (d.interestRate / 100 / 12), 0);
}

export function getDebtPayoffDates(result: PayoffResult): Record<string, Date> {
  const now = new Date();
  const dates: Record<string, Date> = {};
  for (const closure of result.debtClosures) {
    const date = new Date(now.getFullYear(), now.getMonth() + closure.closedAtMonth, 1);
    dates[closure.id] = date;
  }
  return dates;
}

export function getSmartPresets(totalMinPayment: number): number[] {
  if (totalMinPayment < 20000) return [2000, 5000, 10000];
  if (totalMinPayment <= 50000) return [5000, 10000, 20000];
  return [10000, 25000, 50000];
}

export function calculateInactionCost(
  debts: DebtInput[],
  result: PayoffResult
): { monthlyInterestCost: number; totalOverpayment: number; monthsInterestOnly: number } {
  return {
    monthlyInterestCost: getMonthlyInterestCost(debts),
    totalOverpayment: result.totalInterestPaid,
    monthsInterestOnly: result.totalMonths,
  };
}
