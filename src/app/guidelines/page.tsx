"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { DemoPersonaBanner } from "@/components/navigation/DemoPersonaBanner";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { useApp } from "@/lib/store/app-context";
import { LittleTeacup, StarFlair } from "@/components/ui/Illustrations";
import {
  Book1,
  Profile2User,
  Coffee,
  UserRemove,
  MessageFavorite,
  CallSlash,
  SecuritySafe,
  Danger,
  HeartTick,
  ShieldSecurity,
  DocumentDownload,
  TickCircle,
} from "iconsax-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { getFontEmbedCSS } from "@/lib/utils/font-embed";

interface Guideline {
  number: string;
  title: string;
  icon: React.ElementType;
  paragraphs: string[];
  spoilerAlert?: string;
  followingParagraphs?: string[];
  punchline?: string;
}

const GUIDELINES_DATA: Guideline[] = [
  {
    number: "01",
    title: "Please read the book",
    icon: Book1,
    paragraphs: [
      "Good Company is not for people who are perpetually “too busy” to read. We are all busy. The point is choosing to make a little room for books anyway.",
      "Audiobooks count. E-books count. A determined DNF counts if you read enough to arrive with an actual opinion.",
    ],
    punchline: "Looking at the cover occasionally does not count.",
  },
  {
    number: "02",
    title: "Be part of the thing",
    icon: Profile2User,
    paragraphs: [
      "Across every three-month period, members should make a genuine attempt to read at least two of our three selections and participate meaningfully in at least two discussions.",
      "You do not have to be loud. Quiet people are good company too. But there is a difference between being quiet and being absent.",
    ],
    punchline: "This is not an audience. We are all part of the thing.",
  },
  {
    number: "03",
    title: "If life gets full, take a pause",
    icon: Coffee,
    paragraphs: [
      "You are allowed to have a bad month. You may get sick. Work may attempt to swallow you whole. Life may simply become life.",
      "Tell us and request a pause. Return when you have room to read again.",
    ],
    punchline:
      "What we cannot have is an entire book club full of people apologising every month for not reading books.",
  },
  {
    number: "04",
    title: "Inactive members will be removed",
    icon: UserRemove,
    paragraphs: [
      "If you neither read nor participate for two consecutive book cycles, we will check in.",
      "If you do not respond within seven days, or remain inactive without requesting a pause, you will be removed from the active club.",
    ],
    punchline:
      "It is not a public trial. It only means active membership is for people who are currently able to participate.",
  },
  {
    number: "05",
    title: "Be passionate about the book. Be kind to the reader.",
    icon: MessageFavorite,
    paragraphs: [
      "Roast the plot. Prosecute a fictional character. Question the author’s entire decision-making process.",
      "Do not insult, mock or condescend to another member because they understood the book differently. No intellectual gatekeeping. No turning every discussion into your personal TED Talk.",
    ],
    punchline:
      "Disagree with the opinion. Not the person. Make your point, and then make room.",
  },
  {
    number: "06",
    title: "Access is not permission",
    icon: CallSlash,
    paragraphs: [
      "Our WhatsApp group makes members’ phone numbers visible. This does not make it a networking directory, customer list or dating app.",
      "Do not use a number obtained through Good Company for unsolicited private messages, romantic advances or commercial promotions.",
    ],
    punchline:
      "If you would like to continue a conversation privately, ask first. Let the person say yes.",
  },
  {
    number: "07",
    title: "What is shared here stays here",
    icon: SecuritySafe,
    paragraphs: [
      "Do not forward messages or voice notes, screenshot private conversations, share members’ phone numbers or repeat personal stories outside the club.",
      "Do not add members to unrelated groups without permission.",
    ],
    punchline: "The room only works if people can trust it.",
  },
  {
    number: "08",
    title: "Do not spoil the bloody book",
    icon: Danger,
    paragraphs: [
      "We will follow a reading schedule. If you read ahead, good for you, Hermione.",
      "Before discussing anything beyond the agreed chapters, add a clear warning:",
    ],
    spoilerAlert: "🚨 SPOILER ALERT: Chapters 15–20",
    followingParagraphs: [
      "Then leave enough empty space that someone scrolling cannot see the spoiler accidentally.",
      "If you are wondering whether something counts as a spoiler, cover it. Peace is better.",
    ],
  },
  {
    number: "09",
    title: "Take care of the room",
    icon: HeartTick,
    paragraphs: [
      "Keep the WhatsApp group centred on books, gatherings and the occasional literary detour. No chain forwards, unrelated viral content, broadcast spam or constant business promotion.",
      "Review content notes and scene-skip guides where provided — we genuinely recommend skipping the spicy scenes. At events, tell the host if you do not want to appear in photographs or on @readwithgoodcompany. No explanation required.",
    ],
    punchline: "And please RSVP honestly. If your plans change, update us.",
  },
  {
    number: "10",
    title: "We will protect Good Company",
    icon: ShieldSecurity,
    paragraphs: [
      "Curators and administrators may delete messages, redirect disruptive conversations, mute the group for announcements, issue warnings, restrict event access or end a membership.",
      "Harassment, bullying, discrimination, serious privacy violations, repeated unwanted contact or behaviour that makes the club unsafe may result in immediate removal.",
    ],
    punchline:
      "Not every moderation decision will become a group debate. Sometimes we will protect the room and move on.",
  },
];

export default function GuidelinesPage() {
  const { addToast } = useApp();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // References to the A4 PDF printable pages
  const page1Ref = useRef<HTMLDivElement>(null);
  const page2Ref = useRef<HTMLDivElement>(null);
  const page3Ref = useRef<HTMLDivElement>(null);

  // Preload font embed CSS on mount for fast PDF generation
  useEffect(() => {
    getFontEmbedCSS();
  }, []);

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    try {
      // 1. Fetch base64 embedded fonts so Berthold Block, Good Time Script, and TT Interphases render verbatim
      const fontEmbedCSS = await getFontEmbedCSS();

      // Brief yield so DOM styling applies
      await new Promise((resolve) => setTimeout(resolve, 150));

      const pages = [page1Ref.current, page2Ref.current, page3Ref.current];
      if (!pages[0] || !pages[1] || !pages[2]) {
        throw new Error("PDF template pages were not found in DOM.");
      }

      // Initialize A4 PDF: 210mm x 297mm
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i]!;
        const dataUrl = await toPng(pageEl, {
          pixelRatio: 2, // High resolution crisp rendering
          cacheBust: true,
          fontEmbedCSS: fontEmbedCSS || undefined,
        });

        if (i > 0) {
          doc.addPage("a4", "portrait");
        }

        // Add 210mm x 297mm image covering full A4 page
        doc.addImage(dataUrl, "PNG", 0, 0, 210, 297, undefined, "FAST");
      }

      const filename = "Good-Company-Community-Guidelines.pdf";
      const pdfDataUri = doc.output("datauristring");

      // Download via /api/download endpoint to enforce exact Content-Disposition attachment & MIME type
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
      } catch (apiErr) {
        console.warn(
          "API download failed, falling back to direct blob anchor:",
          apiErr,
        );
      }

      // Fallback to direct client-side blob anchor if API route had any issue
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

      setDownloadSuccess(true);
      if (addToast) {
        addToast(
          "Community Guidelines PDF downloaded successfully!",
          "success",
        );
      }
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error("Error generating PDF:", err);
      if (addToast) {
        addToast("Unable to export PDF. Please try again.", "error");
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6EEE9] text-[#5B2302]">
      <DemoPersonaBanner />
      <Navbar />

      <main className="flex-1 py-10 md:py-16 pb-28 lg:pb-16 font-body">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Header & Preamble */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <div className="flex justify-center mx-auto">
              <img
                src="/images/tea.png"
                alt="Good Company Tea"
                className="w-16 h-16 object-contain"
              />
            </div>

            <div className="flex items-center justify-center">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#5B2302]/70">
                Official Club Policy
              </span>
            </div>

            <h1 className="font-block text-3xl sm:text-4xl md:text-5xl uppercase text-[#5B2302] leading-tight tracking-tight">
              Community Guidelines
            </h1>

            <div className="p-6 sm:p-7 rounded-2xl bg-[#FFFCF7] border border-[#5B2302]/25 text-left space-y-3">
              <p className="text-sm sm:text-base text-[#5B2302] leading-relaxed">
                We gather on WhatsApp and around the table to argue passionately
                about books, not each other. These rules protect our warmth, our
                wit and our peace of mind.
              </p>
              <p className="font-script text-2xl text-[#5B2302] pt-1">
                There are ten. Stay with me.
              </p>
            </div>
          </div>

          {/* The 10 Guidelines List */}
          <div className="space-y-5">
            {GUIDELINES_DATA.map((g) => {
              const Icon = g.icon;
              return (
                <div
                  key={g.number}
                  className="rounded-2xl p-6 sm:p-7 border border-[#5B2302]/20 bg-[#FFFCF7] space-y-3.5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-xs font-block text-[#5B2302] px-2.5 py-0.5 rounded-full bg-[#FFA5D5] border border-[#5B2302]">
                        {g.number}
                      </span>
                      <h2 className="font-block text-xl sm:text-2xl uppercase text-[#5B2302] leading-snug">
                        {g.title}
                      </h2>
                    </div>
                    {/* Bare icon without square box or borders */}
                    <Icon
                      size={22}
                      color="#5B2302"
                      variant="Linear"
                      className="shrink-0 opacity-80"
                    />
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-[#5B2302]/90 leading-relaxed font-body">
                    {g.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}

                    {g.spoilerAlert && (
                      <div className="my-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#5B2302] text-[#F6EEE9] font-block text-xs uppercase tracking-wide">
                        <span>{g.spoilerAlert}</span>
                      </div>
                    )}

                    {g.followingParagraphs &&
                      g.followingParagraphs.map((fp, fpIdx) => (
                        <p key={`fp-${fpIdx}`}>{fp}</p>
                      ))}

                    {g.punchline && (
                      <p className="font-semibold text-[#5B2302] pt-1 border-t border-[#5B2302]/10 mt-2.5">
                        {g.punchline}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* The Epilogue / "Anyway" Section */}
          <div className="mt-8 rounded-2xl p-7 sm:p-9 border border-[#5B2302]/25 bg-[#FFFCF7] space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-script text-3xl sm:text-4xl text-[#5B2302]">
                Anyway
              </span>
              <div className="h-px flex-1 bg-[#5B2302]/20"></div>
            </div>

            <p className="text-sm sm:text-base text-[#5B2302] leading-relaxed">
              Good Company should be literary and beautiful. Funny and chaotic.
              Warm and cosy. A place where you arrive carrying one opinion and
              leave wondering if you have misunderstood the book, yourself and
              perhaps the entire world.
            </p>

            <p className="text-sm sm:text-base text-[#5B2302] leading-relaxed">
              To make that possible, we have to read. We have to participate.
              And we have to be good company to one another.
            </p>

            <div className="p-4 sm:p-5 rounded-xl bg-[#FFA5D5] border border-[#5B2302] text-center space-y-1">
              <p className="font-block text-base sm:text-lg uppercase text-[#5B2302] tracking-wide">
                The books are not decorative.
              </p>
              <p className="font-script text-2xl sm:text-3xl text-[#5B2302]">
                Please open them.
              </p>
            </div>
          </div>

          {/* Bottom Card */}
          <div className="mt-8 bg-[#5B2302] text-[#F6EEE9] rounded-2xl p-7 sm:p-8 text-center space-y-3 border border-[#5B2302]">
            <h3 className="font-block text-xl sm:text-2xl uppercase text-[#F6EEE9]">
              Keep Good Company Close
            </h3>
            <p className="text-xs sm:text-sm text-[#F6EEE9]/85 max-w-md mx-auto">
              Download your copy of our 10 rules as a clean, branded PDF to keep
              or review before book cycle discussions.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="clean-btn inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#FFA5D5] text-[#5B2302] text-xs font-extrabold uppercase hover:bg-[#ffbfe1] transition-all cursor-pointer disabled:opacity-75"
              >
                {isGeneratingPdf ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#5B2302] border-t-transparent animate-spin" />
                    <span>Preparing PDF...</span>
                  </>
                ) : (
                  <>
                    <DocumentDownload
                      size={16}
                      color="#5B2302"
                      variant="Bold"
                    />
                    <span>Download Guidelines PDF</span>
                  </>
                )}
              </button>

              <Link
                href="/apply"
                className="clean-btn inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-transparent border border-[#FFA5D5] text-[#FFA5D5] text-xs font-extrabold uppercase hover:bg-[#FFA5D5]/10"
              >
                <StarFlair className="w-3.5 h-3.5 text-[#FFA5D5]" />
                Apply to Join
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <ToastContainer />

      {/* ========================================================================= */}
      {/* A4 PDF TEMPLATE (Captured by html-to-image + jsPDF at 2x)                */}
      {/* Using opacity-0 pointer-events-none fixed top-0 to ensure layout validity */}
      {/* ========================================================================= */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 pointer-events-none opacity-0 -z-50 overflow-hidden"
        style={{ width: "794px" }}
      >
        {/* =================== PDF PAGE 1 =================== */}
        <div
          ref={page1Ref}
          style={{ width: "794px", height: "1123px", boxSizing: "border-box" }}
          className="relative bg-[#F6EEE9] text-[#5B2302] p-8 flex flex-col justify-between overflow-hidden"
        >
          {/* Outer Border Inset */}
          <div className="absolute inset-4 border-2 border-[#5B2302] pointer-events-none rounded-xl" />

          {/* Header */}
          <div className="relative pt-4 space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#5B2302] pb-3">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/tea.png"
                  alt="Good Company Tea"
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <span className="font-block text-xs uppercase tracking-wider block text-[#5B2302]">
                    Good Company Book Club
                  </span>
                  <span className="text-[10px] text-[#5B2302]/70 uppercase tracking-widest block font-bold">
                    Est. 2024 • Literary Salon
                  </span>
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-[#FFA5D5] border border-[#5B2302] font-block text-[10px] uppercase tracking-wider text-[#5B2302]">
                Official Manifesto
              </div>
            </div>

            <div className="text-center pt-2 pb-1 space-y-1">
              <h1 className="font-block text-3xl uppercase tracking-tight text-[#5B2302]">
                Community Guidelines
              </h1>
              <p className="font-script text-xl text-[#5B2302]">
                Warmth, wit and peace of mind
              </p>
            </div>

            {/* Preamble Box */}
            <div className="bg-[#FFFCF7] border border-[#5B2302]/30 rounded-xl p-4 space-y-2">
              <p className="text-xs text-[#5B2302] leading-relaxed">
                We gather on WhatsApp and around the table to argue passionately
                about books, not each other. These rules protect our warmth, our
                wit and our peace of mind.
              </p>
              <p className="font-script text-base text-[#5B2302]">
                There are ten. Stay with me.
              </p>
            </div>
          </div>

          {/* Rules 01, 02, 03 */}
          <div className="relative space-y-3.5 my-auto">
            {GUIDELINES_DATA.slice(0, 3).map((g) => {
              const Icon = g.icon;
              return (
                <div
                  key={g.number}
                  className="bg-[#FFFCF7] border border-[#5B2302]/30 rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="font-block text-[11px] px-2.5 py-0.5 rounded-full bg-[#FFA5D5] border border-[#5B2302] text-[#5B2302]">
                        {g.number}
                      </span>
                      <h2 className="font-block text-base uppercase text-[#5B2302]">
                        {g.title}
                      </h2>
                    </div>
                    <Icon
                      size={18}
                      color="#5B2302"
                      variant="Linear"
                      className="opacity-80 shrink-0"
                    />
                  </div>

                  <div className="text-[11px] text-[#5B2302]/90 leading-relaxed space-y-1">
                    {g.paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                    {g.punchline && (
                      <p className="font-bold text-[#5B2302] pt-0.5">
                        {g.punchline}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Page 1 Footer */}
          <div className="relative pt-3 border-t border-[#5B2302]/20 flex items-center justify-between text-[10px] text-[#5B2302]/70 font-bold uppercase tracking-wider">
            <span>Good Company Book Club</span>
            <span>Page 1 of 3</span>
          </div>
        </div>

        {/* =================== PDF PAGE 2 =================== */}
        <div
          ref={page2Ref}
          style={{ width: "794px", height: "1123px", boxSizing: "border-box" }}
          className="relative bg-[#F6EEE9] text-[#5B2302] p-8 flex flex-col justify-between overflow-hidden"
        >
          {/* Outer Border Inset */}
          <div className="absolute inset-4 border-2 border-[#5B2302] pointer-events-none rounded-xl" />

          {/* Running Header */}
          <div className="relative pt-4 flex items-center justify-between border-b-2 border-[#5B2302] pb-3">
            <span className="font-block text-xs uppercase tracking-wider text-[#5B2302]">
              Good Company Community Guidelines
            </span>
            <span className="font-script text-base text-[#5B2302]">
              Rules 04 — 07
            </span>
          </div>

          {/* Rules 04, 05, 06, 07 */}
          <div className="relative space-y-3.5 my-auto">
            {GUIDELINES_DATA.slice(3, 7).map((g) => {
              const Icon = g.icon;
              return (
                <div
                  key={g.number}
                  className="bg-[#FFFCF7] border border-[#5B2302]/30 rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="font-block text-[11px] px-2.5 py-0.5 rounded-full bg-[#FFA5D5] border border-[#5B2302] text-[#5B2302]">
                        {g.number}
                      </span>
                      <h2 className="font-block text-base uppercase text-[#5B2302]">
                        {g.title}
                      </h2>
                    </div>
                    <Icon
                      size={18}
                      color="#5B2302"
                      variant="Linear"
                      className="opacity-80 shrink-0"
                    />
                  </div>

                  <div className="text-[11px] text-[#5B2302]/90 leading-relaxed space-y-1">
                    {g.paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                    {g.punchline && (
                      <p className="font-bold text-[#5B2302] pt-0.5">
                        {g.punchline}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Page 2 Footer */}
          <div className="relative pt-3 border-t border-[#5B2302]/20 flex items-center justify-between text-[10px] text-[#5B2302]/70 font-bold uppercase tracking-wider">
            <span>Good Company Book Club</span>
            <span>Page 2 of 3</span>
          </div>
        </div>

        {/* =================== PDF PAGE 3 =================== */}
        <div
          ref={page3Ref}
          style={{ width: "794px", height: "1123px", boxSizing: "border-box" }}
          className="relative bg-[#F6EEE9] text-[#5B2302] p-8 flex flex-col justify-between overflow-hidden"
        >
          {/* Outer Border Inset */}
          <div className="absolute inset-4 border-2 border-[#5B2302] pointer-events-none rounded-xl" />

          {/* Running Header */}
          <div className="relative pt-4 flex items-center justify-between border-b-2 border-[#5B2302] pb-3">
            <span className="font-block text-xs uppercase tracking-wider text-[#5B2302]">
              Good Company Community Guidelines
            </span>
            <span className="font-script text-base text-[#5B2302]">
              Rules 08 — 10 & Outro
            </span>
          </div>

          {/* Rules 08, 09, 10 */}
          <div className="relative space-y-3.5 my-auto">
            {GUIDELINES_DATA.slice(7, 10).map((g) => {
              const Icon = g.icon;
              return (
                <div
                  key={g.number}
                  className="bg-[#FFFCF7] border border-[#5B2302]/30 rounded-xl p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="font-block text-[11px] px-2.5 py-0.5 rounded-full bg-[#FFA5D5] border border-[#5B2302] text-[#5B2302]">
                        {g.number}
                      </span>
                      <h2 className="font-block text-sm sm:text-base uppercase text-[#5B2302]">
                        {g.title}
                      </h2>
                    </div>
                    <Icon
                      size={18}
                      color="#5B2302"
                      variant="Linear"
                      className="opacity-80 shrink-0"
                    />
                  </div>

                  <div className="text-[10.5px] text-[#5B2302]/90 leading-relaxed space-y-1">
                    {g.paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}

                    {g.spoilerAlert && (
                      <div className="my-1.5 px-2.5 py-1 rounded bg-[#5B2302] text-[#F6EEE9] font-block text-[10px] uppercase tracking-wide inline-flex items-center gap-1.5">
                        <span>{g.spoilerAlert}</span>
                      </div>
                    )}

                    {g.followingParagraphs &&
                      g.followingParagraphs.map((fp, idx) => (
                        <p key={`fp-${idx}`}>{fp}</p>
                      ))}

                    {g.punchline && (
                      <p className="font-bold text-[#5B2302] pt-0.5">
                        {g.punchline}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Outro / "Anyway" Epilogue Box */}
            <div className="bg-[#FFFCF7] border border-[#5B2302]/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-script text-2xl text-[#5B2302]">
                  Anyway
                </span>
                <div className="h-[1px] flex-1 bg-[#5B2302]/20" />
              </div>

              <p className="text-[10.5px] text-[#5B2302] leading-relaxed">
                Good Company should be literary and beautiful. Funny and
                chaotic. Warm and cosy. A place where you arrive carrying one
                opinion and leave wondering if you have misunderstood the book,
                yourself and perhaps the entire world.
              </p>

              <p className="text-[10.5px] text-[#5B2302] leading-relaxed">
                To make that possible, we have to read. We have to participate.
                And we have to be good company to one another.
              </p>

              <div className="p-2.5 rounded-lg bg-[#FFA5D5] border border-[#5B2302] text-center space-y-0.5">
                <p className="font-block text-xs uppercase text-[#5B2302] tracking-wide">
                  The books are not decorative.
                </p>
                <p className="font-script text-lg text-[#5B2302]">
                  Please open them.
                </p>
              </div>
            </div>
          </div>

          {/* Page 3 Footer */}
          <div className="relative pt-3 border-t border-[#5B2302]/20 flex items-center justify-between text-[10px] text-[#5B2302]/70 font-bold uppercase tracking-wider">
            <span>@readwithgoodcompany</span>
            <span>Page 3 of 3</span>
          </div>
        </div>
      </div>
    </div>
  );
}
