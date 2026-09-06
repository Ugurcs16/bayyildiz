import { WHATSAPP_NUMBER } from "./constants";

const WA_BASE = "https://wa.me";

export function buildWhatsAppUrl(
  message: string,
  phone: string = WHATSAPP_NUMBER,
) {
  const text = encodeURIComponent(message);
  return `${WA_BASE}/${phone}?text=${text}`;
}

export const DEFAULT_PRODUCT_MESSAGE =
  "Merhaba, bu ürün hakkında bilgi almak istiyorum";

export function productWhatsAppMessage(displayCode: string, _sku?: string) {
  const code = displayCode.trim() || (_sku ?? "").trim() || "ürün";
  return `Merhaba, ${code} hakkında bilgi almak istiyorum.`;
}
