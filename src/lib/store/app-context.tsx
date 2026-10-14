"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Profile,
  Book,
  BookStatus,
  DiscussionPrompt,
  Comment,
  Event,
  EventRSVP,
  Announcement,
  MembershipApplication,
  CommentReport,
  RSVPStatus,
  ApplicationStatus,
  MembershipStatus,
} from "@/types";
import {
  INITIAL_PROFILES,
  INITIAL_BOOKS,
  INITIAL_PROMPTS,
  INITIAL_COMMENTS,
  INITIAL_EVENTS,
  INITIAL_RSVPS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_APPLICATIONS,
  INITIAL_REPORTS,
} from "@/lib/data/initial-data";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import curatorData from "@/data/curator-data.json";

const SEEDED_BOOKS: Book[] =
  Array.isArray((curatorData as any)?.books) &&
  (curatorData as any).books.length > 0
    ? ((curatorData as any).books as Book[]).map((b) => {
        const init = INITIAL_BOOKS.find((ib) => ib.id === b.id);
        return {
          ...b,
          is_current:
            b.id ===
            ((curatorData as any).currentBookId ||
              (curatorData as any).books[0]?.id),
          rating: b.rating !== undefined ? b.rating : init?.rating,
          spice_level:
            b.spice_level !== undefined ? b.spice_level : init?.spice_level,
        };
      })
    : INITIAL_BOOKS;
const SEEDED_UPDATED_AT: number = (curatorData as any)?.updatedAt
  ? new Date((curatorData as any).updatedAt).getTime()
  : 0;

interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface AppContextType {
  // Current user state
  currentUser: Profile | null;
  setCurrentUser: (user: Profile | null) => void;
  isSupabaseConnected: boolean;

  // Data collections
  profiles: Profile[];
  books: Book[];
  currentBook: Book | null;
  prompts: DiscussionPrompt[];
  comments: Comment[];
  events: Event[];
  rsvps: EventRSVP[];
  announcements: Announcement[];
  applications: MembershipApplication[];
  reports: CommentReport[];

  // Toast
  toasts: ToastMessage[];
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;

  // Actions
  // Application
  submitApplication: (
    data: Omit<MembershipApplication, "id" | "status" | "created_at">,
  ) => { success: boolean; error?: string };
  updateApplicationStatus: (
    id: string,
    status: ApplicationStatus,
    notes?: string,
  ) => void;
  updateApplicationNotes: (id: string, notes: string) => void;

  // Auth / Profile
  updateProfile: (profileId: string, updates: Partial<Profile>) => void;
  toggleDirectoryVisibility: (visible: boolean) => void;
  leaveClub: () => void;

  // Books
  addBook: (book: Omit<Book, "id" | "created_at">) => void;
  updateBook: (id: string, updates: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  setCurrentBook: (id: string) => void;
  reorderBooks: (bookIds: string[]) => void;

  // Events & RSVPs
  addEvent: (event: Omit<Event, "id" | "created_at">) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  setRSVP: (eventId: string, status: RSVPStatus, note?: string) => void;
  getEventRSVP: (eventId: string) => RSVPStatus | null;
  getEventAttendees: (eventId: string) => {
    going: Profile[];
    maybe: Profile[];
    not_going: Profile[];
  };

  // Discussion & Comments
  addPrompt: (bookId: string, title: string, promptText: string) => void;
  addComment: (
    bookId: string,
    content: string,
    options?: { promptId?: string; parentId?: string; isSpoiler?: boolean },
  ) => void;
  editComment: (
    commentId: string,
    content: string,
    isSpoiler?: boolean,
  ) => void;
  deleteComment: (commentId: string) => void;
  reportComment: (commentId: string, reason: string) => void;
  moderateComment: (
    commentId: string,
    action: "hide" | "restore" | "delete",
    reason?: string,
  ) => void;

  // Announcements
  addAnnouncement: (data: Omit<Announcement, "id" | "created_at">) => void;
  deleteAnnouncement: (id: string) => void;

  // Member Management (Admin)
  updateMemberStatus: (profileId: string, status: MembershipStatus) => void;
  toggleAdminRole: (profileId: string, isAdmin: boolean) => void;

  // Demo Helpers
  switchPersona: (
    personaKey:
      | "public"
      | "amaka"
      | "zainab"
      | "chidi"
      | "folake"
      | "new_applicant",
  ) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = "good_company_store_v3";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const isSupabaseConnected = isSupabaseConfigured();

  // Core Data States
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [books, setBooks] = useState<Book[]>(SEEDED_BOOKS);
  const [prompts, setPrompts] = useState<DiscussionPrompt[]>(INITIAL_PROMPTS);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [rsvps, setRsvps] = useState<EventRSVP[]>(INITIAL_RSVPS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    INITIAL_ANNOUNCEMENTS,
  );
  const [applications, setApplications] =
    useState<MembershipApplication[]>(INITIAL_APPLICATIONS);
  const [reports, setReports] = useState<CommentReport[]>(INITIAL_REPORTS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Helper
  const addToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Load from localStorage if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.profiles) setProfiles(parsed.profiles);
        const localUpdatedAt = parsed.booksUpdatedAt
          ? new Date(parsed.booksUpdatedAt).getTime()
          : 0;
        if (
          parsed.books &&
          Array.isArray(parsed.books) &&
          localUpdatedAt >= SEEDED_UPDATED_AT
        ) {
          // Only use localStorage books if they are newer than or equal to the bundled curator-data.json
          const merged = parsed.books.map((b: Book) => {
            const init = INITIAL_BOOKS.find((ib) => ib.id === b.id);
            return {
              ...b,
              cover_url: b.cover_url || init?.cover_url,
              rating: b.rating !== undefined ? b.rating : init?.rating,
              spice_level:
                b.spice_level !== undefined ? b.spice_level : init?.spice_level,
            };
          });
          setBooks(merged);
        }
        if (parsed.prompts) setPrompts(parsed.prompts);
        if (parsed.comments) setComments(parsed.comments);
        if (parsed.events && Array.isArray(parsed.events)) {
          const mergedEvents = parsed.events.map((e: Event) => {
            const init = INITIAL_EVENTS.find((ie) => ie.id === e.id);
            if (init) {
              return {
                ...e,
                title: init.title,
                venue: init.venue,
                description: init.description,
              };
            }
            return e;
          });
          setEvents(mergedEvents);
        }
        if (parsed.rsvps) setRsvps(parsed.rsvps);
        if (parsed.announcements) setAnnouncements(parsed.announcements);
        if (parsed.applications) setApplications(parsed.applications);
        if (parsed.reports) setReports(parsed.reports);
        if (parsed.currentUserId) {
          const u = parsed.profiles?.find(
            (p: Profile) => p.id === parsed.currentUserId,
          );
          if (u) setCurrentUser(u);
        }
      }
    } catch {
      // Default fallback
    }
    setIsLoaded(true);
  }, []);

  // Hydrate books from curator server API (only if server data is newer than local admin edits)
  useEffect(() => {
    fetch("/api/curator")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.books) && data.books.length > 0) {
          let localUpdatedAt = 0;
          try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed.booksUpdatedAt) {
                localUpdatedAt = new Date(parsed.booksUpdatedAt).getTime();
              }
            }
          } catch {}

          const serverUpdatedAt = data.updatedAt
            ? new Date(data.updatedAt).getTime()
            : 0;
          if (localUpdatedAt > serverUpdatedAt) {
            return;
          }

          const curId = data.currentBookId || data.books[0]?.id;
          const merged = data.books.map((b: Book) => {
            const init = INITIAL_BOOKS.find((ib) => ib.id === b.id);
            return {
              ...b,
              is_current: b.id === curId,
              rating: b.rating !== undefined ? b.rating : init?.rating,
              spice_level:
                b.spice_level !== undefined ? b.spice_level : init?.spice_level,
            };
          });
          setBooks(merged);
        }
      })
      .catch(() => {});
  }, []);

  // Save to localStorage when modified
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      const existingBooksUpdatedAt = existing
        ? JSON.parse(existing)?.booksUpdatedAt
        : undefined;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          profiles,
          books,
          booksUpdatedAt: existingBooksUpdatedAt,
          prompts,
          comments,
          events,
          rsvps,
          announcements,
          applications,
          reports,
          currentUserId: currentUser?.id || null,
        }),
      );
    } catch {
      // Ignore quota errors
    }
  }, [
    profiles,
    books,
    prompts,
    comments,
    events,
    rsvps,
    announcements,
    applications,
    reports,
    currentUser,
    isLoaded,
  ]);

  // Derived current book
  const currentBook = books.find((b) => b.is_current) || books[0] || null;

  // Application Handlers
  const submitApplication = (
    data: Omit<MembershipApplication, "id" | "status" | "created_at">,
  ) => {
    // Prevent duplicate pending applications from the same email
    const duplicate = applications.find(
      (a) =>
        a.email.toLowerCase().trim() === data.email.toLowerCase().trim() &&
        a.status === "pending",
    );
    if (duplicate) {
      return {
        success: false,
        error:
          "A pending membership application for this email address is already under review.",
      };
    }

    const newApp: MembershipApplication = {
      ...data,
      id: "app-" + Math.random().toString(36).substring(2, 9),
      status: "pending",
      created_at: new Date().toISOString(),
    };

    setApplications((prev) => [newApp, ...prev]);
    addToast(
      "Your application is with us! We will read it shortly.",
      "success",
    );
    return { success: true };
  };

  const updateApplicationStatus = (
    id: string,
    status: ApplicationStatus,
    notes?: string,
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        const updated = {
          ...app,
          status,
          admin_notes: notes !== undefined ? notes : app.admin_notes,
          reviewed_by: currentUser?.id,
          reviewed_at: new Date().toISOString(),
        };

        // If approved, create/activate profile and send invitation
        if (status === "approved") {
          const existingProfile = profiles.find(
            (p) => p.email.toLowerCase() === app.email.toLowerCase(),
          );
          if (!existingProfile) {
            const newMember: Profile = {
              id: "prof-" + Math.random().toString(36).substring(2, 9),
              email: app.email,
              first_name: app.full_name.split(" ")[0] || app.full_name,
              display_name:
                `${app.full_name.split(" ")[0]} ${app.full_name.split(" ")[1]?.[0] ? app.full_name.split(" ")[1][0] + "." : ""}`.trim(),
              city: app.city,
              country: app.country,
              favourite_book: app.favourite_book,
              currently_reading: currentBook
                ? currentBook.title
                : "Problematic Summer Romance",
              avatar_color: "#F5D978",
              preferred_format: app.preferred_attendance,
              directory_visible: false,
              is_admin: false,
              membership_status: "active",
              created_at: new Date().toISOString(),
            };
            setProfiles((p) => [...p, newMember]);
          }
        }
        return updated;
      }),
    );
    addToast(`Application status updated to ${status}.`, "info");
  };

  const updateApplicationNotes = (id: string, notes: string) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, admin_notes: notes } : app)),
    );
    addToast("Private note saved.", "info");
  };

  // Profile Handlers
  const updateProfile = (profileId: string, updates: Partial<Profile>) => {
    setProfiles((prev) =>
      prev.map((p) => {
        if (p.id === profileId) {
          const updated = {
            ...p,
            ...updates,
            updated_at: new Date().toISOString(),
          };
          if (currentUser?.id === profileId) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return p;
      }),
    );
    addToast("Profile updated successfully.");
  };

  const toggleDirectoryVisibility = (visible: boolean) => {
    if (!currentUser) return;
    updateProfile(currentUser.id, { directory_visible: visible });
    addToast(
      visible
        ? "You are now visible in the member directory."
        : "You have been hidden from the member directory.",
    );
  };

  const leaveClub = () => {
    if (!currentUser) return;
    updateProfile(currentUser.id, {
      membership_status: "former_member",
      directory_visible: false,
    });
    setCurrentUser(null);
    addToast(
      "You have left Good Company. We will keep your reading space warm.",
      "info",
    );
  };

  // Helper to persist curator changes to localStorage + server file
  const syncCuratorData = async (booksList: Book[], activeId?: string) => {
    const updatedAt = new Date().toISOString();
    try {
      const existing = localStorage.getItem(STORAGE_KEY);
      const parsed = existing ? JSON.parse(existing) : {};
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...parsed,
          books: booksList,
          booksUpdatedAt: updatedAt,
        }),
      );
    } catch {}

    try {
      const curId =
        activeId || booksList.find((b) => b.is_current)?.id || booksList[0]?.id;
      await fetch("/api/curator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          books: booksList,
          currentBookId: curId,
          updatedAt,
        }),
      });
    } catch (err) {
      console.error("Failed to sync curator data to server:", err);
    }
  };

  // Book Handlers
  const addBook = (bookData: Omit<Book, "id" | "created_at">) => {
    const newBook: Book = {
      ...bookData,
      id: "book-" + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    setBooks((prev) => {
      let updated: Book[];
      if (newBook.is_current) {
        updated = [newBook, ...prev.map((b) => ({ ...b, is_current: false }))];
      } else {
        updated = [...prev, newBook];
      }
      syncCuratorData(updated, newBook.is_current ? newBook.id : undefined);
      return updated;
    });
    addToast(`Added "${newBook.title}" to the shelves.`);
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks((prev) => {
      const updated = prev.map((b) => {
        if (b.id === id) {
          return { ...b, ...updates };
        }
        if (updates.is_current && b.id !== id) {
          return { ...b, is_current: false };
        }
        return b;
      });
      syncCuratorData(updated, updates.is_current ? id : undefined);
      return updated;
    });
    addToast("Book updated.");
  };

  const deleteBook = (id: string) => {
    setBooks((prev) => {
      const remaining = prev.filter((b) => b.id !== id);
      syncCuratorData(remaining);
      return remaining;
    });
    addToast("Book removed from catalog.");
  };

  const setCurrentBook = (id: string) => {
    setBooks((prev) => {
      const updated = prev.map((b) => ({
        ...b,
        is_current: b.id === id,
        status:
          b.id === id
            ? ("currently_reading" as BookStatus)
            : b.status === "currently_reading"
              ? ("completed" as BookStatus)
              : b.status,
      }));
      syncCuratorData(updated, id);
      return updated;
    });
    const found = books.find((b) => b.id === id);
    addToast(`"${found?.title || "Book"}" is now the active read.`);
  };

  const reorderBooks = (bookIds: string[]) => {
    setBooks((prev) => {
      const copy = [...prev];
      bookIds.forEach((id, index) => {
        const item = copy.find((b) => b.id === id);
        if (item) item.sort_order = index + 1;
      });
      const sorted = copy.sort((a, b) => a.sort_order - b.sort_order);
      syncCuratorData(sorted);
      return sorted;
    });
    addToast("Bookshelf reordered.");
  };

  // Events Handlers
  const addEvent = (eventData: Omit<Event, "id" | "created_at">) => {
    const newEvent: Event = {
      ...eventData,
      id: "event-" + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    setEvents((prev) => [newEvent, ...prev]);
    addToast(`Event "${newEvent.title}" published.`);
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, ...updates, updated_at: new Date().toISOString() }
          : e,
      ),
    );
    addToast("Event updated.");
  };

  const setRSVP = (eventId: string, status: RSVPStatus, note?: string) => {
    if (!currentUser) {
      addToast("Please sign in or apply to RSVP for gatherings.", "error");
      return;
    }
    setRsvps((prev) => {
      const filtered = prev.filter(
        (r) => !(r.event_id === eventId && r.user_id === currentUser.id),
      );
      const newRsvp: EventRSVP = {
        id: "rsvp-" + Math.random().toString(36).substring(2, 9),
        event_id: eventId,
        user_id: currentUser.id,
        status,
        note,
        created_at: new Date().toISOString(),
      };
      return [...filtered, newRsvp];
    });
    addToast(
      `RSVP set to ${status === "going" ? "Going" : status === "maybe" ? "Maybe" : "Not going"}.`,
    );
  };

  const getEventRSVP = (eventId: string): RSVPStatus | null => {
    if (!currentUser) return null;
    const rsvp = rsvps.find(
      (r) => r.event_id === eventId && r.user_id === currentUser.id,
    );
    return rsvp ? rsvp.status : null;
  };

  const getEventAttendees = (eventId: string) => {
    const eventRsvps = rsvps.filter((r) => r.event_id === eventId);
    const going: Profile[] = [];
    const maybe: Profile[] = [];
    const not_going: Profile[] = [];

    eventRsvps.forEach((r) => {
      const p = profiles.find((prof) => prof.id === r.user_id);
      if (p) {
        if (r.status === "going") going.push(p);
        else if (r.status === "maybe") maybe.push(p);
        else not_going.push(p);
      }
    });

    return { going, maybe, not_going };
  };

  // Discussions & Comments Handlers
  const addPrompt = (bookId: string, title: string, promptText: string) => {
    const newPrompt: DiscussionPrompt = {
      id: "prompt-" + Math.random().toString(36).substring(2, 9),
      book_id: bookId,
      title,
      prompt_text: promptText,
      sort_order: prompts.filter((p) => p.book_id === bookId).length + 1,
      is_pinned: false,
      created_by: currentUser?.id,
      created_at: new Date().toISOString(),
    };
    setPrompts((prev) => [...prev, newPrompt]);
    addToast("Discussion prompt posted.");
  };

  const addComment = (
    bookId: string,
    content: string,
    options?: { promptId?: string; parentId?: string; isSpoiler?: boolean },
  ) => {
    if (!currentUser) {
      addToast("You must be an active member to comment.", "error");
      return;
    }

    const newComment: Comment = {
      id: "comment-" + Math.random().toString(36).substring(2, 9),
      book_id: bookId,
      prompt_id: options?.promptId,
      parent_id: options?.parentId,
      author_id: currentUser.id,
      content,
      is_spoiler: options?.isSpoiler || false,
      is_hidden: false,
      is_deleted: false,
      created_at: new Date().toISOString(),
    };

    setComments((prev) => [...prev, newComment]);
    addToast("Your response has been added to the room.");
  };

  const editComment = (
    commentId: string,
    content: string,
    isSpoiler?: boolean,
  ) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId && c.author_id === currentUser?.id) {
          return {
            ...c,
            content,
            is_spoiler: isSpoiler !== undefined ? isSpoiler : c.is_spoiler,
            updated_at: new Date().toISOString(),
          };
        }
        return c;
      }),
    );
    addToast("Comment edited.");
  };

  const deleteComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (
          c.id === commentId &&
          (c.author_id === currentUser?.id || currentUser?.is_admin)
        ) {
          return {
            ...c,
            is_deleted: true,
            content: "[Comment deleted by reader]",
            updated_at: new Date().toISOString(),
          };
        }
        return c;
      }),
    );
    addToast("Comment deleted.");
  };

  const reportComment = (commentId: string, reason: string) => {
    if (!currentUser) return;
    const newReport: CommentReport = {
      id: "rep-" + Math.random().toString(36).substring(2, 9),
      comment_id: commentId,
      reported_by: currentUser.id,
      reason,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    setReports((prev) => [newReport, ...prev]);
    addToast(
      "Thank you for flagging. Our moderation team will review it.",
      "info",
    );
  };

  const moderateComment = (
    commentId: string,
    action: "hide" | "restore" | "delete",
    reason?: string,
  ) => {
    if (!currentUser?.is_admin) return;

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          if (action === "hide") {
            return {
              ...c,
              is_hidden: true,
              hidden_by: currentUser.id,
              hidden_reason: reason || "Hidden by admin moderation",
              hidden_at: new Date().toISOString(),
            };
          }
          if (action === "restore") {
            return {
              ...c,
              is_hidden: false,
              hidden_by: undefined,
              hidden_reason: undefined,
              hidden_at: undefined,
            };
          }
          if (action === "delete") {
            return {
              ...c,
              is_deleted: true,
              content: "[Removed by moderator]",
              hidden_by: currentUser.id,
              hidden_at: new Date().toISOString(),
            };
          }
        }
        return c;
      }),
    );

    // Update any matching report
    setReports((prev) =>
      prev.map((r) =>
        r.comment_id === commentId
          ? {
              ...r,
              status: action === "restore" ? "dismissed" : "resolved",
              resolved_by: currentUser.id,
              resolved_at: new Date().toISOString(),
            }
          : r,
      ),
    );

    addToast(
      `Comment ${action === "hide" ? "hidden" : action === "restore" ? "restored" : "removed"}.`,
    );
  };

  // Announcements Handlers
  const addAnnouncement = (data: Omit<Announcement, "id" | "created_at">) => {
    const newAnnouncement: Announcement = {
      ...data,
      id: "ann-" + Math.random().toString(36).substring(2, 9),
      author_id: currentUser?.id,
      author_name: currentUser?.display_name || "Admin",
      created_at: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnnouncement, ...prev]);
    addToast("Announcement posted.");
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    addToast("Announcement removed.");
  };

  // Member Management Handlers
  const updateMemberStatus = (profileId: string, status: MembershipStatus) => {
    if (!currentUser?.is_admin) return;
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId ? { ...p, membership_status: status } : p,
      ),
    );
    addToast(`Member status changed to ${status}.`);
  };

  const toggleAdminRole = (profileId: string, isAdmin: boolean) => {
    if (!currentUser?.is_admin) return;
    setProfiles((prev) =>
      prev.map((p) => (p.id === profileId ? { ...p, is_admin: isAdmin } : p)),
    );
    addToast(
      isAdmin ? "Admin privileges granted." : "Admin privileges revoked.",
    );
  };

  // Demo Helpers
  const switchPersona = (
    personaKey:
      | "public"
      | "amaka"
      | "zainab"
      | "chidi"
      | "folake"
      | "new_applicant",
  ) => {
    if (personaKey === "public") {
      setCurrentUser(null);
      addToast("Browsing as Public Visitor.", "info");
      return;
    }
    if (personaKey === "zainab") {
      const zainab =
        profiles.find((p) => p.email === "zainab@readwithgoodcompany.com") ||
        INITIAL_PROFILES[0];
      setCurrentUser(zainab);
      addToast("Switched to Zainab Bello (Administrator).", "info");
      return;
    }
    if (personaKey === "amaka") {
      const amaka =
        profiles.find((p) => p.email === "amaka@example.com") ||
        INITIAL_PROFILES[1];
      setCurrentUser(amaka);
      addToast("Switched to Amaka Okafor (Active Member, Abuja).", "info");
      return;
    }
    if (personaKey === "chidi") {
      const chidi =
        profiles.find((p) => p.email === "chidi@example.com") ||
        INITIAL_PROFILES[2];
      setCurrentUser(chidi);
      addToast("Switched to Chidi Eze (Active Member, Online).", "info");
      return;
    }
    if (personaKey === "folake") {
      const folake =
        profiles.find((p) => p.email === "folake@example.com") ||
        INITIAL_PROFILES[3];
      setCurrentUser(folake);
      addToast("Switched to Folake Adeleke (Active Member, London).", "info");
      return;
    }
    if (personaKey === "new_applicant") {
      setCurrentUser(null);
      addToast("Ready to test the membership application form.", "info");
      return;
    }
  };

  const resetDemoData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setProfiles(INITIAL_PROFILES);
    setBooks(INITIAL_BOOKS);
    setPrompts(INITIAL_PROMPTS);
    setComments(INITIAL_COMMENTS);
    setEvents(INITIAL_EVENTS);
    setRsvps(INITIAL_RSVPS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setApplications(INITIAL_APPLICATIONS);
    setReports(INITIAL_REPORTS);
    setCurrentUser(null);
    addToast("Demo database reset to original seed state.", "info");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isSupabaseConnected,
        profiles,
        books,
        currentBook,
        prompts,
        comments,
        events,
        rsvps,
        announcements,
        applications,
        reports,
        toasts,
        addToast,
        removeToast,
        submitApplication,
        updateApplicationStatus,
        updateApplicationNotes,
        updateProfile,
        toggleDirectoryVisibility,
        leaveClub,
        addBook,
        updateBook,
        deleteBook,
        setCurrentBook,
        reorderBooks,
        addEvent,
        updateEvent,
        setRSVP,
        getEventRSVP,
        getEventAttendees,
        addPrompt,
        addComment,
        editComment,
        deleteComment,
        reportComment,
        moderateComment,
        addAnnouncement,
        deleteAnnouncement,
        updateMemberStatus,
        toggleAdminRole,
        switchPersona,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
