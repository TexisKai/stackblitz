import { cookies } from 'next/headers'

export async function storeRememberMe(value: boolean) {
  const cookieStore = await cookies()
  
  if (value) {
    cookieStore.set('sb-remember-me', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
  } else {
    cookieStore.delete('sb-remember-me')
  }
}

export async function getRememberMe(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get('sb-remember-me')?.value === 'true'
}
