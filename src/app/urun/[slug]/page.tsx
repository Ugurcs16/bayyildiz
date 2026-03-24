import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_DESCRIPTION, WHATSAPP_NUMBER } from "@/lib/constants";
import { ProductDetailSections } from "@/components/product/ProductDetailSections";
import { getCatalogProductBySlug } from "@/lib/products-normalizer";
import { buildWhatsAppUrl, productWhatsAppMessage } from "@/lib/whatsapp";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getCatalogProductBySlug(slug);
  if (!product) return { title: "Ürün bulunamadı" };
  const desc = product.seoDescription ?? product.teaser;
  return {
    title: product.name,
    description: desc || SITE_DESCRIPTION,
    openGraph: {
      title: product.name,
      description: desc || SITE_DESCRIPTION,
      images: product.image ? [{ url: product.image }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getCatalogProductBySlug(slug);
  if (!product) notFound();
  const selectedVariation = product.variations.find((v) => v.stock !== "yok") ?? product.variations[0];
  const selectedPrice = selectedVariation?.price || product.price;
  const wa = buildWhatsAppUrl(
    productWhatsAppMessage(product.name, product.code),
    WHATSAPP_NUMBER,
  );

  return (
    <>
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

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-14">
        <div className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-sm">
          <div className="relative aspect-[4/5] bg-[var(--color-cream-dark)]">
            <Image
              src={product.image}
              alt={product.imageAlt}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
          {product.hoverImage ? (
            <div className="relative aspect-[4/5] border-t border-black/[0.06]">
              <Image
                src={product.hoverImage}
                alt={`${product.name} ikinci görünüm`}
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
          ) : null}
        </div>
        <article>
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-taupe-muted)]">
            {product.category}
          </p>
          <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-[var(--color-espresso)] sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-4">
            {product.stock === "var" ? (
              <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-800">
                Stokta
              </span>
            ) : null}
            {product.stock === "az" ? (
              <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold tracking-wide text-amber-800">
                Son ürünler
              </span>
            ) : null}
            {product.stock === "yok" ? (
              <span className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold tracking-wide text-rose-800">
                Tükendi
              </span>
            ) : null}
          </div>
          <p className="mt-3 text-sm text-[var(--color-anthracite-soft)]">
            Model kodu:{" "}
            <span className="font-semibold text-[var(--color-anthracite)]">{product.code}</span>
          </p>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-anthracite-soft)]">
            {product.seoDescription ?? product.teaser}
          </p>
          <p className="mt-6 font-display text-3xl font-semibold text-[var(--color-espresso)]">
            {new Intl.NumberFormat("tr-TR", {
              style: "currency",
              currency: "TRY",
              maximumFractionDigits: 0,
            }).format(selectedPrice)}
          </p>
          <div className="mt-6 rounded-2xl border border-black/10 bg-white/80 p-4">
            <p className="text-sm font-semibold text-[var(--color-espresso)]">
              Numara seçimi
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(product.variations.length > 0
                ? product.variations
                : [{ size: "Standart", sku: product.code, stock: product.stock, price: product.price }]
              ).map((variation, i) => (
                <label
                  key={`${variation.sku}-${variation.size}`}
                  className={`inline-flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-full border px-3 text-sm font-semibold transition-colors ${
                    i === 0
                      ? "border-[var(--color-espresso)] bg-[var(--color-espresso)] text-white"
                      : "border-black/10 bg-white text-[var(--color-espresso)] hover:border-black/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="size"
                    className="sr-only"
                    defaultChecked={i === 0}
                  />
                  {variation.size}
                </label>
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-black/8 bg-[var(--color-cream)]/70 p-3 text-xs text-[var(--color-anthracite-soft)]">
              <p>
                Seçili varyant SKU:{" "}
                <span className="font-semibold text-[var(--color-anthracite)]">
                  {selectedVariation?.sku ?? product.code}
                </span>
              </p>
              <p className="mt-1">
                Seçili varyant stok:{" "}
                <span className="font-semibold text-[var(--color-anthracite)]">
                  {selectedVariation
                    ? selectedVariation.stock === "var"
                      ? "Stokta"
                      : selectedVariation.stock === "az"
                        ? "Son adetler"
                        : "Tükendi"
                    : product.stock === "var"
                      ? "Stokta"
                      : product.stock === "az"
                        ? "Son adetler"
                        : "Tükendi"}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-espresso)] px-6 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-espresso-hover)]"
            >
              {product.stock === "yok" ? "Sepete ekle (yakında)" : "Satın al (yakında)"}
            </button>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-black/10 bg-white px-6 text-sm font-semibold text-[var(--color-espresso)] hover:bg-[var(--color-cream)]"
            >
              WhatsApp ile bilgi al
            </a>
          </div>
          <ul className="mt-6 space-y-2 rounded-2xl border border-black/8 bg-[var(--color-cream)]/60 p-4 text-sm text-[var(--color-anthracite-soft)]">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold-soft)]" />
              %100 hakiki deri
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold-soft)]" />
              Bursa mağaza güvencesi
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold-soft)]" />
              Değişim / iade kolaylığı
            </li>
          </ul>
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
