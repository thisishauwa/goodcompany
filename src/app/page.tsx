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
import { ReadingGuideCard } from "@/components/books/ReadingGuideCard";
import { StarFlair } from "@/components/ui/Illustrations";
import { Calendar, Book1 } from "iconsax-react";

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
          className="relative pt-8 pb-12 sm:pt-16 sm:pb-20 md:pt-20 md:pb-24 lg:pt-8 lg:pb-16 border-b border-[#5B2302]/15 scroll-mt-28 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Left Column: Bold Berthold Block Headline & Pitch */}
              <div className="lg:col-span-6 space-y-3.5 sm:space-y-6">
                {/* Berthold Block Headline - Pure crisp text, zero shadows */}
                <div className="space-y-1">
                  <h1 className="font-block text-[clamp(2.4rem,9.8vw,3.5rem)] sm:text-6xl lg:text-7xl text-[#5B2302] uppercase leading-[0.95] tracking-tight">
                    <span className="whitespace-nowrap">Good books.</span>
                    <br />
                    <span className="whitespace-nowrap">Better debates.</span>
                  </h1>
                </div>

                {/* Punchy, clear editorial subhead */}
                <p className="font-body text-base sm:text-lg text-[#5B2302]/90 max-w-xl font-medium leading-relaxed">
                  A warm community for readers who take fictional characters
                  very seriously. Come for the books, stay for the tea and
                  honest conversations.
                </p>

                {/* Primary Actions - Stacked vertically on mobile (flex-col), row on desktop */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3.5 sm:pt-2 w-full sm:w-auto">
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
              <div className="lg:col-span-6 flex justify-center lg:justify-end pt-2 sm:pt-4 lg:pt-0">
                {currentBook && (
                  <div className="relative w-[calc(100%+2rem)] -mx-4 sm:w-full sm:mx-0 max-w-125 sm:max-w-145 lg:max-w-150 lg:mr-0 aspect-1849/1932 @container">
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
                          <p className="font-script text-[4.8cqi] text-[#5B2302] leading-normal py-[0.3cqi] pl-[0.6cqi] -ml-[0.6cqi] whitespace-nowrap overflow-visible">
                            by {currentBook.author}
                          </p>
                          <div className="flex items-center gap-1.5 sm:gap-[1.5cqi] pt-[0.4cqi] whitespace-nowrap overflow-hidden">
                            <RatingBadge
                              rating={currentBook.rating}
                              size="md"
                              className="text-xs sm:text-sm lg:text-[2.6cqi] gap-1 shrink-0 font-bold"
                            />
                            <span
                              className="text-[#5B2302]/40 text-xs sm:text-sm lg:text-[2.4cqi] select-none shrink-0"
                              aria-hidden="true"
                            >
                              &bull;
                            </span>
                            <SpiceBadge
                              level={currentBook.spice_level}
                              size="md"
                              className="text-xs sm:text-sm lg:text-[2.6cqi] gap-1 shrink-0 font-bold"
                              labelClassName="hidden sm:inline"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Footer bar */}
                      <div className="pt-[2cqi] border-t border-[#5B2302]/15 flex flex-row items-center justify-between gap-2 sm:gap-[2cqi] shrink-0">
                        <span className="text-[clamp(11px,2.3cqi,13px)] font-body font-bold text-[#5B2302] flex items-center gap-1 sm:gap-[1cqi] shrink-0 whitespace-nowrap">
                          <Calendar
                            color="#5B2302"
                            variant="Bold"
                            className="w-3.5 h-3.5 sm:w-[2.6cqi] sm:h-[2.6cqi] shrink-0"
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
                          className="clean-btn px-2.5 py-1.5 sm:px-[3.2cqi] sm:py-[1.4cqi] rounded-full bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] text-[clamp(11px,2cqi,12px)] font-extrabold uppercase tracking-wider flex items-center justify-center gap-1 sm:gap-[1cqi] font-body cursor-pointer active:scale-95 shrink-0 whitespace-nowrap"
                        >
                          <Book1
                            color="#FFA5D5"
                            variant="Bold"
                            className="w-3.5 h-3.5 sm:w-[2.4cqi] sm:h-[2.4cqi] shrink-0"
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
            <div className="flex items-center gap-2.5 mb-3">
              <span className="px-3.5 py-1 rounded-full bg-[#FFA5D5] text-[#5B2302] text-xs sm:text-sm font-extrabold uppercase tracking-wider font-body border border-[#5B2302]/20 inline-block">
                The Club
              </span>
              <span className="font-script text-2xl sm:text-3xl text-[#5B2302]/70">
                est. 2026
              </span>
            </div>
            <h2 className="font-block text-3xl sm:text-4xl md:text-5xl text-[#5B2302] uppercase leading-none">
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
              <h3 className="font-block text-2xl sm:text-3xl text-[#5B2302] uppercase leading-tight">
                We read
              </h3>
              <p className="font-body text-base text-[#5B2302]/90 leading-relaxed font-medium">
                One book a month across romance, literary fiction, essays, and
                whatever else keeps us turning pages late into the night.
              </p>
              <div className="pt-2 border-t border-[#5B2302]/15">
                <span className="font-script text-xl sm:text-2xl text-[#5B2302]">
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
              <h3 className="font-block text-2xl sm:text-3xl text-[#5B2302] uppercase leading-tight">
                We gather
              </h3>
              <p className="font-body text-base text-[#5B2302]/90 leading-relaxed font-medium">
                Passionate debates, thoughtful character breakdowns, good tea,
                and zero gatekeeping. Showing up without finishing is
                forgivable.
              </p>
              <div className="pt-2 border-t border-[#5B2302]/15">
                <span className="font-script text-xl sm:text-2xl text-[#5B2302]">
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
              <h3 className="font-block text-2xl sm:text-3xl text-[#5B2302] uppercase leading-tight">
                We make a thing of it
              </h3>
              <p className="font-body text-base text-[#5B2302]/90 leading-relaxed font-medium">
                Reading guides, weekly pacing, content notes, chapter skip
                guides, and live character debates in our WhatsApp group.
              </p>
              <div className="pt-2 border-t border-[#5B2302]/15">
                <span className="font-script text-xl sm:text-2xl text-[#5B2302]">
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
      {/* READING GUIDE MODAL: Unified Reusable Component */}
      {/* ========================================================================= */}
      {readingGuideOpen && currentBook && (
        <ReadingGuideCard
          book={currentBook}
          variant="modal"
          onClose={() => setReadingGuideOpen(false)}
        />
      )}

      <Footer />
      <ToastContainer />
    </div>
  );
}
