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
      <DialogContent
        className="rounded-[18px] sm:max-w-md"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "var(--text-primary)" }}>Поделиться</DialogTitle>
          <DialogDescription style={{ color: "var(--text-tertiary)" }}>
            Анонимный текст — без банков, без суммы долга
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          {/* Preview card */}
          <div
            className="rounded-[14px] p-5"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border-light)",
            }}
          >
            {/* Branding */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-6 h-6 rounded-[7px] flex items-center justify-center"
                style={{ background: "var(--accent-primary)" }}
              >
                <span className="text-white font-bold text-[11px]">Д</span>
              </div>
              <span className="text-[13px] font-bold" style={{ color: "var(--text-primary)" }}>
                ДолгOFF
              </span>
            </div>

            {data.type === "scenario" && data.savedMonths > 0 ? (
              <div className="space-y-3">
                <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                  Посчитал сценарий погашения долгов
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {data.savedMonths > 0 && (
                    <div
                      className="rounded-[12px] p-3"
                      style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-light)",
                      }}
                    >
                      <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                        Быстрее на
                      </p>
                      <p
                        className="text-[18px] font-bold tabular-nums"
                        style={{ letterSpacing: "-0.02em", color: "var(--color-success)" }}
                      >
                        {formatMonths(data.savedMonths)}
                      </p>
                    </div>
                  )}
                  {data.savedMoney > 0 && (
                    <div
                      className="rounded-[12px] p-3"
                      style={{
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-light)",
                      }}
                    >
                      <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                        Экономия
                      </p>
                      <p
                        className="text-[18px] font-bold tabular-nums"
                        style={{ letterSpacing: "-0.02em", color: "var(--color-success)" }}
                      >
                        {formatCurrency(data.savedMoney)}
                      </p>
                    </div>
                  )}
                </div>
                <p className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>
                  Пример расчёта в ДолгOFF
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>
                  Сервис для расчёта переплаты и срока погашения кредитов
                </p>
                <p className="text-[11px]" style={{ color: "var(--text-secondary)" }}>
                  Только математика, никаких советов
                </p>
              </div>
            )}

            <div
              className="mt-4 pt-3"
              style={{ borderTop: "1px solid var(--border-light)" }}
            >
              <p className="text-[11px] break-all" style={{ color: "var(--text-tertiary)" }}>
                {APP_URL}
              </p>
            </div>
          </div>

          {/* Copy text preview */}
          <div
            className="rounded-[12px] px-4 py-3"
            style={{
              background: "var(--bg-input)",
              border: "1px solid var(--border-light)",
            }}
          >
            <p
              className="text-[10.5px] font-semibold mb-1.5"
              style={{ color: "var(--text-tertiary)" }}
            >
              Текст для копирования
            </p>
            <p
              className="text-[13px] whitespace-pre-line leading-relaxed"
              style={{ color: "var(--text-primary)" }}
            >
              {shareText}
            </p>
          </div>

          {/* Copy button */}
          <Button
            onClick={handleCopy}
            className="w-full h-11 rounded-[10px] font-semibold transition-all duration-200"
            style={
              copied
                ? {
                    background: "var(--color-success-light)",
                    color: "var(--color-success)",
                    border: "1px solid rgba(16,185,129,0.25)",
                  }
                : { background: "var(--accent-primary)", color: "#FFFFFF" }
            }
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
