"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatMonths } from "@/lib/debt-calculator";
import type { PayoffResult } from "@/lib/debt-calculator";

interface DashboardHeroProps {
  result: PayoffResult;
  payoffDate: Date;
}

function formatPayoffDateLong(date: Date): string {
  return date.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0 },
};

export function DashboardHero({ result, payoffDate }: DashboardHeroProps) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.09 } } }}
      className="relative overflow-hidden rounded-3xl p-7 text-white"
      style={{
        background: "linear-gradient(135deg, #6C63FF 0%, #7A72FF 40%, #5B8DEF 100%)",
        boxShadow: "0 8px 32px rgba(108, 99, 255, 0.28), 0 2px 8px rgba(108, 99, 255, 0.18)",
      }}
    >
      {/* Decorative rings */}
      <div className="absolute -right-14 -top-14 w-64 h-64 rounded-full border-[32px] border-white/5 pointer-events-none" />
      <div className="absolute right-8 -bottom-12 w-44 h-44 rounded-full border-[22px] border-white/5 pointer-events-none" />
      <div className="absolute -left-8 bottom-4 w-24 h-24 rounded-full border-[14px] border-white/4 pointer-events-none" />

      {/* Label */}
      <motion.p variants={fadeUp} className="text-sm font-medium text-white/65 mb-2 tracking-wide">
        Закроешь долги к
      </motion.p>

      {/* Primary date — Space Grotesk */}
      <motion.p
        variants={fadeUp}
        className="font-numeric text-5xl sm:text-6xl font-bold leading-none tracking-tight mb-1.5"
      >
        {formatPayoffDateLong(payoffDate)}
      </motion.p>

      <motion.p variants={fadeUp} className="text-white/55 text-sm mb-6">
        {formatMonths(result.totalMonths)} при текущем плане
      </motion.p>

      {/* Overpayment pill */}
      <motion.div
        variants={fadeUp}
        className="inline-flex items-center gap-2.5 bg-white/10 border border-white/18 rounded-2xl px-4 py-2.5 mb-6 backdrop-blur-sm"
      >
        <div className="w-2 h-2 rounded-full bg-[#F79009] shadow-[0_0_6px_rgba(247,144,9,0.8)]" />
        <span className="text-sm font-medium text-white/85">
          Уйдёт на проценты:{" "}
          <span className="font-bold text-white font-numeric">
            {formatCurrency(result.totalInterestPaid)}
          </span>
        </span>
      </motion.div>

      {/* CTAs */}
      <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
        <Button
          render={<Link href="/simulator" />}
          className="bg-white text-[#6C63FF] hover:bg-white/92 font-semibold rounded-xl h-10 px-5 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
        >
          <Zap className="w-3.5 h-3.5 mr-1.5" />
          Изменить сценарий
        </Button>
        <button
          onClick={() => {
            document.getElementById("scenario-cards")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors"
        >
          Варианты доплат
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </motion.div>
  );
}
