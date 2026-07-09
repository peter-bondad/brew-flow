import { AuthHero } from "@/app/components/auth/AuthHero";
import { LoginForm } from "@/app/components/auth/LoginForm";

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,#f8efe7_0%,#f4e0c8_55%,#e8c79d_100%)] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
      <div className="flex min-h-[calc(80vh-2rem)] w-full max-w-5xl flex-col gap-6 overflow-hidden rounded-[32px] border border-[#d9b07f]/70 bg-[#fffaf5] shadow-[0_30px_90px_-25px_rgba(109,69,31,0.35)] lg:flex-row lg:gap-0">
        <AuthHero />
        <LoginForm />
      </div>
    </main>
  );
}
