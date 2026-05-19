import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BottomNav, SideNav } from "@/components/layout/bottom-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-constellation">
      <SideNav />
      <main className="flex-1 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl px-4 py-6 md:px-8">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
