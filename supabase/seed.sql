-- Good Company Seed Data
-- Hybrid Book Club: Abuja & Online

-- 1. Profiles
INSERT INTO public.profiles (id, email, first_name, display_name, city, country, favourite_book, currently_reading, avatar_color, preferred_format, directory_visible, is_admin, membership_status)
VALUES
('a0000000-0000-0000-0000-000000000001', 'zainab@readwithgoodcompany.com', 'Zainab', 'Zainab B.', 'Abuja', 'Nigeria', 'Pride and Prejudice', 'Problematic Summer Romance', '#C9795F', 'both', TRUE, TRUE, 'active'),
('a0000000-0000-0000-0000-000000000002', 'amaka@example.com', 'Amaka', 'Amaka O.', 'Abuja', 'Nigeria', 'Yellowface by R.F. Kuang', 'Problematic Summer Romance', '#F5D978', 'abuja', TRUE, FALSE, 'active'),
('a0000000-0000-0000-0000-000000000003', 'chidi@example.com', 'Chidi', 'Chidi E.', 'Lagos', 'Nigeria', 'Tomorrow, and Tomorrow, and Tomorrow', 'Book Lovers', '#A9B5A0', 'online', TRUE, FALSE, 'active'),
('a0000000-0000-0000-0000-000000000004', 'folake@example.com', 'Folake', 'Folake A.', 'London', 'United Kingdom', 'Open Water by Caleb Azumah Nelson', 'Problematic Summer Romance', '#DFA6A0', 'online', FALSE, FALSE, 'active')
ON CONFLICT (id) DO NOTHING;

-- 2. Books
INSERT INTO public.books (id, title, author, genre, description, curator_note, cover_color, reading_start_date, reading_end_date, discussion_date, meeting_format, has_content_notes, content_notes, has_scene_skip, scene_skip_guide, reading_guide, status, is_current, sort_order)
VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  'Problematic Summer Romance',
  'Ali Hazelwood',
  'Contemporary Romance / Academic Rivals',
  'An atmospheric, razor-sharp romance tracking two fiercely stubborn STEM researchers forced to co-lead an unpredictable summer residency.',
  'Sharp, funny and destined to divide the room. Exactly how we like our books.',
  '#C9795F',
  '2026-10-01',
  '2026-10-30',
  '2026-10-31 16:00:00+01',
  'Abuja & Online',
  TRUE,
  'Themes of intense academic burnout, imposter syndrome, high-pressure laboratory politics, and emotionally charged confrontation.',
  TRUE,
  'If you prefer a milder closed-door romance, skip Chapter 18 (pages 210–222). You will miss zero research lab plot points.',
  'Focus on how Hazelwood uses academic hierarchy to mirror emotional vulnerability. Note down your reactions to the third-act lab confrontation.',
  'currently_reading',
  TRUE,
  1
),
(
  'b0000000-0000-0000-0000-000000000002',
  'The Love Hypothesis',
  'Ali Hazelwood',
  'Romantic Comedy',
  'A delightfully chaotic fake-dating experiment between a third-year Ph.D. candidate and a notoriously exacting young professor.',
  'The modern romance blueprint that made all of us obsess over fictional sunscreen applications.',
  '#F5D978',
  '2026-08-01',
  '2026-08-31',
  '2026-08-30 17:00:00+01',
  'Abuja & Online',
  FALSE,
  NULL,
  FALSE,
  NULL,
  'Examine the tropes of mutual pining and fake relationships in academic spaces.',
  'completed',
  FALSE,
  2
),
(
  'b0000000-0000-0000-0000-000000000003',
  'Love, Theoretically',
  'Ali Hazelwood',
  'Contemporary Fiction',
  'Theoretical physicist Elsie Hannaway balances adjunct teaching with fake dating, until her academic nemesis crosses both worlds.',
  'Warm, clever, and unexpectedly touching on people-pleasing culture.',
  '#DFA6A0',
  '2026-09-01',
  '2026-09-29',
  '2026-09-28 17:00:00+01',
  'Hybrid',
  TRUE,
  'Discussions of chronic people-pleasing and workplace power dynamics.',
  FALSE,
  NULL,
  'Pacing guide: Part I (Ch 1-10), Part II (Ch 11-20), Part III to finale.',
  'completed',
  FALSE,
  3
),
(
  'b0000000-0000-0000-0000-000000000004',
  'Book Lovers',
  'Emily Henry',
  'Literary Romance',
  'A cutthroat literary agent and an arrogant book editor keep accidentally crossing paths in a tiny North Carolina town.',
  'An unapologetic love letter to literary tropes, ambitious women, and sisterhood.',
  '#A9B5A0',
  '2026-11-01',
  '2026-11-28',
  '2026-11-29 16:30:00+01',
  'Abuja & Online',
  FALSE,
  NULL,
  FALSE,
  NULL,
  'Pay attention to Nora and Libby’s sister dynamic as much as the romance.',
  'upcoming',
  FALSE,
  4
),
(
  'b0000000-0000-0000-0000-000000000005',
  'First-Time Caller',
  'B.K. Borison',
  'Contemporary Romance',
  'A late-night radio host and a caller navigating serendipity, second chances, and the tender mess of adult life.',
  'Cosy audio-coded comfort food for when the world is slightly too loud.',
  '#FFF9F0',
  '2026-12-01',
  '2026-12-30',
  '2026-12-30 17:00:00+01',
  'Abuja & Online',
  FALSE,
  NULL,
  FALSE,
  NULL,
  'Coming in December for our year-end slow read.',
  'upcoming',
  FALSE,
  5
)
ON CONFLICT (id) DO NOTHING;

-- 3. Discussion Prompts for Current Book
INSERT INTO public.discussion_prompts (id, book_id, title, prompt_text, sort_order, is_pinned, created_by)
VALUES
(
  'p0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'The Rivalry: Earned or Contrived?',
  'Did the academic hostility between the leads feel genuinely grounded in academic rivalry, or did you find yourself wanting them to communicate by chapter 5?',
  1,
  TRUE,
  'a0000000-0000-0000-0000-000000000001'
),
(
  'p0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000001',
  'The Turning Point in Chapter 14',
  'That rainy conference debate in Chapter 14 changed the power balance entirely. Who had the better intellectual argument?',
  2,
  FALSE,
  'a0000000-0000-0000-0000-000000000001'
)
ON CONFLICT (id) DO NOTHING;

-- 4. Comments
INSERT INTO public.comments (id, book_id, prompt_id, parent_id, author_id, content, is_spoiler, is_hidden, created_at)
VALUES
(
  'c0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'p0000000-0000-0000-0000-000000000001',
  NULL,
  'a0000000-0000-0000-0000-000000000002',
  'I was prepared to roll my eyes, but their grant competition banter hit terrifyingly close to real Nigerian postgraduate research politics. He deserved that snark in chapter 3.',
  FALSE,
  FALSE,
  NOW() - INTERVAL '2 days'
),
(
  'c0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000001',
  'p0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000003',
  'Amaka, please! He was protecting his team’s lab budget. Unpopular opinion maybe, but the hero was 80% justified until he lied about the symposium.',
  FALSE,
  FALSE,
  NOW() - INTERVAL '1 day'
),
(
  'c0000000-0000-0000-0000-000000000003',
  'b0000000-0000-0000-0000-000000000001',
  'p0000000-0000-0000-0000-000000000002',
  NULL,
  'a0000000-0000-0000-0000-000000000004',
  'The revelation about who secretly funded the lab residency completely re-contextualizes his monologue in chapter 14!',
  TRUE,
  FALSE,
  NOW() - INTERVAL '8 hours'
)
ON CONFLICT (id) DO NOTHING;

-- 5. Events
INSERT INTO public.events (id, title, event_type, description, event_date, start_time, end_time, timezone, format, venue, private_online_link, capacity, rsvp_deadline, status, book_id)
VALUES
(
  'e0000000-0000-0000-0000-000000000001',
  'Problematic Summer Romance: The Abuja Room Debate',
  'Book Discussion',
  'Our flagship monthly gathering. Come ready to debate the lab politics, defend your favourite character, and enjoy fresh tea and pastries in Wuse II.',
  '2026-10-31',
  '16:00',
  '18:30',
  'WAT',
  'Hybrid',
  'The Buttercup Literary Salon, Aminu Kano Crescent, Wuse II, Abuja',
  'https://meet.google.com/gco-read-room',
  35,
  '2026-10-30 23:59:00+01',
  'published',
  'b0000000-0000-0000-0000-000000000001'
),
(
  'e0000000-0000-0000-0000-000000000002',
  'Sunday Silent Reading & Botanical Tea',
  'Quiet Reading Session',
  'Bring whatever book you are currently immersed in. Sixty minutes of companionable silence followed by pastries and unhurried chat.',
  '2026-11-08',
  '11:00',
  '13:00',
  'WAT',
  'Abuja',
  'Millennium Park Shaded Arbor, Maitama, Abuja',
  NULL,
  20,
  '2026-11-07 18:00:00+01',
  'published',
  NULL
),
(
  'e0000000-0000-0000-0000-000000000003',
  'Screening & Discussion: Pride and Prejudice (2005)',
  'Film Screening',
  'A cosy evening watching Joe Wright’s adaptation. The hand flex debate will be held promptly after the film.',
  '2026-11-21',
  '18:00',
  '21:00',
  'WAT',
  'Hybrid',
  'Abuja Arts Hub, Central Area & Private Discord Stream',
  'https://meet.google.com/gco-cinema-club',
  40,
  '2026-11-20 12:00:00+01',
  'published',
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- 6. Event RSVPs
INSERT INTO public.event_rsvps (id, event_id, user_id, status, created_at)
VALUES
('r0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'going', NOW()),
('r0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'going', NOW()),
('r0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'maybe', NOW())
ON CONFLICT (event_id, user_id) DO NOTHING;

-- 7. Announcements
INSERT INTO public.announcements (id, title, content, audience, is_pinned, scheduled_at, author_id)
VALUES
(
  'm0000000-0000-0000-0000-000000000001',
  'October Gathering Pacing & Pointers',
  'Remember that our discussion date is October 31st at 4:00 PM WAT. If you have not finished the book yet, no guilt — come anyway for the debate. Check the Reading Guide tab for content notes and chapter pacing.',
  'members_only',
  TRUE,
  NOW() - INTERVAL '3 days',
  'a0000000-0000-0000-0000-000000000001'
)
ON CONFLICT (id) DO NOTHING;

-- 8. Membership Applications
INSERT INTO public.membership_applications (id, full_name, email, phone, city, country, preferred_attendance, favourite_book, genres_enjoyed, what_they_want, how_they_heard, agreed_to_guidelines, consent_to_updates, status, admin_notes, created_at)
VALUES
(
  'f0000000-0000-0000-0000-000000000001',
  'Damilola Adeyemi',
  'dami.a@example.com',
  '+234 803 123 4567',
  'Abuja',
  'Nigeria',
  'abuja',
  'Half of a Yellow Sun by Chimamanda Ngozi Adichie',
  ARRAY['Literary Fiction', 'Romance', 'Historical Fiction'],
  'I want a book club where people actually turn up, give honest opinions without snobbery, and stay for the post-book tea arguments.',
  'Saw a book reel on Instagram @readwithgoodcompany',
  TRUE,
  TRUE,
  'pending',
  'Strong Abuja reader, loves historical fiction and romance. Great fit for the salon meetings.',
  NOW() - INTERVAL '1 day'
),
(
  'f0000000-0000-0000-0000-000000000002',
  'Halima Garba',
  'halima.g@example.com',
  '+234 802 987 6543',
  'Kaduna / Abuja',
  'Nigeria',
  'both',
  'The Seven Husbands of Evelyn Hugo by Taylor Jenkins Reid',
  ARRAY['Contemporary Fiction', 'Memoir', 'Mystery'],
  'Looking for a warm community to keep me reading consistently and to connect with fellow book lovers in Nigeria.',
  'Recommended by Zainab during an Abuja arts pop-up',
  TRUE,
  TRUE,
  'waitlisted',
  'Travels frequently between Kaduna and Abuja. Put on waitlist for next hybrid cohort.',
  NOW() - INTERVAL '3 days'
)
ON CONFLICT (id) DO NOTHING;
