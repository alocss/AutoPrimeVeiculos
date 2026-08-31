import Image from "next/image";
import { WHY_US } from "@/lib/constants";
import { placeholderPhotoUrl } from "@/lib/placeholder";

export function WhyUs() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-card">
          <Image
            src={placeholderPhotoUrl("whyus", "Equipe AutoPrime na revisao", "900x700")}
            alt="Equipe técnica AutoPrime revisando um veículo"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="font-display text-3xl font-bold tracking-tighter text-ink-900">
            Por que comprar conosco?
          </h2>
          <p className="mt-3 max-w-md text-ink-600">
            Não vendemos só o carro — entregamos a tranquilidade de saber que ele foi checado de
            ponta a ponta antes de chegar até você.
          </p>

          <ul className="mt-8 divide-y divide-surface-border border-y border-surface-border">
            {WHY_US.map((item) => (
              <li key={item.title} className="flex items-start gap-4 py-5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-500 text-white">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M4 10.5l3.5 3.5L16 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="font-semibold text-ink-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-600">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
