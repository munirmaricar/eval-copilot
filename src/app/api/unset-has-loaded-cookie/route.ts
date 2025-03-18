import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json({ message: "Cookie unset successfully!" });

  response.cookies.set("has-loaded", "", {
    path: "/",
    expires: new Date(0),
  });

  return response;
}
