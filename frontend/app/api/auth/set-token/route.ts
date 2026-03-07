import { NextRequest, NextResponse } from "next/server";

/** Set access_token cookie for our domain (used by 2FA verify + OAuth callback) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = typeof body?.token === "string" ? body.token : null;

    if (!token) {
      return NextResponse.json(
        { message: "Token required" },
        { status: 400 },
      );
    }

    const isProd = process.env.NODE_ENV === "production";
    const response = NextResponse.json({ success: true });
    response.cookies.set("access_token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Invalid request" },
      { status: 400 },
    );
  }
}
