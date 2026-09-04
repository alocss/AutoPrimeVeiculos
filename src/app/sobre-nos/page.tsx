import type { Metadata } from "next";
import Image from "next/image";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sobre nós",
  description: `Conheça a história, missão e valores da ${SITE.name}.`,
};

const STATS = [
  { value: "12", label: "anos no mercado" },
  { value: "3.400+", label: "veículos vendidos" },
  { value: "98%", label: "clientes satisfeitos" },
];

export default function SobreNosPage() {
  return (
    <div>
      <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tighter text-ink-900 sm:text-4xl">
            Feita por quem gosta de carro, para quem precisa de um.
          </h1>
          <p className="mt-4 leading-relaxed text-ink-600">
            A {SITE.name} nasceu da vontade de tornar a compra de um carro seminovo ou 0km um processo
            simples, transparente e sem pegadinhas. Cada veículo do nosso estoque passa por uma revisão
            criteriosa antes de chegar até você — porque confiança se constrói com transparência, não com
            promessa.
          </p>
          <p className="mt-4 leading-relaxed text-ink-600">
            Nossa missão é simples: ajudar você a encontrar o carro certo, no prazo certo, com a
            documentação em dia e sem surpresas depois da entrega.
          </p>

          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-surface-border pt-6">
            {STATS.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="font-display text-2xl font-bold tabular-nums text-primary-600 sm:text-3xl">{s.value}</dd>
                <p className="mt-1 text-xs text-ink-600">{s.label}</p>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-card">
          <Image
            src="/brands/Clientes.png"
            alt={`Equipe da ${SITE.name} no showroom`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="border-t border-surface-border bg-surface-muted py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold tracking-tighter text-ink-900">Onde estamos</h2>
          <p className="mt-2 text-ink-600">
            {SITE.address.street} — {SITE.address.neighborhood}, {SITE.address.city}/{SITE.address.state}
          </p>
          <div className="mt-6 aspect-[16/7] w-full overflow-hidden rounded-card border border-surface-border">
            <iframe
              title="Mapa de localização"
              src={SITE.mapEmbedSrc}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
