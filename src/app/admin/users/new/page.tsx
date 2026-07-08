import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { InviteUserForm } from "./components/InviteUserForm";

export default async function NewAdminUserPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const roleCheck = await auth.api.userHasPermission({
    body: {
      role: "admin",
      permissions: {
        invitation: ["create"],
      },
    },
  });

  const canCreateInvite = await auth.api.userHasPermission({
    body: {
      userId: session.user.id,
      permissions: {
        invitation: ["create"],
      },
    },
  });

  if (!canCreateInvite.success) {
    return (
      <main className="min-h-screen bg-[#fffaf5] px-6">
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center">
          <div className="w-full max-w-lg rounded-3xl border border-[#d9b07f]/20 bg-white p-10 text-center shadow-[0_30px_80px_-40px_rgba(74,43,28,0.35)]">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#8d5a2b]">
              Coffee Admin
            </p>

            <div className="mt-6 flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-[#f8ede1] text-3xl">
                ☕
              </div>
            </div>

            <h1 className="mt-6 text-3xl font-semibold text-[#3d2413]">
              Access denied
            </h1>

            <p className="mt-4 leading-relaxed text-[#7b5f46]">
              Your account doesn't have permission to create invitations. Please
              contact another administrator if you believe this is incorrect.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fffaf5] px-6 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-[#d9b07f]/20 bg-white shadow-[0_30px_80px_-40px_rgba(74,43,28,0.35)]">
          <div className="border-b border-[#d9b07f]/15 bg-gradient-to-r from-[#fff8ef] via-[#fffaf5] to-[#f8ede1] px-8 py-8">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#8d5a2b]">
              Coffee Admin
            </p>

            <h1 className="mt-3 text-4xl font-semibold text-[#3d2413]">
              Invite a new team member
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#7b5f46]">
              Create a secure one time invitation link for your staff. The
              invite link will be printed in the development console until email
              delivery is configured.
            </p>
          </div>

          <div className="p-8">
            <InviteUserForm />
          </div>
        </div>
      </div>
    </main>
  );
}
