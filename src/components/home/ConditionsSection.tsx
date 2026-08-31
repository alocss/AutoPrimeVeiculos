import { Button } from "@/components/ui/Button";

const CONDITIONS = [
  {
    title: "Financie seu seminovo",
    description: "Condições especiais para veículos revisados, com entrada facilitada e parcelas que cabem no seu bolso.",
    href: "/financiamento",
    cta: "Simular agora",
    icon: (
      <path d="M4 10h16M4 10a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2v-6a2 2 0 00-2-2M4 10l1.5-4.5A2 2 0 017.4 4h9.2a2 2 0 011.9 1.5L20 10M8 16h.01M12 16h.01" />
    ),
  },
  {
    title: "Financie seu 0km",
    description: "Saia da concessionária direto para casa. Taxas competitivas com os principais bancos e financeiras.",
    href: "/financiamento",
    cta: "Simular agora",
    icon: <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7l3-7z" />,
  },
  {
    title: "Avalie seu veículo",
    description: "Descubra quanto vale o seu carro agora e use como parte do pagamento ou venda direto pra gente.",
    href: "/venda-seu-veiculo",
    cta: "Avaliar meu carro",
    icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
];

export function ConditionsSection() {
  return (
    <section className="bg-surface-muted py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold tracking-tighter text-ink-900">Condições especiais</h2>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {CONDITIONS.map((c) => (
            <div key={c.title} className="flex flex-col rounded-card border border-surface-border bg-white p-6 shadow-card">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  {c.icon}
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink-900">{c.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{c.description}</p>
              <Button href={c.href} variant="outline" size="sm" className="mt-5 self-start">
                {c.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
