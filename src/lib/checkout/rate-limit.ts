type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

const LIMIT = {
  createOrder: 20,
  initializePayment: 20,
  place: 20,
  result: 60,
} as const;

const WINDOW_MS = 15 * 60 * 1000;

export type CheckoutRateAction = keyof typeof LIMIT;

export function resetCheckoutRateLimits(): void {
  buckets.clear();
}

export function consumeCheckoutRateLimit(action: CheckoutRateAction, key: string): boolean {
  const now = Date.now();
  if (buckets.size > 2000) {
    for (const [id, bucket] of buckets) {
      if (bucket.resetAt <= now) {
        buckets.delete(id);
      }
    }
  }
  const bucketKey = `${action}:${key}`;
  const existing = buckets.get(bucketKey);
  if (!existing || existing.resetAt <= now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (existing.count >= LIMIT[action]) {
    return false;
  }
  existing.count += 1;
  return true;
}

export function checkoutClientIp(request: Request): string {
  const vercel = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim();
  if (vercel) return vercel;
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}
