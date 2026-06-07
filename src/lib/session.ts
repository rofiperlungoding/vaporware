// Anonymous, per-browser session id. No login required (low friction is the point).
const KEY = "vaporware_session";

export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = `s-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(KEY, id);
  }
  return id;
}
