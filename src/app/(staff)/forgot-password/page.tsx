import { Coffee } from "lucide-react";
import { ForgotPasswordForm } from "./components/forgot-password-form";
import Image from "next/image";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#fff8ef]">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-[#ead8c7] bg-white shadow-[0_25px_70px_-30px_rgba(61,35,22,0.35)] lg:grid-cols-[1.1fr_0.9fr]">
          <section className="hidden bg-linear-to-br from-[#6f3e1d] via-[#85502a] to-[#b98249] p-12 text-[#fff8ef] lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                <Coffee className="size-7" />
              </div>

              <h1 className="text-4xl font-bold leading-tight">
                Reset your
                <br />
                password.
              </h1>

              <p className="mt-5 max-w-md text-[15px] leading-7 text-[#f6eadf]">
                Enter your email and we&apos;ll send you a secure password reset
                link.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <div className="flex items-start gap-3">
                <Image
                  src="/icon.svg"
                  alt="BrewFlow"
                  width={20}
                  height={20}
                  className="mt-0.5 shrink-0"
                />

                <p className="text-sm text-[#f5e7d8]">
                  Every great brew starts fresh. We&apos;ll help you get back
                  into your account.
                </p>
              </div>
            </div>
          </section>

          <section className="flex items-center justify-center p-8 sm:p-12">
            <ForgotPasswordForm />
          </section>
        </div>
      </div>
    </main>
  );
}
