import "server-only";

/** Trusted platform IPs only. Never copy a browser-supplied X-Forwarded-For. */
export function trustedClientIp(request: Request): string | undefined {
  const vercel = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (vercel) return vercel;

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return undefined;
}

function requestHost(request: Request): string {
  return (request.headers.get("host") ?? "").toLowerCase();
}

function hostnameFromOrigin(origin: string): string | null {
  try {
    return new URL(origin).host.toLowerCase();
  } catch {
    return null;
  }
}

const KNOWN_HOSTS = new Set([
  "bayyildiz.com",
  "www.bayyildiz.com",
  "bayyildiz.vercel.app",
]);

export function isAllowedMutationOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")?.trim();
  if (!origin) {
    return true;
  }

  const originHost = hostnameFromOrigin(origin);
  if (!originHost) {
    return false;
  }

  const host = requestHost(request);
  if (host && originHost === host) {
    return true;
  }

  try {
    const hostname = new URL(origin).hostname.toLowerCase();
    if (KNOWN_HOSTS.has(hostname)) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

