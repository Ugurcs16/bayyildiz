import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { SITE_NAME } from "@/lib/constants";
import { CATEGORIES } from "@/lib/dummy";
import { getCatalogProductBySlugResolved } from "@/lib/catalog-source";
import { getCanonicalSlugRedirect } from "@/lib/product-slug-compat";
import {
  buildProductJsonLd,
  buildProductMetaDescription,
  buildProductSeoTitle,
} from "@/lib/product-seo";
import { publicProductCode, publicProductImageAlt } from "@/lib/public-product-identity";
import { CatalogProductGallery } from "@/components/product/CatalogProductGallery";
import { CatalogProductPurchase } from "@/components/product/CatalogProductPurchase";
import { ProductDetailSections } from "@/components/product/ProductDetailSections";

type Props = { params: Promise<{ slug: string }> };

function redirectIfLegacySlug(slug: string): void {
  const canonical = getCanonicalSlugRedirect(slug);
  if (canonical) {
    permanentRedirect(`/urun/${canonical}`);
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  redirectIfLegacySlug(slug);
  const resolved = await getCatalogProductBySlugResolved(slug);
  if (!resolved) return { title: "Ürün bulunamadı" };
  const { product } = resolved;
  const title = buildProductSeoTitle(product);
  const description = buildProductMetaDescription(product);
  const path = `/urun/${product.slug}`;
  const ogImages = product.image ? [{ url: product.image }] : [];
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.length ? [ogImages[0].url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  redirectIfLegacySlug(slug);
  const resolved = await getCatalogProductBySlugResolved(slug);
  if (!resolved) notFound();
  const { product } = resolved;

  const galleryImages =
    product.images.length > 0
      ? product.images
      : ([product.image, product.hoverImage].filter(Boolean) as string[]);

  const categoryLabel =
    CATEGORIES.find((c) => c.id === product.category)?.title ??
    String(product.category);

  const jsonLd = buildProductJsonLd(product, product.price);
  const publicCode = publicProductCode(product);
  const imageAlt = publicProductImageAlt(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="border-b border-black/8 bg-[var(--color-cream-dark)]/40">
        <div className="mx-auto max-w-6xl px-4 py-4 text-sm text-[var(--color-anthracite-soft)] sm:px-6">
          <Link href="/" className="hover:text-[var(--color-espresso)]">
            Ana Sayfa
          </Link>
          <span className="mx-2 opacity-50">/</span>
          <Link href="/#urunler" className="hover:text-[var(--color-espresso)]">
            Ürünler
          </Link>
          <span className="mx-2 opacity-50">/</span>
          <span className="text-[var(--color-espresso)]">{publicCode}</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-12">
        <CatalogProductGallery
          images={galleryImages}
          productName={publicCode}
          imageAlt={imageAlt}
        />
        <article>
          <CatalogProductPurchase product={product} />

          <ul className="mt-5 flex flex-col gap-2 rounded-2xl border border-black/8 bg-[var(--color-cream)]/55 px-4 py-3.5 text-xs text-[var(--color-anthracite-soft)] sm:text-sm">
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold-soft)]" />
              Hakiki deri
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold-soft)]" />
              Bursa mağaza güvencesi
            </li>
            <li className="flex items-start gap-2.5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-gold-soft)]" />
              Kolay değişim
            </li>
          </ul>

          <p className="mt-3 text-sm font-semibold uppercase tracking-widest text-[var(--color-taupe-muted)]">
            {categoryLabel}
          </p>

          <Link
            href="/#urunler"
            className="mt-4 inline-flex text-sm font-semibold text-[var(--color-espresso)] underline-offset-4 hover:underline"
          >
            Diğer modellere dön
          </Link>
        </article>
      </div>
      <ProductDetailSections product={product} />
    </>
  );
}
