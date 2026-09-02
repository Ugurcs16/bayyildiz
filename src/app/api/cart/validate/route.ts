import { NextResponse } from "next/server";
import type { CartLine } from "@/components/providers/cart-context";
import { revalidateCartAgainstTervona } from "@/lib/cart-revalidate";
import { isTervonaConfigured } from "@/lib/tervona/client";

export const dynamic = "force-dynamic";

type Body = {
  items?: CartLine[];
};

export async function POST(request: Request) {
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
    // Dev / misconfig: allow proceed without live check
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
