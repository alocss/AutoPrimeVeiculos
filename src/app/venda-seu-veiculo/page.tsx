import type { Metadata } from "next";
import { SellForm } from "@/components/forms/SellForm";
import { SELL_STEPS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Venda seu veículo",
  description: "Avaliação gratuita e sem compromisso para o seu carro atual.",
};

export default function VendaSeuVeiculoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold tracking-tighter text-ink-900 sm:text-4xl">
          Venda seu veículo em 3 passos
        </h1>
        <p className="mt-3 text-ink-600">
          Avaliação gratuita e sem compromisso. Você decide se aceita a proposta.
        </p>
      </div>

      <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {SELL_STEPS.map((step, i) => (
          <li key={step.title} className="relative rounded-card border border-surface-border bg-white p-6 shadow-card">
            <span className="font-display text-3xl font-bold text-primary-500/25">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="mt-2 text-base font-semibold text-ink-900">{step.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{step.description}</p>
          </li>
        ))}
      </ol>

      <div className="mt-12 max-w-3xl">
        <h2 className="text-lg font-bold text-ink-900">Conte sobre o seu carro</h2>
        <div className="mt-4 rounded-card border border-surface-border bg-white p-6 shadow-card">
          <SellForm />
        </div>
      </div>
    </div>
  );
}
