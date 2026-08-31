import Image from "next/image";
import type { Testimonial } from "@prisma/client";
import { StarRating } from "@/components/ui/StarRating";
import { ScrollCarousel } from "@/components/ui/ScrollCarousel";

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;

  return (
    <section className="bg-ink-900 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold tracking-tighter text-white">Quem comprou, recomenda</h2>
        <ScrollCarousel className="mt-8" itemClassName="w-[300px] shrink-0 sm:w-[340px]">
          {testimonials.map((t) => (
            <figure key={t.id} className="flex h-full flex-col rounded-card bg-white/[0.06] p-6 ring-1 ring-white/10">
              <StarRating rating={t.rating} />
              <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-white/85">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                {t.avatarUrl ? (
                  <Image
                    src={t.avatarUrl}
                    alt={t.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : null}
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  {t.role ? <p className="text-xs text-white/55">{t.role}</p> : null}
                </div>
              </figcaption>
            </figure>
          ))}
        </ScrollCarousel>
      </div>
    </section>
  );
}
