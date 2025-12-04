import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
})

// Database types (will be auto-generated later)
export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    name: string
                    avatar_url: string | null
                    profession: string | null
                    industry: string | null
                    preferred_language: string
                    created_at: string
                    updated_at: string
                    last_active: string
                }
                Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['users']['Insert']>
            }
            meetings: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    type: 'professional' | 'presentation' | 'interview' | 'informal'
                    start_time: string
                    end_time: string | null
                    duration_seconds: number | null
                    transcript: string | null
                    summary: string | null
                    key_points: string[] | null
                    recording_url: string | null
                    transcript_url: string | null
                    sentiment: 'positive' | 'neutral' | 'negative' | null
                    engagement_score: number | null
                    is_transcription_complete: boolean
                    is_analyzed: boolean
                    tags: string[] | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['meetings']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['meetings']['Insert']>
            }
            contacts: {
                Row: {
                    id: string
                    user_id: string
                    first_name: string
                    last_name: string
                    email: string
                    phone: string | null
                    company: string | null
                    job_title: string | null
                    industry: string | null
                    expertise: string[] | null
                    linkedin_url: string | null
                    twitter_handle: string | null
                    website_url: string | null
                    relationship_type: 'client' | 'prospect' | 'partner' | 'friend' | 'colleague' | null
                    last_interaction: string | null
                    interaction_count: number
                    next_follow_up_date: string | null
                    preferred_contact_method: 'email' | 'phone' | 'linkedin' | null
                    timezone: string | null
                    language: string | null
                    personal_notes: string | null
                    tags: string[] | null
                    custom_fields: any | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['contacts']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['contacts']['Insert']>
            }
        }
    }
}
