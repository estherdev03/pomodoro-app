import Enable2FA from "@/components/auth/Enable2FA";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

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
  if (!res.ok) {
    redirect("/login");
  }
  return <Enable2FA />;
}
