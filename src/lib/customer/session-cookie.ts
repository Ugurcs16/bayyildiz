import "server-only";

import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

export const CUSTOMER_SESSION_COOKIE = "bayyildiz_customer_session";

const DEFAULT_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function cookieExpires(expiresAt: string | Date | undefined): Date {
  if (expiresAt instanceof Date && !Number.isNaN(expiresAt.getTime())) {
    return expiresAt;
  }
  if (typeof expiresAt === "string") {
    const parsed = new Date(expiresAt);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  return new Date(Date.now() + DEFAULT_TTL_MS);
}

function cookieOptions(expiresAt: string | Date | undefined) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: cookieExpires(expiresAt),
  };
}

export function applyCustomerSessionCookie(
  response: NextResponse,
  token: string,
  expiresAt?: string | Date,
): void {
  response.cookies.set(CUSTOMER_SESSION_COOKIE, token, cookieOptions(expiresAt));
}

export function clearCustomerSessionCookie(response: NextResponse): void {
  response.cookies.set(CUSTOMER_SESSION_COOKIE, "", {
    ...cookieOptions(new Date(0)),
    expires: new Date(0),
    maxAge: 0,
  });
}

export async function readCustomerSessionToken(): Promise<string | null> {
  const jar = await cookies();
  const value = jar.get(CUSTOMER_SESSION_COOKIE)?.value?.trim();
  return value || null;
}

export async function hasCustomerSessionCookie(): Promise<boolean> {
  return Boolean(await readCustomerSessionToken());
}
