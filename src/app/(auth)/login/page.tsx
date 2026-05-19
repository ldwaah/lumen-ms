import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-[2rem] bg-[#fdfcf9] px-8 py-10 shadow-2xl">
        <div className="mb-8 text-center">
          <p className="text-2xl font-black tracking-tight text-[#e93d52]">LUMEN</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">
            Navigate MS with clarity
          </p>
          <div className="mx-auto mt-4 h-px w-16 bg-gray-200" />
        </div>
        <Suspense fallback={<p className="text-center text-gray-500">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
