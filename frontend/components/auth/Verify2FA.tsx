"use client";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Verify2FA() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const { setLoggedIn } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/2fa/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ code }),
        },
      );
      if (!response.ok) throw new Error("Failed to verify 2FA code.");
      const data = await response.json();
      if (!data.success) throw new Error("Cannot verify 2FA code.");
      setSuccess(true);
      setLoggedIn(true);
      router.push("/dashboard");
    } catch (error) {
      throw new Error("Failed to verify 2FA code. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">
        Verify Two-Factor Authentication
      </h1>
      <form className="w-full max-w-sm bg-white p-6 rounded shadow">
        <label htmlFor="code" className="block mb-2 font-medium">
          Enter your 2FA code
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
          maxLength={6}
          required
          autoFocus
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        {success && (
          <p className="text-green-500 mb-2">Verification successful!</p>
        )}
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
