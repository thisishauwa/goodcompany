"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Book } from "@/types";
import { BookCover } from "./BookCover";
import { RatingBadge, SpiceBadge } from "./BookBadges";
import { ArrowLeft2, ArrowRight2, Calendar, Book1 } from "iconsax-react";
import { X } from "lucide-react";

interface InteractiveBookshelfProps {
  books: Book[];
  currentBookId?: string;
}

export function InteractiveBookshelf({
  books,
  currentBookId,
}: InteractiveBookshelfProps) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Arrange books: CURRENT READ -> UPCOMING READS -> PAST READS
  const currentReads = books.filter(
    (b) =>
      b.id === currentBookId ||
      b.is_current ||
      b.status === "currently_reading",
  );
  const nonCurrent = books.filter(
    (b) => !currentReads.some((c) => c.id === b.id),
  );
  const upcomingReads = nonCurrent.filter((b) => b.status === "upcoming");
  const pastReads = nonCurrent.filter(
    (b) =>
      b.status === "completed" ||
      b.status === "archived" ||
      b.status !== "upcoming",
  );
  const shelfBooks = [...currentReads, ...upcomingReads, ...pastReads];

  // Find index of selected book for next/prev modal navigation
  const currentIndex = selectedBook
    ? shelfBooks.findIndex((b) => b.id === selectedBook.id)
    : -1;

  const handlePrevModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setSelectedBook(shelfBooks[currentIndex - 1]);
    } else {
      setSelectedBook(shelfBooks[shelfBooks.length - 1]);
    }
  };

  const handleNextModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < shelfBooks.length - 1) {
      setSelectedBook(shelfBooks[currentIndex + 1]);
    } else {
      setSelectedBook(shelfBooks[0]);
    }
  };

  // Carousel scrolling controls - smoothly scrolling by view
  const scrollLeft = () => {
    if (carouselRef.current) {
      const step = carouselRef.current.clientWidth * 0.75;
      carouselRef.current.scrollBy({ left: -step, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      const step = carouselRef.current.clientWidth * 0.75;
      carouselRef.current.scrollBy({ left: step, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* SHELF HEADER WITH TITLE AND ARROWS ON THE SAME LINE */}
      {/* ========================================================================= */}
      <div className="flex items-end justify-between mb-2">
        <div>
          <span className="px-3 py-1 rounded-full bg-[#FFA5D5] text-[#5B2302] text-xs font-extrabold uppercase tracking-wider font-body border border-[#5B2302]/20 inline-block mb-3">
            The Library
          </span>
          <h2 className="font-block text-4xl sm:text-5xl text-[#5B2302] uppercase leading-none">
            Our Shelf
          </h2>
        </div>

        {/* Carousel Prev / Next Arrow Buttons using Iconsax */}
        <div className="flex items-center gap-2.5 shrink-0 pb-1">
          <button
            type="button"
            onClick={scrollLeft}
            className="w-11 h-11 rounded-full border border-[#5B2302] bg-[#FFFCF7] text-[#5B2302] hover:bg-[#5B2302] hover:text-[#F6EEE9] transition-all flex items-center justify-center active:scale-95 cursor-pointer shadow-sm"
            aria-label="Previous books"
          >
            <ArrowLeft2 size={18} color="currentColor" />
          </button>
          <button
            type="button"
            onClick={scrollRight}
            className="w-11 h-11 rounded-full border border-[#5B2302] bg-[#FFFCF7] text-[#5B2302] hover:bg-[#5B2302] hover:text-[#F6EEE9] transition-all flex items-center justify-center active:scale-95 cursor-pointer shadow-sm"
            aria-label="Next books"
          >
            <ArrowRight2 size={18} color="currentColor" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3D BOOK CAROUSEL TRACK (Roomy spacing on mobile, no jump-packing) */}
      {/* ========================================================================= */}
      <div
        ref={carouselRef}
        className="flex items-end overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar select-none pt-8 pb-10 px-4 sm:px-1 gap-4 sm:gap-0"
      >
        {shelfBooks.map((book) => {
          const isCurrent =
            book.id === currentBookId ||
            book.is_current ||
            book.status === "currently_reading";
          const isSelected = selectedBook?.id === book.id;

          return (
            <div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              className={`group flex flex-col items-center cursor-pointer shrink-0 w-[68vw] max-w-[240px] sm:w-1/3 md:w-1/4 lg:w-1/5 snap-center sm:snap-start px-2 sm:px-3 transition-transform duration-300 ${
                isSelected ? "-translate-y-4" : "hover:-translate-y-3"
              }`}
              title={`"${book.title}" by ${book.author}`}
            >
              {/* Standing 3D Book Display with Apple Books Spine Design */}
              <div className="relative">
                <BookCover
                  book={book}
                  size="md"
                  showBookmark={isCurrent}
                  showBadge={false}
                />
                {/* Soft Ambient Contact Shadow Underneath */}
                <div className="apple-shelf-shadow" />
              </div>

              {/* Title & Author Info Card - Single line with ellipses */}
              <div className="text-center mt-4 w-full px-1 space-y-1">
                <p
                  className="font-block text-xs sm:text-sm uppercase text-[#5B2302] leading-tight truncate whitespace-nowrap block w-full"
                  title={book.title}
                >
                  {book.title}
                </p>
                <p
                  className="font-script text-base sm:text-lg text-[#5B2302]/85 truncate whitespace-nowrap block w-full"
                  title={book.author}
                >
                  by {book.author}
                </p>
                <div className="flex flex-col items-center gap-1">
                  <div>
                    {isCurrent ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFA5D5] text-[#5B2302] text-[9px] font-extrabold uppercase tracking-wide border border-[#5B2302]/20 font-body whitespace-nowrap">
                        {book.reading_start_date
                          ? new Date(
                              book.reading_start_date,
                            ).toLocaleDateString("en-US", { month: "long" }) +
                            " Selection"
                          : "Current Selection"}
                      </span>
                    ) : book.status === "upcoming" ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F5D978] text-[#5B2302] text-[9px] font-extrabold uppercase tracking-wide border border-[#5B2302]/20 font-body whitespace-nowrap">
                        Upcoming Read
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F6EEE9] text-[#5B2302]/70 text-[9px] font-bold uppercase tracking-wide border border-[#5B2302]/20 font-body whitespace-nowrap">
                        Past Read
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* POP-OUT 3D BOOK DETAILS MODAL (FOLIO SPREAD) */}
      {/* ========================================================================= */}
      {selectedBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedBook(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#FFFCF7] rounded-3xl p-4 sm:p-9 shadow-2xl border-2 border-[#5B2302] max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#5B2302]/15">
              <span className="font-block text-xs uppercase tracking-widest text-[#5B2302]/70">
                Book Archive &bull; {currentIndex + 1} of {shelfBooks.length}
              </span>

              {/* Prev / Next Modal Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrevModal}
                  className="p-1.5 rounded-full border border-[#5B2302]/30 text-[#5B2302] hover:bg-[#F6EEE9] transition-colors"
                  title="Previous book"
                >
                  <ArrowLeft2 size={16} color="currentColor" />
                </button>
                <button
                  type="button"
                  onClick={handleNextModal}
                  className="p-1.5 rounded-full border border-[#5B2302]/30 text-[#5B2302] hover:bg-[#F6EEE9] transition-colors"
                  title="Next book"
                >
                  <ArrowRight2 size={16} color="currentColor" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBook(null)}
                  className="p-1.5 rounded-full border border-[#5B2302]/30 text-[#5B2302] hover:bg-[#5B2302] hover:text-[#F6EEE9] transition-colors ml-2"
                  title="Close"
                >
                  <X className="w-4 h-4" strokeWidth={2.2} />
                </button>
              </div>
            </div>

            {/* Two-Column Open Book Spread */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
              {/* Left Column: 3D Real Book Artwork with Apple Books Spine */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative">
                  <BookCover
                    book={selectedBook}
                    className="w-[140px] h-[204px] sm:w-[180px] sm:h-[260px] md:w-[220px] md:h-[320px] shadow-lg"
                    showBookmark={selectedBook.is_current}
                    showBadge={false}
                  />
                  <div className="apple-shelf-shadow" />
                </div>
              </div>

              {/* Right Column: Editorial Folio Details */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1.5 whitespace-nowrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5B2302]/70">
                      {selectedBook.genre}
                    </span>
                    <span className="text-[#5B2302]/30 select-none text-xs" aria-hidden="true">
                      &bull;
                    </span>
                    <RatingBadge
                      rating={selectedBook.rating}
                      size="md"
                      showMax={false}
                      className="font-bold gap-1"
                    />
                    <span className="text-[#5B2302]/30 select-none text-xs" aria-hidden="true">
                      &bull;
                    </span>
                    <SpiceBadge
                      level={selectedBook.spice_level}
                      size="md"
                      className="font-bold gap-1"
                      labelClassName="hidden sm:inline"
                    />
                  </div>
                  <h3 className="font-block text-2xl sm:text-3xl md:text-4xl text-[#5B2302] uppercase leading-[1.05]">
                    {selectedBook.title}
                  </h3>
                  <p className="font-script text-xl sm:text-2xl text-[#5B2302] mt-1">
                    by {selectedBook.author}
                  </p>
                </div>

                <p className="text-sm sm:text-base text-[#5B2302]/85 leading-relaxed font-normal">
                  {selectedBook.description}
                </p>

                {/* CURATOR'S EDITORIAL TAKE */}
                {selectedBook.curator_note && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFCEB] border border-[#5B2302]/15 space-y-1.5 font-body">
                    <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#5B2302] block">
                      Curator’s Editorial Take
                    </span>
                    <p className="text-sm sm:text-base text-[#5B2302] leading-relaxed font-normal">
                      {selectedBook.curator_note}
                    </p>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap gap-4 text-xs sm:text-sm text-[#5B2302]/85">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={16} color="#5B2302" variant="Bold" />
                    <span>
                      <strong>Period:</strong> {selectedBook.reading_start_date}{" "}
                      – {selectedBook.reading_end_date}
                    </span>
                  </div>
                  {selectedBook.discussion_date && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#5B2302]">
                        Discussion:{" "}
                        {new Date(
                          selectedBook.discussion_date,
                        ).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* CTAs */}
                <div className="pt-4 border-t border-[#5B2302]/15 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/books/${selectedBook.id}`}
                    className="clean-btn w-full sm:w-auto px-6 py-3.5 sm:py-3 rounded-full bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] text-xs sm:text-sm font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Book1 size={18} color="#FFA5D5" variant="Bold" />
                    Weekly Pacing Guide &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
