import { randomBytes } from "node:crypto";
import "server-only";

import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import {
  CHECKOUT_ACCESS_COOKIE,
  CHECKOUT_IDEMPOTENCY_COOKIE,
  parseCheckoutAccessCookie,
  parseIdempotencyCookie,
  serializeCheckoutAccessCookie,
  serializeIdempotencyCookie,
  type CheckoutAccessCookie,
  type CheckoutIdempotencyCookie,
} from "@/lib/checkout/access";

const CHECKOUT_TTL_MS = 2 * 60 * 60 * 1000;

function cookieOptions(expires: Date) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  };
}

export function applyCheckoutAccessCookie(
  response: NextResponse,
  value: CheckoutAccessCookie,
): void {
  response.cookies.set(
    CHECKOUT_ACCESS_COOKIE,
    serializeCheckoutAccessCookie(value),
    cookieOptions(new Date(Date.now() + CHECKOUT_TTL_MS)),
  );
}

export function applyIdempotencyCookie(
  response: NextResponse,
  value: CheckoutIdempotencyCookie,
): void {
  response.cookies.set(
    CHECKOUT_IDEMPOTENCY_COOKIE,
    serializeIdempotencyCookie(value),
    cookieOptions(new Date(Date.now() + CHECKOUT_TTL_MS)),
  );
}

export function clearCheckoutCookies(response: NextResponse): void {
  const expired = cookieOptions(new Date(0));
  response.cookies.set(CHECKOUT_ACCESS_COOKIE, "", { ...expired, maxAge: 0 });
  response.cookies.set(CHECKOUT_IDEMPOTENCY_COOKIE, "", { ...expired, maxAge: 0 });
}

export async function readCheckoutAccessCookie(): Promise<CheckoutAccessCookie | null> {
  const jar = await cookies();
  return parseCheckoutAccessCookie(jar.get(CHECKOUT_ACCESS_COOKIE)?.value);
}

export async function readIdempotencyCookie(): Promise<CheckoutIdempotencyCookie | null> {
  const jar = await cookies();
  return parseIdempotencyCookie(jar.get(CHECKOUT_IDEMPOTENCY_COOKIE)?.value);
}

export function mintIdempotencyKey(): string {
  return `cko_${randomBytes(16).toString("hex")}`;
}
