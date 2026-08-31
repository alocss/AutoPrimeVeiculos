export const SITE = {
  name: "AutoPrime Veículos",
  shortName: "AutoPrime",
  tagline: "Seminovos e 0km com procedência, do jeito que deveria ser.",
  phoneDisplay: "(11) 99999-9999",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5511999999999",
  email: "contato@autoprimeveiculos.com.br",
  address: {
    street: "Av. das Concessionárias, 1200",
    neighborhood: "Jardim Motor",
    city: "São Paulo",
    state: "SP",
    zip: "04567-000",
  },
  hours: [
    { day: "Segunda a sexta", time: "09:00 – 19:00" },
    { day: "Sábado", time: "09:00 – 16:00" },
    { day: "Domingo", time: "Fechado" },
  ],
  social: {
    instagram: "https://instagram.com/autoprimeveiculos",
    facebook: "https://facebook.com/autoprimeveiculos",
  },
  mapEmbedSrc:
    "https://www.google.com/maps?q=Av.+Paulista,+Sao+Paulo&output=embed",
} as const;

export const BRANDS = [
  "Toyota",
  "Honda",
  "Volkswagen",
  "Jeep",
  "Nissan",
  "Hyundai",
  "Fiat",
  "Chevrolet",
  "Volvo",
  "Peugeot",
] as const;

export const BODY_TYPE_LABEL: Record<string, string> = {
  SUV: "SUV",
  SEDAN: "Sedã",
  HATCH: "Hatch",
  PICKUP: "Picape",
  MINIVAN: "Minivan",
  COUPE: "Cupê",
};

export const TRANSMISSION_LABEL: Record<string, string> = {
  MANUAL: "Manual",
  AUTOMATICO: "Automático",
  AUTOMATIZADO: "Automatizado",
  CVT: "CVT",
};

export const FUEL_LABEL: Record<string, string> = {
  FLEX: "Flex",
  GASOLINA: "Gasolina",
  DIESEL: "Diesel",
  HIBRIDO: "Híbrido",
  ELETRICO: "Elétrico",
};

export const CONDITION_LABEL: Record<string, string> = {
  ZERO_KM: "0km",
  SEMINOVO: "Seminovo",
};

export const BADGE_LABEL: Record<string, string> = {
  DESTAQUE: "Destaque",
  NOVO: "Novo no estoque",
  NONE: "",
};

// Illustrative simulator rate — not a real bank offer. Surfaced with a disclaimer everywhere it renders.
export const FINANCING = {
  defaultAnnualRatePct: 22.8,
  minTermMonths: 12,
  maxTermMonths: 60,
  minDownPaymentPct: 0.2,
  partners: ["Banco Prime", "CredAuto", "Finance+", "BancoDigital Veículos"],
};

export const FINANCING_FAQ = [
  {
    q: "Qual a entrada mínima para financiar?",
    a: "Trabalhamos com entrada a partir de 20% do valor do veículo, mas o percentual ideal depende da sua análise de crédito e do prazo escolhido.",
  },
  {
    q: "Em quantas parcelas posso financiar?",
    a: "De 12 a 60 meses. Prazos mais longos reduzem a parcela mensal, mas aumentam o total de juros pagos — a simulação nesta página mostra os dois lados.",
  },
  {
    q: "Posso usar meu carro atual como parte do pagamento?",
    a: "Sim. Avaliamos seu veículo gratuitamente e o valor pode ser usado para reduzir a entrada ou o saldo financiado.",
  },
  {
    q: "A simulação do site é o valor final da parcela?",
    a: "Não. É uma estimativa com taxa ilustrativa para você planejar. A taxa e a aprovação final dependem da análise de crédito de cada parceiro financeiro.",
  },
  {
    q: "Preciso ter nome limpo para financiar?",
    a: "Cada instituição tem critérios próprios. Recomendamos simular mesmo com restrições — algumas linhas de crédito têm condições específicas para esse perfil.",
  },
];

export const SELL_STEPS = [
  {
    title: "Conte sobre seu veículo",
    description:
      "Preencha marca, modelo, ano, KM e o estado geral de conservação — leva menos de 2 minutos.",
  },
  {
    title: "Avaliação sem compromisso",
    description:
      "Nossa equipe analisa as informações e fotos e retorna com uma proposta em até 24h úteis.",
  },
  {
    title: "Venda rápida e segura",
    description:
      "Aceitou a proposta? Cuidamos de toda a documentação e o pagamento é feito na hora da entrega.",
  },
];

export const WHY_US = [
  {
    title: "Garantia em todos os veículos",
    description: "Seminovos com garantia de motor e câmbio, 0km com garantia de fábrica.",
  },
  {
    title: "Documentação 100% no seu nome",
    description: "Transferência, vistoria e emplacamento cuidados por nós, sem burocracia.",
  },
  {
    title: "Revisão completa antes da entrega",
    description: "Checklist de mais de 80 itens revisado por nossa equipe técnica.",
  },
  {
    title: "Financiamento facilitado",
    description: "Parceria com as principais financeiras do mercado, aprovação rápida.",
  },
];
