import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BottomNav, SideNav } from "@/components/layout/bottom-nav";
import { getMSProfile } from "@/lib/ms-data";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await getMSProfile(session.user.id);

  return (
    <div
      className={`flex min-h-screen bg-constellation ${profile?.highContrast ? "high-contrast" : ""} ${profile?.largeText ? "text-lg" : ""}`}
    >
      <SideNav />
      <main className="flex-1 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl px-4 py-6 md:px-8">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
