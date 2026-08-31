import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { vehicleFormSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get("ids");
  if (!ids) {
    return NextResponse.json({ error: "Parâmetro 'ids' é obrigatório" }, { status: 400 });
  }

  const idList = ids.split(",").filter(Boolean);
  if (idList.length === 0) return NextResponse.json({ vehicles: [] });

  const vehicles = await prisma.vehicle.findMany({
    where: { id: { in: idList } },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json({ vehicles });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = vehicleFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { soldAt, photos, ...data } = parsed.data;
  const baseSlug = slugify(`${data.brand}-${data.model}-${data.version}-${data.modelYear}`);
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.vehicle.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      ...data,
      slug,
      soldAt: data.status === "SOLD" ? new Date(soldAt ?? Date.now()) : null,
      photos: {
        create: photos.map((url, index) => ({ url, order: index })),
      },
    },
  });

  return NextResponse.json({ id: vehicle.id, slug: vehicle.slug }, { status: 201 });
}
