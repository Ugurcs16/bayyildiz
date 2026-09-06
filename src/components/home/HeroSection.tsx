type Props = {
  videoUrl: string;
};

export function HeroSection({ videoUrl }: Props) {
  return (
    <section className="relative z-0 flex min-h-[52svh] items-center overflow-hidden min-[480px]:min-h-[55svh] sm:min-h-[72svh] md:min-h-[80svh] lg:min-h-[85svh]">
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover object-[center_38%] sm:object-center"
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

      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-center px-5 py-[calc(3.75rem+1.5rem)] text-center sm:items-stretch sm:justify-start sm:px-6 sm:pb-20 sm:pt-28 sm:text-left md:pb-18 md:pt-24">
        <div className="mx-auto w-full max-w-[22rem] sm:mx-0 sm:max-w-2xl">
          <h1 className="mx-auto max-w-[18.5rem] text-center font-display text-[clamp(1.65rem,4.2vw+0.7rem,2rem)] font-semibold leading-[1.2] tracking-tight text-white text-balance drop-shadow-[0_2px_28px_rgba(0,0,0,0.55)] sm:mx-0 sm:max-w-none sm:text-left sm:text-5xl sm:leading-[1.12] md:text-6xl lg:text-[3.5rem]">
            <span className="block">1989’dan Günümüze</span>
            <span className="mt-1 block sm:mt-1.5">Kalite ve En Yeni Trend</span>
          </h1>
          <div className="mx-auto mt-5 max-w-[18.5rem] text-center sm:mx-0 sm:mt-7 sm:max-w-none sm:text-left">
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
