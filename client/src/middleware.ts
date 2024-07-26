import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/dashboard", "/settings", "/profile", "/new-post"];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  });

  if (protectedRoutes.includes(request.nextUrl.pathname) && !token) {
    const absoluteUrl = new URL("/login ", request.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
  } /* else if (request.nextUrl.pathname === "/login" && token) {
    const absoluteUrl = new URL("/dashboard", request.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
  } */

  return NextResponse.next();
}
