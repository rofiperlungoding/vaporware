import "server-only";

const CAP = 8;
const REFILL_PER_MS = CAP / 60000;
const buckets = new Map<string, { tokens: number; updated: number }>();

export function allow(key: string): boolean {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: CAP, updated: now };
  const elapsed = now - b.updated;
  b.tokens = Math.min(CAP, b.tokens + elapsed * REFILL_PER_MS);
  b.updated = now;
  if (b.tokens < 1) {
    buckets.set(key, b);
    return false;
  }
  b.tokens -= 1;
  buckets.set(key, b);
  return true;
}

const TTL_MS = 5 * 60000;
const cache = new Map<string, { value: unknown; exp: number }>();

export function cacheGet<T>(key: string): T | null {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() > e.exp) {
    cache.delete(key);
    return null;
  }
  return e.value as T;
}

export function cacheSet(key: string, value: unknown): void {
  cache.set(key, { value, exp: Date.now() + TTL_MS });
}

export function hashKey(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  }
  return h.toString(36);
}

export function sanitizeText(input: string, max: number): string {
  return input
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

export function clientKey(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return (
    request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-real-ip") ??
    "anon"
  );
}
