export interface EquivalentItem {
  id: string;
  label: string;
  emoji: string;
  price: number; // RUB
  caption: string;
}

/**
 * Configurable price list for everyday items.
 * Prices are approximate Moscow/regional averages (2025).
 * Easy to update without touching UI code.
 */
export const EQUIVALENT_ITEMS: EquivalentItem[] = [
  {
    id: "coffee",
    label: "кофе",
    emoji: "☕",
    price: 220,
    caption: "стаканчик кофе навынос",
  },
  {
    id: "lunch",
    label: "обед",
    emoji: "🥗",
    price: 500,
    caption: "обед в кафе",
  },
  {
    id: "taxi",
    label: "такси",
    emoji: "🚕",
    price: 650,
    caption: "поездка на такси по городу",
  },
  {
    id: "streaming",
    label: "подписка",
    emoji: "🎬",
    price: 399,
    caption: "месяц стриминга",
  },
  {
    id: "grocery",
    label: "продукты",
    emoji: "🛒",
    price: 1800,
    caption: "корзина продуктов на неделю",
  },
  {
    id: "metro",
    label: "метро",
    emoji: "🚇",
    price: 65,
    caption: "поездка в метро",
  },
  {
    id: "fuel",
    label: "топливо",
    emoji: "⛽",
    price: 780,
    caption: "20 литров бензина АИ-92",
  },
  {
    id: "pizza",
    label: "пицца",
    emoji: "🍕",
    price: 650,
    caption: "пицца с доставкой",
  },
];

export function calculateEquivalent(amount: number, item: EquivalentItem): number {
  return Math.round(amount / item.price);
}

export function formatEquivalentCount(count: number): string {
  const abs = Math.abs(count);
  if (abs >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, "")} тыс.`;
  }
  return count.toLocaleString("ru-RU");
}
