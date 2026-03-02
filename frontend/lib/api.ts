import { LoginInput, RegisterInput } from "./types";

/** Normalize API error message (string or array) for display */
export function getErrorMessage(
  message: string | string[] | undefined,
  fallback: string
): string {
  if (!message) return fallback;
  return Array.isArray(message) ? message.join(" ") : message;
}

export const registerUser = async (data: RegisterInput) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    },
  );
  const body = await response.json();
  if (!response.ok) {
    return {
      ...body,
      statusCode: body.statusCode ?? response.status,
      error: body.error ?? "Request failed",
      message: getErrorMessage(body.message, "Registration failed."),
    };
  }
  return body;
};

export const loginUser = async (data: LoginInput) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    },
  );
  const body = await response.json();
  if (!response.ok) {
    return {
      ...body,
      statusCode: body.statusCode ?? response.status,
      error: body.error ?? "Request failed",
      message: getErrorMessage(body.message, "Login failed."),
    };
  }
  return body;
};

export const logoutUser = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );
  return response.json();
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to fetch data.");
  }
  return res.json();
};
