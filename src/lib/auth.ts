import { SignJWT, jwtVerify } from "jose";
import type { NextRequest } from "next/server";

// verifyAdminCredentials lives in ./admin-credentials.ts (Node-only, uses node:crypto),
// deliberately NOT imported here — this file is pulled into middleware.ts, which runs
// on the Edge Runtime and doesn't support node:crypto. jose's JWT functions are the
// only crypto this file needs, and jose is Edge-safe.

export const ADMIN_COOKIE_NAME = "autoprime_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8h shift

const MIN_SESSION_SECRET_LENGTH = 32;

function getSecretKey() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set");
  }
  if (secret.length < MIN_SESSION_SECRET_LENGTH) {
    throw new Error(
      `ADMIN_SESSION_SECRET must be at least ${MIN_SESSION_SECRET_LENGTH} characters long. ` +
        `Generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`,
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createAdminSessionToken(email: string): Promise<string> {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyAdminSessionToken(token: string): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.role !== "admin" || typeof payload.email !== "string") return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export const ADMIN_SESSION_MAX_AGE = SESSION_DURATION_SECONDS;

export async function requireAdmin(request: NextRequest): Promise<{ email: string } | null> {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminSessionToken(token);
}
