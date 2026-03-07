import { Suspense } from "react";
import Verify2FA from "@/components/auth/Verify2FA";

export const dynamic = "force-dynamic";

export default function Verify2FAPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4">
          <p className="text-slate-600">Loading...</p>
        </div>
      }
    >
      <Verify2FA />
    </Suspense>
  );
}
