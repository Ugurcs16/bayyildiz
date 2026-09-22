import { readFileSync } from "node:fs";
import { join } from "node:path";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const root = join(import.meta.dirname, "..");
const config = readFileSync(join(root, "next.config.ts"), "utf8");
assert(
  /unoptimized:\s*true/.test(config),
  "next.config.ts must set images.unoptimized so catalog photos bypass Vercel 402",
);

for (const file of [
  "src/components/product/ProductCard.tsx",
  "src/components/product/CatalogProductGallery.tsx",
  "src/components/cart/CartView.tsx",
]) {
  const src = readFileSync(join(root, file), "utf8");
  assert(src.includes("unoptimized"), `${file} must render catalog photos unoptimized`);
}

console.log("verify-product-images: unoptimized catalog images OK");
