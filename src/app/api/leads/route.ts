import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security-log";

const leadSchema = z.object({
  type: z.enum(["FINANCING", "SELL", "CONTACT", "INTEREST"]),
  name: z.string().min(2).max(200),
  email: z.string().email().max(200),
  phone: z.string().min(8).max(30),
  message: z.string().max(5000).optional(),
  vehicleId: z.string().max(100).optional(),
  payload: z.record(z.unknown()).optional(),
});

const LEAD_SUBMISSION_LIMIT = 10;
const LEAD_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_PAYLOAD_JSON_BYTES = 20_000;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed, retryAfterSeconds } = rateLimit(`lead_submit:${ip}`, LEAD_SUBMISSION_LIMIT, LEAD_WINDOW_MS);

  if (!allowed) {
    logSecurityEvent("lead_rate_limited", { ip, retryAfterSeconds });
    return NextResponse.json(
      { error: "Muitos envios em pouco tempo. Tente novamente em alguns minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = leadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { type, name, email, phone, message, vehicleId, payload } = parsed.data;

  const serializedPayload = payload ? JSON.stringify(payload) : null;
  if (serializedPayload && serializedPayload.length > MAX_PAYLOAD_JSON_BYTES) {
    return NextResponse.json({ error: "Dados enviados excedem o tamanho permitido" }, { status: 413 });
  }

  const lead = await prisma.lead.create({
    data: {
      type,
      name,
      email,
      phone,
      message,
      vehicleId,
      payload: serializedPayload ? JSON.parse(serializedPayload) : undefined,
    },
  });
  return NextResponse.json({ id: lead.id }, { status: 201 });
}
