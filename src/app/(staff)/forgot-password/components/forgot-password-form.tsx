"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authClient from "@/lib/auth-client";
import { Loader2, MailCheck } from "lucide-react";
import Link from "next/link";
import { FormEvent, useId, useState } from "react";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const emailId = useId();

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSubmitting(true);

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message ?? "Unable to send password reset email.");
        return;
      }

      setSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-[#f2dfca]">
          <MailCheck className="size-6 text-[#8d5a2b]" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d5a2b]">
          BrewFlow
        </p>

        <h2 className="mt-3 text-3xl font-bold text-[#3d2413]">
          Check your email
        </h2>

        <p className="mt-4 text-sm leading-7 text-[#7b5f46]">
          If an account exists for
          <span className="font-medium text-[#5d4033]"> {email}</span>,
          we&apos;ve sent a password reset link.
        </p>

        <p className="mt-2 text-sm text-[#8d725d]">
          The link expires in <span className="font-medium">1 hour</span>.
        </p>

        <p className="mt-6 text-sm text-[#8d725d]">
          Didn&apos;t receive it? Check your spam folder or try again later.
        </p>

        <Link href="/login" className="mt-8 h-12 rounded-full px-6"></Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#8d5a2b]">
          BrewFlow
        </p>

        <h2 className="mt-3 text-3xl font-bold text-[#3d2413]">
          Forgot your password?
        </h2>

        <p className="mt-3 text-sm leading-7 text-[#7b5f46]">
          Enter the email associated with your account and we&apos;ll send you a
          secure password reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor={emailId}>Email</Label>

          <Input
            id={emailId}
            type="email"
            autoComplete="email"
            required
            disabled={submitting}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="h-12 rounded-xl border-[#ddc0a0] bg-[#fffdf9]"
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="cursor-pointer h-12 w-full rounded-full"
        >
          {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}

          {submitting ? "Sending link..." : "Send reset link"}
        </Button>

        <p className="text-center text-sm text-[#7b5f46]">
          Remember your password?{" "}
          <Link
            href="/login"
            className="underline font-medium text-[#8d5a2b] hover:text-[#6f3e1d]"
          >
            Back to login
          </Link>
        </p>
      </form>
    </div>
  );
}
