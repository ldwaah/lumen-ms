export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#2b2d35]">
      <div
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, rgba(233,61,82,0.15), transparent 40%), radial-gradient(circle at 80% 70%, rgba(77,166,255,0.12), transparent 40%)`,
        }}
      />
      <div className="relative flex min-h-screen items-center justify-center p-4">{children}</div>
    </div>
  );
}
