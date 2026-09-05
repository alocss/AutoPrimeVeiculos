// Minimal, dependency-free security event log. Never pass password/token values in `meta` —
// only outcome metadata (email, ip, reason). Writes to stdout so it is captured by whatever
// the deployment platform already collects (Docker logs, host log aggregator, etc.).
type SecurityEvent =
  | "admin_login_success"
  | "admin_login_failure"
  | "admin_login_rate_limited"
  | "lead_rate_limited"
  | "lead_photo_rate_limited";

export function logSecurityEvent(event: SecurityEvent, meta: Record<string, string | number | undefined>) {
  const entry = {
    level: "security",
    event,
    time: new Date().toISOString(),
    ...meta,
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(entry));
}
