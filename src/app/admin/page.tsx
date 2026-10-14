"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "@/lib/store/app-context";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { BookCover } from "@/components/books/BookCover";
import { Book, BookStatus } from "@/types";
import {
  searchOpenLibrary,
  fetchWorkDescription,
  fetchBookRating,
  OpenLibraryBookResult,
} from "@/lib/api/open-library";
import { SpicePicker } from "@/components/books/BookBadges";
import { StarFlair } from "@/components/ui/Illustrations";
import {
  Book1,
  Clock,
  SecuritySafe,
  Add,
  Trash,
  Edit2,
  SearchNormal1,
  TickCircle,
  Star,
} from "iconsax-react";
import { X } from "lucide-react";

export default function AdminPage() {
  const { books, addBook, updateBook, deleteBook, setCurrentBook, addToast } =
    useApp();

  // Catalog Search & Filter State
  const [catalogSearch, setCatalogSearch] = useState("");
  const [catalogStatusFilter, setCatalogStatusFilter] = useState<
    "all" | "current" | "upcoming" | "past"
  >("all");

  // Modal 1: Edit Notes & Guide Modal State
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editCuratorNote, setEditCuratorNote] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editReadingStartDate, setEditReadingStartDate] = useState("");
  const [editReadingEndDate, setEditReadingEndDate] = useState("");
  const [editDiscussionDate, setEditDiscussionDate] = useState("");
  const [editMeetingFormat, setEditMeetingFormat] = useState("Abuja & Online");
  const [editHasContentNotes, setEditHasContentNotes] = useState(false);
  const [editContentNotes, setEditContentNotes] = useState("");
  const [editHasSceneSkip, setEditHasSceneSkip] = useState(false);
  const [editSceneSkipGuide, setEditSceneSkipGuide] = useState("");
  const [editRating, setEditRating] = useState<number | undefined>(undefined);
  const [editSpiceLevel, setEditSpiceLevel] = useState<number>(3);
  const [editWeek1, setEditWeek1] = useState("");
  const [editWeek2, setEditWeek2] = useState("");
  const [editWeek3, setEditWeek3] = useState("");
  const [editWeek4, setEditWeek4] = useState("");

  // Modal 2: Add Book Modal State
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [olSearchQuery, setOlSearchQuery] = useState("");
  const [isSearchingOl, setIsSearchingOl] = useState(false);
  const [isPullingDetails, setIsPullingDetails] = useState(false);
  const [olResults, setOlResults] = useState<OpenLibraryBookResult[]>([]);
  const [newBookForm, setNewBookForm] = useState({
    title: "",
    author: "",
    genre: "Contemporary Romance",
    description: "",
    curator_note: "",
    cover_url: "",
    cover_color: "#5B2302",
    rating: undefined as number | undefined,
    spice_level: 3 as number,
    reading_start_date: "2026-10-01",
    reading_end_date: "",
    discussion_date: "",
    meeting_format: "Abuja & Online",
    has_content_notes: false,
    content_notes: "",
    has_scene_skip: false,
    scene_skip_guide: "",
    is_current: false,
    status: "upcoming" as BookStatus,
  });

  // Open Edit Modal for a specific book
  const openEditModal = (book: Book) => {
    setEditingBook(book);
    setEditCuratorNote(book.curator_note || "");
    setEditDescription(book.description || "");
    setEditReadingStartDate(book.reading_start_date || "");
    setEditReadingEndDate(book.reading_end_date || "");
    setEditDiscussionDate(
      book.discussion_date ? book.discussion_date.split("T")[0] : "",
    );
    setEditMeetingFormat(book.meeting_format || "Abuja & Online");
    setEditHasContentNotes(Boolean(book.has_content_notes));
    setEditContentNotes(book.content_notes || "");
    setEditHasSceneSkip(Boolean(book.has_scene_skip));
    setEditSceneSkipGuide(book.scene_skip_guide || "");
    setEditRating(book.rating);
    setEditSpiceLevel(book.spice_level !== undefined ? book.spice_level : 3);

    if (book.reading_guide) {
      const lines = book.reading_guide.split("\n").filter(Boolean);
      setEditWeek1(lines[0] || "Chapters 1–7: Opening Chapters & Premise.");
      setEditWeek2(
        lines[1] || "Chapters 8–15: Rising Tension & Complications.",
      );
      setEditWeek3(lines[2] || "Chapters 16–22: Turning Points.");
      setEditWeek4(lines[3] || "Chapters 23–End: Climax & Epilogue.");
    } else {
      setEditWeek1("Chapters 1–7: Opening Chapters & Premise.");
      setEditWeek2("Chapters 8–15: Rising Tension & Complications.");
      setEditWeek3("Chapters 16–22: Turning Points.");
      setEditWeek4("Chapters 23–End: Climax & Epilogue.");
    }
  };

  // Save changes from Edit Modal
  const handleSaveEditModal = () => {
    if (!editingBook) return;

    const compiledGuide = [editWeek1, editWeek2, editWeek3, editWeek4]
      .filter(Boolean)
      .join("\n");

    updateBook(editingBook.id, {
      curator_note: editCuratorNote,
      description: editDescription,
      rating: editRating,
      spice_level: editSpiceLevel,
      reading_start_date: editReadingStartDate,
      reading_end_date: editReadingEndDate,
      discussion_date: editDiscussionDate
        ? `${editDiscussionDate}T15:00:00Z`
        : editingBook.discussion_date,
      meeting_format: editMeetingFormat,
      has_content_notes: editHasContentNotes,
      content_notes: editContentNotes,
      has_scene_skip: editHasSceneSkip,
      scene_skip_guide: editSceneSkipGuide,
      reading_guide: compiledGuide,
    });

    addToast(`Saved guide & notes for "${editingBook.title}".`, "success");
    setEditingBook(null);
  };

  // Delete Book action
  const handleDeleteBook = (id: string, title: string) => {
    if (books.length <= 1) {
      addToast("The library needs at least one book.", "error");
      return;
    }

    deleteBook(id);
    addToast(`Removed "${title}" from the catalog.`, "info");
  };

  // Open Library Search for Add Book Modal
  const handleSearchOl = async () => {
    if (!olSearchQuery.trim()) return;
    setIsSearchingOl(true);
    try {
      const results = await searchOpenLibrary(olSearchQuery);
      setOlResults(results);
    } catch {
      addToast("Could not fetch Open Library results.", "error");
    } finally {
      setIsSearchingOl(false);
    }
  };

  const handleSelectOlResult = async (result: OpenLibraryBookResult) => {
    setIsPullingDetails(true);
    let fullDescription = result.description || "";
    if (result.work_key) {
      try {
        const fetched = await fetchWorkDescription(result.work_key);
        if (fetched) {
          fullDescription = fetched;
        }
      } catch (err) {
        console.error("Failed to fetch full synopsis:", err);
      }
    }

    // Auto-resolve rating if not present on search doc
    let resolvedRating = result.rating;
    if (resolvedRating === undefined && result.title) {
      try {
        const fetchedRating = await fetchBookRating(
          result.title,
          result.author,
        );
        if (fetchedRating !== undefined) {
          resolvedRating = fetchedRating;
        }
      } catch (err) {
        console.error("Failed to auto-fetch rating for selected book:", err);
      }
    }

    setNewBookForm((prev) => ({
      ...prev,
      title: result.title,
      author: result.author,
      genre: result.genre || prev.genre,
      cover_url: result.cover_url || prev.cover_url,
      description: fullDescription || prev.description,
      rating: resolvedRating !== undefined ? resolvedRating : prev.rating,
    }));
    setOlResults([]);
    setOlSearchQuery("");
    setIsPullingDetails(false);
    addToast(
      `Loaded "${result.title}" with synopsis, genre, and ${resolvedRating ? `rating (★ ${resolvedRating})` : "details"}.`,
      "success",
    );
  };

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookForm.title.trim() || !newBookForm.author.trim()) {
      addToast("Please provide both Title and Author.", "error");
      return;
    }

    const compiledGuide = [
      "Week 1: Chapters 1–7: Opening Chapters & Premise.",
      "Week 2: Chapters 8–15: Rising Tension & Complications.",
      "Week 3: Chapters 16–22: Turning Points.",
      "Week 4: Chapters 23–End: Climax & Epilogue.",
    ].join("\n");

    addBook({
      title: newBookForm.title.trim(),
      author: newBookForm.author.trim(),
      genre: newBookForm.genre.trim(),
      description:
        newBookForm.description.trim() ||
        "A selected read for Good Company Book Club.",
      curator_note: newBookForm.curator_note.trim(),
      cover_url: newBookForm.cover_url.trim() || undefined,
      cover_color: newBookForm.cover_color,
      rating: newBookForm.rating,
      spice_level: newBookForm.spice_level,
      reading_start_date: newBookForm.reading_start_date,
      reading_end_date:
        newBookForm.reading_end_date || newBookForm.reading_start_date,
      discussion_date: newBookForm.discussion_date
        ? `${newBookForm.discussion_date}T15:00:00Z`
        : `${newBookForm.reading_start_date}T15:00:00Z`,
      meeting_format: newBookForm.meeting_format,
      has_content_notes: newBookForm.has_content_notes,
      content_notes: newBookForm.content_notes,
      has_scene_skip: newBookForm.has_scene_skip,
      scene_skip_guide: newBookForm.scene_skip_guide,
      reading_guide: compiledGuide,
      status: newBookForm.is_current ? "currently_reading" : newBookForm.status,
      is_current: newBookForm.is_current,
      sort_order: books.length + 1,
    });

    setIsAddBookModalOpen(false);
    setNewBookForm({
      title: "",
      author: "",
      genre: "Contemporary Romance",
      description: "",
      curator_note: "",
      cover_url: "",
      cover_color: "#5B2302",
      rating: undefined,
      spice_level: 3,
      reading_start_date: "2026-10-01",
      reading_end_date: "",
      discussion_date: "",
      meeting_format: "Abuja & Online",
      has_content_notes: false,
      content_notes: "",
      has_scene_skip: false,
      scene_skip_guide: "",
      is_current: false,
      status: "upcoming",
    });
    addToast("Book added and synced to disk.", "success");
  };

  // Filtered books for catalog search
  const filteredCatalogBooks = useMemo(() => {
    let list = [...books];

    // Status filter
    if (catalogStatusFilter === "current") {
      list = list.filter((b) => b.is_current);
    } else if (catalogStatusFilter === "upcoming") {
      list = list.filter((b) => b.status === "upcoming" && !b.is_current);
    } else if (catalogStatusFilter === "past") {
      list = list.filter(
        (b) =>
          b.status === "completed" ||
          (!b.is_current && b.status !== "upcoming"),
      );
    }

    // Search query filter
    if (catalogSearch.trim()) {
      const q = catalogSearch.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q),
      );
    }

    return list;
  }, [books, catalogSearch, catalogStatusFilter]);

  const currentCount = useMemo(
    () => books.filter((b) => b.is_current).length,
    [books],
  );
  const upcomingCount = useMemo(
    () => books.filter((b) => b.status === "upcoming" && !b.is_current).length,
    [books],
  );
  const pastCount = useMemo(
    () =>
      books.filter(
        (b) =>
          b.status === "completed" ||
          (!b.is_current && b.status !== "upcoming"),
      ).length,
    [books],
  );

  return (
    <div className="min-h-screen bg-[#F6EEE9] text-[#5B2302] flex flex-col font-body">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* ========================================================================= */}
          {/* HEADER BAR */}
          {/* ========================================================================= */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#5B2302]/20">
            <div>
              <span className="px-3.5 py-1 rounded-full bg-[#FFA5D5] text-[#5B2302] text-xs font-extrabold uppercase tracking-widest border border-[#5B2302]/20 inline-flex items-center gap-1.5 mb-2">
                <StarFlair className="w-3.5 h-3.5 text-[#5B2302]" />
                Admin
              </span>
              <h1 className="font-block text-3xl sm:text-5xl uppercase text-[#5B2302] leading-tight">
                Book Catalog ({books.length})
              </h1>
              <p className="text-xs sm:text-sm text-[#5B2302]/80 mt-1 max-w-xl">
                Set active club reads, update weekly pacing guides &amp;
                editorial notes, and manage the collection.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsAddBookModalOpen(true)}
                className="h-10 px-4 rounded-xl bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-none"
              >
                <Add size={16} color="#FFA5D5" variant="Bold" />
                Add New Book
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SINGLE STREAMLINED CATALOG SCREEN */}
          {/* ========================================================================= */}
          <div className="space-y-5">
            {/* Search & Filter Bar */}
            <div className="bg-paper-white border border-[#5B2302]/20 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-none">
              <div className="relative flex-1">
                <SearchNormal1
                  size={16}
                  color="#5B2302"
                  className="opacity-50 absolute left-3 top-3 pointer-events-none"
                />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search books by title, author, or genre..."
                  className="flex h-10 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] pl-9 pr-3 py-2 text-sm text-[#5B2302] placeholder:text-[#5B2302]/40 transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] focus:border-[#5B2302] shadow-none"
                />
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                {[
                  { id: "all", label: `All (${books.length})` },
                  { id: "current", label: `Active (${currentCount})` },
                  { id: "upcoming", label: `Upcoming (${upcomingCount})` },
                  { id: "past", label: `Past (${pastCount})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCatalogStatusFilter(tab.id as any)}
                    className={`h-9 px-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shrink-0 border shadow-none ${
                      catalogStatusFilter === tab.id
                        ? "bg-[#5B2302] text-[#F6EEE9] border-[#5B2302]"
                        : "bg-[#FFFDF9] text-[#5B2302]/80 border-[#5B2302]/20 hover:border-[#5B2302]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Book Catalog List */}
            <div className="bg-paper-white border border-[#5B2302]/20 rounded-2xl overflow-hidden divide-y divide-[#5B2302]/15 shadow-none">
              {filteredCatalogBooks.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <p className="font-script text-2xl text-[#5B2302]">
                    No books found matching your search.
                  </p>
                  <p className="text-xs text-[#5B2302]/60">
                    Try searching for a different title or author.
                  </p>
                </div>
              ) : (
                filteredCatalogBooks.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#F6EEE9]/30 transition-colors"
                  >
                    {/* Left: Book Cover & Details */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-20 sm:w-24 shrink-0 flex justify-center">
                        <BookCover
                          book={b}
                          size="sm"
                          showBookmark={b.is_current}
                          showBadge={false}
                        />
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-block text-base uppercase text-[#5B2302] truncate">
                            {b.title}
                          </h3>
                          {b.is_current ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#5B2302] text-[#F6EEE9] text-[9px] font-extrabold uppercase">
                              Active Read
                            </span>
                          ) : b.status === "upcoming" ? (
                            <span className="px-2 py-0.5 rounded-full bg-butter-yellow text-[#5B2302] text-[9px] font-extrabold uppercase border border-[#5B2302]/20">
                              Upcoming
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-[#F6EEE9] text-[#5B2302]/70 text-[9px] font-bold uppercase border border-[#5B2302]/20">
                              Past Read
                            </span>
                          )}
                        </div>
                        <p className="font-script text-base text-[#5B2302]/85 truncate">
                          by {b.author}
                        </p>
                        <p className="text-[11px] text-[#5B2302]/65 flex items-center gap-1.5 flex-wrap">
                          <span>{b.genre}</span>
                          <span>
                            &bull; {b.meeting_format || "Abuja & Online"}
                          </span>
                          <span>
                            &bull; {b.reading_start_date || "Ongoing"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Direct Actions (Set Active, Edit Notes Modal, Delete) */}
                    <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
                      {!b.is_current ? (
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentBook(b.id);
                            addToast(
                              `"${b.title}" set as active read!`,
                              "success",
                            );
                          }}
                          className="h-9 px-3 rounded-lg border border-[#5B2302]/30 bg-[#FFFDF9] hover:bg-[#5B2302] hover:text-[#F6EEE9] text-xs font-bold uppercase transition-colors shadow-none"
                        >
                          Set Active
                        </button>
                      ) : (
                        <span className="h-9 px-3 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                          <TickCircle
                            size={15}
                            color="#065f46"
                            variant="Bold"
                          />{" "}
                          Featured
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => openEditModal(b)}
                        className="h-9 px-3.5 rounded-lg bg-[#5B2302] text-[#F6EEE9] hover:bg-deep-burgundy text-xs font-bold uppercase flex items-center gap-1.5 transition-colors shadow-none"
                      >
                        <Edit2 size={14} color="#FFA5D5" variant="Bold" />
                        Edit Notes &amp; Guide
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteBook(b.id, b.title)}
                        className="h-9 px-2.5 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold transition-colors shadow-none flex items-center justify-center"
                        title="Delete book"
                      >
                        <Trash size={16} color="currentColor" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT NOTES & PACING GUIDE (Clean, Focused Modal) */}
      {/* ========================================================================= */}
      {editingBook && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setEditingBook(null)}
          className="fixed inset-0 z-50 bg-[#3D1600]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFFCF7] border border-[#5B2302]/20 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto no-scrollbar p-6 sm:p-8 space-y-6 shadow-none"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#5B2302]/15">
              <div className="flex items-center gap-5">
                <div className="w-20 sm:w-24 shrink-0 flex justify-center">
                  <BookCover
                    book={editingBook}
                    size="sm"
                    showBookmark={editingBook.is_current}
                    showBadge={false}
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B2302]/60 block mb-0.5">
                    Editing Guide &amp; Notes
                  </span>
                  <h3 className="font-block text-2xl sm:text-3xl uppercase text-[#5B2302] leading-tight">
                    {editingBook.title}
                  </h3>
                  <p className="font-script text-lg text-[#5B2302]/85">
                    by {editingBook.author} &bull;{" "}
                    <span className="font-body text-xs font-semibold">
                      {editingBook.genre}
                    </span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingBook(null)}
                className="p-1.5 rounded-full border border-[#5B2302]/30 text-[#5B2302] hover:bg-[#5B2302] hover:text-[#F6EEE9] transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Synopsis, Notes, Dates */}
              <div className="lg:col-span-7 space-y-4">
                {/* 1. Synopsis / Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                    Synopsis / Blurb
                  </label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Book overview or blurb..."
                    className="flex min-h-[80px] w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] p-3 text-sm text-[#5B2302] placeholder:text-[#5B2302]/40 transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] focus:border-[#5B2302] resize-none shadow-none"
                  />
                </div>

                {/* 2. Curator Editorial Take */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                    Curator Editorial Take
                  </label>
                  <textarea
                    rows={3}
                    value={editCuratorNote}
                    onChange={(e) => setEditCuratorNote(e.target.value)}
                    placeholder="Your editorial take on this book..."
                    className="flex min-h-[80px] w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] p-3 text-sm text-[#5B2302] placeholder:text-[#5B2302]/40 transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] focus:border-[#5B2302] resize-none shadow-none"
                  />
                </div>

                {/* 3. Community Rating & Spice Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl border border-[#5B2302]/20 bg-[#FFFDF9]">
                  {/* Rating */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-[#5B2302] uppercase tracking-wider block">
                      Rating (out of 5.0)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={editRating ?? ""}
                      onChange={(e) =>
                        setEditRating(
                          e.target.value
                            ? parseFloat(e.target.value)
                            : undefined,
                        )
                      }
                      placeholder="e.g. 4.2"
                      className="flex h-9 w-full rounded-lg border border-[#5B2302]/20 bg-white px-3 py-1.5 text-xs font-body font-bold text-[#5B2302] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] shadow-none"
                    />
                  </div>

                  {/* Spice Level */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-[#5B2302] uppercase tracking-wider block">
                      Spice Level
                    </label>
                    <SpicePicker
                      value={editSpiceLevel}
                      onChange={setEditSpiceLevel}
                    />
                  </div>
                </div>

                {/* 4. Dates & Format */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#5B2302] uppercase tracking-wider block">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={editReadingStartDate}
                      onChange={(e) => setEditReadingStartDate(e.target.value)}
                      className="flex h-9 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-1.5 text-xs text-[#5B2302] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] shadow-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#5B2302] uppercase tracking-wider block">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={editReadingEndDate}
                      onChange={(e) => setEditReadingEndDate(e.target.value)}
                      className="flex h-9 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-1.5 text-xs text-[#5B2302] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] shadow-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#5B2302] uppercase tracking-wider block">
                      Discussion Date
                    </label>
                    <input
                      type="date"
                      value={editDiscussionDate}
                      onChange={(e) => setEditDiscussionDate(e.target.value)}
                      className="flex h-9 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-1.5 text-xs text-[#5B2302] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] shadow-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#5B2302] uppercase tracking-wider block">
                      Meeting Format
                    </label>
                    <input
                      type="text"
                      value={editMeetingFormat}
                      onChange={(e) => setEditMeetingFormat(e.target.value)}
                      placeholder="e.g. Abuja & Online"
                      className="flex h-9 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-1.5 text-xs text-[#5B2302] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] shadow-none"
                    />
                  </div>
                </div>

                {/* 4. Themes & Content Notes */}
                <div className="p-3.5 rounded-xl border border-[#5B2302]/20 bg-[#FFFDF9] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider flex items-center gap-1.5">
                      <SecuritySafe size={15} color="#5B2302" variant="Bold" />
                      Themes &amp; Content Notes
                    </label>
                    <input
                      type="checkbox"
                      checked={editHasContentNotes}
                      onChange={(e) => setEditHasContentNotes(e.target.checked)}
                      className="w-4 h-4 accent-[#5B2302] cursor-pointer"
                    />
                  </div>
                  {editHasContentNotes && (
                    <textarea
                      rows={2}
                      value={editContentNotes}
                      onChange={(e) => setEditContentNotes(e.target.value)}
                      placeholder="Themes, content warnings, or reader advisories..."
                      className="flex min-h-[60px] w-full rounded-lg border border-[#5B2302]/20 bg-white p-2.5 text-xs text-[#5B2302] placeholder:text-[#5B2302]/40 transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] resize-none shadow-none"
                    />
                  )}
                </div>

                {/* 5. Scene-Skip Guide */}
                <div className="p-3.5 rounded-xl border border-[#5B2302]/20 bg-[#FFFDF9] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider flex items-center gap-1.5">
                      <Star size={15} color="#FFA5D5" variant="Bold" />
                      Spicy Scenes Guide
                    </label>
                    <input
                      type="checkbox"
                      checked={editHasSceneSkip}
                      onChange={(e) => setEditHasSceneSkip(e.target.checked)}
                      className="w-4 h-4 accent-[#5B2302] cursor-pointer"
                    />
                  </div>
                  {editHasSceneSkip && (
                    <textarea
                      rows={2}
                      value={editSceneSkipGuide}
                      onChange={(e) => setEditSceneSkipGuide(e.target.value)}
                      placeholder="Chapter skip page references..."
                      className="flex min-h-[60px] w-full rounded-lg border border-[#5B2302]/20 bg-white p-2.5 text-xs text-[#5B2302] placeholder:text-[#5B2302]/40 transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] resize-none shadow-none"
                    />
                  )}
                </div>
              </div>

              {/* Right Column: Weekly Pacing Guide */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-xl border border-[#5B2302]/20 bg-[#F6EEE9]/70 space-y-3.5">
                  <div className="flex items-center gap-2">
                    <Clock size={16} color="#5B2302" variant="Bold" />
                    <h4 className="font-block text-base uppercase text-[#5B2302]">
                      Weekly Pacing Guide
                    </h4>
                  </div>

                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-[#5B2302]">
                        Week 1 Target
                      </label>
                      <input
                        type="text"
                        value={editWeek1}
                        onChange={(e) => setEditWeek1(e.target.value)}
                        className="flex h-9 w-full rounded-lg border border-[#5B2302]/20 bg-white px-3 py-1.5 text-xs text-[#5B2302] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] shadow-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-[#5B2302]">
                        Week 2 Target
                      </label>
                      <input
                        type="text"
                        value={editWeek2}
                        onChange={(e) => setEditWeek2(e.target.value)}
                        className="flex h-9 w-full rounded-lg border border-[#5B2302]/20 bg-white px-3 py-1.5 text-xs text-[#5B2302] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] shadow-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-[#5B2302]">
                        Week 3 Target
                      </label>
                      <input
                        type="text"
                        value={editWeek3}
                        onChange={(e) => setEditWeek3(e.target.value)}
                        className="flex h-9 w-full rounded-lg border border-[#5B2302]/20 bg-white px-3 py-1.5 text-xs text-[#5B2302] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] shadow-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold uppercase text-[#5B2302]">
                        Week 4 Target (Finale)
                      </label>
                      <input
                        type="text"
                        value={editWeek4}
                        onChange={(e) => setEditWeek4(e.target.value)}
                        className="flex h-9 w-full rounded-lg border border-[#5B2302]/20 bg-white px-3 py-1.5 text-xs text-[#5B2302] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] shadow-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#5B2302]/15 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingBook(null)}
                className="h-10 px-4 rounded-xl border border-[#5B2302]/30 text-xs font-bold uppercase text-[#5B2302] hover:bg-[#F6EEE9] transition-colors shadow-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditModal}
                className="h-10 px-6 rounded-xl bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-none"
              >
                <TickCircle size={15} color="#FFA5D5" variant="Bold" />
                Save Notes &amp; Sync
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD BOOK MODAL */}
      {/* ========================================================================= */}
      {isAddBookModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsAddBookModalOpen(false)}
          className="fixed inset-0 z-50 bg-[#3D1600]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFFCF7] border border-[#5B2302]/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto no-scrollbar p-6 sm:p-8 space-y-6 shadow-none"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#5B2302]/15">
              <h3 className="font-block text-2xl uppercase text-[#5B2302]">
                Add Book to Catalog
              </h3>
              <button
                type="button"
                onClick={() => setIsAddBookModalOpen(false)}
                className="p-1.5 rounded-full border border-[#5B2302]/30 text-[#5B2302] hover:bg-[#5B2302] hover:text-[#F6EEE9] transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" strokeWidth={2.2} />
              </button>
            </div>

            {/* Quick Open Library Search */}
            <div className="space-y-2 p-4 rounded-xl border border-[#5B2302]/20 bg-[#F6EEE9]/60">
              <span className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                Quick Autofill from Open Library
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={olSearchQuery}
                  onChange={(e) => setOlSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchOl()}
                  placeholder="e.g. Heartless, Book Lovers, Gabrielle Zevin..."
                  className="flex h-10 w-full rounded-lg border border-[#5B2302]/20 bg-white px-3 py-2 text-sm text-[#5B2302] placeholder:text-[#5B2302]/40 transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] shadow-none"
                />
                <button
                  type="button"
                  onClick={handleSearchOl}
                  disabled={isSearchingOl}
                  className="h-10 px-4 rounded-lg bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] text-xs font-bold uppercase transition-colors shrink-0 disabled:opacity-50 shadow-none"
                >
                  {isSearchingOl ? "Searching..." : "Search"}
                </button>
              </div>

              {olResults.length > 0 && (
                <div className="mt-2 divide-y divide-[#5B2302]/10 max-h-60 overflow-y-auto bg-white rounded-xl border border-[#5B2302]/20 shadow-none">
                  {olResults.map((r, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectOlResult(r)}
                      className="p-3 hover:bg-[#FFA5D5]/20 cursor-pointer flex items-center gap-3 transition-colors text-left"
                    >
                      {r.cover_url ? (
                        <img
                          src={r.cover_url}
                          alt={r.title}
                          className="w-10 h-14 object-cover rounded shrink-0 border border-[#5B2302]/15"
                        />
                      ) : (
                        <div className="w-10 h-14 bg-[#5B2302]/10 rounded flex items-center justify-center shrink-0 text-[#5B2302]">
                          <Book1
                            size={20}
                            color="#5B2302"
                            className="opacity-40"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-[#5B2302] truncate">
                            {r.title}
                          </span>
                          {r.rating && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                              <Star size={10} color="#f59e0b" variant="Bold" />
                              {r.rating}
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded bg-[#5B2302]/10 text-[#5B2302] text-[10px] font-bold">
                            {r.genre}
                          </span>
                        </div>
                        <p className="text-xs text-[#5B2302]/70 truncate mt-0.5">
                          by {r.author}{" "}
                          {r.first_publish_year
                            ? `(${r.first_publish_year})`
                            : ""}
                        </p>
                        {r.description && (
                          <p className="text-[11px] text-[#5B2302]/60 line-clamp-1 mt-0.5">
                            {r.description}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-bold text-[#5B2302] shrink-0 hover:underline">
                        Select &rarr;
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {isPullingDetails && (
                <div className="p-3 bg-[#FFA5D5]/25 rounded-xl text-xs text-[#5B2302] font-bold flex items-center gap-2 animate-pulse">
                  <StarFlair className="w-4 h-4 text-[#5B2302]" />
                  Pulling synopsis, genre, and details...
                </div>
              )}
            </div>

            {/* Manual Form */}
            <form onSubmit={handleCreateBook} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBookForm.title}
                    onChange={(e) =>
                      setNewBookForm({ ...newBookForm, title: e.target.value })
                    }
                    placeholder="e.g. Heartless"
                    className="flex h-10 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-2 text-sm text-[#5B2302] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] shadow-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBookForm.author}
                    onChange={(e) =>
                      setNewBookForm({ ...newBookForm, author: e.target.value })
                    }
                    placeholder="e.g. Elsie Silver"
                    className="flex h-10 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-2 text-sm text-[#5B2302] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] shadow-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                    Genre
                  </label>
                  <input
                    type="text"
                    value={newBookForm.genre}
                    onChange={(e) =>
                      setNewBookForm({ ...newBookForm, genre: e.target.value })
                    }
                    placeholder="e.g. Contemporary Romance"
                    className="flex h-10 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-2 text-sm text-[#5B2302] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] shadow-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={newBookForm.cover_url}
                    onChange={(e) =>
                      setNewBookForm({
                        ...newBookForm,
                        cover_url: e.target.value,
                      })
                    }
                    placeholder="https://... or leave blank"
                    className="flex h-10 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-2 text-sm text-[#5B2302] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] shadow-none"
                  />
                </div>
              </div>

              {/* Rating & Spice Level Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl border border-[#5B2302]/20 bg-[#FFFDF9]">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                    Rating (out of 5.0)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={newBookForm.rating ?? ""}
                    onChange={(e) =>
                      setNewBookForm({
                        ...newBookForm,
                        rating: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="e.g. 4.2"
                    className="flex h-9 w-full rounded-lg border border-[#5B2302]/20 bg-white px-3 py-1.5 text-xs font-body font-bold text-[#5B2302] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] shadow-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                    Spice Level
                  </label>
                  <SpicePicker
                    value={newBookForm.spice_level}
                    onChange={(lvl) =>
                      setNewBookForm({ ...newBookForm, spice_level: lvl })
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                    Synopsis / Blurb
                  </label>
                  <span className="text-[10px] text-[#5B2302]/60 font-medium">
                    Autofilled when selecting a book
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={newBookForm.description}
                  onChange={(e) =>
                    setNewBookForm({
                      ...newBookForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="The book's full synopsis or blurb..."
                  className="flex min-h-[90px] w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] p-3 text-sm text-[#5B2302] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] resize-none shadow-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase text-[#5B2302]">
                  <input
                    type="checkbox"
                    checked={newBookForm.is_current}
                    onChange={(e) =>
                      setNewBookForm({
                        ...newBookForm,
                        is_current: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-[#5B2302]"
                  />
                  Set as Active Featured Book Immediately
                </label>
              </div>

              <div className="pt-3 border-t border-[#5B2302]/15 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddBookModalOpen(false)}
                  className="h-10 px-4 rounded-xl border border-[#5B2302]/30 text-xs font-bold uppercase text-[#5B2302] hover:bg-[#F6EEE9] shadow-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-xl bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] text-xs font-extrabold uppercase tracking-wider shadow-none"
                >
                  Add to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
      <ToastContainer />
    </div>
  );
}
