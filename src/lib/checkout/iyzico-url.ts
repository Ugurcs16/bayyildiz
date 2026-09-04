const ALLOWED_HOSTS = new Set([
  "sandbox-cpp.iyzipay.com",
  "cpp.iyzipay.com",
]);

export function isAllowedIyzicoCheckoutUrl(value: string | undefined): value is string {
  if (!value) {
    return false;
  }
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      return false;
    }
    return ALLOWED_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}
