import Image from "next/image";
import Link from "next/link";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatPrice, stockLabel } from "@/lib/dummy";
import type { CatalogProduct } from "@/lib/products-normalizer";
import {
  publicProductCode,
  publicProductImageAlt,
} from "@/lib/public-product-identity";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

function waMessage(code: string) {
  return `Merhaba, ${code} hakkında bilgi almak istiyorum.`;
}

type Props = {
  product: CatalogProduct;
  /** İlk görünür kartlar için LCP; diğerleri lazy. */
  imagePriority?: boolean;
};

export function ProductCard({ product, imagePriority = false }: Props) {
  const code = publicProductCode(product);
  const imageAlt = publicProductImageAlt(product);
  const wa = buildWhatsAppUrl(waMessage(code), WHATSAPP_NUMBER);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_4px_24px_rgba(44,24,16,0.06)] ring-1 ring-black/[0.03] transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(44,24,16,0.1)]">
      <div className="relative aspect-[4/5] bg-[var(--color-cream-dark)]">
        <Link href={`/urun/${product.slug}`} className="absolute inset-0 z-10">
          <span className="sr-only">{code} detayına git</span>
        </Link>
        <Image
          src={product.image}
          alt={imageAlt}
          fill
          priority={imagePriority}
          loading={imagePriority ? undefined : "lazy"}
          className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
        />
        {product.hoverImage ? (
          <Image
            src={product.hoverImage}
            alt=""
            fill
            loading="lazy"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          />
        ) : null}
        {product.oldPrice ? (
          <span className="absolute left-3 top-3 z-[1] rounded-full bg-[var(--color-espresso)] px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-white">
            İndirim
          </span>
        ) : null}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-1/3 bg-gradient-to-t from-black/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden
        />
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-3.5">
        <h3 className="font-display text-base font-semibold leading-snug tracking-wide text-[var(--color-espresso)] sm:text-lg">
          <Link href={`/urun/${product.slug}`} className="hover:underline">
            {code}
          </Link>
        </h3>
        <p className="mt-1.5 text-[0.7rem] font-semibold uppercase tracking-wider text-[var(--color-taupe-muted)]">
          {stockLabel(product.stock)}
        </p>

        <div className="mt-2.5 flex flex-wrap items-baseline gap-2 border-t border-black/[0.06] pt-2.5">
          <span className="font-display text-xl font-semibold text-[var(--color-espresso)]">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice ? (
            <span className="text-sm text-[var(--color-anthracite-soft)] line-through">
              {formatPrice(product.oldPrice)}
            </span>
          ) : null}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Link
            href={`/urun/${product.slug}`}
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--color-espresso)] px-3 text-xs font-semibold text-white transition-colors hover:bg-[var(--color-espresso-hover)]"
          >
            Ürünü incele
          </Link>
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-10 items-center justify-center rounded-full border border-emerald-800/20 bg-emerald-50/90 text-xs font-semibold text-emerald-900 transition-colors hover:bg-emerald-100/90"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
