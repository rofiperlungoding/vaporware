// Share helper: uses the native Web Share sheet on mobile, falls back to copying
// to the clipboard everywhere else. Returns what happened so the UI can react.
import { APP_NAME } from "./config";

export type ShareResult = "shared" | "copied" | "failed";

export async function shareResult(text: string): Promise<ShareResult> {
  if (typeof window === "undefined") return "failed";
  const url = window.location.origin;

  if (navigator.share) {
    try {
      await navigator.share({ title: APP_NAME, text, url });
      return "shared";
    } catch {
      // user cancelled or share failed — fall through to copy
    }
  }

  try {
    await navigator.clipboard.writeText(`${text} ${url}`);
    return "copied";
  } catch {
    return "failed";
  }
}
