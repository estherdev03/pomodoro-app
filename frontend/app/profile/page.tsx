import Enable2FA from "@/components/auth/Enable2FA";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { User, Shield } from "lucide-react";

export default async function ProfilePage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;
  if (!token) redirect("/login");
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) redirect("/login");
  const { email } = await res.json();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="text-slate-600 mt-0.5">Manage your account settings</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center">
              <User className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900">Account</h2>
              <p className="text-slate-600 text-sm">{email}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-indigo-500" />
            <h2 className="font-semibold text-slate-900">Two-Factor Authentication</h2>
          </div>
          <Enable2FA />
        </div>
      </div>
    </div>
  );
}
