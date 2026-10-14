export type MembershipStatus = 'invited' | 'active' | 'suspended' | 'former_member';

export type ApplicationStatus = 'pending' | 'approved' | 'declined' | 'waitlisted' | 'withdrawn';

export type PreferredFormat = 'abuja' | 'online' | 'both';

export type BookStatus = 'upcoming' | 'currently_reading' | 'completed' | 'archived';

export type EventFormat = 'Abuja' | 'Online' | 'Hybrid';

export type EventType =
  | 'Book Discussion'
  | 'Quiet Reading Session'
  | 'Film Screening'
  | 'Author Conversation'
  | 'Book Launch'
  | 'Social Gathering'
  | 'Other';

export type EventStatus = 'draft' | 'published' | 'completed' | 'cancelled';

export type RSVPStatus = 'going' | 'maybe' | 'not_going';

export interface Profile {
  id: string;
  email: string;
  first_name: string;
  display_name: string;
  city: string;
  country: string;
  favourite_book: string;
  currently_reading: string;
  avatar_url?: string;
  avatar_color: string;
  preferred_format: PreferredFormat;
  directory_visible: boolean;
  is_admin: boolean;
  membership_status: MembershipStatus;
  created_at: string;
  updated_at?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  curator_note: string;
  cover_url?: string;
  cover_color: string;
  rating?: number;
  spice_level?: number;
  reading_start_date: string;
  reading_end_date: string;
  discussion_date: string;
  meeting_format: string;
  has_content_notes: boolean;
  content_notes?: string;
  has_scene_skip: boolean;
  scene_skip_guide?: string;
  reading_guide?: string;
  status: BookStatus;
  is_current: boolean;
  sort_order: number;
  created_at: string;
  updated_at?: string;
}

export interface DiscussionPrompt {
  id: string;
  book_id: string;
  title: string;
  prompt_text: string;
  sort_order: number;
  is_pinned: boolean;
  created_by?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  book_id: string;
  prompt_id?: string;
  parent_id?: string;
  author_id: string;
  author?: Profile;
  content: string;
  is_spoiler: boolean;
  is_hidden: boolean;
  hidden_by?: string;
  hidden_reason?: string;
  hidden_at?: string;
  is_deleted: boolean;
  created_at: string;
  updated_at?: string;
  replies?: Comment[];
}

export interface CommentReport {
  id: string;
  comment_id: string;
  comment?: Comment;
  reported_by: string;
  reporter?: Profile;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  event_type: EventType;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  timezone: string;
  format: EventFormat;
  venue: string;
  private_online_link?: string;
  capacity?: number;
  rsvp_deadline?: string;
  header_image_url?: string;
  status: EventStatus;
  book_id?: string;
  book?: Book;
  created_at: string;
  updated_at?: string;
  rsvp_count?: {
    going: number;
    maybe: number;
    not_going: number;
  };
  user_rsvp?: RSVPStatus;
}

export interface EventRSVP {
  id: string;
  event_id: string;
  user_id: string;
  user?: Profile;
  status: RSVPStatus;
  note?: string;
  created_at: string;
  updated_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  audience: 'members_only' | 'public';
  is_pinned: boolean;
  scheduled_at: string;
  author_id?: string;
  author_name?: string;
  created_at: string;
  updated_at?: string;
}

export interface MembershipApplication {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  city: string;
  country: string;
  preferred_attendance: PreferredFormat;
  favourite_book: string;
  genres_enjoyed: string[];
  what_they_want: string;
  how_they_heard: string;
  agreed_to_guidelines: boolean;
  consent_to_updates: boolean;
  status: ApplicationStatus;
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface AdminNote {
  id: string;
  target_type: 'application' | 'member' | 'event';
  target_id: string;
  author_id: string;
  note: string;
  created_at: string;
}
