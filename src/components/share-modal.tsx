"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle2 } from "lucide-react";
import { formatCurrency, formatMonths } from "@/lib/debt-calculator";
import { getScenarioShareText, getShareText, APP_URL } from "@/lib/share";

interface ScenarioData {
  type: "scenario";
  savedMonths: number;
  savedMoney: number;
  extra: number;
}

interface OverviewData {
  type: "overview";
}

export type ShareData = ScenarioData | OverviewData;

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  data: ShareData;
}

export function ShareModal({ open, onClose, data }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareText =
    data.type === "scenario"
      ? getScenarioShareText(
          data.savedMonths,
          data.savedMoney,
          formatMonths(data.savedMonths),
          formatCurrency(data.savedMoney)
        )
      : getShareText();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  }, [shareText]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Поделиться</DialogTitle>
          <DialogDescription>
            Анонимный текст — без банков, без суммы долга
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Preview card */}
          <div className="rounded-2xl bg-gradient-to-br from-[#eff6ff] to-[#f0fdf4] border border-[#e2e8f0] p-5">
            {/* Branding */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#1e40af] to-[#3b82f6] flex items-center justify-center">
                <span className="text-white font-bold text-xs">Д</span>
              </div>
              <span className="text-sm font-bold text-[#1e40af]">ДолгOFF</span>
            </div>

            {data.type === "scenario" && data.savedMonths > 0 ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-[#0f172a]">
                  Посчитал сценарий погашения долгов
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {data.savedMonths > 0 && (
                    <div className="bg-white/70 rounded-xl p-3">
                      <p className="text-xs text-[#64748b]">Быстрее на</p>
                      <p className="text-lg font-bold text-[#059669]">
                        {formatMonths(data.savedMonths)}
                      </p>
                    </div>
                  )}
                  {data.savedMoney > 0 && (
                    <div className="bg-white/70 rounded-xl p-3">
                      <p className="text-xs text-[#64748b]">Экономия</p>
                      <p className="text-lg font-bold text-[#059669]">
                        {formatCurrency(data.savedMoney)}
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-[#94a3b8]">Пример расчёта в ДолгOFF</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#0f172a]">
                  Сервис для расчёта переплаты и срока погашения кредитов
                </p>
                <p className="text-xs text-[#64748b]">Только математика, никаких советов</p>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-[#e2e8f0]/60">
              <p className="text-xs text-[#94a3b8] break-all">{APP_URL}</p>
            </div>
          </div>

          {/* Copy text preview */}
          <div className="rounded-xl bg-[#f8fafc] border border-[#e2e8f0] px-4 py-3">
            <p className="text-xs font-semibold text-[#64748b] mb-1.5">Текст для копирования</p>
            <p className="text-sm text-[#0f172a] whitespace-pre-line leading-relaxed">
              {shareText}
            </p>
          </div>

          {/* Copy button */}
          <Button
            onClick={handleCopy}
            className={`w-full h-11 rounded-xl font-semibold transition-all duration-200 ${
              copied
                ? "bg-emerald-50 text-[#059669] border border-emerald-200 hover:bg-emerald-50"
                : "bg-[#1e40af] hover:bg-[#1d3a9e] text-white shadow-sm shadow-blue-100"
            }`}
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Скопировано!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Скопировать текст
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
