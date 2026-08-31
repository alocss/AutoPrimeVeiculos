import type { NextRequest } from "next/server";

type Bucket = { count: number; resetAt: number };

// In-memory sliding-window limiter. Correct for a single Node process; it resets on
// restart and does not coordinate across multiple instances. If this app is ever
// scaled horizontally (more than one running instance behind a load balancer),
// swap this Map for a shared store (e.g. Redis / Upstash) so limits are enforced
// consistently across instances.
const buckets = new Map<string, Bucket>();

// Periodically drop expired buckets so this Map can't grow unbounded.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, 60_000).unref?.();

export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Returns { allowed: false } once `limit` calls for the same key happen within
 * `windowMs`. Callers key this by IP (+ optionally route name) so different
 * endpoints track independent limits.
 */
export function rateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
