import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_30%),linear-gradient(135deg,#f8fafc_0%,#eef2ff_45%,#f8fafc_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(2,132,199,0.16),transparent_35%)]" />
      <div className="absolute left-[-8%] top-[-10%] h-72 w-72 rounded-full bg-cyan-300/40 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-6%] h-80 w-80 rounded-full bg-indigo-400/35 blur-3xl" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl rounded-[2rem] border border-white/80 bg-white/70 p-3 shadow-[0_30px_90px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:p-4">
          <div className="overflow-hidden rounded-[1.75rem] bg-white">{children}</div>
        </div>
      </div>
    </main>
  );
}