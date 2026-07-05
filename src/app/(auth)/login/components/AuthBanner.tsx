export default function AuthBanner() {
  return (
    <div className="space-y-3">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-400 shadow-[0_24px_80px_rgba(14,165,233,0.24)]">
        <span className="text-lg font-semibold text-white">UI</span>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-600">
          UI Unicorn
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          Nice to see you again
        </h1>
      </div>
    </div>
  );
}
