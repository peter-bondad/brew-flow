import { InviteUserForm } from "@/app/components/admin/InviteUserForm";
import { Card, CardContent } from "@/components/ui/card";
import { requirePermission } from "@/lib/auth-guard";
import { MailPlus } from "lucide-react";

export default async function InvitationsPage() {
  await requirePermission({
    invitation: ["create"],
  });
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <section className="rounded-3xl bg-[linear-gradient(135deg,#4a2b1c_0%,#6e3d1f_45%,#c67e3f_100%)] p-8 text-[#fff9f2] shadow-lg">
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

      <Card className="rounded-3xl border-[#e5c5a3]">
        <CardContent className="p-8">
          <InviteUserForm />
        </CardContent>
      </Card>
    </div>
  );
}
