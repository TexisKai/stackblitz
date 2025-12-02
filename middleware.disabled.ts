import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
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
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // =====================================================
  // USER NOT LOGGED IN → BLOCK PROTECTED ROUTES
  // =====================================================
  if (!user) {
    if (
      request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/onboarding')
    ) {
      console.log('No user found → redirect to /auth');
      return NextResponse.redirect(new URL('/auth', request.url));
    }

    return response;
  }

  console.log('User authenticated:', user.email);

  // =====================================================
  // FETCH STUDENT DATA TO CHECK ONBOARDING STATUS
  // =====================================================
  const { data: student } = await supabase
    .from('students')
    .select('onboarding_complete')
    .eq('auth_id', user.id)
    .single();

  // =====================================================
  // USER IS LOGGED IN BUT HAS NOT ONBOARDED
  // Trying to access dashboard → redirect to onboarding
  // =====================================================
  if (
    request.nextUrl.pathname.startsWith('/dashboard') &&
    !student?.onboarding_complete
  ) {
    console.log('User not onboarded → redirect to /onboarding');
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // =====================================================
  // USER HAS COMPLETED ONBOARDING
  // Trying to access onboarding → redirect to dashboard
  // =====================================================
  if (
    request.nextUrl.pathname.startsWith('/onboarding') &&
    student?.onboarding_complete
  ) {
    console.log('User already onboarded → redirect to /dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/auth/:path*', '/onboarding/:path*', '/dashboard/:path*', '/api/:path*'],
};
