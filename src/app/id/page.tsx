"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { useApp } from "@/lib/store/app-context";
import { ToastContainer } from "@/components/ui/ToastContainer";
import {
  Upload,
  Download,
  Sparkles,
  Smartphone,
  Square,
  CreditCard,
  Shuffle,
  Camera,
  ChevronDown,
  X,
} from "lucide-react";
import { toPng } from "html-to-image";
import { getFontEmbedCSS } from "@/lib/utils/font-embed";

// Genre options dropdown
const GENRE_OPTIONS = [
  "Romance / Dark Academia",
  "Contemporary Romance",
  "Romantic Comedy",
  "Literary Fiction",
  "African Literature",
  "Fantasy & Sci-Fi",
  "Thrillers & Mystery",
  "Memoir & Essays",
  "Historical Fiction",
  "Poetry",
  "Other / Custom...",
];

// Reading superpower presets
const SUPERPOWER_PRESETS = [
  "Finishes a book in one night",
  "Can read through any noise",
  "Annotates with 12 sticky tabs",
  "Buys books faster than reading them",
  "Cries at every epilogue",
  "Knows the plot twist by chapter 3",
  "Smells every new book first",
  "Other / Custom...",
];

// Mood presets
const MOOD_PRESETS = [
  "Just one more chapter...",
  "Always has a paperback in bag",
  "Book hangover in progress",
  "Tea, rain & a good chapter",
  "Do not disturb: fictional crisis",
  "Mentally living in Sicily with academic rivals",
  "Other / Custom...",
];

type BgTheme =
  | "blush-gingham"
  | "sage-gingham"
  | "espresso-plaid"
  | "cream-parchment";
type ExportFormat = "story" | "square" | "badge";

export default function MemberIdPage() {
  // Form State
  const [name, setName] = useState("Amaka Okafor");
  const [memberId, setMemberId] = useState("GC-042");
  const [memberSince, setMemberSince] = useState("2026");
  const [location, setLocation] = useState("Abuja, Nigeria");
  const [selectedGenre, setSelectedGenre] = useState("Romance / Dark Academia");
  const [customGenre, setCustomGenre] = useState("");
  const [favoriteQuote, setFavoriteQuote] = useState(
    "There is no friend as loyal as a book.",
  );
  const [selectedSuperpower, setSelectedSuperpower] = useState(
    "Finishes a book in one night",
  );
  const [customSuperpower, setCustomSuperpower] = useState("");
  const [selectedMood, setSelectedMood] = useState("Just one more chapter...");
  const [customMood, setCustomMood] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Styling State
  const [bgTheme, setBgTheme] = useState<BgTheme>("blush-gingham");
  const [showCharms, setShowCharms] = useState(true);
  const [fontMode, setFontMode] = useState<"script" | "editorial">("script");
  const [exportFormat, setExportFormat] = useState<ExportFormat>("story");
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(
    null,
  );
  const { addToast } = useApp();

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportCardRef = useRef<HTMLDivElement>(null);

  // Actual display values
  const displayGenre =
    selectedGenre === "Other / Custom..."
      ? customGenre || "Romance"
      : selectedGenre;
  const displaySuperpower =
    selectedSuperpower === "Other / Custom..."
      ? customSuperpower || "Speed reader"
      : selectedSuperpower;
  const displayMood =
    selectedMood === "Other / Custom..."
      ? customMood || "Reading quietly"
      : selectedMood;

  // Photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Randomize ID number
  const handleRerollId = () => {
    const num = Math.floor(100 + Math.random() * 900);
    setMemberId(`GC-${num}`);
  };
  // Pre-load font embed data on mount for instant download
  useEffect(() => {
    getFontEmbedCSS();
  }, []);

  // Bulletproof PNG Image Download (Guaranteed PNG file on all browsers with custom fonts)
  const handleDownload = async () => {
    if (!exportCardRef.current) return;
    setIsDownloading(true);

    try {
      const fontEmbedCSS = await getFontEmbedCSS();

      await new Promise((r) => setTimeout(r, 200));

      const dataUrl = await toPng(exportCardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        quality: 1,
        fontEmbedCSS: fontEmbedCSS || undefined,
      });

      if (!dataUrl || dataUrl.length < 100 || dataUrl === "data:,") {
        throw new Error("Failed to generate image data");
      }

      const safeName = (name || "member")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-");
      const filename = `good-company-id-${safeName}-${exportFormat}.png`;

      // Set image preview in modal for immediate visual confirmation & manual tap-and-hold
      setPreviewModalImage(dataUrl);

      // 1. Direct browser anchor download via data URL (Immediate for Chromium & desktop)
      try {
        const link = document.createElement("a");
        link.download = filename;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
          document.body.removeChild(link);
        }, 150);
      } catch (err) {
        console.warn("Direct dataUrl download attempt:", err);
      }

      // 2. Guaranteed server attachment download via /api/download (Ensures true file attachment on Safari/macOS)
      try {
        const response = await fetch("/api/download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl, filename }),
        });

        if (response.ok) {
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          }, 60000); // 60s timeout so the OS download manager has ample time
        }
      } catch (err) {
        console.warn("Server attachment download attempt:", err);
      }

      addToast("Badge downloaded as PNG image!", "success");
    } catch (err) {
      console.error("Download error:", err);
      alert("Could not generate download. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6EEE9] text-[#5B2302] font-body selection:bg-accent-pink">
      <Navbar />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Title */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-[#FFA5D5] text-[#5B2302] text-xs font-extrabold uppercase tracking-widest border border-[#5B2302]/20 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5B2302]" />
              Reader Pass
            </span>
            <h1 className="font-block text-3xl sm:text-5xl text-[#5B2302] uppercase leading-tight">
              Create Your Club ID
            </h1>
            <p className="text-xs sm:text-sm text-[#5B2302]/80 leading-relaxed">
              Design your personalized Good Company Reader ID badge. Upload your
              photo, customize your bookish stats, and download a high-res image
              for Instagram or your camera roll.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* ================================================================= */}
            {/* LEFT COLUMN: SHADCN-STYLE CONTROLS FORM */}
            {/* ================================================================= */}
            <div className="lg:col-span-5 bg-[#FFFCF7] border border-[#5B2302]/20 rounded-2xl p-6 sm:p-8 space-y-6">
              {/* Photo Upload Area */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                  Member Photo
                </label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-20 h-24 rounded-lg border border-dashed border-[#5B2302]/30 hover:border-[#5B2302] bg-[#F6EEE9]/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group shrink-0 relative"
                  >
                    {photoUrl ? (
                      <>
                        <img
                          src={photoUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPhotoUrl(null);
                          }}
                          className="absolute top-1 right-1 p-1 rounded-full bg-[#5B2302] text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5 text-[#5B2302]/50 group-hover:scale-110 transition-transform mb-1" />
                        <span className="text-[10px] font-medium text-[#5B2302]/70">
                          Upload
                        </span>
                      </>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-9 px-4 rounded-lg border border-[#5B2302] bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#FFA5D5]" />
                      {photoUrl ? "Change Photo" : "Upload Image"}
                    </button>
                    <p className="text-[11px] text-[#5B2302]/65 leading-tight">
                      JPG, PNG, or WebP. Portrait orientation works best.
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Form Fields - shadcn/ui Inspired Style */}
              <div className="space-y-4 pt-4 border-t border-[#5B2302]/10">
                {/* Preferred Name & Member ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                      Preferred Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Chick"
                      className="flex h-10 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-2 text-sm text-[#5B2302] transition-colors placeholder:text-[#5B2302]/40 focus:outline-none focus:ring-1 focus:ring-[#5B2302] focus:border-[#5B2302]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider">
                        ID Number
                      </label>
                      <button
                        type="button"
                        onClick={handleRerollId}
                        className="text-[10px] font-bold text-[#5B2302]/70 hover:text-[#5B2302] flex items-center gap-1"
                      >
                        <Shuffle className="w-3 h-3" /> Reroll
                      </button>
                    </div>
                    <input
                      type="text"
                      value={memberId}
                      onChange={(e) => setMemberId(e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-2 text-sm text-[#5B2302] font-block tracking-wider transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] focus:border-[#5B2302]"
                    />
                  </div>
                </div>

                {/* Member Since & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                      Member Since
                    </label>
                    <input
                      type="text"
                      value={memberSince}
                      onChange={(e) => setMemberSince(e.target.value)}
                      placeholder="e.g. 2026"
                      className="flex h-10 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-2 text-sm text-[#5B2302] transition-colors placeholder:text-[#5B2302]/40 focus:outline-none focus:ring-1 focus:ring-[#5B2302] focus:border-[#5B2302]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                      Based In
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Abuja, Nigeria"
                      className="flex h-10 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-2 text-sm text-[#5B2302] transition-colors placeholder:text-[#5B2302]/40 focus:outline-none focus:ring-1 focus:ring-[#5B2302] focus:border-[#5B2302]"
                    />
                  </div>
                </div>

                {/* Favorite Genre (Dropdown) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                    Favorite Genre
                  </label>
                  <div className="relative">
                    <select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="flex h-10 w-full appearance-none rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 pr-8 py-2 text-sm text-[#5B2302] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] focus:border-[#5B2302]"
                    >
                      {GENRE_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#5B2302]/60 absolute right-3 top-3 pointer-events-none" />
                  </div>
                  {selectedGenre === "Other / Custom..." && (
                    <input
                      type="text"
                      value={customGenre}
                      onChange={(e) => setCustomGenre(e.target.value)}
                      placeholder="Type custom favorite genre..."
                      className="flex h-9 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-1.5 text-xs text-[#5B2302] mt-1 focus:outline-none focus:ring-1 focus:ring-[#5B2302]"
                    />
                  )}
                </div>

                {/* Favorite Literary Quote (Evergreen) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                    Favorite Literary Quote / Motto
                  </label>
                  <input
                    type="text"
                    value={favoriteQuote}
                    onChange={(e) => setFavoriteQuote(e.target.value)}
                    placeholder="e.g. There is no friend as loyal as a book."
                    className="flex h-10 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-2 text-sm text-[#5B2302] transition-colors placeholder:text-[#5B2302]/40 focus:outline-none focus:ring-1 focus:ring-[#5B2302] focus:border-[#5B2302]"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      "There is no friend as loyal as a book.",
                      "A reader lives a thousand lives.",
                      "She is too fond of books.",
                      "I would be very happy in a library.",
                    ].map((q) => (
                      <button
                        type="button"
                        key={q}
                        onClick={() => setFavoriteQuote(q)}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-[#5B2302]/20 bg-white text-[#5B2302] hover:bg-[#FFA5D5]/30 transition-colors"
                      >
                        {q.slice(0, 24)}...
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reading Superpower (Dropdown) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                    Reading Superpower
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSuperpower}
                      onChange={(e) => setSelectedSuperpower(e.target.value)}
                      className="flex h-10 w-full appearance-none rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 pr-8 py-2 text-sm text-[#5B2302] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] focus:border-[#5B2302]"
                    >
                      {SUPERPOWER_PRESETS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#5B2302]/60 absolute right-3 top-3 pointer-events-none" />
                  </div>
                  {selectedSuperpower === "Other / Custom..." && (
                    <input
                      type="text"
                      value={customSuperpower}
                      onChange={(e) => setCustomSuperpower(e.target.value)}
                      placeholder="Type custom reading superpower..."
                      className="flex h-9 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-1.5 text-xs text-[#5B2302] mt-1 focus:outline-none focus:ring-1 focus:ring-[#5B2302]"
                    />
                  )}
                </div>

                {/* Mood (Dropdown) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                    Bookish Mood
                  </label>
                  <div className="relative">
                    <select
                      value={selectedMood}
                      onChange={(e) => setSelectedMood(e.target.value)}
                      className="flex h-10 w-full appearance-none rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 pr-8 py-2 text-sm text-[#5B2302] transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] focus:border-[#5B2302]"
                    >
                      {MOOD_PRESETS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#5B2302]/60 absolute right-3 top-3 pointer-events-none" />
                  </div>
                  {selectedMood === "Other / Custom..." && (
                    <input
                      type="text"
                      value={customMood}
                      onChange={(e) => setCustomMood(e.target.value)}
                      placeholder="Type custom bookish mood..."
                      className="flex h-9 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-1.5 text-xs text-[#5B2302] mt-1 focus:outline-none focus:ring-1 focus:ring-[#5B2302]"
                    />
                  )}
                </div>
              </div>

              {/* Theme & Aesthetics */}
              <div className="pt-4 border-t border-[#5B2302]/10 space-y-4">
                {exportFormat !== "badge" && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                      Backdrop Aesthetic
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        {
                          id: "blush-gingham",
                          label: "Blush Plaid",
                          color: "#FFA5D5",
                        },
                        {
                          id: "sage-gingham",
                          label: "Sage Plaid",
                          color: "#B5C9B0",
                        },
                        {
                          id: "espresso-plaid",
                          label: "Espresso",
                          color: "#3D2314",
                        },
                        {
                          id: "cream-parchment",
                          label: "Parchment",
                          color: "#F6EEE9",
                        },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setBgTheme(item.id as BgTheme)}
                          className={`h-9 px-2 rounded-lg border text-xs font-medium text-center transition-all flex items-center justify-center gap-1.5 ${
                            bgTheme === item.id
                              ? "border-[#5B2302] bg-[#5B2302] text-[#F6EEE9] font-bold"
                              : "border-[#5B2302]/20 bg-[#FFFDF9] text-[#5B2302] hover:border-[#5B2302]"
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full inline-block border border-black/10 shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="truncate">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Font & Stickers Toggles */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFontMode(
                        fontMode === "script" ? "editorial" : "script",
                      )
                    }
                    className="h-8 px-3 rounded-md border border-[#5B2302]/30 text-xs font-bold text-[#5B2302] hover:bg-[#F6EEE9] transition-colors"
                  >
                    Name Font:{" "}
                    {fontMode === "script" ? "🖋️ Script" : "🔤 Clean Serif"}
                  </button>

                  {exportFormat !== "badge" && (
                    <button
                      type="button"
                      onClick={() => setShowCharms(!showCharms)}
                      className={`h-8 px-3 rounded-md border text-xs font-bold transition-colors ${
                        showCharms
                          ? "bg-[#FFA5D5] text-[#5B2302] border-[#5B2302]"
                          : "bg-[#FFFDF9] text-[#5B2302]/60 border-[#5B2302]/20"
                      }`}
                    >
                      ✨ Stickers {showCharms ? "On" : "Off"}
                    </button>
                  )}
                </div>
              </div>

              {/* Format & Download */}
              <div className="pt-4 border-t border-[#5B2302]/10 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                    Download Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        id: "story",
                        label: "IG Story",
                        icon: Smartphone,
                        desc: "9:16 Mobile",
                      },
                      {
                        id: "square",
                        label: "Square Post",
                        icon: Square,
                        desc: "1:1 Feed",
                      },
                      {
                        id: "badge",
                        label: "Badge Only",
                        icon: CreditCard,
                        desc: "Pass Card",
                      },
                    ].map((fmt) => (
                      <button
                        type="button"
                        key={fmt.id}
                        onClick={() => setExportFormat(fmt.id as ExportFormat)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          exportFormat === fmt.id
                            ? "border-[#5B2302] bg-[#5B2302] text-[#F6EEE9]"
                            : "border-[#5B2302]/20 bg-[#FFFDF9] text-[#5B2302] hover:border-[#5B2302]"
                        }`}
                      >
                        <fmt.icon className="w-4 h-4 mx-auto mb-1 opacity-90" />
                        <div className="text-xs font-extrabold uppercase">
                          {fmt.label}
                        </div>
                        <div className="text-[10px] opacity-75">{fmt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full h-12 rounded-xl bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 transition-all disabled:opacity-50 active:scale-[0.99]"
                >
                  <Download className="w-4 h-4 text-[#FFA5D5]" />
                  {isDownloading
                    ? "Generating High-Res PNG..."
                    : `Download ${exportFormat.toUpperCase()} PNG`}
                </button>
              </div>
            </div>

            {/* ================================================================= */}
            {/* RIGHT COLUMN: LIVE BADGE PREVIEW */}
            {/* ================================================================= */}
            <div className="lg:col-span-7 flex flex-col items-center lg:sticky lg:top-28">
              {/* Renderable Canvas for html-to-image export */}
              <div className="w-full flex justify-center overflow-hidden">
                <div
                  className={
                    exportFormat === "story" || exportFormat === "square"
                      ? "rounded-3xl overflow-hidden shadow-2xl"
                      : "w-full flex justify-center"
                  }
                >
                  <div
                    ref={exportCardRef}
                    className={`relative flex items-center justify-center select-none transition-all duration-300 overflow-hidden ${
                      exportFormat === "story"
                        ? "w-[390px] sm:w-[450px] aspect-[9/16] p-4 sm:p-6"
                        : exportFormat === "square"
                          ? "w-[420px] sm:w-[500px] aspect-square p-4 sm:p-6"
                          : "w-full max-w-[560px] p-4 bg-transparent"
                    }`}
                  >
                    {/* True Inline SVG Pattern Background Layer so Story & Square exports never render a flat color block */}
                    {exportFormat !== "badge" && (
                      <svg
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full pointer-events-none select-none z-0"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          {bgTheme === "blush-gingham" && (
                            <pattern
                              id="id-bg-pattern"
                              width="48"
                              height="48"
                              patternUnits="userSpaceOnUse"
                            >
                              <rect width="48" height="48" fill="#FFF4F8" />
                              <rect
                                x="0"
                                y="0"
                                width="48"
                                height="24"
                                fill="#FFA5D5"
                                fillOpacity="0.42"
                              />
                              <rect
                                x="0"
                                y="0"
                                width="24"
                                height="48"
                                fill="#FFA5D5"
                                fillOpacity="0.42"
                              />
                            </pattern>
                          )}
                          {bgTheme === "sage-gingham" && (
                            <pattern
                              id="id-bg-pattern"
                              width="48"
                              height="48"
                              patternUnits="userSpaceOnUse"
                            >
                              <rect width="48" height="48" fill="#F4F7F3" />
                              <rect
                                x="0"
                                y="0"
                                width="48"
                                height="24"
                                fill="#A9B5A0"
                                fillOpacity="0.45"
                              />
                              <rect
                                x="0"
                                y="0"
                                width="24"
                                height="48"
                                fill="#A9B5A0"
                                fillOpacity="0.45"
                              />
                            </pattern>
                          )}
                          {bgTheme === "espresso-plaid" && (
                            <pattern
                              id="id-bg-pattern"
                              width="48"
                              height="48"
                              patternUnits="userSpaceOnUse"
                            >
                              <rect width="48" height="48" fill="#3D1600" />
                              <rect
                                x="0"
                                y="0"
                                width="48"
                                height="24"
                                fill="#5B2302"
                                fillOpacity="0.65"
                              />
                              <rect
                                x="0"
                                y="0"
                                width="24"
                                height="48"
                                fill="#5B2302"
                                fillOpacity="0.65"
                              />
                              <line
                                x1="0"
                                y1="12"
                                x2="48"
                                y2="12"
                                stroke="#FFA5D5"
                                strokeOpacity="0.2"
                                strokeWidth="1.5"
                              />
                              <line
                                x1="12"
                                y1="0"
                                x2="12"
                                y2="48"
                                stroke="#FFA5D5"
                                strokeOpacity="0.2"
                                strokeWidth="1.5"
                              />
                            </pattern>
                          )}
                          {bgTheme === "cream-parchment" && (
                            <pattern
                              id="id-bg-pattern"
                              width="48"
                              height="48"
                              patternUnits="userSpaceOnUse"
                            >
                              <rect width="48" height="48" fill="#F6EEE9" />
                              <rect
                                x="0"
                                y="0"
                                width="48"
                                height="24"
                                fill="#EADBCF"
                                fillOpacity="0.55"
                              />
                              <rect
                                x="0"
                                y="0"
                                width="24"
                                height="48"
                                fill="#EADBCF"
                                fillOpacity="0.55"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="1.2"
                                fill="#5B2302"
                                fillOpacity="0.2"
                              />
                              <circle
                                cx="36"
                                cy="36"
                                r="1.2"
                                fill="#5B2302"
                                fillOpacity="0.2"
                              />
                            </pattern>
                          )}
                        </defs>
                        <rect
                          width="100%"
                          height="100%"
                          fill="url(#id-bg-pattern)"
                        />
                      </svg>
                    )}

                    {/* Decorative Charms for Story & Square */}
                    {exportFormat !== "badge" && showCharms && (
                      <>
                        {/* Top Right Flower */}
                        <div className="absolute top-6 right-6 z-10 text-3xl sm:text-4xl pointer-events-none drop-shadow-md select-none transform rotate-12">
                          🌸
                        </div>

                        {/* Acrylic Pink Butterfly */}
                        <div className="absolute top-10 left-6 z-10 text-2xl sm:text-3xl pointer-events-none drop-shadow-md select-none transform -rotate-12">
                          🦋
                        </div>

                        {/* Glitter Sparkle Stars */}
                        <div className="absolute top-24 right-10 z-10 text-xl sm:text-2xl text-amber-400 pointer-events-none drop-shadow-sm select-none">
                          ⭐
                        </div>
                        <div className="absolute bottom-12 left-8 z-10 text-xl sm:text-2xl text-amber-400 pointer-events-none drop-shadow-sm select-none">
                          ✨
                        </div>
                        <div className="absolute bottom-8 right-12 z-10 text-2xl sm:text-3xl pointer-events-none drop-shadow-md select-none">
                          💖
                        </div>

                        {/* Letter Beads at bottom: "R E A D E R" */}
                        <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 pointer-events-none drop-shadow-md">
                          {["R", "E", "A", "D", "E", "R"].map((letter, i) => (
                            <div
                              key={i}
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-[#5B2302] border border-stone-300 flex items-center justify-center font-bold text-[10px] sm:text-xs shadow-inner uppercase"
                            >
                              {letter}
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* ========================================================= */}
                    {/* REALISTIC VINYL ID BADGE HOLDER (LANDSCAPE CREDENTIAL) */}
                    {/* ========================================================= */}
                    <div
                      className={`relative z-10 w-full ${exportFormat === "story" ? "max-w-[375px] sm:max-w-[420px]" : exportFormat === "square" ? "max-w-[430px] sm:max-w-[470px]" : "max-w-[510px] sm:max-w-[550px]"} flex flex-col items-center`}
                    >
                      {/* Outer Clear Vinyl Plastic Badge Sleeve - Crystal-clear (no opaque block of color) */}
                      <div
                        className="w-full bg-white/15 rounded-2xl p-3.5 sm:p-4 border-2 border-white/70 relative"
                        style={{
                          boxShadow: `
                            0 20px 40px -10px rgba(91, 35, 2, 0.28),
                            0 8px 18px -4px rgba(0, 0, 0, 0.12),
                            inset 0 1px 2px rgba(255, 255, 255, 0.85),
                            inset 0 -1px 2px rgba(0, 0, 0, 0.04)
                          `,
                        }}
                      >
                        {/* Top Punched Cutout Slot Hole for Lanyard */}
                        <div className="w-full flex items-center justify-center pt-0.5 pb-2.5">
                          <div className="w-16 h-2.5 sm:h-3 rounded-full bg-stone-900/35 border border-stone-400/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.45)]" />
                        </div>

                        {/* ======================================================= */}
                        {/* INNER PAPER ID CARD INSERT - HARMONIOUS INNER RADIUS */}
                        {/* ======================================================= */}
                        <div className="bg-[#FFFDF9] rounded-xl p-4 sm:p-5 border border-[#5B2302]/20 shadow-inner text-[#5B2302] space-y-3 relative overflow-hidden">
                          {/* Background subtle watermark seal */}
                          <div className="absolute right-4 top-10 pointer-events-none opacity-[0.03] select-none text-[140px] font-block leading-none">
                            GC
                          </div>

                          {/* Card Header: Prominent Brand Logo & Official Pass No */}
                          <div className="flex items-center justify-between border-b-2 border-[#5B2302] pb-2.5">
                            <div className="flex items-center gap-3">
                              <img
                                src="/images/logo-web.png"
                                alt="Good Company"
                                className="h-10 sm:h-11 w-auto object-contain"
                              />
                            </div>

                            <div className="flex items-center gap-2 whitespace-nowrap">
                              <span className="text-[8.5px] sm:text-[9px] font-black uppercase tracking-wider text-[#5B2302]/70 font-body">
                                PASS NO.
                              </span>
                              <span
                                className="font-block text-sm sm:text-base tracking-wider text-[#5B2302] bg-[#F6EEE9] px-2.5 py-0.5 rounded-md border border-[#5B2302]/20 shadow-inner"
                                style={{
                                  fontFamily:
                                    "'Berthold Block', var(--font-block), sans-serif",
                                }}
                              >
                                {memberId}
                              </span>
                            </div>
                          </div>

                          {/* Card Mid Section: Photo & Barcode on Left, Generous Member Details on Right */}
                          <div className="flex flex-row items-center gap-4 sm:gap-6">
                            {/* Left Column: Photo Frame & Barcode */}
                            <div className="w-24 sm:w-28 shrink-0 flex flex-col items-center space-y-2">
                              {/* Member Photo Frame */}
                              <div className="w-full aspect-[3/4] rounded-lg border-2 border-[#5B2302] bg-[#F6EEE9] overflow-hidden shadow-sm relative">
                                {photoUrl ? (
                                  <img
                                    src={photoUrl}
                                    alt="Member"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-2 bg-[#F6EEE9] text-[#5B2302]">
                                    <Camera className="w-5 h-5 text-[#5B2302]/40 mb-1" />
                                    <span className="text-[8px] uppercase font-bold text-[#5B2302]/60 whitespace-nowrap">
                                      Member Photo
                                    </span>
                                  </div>
                                )}
                                {/* Corner Tick Marks */}
                                <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t-2 border-l-2 border-[#5B2302]" />
                                <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t-2 border-r-2 border-[#5B2302]" />
                                <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b-2 border-l-2 border-[#5B2302]" />
                                <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b-2 border-r-2 border-[#5B2302]" />
                              </div>

                              {/* Authentic Barcode Graphic */}
                              <div className="w-full flex flex-col items-center pt-0.5">
                                <div className="h-4 sm:h-4.5 w-full flex justify-between items-center px-0.5 overflow-hidden">
                                  {[
                                    2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 3, 1, 2,
                                    4, 1, 2, 1, 3, 2, 1, 2, 3,
                                  ].map((w, i) => (
                                    <span
                                      key={i}
                                      className="bg-[#5B2302] h-full inline-block"
                                      style={{ width: `${w}px` }}
                                    />
                                  ))}
                                </div>
                                <span className="font-body text-[7px] text-[#5B2302]/70 font-black tracking-widest uppercase mt-0.5 whitespace-nowrap">
                                  goodcompany.club
                                </span>
                              </div>
                            </div>

                            {/* Right Column: Member Stats with Ample Horizontal Space (Zero Text Chopping) */}
                            <div className="flex-1 space-y-2 text-left min-w-0">
                              {/* Member Name */}
                              <div className="border-b border-[#5B2302]/15 pb-1">
                                <span className="text-[7.5px] font-extrabold uppercase tracking-widest text-[#5B2302]/60 block whitespace-nowrap">
                                  MEMBER NAME
                                </span>
                                <span
                                  className={`font-bold text-[#5B2302] block whitespace-nowrap ${
                                    fontMode === "script"
                                      ? "font-script text-xl sm:text-2xl leading-none text-[#5B2302]"
                                      : "font-block text-base sm:text-lg uppercase tracking-tight"
                                  }`}
                                  style={{
                                    fontFamily:
                                      fontMode === "script"
                                        ? "'Good Time Script', var(--font-script), cursive"
                                        : "'Berthold Block', var(--font-block), sans-serif",
                                  }}
                                >
                                  {name || "Good Company Reader"}
                                </span>
                              </div>

                              {/* Member Since & Based In (Spacious Auto-Sizing Row) */}
                              <div className="flex items-center gap-3 sm:gap-5 border-b border-[#5B2302]/15 pb-1 text-xs">
                                <div className="shrink-0">
                                  <span className="text-[7.5px] font-extrabold uppercase tracking-widest text-[#5B2302]/60 block whitespace-nowrap">
                                    MEMBER SINCE
                                  </span>
                                  <span className="font-bold text-xs sm:text-sm text-[#5B2302] block whitespace-nowrap">
                                    {memberSince || "2026"}
                                  </span>
                                </div>
                                <div className="border-l border-[#5B2302]/15 pl-3 sm:pl-5 flex-1 min-w-0">
                                  <span className="text-[7.5px] font-extrabold uppercase tracking-widest text-[#5B2302]/60 block whitespace-nowrap">
                                    BASED IN
                                  </span>
                                  <span className="font-bold text-xs sm:text-sm text-[#5B2302] block whitespace-nowrap">
                                    {location || "Abuja, Nigeria"}
                                  </span>
                                </div>
                              </div>

                              {/* Favorite Genre (Full single-line text) */}
                              <div className="border-b border-[#5B2302]/15 pb-1">
                                <span className="text-[7.5px] font-extrabold uppercase tracking-widest text-[#5B2302]/60 block whitespace-nowrap">
                                  FAVORITE GENRE
                                </span>
                                <span className="font-bold text-xs sm:text-sm text-[#5B2302] block whitespace-nowrap">
                                  {displayGenre}
                                </span>
                              </div>

                              {/* Reading Superpower (Full single-line text) */}
                              <div>
                                <span className="text-[7.5px] font-extrabold uppercase tracking-widest text-[#5B2302]/60 block whitespace-nowrap">
                                  READING SUPERPOWER
                                </span>
                                <span className="font-bold text-xs sm:text-sm text-[#5B2302] block whitespace-nowrap">
                                  {displaySuperpower}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Card Lower Section: Dedicated Favorite Quote Block (NO dividing line above it) */}
                          <div className="pt-1">
                            <div className="bg-[#F6EEE9]/75 rounded-lg p-2.5 sm:p-3 border border-[#5B2302]/15 text-center relative">
                              <span className="text-[7.5px] sm:text-[8px] font-black uppercase tracking-widest text-[#5B2302]/60 block mb-0.5 font-body">
                                FAVORITE LITERARY QUOTE
                              </span>
                              <p className="font-script text-base sm:text-lg text-[#5B2302] leading-snug px-2">
                                “
                                {favoriteQuote ||
                                  "There is no friend as loyal as a book."}
                                ”
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Generated Image Modal (Instant Save & Fallback) */}
      {previewModalImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewModalImage(null)}
          className="fixed inset-0 z-50 bg-[#3D1600]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFFCF7] border border-[#5B2302]/20 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto no-scrollbar relative p-4 sm:p-6 space-y-4 font-body animate-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-[#5B2302]/15 pb-3">
              <div>
                <h3 className="font-block text-xl text-[#5B2302] uppercase tracking-tight">
                  Your ID Badge is Ready
                </h3>
                <p className="text-xs sm:text-sm text-[#5B2302]/70">
                  PNG file sent directly to your Downloads folder.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalImage(null)}
                className="p-1.5 rounded-full border border-[#5B2302]/20 text-[#5B2302] hover:bg-[#5B2302] hover:text-[#F6EEE9] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Displayed PNG image */}
            <div className="flex justify-center p-2 bg-[#F6EEE9] rounded-xl border border-[#5B2302]/15 overflow-hidden">
              <img
                src={previewModalImage}
                alt="Good Company ID Badge"
                className="max-h-[50vh] w-auto object-contain rounded-lg shadow-sm"
              />
            </div>

            <p className="text-xs text-[#5B2302]/75 text-center leading-relaxed">
              If on iOS or Safari, you can also press &amp; hold (or
              right-click) the image above to save directly to Photos.
            </p>

            <div className="flex gap-2 pt-1">
              <a
                href={previewModalImage}
                download={`good-company-id-${(name || "member")
                  .trim()
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")}-${exportFormat}.png`}
                className="flex-1 py-3 sm:py-3 rounded-full bg-[#5B2302] text-[#F6EEE9] text-xs sm:text-sm font-extrabold uppercase text-center hover:bg-[#3D1600] transition-colors shadow-sm"
              >
                Download PNG Again
              </a>
              <button
                type="button"
                onClick={() => setPreviewModalImage(null)}
                className="px-5 py-3 rounded-full border border-[#5B2302]/30 text-[#5B2302] text-xs sm:text-sm font-bold uppercase hover:bg-white transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ToastContainer />
    </div>
  );
}
