"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/lib/store/app-context";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import { DemoPersonaBanner } from "@/components/navigation/DemoPersonaBanner";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { ReadingGuideCard } from "@/components/books/ReadingGuideCard";
import { ArrowLeft } from "lucide-react";

export function BookDetailClient({ bookId }: { bookId: string }) {
  const { books, currentBook } = useApp();

  const book = books.find((b) => b.id === bookId) || currentBook;

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

      <main className="flex-1 py-6 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
          {/* Back link */}
          <Link
            href="/#shelves"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5B2302]/70 hover:text-[#5B2302] transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Shelves
          </Link>

          {/* Reading Guide Card */}
          <ReadingGuideCard book={book} variant="page" />
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
