export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://dolgoff.ru";

export function getShareText(): string {
  return `Нашёл сервис, который показывает переплату по кредитам и как сократить срок погашения. Очень наглядно — стоит проверить свои цифры.\n${APP_URL}`;
}

export function getScenarioShareText(
  savedMonths: number,
  savedMoney: number,
  formattedMonths: string,
  formattedMoney: string
): string {
  const lines: string[] = [];
  lines.push("Посчитал сценарий погашения в ДолгOFF:");
  if (savedMonths > 0) lines.push(`— срок можно сократить на ${formattedMonths}`);
  if (savedMoney > 0) lines.push(`— переплату можно уменьшить на ${formattedMoney}`);
  lines.push("Очень наглядно — проверь свои цифры:");
  lines.push(APP_URL);
  return lines.join("\n");
}
