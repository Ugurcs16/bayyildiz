export function safeReturnPath(value: unknown, fallback = "/hesabim"): string {
  if (typeof value !== "string") return fallback;
  const path = value.trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("://")) {
    return fallback;
  }
  if (path.includes("\\") || path.includes("\n") || path.includes("\r")) {
    return fallback;
  }
  return path;
}
