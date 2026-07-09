"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

export function InviteUserForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          role,
        }),
      });

      const result = (await response.json().catch(() => null)) as {
        message?: string;
      } | null;

      if (!response.ok) {
        const nextError = result?.message ?? "Unable to create invite.";
        setError(nextError);
        toast.error(nextError);
        return;
      }

      const nextMessage =
        result?.message ??
        "Invite created. Check the dev console for the link.";

      setMessage(nextMessage);
      setEmail("");
      setName("");
      setRole("user");
      toast.success("Invite created.");
    } catch {
      const nextError = "Something went wrong while creating the invite.";
      setError(nextError);
      toast.error(nextError);
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
          name="email"
          value={email}
          required
          disabled={submitting}
          autoComplete="email"
          inputMode="email"
          placeholder="newuser@example.com"
          onChange={(event) => setEmail(event.target.value)}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invite-name">Name</Label>
        <Input
          id="invite-name"
          type="text"
          name="name"
          value={name}
          disabled={submitting}
          autoComplete="name"
          placeholder="Optional"
          onChange={(event) => setName(event.target.value)}
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="invite-role">Role</Label>
        <select
          id="invite-role"
          name="role"
          value={role}
          disabled={submitting}
          onChange={(event) => setRole(event.target.value)}
          className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={submitting}
        size="lg"
        className="cursor-pointer h-12 w-full rounded-full bg-[#6f3e1d] text-[#fff8ef] shadow-[0_14px_30px_-18px_rgba(74,43,28,0.9)] hover:bg-[#8d5a2b] focus-visible:ring-[#e0b887]"
      >
        {submitting ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Send className="size-4" aria-hidden="true" />
        )}
        <span>{submitting ? "Creating invite..." : "Create invite"}</span>
      </Button>
    </form>
  );
}
