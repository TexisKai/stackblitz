import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseClient";

export async function middleware(req) {
  const res = NextResponse.next();

  const supabase = createClient(req, res);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  const publicRoutes = [
    "/auth",
    "/auth/verify",
    "/auth/error",
    "/auth/callback",
    "/check-email",
    "/"
  ];

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return res;
  }

  if (!session) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next|static|api|public).*)"],
};
