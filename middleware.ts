import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // protect /admin routes (basic guard based on Supabase auth cookies)
  if (pathname.startsWith("/admin")) {
    const hasAccessToken = !!req.cookies.get("sb-access-token")?.value;
    const hasRefreshToken = !!req.cookies.get("sb-refresh-token")?.value;

    if (!hasAccessToken && !hasRefreshToken) {
      // redirect to home (or sign-in)
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
