export function AuthHero() {
  return (
    <section className="relative w-full overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_34%),linear-gradient(135deg,_#4a2b1c_0%,_#6e3d1f_45%,_#c67e3f_100%)] p-6 text-[#fff9f2] flex min-h-[360px] flex-col justify-between gap-6 border-b border-[#d9b07f]/15 sm:p-8 lg:w-1/2 lg:p-10 lg:border-b-0 lg:border-r lg:border-[#d9b07f]/15">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.14),_transparent_45%)]" />
      <div className="pointer-events-none absolute left-6 top-28 h-14 w-14 rounded-full bg-[#fff2de]/40 blur-2xl animate-pulse" />
      <div className="pointer-events-none absolute right-8 top-16 h-20 w-20 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">
        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/90 backdrop-blur-sm sm:text-sm">
          ☕ Roasted & ready x
        </div>
        <h1 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
          Welcome back to your cozy cup.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#f7e9d8] sm:text-base lg:text-lg">
          Sign in to enjoy your favorite blends, seasonal specials, and fresh
          pastries.
        </p>
      </div>

      <div className="relative z-10 overflow-hidden rounded-[24px] border border-white/15 bg-white/10 p-5 backdrop-blur-md sm:p-6">
        <div className="absolute -left-6 top-0 h-24 w-24 rounded-full bg-[#d88f4b]/20 blur-2xl" />
        <div className="absolute -right-6 bottom-0 h-24 w-24 rounded-full bg-[#fff4e8]/50 blur-2xl" />
        <p className="relative text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-[#f7d8b2] sm:text-xs">
          Today&apos;s favorite
        </p>
        <div className="relative mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold sm:text-xl">
              Hazelnut Velvet Latte
            </p>
            <p className="mt-1 text-[0.85rem] leading-snug text-[#f3e1c6] sm:text-sm">
              Warm espresso, silky foam, toasted hazelnut
            </p>
          </div>
          <div className="inline-flex items-center justify-center rounded-full bg-[#fff4e8] px-4 py-2 text-sm font-semibold text-[#72391a]">
            ★ 4.9
          </div>
        </div>
      </div>
    </section>
  );
}
