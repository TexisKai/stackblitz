import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // If not authenticated
  if (!user) {
    if (
      request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/onboarding')
    ) {
      return NextResponse.redirect(new URL('/auth', request.url));
    }
    return response;
  }

  // Get student profile to check onboarding status
  const { data: student } = await supabase
    .from('students')
    .select('onboarding_complete')
    .eq('auth_id', user.id)
    .single();

  // If trying to access dashboard but not onboarded
  if (
    request.nextUrl.pathname.startsWith('/dashboard') &&
    !student?.onboarding_complete
  ) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // If trying to access onboarding but already complete
  if (
    request.nextUrl.pathname.startsWith('/onboarding') &&
    student?.onboarding_complete
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/auth/:path*', '/onboarding/:path*', '/dashboard/:path*', '/api/:path*'],
};