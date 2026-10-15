"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/app-context";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { DemoPersonaBanner } from "@/components/navigation/DemoPersonaBanner";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { BookCover } from "@/components/books/BookCover";
import { RatingBadge, SpiceBadge } from "@/components/books/BookBadges";
import { LittleTeacup, BookmarkFlair } from "@/components/ui/Illustrations";
import {
  Calendar,
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  HelpCircle,
  Lock,
} from "lucide-react";

export function BookDetailClient({ bookId }: { bookId: string }) {
  const { books, currentBook, prompts, currentUser } = useApp();

  const book = books.find((b) => b.id === bookId) || currentBook;

  // Discussion prompts for this book
  const bookPrompts = prompts.filter((p) => p.book_id === book?.id);

  // Accordions for Reading Guide / Content Notes / Scene Skip
  const [pacingExpanded, setPacingExpanded] = useState(true);
  const [contentNotesExpanded, setContentNotesExpanded] = useState(true);
  const [skipGuideExpanded, setSkipGuideExpanded] = useState(true);

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F6EEE9] text-[#5B2302]">
        <DemoPersonaBanner />
        <Navbar />
        <main className="flex-1 py-20 text-center font-body">
          <p className="font-block text-xl uppercase">
            Book not found in Good Company catalog.
          </p>
          <Link
            href="/#shelves"
            className="text-xs text-[#5B2302] font-bold underline mt-4 inline-block uppercase"
          >
            Back to shelves
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6EEE9] text-[#5B2302]">
      <DemoPersonaBanner />
      <Navbar />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10">
          {/* Back link */}
          <Link
            href="/#shelves"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B2302]/70 hover:text-[#5B2302] transition-colors font-body"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Shelves
          </Link>

          {/* Book Header Card - Paper card with no shadows */}
          <div className="paper-card rounded-3xl p-6 sm:p-10 border-2 border-[#5B2302]">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-4 flex justify-center">
                <BookCover book={book} size="lg" />
              </div>

              <div className="md:col-span-8 space-y-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FFA5D5] text-[#5B2302] text-[10px] font-extrabold uppercase tracking-wide border border-[#5B2302]/20 font-body">
                      {book.genre}
                    </span>
                    {book.id === currentBook?.id && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#5B2302] text-[#F6EEE9] text-[10px] font-extrabold uppercase tracking-wide font-body">
                        Current Read
                      </span>
                    )}
                    <RatingBadge rating={book.rating} showMax />
                    <SpiceBadge level={book.spice_level} />
                  </div>
                  <h1 className="font-block text-3xl sm:text-4xl uppercase text-[#5B2302] leading-tight">
                    {book.title}
                  </h1>
                  <p className="font-script text-2xl sm:text-3xl text-[#5B2302] mt-1">
                    by {book.author}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#5B2302]/85 leading-relaxed font-body">
                  {book.description}
                </p>

                {/* Curator's Take */}
                {book.curator_note && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFCEB] border border-[#5B2302]/15 font-body space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B2302] block">
                      Curator’s Editorial Take
                    </span>
                    <p className="text-xs sm:text-sm text-[#5B2302] leading-relaxed font-normal">
                      {book.curator_note}
                    </p>
                  </div>
                )}

                {/* Dates & Discussion schedule */}
                <div className="pt-3 border-t border-[#5B2302]/15 flex flex-wrap gap-4 text-xs font-body">
                  <div className="flex items-center gap-2 text-[#5B2302]/85">
                    <Calendar className="w-4 h-4 text-[#5B2302] shrink-0" />
                    <span>
                      <strong>Reading Period:</strong> {book.reading_start_date}{" "}
                      – {book.reading_end_date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[#5B2302]/85">
                    <Clock className="w-4 h-4 text-[#5B2302] shrink-0" />
                    <span>
                      <strong>Discussion Date:</strong>{" "}
                      {book.discussion_date
                        ? new Date(book.discussion_date).toLocaleDateString(
                            "en-GB",
                            {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            },
                          )
                        : "TBD"}
                    </span>
                  </div>
                </div>

                {/* Direct CTA to WhatsApp Discussion */}
                <div className="pt-2">
                  <a
                    href="https://chat.whatsapp.com/readwithgoodcompany"
                    target="_blank"
                    rel="noreferrer"
                    className="clean-btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] text-xs font-extrabold uppercase tracking-wider font-body"
                  >
                    <MessageCircle className="w-4 h-4 text-[#FFA5D5]" />
                    Join Book Chat on WhatsApp &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CURATOR'S READING GUIDE: Pacing, Themes & Content, Scene-Skip */}
          {/* ========================================================================= */}
          <div className="space-y-6">
            <div className="border-b border-[#5B2302]/15 pb-3">
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#5B2302] block font-body">
                Curator Dossier
              </span>
              <h2 className="font-block text-2xl sm:text-3xl uppercase text-[#5B2302]">
                Reading Guide & Pacing
              </h2>
            </div>

            {/* 1. WEEKLY PACING GUIDE */}
            <div className="paper-card rounded-2xl p-4 sm:p-8 border-2 border-[#5B2302] space-y-4">
              <div
                onClick={() => setPacingExpanded(!pacingExpanded)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-[#5B2302]" />
                  <h3 className="font-block text-xl uppercase text-[#5B2302]">
                    Weekly Pacing Guide
                  </h3>
                </div>
                {pacingExpanded ? (
                  <ChevronUp className="w-4 h-4 text-[#5B2302]" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#5B2302]" />
                )}
              </div>

              {pacingExpanded && (
                <div className="pt-3 border-t border-[#5B2302]/10 font-body space-y-4">
                  <p className="text-sm sm:text-base text-[#5B2302]/90 leading-relaxed">
                    Follow along at our suggested cadence to stay in sync with
                    the WhatsApp group discussions without risking spoilers.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#FFFCEB] border border-[#5B2302]/20 space-y-1">
                      <span className="font-extrabold text-xs sm:text-sm uppercase text-[#5B2302] block">
                        Week 1 · Chapters 1–7
                      </span>
                      <p className="text-sm text-[#5B2302]/90 leading-relaxed font-body">
                        Setting the premise, establishing central relationships,
                        and introducing the core conflict.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FFFCEB] border border-[#5B2302]/20 space-y-1">
                      <span className="font-extrabold text-xs sm:text-sm uppercase text-[#5B2302] block">
                        Week 2 · Chapters 8–15
                      </span>
                      <p className="text-sm text-[#5B2302]/90 leading-relaxed font-body">
                        The turning point: shifting alliances, rising tensions,
                        and unsaid confessions.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FFFCEB] border border-[#5B2302]/20 space-y-1">
                      <span className="font-extrabold text-xs sm:text-sm uppercase text-[#5B2302] block">
                        Week 3 · Chapters 16–22
                      </span>
                      <p className="text-sm text-[#5B2302]/90 leading-relaxed font-body">
                        The climax builds: moral questions come to a head and
                        secrets are laid bare.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FFFCEB] border border-[#5B2302]/20 space-y-1">
                      <span className="font-extrabold text-xs sm:text-sm uppercase text-[#5B2302] block">
                        Week 4 · Chapters 23–Finale
                      </span>
                      <p className="text-sm text-[#5B2302]/90 leading-relaxed font-body">
                        Resolution, final revelations, and getting ready for the
                        final salon discussion.
                      </p>
                    </div>
                  </div>

                  {book.reading_guide && (
                    <div className="p-4 rounded-xl bg-[#F6EEE9] border border-[#5B2302]/15 mt-3 text-sm sm:text-base text-[#5B2302]/90 leading-relaxed whitespace-pre-line font-body">
                      {book.reading_guide}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. THEMES & CONTENT NOTES */}
            {book.has_content_notes && (
              <div className="paper-card rounded-2xl p-4 sm:p-8 border-2 border-[#5B2302] space-y-4">
                <div
                  onClick={() => setContentNotesExpanded(!contentNotesExpanded)}
                  className="flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-5 h-5 text-[#5B2302]" />
                    <h3 className="font-block text-xl uppercase text-[#5B2302]">
                      Themes & Content Notes
                    </h3>
                  </div>
                  {contentNotesExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#5B2302]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#5B2302]" />
                  )}
                </div>

                {contentNotesExpanded && (
                  <div className="pt-3 border-t border-[#5B2302]/10 font-body space-y-2">
                    <p className="text-sm sm:text-base text-[#5B2302]/90 leading-relaxed">
                      {book.content_notes}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. SCENE-SKIP GUIDE */}
            {book.has_scene_skip && (
              <div className="paper-card rounded-2xl p-4 sm:p-8 border-2 border-[#5B2302] space-y-4">
                <div
                  onClick={() => setSkipGuideExpanded(!skipGuideExpanded)}
                  className="flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-[#FFA5D5]" />
                    <h3 className="font-block text-xl uppercase text-[#5B2302]">
                      Spicy Scenes Guide
                    </h3>
                  </div>
                  {skipGuideExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#5B2302]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#5B2302]" />
                  )}
                </div>

                {skipGuideExpanded && (
                  <div className="pt-3 border-t border-[#5B2302]/10 font-body space-y-2">
                    <p className="text-xs sm:text-sm font-semibold text-[#5B2302]/80">
                      * We genuinely recommend skipping.
                    </p>
                    <p className="text-sm sm:text-base text-[#5B2302]/90 leading-relaxed">
                      {book.scene_skip_guide}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* SECTION: WHATSAPP BOOK DISCUSSION (Replaces on-site message boards) */}
          {/* ========================================================================= */}
          <div className="paper-card rounded-3xl p-6 sm:p-10 border-2 border-[#5B2302] space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#5B2302]/15">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#5B2302] block font-body">
                  The Conversation
                </span>
                <h2 className="font-block text-2xl sm:text-3xl uppercase text-[#5B2302]">
                  Book Discussion on WhatsApp
                </h2>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFCEB] border border-[#5B2302]/20 text-xs text-[#5B2302]">
                <LittleTeacup className="w-3.5 h-3.5 text-[#5B2302]" />
                <span className="font-script text-base text-[#5B2302]">
                  “Be passionate about the book. Be kind to the reader.”
                </span>
              </div>
            </div>

            {/* Banner card pointing to WhatsApp */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#5B2302] text-[#F6EEE9] text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFA5D5] flex items-center justify-center mx-auto text-[#5B2302]">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 max-w-lg mx-auto">
                <h3 className="font-block text-2xl uppercase text-[#F6EEE9]">
                  Discussions Happen on WhatsApp
                </h3>
                <p className="text-xs sm:text-sm text-[#F6EEE9]/85 font-body leading-relaxed">
                  We don’t do slow, lonely forum threads. All active
                  discussions, passionate character debriefs, and real-time
                  reactions take place in our member WhatsApp group.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href="https://chat.whatsapp.com/readwithgoodcompany"
                  target="_blank"
                  rel="noreferrer"
                  className="clean-btn inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFA5D5] text-[#5B2302] hover:bg-[#ffbfe1] font-block text-xs uppercase tracking-wider"
                >
                  <MessageCircle className="w-4 h-4 text-[#5B2302]" />
                  Open WhatsApp Group Chat &rarr;
                </a>
              </div>
            </div>

            {/* Curator Thought-Starter Prompts to ponder before WhatsApp */}
            {bookPrompts.length > 0 && (
              <div className="space-y-4 font-body">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#5B2302]">
                  <HelpCircle className="w-4 h-4 text-[#5B2302]" />
                  Curator Thought-Starters for the Chat:
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bookPrompts.map((p) => (
                    <div
                      key={p.id}
                      className="p-5 rounded-2xl bg-[#FFFCEB] border-2 border-[#5B2302]/20 space-y-2"
                    >
                      <span className="font-bold text-xs uppercase text-[#5B2302] block">
                        {p.title}
                      </span>
                      <p className="text-xs text-[#5B2302]/85 leading-relaxed">
                        {p.prompt_text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ground Rules Footer */}
            <div className="p-4 rounded-xl bg-[#F6EEE9] border border-[#5B2302]/15 text-center font-body">
              <p className="text-xs text-[#5B2302]/80 font-medium">
                Tip: When discussing chapters ahead of the current pacing guide,
                please use WhatsApp spoiler formatting (`|| spoiler text ||`) so
                every reader can enjoy the journey!
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
