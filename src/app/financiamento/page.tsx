import type { Metadata } from "next";
import { FinancingForm } from "@/components/forms/FinancingForm";
import { FinancingCalculator } from "@/components/vehicle/FinancingCalculator";
import { FINANCING, FINANCING_FAQ } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Financiamento de veículos",
  description: "Simule o financiamento do seu 0km ou seminovo e envie sua proposta para um consultor.",
};

export default function FinanciamentoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tighter text-ink-900 sm:text-4xl">
          Financiamento sem enrolação
        </h1>
        <p className="mt-3 text-ink-600">
          Simule sua parcela agora e, se fizer sentido, envie os dados para um dos nossos consultores
          finalizar sua proposta com os parceiros financeiros.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <h2 className="text-lg font-bold text-ink-900">Envie sua proposta</h2>
          <div className="mt-4 rounded-card border border-surface-border bg-white p-6 shadow-card">
            <FinancingForm />
          </div>

          <h2 className="mt-12 text-lg font-bold text-ink-900">Perguntas frequentes</h2>
          <div className="mt-4 divide-y divide-surface-border border-y border-surface-border">
            {FINANCING_FAQ.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-medium text-ink-900">
                  {item.q}
                  <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-ink-400 transition-transform group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 4v12M4 10h12" strokeLinecap="round" />
                  </svg>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <FinancingCalculator price={150000} />

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-tight text-ink-400">Parceiros financeiros</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {FINANCING.partners.map((partner) => (
                <div
                  key={partner}
                  className="flex h-16 items-center justify-center rounded-lg border border-surface-border bg-white px-3 text-center font-display text-sm font-bold text-ink-600"
                >
                  {partner}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-400">Nomes ilustrativos para esta demonstração.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
