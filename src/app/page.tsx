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
import { InteractiveBookshelf } from "@/components/books/InteractiveBookshelf";
import { StarFlair } from "@/components/ui/Illustrations";
import { Calendar, Book1, Clock, SecuritySafe, Star } from "iconsax-react";
import { X } from "lucide-react";

export default function HomePage() {
  const { currentBook, books } = useApp();
  const [readingGuideOpen, setReadingGuideOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F6EEE9] text-[#5B2302]">
      <Navbar />

      <main className="flex-1 space-y-28 sm:space-y-36 md:space-y-48 pb-28 lg:pb-0">
        {/* ========================================================================= */}
        {/* HERO SECTION: Clean, Editorial, Primary Brown (#5B2302) & Accent Pink (#FFA5D5) */}
        {/* ========================================================================= */}
        <section
          id="current-read"
          className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 md:pt-28 md:pb-32 border-b border-[#5B2302]/15 scroll-mt-28 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Bold Berthold Block Headline & Pitch */}
              <div className="lg:col-span-6 space-y-6">
                {/* Accent Tag */}
                <div className="inline-flex items-center gap-2">
                  <span className="px-3.5 py-1 rounded-full bg-[#FFA5D5] text-[#5B2302] text-xs font-extrabold uppercase tracking-wider font-body border border-[#5B2302]/20">
                    Good Company Book Club
                  </span>
                  <span className="font-script text-2xl text-[#5B2302]">
                    est. 2026
                  </span>
                </div>

                {/* Berthold Block Headline - Pure crisp text, zero shadows */}
                <div className="space-y-1">
                  <h1 className="font-block text-5xl sm:text-6xl lg:text-7xl text-[#5B2302] uppercase leading-[0.95] tracking-tight">
                    Good books.
                    <br />
                    Better debates.
                  </h1>
                </div>

                {/* Punchy, clear editorial subhead */}
                <p className="font-body text-base sm:text-lg text-[#5B2302]/90 max-w-xl font-medium leading-relaxed">
                  A warm community for readers who take fictional characters
                  very seriously. Come for the books, stay for the tea and
                  honest conversations.
                </p>

                {/* Primary Actions - Stacked vertically on mobile (flex-col), row on desktop */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full sm:w-auto">
                  <Link
                    href="/apply"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] text-xs font-extrabold uppercase tracking-wider border border-[#5B2302] transition-colors w-full sm:w-auto text-center shadow-none active:scale-[0.99]"
                  >
                    <StarFlair className="w-4 h-4 text-[#FFA5D5]" />
                    Apply to Join
                  </Link>

                  <Link
                    href="#shelf"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#FFFCF7] text-[#5B2302] hover:bg-white text-xs font-bold uppercase tracking-wider border border-[#5B2302]/30 transition-colors w-full sm:w-auto text-center active:scale-[0.99]"
                  >
                    Browse Shelf
                  </Link>
                </div>
              </div>

              {/* Right Column: Featured Current Read, sitting on the paper note */}
              <div className="lg:col-span-6 flex justify-center lg:justify-end pt-4 lg:pt-0">
                {currentBook && (
                  <div className="relative w-[calc(100%+2rem)] -mx-4 sm:w-full sm:mx-0 max-w-[500px] sm:max-w-[580px] lg:max-w-[600px] lg:mr-0 aspect-[1849/1932] [container-type:inline-size]">
                    {/* Paper note background art */}
                    <img
                      src="/images/paper.png"
                      alt=""
                      aria-hidden="true"
                      draggable={false}
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none"
                    />

                    {/* Content, fitted onto the blank part of the paper and scaled proportionally with the paper */}
                    <div className="absolute top-[17.5%] left-[19.5%] right-[14.5%] bottom-[19.5%] flex flex-col justify-between">
                      {/* Month label — aligned left */}
                      <div className="text-left pb-[1.2cqi] border-b border-[#5B2302]/12 shrink-0">
                        <span className="font-script text-[6.2cqi] text-[#5B2302] font-bold leading-none block">
                          {currentBook.reading_start_date
                            ? new Date(
                                currentBook.reading_start_date,
                              ).toLocaleDateString("en-US", { month: "long" }) +
                              " Selection"
                            : "Current Selection"}
                        </span>
                      </div>

                      {/* Book + Info row */}
                      <div className="flex flex-row items-center gap-[3.5cqi] flex-1 min-h-0 py-[1.5cqi]">
                        {/* Cover — tilted slightly for an organic editorial feel */}
                        <div className="shrink-0 pl-[0.5cqi]">
                          <div className="relative -rotate-3 hover:rotate-0 transition-transform duration-300">
                            <BookCover
                              book={currentBook}
                              size="md"
                              className="w-[22cqi] h-[33cqi]"
                              showBookmark={false}
                              showBadge={false}
                            />
                            <div className="apple-shelf-shadow" />
                          </div>
                        </div>

                        {/* Info */}
                        <div className="space-y-[1.2cqi] flex-1 min-w-0">
                          <span className="text-[1.9cqi] font-extrabold uppercase tracking-widest text-[#5B2302]/70 font-body block leading-tight">
                            {currentBook.genre}
                          </span>
                          <h3 className="font-block text-[4.5cqi] text-[#5B2302] uppercase leading-[1.02] tracking-tight line-clamp-3">
                            {currentBook.title}
                          </h3>
                          <p className="font-script text-[4.8cqi] text-[#5B2302] leading-tight truncate">
                            by {currentBook.author}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-[2cqi] gap-y-[0.6cqi] pt-[0.5cqi] origin-left scale-90 sm:scale-100">
                            <RatingBadge
                              rating={currentBook.rating}
                              size="sm"
                            />
                            <SpiceBadge
                              level={currentBook.spice_level}
                              size="sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Footer bar */}
                      <div className="pt-[2cqi] border-t border-[#5B2302]/15 flex flex-row items-center justify-between gap-[2cqi] shrink-0">
                        <span className="text-[2.3cqi] font-body font-bold text-[#5B2302] flex items-center gap-[1cqi] shrink-0 whitespace-nowrap">
                          <Calendar
                            color="#5B2302"
                            variant="Bold"
                            className="w-[2.6cqi] h-[2.6cqi] shrink-0"
                          />
                          Discussion:{" "}
                          {new Date(
                            currentBook.discussion_date,
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>

                        <button
                          type="button"
                          onClick={() => setReadingGuideOpen(true)}
                          className="clean-btn px-[3.2cqi] py-[1.4cqi] rounded-full bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] text-[2cqi] font-extrabold uppercase tracking-wider flex items-center justify-center gap-[1cqi] font-body cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
                        >
                          <Book1
                            color="#FFA5D5"
                            variant="Bold"
                            className="w-[2.4cqi] h-[2.4cqi] shrink-0"
                          />
                          Reading Guide
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION: OUR SHELF (Interactive Bookshelf with Spines & Pop-Out Book) */}
        {/* ========================================================================= */}
        <section
          id="shelf"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28 relative"
        >
          <div
            id="shelves"
            className="absolute -top-28 left-0 pointer-events-none"
          />
          {/* Interactive Bookshelf Component */}
          <InteractiveBookshelf books={books} currentBookId={currentBook?.id} />
        </section>

        {/* ========================================================================= */}
        {/* SECTION: 3 EDITORIAL PILLARS (Clean, Crisp, Flat Design) */}
        {/* ========================================================================= */}
        <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <span className="px-3 py-1 rounded-full bg-[#FFA5D5] text-[#5B2302] text-xs font-extrabold uppercase tracking-wider font-body border border-[#5B2302]/20 inline-block mb-3">
              The Club
            </span>
            <h2 className="font-block text-3xl sm:text-4xl text-[#5B2302] uppercase leading-none">
              What happens here
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: We Read */}
            <div className="editorial-card rounded-2xl p-6 sm:p-7 space-y-4">
              <img
                src="/images/two-books-open.png"
                alt="We read"
                className="w-14 h-14 object-contain"
              />
              <h3 className="font-block text-2xl text-[#5B2302] uppercase leading-tight">
                We read
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#5B2302]/85 leading-relaxed font-medium">
                One book a month across romance, literary fiction, essays, and
                whatever else keeps us turning pages late into the night.
              </p>
              <div className="pt-2 border-t border-[#5B2302]/15">
                <span className="font-script text-lg text-[#5B2302]">
                  Curated with care.
                </span>
              </div>
            </div>

            {/* Card 2: We Gather */}
            <div className="editorial-card rounded-2xl p-6 sm:p-7 space-y-4">
              <img
                src="/images/tea.png"
                alt="We gather"
                className="w-14 h-14 object-contain"
              />
              <h3 className="font-block text-2xl text-[#5B2302] uppercase leading-tight">
                We gather
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#5B2302]/85 leading-relaxed font-medium">
                Passionate debates, thoughtful character breakdowns, good tea,
                and zero gatekeeping. Showing up without finishing is
                forgivable.
              </p>
              <div className="pt-2 border-t border-[#5B2302]/15">
                <span className="font-script text-lg text-[#5B2302]">
                  Warm opinions welcome.
                </span>
              </div>
            </div>

            {/* Card 3: We Make a Thing of It */}
            <div className="editorial-card rounded-2xl p-6 sm:p-7 space-y-4">
              <img
                src="/images/calendar.png"
                alt="We make a thing of it"
                className="w-14 h-14 object-contain"
              />
              <h3 className="font-block text-2xl text-[#5B2302] uppercase leading-tight">
                We make a thing of it
              </h3>
              <p className="font-body text-xs sm:text-sm text-[#5B2302]/85 leading-relaxed font-medium">
                Reading guides, weekly pacing, content notes, chapter skip
                guides, and live character debates in our WhatsApp group.
              </p>
              <div className="pt-2 border-t border-[#5B2302]/15">
                <span className="font-script text-lg text-[#5B2302]">
                  Better conversations always.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION: CTA BANNER (Clean, Warm, No Box Shadow) */}
        {/* ========================================================================= */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 sm:pb-44 md:pb-56">
          <div className="bg-[#5B2302] text-[#F6EEE9] rounded-3xl p-8 sm:p-12 border-2 border-[#5B2302] text-center space-y-6">
            <span className="inline-block px-3.5 py-1 rounded-full bg-[#FFA5D5] text-[#5B2302] text-xs font-extrabold uppercase tracking-wider font-body">
              Ready to read with us?
            </span>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="font-block text-4xl sm:text-5xl text-[#F6EEE9] uppercase tracking-tight leading-tight">
                Pull up a chair.
              </h2>
              <p className="font-body text-sm sm:text-base text-[#F6EEE9]/85 font-medium leading-relaxed">
                Tell us about your reading habits, the books you would defend
                with your life, and apply for our next reading group.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/apply"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FFA5D5] text-[#5B2302] hover:bg-[#ffbfe1] font-block text-xs uppercase tracking-wider border border-[#5B2302] transition-colors"
              >
                <StarFlair className="w-4 h-4 text-[#5B2302]" />
                Apply for Membership
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* READING GUIDE MODAL: Pacing, Themes, Content & Skip Guide, WhatsApp Link */}
      {/* ========================================================================= */}
      {readingGuideOpen && currentBook && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setReadingGuideOpen(false)}
          className="fixed inset-0 z-50 bg-[#3D1600]/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-2 border-[#5B2302] relative animate-in zoom-in-95 duration-200 space-y-6 font-body"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-2">
              <div>
                <span className="px-3 py-0.5 rounded-full bg-[#FFA5D5] text-[#5B2302] text-xs font-extrabold uppercase tracking-wide border border-[#5B2302]/20 inline-block mb-1">
                  Curator’s Reading Guide
                </span>
                <h3 className="font-block text-2xl sm:text-3xl uppercase text-[#5B2302] leading-tight">
                  {currentBook.title}
                </h3>
                <p className="font-script text-2xl text-[#5B2302]">
                  by {currentBook.author}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setReadingGuideOpen(false)}
                className="p-1.5 rounded-full border border-[#5B2302]/30 text-[#5B2302] hover:bg-[#5B2302] hover:text-[#F6EEE9] transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" strokeWidth={2.2} />
              </button>
            </div>

            {/* 0. COMPLETE SYNOPSIS / ABOUT THE BOOK */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#F6EEE9]/80 space-y-2.5 border border-[#5B2302]/15">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#5B2302]">
                <Book1 size={16} color="#5B2302" variant="Bold" />
                About The Book
              </div>
              <p className="text-xs sm:text-sm text-[#5B2302]/90 leading-relaxed font-body">
                {currentBook.description}
              </p>
            </div>

            {/* CURATOR'S NOTE */}
            {currentBook.curator_note && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFCEB] border border-[#5B2302]/15 space-y-1.5 font-body">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B2302] block">
                  Curator’s Editorial Take
                </span>
                <p className="text-sm sm:text-base text-[#5B2302] leading-relaxed font-normal">
                  {currentBook.curator_note}
                </p>
              </div>
            )}

            {/* 1. WEEKLY PACING GUIDE */}
            {currentBook.reading_guide && (
              <div className="p-5 rounded-2xl bg-[#F6EEE9]/70 space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#5B2302]">
                  <Clock size={16} color="#5B2302" variant="Bold" />
                  Weekly Pacing Guide
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {currentBook.reading_guide
                    .split("\n")
                    .filter(Boolean)
                    .map((line, idx) => {
                      const colonIdx = line.indexOf(":");
                      const hasPrefix = colonIdx > -1 && colonIdx < 20;
                      const title = hasPrefix
                        ? line.substring(0, colonIdx)
                        : `Week ${idx + 1}`;
                      const content = hasPrefix
                        ? line.substring(colonIdx + 1).trim()
                        : line;
                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl bg-[#FFFDF9] border border-[#5B2302]/10"
                        >
                          <span className="font-bold text-xs uppercase text-[#5B2302] block mb-0.5">
                            {title}
                          </span>
                          <p className="text-xs text-[#5B2302]/85 leading-relaxed">
                            {content}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* 2. THEMES & CONTENT NOTES */}
            {currentBook.has_content_notes && (
              <div className="p-5 rounded-2xl bg-[#F6EEE9]/70 space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#5B2302]">
                  <SecuritySafe size={16} color="#5B2302" variant="Bold" />
                  Themes & Content Notes
                </div>
                <p className="text-xs sm:text-sm text-[#5B2302]/85 leading-relaxed">
                  {currentBook.content_notes}
                </p>
              </div>
            )}

            {/* 3. SCENE-SKIP GUIDE */}
            {currentBook.has_scene_skip && (
              <div className="p-5 rounded-2xl bg-[#F6EEE9]/70 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#5B2302]">
                  <Star size={16} color="#FFA5D5" variant="Bold" />
                  Scene-Skip Guide
                </div>
                <p className="text-xs sm:text-sm font-semibold text-[#5B2302] bg-[#FFFCEB] border border-[#5B2302]/15 rounded-xl px-3.5 py-2.5 leading-relaxed">
                  Club Note: We genuinely recommend skipping explicit or spicy
                  scenes when reading—you won’t miss any of the plot, character
                  arcs, or our discussion.
                </p>
                <p className="text-xs sm:text-sm text-[#5B2302]/85 leading-relaxed">
                  {currentBook.scene_skip_guide}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
      <ToastContainer />
    </div>
  );
}
