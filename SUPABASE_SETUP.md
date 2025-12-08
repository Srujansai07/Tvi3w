# Tvi3W - Supabase Configuration Guide

## Project Details
- **Project ID**: rnmsrpqwligboxggnktq
- **Project URL**: https://ptkoregmemknufnpnnfc.supabase.co
- **Database URL**: postgresql://postgres:[YOUR_PASSWORD]@db.rnmsrpqwligboxggnktq.supabase.co:5432/postgres

## Environment Variables Required

### For Local Development (.env.local)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ptkoregmemknufnpnnfc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_ROLE_KEY]

# Database
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.rnmsrpqwligboxggnktq.supabase.co:5432/postgres

# Gemini AI
GEMINI_API_KEY=AIzaSyDzH-UHaBU3glILoOr9moaR8aGeg88tWv8

# NextAuth
NEXTAUTH_URL=https://tvi3w-ai.vercel.app
NEXTAUTH_SECRET=[GENERATE_RANDOM_SECRET]

# OAuth (Optional)
GITHUB_ID=[YOUR_GITHUB_ID]
GITHUB_SECRET=[YOUR_GITHUB_SECRET]
GOOGLE_CLIENT_ID=[YOUR_GOOGLE_CLIENT_ID]
GOOGLE_CLIENT_SECRET=[YOUR_GOOGLE_CLIENT_SECRET]
```

### For Vercel Production
Add the same variables in Vercel dashboard:
- Settings → Environment Variables
- Add for Production, Preview, and Development

## Setup Steps

### 1. Run Database Migration
```bash
# Navigate to Supabase SQL Editor
# Copy and paste the contents of supabase/migrations/001_initial_schema.sql
# Execute the SQL
```

### 2. Enable Authentication Providers
1. Go to Authentication → Providers
2. Enable Email provider
3. Enable Google OAuth (optional)
4. Enable GitHub OAuth (optional)

### 3. Configure Storage
1. Go to Storage
2. Create buckets:
   - `meeting-recordings` (for audio/video)
   - `user-avatars` (for profile pictures)
   - `transcripts` (for transcript files)

### 4. Set Storage Policies
```sql
-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'meeting-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to read their own files
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'meeting-recordings' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 5. Get API Keys
1. Go to Project Settings → API
2. Copy `anon` public key
3. Copy `service_role` secret key (keep secure!)

## Testing Connection

Create `lib/supabase/client.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Test with:
```typescript
const { data, error } = await supabase.from('users').select('*').limit(1)
console.log('Connection test:', data, error)
```

## Next Steps
- ✅ Database schema created
- ⏳ Supabase configuration documented
- ⏳ Environment variables to be set
- ⏳ Migration to be executed
