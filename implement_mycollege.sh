#!/bin/bash
set -e

echo "🚀 MyCollege Full System Implementation Starting..."

# Create session.ts
cat > lib/auth/session.ts << 'EOF'
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
EOF

echo "✅ Created lib/auth/session.ts"

# Update lib/supabase/server.ts
cat > lib/supabase/server.ts << 'EOF'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { Database } from './types'

export async function createServerSupabase() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Cookie setting can fail in Server Components
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Cookie removal can fail in Server Components
          }
        },
      },
    }
  )
}
EOF

echo "✅ Updated lib/supabase/server.ts"

# Update lib/supabaseBrowser.ts
cat > lib/supabaseBrowser.ts << 'EOF'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './supabase/types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const supabase = createClient()
EOF

echo "✅ Updated lib/supabaseBrowser.ts"

echo "✨ Phase 1 Complete: Supabase Client Architecture"

