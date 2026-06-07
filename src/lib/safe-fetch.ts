export type SafeResult<T> = { ok: true; data: T } | { ok: false };

export async function safeFetch<T>(
  url: string,
  init?: RequestInit,
  opts?: { timeoutMs?: number; retries?: number },
): Promise<SafeResult<T>> {
  const timeoutMs = opts?.timeoutMs ?? 6000;
  const retries = opts?.retries ?? 1;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(timer);
      if (res.status >= 500) continue;
      if (!res.ok) return { ok: false };
      const data = (await res.json()) as T;
      return { ok: true, data };
    } catch {
      clearTimeout(timer);
    }
  }
  return { ok: false };
}
