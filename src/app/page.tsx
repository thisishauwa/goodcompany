"use client";

import React, { useState, useRef, useEffect } from "react";
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
import {
  Calendar,
  Book1,
  Clock,
  SecuritySafe,
  Star,
  DocumentDownload,
} from "iconsax-react";
import { X } from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { getFontEmbedCSS } from "@/lib/utils/font-embed";

export default function HomePage() {
  const { currentBook, books, addToast } = useApp();
  const [readingGuideOpen, setReadingGuideOpen] = useState(false);
  const [isDownloadingGuide, setIsDownloadingGuide] = useState(false);
  const guidePdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getFontEmbedCSS();
  }, []);

  const handleDownloadGuidePdf = async () => {
    if (!currentBook || !guidePdfRef.current || isDownloadingGuide) return;
    setIsDownloadingGuide(true);

    try {
      const fontEmbedCSS = await getFontEmbedCSS();
      await new Promise((r) => setTimeout(r, 150));

      const el = guidePdfRef.current;
      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        cacheBust: true,
        fontEmbedCSS: fontEmbedCSS || undefined,
      });

      const widthPx = el.offsetWidth || 794;
      const heightPx = el.offsetHeight || 1123;
      const pdfWidthMm = 210;
      const pdfHeightMm = Math.max(
        297,
        Math.round((heightPx * pdfWidthMm) / widthPx),
      );

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [pdfWidthMm, pdfHeightMm],
        compress: true,
      });

      doc.addImage(
        dataUrl,
        "PNG",
        0,
        0,
        pdfWidthMm,
        pdfHeightMm,
        undefined,
        "FAST",
      );

      const safeTitle = currentBook.title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
      const filename = `good-company-reading-guide-${safeTitle}.pdf`;
      const pdfDataUri = doc.output("datauristring");

      let downloadedViaApi = false;
      try {
        const res = await fetch("/api/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dataUrl: pdfDataUri,
            filename,
            contentType: "application/pdf",
          }),
        });

        if (res.ok) {
          const blob = await res.blob();
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          }, 1000);
          downloadedViaApi = true;
        }
      } catch {}

      if (!downloadedViaApi) {
        const pdfArrayBuffer = doc.output("arraybuffer");
        const pdfBlob = new Blob([pdfArrayBuffer], { type: "application/pdf" });
        const blobUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        }, 1000);
      }

      addToast("Reading Guide PDF downloaded!", "success");
    } catch (err) {
      console.error("Failed to download Reading Guide PDF:", err);
      addToast(
        "Could not generate Reading Guide PDF. Please try again.",
        "error",
      );
    } finally {
      setIsDownloadingGuide(false);
    }
  };

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
                          <div className="flex flex-wrap items-center gap-x-[2.4cqi] gap-y-[0.8cqi] pt-[0.6cqi]">
                            <RatingBadge
                              rating={currentBook.rating}
                              size="md"
                              className="text-xs sm:text-sm lg:text-[2.8cqi] gap-1 sm:gap-1.5 font-bold"
                            />
                            <SpiceBadge
                              level={currentBook.spice_level}
                              size="md"
                              className="text-xs sm:text-sm lg:text-[2.8cqi] gap-1 sm:gap-1.5 font-bold"
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
              <span className="px-3 py-1 rounded-full bg-[#FFA5D5] text-[#5B2302] text-xs font-extrabold uppercase tracking-wider font-body border border-[#5B2302]/20 inline-block">
                The Club
              </span>
              <span className="font-script text-xl sm:text-2xl text-[#5B2302]/70">
                est. 2026
              </span>
            </div>
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
          className="fixed inset-0 z-50 bg-[#3D1600]/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFFDF9] rounded-3xl p-4 sm:p-8 max-w-3xl w-full max-h-[92vh] overflow-y-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border-2 border-[#5B2302] relative animate-in zoom-in-95 duration-200 space-y-5 font-body"
          >
            {/* Modal Header: Book Cover on Left, Editorial Details on Right, Close Button at Top-Right */}
            <div className="relative flex items-start gap-3.5 sm:gap-5 pb-4 border-b border-[#5B2302]/15 pr-10 sm:pr-12">
              {/* Top-Right Controls */}
              <div className="absolute top-0 right-0 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadGuidePdf}
                  disabled={isDownloadingGuide}
                  className="hidden sm:inline-flex clean-btn px-3.5 py-2 rounded-full bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] text-xs font-extrabold uppercase tracking-wider items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-sm active:scale-95"
                >
                  <DocumentDownload size={15} color="#FFA5D5" variant="Bold" />
                  <span>
                    {isDownloadingGuide ? "Preparing..." : "Download PDF"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setReadingGuideOpen(false)}
                  className="p-1.5 sm:p-2 rounded-full border border-[#5B2302]/25 text-[#5B2302] hover:bg-[#5B2302] hover:text-[#F6EEE9] transition-colors cursor-pointer"
                  title="Close"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" strokeWidth={2.2} />
                </button>
              </div>

              {/* Cover */}
              <div className="shrink-0 pt-0.5">
                <BookCover
                  book={currentBook}
                  size="sm"
                  className="w-[80px] h-[116px] sm:w-[96px] sm:h-[140px] shadow-md"
                  showBookmark={false}
                  showBadge={false}
                />
              </div>

              {/* Book Details */}
              <div className="space-y-1.5 min-w-0 flex-1">
                <span className="px-2.5 py-0.5 rounded-full bg-[#FFA5D5] text-[#5B2302] text-[11px] sm:text-xs font-extrabold uppercase tracking-wide border border-[#5B2302]/20 inline-block">
                  Curator’s Reading Guide
                </span>
                <h3 className="font-block text-xl sm:text-2xl lg:text-3xl uppercase text-[#5B2302] leading-tight">
                  {currentBook.title}
                </h3>
                <p className="font-script text-xl sm:text-2xl text-[#5B2302] leading-normal py-0.5 pl-1 -ml-1 overflow-visible">
                  by {currentBook.author}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <RatingBadge rating={currentBook.rating} size="md" />
                  <SpiceBadge level={currentBook.spice_level} size="md" />
                </div>
              </div>
            </div>

            {/* 0. COMPLETE SYNOPSIS / ABOUT THE BOOK */}
            <div className="p-4 sm:p-6 rounded-2xl bg-[#F6EEE9]/80 space-y-2 border border-[#5B2302]/15">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#5B2302]">
                <Book1 size={18} color="#5B2302" variant="Bold" />
                About The Book
              </div>
              <p className="text-sm sm:text-base text-[#5B2302]/90 leading-relaxed font-body">
                {currentBook.description}
              </p>
            </div>

            {/* CURATOR'S NOTE */}
            {currentBook.curator_note && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFCEB] border border-[#5B2302]/15 space-y-1.5 font-body">
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#5B2302] block">
                  Curator’s Editorial Take
                </span>
                <p className="text-sm sm:text-base text-[#5B2302] leading-relaxed font-normal">
                  {currentBook.curator_note}
                </p>
              </div>
            )}

            {/* 1. WEEKLY PACING GUIDE */}
            {currentBook.reading_guide && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F6EEE9]/70 space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#5B2302]">
                  <Clock size={18} color="#5B2302" variant="Bold" />
                  Weekly Pacing Guide
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {currentBook.reading_guide
                    .split("\n")
                    .filter(Boolean)
                    .map((line, idx) => {
                      const title = `Week ${idx + 1}`;
                      const content = line
                        .replace(/^week\s*\d+\s*[:\-–—.]?\s*/i, "")
                        .trim();
                      return (
                        <div
                          key={idx}
                          className="p-3.5 sm:p-4 rounded-xl bg-[#FFFDF9] border border-[#5B2302]/10 space-y-1"
                        >
                          <span className="font-extrabold text-xs sm:text-sm uppercase text-[#5B2302] block">
                            {title}
                          </span>
                          <p className="text-sm text-[#5B2302]/90 leading-relaxed font-body">
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
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F6EEE9]/70 space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#5B2302]">
                  <SecuritySafe size={18} color="#5B2302" variant="Bold" />
                  Themes & Content Notes
                </div>
                <p className="text-sm sm:text-base text-[#5B2302]/90 leading-relaxed font-body">
                  {currentBook.content_notes}
                </p>
              </div>
            )}

            {/* 3. SCENE-SKIP GUIDE */}
            {currentBook.has_scene_skip && (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#F6EEE9]/70 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#5B2302]">
                    <Star size={18} color="#FFA5D5" variant="Bold" />
                    Spicy Scenes Guide
                  </div>
                  <span className="text-xs font-semibold text-[#5B2302]/80">
                    * We genuinely recommend skipping.
                  </span>
                </div>
                <p className="text-sm sm:text-base text-[#5B2302]/90 leading-relaxed font-body">
                  {currentBook.scene_skip_guide}
                </p>
              </div>
            )}

            {/* Bottom Bar: Discussion Date on Left, Download Button on Right */}
            <div className="pt-3.5 border-t border-[#5B2302]/15 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Calendar size={20} color="#5B2302" variant="Bold" className="shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B2302]/65 leading-none">
                    Discussion Date
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#5B2302] whitespace-nowrap leading-tight mt-0.5">
                    {new Date(currentBook.discussion_date).toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short", year: "numeric" },
                    )}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadGuidePdf}
                disabled={isDownloadingGuide}
                className="clean-btn px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] text-xs sm:text-sm font-extrabold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer disabled:opacity-60 active:scale-95 shadow-sm shrink-0 whitespace-nowrap"
              >
                <DocumentDownload size={16} color="#FFA5D5" variant="Bold" className="shrink-0" />
                <span>
                  {isDownloadingGuide ? "Preparing..." : "Download PDF"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINTABLE A4 READING GUIDE PDF TEMPLATE (Captured at 2x by html-to-image) */}
      {/* ========================================================================= */}
      {currentBook && (
        <div
          aria-hidden="true"
          className="fixed top-0 left-0 pointer-events-none opacity-0 -z-50 overflow-hidden font-body"
          style={{ width: "794px" }}
        >
          <div
            ref={guidePdfRef}
            style={{
              width: "794px",
              minHeight: "1123px",
              boxSizing: "border-box",
            }}
            className="relative bg-[#F6EEE9] text-[#5B2302] p-10 flex flex-col justify-between"
          >
            {/* Outer Editorial Frame */}
            <div className="absolute inset-4 border-2 border-[#5B2302] pointer-events-none rounded-2xl" />

            <div className="relative space-y-5">
              {/* Top Masthead */}
              <div className="flex items-center justify-between border-b-2 border-[#5B2302] pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/logo-web.png"
                    alt="Good Company Book Club"
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <div className="px-3.5 py-1 rounded-full bg-[#FFA5D5] border border-[#5B2302] font-block text-xs uppercase tracking-wider text-[#5B2302]">
                  Curator’s Reading Guide
                </div>
              </div>

              {/* Book Hero Row with Cover Image */}
              <div className="bg-[#FFFCF7] border border-[#5B2302]/25 rounded-2xl p-5 flex items-center gap-6">
                <div className="shrink-0">
                  <BookCover
                    book={currentBook}
                    size="sm"
                    className="w-28 h-42"
                    showBookmark={false}
                    showBadge={false}
                  />
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-nowrap">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5B2302]/70 whitespace-nowrap">
                      {currentBook.genre}
                    </span>
                    <RatingBadge rating={currentBook.rating} size="sm" />
                    <SpiceBadge level={currentBook.spice_level} size="sm" />
                  </div>
                  <h1 className="font-block text-3xl uppercase text-[#5B2302] leading-tight">
                    {currentBook.title}
                  </h1>
                  <p className="font-script text-2xl text-[#5B2302] leading-tight">
                    by {currentBook.author}
                  </p>
                  <div className="pt-1 flex items-center gap-4 text-xs font-bold text-[#5B2302]/85">
                    <span>
                      Discussion:{" "}
                      {new Date(currentBook.discussion_date).toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "short", year: "numeric" },
                      )}
                    </span>
                    {currentBook.meeting_format && (
                      <span>&bull; {currentBook.meeting_format}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* About The Book */}
              <div className="bg-[#FFFCF7] border border-[#5B2302]/25 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#5B2302]">
                  <Book1 size={15} color="#5B2302" variant="Bold" />
                  About The Book
                </div>
                <p className="text-xs text-[#5B2302]/90 leading-relaxed">
                  {currentBook.description}
                </p>
              </div>

              {/* Curator's Editorial Take */}
              {currentBook.curator_note && (
                <div className="bg-[#FFFCEB] border border-[#5B2302]/25 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B2302] block">
                    Curator’s Editorial Take
                  </span>
                  <p className="text-xs text-[#5B2302] leading-relaxed">
                    {currentBook.curator_note}
                  </p>
                </div>
              )}

              {/* Weekly Pacing Guide */}
              {currentBook.reading_guide && (
                <div className="bg-[#FFFCF7] border border-[#5B2302]/25 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#5B2302]">
                    <Clock size={15} color="#5B2302" variant="Bold" />
                    Weekly Pacing Guide
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {currentBook.reading_guide
                      .split("\n")
                      .filter(Boolean)
                      .map((line, idx) => {
                        const title = `Week ${idx + 1}`;
                        const content = line
                          .replace(/^week\s*\d+\s*[:\-–—.]?\s*/i, "")
                          .trim();
                        return (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-[#F6EEE9]/60 border border-[#5B2302]/15"
                          >
                            <span className="font-bold text-xs uppercase text-[#5B2302] block mb-0.5">
                              {title}
                            </span>
                            <p className="text-[11px] text-[#5B2302]/85 leading-relaxed">
                              {content}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Themes & Content Notes + Scene-Skip Guide */}
              <div className="grid grid-cols-1 gap-4">
                {currentBook.has_content_notes && (
                  <div className="bg-[#FFFCF7] border border-[#5B2302]/25 rounded-2xl p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#5B2302]">
                      <SecuritySafe size={15} color="#5B2302" variant="Bold" />
                      Themes &amp; Content Notes
                    </div>
                    <p className="text-xs text-[#5B2302]/85 leading-relaxed">
                      {currentBook.content_notes}
                    </p>
                  </div>
                )}

                {currentBook.has_scene_skip && (
                  <div className="bg-[#FFFCF7] border border-[#5B2302]/25 rounded-2xl p-4 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#5B2302]">
                        <Star size={15} color="#FFA5D5" variant="Bold" />
                        Spicy Scenes Guide
                      </div>
                      <span className="text-[11px] font-semibold text-[#5B2302]/75">
                        * We genuinely recommend skipping.
                      </span>
                    </div>
                    <p className="text-xs text-[#5B2302]/85 leading-relaxed">
                      {currentBook.scene_skip_guide}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="relative pt-4 mt-6 border-t border-[#5B2302]/20 flex items-center justify-between text-[10px] text-[#5B2302]/70 font-bold uppercase tracking-wider">
              <span>
                Good Company Book Club &bull; Good books. Better debates.
              </span>
              <span>@readwithgoodcompany</span>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ToastContainer />
    </div>
  );
}
