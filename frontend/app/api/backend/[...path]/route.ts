import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { message: "Server misconfigured: NEXT_PUBLIC_API_URL missing" },
      { status: 500 },
    );
  }

  const { path } = await context.params;
  const pathStr = path?.join("/") ?? "";
  const searchParams = request.nextUrl.searchParams.toString();
  const url = `${BACKEND_URL.replace(/\/$/, "")}/${pathStr}${searchParams ? `?${searchParams}` : ""}`;

  const token = request.cookies.get("access_token")?.value;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("connection");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const body = request.method !== "GET" && request.method !== "HEAD"
      ? await request.text()
      : undefined;

    const res = await fetch(url, {
      method: request.method,
      headers,
      body,
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Backend proxy error:", err);
    return NextResponse.json(
      { message: "Failed to reach backend" },
      { status: 502 },
    );
  }
}
