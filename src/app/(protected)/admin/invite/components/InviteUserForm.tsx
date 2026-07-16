"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  userRole,
  UserRole,
  userRoleLabels,
} from "@/server/shared/user-role.types";
import { Loader2, Send } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

export function InviteUserForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<UserRole>(userRole.Staff);
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
          firstName,
          middleName: middleName || undefined,
          lastName,
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
      setFirstName("");
      setMiddleName("");
      setLastName("");
      setRole(userRole.Staff);
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
    <form onSubmit={handleSubmit}>
      <div className="mx-auto w-full max-w-lg space-y-6">
        <Field>
          <FieldLabel htmlFor="invite-email">Email</FieldLabel>

          <Input
            id="invite-email"
            type="email"
            value={email}
            required
            disabled={submitting}
            autoComplete="email"
            inputMode="email"
            placeholder="Enter employee email"
            onChange={(e) => setEmail(e.target.value)}
            className="h-9 shadow-sm transition placeholder:text-[#9b7d61] focus-visible:border-[#8c5a2b] focus-visible:ring-[#e0b887]/70"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="invite-first-name">First Name</FieldLabel>

          <Input
            id="invite-first-name"
            value={firstName}
            required
            disabled={submitting}
            autoComplete="given-name"
            inputMode="text"
            placeholder="Enter employee first name"
            onChange={(e) => setFirstName(e.target.value)}
            className="h-9 shadow-sm transition placeholder:text-[#9b7d61] focus-visible:border-[#8c5a2b] focus-visible:ring-[#e0b887]/70"
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="invite-middle-name">
            Middle Name
            <span className="ml-1 text-muted-foreground font-normal">
              (Optional)
            </span>
          </FieldLabel>

          <Input
            id="invite-middle-name"
            value={middleName}
            disabled={submitting}
            autoComplete="additional-name"
            inputMode="text"
            placeholder="Enter employee middle name"
            onChange={(e) => setMiddleName(e.target.value)}
            className="h-9 shadow-sm transition placeholder:text-[#9b7d61] focus-visible:border-[#8c5a2b] focus-visible:ring-[#e0b887]/70"
          />
        </Field>

        <div className="space-y-2">
          <Label htmlFor="invite-last-name">Last Name</Label>
          <Input
            id="invite-last-name"
            value={lastName}
            required
            disabled={submitting}
            autoComplete="family-name"
            inputMode="text"
            placeholder="Enter employee last name"
            onChange={(e) => setLastName(e.target.value)}
            className="h-9 shadow-sm transition placeholder:text-[#9b7d61] focus-visible:border-[#8c5a2b] focus-visible:ring-[#e0b887]/70"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="invite-role">Role</Label>
          <Select
            value={role}
            onValueChange={(value) => setRole(value as UserRole)}
          >
            <SelectTrigger className="h-9 w-full cursor-pointer">
              <SelectValue>{userRoleLabels[role]}</SelectValue>
            </SelectTrigger>

            <SelectContent>
              {Object.values(userRole).map((value) => (
                <SelectItem key={value} value={value}>
                  {userRoleLabels[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {message && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </p>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={submitting}
            className="cursor-pointer h-9 rounded-full px-6 bg-[#6f3e1d] text-[#fff8ef] hover:bg-[#8d5a2b]"
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            <span>{submitting ? "Creating invite..." : "Send Invite"}</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
