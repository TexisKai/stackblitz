// Auto-generated types from Supabase
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      activities: {
        Row: {
          id: string
          created_at: string
          description: string | null
          user_id: string | null
          type: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          description?: string | null
          user_id?: string | null
          type?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          description?: string | null
          user_id?: string | null
          type?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}
