import { Coffee } from "lucide-react";
import { AcceptInviteForm } from "../accept/components/AcceptInviteForm";
import { container } from "@/server/container";
import { InvitationErrorPage } from "../accept/components/InvitationErrorPage";

type AcceptInvitationPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function AcceptInvitationPage({
  params,
}: AcceptInvitationPageProps) {
  const { token } = await params;

  const result =
    await container.invitationService.getInvitationForDisplay(token);

  if (result.status !== "valid") {
    return <InvitationErrorPage status={result.status} />;
  }

  const { invitation } = result;

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
                You&apos;re almost
                <br />
                ready.
              </h1>

              <p className="mt-5 max-w-md text-[15px] leading-7 text-[#f6eadf]">
                Complete your invitation by creating your account. Once
                you&apos;re finished, you&apos;ll be able to access your
                dashboard and start managing your workspace.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
              <p className="text-sm text-[#f5e7d8]">
                ☕ Welcome to the team. Good software, like good coffee, starts
                with the right ingredients.
              </p>
            </div>
          </section>

          <section className="flex items-center justify-center p-8 sm:p-12">
            <div className="w-full max-w-md space-y-8">
              <div className="space-y-3">
                <div className="inline-flex rounded-full bg-[#f6ede6] px-3 py-1 text-xs font-medium text-[#6f3e1d]">
                  Invitation
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-[#3f2718]">
                  Create your account
                </h2>

                <p className="text-sm leading-6 text-muted-foreground">
                  Finish setting up your account by creating a secure password.
                </p>
              </div>

              <AcceptInviteForm
                token={token}
                email={invitation.email}
                initialName={invitation.name}
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
