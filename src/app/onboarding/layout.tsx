export default function OnboardingRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-constellation">
      <div className="mx-auto max-w-lg px-4 py-8">{children}</div>
    </div>
  );
}
