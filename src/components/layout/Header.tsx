"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SITE } from "@/lib/constants";
import { useFavorites } from "@/lib/favorites-store";
import { SearchBar } from "@/components/search/SearchBar";

const NAV_LINKS = [
  { href: "/estoque", label: "Estoque" },
  { href: "/financiamento", label: "Financiamento" },
  { href: "/venda-seu-veiculo", label: "Venda seu veículo" },
  { href: "/sobre-nos", label: "Sobre nós" },
  { href: "/contato", label: "Contato" },
];

export default function Header({ models = [] }: { models?: string[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useFavorites();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 420);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname?.startsWith("/admin")) return null;
  const showStickySearch = pathname === "/" && scrolled;

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tighter text-ink-900">
          <Image src="/brands/logo-icon.png" alt="" width={483} height={435} priority className="h-11 w-auto" />
          {SITE.shortName}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-[15px] font-medium text-ink-600 transition-colors hover:text-primary-600",
                pathname === link.href && "text-primary-600",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/favoritos"
            className="relative hidden h-10 w-10 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-surface-muted hover:text-primary-600 sm:flex"
            aria-label="Favoritos"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 20s-7.5-4.6-10-9.3C.4 7.4 2 4 5.4 4c2 0 3.4 1 4.6 2.6C11.2 5 12.6 4 14.6 4 18 4 19.6 7.4 22 10.7 19.5 15.4 12 20 12 20z" />
            </svg>
            {count > 0 ? (
              <span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 text-[10px] font-bold text-white">
                {count}
              </span>
            ) : null}
          </Link>

          <Link
            href="/admin/login"
            className="hidden h-10 w-10 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-surface-muted hover:text-primary-600 sm:flex"
            aria-label="Área do lojista"
            title="Área do lojista"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
              <path d="M10 17l5-5-5-5" />
              <path d="M15 12H3" />
            </svg>
          </Link>

          <Link
            href="/estoque"
            className="hidden rounded-lg bg-primary-500 px-4 py-2.5 text-[15px] font-semibold text-white shadow-card transition-all hover:bg-primary-600 sm:inline-flex"
          >
            Ver estoque
          </Link>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-900 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            aria-expanded={open}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-surface-border bg-white px-4 py-3 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-2.5 text-[15px] font-medium text-ink-900"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/favoritos"
            onClick={() => setOpen(false)}
            className="block py-2.5 text-[15px] font-medium text-ink-900"
          >
            Favoritos {count > 0 ? `(${count})` : ""}
          </Link>
          <Link
            href="/admin/login"
            onClick={() => setOpen(false)}
            className="block py-2.5 text-[15px] font-medium text-ink-900"
          >
            Área do lojista
          </Link>
        </nav>
      ) : null}

      {showStickySearch ? (
        <div className="hidden border-t border-surface-border bg-white px-4 py-3 sm:px-6 lg:block lg:px-8">
          <div className="mx-auto max-w-7xl">
            <SearchBar variant="compact" models={models} />
          </div>
        </div>
      ) : null}
    </header>
  );
}
