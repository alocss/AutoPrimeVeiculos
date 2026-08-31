import Image from "next/image";
import Link from "next/link";
import { placeholderPhotoUrl } from "@/lib/placeholder";

const CATEGORIES = [
  { label: "SUVs", bodyType: "SUV", count: "Compass, HR-V, Creta e mais" },
  { label: "Sedãs", bodyType: "SEDAN", count: "Corolla, Civic, Onix Plus e mais" },
  { label: "Picapes", bodyType: "PICKUP", count: "Hilux, Amarok, Toro e mais" },
  { label: "Hatches", bodyType: "HATCH", count: "Yaris, Fit, Polo e mais" },
];

export function CategoriesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h2 className="font-display text-3xl font-bold tracking-tighter text-ink-900">Navegue por categoria</h2>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.bodyType}
            href={`/estoque?bodyType=${cat.bodyType}`}
            className="group relative flex h-56 flex-col justify-end overflow-hidden rounded-card"
          >
            <Image
              src={placeholderPhotoUrl(cat.bodyType, cat.label, "800x600")}
              alt={cat.label}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="relative p-5">
              <p className="font-display text-xl font-bold text-white">{cat.label}</p>
              <p className="mt-1 text-sm text-white/75">{cat.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
