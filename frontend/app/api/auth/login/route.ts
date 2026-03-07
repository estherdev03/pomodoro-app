import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

/** Extract access_token value from Set-Cookie header */
function extractAccessToken(setCookieHeader: string | null): string | null {
  if (!setCookieHeader) return null;
  const match = setCookieHeader.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
}

export async function POST(request: NextRequest) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { message: "Server misconfigured: NEXT_PUBLIC_API_URL missing" },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { ...data, statusCode: data.statusCode ?? res.status },
        { status: res.status },
      );
    }

    // 2FA flow: backend sets pending_user cookie on its domain; we don't mirror it.
    // Client will call /api/auth/2fa/verify after verification.
    if (data.twoFARequired) {
      return NextResponse.json(data);
    }

    // Normal login: extract token from backend's Set-Cookie and set for our domain
    const setCookie = res.headers.get("set-cookie");
    const token = extractAccessToken(setCookie);

    if (!token) {
      return NextResponse.json(
        { message: "Login succeeded but token missing from backend response" },
        { status: 500 },
      );
    }

    const isProd = process.env.NODE_ENV === "production";
    const response = NextResponse.json(data);
    response.cookies.set("access_token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "lax" : "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 1 day
    });

    return response;
  } catch (err) {
    console.error("Login proxy error:", err);
    return NextResponse.json(
      { message: "An error occurred while signing in" },
      { status: 500 },
    );
  }
}
