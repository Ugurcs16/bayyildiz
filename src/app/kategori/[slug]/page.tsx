import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { CATEGORY_QUICK, SITE_DESCRIPTION } from "@/lib/constants";
import { getCatalogProducts } from "@/lib/products-normalizer";

type Props = { params: Promise<{ slug: string }> };

const VALID_SLUGS = CATEGORY_QUICK.map((c) => c.slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORY_QUICK.find((c) => c.slug === slug);
  const title = cat?.title ?? slug;
  return {
    title: `${title} Erkek Ayakkabı`,
    description: `${title} kategorisinde hakiki deri erkek ayakkabı modelleri. ${SITE_DESCRIPTION}`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  if (!(VALID_SLUGS as readonly string[]).includes(slug)) notFound();

  const cat = CATEGORY_QUICK.find((c) => c.slug === slug)!;
  const products = getCatalogProducts().filter((p) => p.category === slug);

  return (
    <div>
      <div className="border-b border-black/8 bg-[var(--color-cream-dark)]/40">
        <div className="mx-auto max-w-6xl px-4 py-4 text-sm text-[var(--color-anthracite-soft)] sm:px-6">
          <Link href="/" className="hover:text-[var(--color-espresso)]">
            Ana Sayfa
          </Link>
          <span className="mx-2 opacity-50">/</span>
          <span className="text-[var(--color-espresso)]">{cat.title}</span>
        </div>
      </div>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-4xl">
          {cat.title}
        </h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--color-anthracite-soft)] sm:text-base">
            {cat.subtitle}. Bu sayfa vitrin amaçlı örnek ürünleri gösterir.
        </p>
        {products.length === 0 ? (
          <p className="mt-12 text-center text-sm text-[var(--color-anthracite-soft)]">
            Bu kategoride şu an ürün bulunmuyor. WhatsApp'tan stok sorabilirsiniz.
          </p>
        ) : (
          <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
