-- Good Company Database Schema Migration
-- Hybrid Book Club Management Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    city TEXT DEFAULT 'Abuja',
    country TEXT DEFAULT 'Nigeria',
    favourite_book TEXT,
    currently_reading TEXT,
    avatar_url TEXT,
    avatar_color TEXT DEFAULT '#F5D978',
    preferred_format TEXT DEFAULT 'both' CHECK (preferred_format IN ('abuja', 'online', 'both')),
    directory_visible BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    membership_status TEXT DEFAULT 'active' CHECK (membership_status IN ('invited', 'active', 'suspended', 'former_member')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Membership Applications Table
CREATE TABLE IF NOT EXISTS public.membership_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    city TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Nigeria',
    preferred_attendance TEXT NOT NULL CHECK (preferred_attendance IN ('abuja', 'online', 'both')),
    favourite_book TEXT NOT NULL,
    genres_enjoyed TEXT[] DEFAULT '{}',
    what_they_want TEXT NOT NULL,
    how_they_heard TEXT NOT NULL,
    agreed_to_guidelines BOOLEAN NOT NULL DEFAULT FALSE,
    consent_to_updates BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'waitlisted', 'withdrawn')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique index to prevent duplicate pending applications for the same email
CREATE UNIQUE INDEX IF NOT EXISTS idx_pending_email_unique 
ON public.membership_applications (LOWER(email)) 
WHERE status = 'pending';

-- 3. Membership Status History Table
CREATE TABLE IF NOT EXISTS public.membership_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    changed_by UUID REFERENCES public.profiles(id),
    old_status TEXT,
    new_status TEXT NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Books Table
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    genre TEXT NOT NULL,
    description TEXT NOT NULL,
    curator_note TEXT NOT NULL,
    cover_url TEXT,
    cover_color TEXT DEFAULT '#DFA6A0',
    reading_start_date DATE,
    reading_end_date DATE,
    discussion_date TIMESTAMPTZ,
    meeting_format TEXT DEFAULT 'Abuja & Online',
    has_content_notes BOOLEAN DEFAULT FALSE,
    content_notes TEXT,
    has_scene_skip BOOLEAN DEFAULT FALSE,
    scene_skip_guide TEXT,
    reading_guide TEXT,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'currently_reading', 'completed', 'archived')),
    is_current BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Book Selections Table
CREATE TABLE IF NOT EXISTS public.book_selections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    month_name TEXT NOT NULL,
    year_num INTEGER NOT NULL,
    theme TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Reading Guides Table
CREATE TABLE IF NOT EXISTS public.reading_guides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    overview TEXT NOT NULL,
    pacing_guide TEXT,
    themes_to_watch TEXT[] DEFAULT '{}',
    author_background TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Discussion Prompts Table
CREATE TABLE IF NOT EXISTS public.discussion_prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    prompt_text TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    prompt_id UUID REFERENCES public.discussion_prompts(id) ON DELETE SET NULL,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_spoiler BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT FALSE,
    hidden_by UUID REFERENCES public.profiles(id),
    hidden_reason TEXT,
    hidden_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Comment Reports Table
CREATE TABLE IF NOT EXISTS public.comment_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
    reported_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    resolved_by UUID REFERENCES public.profiles(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('Book Discussion', 'Quiet Reading Session', 'Film Screening', 'Author Conversation', 'Book Launch', 'Social Gathering', 'Other')),
    description TEXT NOT NULL,
    event_date DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    timezone TEXT DEFAULT 'WAT',
    format TEXT NOT NULL CHECK (format IN ('Abuja', 'Online', 'Hybrid')),
    venue TEXT NOT NULL,
    private_online_link TEXT,
    capacity INTEGER,
    rsvp_deadline TIMESTAMPTZ,
    header_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'completed', 'cancelled')),
    book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Event RSVPs Table
CREATE TABLE IF NOT EXISTS public.event_rsvps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('going', 'maybe', 'not_going')),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- 12. Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    audience TEXT NOT NULL DEFAULT 'members_only' CHECK (audience IN ('members_only', 'public')),
    is_pinned BOOLEAN DEFAULT FALSE,
    scheduled_at TIMESTAMPTZ DEFAULT NOW(),
    author_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Admin Notes Table
CREATE TABLE IF NOT EXISTS public.admin_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_type TEXT NOT NULL CHECK (target_type IN ('application', 'member', 'event')),
    target_id UUID NOT NULL,
    author_id UUID NOT NULL REFERENCES public.profiles(id),
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_status ON public.books(status);
CREATE INDEX IF NOT EXISTS idx_books_is_current ON public.books(is_current);
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(event_date);
CREATE INDEX IF NOT EXISTS idx_comments_book ON public.comments(book_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_event ON public.event_rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_user ON public.event_rsvps(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_directory ON public.profiles(directory_visible, membership_status);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.book_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;

-- Helper security function: Check if current user is an active admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND is_admin = TRUE
        AND membership_status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper security function: Check if current user is an active member
CREATE OR REPLACE FUNCTION public.is_active_member()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND membership_status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles Policies
-- 1. Anyone can see opted-in active members in directory (without email/phone)
CREATE POLICY "Public directory visibility" ON public.profiles
FOR SELECT USING (
    (directory_visible = TRUE AND membership_status = 'active')
    OR id = auth.uid()
    OR public.is_admin()
);

-- 2. Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (id = auth.uid());

-- 3. Admins have full access to profiles
CREATE POLICY "Admins manage profiles" ON public.profiles
FOR ALL USING (public.is_admin());

-- Membership Applications Policies
-- 1. Public can submit application
CREATE POLICY "Public can submit applications" ON public.membership_applications
FOR INSERT WITH CHECK (TRUE);

-- 2. Only Admins can view or manage applications
CREATE POLICY "Admins view and manage applications" ON public.membership_applications
FOR ALL USING (public.is_admin());

-- Books Policies
-- 1. Everyone can view published books
CREATE POLICY "Everyone views books" ON public.books
FOR SELECT USING (status != 'archived' OR public.is_admin());

-- 2. Admins manage books
CREATE POLICY "Admins manage books" ON public.books
FOR ALL USING (public.is_admin());

-- Reading Guides Policies
-- 1. Active members and Admins can view reading guides
CREATE POLICY "Members view reading guides" ON public.reading_guides
FOR SELECT USING (public.is_active_member() OR public.is_admin());

-- 2. Admins manage reading guides
CREATE POLICY "Admins manage reading guides" ON public.reading_guides
FOR ALL USING (public.is_admin());

-- Discussion Prompts Policies
-- 1. Active members and Admins view prompts
CREATE POLICY "Members view prompts" ON public.discussion_prompts
FOR SELECT USING (public.is_active_member() OR public.is_admin());

-- 2. Admins manage prompts
CREATE POLICY "Admins manage prompts" ON public.discussion_prompts
FOR ALL USING (public.is_admin());

-- Comments Policies
-- 1. Active members and Admins view unhidden comments
CREATE POLICY "Members view comments" ON public.comments
FOR SELECT USING (
    (public.is_active_member() AND is_hidden = FALSE)
    OR author_id = auth.uid()
    OR public.is_admin()
);

-- 2. Active members can create comments
CREATE POLICY "Members insert comments" ON public.comments
FOR INSERT WITH CHECK (
    public.is_active_member() AND author_id = auth.uid()
);

-- 3. Authors can update/delete their own comments
CREATE POLICY "Authors update own comments" ON public.comments
FOR UPDATE USING (author_id = auth.uid());

-- 4. Admins manage comments
CREATE POLICY "Admins moderate comments" ON public.comments
FOR ALL USING (public.is_admin());

-- Events Policies
-- 1. Public can view published events (private link concealed at app layer or via view)
CREATE POLICY "Public views published events" ON public.events
FOR SELECT USING (status = 'published' OR public.is_admin());

-- 2. Admins manage events
CREATE POLICY "Admins manage events" ON public.events
FOR ALL USING (public.is_admin());

-- Event RSVPs Policies
-- 1. Members can view RSVP counts and attendee lists
CREATE POLICY "Members view RSVPs" ON public.event_rsvps
FOR SELECT USING (public.is_active_member() OR public.is_admin());

-- 2. Members can manage their own RSVP
CREATE POLICY "Members manage own RSVP" ON public.event_rsvps
FOR ALL USING (user_id = auth.uid());

-- Announcements Policies
-- 1. Public can view public announcements; Members view member announcements
CREATE POLICY "View announcements" ON public.announcements
FOR SELECT USING (
    audience = 'public'
    OR (audience = 'members_only' AND public.is_active_member())
    OR public.is_admin()
);

-- 2. Admins manage announcements
CREATE POLICY "Admins manage announcements" ON public.announcements
FOR ALL USING (public.is_admin());

-- Admin Notes & Reports
CREATE POLICY "Admins manage admin notes" ON public.admin_notes
FOR ALL USING (public.is_admin());

CREATE POLICY "Members submit reports" ON public.comment_reports
FOR INSERT WITH CHECK (public.is_active_member() AND reported_by = auth.uid());

CREATE POLICY "Admins view and manage reports" ON public.comment_reports
FOR ALL USING (public.is_admin());
