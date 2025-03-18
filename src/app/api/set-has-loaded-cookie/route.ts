import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Cookie set successfully!" });

  response.cookies.set("has-loaded", "true", {
    path: "/",
    maxAge: 60 * 60 * 24 * 30 * 12 * 10000,
  });

  return response;
}
