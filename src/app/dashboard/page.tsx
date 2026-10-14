'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/store/app-context';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { DemoPersonaBanner } from '@/components/navigation/DemoPersonaBanner';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { BookCover } from '@/components/books/BookCover';
import { EventCard } from '@/components/events/EventCard';
import { BookCard } from '@/components/books/BookCard';
import {
  Calendar,
  BookOpen,
  MessageSquare,
  MessageCircle,
  ShieldAlert,
  Sparkles,
  Users,
  Bell,
  ArrowRight,
  Eye,
  EyeOff,
  Settings,
  Shield,
  Lock,
} from 'lucide-react';

export function SpoilerCommentSnippet({
  content,
  isSpoiler,
  authorName,
  authorColor,
  timeAgo,
}: {
  content: string;
  isSpoiler: boolean;
  authorName: string;
  authorColor: string;
  timeAgo: string;
}) {
  const [revealed, setRevealed] = useState(!isSpoiler);

  return (
    <div className="p-4 rounded-2xl bg-[#FFFCF7] border border-[#5B2302]/15 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-[#5B2302]"
            style={{ backgroundColor: authorColor || '#FFA5D5' }}
          >
            {authorName[0]}
          </div>
          <span className="font-bold text-[#5B2302]">{authorName}</span>
        </div>
        <span className="text-[10px] text-[#5B2302]/60 font-body">{timeAgo}</span>
      </div>

      {isSpoiler && !revealed ? (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="w-full py-2.5 px-3 rounded-xl bg-[#FFA5D5]/20 border border-[#FFA5D5] text-center text-xs text-[#5B2302] flex items-center justify-center gap-2 hover:bg-[#FFA5D5]/30 transition-colors"
        >
          <EyeOff className="w-3.5 h-3.5 text-[#5B2302]" />
          <span className="font-bold">Contains spoiler — click to reveal</span>
        </button>
      ) : (
        <div className="relative">
          <p className="text-xs text-[#5B2302]/90 leading-relaxed font-body">
            {content}
          </p>
          {isSpoiler && (
            <span className="inline-block mt-1 text-[9px] uppercase font-bold text-[#5B2302]/70">
              (Spoiler revealed)
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default function MemberDashboardPage() {
  const router = useRouter();
  const {
    currentUser,
    currentBook,
    books,
    events,
    announcements,
    comments,
    profiles,
    switchPersona,
  } = useApp();

  // If public or suspended
  if (!currentUser || currentUser.membership_status !== 'active') {
    return (
      <div className="min-h-screen flex flex-col bg-[#F6EEE9] text-[#5B2302]">
        <DemoPersonaBanner />
        <Navbar />
        <main className="flex-1 py-20 flex items-center justify-center px-4">
          <div className="editorial-card rounded-3xl p-8 sm:p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#FFA5D5] flex items-center justify-center mx-auto text-[#5B2302] border border-[#5B2302]">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-block text-3xl uppercase leading-tight">
              Members Only
            </h1>
            <p className="text-xs sm:text-sm text-[#5B2302]/80 leading-relaxed font-body">
              This space is reserved for active Good Company members. Sign in with your magic link or apply for membership.
            </p>
            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href="/login"
                className="w-full py-3 rounded-full bg-[#5B2302] text-[#F6EEE9] text-xs font-extrabold uppercase text-center border border-[#5B2302]"
              >
                Member Sign In
              </Link>
              <button
                type="button"
                onClick={() => switchPersona('amaka')}
                className="w-full py-2.5 rounded-full bg-[#FFA5D5] border border-[#5B2302] text-xs font-bold text-[#5B2302] uppercase"
              >
                Sign In as Amaka (Member)
              </button>
            </div>
          </div>
        </main>
        <Footer />
        <ToastContainer />
      </div>
    );
  }

  // Next upcoming gathering
  const nextEvent = events.find((e) => e.status === 'published') || null;

  // Recent announcements
  const latestAnnouncement =
    announcements.find((a) => a.is_pinned) || announcements[0] || null;

  // Recent comments for current book
  const recentComments = comments
    .filter((c) => c.book_id === currentBook?.id && !c.is_hidden && !c.is_deleted)
    .slice(0, 3);

  // Other bookshelf items: Upcoming first, then past
  const upcomingBooks = books.filter((b) => b.id !== currentBook?.id && b.status === 'upcoming');
  const pastBooks = books.filter((b) => b.id !== currentBook?.id && b.status !== 'upcoming');
  const otherBooks = [...upcomingBooks, ...pastBooks];

  return (
    <div className="min-h-screen flex flex-col bg-[#F6EEE9] text-[#5B2302]">
      <DemoPersonaBanner />
      <Navbar />

      <main className="flex-1 py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Header Greeting Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#5B2302]/15">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFA5D5] text-[#5B2302] text-[10px] font-extrabold uppercase tracking-wide border border-[#5B2302]/20 font-body">
                  Active Member
                </span>
              </div>
              <h1 className="font-block text-3xl sm:text-4xl text-[#5B2302] uppercase leading-tight">
                Hello, {currentUser.first_name}. You’re in good company.
              </h1>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/directory"
                className="px-4 py-2 rounded-full bg-[#FFFCF7] border border-[#5B2302]/20 text-xs font-bold text-[#5B2302] hover:bg-white transition-colors flex items-center gap-1.5 uppercase font-body"
              >
                <Users className="w-3.5 h-3.5 text-[#5B2302]" />
                Directory
              </Link>
              <Link
                href="/settings"
                className="p-2 rounded-full bg-[#FFFCF7] border border-[#5B2302]/20 text-[#5B2302] hover:bg-white transition-colors"
                title="Account Settings"
              >
                <Settings className="w-4 h-4 text-[#5B2302]" />
              </Link>
              {currentUser.is_admin && (
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-full bg-[#5B2302] text-[#F6EEE9] text-xs font-extrabold uppercase hover:bg-[#3D1600] transition-colors flex items-center gap-1.5 border border-[#5B2302]"
                >
                  <Shield className="w-3.5 h-3.5 text-[#FFA5D5]" />
                  Admin Studio
                </Link>
              )}
            </div>
          </div>

          {/* Top Row: Current Read & Next Gathering */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* CURRENT READ CARD (7 cols) */}
            <div className="lg:col-span-7 paper-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#5B2302] font-body">
                    Current Club Read
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#FFA5D5] text-[#5B2302] border border-[#5B2302]/20 font-body">
                    In Session
                  </span>
                </div>

                {currentBook ? (
                  <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
                    <Link href={`/books/${currentBook.id}`} className="shrink-0">
                      <BookCover book={currentBook} size="md" />
                    </Link>

                    <div className="space-y-3">
                      <div>
                        <span className="text-[10px] text-[#5B2302]/70 font-bold uppercase tracking-wider font-body">
                          {currentBook.genre}
                        </span>
                        <h2 className="font-block text-2xl sm:text-3xl uppercase text-[#5B2302] leading-tight">
                          {currentBook.title}
                        </h2>
                        <p className="font-script text-2xl text-[#5B2302]">
                          by {currentBook.author}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-[#5B2302]/85 leading-relaxed font-body line-clamp-3">
                        {currentBook.description}
                      </p>

                      <div className="space-y-1.5 text-xs text-[#5B2302]/85 font-body pt-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#5B2302]" />
                          <span>
                            <strong>Reading period:</strong> {currentBook.reading_start_date} – {currentBook.reading_end_date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-[#FFA5D5]" />
                          <span>
                            <strong>Discussion:</strong>{' '}
                            {new Date(currentBook.discussion_date).toLocaleDateString('en-GB', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="italic text-sm text-[#5B2302]/60 font-body">No current book selected.</p>
                )}
              </div>

              {currentBook && (
                <div className="pt-4 border-t border-[#5B2302]/15 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/books/${currentBook.id}#reading-guide`}
                    className="clean-btn px-4 py-2 rounded-full bg-[#FFFCF7] border border-[#5B2302]/25 text-xs font-bold uppercase text-[#5B2302] hover:bg-white flex items-center gap-1.5 transition-colors font-body"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#5B2302]" /> View Reading Guide
                  </Link>

                  {currentBook.has_content_notes && (
                    <Link
                      href={`/books/${currentBook.id}#content-notes`}
                      className="clean-btn px-4 py-2 rounded-full bg-[#FFFCF7] border border-[#5B2302]/25 text-xs font-bold uppercase text-[#5B2302] hover:bg-white flex items-center gap-1.5 transition-colors font-body"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-[#5B2302]" /> Content Notes
                    </Link>
                  )}

                  <a
                    href="https://chat.whatsapp.com/readwithgoodcompany"
                    target="_blank"
                    rel="noreferrer"
                    className="clean-btn px-4 py-2 rounded-full bg-[#5B2302] text-[#F6EEE9] text-xs font-extrabold uppercase hover:bg-[#3D1600] flex items-center gap-1.5 transition-colors border border-[#5B2302] font-body"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#FFA5D5]" /> Join WhatsApp Chat &rarr;
                  </a>
                </div>
              )}
            </div>

            {/* NEXT GATHERING CARD (5 cols) */}
            <div className="lg:col-span-5 flex flex-col">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#5B2302] mb-3 font-body">
                Next Gathering
              </div>

              {nextEvent ? (
                <EventCard event={nextEvent} detailed={true} />
              ) : (
                <div className="editorial-card rounded-3xl p-8 text-center my-auto">
                  <p className="font-script text-xl text-[#5B2302]/80">
                    The calendar is behaving quietly. Check back soon.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Middle Row: Latest Announcement & From the Discussion */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LATEST ANNOUNCEMENT (6 cols) */}
            <div className="lg:col-span-6 paper-card rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#5B2302] flex items-center gap-1.5 font-body">
                  <Bell className="w-3.5 h-3.5 text-[#5B2302]" /> Latest Announcement
                </span>
                {latestAnnouncement?.is_pinned && (
                  <span className="px-2 py-0.5 rounded bg-[#FFA5D5] text-[#5B2302] text-[10px] font-extrabold uppercase border border-[#5B2302]/20">
                    Pinned
                  </span>
                )}
              </div>

              {latestAnnouncement ? (
                <div className="space-y-2">
                  <h3 className="font-block text-xl uppercase text-[#5B2302] leading-tight">
                    {latestAnnouncement.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5B2302]/85 leading-relaxed font-body">
                    {latestAnnouncement.content}
                  </p>
                  <div className="pt-2 text-[11px] text-[#5B2302]/60 font-body flex items-center gap-2">
                    <span>By {latestAnnouncement.author_name || 'Curator'}</span>
                    <span>•</span>
                    <span>
                      {new Date(latestAnnouncement.scheduled_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="font-script text-xl text-[#5B2302]/70">
                    Nothing urgent. Return to your book.
                  </p>
                </div>
              )}
            </div>

            {/* WHATSAPP READING ROOM (6 cols) */}
            <div className="lg:col-span-6 paper-card rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#5B2302] flex items-center gap-1.5 font-body">
                  <MessageCircle className="w-4 h-4 text-[#5B2302]" /> WhatsApp Reading Room
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#FFA5D5] text-[#5B2302] text-[10px] font-extrabold uppercase border border-[#5B2302]/20 font-body">
                  Active Chat
                </span>
              </div>

              <div className="space-y-3 font-body">
                <h3 className="font-block text-xl uppercase text-[#5B2302] leading-tight">
                  Where our debates happen
                </h3>
                <p className="text-xs sm:text-sm text-[#5B2302]/85 leading-relaxed">
                  No sluggish web forums. The Good Company members argue, react to plot twists, and share late-night reactions directly in our WhatsApp group.
                </p>

                {/* Current Milestone / Pacing alert */}
                <div className="p-3.5 rounded-2xl bg-[#FFFCEB] border border-[#5B2302]/20 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-[#5B2302] block uppercase text-[11px]">Current Milestone:</span>
                    <span className="text-[#5B2302]/85">Week 2 · Chapters 8–15</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#5B2302] px-2 py-1 bg-[#FFA5D5] rounded-full border border-[#5B2302]/20">
                    On Track
                  </span>
                </div>

                <div className="pt-2">
                  <a
                    href="https://chat.whatsapp.com/readwithgoodcompany"
                    target="_blank"
                    rel="noreferrer"
                    className="clean-btn w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] text-xs font-extrabold uppercase tracking-wider transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#FFA5D5]" />
                    Open WhatsApp Discussion &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Bookshelf Archive */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-[#5B2302]/15 pb-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B2302]/70 block font-body">
                  Club History & Horizon
                </span>
                <h3 className="font-block text-2xl sm:text-3xl uppercase text-[#5B2302] leading-tight">
                  Good Company Library
                </h3>
              </div>
              <Link
                href="/#shelves"
                className="text-xs font-extrabold uppercase font-body text-[#5B2302] underline underline-offset-2"
              >
                View Full Shelf &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherBooks.map((b) => (
                <BookCard key={b.id} book={b} compact={true} />
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
