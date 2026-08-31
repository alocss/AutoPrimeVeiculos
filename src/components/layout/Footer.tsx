"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/constants";

const COLUMNS = [
  {
    title: "Comprar",
    links: [
      { href: "/estoque?condition=ZERO_KM", label: "Veículos 0km" },
      { href: "/estoque?condition=SEMINOVO", label: "Veículos seminovos" },
      { href: "/estoque", label: "Estoque completo" },
      { href: "/favoritos", label: "Meus favoritos" },
    ],
  },
  {
    title: "Serviços",
    links: [
      { href: "/financiamento", label: "Simular financiamento" },
      { href: "/venda-seu-veiculo", label: "Vender meu veículo" },
      { href: "/contato", label: "Falar com um consultor" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { href: "/sobre-nos", label: "Sobre nós" },
      { href: "/contato", label: "Contato" },
      { href: "/admin/login", label: "Área do lojista" },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-surface-border bg-ink-900 text-white/80">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <div className="flex items-center gap-2 font-display text-xl font-bold text-white">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500 text-base">
                AP
              </span>
              {SITE.name}
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">{SITE.tagline}</p>
            <div className="mt-5 flex gap-3">
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-primary-500 hover:text-primary-400"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 2.2c3.2 0 3.6 0 4.8.07 1.2.06 2 .25 2.7.53a5.4 5.4 0 011.98 1.28 5.4 5.4 0 011.28 1.98c.28.7.47 1.5.53 2.7.06 1.2.07 1.6.07 4.8s0 3.6-.07 4.8c-.06 1.2-.25 2-.53 2.7a5.4 5.4 0 01-1.28 1.98 5.4 5.4 0 01-1.98 1.28c-.7.28-1.5.47-2.7.53-1.2.06-1.6.07-4.8.07s-3.6 0-4.8-.07c-1.2-.06-2-.25-2.7-.53a5.4 5.4 0 01-1.98-1.28 5.4 5.4 0 01-1.28-1.98c-.28-.7-.47-1.5-.53-2.7C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.8c.06-1.2.25-2 .53-2.7A5.4 5.4 0 013.08 2.52 5.4 5.4 0 015.06 1.24c.7-.28 1.5-.47 2.7-.53C8.96 0.65 9.36.64 12.56.64zM12 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zm0 10.16a4 4 0 110-8 4 4 0 010 8zm6.4-10.4a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" />
                </svg>
              </a>
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-primary-500 hover:text-primary-400"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M13.5 21v-8.06h2.7l.4-3.14h-3.1V7.8c0-.9.25-1.52 1.55-1.52h1.66V3.47C15.99 3.32 15 3.24 14 3.24c-2.5 0-4.2 1.52-4.2 4.32v2.34H7v3.14h2.8V21h3.7z" />
                </svg>
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/60 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold text-white">Contato</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/60">
              <li>{SITE.address.street}</li>
              <li>
                {SITE.address.neighborhood} — {SITE.address.city}/{SITE.address.state}
              </li>
              <li>{SITE.phoneDisplay}</li>
              <li>{SITE.email}</li>
            </ul>
            <div className="mt-4 space-y-1 text-sm text-white/60">
              {SITE.hours.map((h) => (
                <div key={h.day} className="flex justify-between gap-4">
                  <span>{h.day}</span>
                  <span className="tabular-nums">{h.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.
          </p>
          <p>Dados de estoque e depoimentos desta demonstração são ilustrativos.</p>
        </div>
      </div>
    </footer>
  );
}
