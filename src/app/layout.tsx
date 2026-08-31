import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFAB from "@/components/layout/WhatsAppFAB";
import CompareFAB from "@/components/layout/CompareFAB";
import { SITE } from "@/lib/constants";
import { getFilterFacets } from "@/lib/vehicles";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE.name} — Seminovos e 0km`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.tagline,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE.name,
    title: `${SITE.name} — Seminovos e 0km`,
    description: SITE.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Seminovos e 0km`,
    description: SITE.tagline,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const ga4Id = process.env.NEXT_PUBLIC_GA4_ID;
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const facets = await getFilterFacets().catch(() => ({ models: [] as string[] }));

  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        {/*
          THESIS: a revenda-única mostra estoque com a fluidez de um marketplace grande,
          recusando o card-grid genérico como única linguagem — busca, comparação e
          financiamento vivem juntos, não em abas separadas.
          OWN-WORLD: showroom claro (#fff), vermelho #D32F2F só em preço/CTA/badges,
          Poppins bold em display, Inter no corpo, cards com sombra suave e raio 14px.
          STORY: visitante entende o estoque em segundos, filtra por marca/faixa/tipo,
          e sai para o WhatsApp já com o carro certo identificado.
          FIRST VIEWPORT: hero full-width com carro em destaque à direita, headline +
          dupla de CTA à esquerda, busca inteligente sobreposta na base do hero.
          FORM: execução direta de brief fixado pelo usuário (paleta, tipografia,
          páginas e componentes já definidos) — sem torneio de conceitos; ver PRODUCT.md.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the
          finish review, the verdict, DESIGN.md, and every shipping raster carrying its
          provenance.
        */}
        {ga4Id ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${ga4Id}');`}
            </Script>
          </>
        ) : null}
        {metaPixelId ? (
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${metaPixelId}');
              fbq('track', 'PageView');`}
          </Script>
        ) : null}

        <Header models={facets.models} />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppFAB />
        <CompareFAB />
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
