import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export default async function Dashboard() {
  const cookieStore = cookies();
  // const cookieHeader = (await cookieStore)
  //   .getAll()
  //   .map((cookie) => `${cookie.name}=${cookie.value}`)
  //   .join("; ");
  // if (!cookieHeader.includes("access_token=")) redirect("/login");

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

  return <div>{(await res.json()).email}</div>;
}
