import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { CATEGORY_QUICK, SITE_NAME } from "@/lib/constants";
import { getCategorySeoIntro } from "@/lib/product-seo";
import { getCatalogProducts } from "@/lib/products-normalizer";

type Props = { params: Promise<{ slug: string }> };

const VALID_SLUGS = CATEGORY_QUICK.map((c) => c.slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORY_QUICK.find((c) => c.slug === slug);
  const title = cat?.title ?? slug;
  const intro = getCategorySeoIntro(slug);
  const pageTitle = `${title} Erkek Ayakkabı`;
  const path = `/kategori/${slug}`;
  return {
    title: pageTitle,
    description: intro.metaDescription,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: pageTitle,
      description: intro.metaDescription,
      url: path,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: intro.metaDescription,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  if (!(VALID_SLUGS as readonly string[]).includes(slug)) notFound();

  const cat = CATEGORY_QUICK.find((c) => c.slug === slug)!;
  const products = getCatalogProducts().filter((p) => p.category === slug);
  const seo = getCategorySeoIntro(slug);

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
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="max-w-2xl">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--color-espresso)] sm:text-xl">
            {seo.heading}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-anthracite-soft)]">
            {seo.text}
          </p>
        </div>
        <p className="mt-6 text-xs text-[var(--color-taupe-muted)]">
          {cat.subtitle}
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
