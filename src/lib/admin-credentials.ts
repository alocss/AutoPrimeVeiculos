// Node-only (uses node:crypto via ./password). Import this from API routes, which run
// on the Node.js runtime — never from middleware.ts, which runs on the Edge Runtime and
// cannot load node:crypto. Session token creation/verification (Edge-safe) lives in ./auth.
import { constantTimeEqual, verifyPassword } from "@/lib/password";

export function verifyAdminCredentials(email: string, password: string): boolean {
  const validEmail = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!validEmail || !passwordHash) return false;

  // Both checks always run (no early return) and use constant-time comparisons,
  // so a wrong email vs. a wrong password take the same time and leak nothing.
  const emailOk = constantTimeEqual(email, validEmail);
  const passwordOk = verifyPassword(password, passwordHash);
  return emailOk && passwordOk;
}
