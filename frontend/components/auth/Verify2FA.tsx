"use client";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Verify2FA() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { setLoggedIn } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const from = searchParams.get("from");
      const isOauth = from === "oauth";

      // Email/password login uses our proxy so pending_user (on frontend domain) is sent to Railway
      // OAuth login calls backend directly; pending_user is on backend domain
      const response = await fetch(
        isOauth
          ? `${process.env.NEXT_PUBLIC_API_URL}/auth/2fa/verify`
          : "/api/auth/2fa/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ code }),
        },
      );
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to verify 2FA code.");
      }
      const data = await response.json();
      if (!data.success || !data.token) throw new Error("Cannot verify 2FA code.");

      // For OAuth, backend sets cookie on its own domain; mirror to our domain
      if (isOauth) {
        const setTokenRes = await fetch("/api/auth/set-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ token: data.token }),
        });
        if (!setTokenRes.ok) throw new Error("Failed to complete sign in.");
      }

      setSuccess(true);
      setLoggedIn(true);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to verify 2FA code. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Two-Factor Verification
          </h1>
          <p className="text-slate-600 mt-1 text-sm">
            Enter the code from your authenticator app
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="code" className="block text-sm font-medium text-slate-700">
            6-digit code
          </label>
          <input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 font-mono text-lg tracking-widest"
            maxLength={6}
            required
            autoFocus
            placeholder="000000"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          {success && (
            <p className="text-emerald-600 text-sm font-medium">
              Verification successful! Redirecting...
            </p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
}
