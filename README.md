# Good Company — Hybrid Book Club Platform

> **Good books. Better conversations.**  
> Social identity: [@readwithgoodcompany](https://instagram.com/readwithgoodcompany)  
> Website: [readwithgoodcompany.com](https://readwithgoodcompany.com)

Good Company is an Abuja-based hybrid book club open to readers in Abuja and online. It reads across genres and is growing into a recognised literary community hosting book discussions, quiet reading teas, screenings, author conversations, book launches, and publisher collaborations.

---

## ✦ Product Identity & Aesthetic Principles

- **Warmth, Wit & Marginalia:** Editorial typography with `Fraunces` serif headings and `DM Sans` body copy.
- **Curated Palette:**
  - Warm Cream: `#FFF9F0`
  - Paper White: `#FFFCF7`
  - Dark Ink: `#25211D`
  - Butter Yellow: `#F5D978`
  - Dusty Rose: `#DFA6A0`
  - Muted Sage: `#A9B5A0`
  - Soft Terracotta: `#C9795F`
- **Gentle Hand-Crafted Touches:** Custom SVG book stacks, steaming teacups, bookmark ribbons, and handwritten marginal notes.
- **Privacy by Default:** No followers, no direct messaging, no public activity feeds, no exposed phone numbers or email addresses.

---

## ✦ Core Features

### 1. Public Experience
- **Editorial Homepage:** Hero section with signature marginalia (*"Yes, showing up without finishing the book is forgivable."*), custom book stack illustration, and three editorial pillars (*We read*, *We gather*, *We make a thing of it*).
- **Currently in Good Company:** Displays current read (*Problematic Summer Romance* by Ali Hazelwood), reading period, discussion date, and curator’s note.
- **Public Shelves:** Horizontal display of current, past, and upcoming books.
- **Upcoming Gatherings:** Public event listings with format badges (*Abuja*, *Online*, *Hybrid*).
- **Community Guidelines:** Clear principles covering respectful disagreement, privacy, and spoiler etiquette.
- **Membership Application Form:** Custom multi-field application with duplicate pending application prevention.

### 2. Lightweight Auth & Onboarding
- **Restricted Access:** No unrestricted public sign-up. Applicants must be approved by curators.
- **Magic-Link Authentication:** Passwordless sign-in for approved members.
- **Onboarding Flow:** Simple form on first sign-in setting display name, city, reading habits, and opt-in directory preference.

### 3. Private Member Dashboard
- **Warm Welcome:** *"Hello, [First Name]. You’re in good company."*
- **Current Read Card:** Quick links to the Curator’s Reading Guide, Content Notes, and Discussion Room.
- **Next Gathering & RSVP:** Real-time RSVP (*Going*, *Maybe*, *Not going*) and one-click *Add to Calendar*.
- **Private Link Revelation:** Secure meeting room link revealed only to confirmed members.
- **From the Discussion:** Recent book debate comments with spoiler concealment shields.

### 4. Book Discussions & Comments
- **In-Book Focus:** Discussion rooms live inside specific books, not a noisy general feed.
- **Admin Prompts:** Curators pin thought-provoking questions.
- **Nested Replies:** Replies nested 1 level deep.
- **Spoiler Shields:** Spoilers blurred/concealed until clicked to reveal.
- **Moderation & Reporting:** Members can flag comments; curators can hide, delete, or restore with an audit trail.

### 5. Private Member Directory
- **Opt-In Only:** Off by default for privacy. Members choose when to appear.
- **Editorial Cards:** Display name, city, favourite book, and currently reading. No full profiles, feeds, or DMs.
- **Search:** Search readers by name, city, or favourite book.

### 6. Administrator Studio (`/admin`)
- **Protected Route:** Restricted to curators with `is_admin = true`.
- **Overview Metrics:** Active members, pending applications, upcoming events, next gathering RSVP tally, and moderation flags.
- **Application Review:** Read full application answers, add private curator notes, Approve (instantly invites member), Waitlist, or Decline (with confirmation modal).
- **Member Management:** Search members, change status (*Active*, *Suspended*, *Former*), grant/revoke admin privileges.
- **Bookshelf Management:** Add/edit books, curate reading guides, set discussion dates, content notes, and scene-skip guides.
- **Gatherings & RSVPs:** Create events, manage capacities, and export attendee lists as **CSV**.
- **Announcements:** Post pinned or scheduled updates for members or public visitors.
- **Comment Moderation:** Audit log of reported comments with hide/restore controls.

---

## ✦ Project Structure

```
good-company/
├── supabase/
│   ├── migrations/
│   │   └── 20261012000000_initial_schema.sql  # Complete PostgreSQL tables, RLS policies, indexes
│   └── seed.sql                               # Realistic seed data (books, members, salons, prompts)
├── src/
│   ├── app/
│   │   ├── admin/page.tsx                     # Protected Curator Studio
│   │   ├── apply/page.tsx                     # Membership application form
│   │   ├── books/[id]/page.tsx                # Book detail & discussion page
│   │   ├── dashboard/page.tsx                 # Private member dashboard
│   │   ├── directory/page.tsx                 # Opt-in member directory
│   │   ├── guidelines/page.tsx                # Community guidelines
│   │   ├── login/page.tsx                     # Magic-link sign-in with quick switcher
│   │   ├── onboarding/page.tsx                # First-time member profile setup
│   │   ├── settings/page.tsx                  # Account, privacy & leave club flow
│   │   ├── layout.tsx                         # Root layout with Fraunces & DM Sans
│   │   ├── page.tsx                           # Public homepage
│   │   ├── robots.ts                          # SEO robots rules (private routes protected)
│   │   └── sitemap.ts                         # Dynamic XML sitemap
│   ├── components/
│   │   ├── books/                             # BookCover & BookCard components
│   │   ├── events/                            # EventCard with RSVPs & calendar export
│   │   ├── navigation/                        # Navbar, Footer, DemoPersonaBanner
│   │   └── ui/                                # Custom illustrations, toasts
│   ├── lib/
│   │   ├── data/initial-data.ts               # Seed data for demo and fallback
│   │   ├── store/app-context.tsx              # Reactive state store with localStorage sync
│   │   └── supabase/client.ts                 # Supabase client connector
│   └── types/index.ts                         # Strongly typed TypeScript definitions
├── .env.example
├── package.json
└── README.md
```

---

## ✦ Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on v22)
- npm or pnpm

### 2. Installation
```bash
git clone <repo-url> good-company
cd good-company
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your Supabase project credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note on Demo Sandbox Mode:**  
> If environment variables are not configured during development, Good Company automatically runs in **Interactive Demo Sandbox Mode**. A discreet indicator banner appears, enabling instant testing across all visitor roles (Public, Member, Curator) without requiring external services.

### 4. Supabase Database Setup
1. In your Supabase Dashboard, open the **SQL Editor**.
2. Run `supabase/migrations/20261012000000_initial_schema.sql` to generate all tables, enums, triggers, and Row Level Security policies.
3. Run `supabase/seed.sql` to populate sample books, discussion prompts, events, and curator accounts.

### 5. Running the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✦ Role-Based Testing Guide

Use the **Demo Switcher** at the top of the screen to test each visitor state:

| Role | Name | Email | Permissions / Features |
| :--- | :--- | :--- | :--- |
| **Public Visitor** | Browsing anonymously | N/A | Can read public homepage, current book info, shelves, and submit applications. Cannot view member discussion rooms or RSVP to gatherings. |
| **Approved Member** | Amaka Okafor | `amaka@example.com` | Abuja-based member. Can access member dashboard, RSVP to gatherings, participate in book discussions, toggle spoiler shields, and view the member directory. |
| **Approved Member** | Chidi Eze | `chidi@example.com` | Online member based in Lagos. Can access online salons and participate in discussions. |
| **Administrator** | Zainab Bello | `zainab@readwithgoodcompany.com` | Club curator and administrator. Has full access to `/admin` to review applications, approve/decline candidates, add books, manage gatherings, post announcements, and moderate comments. |

---

## ✦ Database Schema Summary

- `profiles`: Member credentials, city, favourite book, currently reading, preferred format, and directory visibility.
- `membership_applications`: Application answers, guidelines agreement, and curator notes. Prevented duplicates via unique partial index.
- `membership_status_history`: Audit trail for membership status changes.
- `books`: Title, author, genre, curator note, cover styling, reading start/end, discussion date, content notes, scene-skip guide, and reading guide.
- `discussion_prompts`: Admin-created prompts for book discussions.
- `comments`: Nested discussions (1 level deep) with spoiler shield flags and soft-delete/moderation flags.
- `comment_reports`: User reports for discussion moderation.
- `events`: Hybrid gathering schedules with private room links concealed from non-members.
- `event_rsvps`: Member RSVP status tracking (*going*, *maybe*, *not_going*).
- `announcements`: Member-only and public notices.
