import { NextRequest, NextResponse } from "next/server";
import { adminLoginSchema } from "@/lib/validations";
import { ADMIN_COOKIE_NAME, ADMIN_SESSION_MAX_AGE, createAdminSessionToken } from "@/lib/auth";
import { verifyAdminCredentials } from "@/lib/admin-credentials";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { logSecurityEvent } from "@/lib/security-log";

const LOGIN_ATTEMPT_LIMIT = 5;
const LOGIN_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed, retryAfterSeconds } = rateLimit(`admin_login:${ip}`, LOGIN_ATTEMPT_LIMIT, LOGIN_WINDOW_MS);

  if (!allowed) {
    logSecurityEvent("admin_login_rate_limited", { ip, retryAfterSeconds });
    return NextResponse.json(
      { error: "Muitas tentativas de login. Tente novamente em alguns minutos." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = adminLoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Informe e-mail e senha válidos" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  if (!verifyAdminCredentials(email, password)) {
    logSecurityEvent("admin_login_failure", { ip, email });
    return NextResponse.json({ error: "E-mail ou senha incorretos" }, { status: 401 });
  }

  logSecurityEvent("admin_login_success", { ip, email });

  const token = await createAdminSessionToken(email);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ADMIN_SESSION_MAX_AGE,
    path: "/",
  });
  return response;
}
