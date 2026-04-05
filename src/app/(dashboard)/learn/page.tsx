import Link from "next/link";
import { Clock, TrendingDown, Calculator, BarChart2, Percent, ArrowRight } from "lucide-react";

interface Article {
  slug: string;
  title: string;
  summary: string;
  readTime: string;
  icon: React.ElementType;
  tag: string;
}

const ARTICLES: Article[] = [
  {
    slug: "why-minimum-payments-cost-so-much",
    title: "Почему минимальные платежи так дорого обходятся",
    summary:
      "Если платить только минимум, большая часть уходит на проценты, а не на тело долга. Разбираем, как это работает математически.",
    readTime: "4 мин",
    icon: TrendingDown,
    tag: "Механика",
  },
  {
    slug: "how-extra-payments-change-the-curve",
    title: "Как небольшая доплата меняет весь срок",
    summary:
      "Дополнительные 3–5 тысяч рублей в месяц могут сократить срок на годы. Объясняем, почему это работает именно так.",
    readTime: "5 мин",
    icon: Calculator,
    tag: "Расчёты",
  },
  {
    slug: "avalanche-vs-snowball",
    title: "Лавина против снежного кома: в чём разница",
    summary:
      "Два подхода к порядку погашения долгов дают разный результат. Разбираем цифры без советов — только сравнение сценариев.",
    readTime: "6 мин",
    icon: BarChart2,
    tag: "Стратегии",
  },
  {
    slug: "what-is-overpayment",
    title: "Что такое переплата и как её считать",
    summary:
      "Переплата — это разница между суммой, которую вы заплатите, и суммой долга. Простое объяснение с примерами.",
    readTime: "3 мин",
    icon: Percent,
    tag: "Основы",
  },
  {
    slug: "effective-rate-explained",
    title: "Эффективная ставка: почему она отличается от номинальной",
    summary:
      "Банк пишет 19% годовых, но реальная стоимость кредита выше. Объясняем, из чего складывается полная стоимость.",
    readTime: "5 мин",
    icon: Calculator,
    tag: "Основы",
  },
  {
    slug: "debt-load-visualization",
    title: "Как понять, что долговая нагрузка слишком высокая",
    summary:
      "Простые ориентиры для оценки соотношения платежей к доходу. Без оценок и советов — только числа.",
    readTime: "4 мин",
    icon: BarChart2,
    tag: "Ориентиры",
  },
];

const TAG_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  "Механика":  { bg: "rgba(108,92,231,0.08)", color: "var(--accent-primary)", border: "rgba(108,92,231,0.20)" },
  "Расчёты":   { bg: "rgba(16,185,129,0.08)", color: "var(--color-success)", border: "rgba(16,185,129,0.20)" },
  "Стратегии": { bg: "rgba(245,158,11,0.08)", color: "var(--color-warning)", border: "rgba(245,158,11,0.20)" },
  "Основы":    { bg: "rgba(59,130,246,0.08)", color: "#3B82F6", border: "rgba(59,130,246,0.20)" },
  "Ориентиры": { bg: "var(--bg-input)", color: "var(--text-secondary)", border: "var(--border-default)" },
};

const TAGS = ["Все", "Основы", "Механика", "Расчёты", "Стратегии", "Ориентиры"];

export default function LearnPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-[22px] font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
          Разобраться
        </h1>
        <p className="text-[13px]" style={{ color: "var(--text-tertiary)" }}>
          Как устроены кредиты, проценты и погашение — понятно и без лишнего
        </p>
      </div>

      {/* Tag filter */}
      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag, i) => (
          <span
            key={tag}
            className="px-3 py-1.5 rounded-full text-[11.5px] font-semibold cursor-default transition-colors"
            style={
              i === 0
                ? { background: "var(--accent-primary)", color: "#FFFFFF" }
                : {
                    background: "var(--bg-surface)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-default)",
                  }
            }
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ARTICLES.map((article) => {
          const Icon = article.icon;
          const tagStyle = TAG_COLORS[article.tag] ?? TAG_COLORS["Ориентиры"];
          return (
            <Link
              key={article.slug}
              href={`/learn/${article.slug}`}
              className="group flex flex-col rounded-[18px] p-5 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-light)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              {/* Icon + tag */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
                  style={{ background: "var(--bg-input)" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
                </div>
                <span
                  className="badge-pill text-[9px] font-bold uppercase tracking-[0.08em]"
                  style={{
                    background: tagStyle.bg,
                    color: tagStyle.color,
                    border: `1px solid ${tagStyle.border}`,
                  }}
                >
                  {article.tag}
                </span>
              </div>

              {/* Content */}
              <h3
                className="font-bold text-[13px] leading-snug mb-2 flex-1"
                style={{ color: "var(--text-primary)" }}
              >
                {article.title}
              </h3>
              <p
                className="text-[12px] leading-relaxed mb-4 line-clamp-2"
                style={{ color: "var(--text-secondary)" }}
              >
                {article.summary}
              </p>

              {/* Footer */}
              <div
                className="flex items-center justify-between pt-3"
                style={{ borderTop: "1px solid var(--border-light)" }}
              >
                <div
                  className="flex items-center gap-1.5 text-[10.5px]"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </div>
                <span
                  className="flex items-center gap-1 text-[11px] font-semibold transition-colors"
                  style={{ color: "var(--accent-primary)" }}
                >
                  Читать <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p className="text-[10.5px] pb-2" style={{ color: "var(--text-tertiary)" }}>
        Материалы носят образовательный характер. Не являются финансовой консультацией.
      </p>
    </div>
  );
}
