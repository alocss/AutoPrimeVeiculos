import { PrismaClient, VehicleCondition, Transmission, FuelType, BodyType, VehicleBadge, VehicleStatus } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(new RegExp("[\\u0300-\\u036f]", "g"), "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const PHOTO_ANGLES = [
  "Frente",
  "Traseira",
  "Lateral direita",
  "Lateral esquerda",
  "Interior - bancos",
  "Painel",
  "Porta-malas",
  "Rodas",
];

const PALETTE: Array<[string, string]> = [
  ["e7e7ea", "555555"],
  ["fdecec", "b52424"],
  ["eef2f7", "334155"],
  ["f5f0e6", "6b5b3a"],
  ["eaf3ee", "1e8e5a"],
];

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return h;
}

function photosFor(seed: string) {
  const [bg, fg] = PALETTE[hashSeed(seed) % PALETTE.length];
  return PHOTO_ANGLES.map((angle, i) => ({
    order: i,
    url: `https://placehold.co/1200x800/${bg}/${fg}?text=${encodeURIComponent(`${seed}\n${angle}`)}&font=roboto`,
  }));
}

const COMMON_OPTIONALS = [
  "Ar-condicionado digital",
  "Direção elétrica",
  "Vidros e travas elétricas",
  "Central multimídia com Android Auto/CarPlay",
  "Câmera de ré",
  "Sensor de estacionamento dianteiro e traseiro",
  "Rodas de liga leve",
  "Faróis em LED",
  "Controle de estabilidade e tração",
  "Piloto automático adaptativo",
  "Bancos em couro",
  "Teto solar",
  "Chave presencial",
  "Carregador por indução",
];

function pickOptionals(count: number, offset: number) {
  const list: string[] = [];
  for (let i = 0; i < count; i++) {
    list.push(COMMON_OPTIONALS[(i + offset) % COMMON_OPTIONALS.length]);
  }
  return Array.from(new Set(list));
}

type SeedVehicle = {
  brand: string;
  model: string;
  version: string;
  bodyType: BodyType;
  year: number;
  modelYear: number;
  km: number;
  price: number;
  condition: VehicleCondition;
  transmission: Transmission;
  fuel: FuelType;
  color: string;
  doors: number;
  badge: VehicleBadge;
  featured: boolean;
  /** Months ago this unit was sold (0 = current month). Omit to keep it active in the estoque. */
  soldMonthsAgo?: number;
};

const VEHICLES: SeedVehicle[] = [
  { brand: "Toyota", model: "Corolla", version: "XEi 2.0", bodyType: BodyType.SEDAN, year: 2024, modelYear: 2025, km: 0, price: 168900, condition: VehicleCondition.ZERO_KM, transmission: Transmission.CVT, fuel: FuelType.FLEX, color: "Branco Pérola", doors: 4, badge: VehicleBadge.NOVO, featured: true, soldMonthsAgo: 0 },
  { brand: "Toyota", model: "Hilux", version: "SRX 2.8 4x4", bodyType: BodyType.PICKUP, year: 2022, modelYear: 2023, km: 38500, price: 289900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.AUTOMATICO, fuel: FuelType.DIESEL, color: "Prata", doors: 4, badge: VehicleBadge.DESTAQUE, featured: true },
  { brand: "Toyota", model: "SW4", version: "SRX 2.8 4x4", bodyType: BodyType.SUV, year: 2021, modelYear: 2022, km: 52000, price: 349900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.AUTOMATICO, fuel: FuelType.DIESEL, color: "Preto", doors: 4, badge: VehicleBadge.NONE, featured: false },
  { brand: "Toyota", model: "Yaris", version: "XLS 1.5", bodyType: BodyType.HATCH, year: 2023, modelYear: 2023, km: 21000, price: 94900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.CVT, fuel: FuelType.FLEX, color: "Vermelho", doors: 4, badge: VehicleBadge.NONE, featured: false },
  { brand: "Honda", model: "Civic", version: "Touring 1.5 Turbo", bodyType: BodyType.SEDAN, year: 2024, modelYear: 2025, km: 0, price: 189900, condition: VehicleCondition.ZERO_KM, transmission: Transmission.CVT, fuel: FuelType.FLEX, color: "Cinza Modern Steel", doors: 4, badge: VehicleBadge.NOVO, featured: true, soldMonthsAgo: 0 },
  { brand: "Honda", model: "HR-V", version: "EXL 1.5 Turbo", bodyType: BodyType.SUV, year: 2023, modelYear: 2023, km: 18000, price: 159900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.CVT, fuel: FuelType.FLEX, color: "Branco", doors: 4, badge: VehicleBadge.DESTAQUE, featured: true, soldMonthsAgo: 0 },
  { brand: "Honda", model: "City", version: "Sedan EXL 1.5", bodyType: BodyType.SEDAN, year: 2022, modelYear: 2022, km: 34000, price: 104900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.CVT, fuel: FuelType.FLEX, color: "Prata", doors: 4, badge: VehicleBadge.NONE, featured: false },
  { brand: "Honda", model: "Fit", version: "EXL 1.5", bodyType: BodyType.HATCH, year: 2020, modelYear: 2021, km: 61000, price: 79900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.CVT, fuel: FuelType.FLEX, color: "Azul", doors: 4, badge: VehicleBadge.NONE, featured: false },
  { brand: "Volkswagen", model: "T-Cross", version: "Highline 1.4 TSI", bodyType: BodyType.SUV, year: 2024, modelYear: 2025, km: 0, price: 154900, condition: VehicleCondition.ZERO_KM, transmission: Transmission.AUTOMATICO, fuel: FuelType.FLEX, color: "Cinza Platinum", doors: 4, badge: VehicleBadge.NOVO, featured: true, soldMonthsAgo: 0 },
  { brand: "Volkswagen", model: "Nivus", version: "Highline 1.0 TSI", bodyType: BodyType.SUV, year: 2023, modelYear: 2023, km: 15500, price: 119900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.AUTOMATICO, fuel: FuelType.FLEX, color: "Laranja Sunset", doors: 4, badge: VehicleBadge.DESTAQUE, featured: true, soldMonthsAgo: 1 },
  { brand: "Volkswagen", model: "Polo", version: "GTS 1.4 TSI", bodyType: BodyType.HATCH, year: 2022, modelYear: 2022, km: 29000, price: 109900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.AUTOMATICO, fuel: FuelType.FLEX, color: "Preto", doors: 4, badge: VehicleBadge.NONE, featured: false, soldMonthsAgo: 1 },
  { brand: "Volkswagen", model: "Amarok", version: "V6 Highline 3.0", bodyType: BodyType.PICKUP, year: 2024, modelYear: 2025, km: 0, price: 379900, condition: VehicleCondition.ZERO_KM, transmission: Transmission.AUTOMATICO, fuel: FuelType.DIESEL, color: "Branco Cristal", doors: 4, badge: VehicleBadge.NOVO, featured: false },
  { brand: "Jeep", model: "Compass", version: "Limited 1.3 Turbo", bodyType: BodyType.SUV, year: 2023, modelYear: 2023, km: 24000, price: 179900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.AUTOMATICO, fuel: FuelType.FLEX, color: "Vermelho Colorado", doors: 4, badge: VehicleBadge.DESTAQUE, featured: true, soldMonthsAgo: 0 },
  { brand: "Jeep", model: "Renegade", version: "Longitude 1.3 Turbo", bodyType: BodyType.SUV, year: 2022, modelYear: 2022, km: 41000, price: 114900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.AUTOMATICO, fuel: FuelType.FLEX, color: "Cinza Granite", doors: 4, badge: VehicleBadge.NONE, featured: false },
  { brand: "Jeep", model: "Commander", version: "Overland 2.0 Turbo Diesel", bodyType: BodyType.SUV, year: 2024, modelYear: 2025, km: 0, price: 329900, condition: VehicleCondition.ZERO_KM, transmission: Transmission.AUTOMATICO, fuel: FuelType.DIESEL, color: "Preto Carbon", doors: 4, badge: VehicleBadge.NOVO, featured: true },
  { brand: "Nissan", model: "Kicks", version: "SV 1.6", bodyType: BodyType.SUV, year: 2023, modelYear: 2023, km: 19500, price: 116900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.CVT, fuel: FuelType.FLEX, color: "Prata", doors: 4, badge: VehicleBadge.NONE, featured: false, soldMonthsAgo: 0 },
  { brand: "Nissan", model: "Versa", version: "Advance 1.6", bodyType: BodyType.SEDAN, year: 2022, modelYear: 2022, km: 33000, price: 89900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.CVT, fuel: FuelType.FLEX, color: "Branco", doors: 4, badge: VehicleBadge.NONE, featured: false, soldMonthsAgo: 1 },
  { brand: "Nissan", model: "Frontier", version: "LE 2.3 Turbo Diesel", bodyType: BodyType.PICKUP, year: 2021, modelYear: 2022, km: 58000, price: 249900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.AUTOMATICO, fuel: FuelType.DIESEL, color: "Cinza", doors: 4, badge: VehicleBadge.NONE, featured: false },
  { brand: "Hyundai", model: "Creta", version: "Ultimate 1.0 Turbo", bodyType: BodyType.SUV, year: 2024, modelYear: 2025, km: 0, price: 164900, condition: VehicleCondition.ZERO_KM, transmission: Transmission.AUTOMATICO, fuel: FuelType.FLEX, color: "Azul Ta Blue", doors: 4, badge: VehicleBadge.NOVO, featured: true },
  { brand: "Hyundai", model: "HB20S", version: "Platinum 1.0 Turbo", bodyType: BodyType.SEDAN, year: 2023, modelYear: 2023, km: 22000, price: 99900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.AUTOMATICO, fuel: FuelType.FLEX, color: "Vermelho", doors: 4, badge: VehicleBadge.NONE, featured: false },
  { brand: "Fiat", model: "Toro", version: "Volcano 2.0 Turbo Diesel", bodyType: BodyType.PICKUP, year: 2022, modelYear: 2022, km: 45000, price: 179900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.AUTOMATICO, fuel: FuelType.DIESEL, color: "Cinza", doors: 4, badge: VehicleBadge.DESTAQUE, featured: true, soldMonthsAgo: 0 },
  { brand: "Fiat", model: "Pulse", version: "Impetus 1.0 Turbo", bodyType: BodyType.SUV, year: 2023, modelYear: 2023, km: 17000, price: 104900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.AUTOMATICO, fuel: FuelType.FLEX, color: "Branco", doors: 4, badge: VehicleBadge.NONE, featured: false },
  { brand: "Chevrolet", model: "Tracker", version: "Premier 1.0 Turbo", bodyType: BodyType.SUV, year: 2023, modelYear: 2023, km: 20500, price: 124900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.AUTOMATICO, fuel: FuelType.FLEX, color: "Preto", doors: 4, badge: VehicleBadge.NONE, featured: false, soldMonthsAgo: 0 },
  { brand: "Chevrolet", model: "Onix Plus", version: "Premier 1.0 Turbo", bodyType: BodyType.SEDAN, year: 2022, modelYear: 2022, km: 31000, price: 84900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.AUTOMATICO, fuel: FuelType.FLEX, color: "Prata", doors: 4, badge: VehicleBadge.NONE, featured: false },
  { brand: "Volvo", model: "XC60", version: "Inscription B5 Híbrido", bodyType: BodyType.SUV, year: 2024, modelYear: 2025, km: 0, price: 459900, condition: VehicleCondition.ZERO_KM, transmission: Transmission.AUTOMATICO, fuel: FuelType.HIBRIDO, color: "Preto Onyx", doors: 4, badge: VehicleBadge.NOVO, featured: true },
  { brand: "Peugeot", model: "2008", version: "Griffe 1.6 Turbo", bodyType: BodyType.SUV, year: 2022, modelYear: 2022, km: 27000, price: 109900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.AUTOMATICO, fuel: FuelType.FLEX, color: "Cinza Artense", doors: 4, badge: VehicleBadge.NONE, featured: false },
  // Unidades extras vendidas — só para popular o histórico de vendas do dashboard com um modelo repetido.
  { brand: "Toyota", model: "Corolla", version: "GLi 2.0", bodyType: BodyType.SEDAN, year: 2022, modelYear: 2022, km: 41000, price: 129900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.CVT, fuel: FuelType.FLEX, color: "Prata", doors: 4, badge: VehicleBadge.NONE, featured: false, soldMonthsAgo: 0 },
  { brand: "Toyota", model: "Corolla", version: "Altis Hybrid 1.8", bodyType: BodyType.SEDAN, year: 2023, modelYear: 2023, km: 22000, price: 159900, condition: VehicleCondition.SEMINOVO, transmission: Transmission.CVT, fuel: FuelType.HIBRIDO, color: "Preto", doors: 4, badge: VehicleBadge.NONE, featured: false, soldMonthsAgo: 0 },
];

function descriptionFor(v: SeedVehicle): string {
  const conditionText =
    v.condition === "ZERO_KM"
      ? "0km, direto de fábrica, com garantia do fabricante e pronto para emplacar no seu nome."
      : `seminovo com ${v.km.toLocaleString("pt-BR")} km rodados, único dono, revisado e com garantia AutoPrime.`;
  return `${v.brand} ${v.model} ${v.version} ${conditionText} Veículo revisado em nossa oficina, documentação em dia e pronto para transferência imediata. Agende uma visita ou fale com nosso time pelo WhatsApp para tirar todas as suas dúvidas.`;
}

function soldAtFromMonthsAgo(monthsAgo: number): Date {
  const now = new Date();
  const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthsAgo, 12));
  return date;
}

async function main() {
  console.log("Limpando dados existentes...");
  await prisma.lead.deleteMany();
  await prisma.vehiclePhoto.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.testimonial.deleteMany();

  console.log(`Semeando ${VEHICLES.length} veículos...`);
  for (const [index, v] of VEHICLES.entries()) {
    const slug = slugify(`${v.brand}-${v.model}-${v.version}-${v.modelYear}`);
    await prisma.vehicle.create({
      data: {
        slug,
        brand: v.brand,
        model: v.model,
        version: v.version,
        year: v.year,
        modelYear: v.modelYear,
        km: v.km,
        price: v.price,
        condition: v.condition,
        transmission: v.transmission,
        fuel: v.fuel,
        bodyType: v.bodyType,
        color: v.color,
        doors: v.doors,
        plateEnding: index % 10,
        renavam: `${10000000000 + index * 137}`,
        badge: v.badge,
        featured: v.featured,
        status: v.soldMonthsAgo !== undefined ? VehicleStatus.SOLD : VehicleStatus.ACTIVE,
        soldAt: v.soldMonthsAgo !== undefined ? soldAtFromMonthsAgo(v.soldMonthsAgo) : null,
        description: descriptionFor(v),
        optionals: pickOptionals(6 + (index % 4), index),
        photos: {
          create: photosFor(`${v.brand} ${v.model} ${v.version}`),
        },
      },
    });
  }

  console.log("Semeando depoimentos...");
  const testimonials = [
    { name: "Marina Souza", role: "Comprou um Honda HR-V", quote: "Processo todo transparente, do teste-drive até a entrega. Financiamento aprovado em menos de 24h.", rating: 5, avatarUrl: "https://i.pravatar.cc/150?u=marina-souza" },
    { name: "Ricardo Almeida", role: "Comprou um Toyota Hilux", quote: "Comprei minha Hilux seminova e veio impecável, exatamente como no anúncio. Equipe muito atenciosa.", rating: 5, avatarUrl: "https://i.pravatar.cc/150?u=ricardo-almeida" },
    { name: "Fernanda Lima", role: "Vendeu seu Volkswagen Polo", quote: "Vendi meu carro em 2 dias, avaliação justa e pagamento na hora. Recomendo muito.", rating: 5, avatarUrl: "https://i.pravatar.cc/150?u=fernanda-lima" },
    { name: "Bruno Carvalho", role: "Comprou um Jeep Compass", quote: "Simulei o financiamento pelo site e já saí com tudo pronto. Atendimento nota 10.", rating: 4, avatarUrl: "https://i.pravatar.cc/150?u=bruno-carvalho" },
    { name: "Juliana Ferreira", role: "Comprou um Hyundai Creta 0km", quote: "Melhor experiência de compra de carro que já tive. Documentação toda resolvida por eles.", rating: 5, avatarUrl: "https://i.pravatar.cc/150?u=juliana-ferreira" },
    { name: "Carlos Eduardo", role: "Comprou um Chevrolet Onix Plus", quote: "Preço justo, carro revisado e sem dor de cabeça com burocracia. Voltarei a comprar aqui.", rating: 4, avatarUrl: "https://i.pravatar.cc/150?u=carlos-eduardo" },
  ];
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }

  console.log("Seed concluído.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
