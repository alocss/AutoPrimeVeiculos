import Link from "next/link";

const CONDITIONS = [
  {
    title: "Financie seu seminovo",
    description: "Grande oportunidade de garantir seu seminovo! Preencha o formulário na página de financiamento e faça uma simulação.",
    href: "/financiamento",
    highlight: false,
    icon: (
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    ),
  },
  {
    title: "Financie seu 0km",
    description: "Parcelamos a entrada em até 10x sem juros no cartão de crédito! Preencha o formulário na página de financiamento e faça uma simulação.",
    href: "/financiamento",
    highlight: true,
    icon: (
      <>
        <path d="M5 17h14M5 17a1.5 1.5 0 103 0m8 0a1.5 1.5 0 103 0M5 17l1.2-4.8A2 2 0 018.1 11h7.8a2 2 0 011.9 1.2L19 17M9 11V8a1 1 0 011-1h4a1 1 0 011 1v3" />
        <path d="M16.5 2.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6.6-1.4z" />
      </>
    ),
  },
  {
    title: "Avaliamos seu veículo",
    description: "Nosso time de especialistas te ajuda ver quanto vale seu seminovo por meio da tabela de avaliação do mercado.",
    href: "/venda-seu-veiculo",
    highlight: false,
    icon: (
      <>
        <path d="M3 16h10M3 16a1.5 1.5 0 103 0m4 0a1.5 1.5 0 103 0M3 16l1.2-4.5A2 2 0 016.1 10h5.8a2 2 0 011.9 1.3L14.5 16M7 10V7.5a1 1 0 011-1h2a1 1 0 011 1V10" />
        <circle cx="18.5" cy="7" r="3.5" />
        <path d="M18.5 5.3v3.4m-1-.4c.15.4.55.65 1 .65.7 0 1.2-.4 1.2-1s-.5-.8-1.2-1c-.7-.2-1.2-.4-1.2-1s.5-1 1.2-1c.45 0 .85.25 1 .65" />
      </>
    ),
  },
];

export function ConditionsSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-display text-3xl font-bold tracking-tighter text-ink-900">
          Condições Especiais
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {CONDITIONS.map((c) => (
            <Link
              key={c.title}
              href={c.href}
              className={`flex flex-col items-center rounded-2xl p-8 text-center shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-cardHover ${
                c.highlight ? "bg-amber-600" : "bg-[#3a3a3c]"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-14 w-14 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {c.icon}
              </svg>
              <h3 className="mt-6 text-xl font-bold text-white">{c.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/80">{c.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
