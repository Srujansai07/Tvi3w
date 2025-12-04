-- ============================================================================
-- TVI3W - SUPABASE DATABASE SCHEMA
-- Phase 1.1: Complete Database Design
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    profession TEXT,
    industry TEXT,
    preferred_language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_last_active ON users(last_active DESC);

-- ============================================================================
-- MEETINGS
-- ============================================================================

CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('professional', 'presentation', 'interview', 'informal')),
    
    -- Timing
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    
    -- Content
    transcript TEXT,
    summary TEXT,
    key_points TEXT[],
    
    -- Media
    recording_url TEXT,
    transcript_url TEXT,
    
    -- Analytics
    sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    engagement_score INTEGER CHECK (engagement_score BETWEEN 0 AND 100),
    
    -- Status
    is_transcription_complete BOOLEAN DEFAULT FALSE,
    is_analyzed BOOLEAN DEFAULT FALSE,
    tags TEXT[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_meetings_user_id ON meetings(user_id);
CREATE INDEX idx_meetings_start_time ON meetings(start_time DESC);
CREATE INDEX idx_meetings_type ON meetings(type);
CREATE INDEX idx_meetings_tags ON meetings USING GIN(tags);

-- ============================================================================
-- PARTICIPANTS
-- ============================================================================

CREATE TABLE participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    company TEXT,
    role TEXT,
    
    -- Communication Analysis
    communication_style TEXT CHECK (communication_style IN ('formal', 'casual', 'technical', 'creative')),
    sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    engagement_level INTEGER CHECK (engagement_level BETWEEN 0 AND 100),
    speaking_time_seconds INTEGER,
    interruption_count INTEGER DEFAULT 0,
    
    -- Profile
    linkedin_url TEXT,
    profile_image TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_participants_meeting_id ON participants(meeting_id);
CREATE INDEX idx_participants_email ON participants(email);

-- ============================================================================
-- ACTION ITEMS
-- ============================================================================

CREATE TABLE action_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    owner TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_action_items_meeting_id ON action_items(meeting_id);
CREATE INDEX idx_action_items_status ON action_items(status);
CREATE INDEX idx_action_items_due_date ON action_items(due_date);

-- ============================================================================
-- NOTES
-- ============================================================================

CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    
    -- Metadata
    is_highlighted BOOLEAN DEFAULT FALSE,
    highlight_color TEXT CHECK (highlight_color IN ('yellow', 'blue', 'red', 'green')),
    tags TEXT[],
    
    -- AI Enhancement
    ai_summary TEXT,
    sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_meeting_id ON notes(meeting_id);
CREATE INDEX idx_notes_tags ON notes USING GIN(tags);

-- ============================================================================
-- INSIGHTS
-- ============================================================================

CREATE TABLE insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    
    -- Insight Data
    type TEXT NOT NULL CHECK (type IN ('question', 'action', 'pattern', 'recommendation', 'connection')),
    content TEXT NOT NULL,
    source TEXT CHECK (source IN ('ai_generated', 'user_created', 'pattern_detected')),
    
    -- Priority & Status
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    is_actioned BOOLEAN DEFAULT FALSE,
    actioned_at TIMESTAMP WITH TIME ZONE,
    
    -- Context
    context TEXT,
    related_meeting_ids UUID[],
    related_contact_ids UUID[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    viewed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_insights_user_id ON insights(user_id);
CREATE INDEX idx_insights_type ON insights(type);
CREATE INDEX idx_insights_priority ON insights(priority);
CREATE INDEX idx_insights_is_actioned ON insights(is_actioned);

-- ============================================================================
-- CONTACTS
-- ============================================================================

CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Basic Info
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    job_title TEXT,
    
    -- Professional
    industry TEXT,
    expertise TEXT[],
    linkedin_url TEXT,
    twitter_handle TEXT,
    website_url TEXT,
    
    -- Relationship
    relationship_type TEXT CHECK (relationship_type IN ('client', 'prospect', 'partner', 'friend', 'colleague')),
    last_interaction TIMESTAMP WITH TIME ZONE,
    interaction_count INTEGER DEFAULT 0,
    next_follow_up_date TIMESTAMP WITH TIME ZONE,
    
    -- Preferences
    preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'linkedin')),
    timezone TEXT,
    language TEXT,
    
    -- Notes & Context
    personal_notes TEXT,
    tags TEXT[],
    custom_fields JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, email)
);

CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_company ON contacts(company);
CREATE INDEX idx_contacts_tags ON contacts USING GIN(tags);

-- ============================================================================
-- INTERACTIONS
-- ============================================================================

CREATE TABLE interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('email', 'call', 'meeting', 'message', 'social')),
    description TEXT,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

CREATE INDEX idx_interactions_contact_id ON interactions(contact_id);
CREATE INDEX idx_interactions_date ON interactions(date DESC);

-- ============================================================================
-- AI QUESTION SUGGESTIONS
-- ============================================================================

CREATE TABLE question_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
    angle TEXT NOT NULL CHECK (angle IN ('professional', 'social', 'humorous')),
    question TEXT NOT NULL,
    context TEXT,
    used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP WITH TIME ZONE,
    feedback TEXT CHECK (feedback IN ('helpful', 'not_helpful')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_question_suggestions_meeting_id ON question_suggestions(meeting_id);
CREATE INDEX idx_question_suggestions_used ON question_suggestions(used);

-- ============================================================================
-- CONTENT ANALYSIS
-- ============================================================================

CREATE TABLE content_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Source Content
    source_url TEXT,
    source_type TEXT CHECK (source_type IN ('linkedin', 'twitter', 'email', 'article', 'video')),
    source_title TEXT,
    source_content TEXT,
    
    -- Analysis
    summary TEXT NOT NULL,
    key_takeaways TEXT[],
    suggested_actions TEXT[],
    sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    relevance TEXT CHECK (relevance IN ('high', 'medium', 'low')),
    
    -- Suggestions
    related_contact_ids UUID[],
    related_meeting_ids UUID[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_content_analyses_user_id ON content_analyses(user_id);
CREATE INDEX idx_content_analyses_source_type ON content_analyses(source_type);

-- ============================================================================
-- USER METRICS
-- ============================================================================

CREATE TABLE user_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Meeting Stats
    total_meetings INTEGER DEFAULT 0,
    total_meeting_time_minutes INTEGER DEFAULT 0,
    average_meeting_duration_minutes INTEGER DEFAULT 0,
    
    -- Content Stats
    total_notes INTEGER DEFAULT 0,
    total_insights INTEGER DEFAULT 0,
    insights_actioned INTEGER DEFAULT 0,
    
    -- Engagement
    questions_generated INTEGER DEFAULT 0,
    questions_used INTEGER DEFAULT 0,
    content_analyzed INTEGER DEFAULT 0,
    
    -- Network
    total_contacts INTEGER DEFAULT 0,
    active_connections INTEGER DEFAULT 0,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_metrics_user_id ON user_metrics(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;

-- Users: Can only see their own data
CREATE POLICY users_policy ON users
    FOR ALL
    USING (auth.uid() = id);

-- Meetings: Can only see their own meetings
CREATE POLICY meetings_policy ON meetings
    FOR ALL
    USING (auth.uid() = user_id);

-- Participants: Can see participants in their meetings
CREATE POLICY participants_policy ON participants
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM meetings
            WHERE meetings.id = participants.meeting_id
            AND meetings.user_id = auth.uid()
        )
    );

-- Action Items: Can see action items in their meetings
CREATE POLICY action_items_policy ON action_items
    FOR ALL
    USING (auth.uid() = user_id);

-- Notes: Can only see their own notes
CREATE POLICY notes_policy ON notes
    FOR ALL
    USING (auth.uid() = user_id);

-- Insights: Can only see their own insights
CREATE POLICY insights_policy ON insights
    FOR ALL
    USING (auth.uid() = user_id);

-- Contacts: Can only see their own contacts
CREATE POLICY contacts_policy ON contacts
    FOR ALL
    USING (auth.uid() = user_id);

-- Interactions: Can see interactions for their contacts
CREATE POLICY interactions_policy ON interactions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM contacts
            WHERE contacts.id = interactions.contact_id
            AND contacts.user_id = auth.uid()
        )
    );

-- Question Suggestions: Can see suggestions for their meetings
CREATE POLICY question_suggestions_policy ON question_suggestions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM meetings
            WHERE meetings.id = question_suggestions.meeting_id
            AND meetings.user_id = auth.uid()
        )
    );

-- Content Analyses: Can only see their own analyses
CREATE POLICY content_analyses_policy ON content_analyses
    FOR ALL
    USING (auth.uid() = user_id);

-- User Metrics: Can only see their own metrics
CREATE POLICY user_metrics_policy ON user_metrics
    FOR ALL
    USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meetings_updated_at
    BEFORE UPDATE ON meetings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notes_updated_at
    BEFORE UPDATE ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update user metrics
CREATE OR REPLACE FUNCTION update_user_metrics()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF TG_TABLE_NAME = 'meetings' THEN
            UPDATE user_metrics
            SET total_meetings = total_meetings + 1,
                updated_at = NOW()
            WHERE user_id = NEW.user_id;
        ELSIF TG_TABLE_NAME = 'notes' THEN
            UPDATE user_metrics
            SET total_notes = total_notes + 1,
                updated_at = NOW()
            WHERE user_id = NEW.user_id;
        ELSIF TG_TABLE_NAME = 'insights' THEN
            UPDATE user_metrics
            SET total_insights = total_insights + 1,
                updated_at = NOW()
            WHERE user_id = NEW.user_id;
        ELSIF TG_TABLE_NAME = 'contacts' THEN
            UPDATE user_metrics
            SET total_contacts = total_contacts + 1,
                updated_at = NOW()
            WHERE user_id = NEW.user_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply metrics triggers
CREATE TRIGGER update_metrics_on_meeting_insert
    AFTER INSERT ON meetings
    FOR EACH ROW
    EXECUTE FUNCTION update_user_metrics();

CREATE TRIGGER update_metrics_on_note_insert
    AFTER INSERT ON notes
    FOR EACH ROW
    EXECUTE FUNCTION update_user_metrics();

CREATE TRIGGER update_metrics_on_insight_insert
    AFTER INSERT ON insights
    FOR EACH ROW
    EXECUTE FUNCTION update_user_metrics();

CREATE TRIGGER update_metrics_on_contact_insert
    AFTER INSERT ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_user_metrics();
