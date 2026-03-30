import { describe, it, expect } from "vitest";
import {
  calculatePayoff,
  compareStrategies,
  getMonthlyInterestCost,
  getDebtPayoffDates,
  getSmartPresets,
  calculateInactionCost,
  type DebtInput,
} from "./debt-calculator";

const makeDebt = (overrides: Partial<DebtInput> & Pick<DebtInput, "id" | "currentBalance" | "interestRate" | "minimumPayment">): DebtInput => ({
  creditorName: "Тест",
  debtType: "credit",
  ...overrides,
});

describe("calculatePayoff", () => {
  it("1. Один долг 100000₽, 18%, платёж 5000₽ → срок ~24 мес", () => {
    const debt = makeDebt({ id: "d1", currentBalance: 100000, interestRate: 18, minimumPayment: 5000 });
    const result = calculatePayoff([debt], "avalanche", 0);
    expect(result.totalMonths).toBeGreaterThanOrEqual(22);
    expect(result.totalMonths).toBeLessThanOrEqual(26);
  });

  it("2. Два долга, лавина — сначала гасится дорогой долг", () => {
    const cheap = makeDebt({ id: "cheap", creditorName: "Дешёвый", currentBalance: 50000, interestRate: 10, minimumPayment: 2000 });
    const expensive = makeDebt({ id: "expensive", creditorName: "Дорогой", currentBalance: 50000, interestRate: 30, minimumPayment: 2000 });
    const result = calculatePayoff([cheap, expensive], "avalanche", 3000);
    const expensiveClosure = result.debtClosures.find((c) => c.id === "expensive");
    const cheapClosure = result.debtClosures.find((c) => c.id === "cheap");
    expect(expensiveClosure).toBeDefined();
    expect(cheapClosure).toBeDefined();
    expect(expensiveClosure!.closedAtMonth).toBeLessThan(cheapClosure!.closedAtMonth);
  });

  it("3. Два долга, снежный ком — сначала маленький", () => {
    const small = makeDebt({ id: "small", creditorName: "Маленький", currentBalance: 20000, interestRate: 20, minimumPayment: 1000 });
    const big = makeDebt({ id: "big", creditorName: "Большой", currentBalance: 100000, interestRate: 15, minimumPayment: 3000 });
    const result = calculatePayoff([small, big], "snowball", 2000);
    const smallClosure = result.debtClosures.find((c) => c.id === "small");
    const bigClosure = result.debtClosures.find((c) => c.id === "big");
    expect(smallClosure).toBeDefined();
    expect(bigClosure).toBeDefined();
    expect(smallClosure!.closedAtMonth).toBeLessThan(bigClosure!.closedAtMonth);
  });

  it("4. Рассрочка 0% → линейное погашение", () => {
    const debt = makeDebt({ id: "d0", currentBalance: 12000, interestRate: 0, minimumPayment: 1000 });
    const result = calculatePayoff([debt], "avalanche", 0);
    expect(result.totalMonths).toBe(12);
    expect(result.totalInterestPaid).toBeCloseTo(0, 1);
    expect(result.totalPaid).toBeCloseTo(12000, 0);
  });

  it("5. МФО 292% → корректный расчёт без бесконечного цикла", () => {
    const debt = makeDebt({ id: "mfo", currentBalance: 30000, interestRate: 292, minimumPayment: 3000 });
    const result = calculatePayoff([debt], "avalanche", 5000);
    expect(result.totalMonths).toBeGreaterThan(0);
    expect(result.totalMonths).toBeLessThan(600);
  });

  it("6. extraMonthly сокращает срок", () => {
    const debt = makeDebt({ id: "d1", currentBalance: 100000, interestRate: 18, minimumPayment: 3000 });
    const without = calculatePayoff([debt], "avalanche", 0);
    const withExtra = calculatePayoff([debt], "avalanche", 5000);
    expect(withExtra.totalMonths).toBeLessThan(without.totalMonths);
    expect(withExtra.totalInterestPaid).toBeLessThan(without.totalInterestPaid);
  });

  it("7. Платёж ≤ процентам → долг не выплачивается (safety limit)", () => {
    // 100000₽, 60% годовых = 5000₽/мес в процентах, платёж 2000₽
    const debt = makeDebt({ id: "grow", currentBalance: 100000, interestRate: 60, minimumPayment: 2000 });
    const result = calculatePayoff([debt], "avalanche", 0);
    expect(result.totalMonths).toBe(600); // достиг safety limit
  });

  it("8. Пустой массив → пустой результат", () => {
    const result = calculatePayoff([], "avalanche", 0);
    expect(result.totalMonths).toBe(0);
    expect(result.totalPaid).toBe(0);
    expect(result.schedule).toHaveLength(0);
    expect(result.debtClosures).toHaveLength(0);
  });
});

describe("compareStrategies", () => {
  it("возвращает все 4 стратегии", () => {
    const debt = makeDebt({ id: "d1", currentBalance: 100000, interestRate: 18, minimumPayment: 3000 });
    const result = compareStrategies([debt], 2000);
    expect(result).toHaveProperty("minimum");
    expect(result).toHaveProperty("avalanche");
    expect(result).toHaveProperty("snowball");
    expect(result).toHaveProperty("proportional");
  });

  it("minimum имеет больший срок, чем avalanche с extraMonthly", () => {
    const debt = makeDebt({ id: "d1", currentBalance: 100000, interestRate: 18, minimumPayment: 3000 });
    const result = compareStrategies([debt], 3000);
    expect(result.minimum.totalMonths).toBeGreaterThan(result.avalanche.totalMonths);
  });
});

describe("getMonthlyInterestCost", () => {
  it("суммирует месячные проценты по всем долгам", () => {
    const debts = [
      makeDebt({ id: "d1", currentBalance: 100000, interestRate: 12, minimumPayment: 3000 }),
      makeDebt({ id: "d2", currentBalance: 50000, interestRate: 24, minimumPayment: 2000 }),
    ];
    const cost = getMonthlyInterestCost(debts);
    // 100000 * 12/100/12 + 50000 * 24/100/12 = 1000 + 1000 = 2000
    expect(cost).toBeCloseTo(2000, 0);
  });

  it("возвращает 0 для пустого массива", () => {
    expect(getMonthlyInterestCost([])).toBe(0);
  });
});

describe("getDebtPayoffDates", () => {
  it("возвращает дату для каждого закрытого долга", () => {
    const debt = makeDebt({ id: "d1", currentBalance: 60000, interestRate: 18, minimumPayment: 5000 });
    const result = calculatePayoff([debt], "avalanche", 0);
    const dates = getDebtPayoffDates(result);
    expect(dates["d1"]).toBeInstanceOf(Date);
    expect(dates["d1"].getTime()).toBeGreaterThan(new Date().getTime());
  });
});

describe("getSmartPresets", () => {
  it("возвращает малые пресеты при платеже < 20000", () => {
    expect(getSmartPresets(15000)).toEqual([2000, 5000, 10000]);
  });

  it("возвращает средние пресеты при платеже 20000–50000", () => {
    expect(getSmartPresets(30000)).toEqual([5000, 10000, 20000]);
  });

  it("возвращает большие пресеты при платеже > 50000", () => {
    expect(getSmartPresets(60000)).toEqual([10000, 25000, 50000]);
  });
});

describe("calculateInactionCost", () => {
  it("возвращает корректную структуру", () => {
    const debt = makeDebt({ id: "d1", currentBalance: 100000, interestRate: 18, minimumPayment: 5000 });
    const result = calculatePayoff([debt], "avalanche", 0);
    const cost = calculateInactionCost([debt], result);
    expect(cost.monthlyInterestCost).toBeGreaterThan(0);
    expect(cost.totalOverpayment).toBe(result.totalInterestPaid);
    expect(cost.monthsInterestOnly).toBe(result.totalMonths);
  });
});
