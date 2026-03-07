import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

/** Proxy 2FA verify: we have pending_user on our domain; forward it to Railway. */
export async function POST(request: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { message: "Server misconfigured: NEXT_PUBLIC_API_URL missing" },
      { status: 500 },
    );
  }

  const pendingUser = request.cookies.get("pending_user")?.value;
  if (!pendingUser) {
    return NextResponse.json(
      { message: "Session expired. Please log in again." },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/auth/2fa/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `pending_user=${pendingUser}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    if (!data.success || !data.token) {
      return NextResponse.json(
        { message: "Verification failed" },
        { status: 400 },
      );
    }

    const isProd = process.env.NODE_ENV === "production";
    const response = NextResponse.json(data);
    response.cookies.set("access_token", data.token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60,
    });
    response.cookies.set("pending_user", "", {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (err) {
    console.error("2FA verify proxy error:", err);
    return NextResponse.json(
      { message: "Failed to verify 2FA code" },
      { status: 500 },
    );
  }
}
