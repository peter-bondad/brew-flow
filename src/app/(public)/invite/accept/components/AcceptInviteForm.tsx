"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

type AcceptInviteFormProps = {
  token: string;
  email: string;
  initialName: string;
};

type AcceptInvitationResponse = {
  message: string;
};

export function AcceptInviteForm({
  token,
  email,
  initialName,
}: AcceptInviteFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");

      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/invitation/accept", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          token,

          name,

          password,
        }),
      });

      const result: AcceptInvitationResponse | null = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        const message = result?.message ?? "Unable to accept invitation.";

        setError(message);

        toast.error(message);

        return;
      }

      toast.success(result?.message ?? "Account created successfully.");

      router.replace("/login");
    } catch {
      const message = "Something went wrong while accepting the invitation.";

      setError(message);

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="invite-email">Email</Label>
        <Input
          id="invite-email"
          type="email"
          value={email}
          disabled
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invite-name">Name</Label>
        <Input
          id="invite-name"
          type="text"
          value={name}
          required
          disabled={submitting}
          autoComplete="name"
          onChange={(event) => setName(event.target.value)}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invite-password">Password</Label>
        <Input
          id="invite-password"
          type="password"
          value={password}
          required
          minLength={8}
          maxLength={128}
          disabled={submitting}
          autoComplete="new-password"
          onChange={(event) => setPassword(event.target.value)}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invite-confirm-password">Confirm password</Label>
        <Input
          id="invite-confirm-password"
          type="password"
          value={confirmPassword}
          required
          minLength={8}
          maxLength={128}
          disabled={submitting}
          autoComplete="new-password"
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="h-11"
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={submitting} className="h-11 w-full">
        {submitting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : null}
        <span>{submitting ? "Creating account..." : "Create account"}</span>
      </Button>
    </form>
  );
}
