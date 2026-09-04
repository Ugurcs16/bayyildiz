import type { CartLine } from "@/components/providers/cart-context";
import { revalidateCartAgainstTervona } from "@/lib/cart-revalidate";
import { rejectCrossOrigin } from "@/lib/customer/bff";
import { isTervonaConfigured } from "@/lib/tervona/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Body = {
  items?: CartLine[];
};

export async function POST(request: Request) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) {
    return NextResponse.json({
      ok: false,
      items: [],
      issues: [
        {
          key: "",
          action: "removed",
          message: "Sepetiniz boş.",
        },
      ],
    });
  }

  if (!isTervonaConfigured()) {
    return NextResponse.json({
      ok: true,
      items,
      issues: [],
      skipped: true,
    });
  }

  const result = await revalidateCartAgainstTervona(items);
  return NextResponse.json(result);
}
