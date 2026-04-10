import Image from "next/image";
import Link from "next/link";

const CATEGORIES = [
  {
    title: "Günlük",
    href: "/kategori/gunluk",
    image:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=480&q=80&auto=format&fit=crop",
  },
  {
    title: "Klasik",
    href: "/kategori/klasik",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=480&q=80&auto=format&fit=crop",
  },
  {
    title: "Outdoor",
    href: "/kategori/outdoor",
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=480&q=80&auto=format&fit=crop",
  },
  {
    title: "Bot",
    href: "/kategori/bot",
    image:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=480&q=80&auto=format&fit=crop",
  },
] as const;

export function HomeCategoryStrip() {
  return (
    <nav
      aria-label="Kategorilere göz at"
      className="border-b border-black/[0.05] bg-[var(--color-cream)]"
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-2 pt-1 [scrollbar-width:thin] sm:gap-4 sm:px-6 md:flex-wrap md:justify-center md:gap-5 md:overflow-x-visible md:overscroll-x-auto md:snap-none md:px-6 md:pb-3 md:pt-3 lg:flex-nowrap lg:gap-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="relative h-24 w-36 shrink-0 snap-start overflow-hidden rounded-xl ring-1 ring-black/[0.06] transition-[transform,box-shadow] hover:shadow-md active:scale-[0.98] md:h-32 md:w-52 md:shrink-0 lg:h-36 lg:w-56"
            >
              <Image
                src={c.image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width:767px) 144px, (max-width:1023px) 208px, 224px"
              />
              <div
                className="absolute inset-0 bg-black/30"
                aria-hidden
              />
              <span className="absolute inset-0 flex items-center justify-center px-2 text-center text-sm font-semibold text-white drop-shadow-sm md:text-base lg:text-lg">
                {c.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
