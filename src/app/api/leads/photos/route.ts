import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security-log";
import { saveUploadedFile } from "@/lib/storage";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;
const MAX_FILES = 6;
const UPLOAD_LIMIT = 20;
const UPLOAD_WINDOW_MS = 10 * 60 * 1000;

// Public, unauthenticated upload used by SellForm — sellers aren't logged in, unlike
// /api/upload which requires an admin session for cataloging vehicle photos.
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed, retryAfterSeconds } = rateLimit(`lead_photo_upload:${ip}`, UPLOAD_LIMIT, UPLOAD_WINDOW_MS);

  if (!allowed) {
    logSecurityEvent("lead_photo_rate_limited", { ip, retryAfterSeconds });
    return NextResponse.json(
      { error: "Muitos envios em pouco tempo. Tente novamente em alguns minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Requisição inválida" }, { status: 400 });

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `Envie no máximo ${MAX_FILES} fotos` }, { status: 400 });
  }
  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Formato inválido. Envie JPG, PNG ou WebP." }, { status: 400 });
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "Arquivo muito grande (máx. 8MB)." }, { status: 400 });
    }
  }

  try {
    const urls: string[] = [];
    for (const file of files) {
      const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
      const filename = `${randomUUID()}.${extension}`;
      urls.push(await saveUploadedFile(file, "sell", filename));
    }
    return NextResponse.json({ urls }, { status: 201 });
  } catch (error) {
    console.error("lead photo upload failed", error);
    return NextResponse.json({ error: "Falha ao salvar as fotos. Tente novamente." }, { status: 500 });
  }
}
