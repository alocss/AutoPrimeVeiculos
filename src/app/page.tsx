import { Hero } from "@/components/home/Hero";
import { BrandsCarousel } from "@/components/home/BrandsCarousel";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { ConditionsSection } from "@/components/home/ConditionsSection";
import { VehiclesCarousel } from "@/components/home/VehiclesCarousel";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyUs } from "@/components/home/WhyUs";
import { getFeaturedVehicles, getLatestVehicles, getFilterFacets } from "@/lib/vehicles";
import { prisma } from "@/lib/prisma";

// Forced dynamic (rather than static + ISR) so this page never needs a live database
// connection during `docker build` — see Dockerfile / README for why that matters.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, latest, testimonials, facets] = await Promise.all([
    getFeaturedVehicles(8),
    getLatestVehicles(10),
    prisma.testimonial.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    getFilterFacets(),
  ]);

  return (
    <>
      <Hero models={facets.models} />
      <BrandsCarousel />
      <FeaturedGrid vehicles={featured} />
      <ConditionsSection />
      <VehiclesCarousel vehicles={latest} />
      <Testimonials testimonials={testimonials} />
      <WhyUs />
    </>
  );
}
