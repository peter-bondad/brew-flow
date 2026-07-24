import { InviteUserForm } from "@/app/(protected)/admin/invite/components/InviteUserForm";
import { Card, CardContent } from "@/components/ui/card";
import { ensurePermission } from "@/lib/auth-guard";
import { MailPlus } from "lucide-react";

export default async function InvitationsPage() {
  await ensurePermission({
    invitation: ["create"],
  });

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="mx-auto max-w-5xl rounded-3xl bg-[linear-gradient(135deg,#4a2b1c_0%,#6e3d1f_45%,#c67e3f_100%)] p-6 text-[#fff9f2] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-white/10 p-3">
            <MailPlus className="size-6" />
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#f7d8b2]">
              Administration
            </p>

            <h1 className="text-3xl font-semibold">Invite a Team Member</h1>
          </div>
        </div>

        <p className="mt-5 max-w-2xl text-[#f7e9d8]">
          Send an invitation to a new employee. They will receive an email with
          a secure invitation link to create their account.
        </p>
      </section>

      {/* Form */}
      <div className="mx-auto w-full max-w-2xl">
        <Card className="rounded-3xl border-[#e5c5a3]">
          <CardContent className="p-6">
            <InviteUserForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
