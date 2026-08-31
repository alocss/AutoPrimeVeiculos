import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/Button";
import { SITE } from "@/lib/constants";
import { whatsappGeneralLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com a equipe da ${SITE.name} por telefone, WhatsApp ou formulário.`,
};

export default function ContatoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tighter text-ink-900 sm:text-4xl">Fale com a gente</h1>
      <p className="mt-3 max-w-xl text-ink-600">
        Dúvidas sobre um veículo, financiamento ou visita à loja? Escolha o canal que preferir.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px]">
        <div className="rounded-card border border-surface-border bg-white p-6 shadow-card">
          <ContactForm />
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-card border border-surface-border bg-white p-6 shadow-card">
            <h2 className="text-sm font-semibold uppercase tracking-tight text-ink-400">Contato direto</h2>
            <dl className="mt-3 space-y-2 text-sm text-ink-900">
              <div className="flex justify-between">
                <dt className="text-ink-600">Telefone</dt>
                <dd>{SITE.phoneDisplay}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-600">E-mail</dt>
                <dd>{SITE.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-600">Endereço</dt>
                <dd className="text-right">
                  {SITE.address.street}
                  <br />
                  {SITE.address.neighborhood} — {SITE.address.city}/{SITE.address.state}
                </dd>
              </div>
            </dl>
            <Button href={whatsappGeneralLink()} variant="whatsapp" fullWidth className="mt-5">
              Falar no WhatsApp
            </Button>
          </div>

          <div className="rounded-card border border-surface-border bg-white p-6 shadow-card">
            <h2 className="text-sm font-semibold uppercase tracking-tight text-ink-400">Horário de atendimento</h2>
            <div className="mt-3 space-y-1.5 text-sm text-ink-900">
              {SITE.hours.map((h) => (
                <div key={h.day} className="flex justify-between">
                  <span className="text-ink-600">{h.day}</span>
                  <span className="tabular-nums">{h.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="aspect-[4/3] w-full overflow-hidden rounded-card border border-surface-border">
            <iframe
              title="Mapa de localização"
              src={SITE.mapEmbedSrc}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
