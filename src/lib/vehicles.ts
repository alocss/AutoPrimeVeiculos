import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { VehicleFilters } from "@/types/vehicle";

const PAGE_SIZE = 12;

function buildWhere(filters: VehicleFilters): Prisma.VehicleWhereInput {
  const where: Prisma.VehicleWhereInput = { status: "ACTIVE" };

  if (filters.q) {
    where.OR = [
      { brand: { contains: filters.q, mode: "insensitive" } },
      { model: { contains: filters.q, mode: "insensitive" } },
      { version: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  if (filters.brand) where.brand = filters.brand;
  if (filters.model) where.model = filters.model;
  if (filters.condition) where.condition = filters.condition as Prisma.EnumVehicleConditionFilter["equals"];
  if (filters.transmission) where.transmission = filters.transmission as Prisma.EnumTransmissionFilter["equals"];
  if (filters.fuel) where.fuel = filters.fuel as Prisma.EnumFuelTypeFilter["equals"];
  if (filters.bodyType) where.bodyType = filters.bodyType as Prisma.EnumBodyTypeFilter["equals"];
  if (filters.color) where.color = { equals: filters.color, mode: "insensitive" };
  if (filters.yearMin || filters.yearMax) {
    where.year = {
      ...(filters.yearMin ? { gte: filters.yearMin } : {}),
      ...(filters.yearMax ? { lte: filters.yearMax } : {}),
    };
  }
  if (filters.priceMin || filters.priceMax) {
    where.price = {
      ...(filters.priceMin ? { gte: filters.priceMin } : {}),
      ...(filters.priceMax ? { lte: filters.priceMax } : {}),
    };
  }
  if (filters.kmMax) where.km = { lte: filters.kmMax };

  return where;
}

function buildOrderBy(sort?: VehicleFilters["sort"]): Prisma.VehicleOrderByWithRelationInput {
  switch (sort) {
    case "price-asc":
      return { price: "asc" };
    case "price-desc":
      return { price: "desc" };
    case "newest":
      return { createdAt: "desc" };
    default:
      return { featured: "desc" };
  }
}

export async function getVehicles(filters: VehicleFilters) {
  const where = buildWhere(filters);
  const orderBy = buildOrderBy(filters.sort);
  const page = filters.page && filters.page > 0 ? filters.page : 1;

  const [items, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      orderBy: [orderBy, { createdAt: "desc" }],
      include: { photos: { orderBy: { order: "asc" }, take: 1 } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.vehicle.count({ where }),
  ]);

  return { items, total, page, pageSize: PAGE_SIZE, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getFeaturedVehicles(limit = 8) {
  return prisma.vehicle.findMany({
    where: { featured: true, status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
    take: limit,
  });
}

export async function getLatestVehicles(limit = 10) {
  return prisma.vehicle.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
    take: limit,
  });
}

export async function getVehicleBySlug(slug: string) {
  return prisma.vehicle.findUnique({
    where: { slug },
    include: { photos: { orderBy: { order: "asc" } } },
  });
}

export async function getSimilarVehicles(vehicle: { id: string; brand: string; bodyType: string }, limit = 6) {
  return prisma.vehicle.findMany({
    where: {
      id: { not: vehicle.id },
      status: "ACTIVE",
      OR: [{ brand: vehicle.brand }, { bodyType: vehicle.bodyType as never }],
    },
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
    take: limit,
  });
}

export async function getAllVehicleSlugs() {
  return prisma.vehicle.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true } });
}

export async function getFilterFacets() {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: "ACTIVE" },
    select: { brand: true, model: true, color: true, year: true, price: true },
  });
  const brands = Array.from(new Set(vehicles.map((v) => v.brand))).sort();
  const models = Array.from(new Set(vehicles.map((v) => v.model))).sort();
  const colors = Array.from(new Set(vehicles.map((v) => v.color))).sort();
  const years = vehicles.map((v) => v.year);
  const prices = vehicles.map((v) => v.price);
  return {
    brands,
    models,
    colors,
    yearRange: [Math.min(...years, 1990), Math.max(...years, 2025)] as [number, number],
    priceRange: [Math.min(...prices, 0), Math.max(...prices, 500000)] as [number, number],
  };
}
