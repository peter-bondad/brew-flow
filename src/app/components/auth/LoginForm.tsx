"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authClient from "@/lib/auth-client";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useId, useState } from "react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const errorId = useId();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSubmitting(true);
    setError("");

    const loadingTimer = window.setTimeout(() => {
      setShowLoading(true);
    }, 250);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        console.dir("Login error:", error);
        setError(error.message ?? "Login failed. Please Try Again.");
        toast.error(error.message ?? "Login failed. Please Try Again.");
        return;
      }
      const { data: session } = await authClient.getSession();

      if (session?.user.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/login");
      }

      toast.success("Welcome back!");

      router.replace("/admin");
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      window.clearTimeout(loadingTimer);
      setShowLoading(false);
      setSubmitting(false);
    }
  }

  return (
    <section className="flex w-full items-center justify-center border-t border-[#d9b07f]/15 p-6 sm:p-8 lg:w-1/2 lg:border-l lg:border-t-0 lg:border-[#d9b07f]/15 lg:p-10">
      <div className="w-full max-w-xl sm:max-w-lg lg:max-w-lg">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8d5a2b] sm:tracking-[0.35em]">
            Coffee House
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-[#3d2413] sm:text-4xl lg:text-5xl">
            Login to your account
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#7b5f46] sm:text-base lg:text-lg">
            Access your rewards and order your next favorite drink.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          aria-describedby={error ? errorId : undefined}
        >
          <div className="space-y-2">
            <Label htmlFor={emailId} className="text-[#5d4033]">
              Email
            </Label>
            <Input
              id={emailId}
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              disabled={submitting}
              required
              autoComplete="email"
              inputMode="email"
              aria-invalid={Boolean(error)}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl border-[#ddc0a0] bg-[#fffdf9] px-4 text-[#3d2413] shadow-sm transition placeholder:text-[#9b7d61] focus-visible:border-[#8c5a2b] focus-visible:ring-[#e0b887]/70"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={passwordId} className="text-[#5d4033]">
              Password
            </Label>
            <div className="relative">
              <Input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={password}
                disabled={submitting}
                required
                autoComplete="current-password"
                aria-invalid={Boolean(error)}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl border-[#ddc0a0] bg-[#fffdf9] px-4 pr-12 text-[#3d2413] shadow-sm transition placeholder:text-[#9b7d61] focus-visible:border-[#8c5a2b] focus-visible:ring-[#e0b887]/70"
              />
              <button
                type="button"
                disabled={submitting}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#7b5f46] transition hover:bg-[#f2dfca] hover:text-[#3d2413] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e0b887] disabled:pointer-events-none disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="size-4" aria-hidden="true" />
                ) : (
                  <Eye className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-sm text-[#7b5f46] sm:flex-row sm:items-center sm:justify-between">
            <Label className="inline-flex w-fit cursor-pointer items-center gap-2 font-normal">
              <input
                type="checkbox"
                name="remember"
                disabled={submitting}
                className="h-4 w-4 rounded border-[#cda77d] text-[#6f3e1d] focus:ring-[#e0b887]"
              />
              Remember me
            </Label>
            <button
              type="button"
              disabled={submitting}
              onClick={() => toast.info("Password reset is not available yet.")}
              className="w-fit cursor-pointer font-medium text-[#8d5a2b] transition hover:text-[#6f3e1d] disabled:pointer-events-none disabled:opacity-50"
            >
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            size="lg"
            className="cursor-pointer h-12 w-full rounded-full bg-[#6f3e1d] text-base text-[#fff8ef] shadow-[0_14px_30px_-18px_rgba(74,43,28,0.9)] hover:bg-[#8d5a2b] focus-visible:ring-[#e0b887]"
          >
            {showLoading ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}

            <span>{showLoading ? "Signing in..." : "Sign in"}</span>
          </Button>
        </form>
      </div>
    </section>
  );
}
