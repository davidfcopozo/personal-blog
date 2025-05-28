import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = [
  "/dashboard",
  "/settings",
  "/profile",
  "/new-post",
  "/edit-post",
  "/new",
  "/edit",
];

const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  if (pathname === "/auth") {
    if (token) {
      const dashboardUrl = new URL("/dashboard", request.nextUrl.origin);
      return NextResponse.redirect(dashboardUrl.toString());
    } else {
      const loginUrl = new URL("/login", request.nextUrl.origin);
      return NextResponse.redirect(loginUrl.toString());
    }
  }

  if (pathname === "/users" || pathname === "/user") {
    if (token) {
      const userProfileUrl = new URL(
        `/users/${token.sub}`,
        request.nextUrl.origin
      );
      return NextResponse.redirect(userProfileUrl.toString());
    } else {
      const loginUrl = new URL("/login", request.nextUrl.origin);
      return NextResponse.redirect(loginUrl.toString());
    }
  }

  const isProtectedRoute =
    protectedRoutes.some((route) => pathname.startsWith(route)) ||
    pathname.startsWith("/edit-post/");

  const isAuthRoute = authRoutes.some((route) => pathname === route);

  if (isProtectedRoute && !token) {
    const absoluteUrl = new URL("/login", request.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
  }

  if (isAuthRoute && token) {
    const absoluteUrl = new URL("/dashboard", request.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
  }

  return NextResponse.next();
}
