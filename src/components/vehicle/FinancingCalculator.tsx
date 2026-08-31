"use client";

import { useMemo, useState } from "react";
import { formatBRL } from "@/lib/utils";
import { FINANCING } from "@/lib/constants";

function monthlyPayment(principal: number, annualRatePct: number, months: number): number {
  const monthlyRate = annualRatePct / 100 / 12;
  if (monthlyRate === 0) return principal / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export function FinancingCalculator({ price }: { price: number }) {
  const [downPaymentPct, setDownPaymentPct] = useState(0.3);
  const [months, setMonths] = useState(48);

  const downPayment = Math.round(price * downPaymentPct);
  const financed = price - downPayment;
  const installment = useMemo(
    () => monthlyPayment(financed, FINANCING.defaultAnnualRatePct, months),
    [financed, months],
  );
  const totalPaid = installment * months + downPayment;

  return (
    <div className="rounded-card border border-surface-border bg-surface-muted p-5">
      <h3 className="font-display text-lg font-bold text-ink-900">Simule seu financiamento</h3>
      <p className="mt-1 text-xs text-ink-600">
        Simulação ilustrativa a partir de {FINANCING.defaultAnnualRatePct.toString().replace(".", ",")}% a.a. A taxa
        final depende da análise de crédito.
      </p>

      <div className="mt-5 flex flex-col gap-5">
        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-ink-900">Entrada</span>
            <span className="tabular-nums font-semibold text-ink-900">
              {formatBRL(downPayment)} ({Math.round(downPaymentPct * 100)}%)
            </span>
          </div>
          <input
            type="range"
            min={FINANCING.minDownPaymentPct}
            max={0.9}
            step={0.05}
            value={downPaymentPct}
            onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            className="mt-2 w-full accent-primary-500"
            aria-label="Percentual de entrada"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-ink-900">Prazo</span>
            <span className="tabular-nums font-semibold text-ink-900">{months}x</span>
          </div>
          <input
            type="range"
            min={FINANCING.minTermMonths}
            max={FINANCING.maxTermMonths}
            step={12}
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="mt-2 w-full accent-primary-500"
            aria-label="Número de parcelas"
          />
        </div>

        <div className="rounded-lg bg-white p-4 shadow-card">
          <p className="text-xs text-ink-600">Parcela estimada em</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-primary-600">
            {formatBRL(installment)}
            <span className="text-sm font-medium text-ink-600"> /mês</span>
          </p>
          <div className="mt-3 flex justify-between text-xs text-ink-600">
            <span>Valor financiado</span>
            <span className="tabular-nums">{formatBRL(financed)}</span>
          </div>
          <div className="mt-1 flex justify-between text-xs text-ink-600">
            <span>Total pago ao final</span>
            <span className="tabular-nums">{formatBRL(totalPaid)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
