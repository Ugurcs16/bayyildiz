import "server-only";

import { redirect } from "next/navigation";
import { mapCustomerProfile } from "@/lib/customer/map-dto";
import { readCustomerSessionToken } from "@/lib/customer/session-cookie";
import type { CustomerProfile } from "@/lib/customer/types";
import {
  TervonaCustomerError,
  tervonaMe,
} from "@/lib/tervona/customer-client";

export async function getCustomerProfile(): Promise<CustomerProfile | null> {
  const token = await readCustomerSessionToken();
  if (!token) return null;
  try {
    const body = await tervonaMe(token);
    return mapCustomerProfile(body);
  } catch (error) {
    if (error instanceof TervonaCustomerError && error.status === 401) {
      return null;
    }
    throw error;
  }
}

export async function requireCustomerProfile(
  returnPath = "/hesabim",
): Promise<CustomerProfile> {
  const token = await readCustomerSessionToken();
  const next = encodeURIComponent(returnPath);
  if (!token) {
    redirect(`/giris?next=${next}`);
  }
  const customer = await getCustomerProfile();
  if (!customer) {
    redirect(`/giris?next=${next}&stale=1`);
  }
  return customer;
}
