"use client";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Enable2FA() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const generateSecret = async () => {
    setMessage(null);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/2fa/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to generate 2FA secret.");
      const data = await response.json();
      setQrCode(data.qrCode);
      setMessage({ type: "success", text: "Scan the QR code with your authenticator app." });
    } catch (err) {
      setMessage({ type: "error", text: "Could not generate 2FA secret. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const enable2FA = async () => {
    setMessage(null);
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/2fa/enable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setMessage({ type: "error", text: data.message || "Invalid code. Please try again." });
        return;
      }
      setMessage({ type: "success", text: "2FA enabled successfully!" });
      setQrCode(null);
      setCode("");
    } catch (err) {
      setMessage({ type: "error", text: "Failed to enable 2FA. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-slate-600 text-sm">
        Add an extra layer of security by enabling two-factor authentication.
      </p>

      <button
        type="button"
        onClick={generateSecret}
        disabled={loading}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
      >
        {loading && !qrCode ? "Generating..." : "Generate 2FA secret"}
      </button>

      {qrCode && (
        <>
          <div className="flex justify-center p-4 bg-slate-50 rounded-xl">
            <img src={qrCode} alt="2FA QR Code" className="w-36 h-36" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Enter the 6-digit code from your app
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-lg"
            />
          </div>
          <button
            type="button"
            onClick={enable2FA}
            disabled={loading || code.length !== 6}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
          >
            Enable 2FA
          </button>
        </>
      )}

      {message && (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
