type InvitationErrorPageProps = {
  status: "not_found" | "expired" | "already_accepted";
};

const content: Record<
  InvitationErrorPageProps["status"],
  { title: string; description: string; ctaHref: string; ctaLabel: string }
> = {
  not_found: {
    title: "Invitation not found",
    description:
      "This invitation link is invalid. Double-check the link or ask for a new one.",
    ctaHref: "/login",
    ctaLabel: "Go to login",
  },
  expired: {
    title: "Invitation expired",
    description:
      "This invitation link has expired. Ask an admin to send a new one.",
    ctaHref: "/login",
    ctaLabel: "Go to login",
  },
  already_accepted: {
    title: "Invitation already used",
    description:
      "This invitation has already been accepted. Log in with your account instead.",
    ctaHref: "/login",
    ctaLabel: "Go to login",
  },
};

export function InvitationErrorPage({ status }: InvitationErrorPageProps) {
  const { title, description, ctaHref, ctaLabel } = content[status];

  return (
    <main className="min-h-screen bg-[#fff8ef] flex items-center justify-center px-6">
      <div className="max-w-md space-y-4 rounded-3xl border border-[#ead8c7] bg-white p-10 text-center shadow-[0_25px_70px_-30px_rgba(61,35,22,0.35)]">
        <h1 className="text-2xl font-bold text-[#3f2718]">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>

        <a
          href={ctaHref}
          className="inline-block rounded-lg bg-[#6f3e1d] px-6 py-3 text-sm font-medium text-white"
        >
          {ctaLabel}
        </a>
      </div>
    </main>
  );
}
