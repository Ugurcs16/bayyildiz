type Props = {
  videoUrl: string;
};

export function HeroSection({ videoUrl }: Props) {
  return (
    <section className="relative z-0 flex min-h-[52svh] items-end overflow-hidden min-[480px]:min-h-[55svh] sm:min-h-[72svh] sm:items-center md:min-h-[80svh] lg:min-h-[85svh]">
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover object-center"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="Deri ayakkabı ve mağaza atmosferi"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 z-[1] bg-gradient-to-t from-black/45 via-black/20 to-black/10"
        aria-hidden
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-[calc(4rem+env(safe-area-inset-bottom))] pt-14 sm:px-6 sm:pb-20 sm:pt-28 md:pb-18 md:pt-24">
        <div className="max-w-2xl">
          <h1 className="font-display text-[2.125rem] font-bold leading-[1.15] tracking-tight text-white text-balance drop-shadow-[0_2px_28px_rgba(0,0,0,0.55)] sm:text-5xl sm:leading-[1.12] md:text-6xl lg:text-[3.5rem]">
            <span className="block">1989’dan Günümüze</span>
            <span className="mt-1 block sm:mt-1.5">Kalite ve En Yeni Trend</span>
          </h1>
          <div className="mt-6 sm:mt-7">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.35)] sm:text-xs">
              Mağazalarımız
            </p>
            <p className="mt-1.5 text-sm font-medium tracking-wide text-white/90 [text-shadow:0_1px_12px_rgba(0,0,0,0.35)] sm:text-base">
              Heykel &amp; FSM · Bursa
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
