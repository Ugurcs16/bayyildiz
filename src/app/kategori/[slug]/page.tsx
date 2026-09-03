import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { CATEGORY_QUICK, SITE_NAME } from "@/lib/constants";
import { listCatalogProducts } from "@/lib/catalog-source";
import { getCategorySeoIntro } from "@/lib/product-seo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

const VALID_SLUGS = CATEGORY_QUICK.map((c) => c.slug);
const PAGE_SIZE = 24;

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

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  if (!(VALID_SLUGS as readonly string[]).includes(slug)) notFound();

  const sp = await searchParams;
  const pageRaw = Number.parseInt(sp.page ?? "1", 10);
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

  const cat = CATEGORY_QUICK.find((c) => c.slug === slug)!;
  const list = await listCatalogProducts({
    category: slug,
    page,
    limit: PAGE_SIZE,
    sort: "featured",
  });
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
          {list.total > 0
            ? ` · ${list.total} model · sayfa ${list.page}/${list.pageCount}`
            : null}
        </p>
        {list.products.length === 0 ? (
          <p className="mt-12 text-center text-sm text-[var(--color-anthracite-soft)]">
            Bu kategoride şu an ürün bulunmuyor. WhatsApp&apos;tan stok
            sorabilirsiniz.
          </p>
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
            {list.products.map((p, index) => (
              <li key={p.id}>
                <ProductCard product={p} imagePriority={index < 4} />
              </li>
            ))}
          </ul>
        )}

        {list.pageCount > 1 ? (
          <nav
            className="mt-12 flex flex-wrap items-center justify-center gap-3"
            aria-label="Sayfalama"
          >
            {list.page > 1 ? (
              <Link
                href={`/kategori/${slug}?page=${list.page - 1}`}
                className="inline-flex min-h-11 items-center rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-[var(--color-espresso)]"
              >
                Önceki
              </Link>
            ) : null}
            <span className="text-sm text-[var(--color-anthracite-soft)]">
              {list.page} / {list.pageCount}
            </span>
            {list.page < list.pageCount ? (
              <Link
                href={`/kategori/${slug}?page=${list.page + 1}`}
                className="inline-flex min-h-11 items-center rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-[var(--color-espresso)]"
              >
                Sonraki
              </Link>
            ) : null}
          </nav>
        ) : null}
      </section>
    </div>
  );
}
