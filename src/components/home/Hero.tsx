import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/search/SearchBar";
import { placeholderPhotoUrl } from "@/lib/placeholder";

export function Hero({ models = [] }: { models?: string[] }) {
  return (
    <section className="relative overflow-hidden bg-ink-900">
      <div className="absolute inset-0">
        <Image
          src={placeholderPhotoUrl("hero", "AutoPrime — veiculo em destaque", "1920x1080")}
          alt="Veículo em destaque no showroom AutoPrime"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/85 to-ink-900/30" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col px-4 pb-24 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pt-28">
        <div className="max-w-xl animate-fade-up">
          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tighter text-white sm:text-5xl lg:text-6xl">
            O carro certo está aqui, não em mil abas abertas.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
            Seminovos e 0km revisados, financiamento simulado em segundos e um clique até o
            WhatsApp. Sem achismo, sem letra miúda.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/estoque" size="lg">
              Ver estoque completo
            </Button>
            <Button href="/financiamento" variant="outline" size="lg" className="!border-white/25 !bg-transparent !text-white hover:!border-white">
              Simular financiamento
            </Button>
          </div>
        </div>
      </div>

      <div className="relative mx-auto -mt-8 max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <SearchBar variant="hero" models={models} />
      </div>
    </section>
  );
}
