"use client";

import { useEffect } from "react";
import { useCart } from "@/components/providers/cart-context";

const STORAGE_PREFIX = "bayyildiz-cart-cleared-v1:";

export function CartClearOnPaid({
  orderId,
  paid,
}: {
  orderId?: string;
  paid: boolean;
}) {
  const { clear } = useCart();

  useEffect(() => {
    if (!paid) return;
    const key = `${STORAGE_PREFIX}${orderId || "paid"}`;
    try {
      if (sessionStorage.getItem(key) === "1") {
        return;
      }
      sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage may be unavailable; still clear once this mount.
    }
    clear();
  }, [clear, orderId, paid]);

  return null;
}
