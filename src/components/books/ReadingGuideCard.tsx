"use client";

import React, { useState, useRef, useEffect } from "react";
import { Book } from "@/types";
import { useApp } from "@/lib/store/app-context";
import { BookCover } from "./BookCover";
import { RatingBadge, SpiceBadge } from "./BookBadges";
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

interface ReadingGuideCardProps {
  book: Book;
  variant?: "modal" | "page";
  onClose?: () => void;
}

export function parseWeeklyPacing(guideText?: string): { week: string; text: string }[] {
  if (!guideText) return [];

  let targetText = guideText;
  const pacingHeaderIndex = guideText.search(/###\s*Weekly Pacing Guide/i);
  if (pacingHeaderIndex !== -1) {
    const afterHeader = guideText.slice(pacingHeaderIndex);
    const nextSectionIndex = afterHeader.search(/\n###\s+/);
    targetText =
      nextSectionIndex !== -1 ? afterHeader.slice(0, nextSectionIndex) : afterHeader;
    targetText = targetText.replace(/###\s*Weekly Pacing Guide/i, "");
  }

  const lines = targetText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("###"));

  if (lines.length === 0) return [];

  return lines.map((line, idx) => {
    // Check if line matches "- **Week 1 (Chapters 1–7):** Description"
    const weekMatch = line.match(
      /^[-*•]?\s*\**\s*(Week\s*\d+[^:*]*)\**\s*[:\-–—]\s*(.*)$/i,
    );
    if (weekMatch) {
      return {
        week: weekMatch[1].replace(/\*+/g, "").trim(),
        text: weekMatch[2].replace(/\*+/g, "").trim(),
      };
    }

    // Check if line matches "Chapters 1–10: Description"
    const chapterMatch = line.match(
      /^[-*•]?\s*(Chapters?\s*[^:]+)\s*[:\-–—]\s*(.*)$/i,
    );
    if (chapterMatch) {
      return {
        week: `Week ${idx + 1} · ${chapterMatch[1].trim()}`,
        text: chapterMatch[2].trim(),
      };
    }

    // Fallback: general line
    const cleanContent = line
      .replace(/^[-*•]\s*/, "")
      .replace(/^week\s*\d+\s*[:\-–—.]?\s*/i, "")
      .trim();
    return {
      week: `Week ${idx + 1}`,
      text: cleanContent,
    };
  });
}

export function ReadingGuideCard({
  book,
  variant = "modal",
  onClose,
}: ReadingGuideCardProps) {
  const { addToast } = useApp();
  const [isDownloadingGuide, setIsDownloadingGuide] = useState(false);
  const guidePdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getFontEmbedCSS();
  }, []);

  const handleDownloadGuidePdf = async () => {
    if (!book || !guidePdfRef.current || isDownloadingGuide) return;
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

      const safeTitle = (book.title || "reading-guide")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
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
      console.error("Failed to generate PDF:", err);
      addToast(
        "Could not generate Reading Guide PDF. Please try again.",
        "error",
      );
    } finally {
      setIsDownloadingGuide(false);
    }
  };

  const pacingItems = parseWeeklyPacing(book.reading_guide);

  const cardContent = (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`bg-[#FFFDF9] rounded-2xl sm:rounded-3xl p-5 sm:p-8 pb-4 sm:pb-6 max-w-4xl w-full border-2 border-[#5B2302] relative space-y-6 font-body ${
        variant === "modal"
          ? "max-h-[92vh] overflow-y-auto no-scrollbar [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] animate-in zoom-in-95 duration-200"
          : "shadow-sm"
      }`}
    >
      {/* Header: Book Cover on Left, Editorial Details on Right */}
      <div
        className={`relative flex items-start gap-4 sm:gap-6 pb-5 border-b border-[#5B2302]/15 ${
          variant === "modal" && onClose ? "pr-10 sm:pr-12" : "sm:pr-40"
        }`}
      >
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

          {variant === "modal" && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-full border border-[#5B2302]/25 text-[#5B2302] hover:bg-[#5B2302] hover:text-[#F6EEE9] transition-colors cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              <X className="w-5 h-5" strokeWidth={2.2} />
            </button>
          )}
        </div>

        {/* Cover */}
        <div className="shrink-0 pt-0.5">
          <BookCover
            book={book}
            size="sm"
            className="w-[84px] h-[122px] sm:w-[100px] sm:h-[145px] shadow-md"
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
            {book.title}
          </h3>
          <p className="font-script text-xl sm:text-2xl text-[#5B2302] leading-normal py-0.5 pl-1 -ml-1 overflow-visible">
            by {book.author}
          </p>
          <div className="flex items-center gap-2 pt-0.5 whitespace-nowrap">
            <RatingBadge rating={book.rating} size="md" />
            <span
              className="text-[#5B2302]/40 text-xs sm:text-sm select-none"
              aria-hidden="true"
            >
              &bull;
            </span>
            <SpiceBadge level={book.spice_level} size="md" />
          </div>
        </div>
      </div>

      {/* 0. COMPLETE SYNOPSIS / ABOUT THE BOOK (Clean Editorial Surface, No Container Box) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#5B2302]">
          <Book1 size={18} color="#5B2302" variant="Bold" />
          About The Book
        </div>
        <p className="text-sm sm:text-base text-[#5B2302]/90 leading-relaxed font-body">
          {book.description}
        </p>
      </div>

      {/* CURATOR'S NOTE (Editorial, Clean, No AI Side Border) */}
      {book.curator_note && (
        <div className="pt-4 border-t border-[#5B2302]/15 space-y-1.5 font-body">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#5B2302] block">
            Curator’s Note
          </span>
          <p className="text-sm sm:text-base text-[#5B2302]/90 leading-relaxed font-body">
            &ldquo;{book.curator_note}&rdquo;
          </p>
        </div>
      )}

      {/* 1. WEEKLY PACING GUIDE (No Outer Container, Clean Direct Grid) */}
      {pacingItems.length > 0 && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#5B2302]">
            <Clock size={18} color="#5B2302" variant="Bold" />
            Weekly Pacing Guide
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pacingItems.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#F6EEE9]/60 border border-[#5B2302]/15 space-y-1.5"
              >
                <span className="font-extrabold text-xs sm:text-sm uppercase text-[#5B2302] block tracking-wide">
                  {item.week}
                </span>
                <p className="text-sm sm:text-base text-[#5B2302]/85 leading-relaxed font-body">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. THEMES & CONTENT NOTES (Clean Separator Rule, No Container Box) */}
      {book.has_content_notes && book.content_notes && (
        <div className="pt-4 border-t border-[#5B2302]/15 space-y-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#5B2302]">
            <SecuritySafe size={18} color="#5B2302" variant="Bold" />
            Themes & Content Notes
          </div>
          <p className="text-sm sm:text-base text-[#5B2302]/90 leading-relaxed font-body">
            {book.content_notes}
          </p>
        </div>
      )}

      {/* 3. SCENE-SKIP GUIDE (Clean Separator Rule, No Container Box) */}
      {book.has_scene_skip && book.scene_skip_guide && (
        <div className="pt-4 border-t border-[#5B2302]/15 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wide text-[#5B2302]">
              <Star size={18} color="#FFA5D5" variant="Bold" />
              Spicy Scenes Guide
            </div>
            <span className="text-xs font-semibold text-[#5B2302]/70 italic">
              * We genuinely recommend skipping.
            </span>
          </div>
          <p className="text-sm sm:text-base text-[#5B2302]/90 leading-relaxed font-body">
            {book.scene_skip_guide}
          </p>
        </div>
      )}

      {/* Bottom Bar: Discussion Date on Left, Download PDF on Right (Clean Chin Space) */}
      <div className="pt-4 border-t border-[#5B2302]/15 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <Calendar size={20} color="#5B2302" variant="Bold" className="shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B2302]/65 leading-none">
              Discussion Date
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-[#5B2302] whitespace-nowrap leading-tight mt-0.5">
              {book.discussion_date
                ? new Date(book.discussion_date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "To be announced"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadGuidePdf}
          disabled={isDownloadingGuide}
          className="clean-btn px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] text-xs sm:text-sm font-extrabold uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-95 shadow-sm whitespace-nowrap shrink-0"
        >
          <DocumentDownload size={16} color="#FFA5D5" variant="Bold" className="shrink-0" />
          <span>
            {isDownloadingGuide ? "Preparing..." : "Download PDF"}
          </span>
        </button>
      </div>
    </div>
  );

  // =========================================================================
  // PRINTABLE A4 READING GUIDE PDF TEMPLATE (Captured at 2x by html-to-image)
  // =========================================================================
  const pdfTemplate = (
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
                  book={book}
                  size="sm"
                  className="w-28 h-42"
                  showBookmark={false}
                  showBadge={false}
                />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-nowrap">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5B2302]/70 whitespace-nowrap">
                    {book.genre}
                  </span>
                  <RatingBadge rating={book.rating} size="sm" />
                  <SpiceBadge level={book.spice_level} size="sm" />
                </div>
                <h1 className="font-block text-3xl uppercase text-[#5B2302] leading-tight">
                  {book.title}
                </h1>
                <p className="font-script text-2xl text-[#5B2302] leading-tight">
                  by {book.author}
                </p>
                <div className="pt-1 flex items-center gap-4 text-xs font-bold text-[#5B2302]/85">
                  <span>
                    Discussion:{" "}
                    {book.discussion_date
                      ? new Date(book.discussion_date).toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "short", year: "numeric" },
                        )
                      : "To be announced"}
                  </span>
                  {book.meeting_format && (
                    <span>&bull; {book.meeting_format}</span>
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
                {book.description}
              </p>
            </div>

            {/* Curator's Editorial Take */}
            {book.curator_note && (
              <div className="bg-[#FFFCEB] border border-[#5B2302]/25 rounded-2xl p-4 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B2302] block">
                  Curator’s Editorial Take
                </span>
                <p className="text-xs text-[#5B2302] leading-relaxed">
                  {book.curator_note}
                </p>
              </div>
            )}

            {/* Weekly Pacing Guide */}
            {pacingItems.length > 0 && (
              <div className="bg-[#FFFCF7] border border-[#5B2302]/25 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#5B2302]">
                  <Clock size={15} color="#5B2302" variant="Bold" />
                  Weekly Pacing Guide
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {pacingItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#F6EEE9]/60 border border-[#5B2302]/15"
                    >
                      <span className="font-bold text-xs uppercase text-[#5B2302] block mb-0.5">
                        {item.week}
                      </span>
                      <p className="text-[11px] text-[#5B2302]/85 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Themes & Content Notes + Scene-Skip Guide */}
            <div className="grid grid-cols-1 gap-4">
              {book.has_content_notes && book.content_notes && (
                <div className="bg-[#FFFCF7] border border-[#5B2302]/25 rounded-2xl p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase text-[#5B2302]">
                    <SecuritySafe size={15} color="#5B2302" variant="Bold" />
                    Themes &amp; Content Notes
                  </div>
                  <p className="text-xs text-[#5B2302]/85 leading-relaxed">
                    {book.content_notes}
                  </p>
                </div>
              )}

              {book.has_scene_skip && book.scene_skip_guide && (
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
                    {book.scene_skip_guide}
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
  );

  if (variant === "modal") {
    return (
      <div
        role="dialog"
        aria-modal="true"
        onClick={onClose}
        className="fixed inset-0 z-50 bg-[#3D1600]/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      >
        {cardContent}
        {pdfTemplate}
      </div>
    );
  }

  return (
    <>
      {cardContent}
      {pdfTemplate}
    </>
  );
}
