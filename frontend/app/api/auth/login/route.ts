import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

/** Extract value from Set-Cookie header by name */
function extractCookieValue(
  setCookieHeader: string | null,
  name: string,
): string | null {
  if (!setCookieHeader) return null;
  const match = setCookieHeader.match(
    new RegExp(`${name}=([^;]+)`),
  );
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

    // 2FA flow: store pending_user on our domain so our 2FA verify proxy can send it to Railway
    if (data.twoFARequired) {
      const setCookie = res.headers.get("set-cookie");
      const pendingUser = extractCookieValue(setCookie, "pending_user");
      const response = NextResponse.json(data);
      if (pendingUser) {
        const isProd = process.env.NODE_ENV === "production";
        response.cookies.set("pending_user", pendingUser, {
          httpOnly: true,
          secure: isProd,
          sameSite: "lax",
          path: "/",
          maxAge: 5 * 60, // 5 min
        });
      }
      return response;
    }

    // Normal login: extract token from backend's Set-Cookie and set for our domain
    const setCookie = res.headers.get("set-cookie");
    const token = extractCookieValue(setCookie, "access_token");

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
