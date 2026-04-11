import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_NAME } from "@/lib/constants";
import { CATEGORIES } from "@/lib/dummy";
import {
  buildProductJsonLd,
  buildProductMetaDescription,
  buildProductSeoTitle,
} from "@/lib/product-seo";
import { CatalogProductGallery } from "@/components/product/CatalogProductGallery";
import { CatalogProductPurchase } from "@/components/product/CatalogProductPurchase";
import { ProductDetailSections } from "@/components/product/ProductDetailSections";
import { getCatalogProductBySlug } from "@/lib/products-normalizer";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getCatalogProductBySlug(slug);
  if (!product) return { title: "Ürün bulunamadı" };
  const title = buildProductSeoTitle(product);
  const description = buildProductMetaDescription(product);
  const path = `/urun/${slug}`;
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
  const product = getCatalogProductBySlug(slug);
  if (!product) notFound();

  const galleryImages =
    product.images.length > 0
      ? product.images
      : [product.image, product.hoverImage].filter(Boolean) as string[];

  const categoryLabel =
    CATEGORIES.find((c) => c.id === product.category)?.title ??
    String(product.category);

  const jsonLd = buildProductJsonLd(product, product.price);

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
          <span className="text-[var(--color-espresso)]">{product.name}</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-12">
        <CatalogProductGallery
          images={galleryImages}
          productName={product.name}
          imageAlt={product.imageAlt}
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

          <p className="mt-4 text-sm text-[var(--color-anthracite-soft)]">
            Model kodu:{" "}
            <span className="font-semibold text-[var(--color-anthracite)]">
              {product.code}
            </span>
          </p>

          <p className="mt-3 text-base leading-relaxed text-[var(--color-anthracite-soft)]">
            {product.seoDescription ?? product.teaser}
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
