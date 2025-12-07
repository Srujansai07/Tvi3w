-- Migration: Add missing columns to meetings table
-- Run this in Supabase SQL Editor

-- Add location column
ALTER TABLE public.meetings 
ADD COLUMN IF NOT EXISTS location text;

-- Add status column
ALTER TABLE public.meetings 
ADD COLUMN IF NOT EXISTS status text 
CHECK (status IN ('scheduled', 'completed', 'cancelled')) 
DEFAULT 'scheduled';

-- Add meeting_type column if using that name instead of 'type'
ALTER TABLE public.meetings 
ADD COLUMN IF NOT EXISTS meeting_type text 
CHECK (meeting_type IN ('interview', 'meeting', 'lecture', 'personal_note', 'other')) 
DEFAULT 'meeting';

-- Optionally add archived column for notes
ALTER TABLE public.notes 
ADD COLUMN IF NOT EXISTS archived boolean DEFAULT false;

-- Add name column to contacts if missing (for backward compatibility)
-- Note: Schema uses first_name and last_name, but some code may expect 'name'
ALTER TABLE public.contacts 
ADD COLUMN IF NOT EXISTS name text;

-- Update existing contacts to populate name from first_name
UPDATE public.contacts 
SET name = COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')
WHERE name IS NULL;

-- Done! You can now create meetings with location and status fields.
