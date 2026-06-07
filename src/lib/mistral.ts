import "server-only";

export class MistralUnavailable extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MistralUnavailable";
  }
}

const ENDPOINT = "https://api.mistral.ai/v1/chat/completions";
const MODEL = "mistral-small-latest";
const TIMEOUT_MS = 4000;

type CallArgs = { system: string; user: string };

export async function callMistral<T = unknown>({
  system,
  user,
}: CallArgs): Promise<T> {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) throw new MistralUnavailable("missing key");

  const body = JSON.stringify({
    model: MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user.slice(0, 4000) },
    ],
    temperature: 0.7,
    max_tokens: 240,
    response_format: { type: "json_object" },
  });

  let lastError = "unavailable";

  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.status >= 500) {
        lastError = `mistral ${res.status}`;
        continue;
      }
      if (!res.ok) throw new MistralUnavailable(`mistral ${res.status}`);

      const data = (await res.json()) as {
        choices?: { message?: { content?: unknown } }[];
      };
      const content = data?.choices?.[0]?.message?.content;
      if (typeof content !== "string") throw new MistralUnavailable("no content");

      try {
        return JSON.parse(content) as T;
      } catch {
        throw new MistralUnavailable("bad json");
      }
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof MistralUnavailable) throw err;
      lastError = err instanceof Error ? err.message : "network";
    }
  }

  throw new MistralUnavailable(lastError);
}
