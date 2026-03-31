import Link from "next/link";
import { BookOpen, Clock, TrendingDown, Calculator, BarChart2, Percent, ArrowRight } from "lucide-react";

interface Article {
  slug: string;
  title: string;
  summary: string;
  readTime: string;
  icon: React.ElementType;
  accent: string;
  bg: string;
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
    accent: "#F79009",
    bg: "#FFFBEB",
    tag: "Механика",
  },
  {
    slug: "how-extra-payments-change-the-curve",
    title: "Как небольшая доплата меняет весь срок",
    summary:
      "Дополнительные 3–5 тысяч рублей в месяц могут сократить срок на годы. Объясняем, почему это работает именно так.",
    readTime: "5 мин",
    icon: Calculator,
    accent: "#6C63FF",
    bg: "#EEF2FF",
    tag: "Расчёты",
  },
  {
    slug: "avalanche-vs-snowball",
    title: "Лавина против снежного кома: в чём разница",
    summary:
      "Два подхода к порядку погашения долгов дают разный результат. Разбираем цифры без советов — только сравнение сценариев.",
    readTime: "6 мин",
    icon: BarChart2,
    accent: "#12B76A",
    bg: "#F0FDF8",
    tag: "Стратегии",
  },
  {
    slug: "what-is-overpayment",
    title: "Что такое переплата и как её считать",
    summary:
      "Переплата — это разница между суммой, которую вы заплатите, и суммой долга. Простое объяснение с примерами.",
    readTime: "3 мин",
    icon: Percent,
    accent: "#5B8DEF",
    bg: "#EFF6FF",
    tag: "Основы",
  },
  {
    slug: "effective-rate-explained",
    title: "Эффективная ставка: почему она отличается от номинальной",
    summary:
      "Банк пишет 19% годовых, но реальная стоимость кредита выше. Объясняем, из чего складывается полная стоимость.",
    readTime: "5 мин",
    icon: Calculator,
    accent: "#F79009",
    bg: "#FFFBEB",
    tag: "Основы",
  },
  {
    slug: "debt-load-visualization",
    title: "Как понять, что долговая нагрузка слишком высокая",
    summary:
      "Простые ориентиры для оценки соотношения платежей к доходу. Без оценок и советов — только числа.",
    readTime: "4 мин",
    icon: BarChart2,
    accent: "#6C63FF",
    bg: "#EEF2FF",
    tag: "Ориентиры",
  },
];

const TAGS = ["Все", "Основы", "Механика", "Расчёты", "Стратегии", "Ориентиры"];

export default function LearnPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Разобраться</h1>
        <p className="text-sm text-[#667085]">
          Как устроены кредиты, проценты и погашение — понятно и без лишнего
        </p>
      </div>

      {/* Tag filter — visual only, no interactivity needed here */}
      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag, i) => (
          <span
            key={tag}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-default ${
              i === 0
                ? "bg-[#6C63FF] text-white border-[#6C63FF]"
                : "bg-white text-[#667085] border-[#E7ECF3]"
            }`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Articles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ARTICLES.map((article) => {
          const Icon = article.icon;
          return (
            <Link
              key={article.slug}
              href={`/learn/${article.slug}`}
              className="group bg-white rounded-2xl border border-[#E7ECF3] shadow-card hover:shadow-card-hover transition-all duration-200 hover:scale-[1.01] p-5 flex flex-col"
            >
              {/* Icon + tag */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: article.bg }}
                >
                  <Icon className="w-5 h-5" style={{ color: article.accent }} />
                </div>
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: article.bg,
                    color: article.accent,
                  }}
                >
                  {article.tag}
                </span>
              </div>

              {/* Content */}
              <h3 className="font-bold text-[#0F172A] text-sm leading-snug mb-2 flex-1">
                {article.title}
              </h3>
              <p className="text-xs text-[#667085] leading-relaxed mb-4 line-clamp-2">
                {article.summary}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9]">
                <div className="flex items-center gap-1.5 text-[10px] text-[#94a3b8]">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </div>
                <span
                  className="flex items-center gap-1 text-[11px] font-semibold transition-colors"
                  style={{ color: article.accent }}
                >
                  Читать <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-[#94a3b8] pb-2">
        Материалы носят образовательный характер. Не являются финансовой консультацией.
      </p>
    </div>
  );
}
