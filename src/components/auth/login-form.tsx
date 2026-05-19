"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/today";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="border-gray-200 bg-white text-gray-900"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Password
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-gray-200 bg-white text-gray-900"
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[#e93d52] text-white hover:bg-[#d43548]"
        size="lg"
      >
        {loading ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-center text-sm text-gray-600">
        New to Lumen?{" "}
        <Link href="/signup" className="font-semibold text-[#e93d52]">
          Create an account
        </Link>
      </p>
      <p className="rounded-lg bg-blue-50 px-3 py-2 text-center text-xs text-gray-600">
        Demo: <span className="font-mono">alex@lumenlearn.app</span> /{" "}
        <span className="font-mono">learn123</span>
      </p>
    </form>
  );
}
