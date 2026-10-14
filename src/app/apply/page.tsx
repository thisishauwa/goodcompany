"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { StarFlair } from "@/components/ui/Illustrations";
import { AlertCircle, ArrowLeft, MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "2348085150662";

const GENRE_OPTIONS = [
  "Romance",
  "Literary Fiction",
  "Contemporary Fiction",
  "Fantasy & Sci-Fi",
  "Memoir & Biography",
  "Historical Fiction",
  "Thrillers & Mystery",
  "Non-Fiction & Essays",
  "African Literature",
  "Poetry",
];

export default function ApplyPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [favouriteBook, setFavouriteBook] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [whatTheyWant, setWhatTheyWant] = useState("");
  const [howTheyHeard, setHowTheyHeard] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (
      !fullName.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !favouriteBook.trim()
    ) {
      setErrorMessage(
        "Please fill in your name, email, phone number, and the book you'd defend with your life.",
      );
      return;
    }

    // Build a single formatted message
    const lines = [
      `📖 *New Good Company Application*`,
      ``,
      `*Name:* ${fullName.trim()}`,
      `*Email:* ${email.trim()}`,
      `*Phone:* ${phone.trim()}`,
      city.trim() ? `*City:* ${city.trim()}` : null,
      ``,
      `*The book I'd defend with my life:*`,
      favouriteBook.trim(),
      ``,
      selectedGenres.length > 0
        ? `*Genres I love:* ${selectedGenres.join(", ")}`
        : null,
      whatTheyWant.trim()
        ? `*What I'm looking for:* ${whatTheyWant.trim()}`
        : null,
      howTheyHeard.trim()
        ? `*How I heard about Good Company:* ${howTheyHeard.trim()}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    const encodedMessage = encodeURIComponent(lines);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6EEE9] text-[#5B2302]">
      <Navbar />

      <main className="flex-1 py-12 md:py-20 font-body">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B2302]/70 hover:text-[#5B2302] mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Good Company
          </Link>

          {/* Application Form */}
          <div className="rounded-2xl p-6 sm:p-10 border border-[#5B2302]/20 bg-[#FFFCF7] space-y-8">
            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-[#FFA5D5] text-[#5B2302] text-xs font-extrabold uppercase tracking-widest border border-[#5B2302]/20 inline-block">
                Membership Application
              </span>
              <h1 className="font-block text-3xl sm:text-4xl text-[#5B2302] uppercase leading-tight pt-1">
                Join Good Company
              </h1>
              <p className="text-xs sm:text-sm text-[#5B2302]/80 leading-relaxed max-w-lg">
                Tell us a little about your reading life so our curators can
                review your application.
              </p>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-100 border border-red-300 text-xs text-red-900 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Preferred name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="full-name-input"
                    className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block"
                  >
                    Preferred Name *
                  </label>
                  <input
                    id="full-name-input"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Chick"
                    className="flex h-10 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-2 text-sm text-[#5B2302] placeholder:text-[#5B2302]/40 transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] focus:border-[#5B2302]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="email-input"
                    className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block"
                  >
                    Email Address *
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. chick@gmail.com"
                    className="flex h-10 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-2 text-sm text-[#5B2302] placeholder:text-[#5B2302]/40 transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] focus:border-[#5B2302]"
                  />
                </div>
              </div>

              {/* Phone & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="phone-input"
                    className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block"
                  >
                    Phone Number{" "}
                    <span className="text-[#5B2302] font-black">*</span>
                  </label>
                  <input
                    id="phone-input"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="flex h-10 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-2 text-sm text-[#5B2302] placeholder:text-[#5B2302]/40 transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] focus:border-[#5B2302]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="city-input"
                    className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block"
                  >
                    City{" "}
                    <span className="opacity-60 font-normal lowercase">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="city-input"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Abuja, Lagos, London"
                    className="flex h-10 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-2 text-sm text-[#5B2302] placeholder:text-[#5B2302]/40 transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] focus:border-[#5B2302]"
                  />
                </div>
              </div>

              {/* Favourite Book */}
              <div className="space-y-1.5">
                <label
                  htmlFor="fav-book-input"
                  className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block"
                >
                  The Book You&apos;d Defend With Your Life *
                </label>
                <input
                  id="fav-book-input"
                  type="text"
                  required
                  value={favouriteBook}
                  onChange={(e) => setFavouriteBook(e.target.value)}
                  placeholder="e.g. Tomorrow, and Tomorrow, and Tomorrow by Gabrielle Zevin"
                  className="flex h-10 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-2 text-sm text-[#5B2302] placeholder:text-[#5B2302]/40 transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] focus:border-[#5B2302]"
                />
              </div>

              {/* Preferred Genres */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block">
                  Genres You Love
                </label>
                <div className="flex flex-wrap gap-2">
                  {GENRE_OPTIONS.map((genre) => {
                    const selected = selectedGenres.includes(genre);
                    return (
                      <button
                        type="button"
                        key={genre}
                        onClick={() => toggleGenre(genre)}
                        className={`h-8 px-3 rounded-lg text-xs font-semibold transition-all inline-flex items-center justify-center border ${
                          selected
                            ? "bg-[#5B2302] text-[#F6EEE9] border-[#5B2302]"
                            : "bg-[#FFFDF9] text-[#5B2302] border-[#5B2302]/20 hover:border-[#5B2302]"
                        }`}
                      >
                        {genre}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* What they want from club */}
              <div className="space-y-1.5">
                <label
                  htmlFor="what-they-want-input"
                  className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block"
                >
                  What are you looking for in a reading group?
                </label>
                <textarea
                  id="what-they-want-input"
                  rows={3}
                  value={whatTheyWant}
                  onChange={(e) => setWhatTheyWant(e.target.value)}
                  placeholder="Tell us what you enjoy most about talking about books..."
                  className="flex min-h-[96px] w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] p-3 text-sm text-[#5B2302] placeholder:text-[#5B2302]/40 transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] focus:border-[#5B2302] resize-none"
                />
              </div>

              {/* How they heard */}
              <div className="space-y-1.5">
                <label
                  htmlFor="how-heard-input"
                  className="text-xs font-semibold text-[#5B2302] uppercase tracking-wider block"
                >
                  How did you hear about Good Company?{" "}
                  <span className="opacity-60 font-normal lowercase">
                    (optional)
                  </span>
                </label>
                <input
                  id="how-heard-input"
                  type="text"
                  value={howTheyHeard}
                  onChange={(e) => setHowTheyHeard(e.target.value)}
                  placeholder="e.g. Instagram, a friend, Twitter / X..."
                  className="flex h-10 w-full rounded-lg border border-[#5B2302]/20 bg-[#FFFDF9] px-3 py-2 text-sm text-[#5B2302] placeholder:text-[#5B2302]/40 transition-colors focus:outline-none focus:ring-1 focus:ring-[#5B2302] focus:border-[#5B2302]"
                />
              </div>

              {/* Submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto h-11 px-8 rounded-xl bg-[#5B2302] text-[#F6EEE9] hover:bg-[#3D1600] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <StarFlair className="w-4 h-4 text-[#FFA5D5]" />
                  Send Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
