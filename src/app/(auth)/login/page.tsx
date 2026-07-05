import AuthBanner from "./components/AuthBanner";
import AuthFooter from "./components/AuthFooter";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10 sm:px-8">
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="relative overflow-hidden rounded-4xl bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.20),transparent_38%),linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)] p-8 shadow-[0_48px_90px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.20),transparent_38%),linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)]" />
          <div className="relative z-10 flex h-full min-h-[420px] flex-col items-start justify-center gap-6 text-slate-900">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-linear-to-br from-sky-500 to-cyan-400 text-white shadow-[0_18px_50px_rgba(14,165,233,0.24)]">
              UI
            </div>
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-600">
                UI Unicorn
              </p>
              <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Nice to see you again
              </h2>
            </div>
            <p className="max-w-lg text-base leading-7 text-slate-700">
              Login to your account with email or phone number and keep your
              session secure with our modern login experience.
            </p>
          </div>
        </div>

        <div className="rounded-4xl bg-white p-8 shadow-[0_36px_80px_rgba(15,23,42,0.12)] sm:p-10">
          <AuthBanner />
          <div className="mt-8">
            <LoginForm />
          </div>
          <div className="mt-8">
            <AuthFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
