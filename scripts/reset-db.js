const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

const TABLES = [
    'action_items',
    'participants',
    'insights',
    'notes',
    'contacts',
    'meetings',
    'users'
];

const SQL_DEFINITIONS = {
    users: `
        create table public.users (
          id uuid references auth.users not null primary key,
          email text unique not null,
          name text,
          avatar_url text,
          profession text,
          industry text,
          preferred_language text default 'en',
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
          last_active timestamp with time zone default timezone('utc'::text, now())
        );
        alter table public.users enable row level security;
        create policy "Users can view own profile" on public.users for select using ( auth.uid() = id );
        create policy "Users can update own profile" on public.users for update using ( auth.uid() = id );
    `,
    meetings: `
        create table public.meetings (
          id uuid default gen_random_uuid() primary key,
          user_id uuid references public.users(id) on delete cascade not null,
          title text not null,
          description text,
          type text check (type in ('interview', 'meeting', 'lecture', 'personal_note', 'other')) default 'meeting',
          start_time timestamp with time zone default timezone('utc'::text, now()) not null,
          end_time timestamp with time zone,
          duration_seconds integer,
          transcript text,
          summary text,
          key_points text[],
          recording_url text,
          transcript_url text,
          sentiment text,
          engagement_score integer,
          is_transcription_complete boolean default false,
          is_analyzed boolean default false,
          tags text[],
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
        alter table public.meetings enable row level security;
        create policy "Users can view own meetings" on public.meetings for select using ( auth.uid() = user_id );
        create policy "Users can insert own meetings" on public.meetings for insert with check ( auth.uid() = user_id );
        create policy "Users can update own meetings" on public.meetings for update using ( auth.uid() = user_id );
        create policy "Users can delete own meetings" on public.meetings for delete using ( auth.uid() = user_id );
    `,
    contacts: `
        create table public.contacts (
          id uuid default gen_random_uuid() primary key,
          user_id uuid references public.users(id) on delete cascade not null,
          first_name text not null,
          last_name text,
          email text,
          phone text,
          company text,
          job_title text,
          industry text,
          expertise text[],
          linkedin_url text,
          twitter_handle text,
          website_url text,
          relationship_type text,
          last_interaction timestamp with time zone,
          interaction_count integer default 0,
          next_follow_up_date timestamp with time zone,
          preferred_contact_method text,
          timezone text,
          language text,
          personal_notes text,
          tags text[],
          custom_fields jsonb,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
          unique(user_id, email)
        );
        alter table public.contacts enable row level security;
        create policy "Users can view own contacts" on public.contacts for select using ( auth.uid() = user_id );
        create policy "Users can insert own contacts" on public.contacts for insert with check ( auth.uid() = user_id );
        create policy "Users can update own contacts" on public.contacts for update using ( auth.uid() = user_id );
        create policy "Users can delete own contacts" on public.contacts for delete using ( auth.uid() = user_id );
    `,
    notes: `
        create table public.notes (
          id uuid default gen_random_uuid() primary key,
          user_id uuid references public.users(id) on delete cascade not null,
          meeting_id uuid references public.meetings(id) on delete set null,
          content text not null,
          tags text[],
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
        alter table public.notes enable row level security;
        create policy "Users can view own notes" on public.notes for select using ( auth.uid() = user_id );
        create policy "Users can insert own notes" on public.notes for insert with check ( auth.uid() = user_id );
        create policy "Users can update own notes" on public.notes for update using ( auth.uid() = user_id );
        create policy "Users can delete own notes" on public.notes for delete using ( auth.uid() = user_id );
    `,
    insights: `
        create table public.insights (
          id uuid default gen_random_uuid() primary key,
          user_id uuid references public.users(id) on delete cascade not null,
          meeting_id uuid references public.meetings(id) on delete cascade,
          type text check (type in ('action_item', 'decision', 'question', 'highlight')),
          content text not null,
          priority text check (priority in ('high', 'medium', 'low')),
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
        alter table public.insights enable row level security;
        create policy "Users can view own insights" on public.insights for select using ( auth.uid() = user_id );
        create policy "Users can insert own insights" on public.insights for insert with check ( auth.uid() = user_id );
        create policy "Users can update own insights" on public.insights for update using ( auth.uid() = user_id );
        create policy "Users can delete own insights" on public.insights for delete using ( auth.uid() = user_id );
    `,
    participants: `
        create table public.participants (
          id uuid default gen_random_uuid() primary key,
          meeting_id uuid references public.meetings(id) on delete cascade not null,
          name text not null,
          email text,
          role text,
          company text,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
        alter table public.participants enable row level security;
        create policy "Users can view participants for their meetings" on public.participants for select using ( exists ( select 1 from public.meetings where meetings.id = participants.meeting_id and meetings.user_id = auth.uid() ) );
        create policy "Users can insert participants for their meetings" on public.participants for insert with check ( exists ( select 1 from public.meetings where meetings.id = participants.meeting_id and meetings.user_id = auth.uid() ) );
        create policy "Users can update participants for their meetings" on public.participants for update using ( exists ( select 1 from public.meetings where meetings.id = participants.meeting_id and meetings.user_id = auth.uid() ) );
        create policy "Users can delete participants for their meetings" on public.participants for delete using ( exists ( select 1 from public.meetings where meetings.id = participants.meeting_id and meetings.user_id = auth.uid() ) );
    `,
    action_items: `
        create table public.action_items (
          id uuid default gen_random_uuid() primary key,
          user_id uuid references public.users(id) on delete cascade not null,
          meeting_id uuid references public.meetings(id) on delete cascade,
          content text not null,
          status text check (status in ('pending', 'in_progress', 'completed', 'cancelled')) default 'pending',
          due_date timestamp with time zone,
          assignee_name text,
          assignee_email text,
          priority text check (priority in ('high', 'medium', 'low')),
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
        alter table public.action_items enable row level security;
        create policy "Users can view own action items" on public.action_items for select using ( auth.uid() = user_id );
        create policy "Users can insert own action items" on public.action_items for insert with check ( auth.uid() = user_id );
        create policy "Users can update own action items" on public.action_items for update using ( auth.uid() = user_id );
        create policy "Users can delete own action items" on public.action_items for delete using ( auth.uid() = user_id );
    `
};

async function reset() {
    try {
        console.log('Connecting to Supabase Database...');
        await client.connect();
        console.log('CONNECTED.');

        // 1. Drop Tables
        console.log('\n--- DROPPING TABLES ---');
        for (const table of TABLES) {
            process.stdout.write(`Dropping public.${table}... `);
            await client.query(`DROP TABLE IF EXISTS public.${table} CASCADE`);
            console.log('DONE.');
        }

        // 2. Re-create Tables
        console.log('\n--- RE-CREATING TABLES ---');
        const createOrder = ['users', 'meetings', 'contacts', 'notes', 'insights', 'participants', 'action_items'];
        for (const table of createOrder) {
            process.stdout.write(`Creating public.${table}... `);
            await client.query(SQL_DEFINITIONS[table]);
            console.log('DONE.');
        }

        console.log('\n--- DATABASE RESET COMPLETE ---');
        console.log('All tables have been dropped and re-created successfully.');

    } catch (err) {
        console.error('\nFATAL ERROR:', err);
    } finally {
        await client.end();
    }
}

reset();
