import { APP_NAME } from "./config";

export type ShareResult = "shared" | "copied" | "failed";

export async function shareResult(
  text: string,
  url?: string,
): Promise<ShareResult> {
  if (typeof window === "undefined") return "failed";
  const link = url ?? window.location.origin;

  if (navigator.share) {
    try {
      await navigator.share({ title: APP_NAME, text, url: link });
      return "shared";
    } catch {
      return "failed";
    }
  }

  try {
    await navigator.clipboard.writeText(`${text} ${link}`);
    return "copied";
  } catch {
    return "failed";
  }
}
