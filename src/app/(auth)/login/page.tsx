export const dynamic = "force-dynamic";

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Gamepad2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Invalid email or password");
      return;
    }

    toast.success("Welcome back!");
    router.push(callbackUrl);
    router.refresh();
  };

  const handleDemoLogin = async (email: string) => {
    setLoading(true);
    await signIn("credentials", { email, password: "password123", redirect: false });
    setLoading(false);
    toast.success("Logged in as demo user!");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 bg-brand rounded-2xl items-center justify-center shadow-lg shadow-brand/30 mb-4">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your GameLog account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-2.5 mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-border" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-500">
              <span className="bg-dark-card px-2">or try a demo account</span>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { email: "playerone@gamelog.dev", label: "Player One", desc: "Souls-like enthusiast" },
              { email: "questmaster@gamelog.dev", label: "Quest Master", desc: "RPG completionist" },
              { email: "indiegem@gamelog.dev", label: "Indie Gem", desc: "Indie game lover" },
            ].map(({ email, label, desc }) => (
              <button
                key={email}
                onClick={() => handleDemoLogin(email)}
                disabled={loading}
                className="w-full btn-secondary justify-start text-left"
              >
                <span className="font-medium text-white">{label}</span>
                <span className="text-gray-500 text-xs ml-2">· {desc}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            No account?{" "}
            <Link href="/register" className="text-brand hover:text-brand-light transition-colors font-medium">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
