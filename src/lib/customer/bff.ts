import { NextResponse } from "next/server";
import {
  CUSTOMER_MESSAGES,
  customerMessageForStatus,
} from "@/lib/customer/messages";
import { isAllowedMutationOrigin } from "@/lib/customer/request-guard";
import {
  clearCustomerSessionCookie,
  readCustomerSessionToken,
} from "@/lib/customer/session-cookie";
import { TervonaCustomerError } from "@/lib/tervona/customer-client";

const NO_STORE = { "Cache-Control": "no-store" };

export function bffJson(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: NO_STORE });
}

export function bffError(status: number, remoteMessage?: string): NextResponse {
  return bffJson({ error: customerMessageForStatus(status, remoteMessage) }, status);
}

export function rejectCrossOrigin(request: Request): NextResponse | null {
  if (request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") {
    return null;
  }
  if (isAllowedMutationOrigin(request)) {
    return null;
  }
  return bffJson({ error: CUSTOMER_MESSAGES.forbidden }, 403);
}

export async function requireBffSession(): Promise<string | NextResponse> {
  const token = await readCustomerSessionToken();
  if (!token) {
    return bffError(401);
  }
  return token;
}

export function handleTervonaError(
  error: unknown,
  options?: { clearCookieOn401?: boolean },
): NextResponse {
  if (error instanceof TervonaCustomerError) {
    const response = bffError(error.status, error.remoteMessage);
    if (options?.clearCookieOn401 && error.status === 401) {
      clearCustomerSessionCookie(response);
    }
    return response;
  }
  return bffError(503);
}

export async function readJsonBody(
  request: Request,
): Promise<Record<string, unknown> | NextResponse> {
  try {
    const body = (await request.json()) as unknown;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return bffError(400);
    }
    return body as Record<string, unknown>;
  } catch {
    return bffError(400);
  }
}
