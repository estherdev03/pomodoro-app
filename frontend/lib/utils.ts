"use server";
import { cookies } from "next/headers";

export const hasToken = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;
  return !!token;
};
export const getToken = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("access_token")?.value;
  return token;
};
