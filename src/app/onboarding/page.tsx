import { auth } from "@/lib/auth";
import { getMSProfile } from "@/lib/ms-data";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await getMSProfile(session.user.id);

  if (profile?.onboardingDone) {
    redirect("/today");
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Welcome to Lumen</h1>
        <p className="mt-1 text-[var(--color-fg-muted)]">
          Let&apos;s personalise your MS coaching experience. This takes about 2
          minutes.
        </p>
      </header>
      <div className="glass rounded-3xl p-6">
        <OnboardingForm />
      </div>
    </div>
  );
}
