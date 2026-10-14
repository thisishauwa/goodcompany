'use client';

import React from 'react';
import Link from 'next/link';
import { Book } from '@/types';
import { BookCover } from './BookCover';
import { Calendar, Sparkles, BookOpen } from 'lucide-react';

interface BookCardProps {
  book: Book;
  compact?: boolean;
}

export function BookCard({ book, compact = false }: BookCardProps) {
  const statusLabels: Record<string, { label: string; bg: string; text: string }> = {
    currently_reading: { label: 'In Session', bg: 'bg-[#FFA5D5]', text: 'text-[#5B2302]' },
    completed: { label: 'Past Read', bg: 'bg-[#F6EEE9]', text: 'text-[#5B2302]' },
    upcoming: { label: 'Upcoming Read', bg: 'bg-[#F5D978]', text: 'text-[#5B2302]' },
    archived: { label: 'Library Archive', bg: 'bg-[#EAD7CB]', text: 'text-[#5B2302]' },
  };

  const statusInfo = statusLabels[book.status] || statusLabels.completed;

  return (
    <div className="group paper-card rounded-3xl p-5 sm:p-6 flex flex-col justify-between h-full border-2 border-[#5B2302]/20 hover:border-[#5B2302] transition-colors relative overflow-hidden bg-[#FFFDF9]">
      <div className="space-y-4">
        
        {/* Header: Status Pill & Genre */}
        <div className="flex items-center justify-between gap-2 border-b border-[#5B2302]/10 pb-3">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5B2302]/70 font-body truncate">
            {book.genre}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border border-[#5B2302]/20 font-body shrink-0 ${statusInfo.bg} ${statusInfo.text}`}
          >
            {statusInfo.label}
          </span>
        </div>

        {/* Book Cover Display - Centered and elegant */}
        <div className="flex justify-center py-1">
          <Link href={`/books/${book.id}`} className="focus:outline-none transition-transform duration-200 group-hover:scale-102">
            <BookCover book={book} size={compact ? 'sm' : 'md'} showBookmark={book.is_current} />
          </Link>
        </div>

        {/* Title & Author */}
        <div className="text-center space-y-1">
          <Link href={`/books/${book.id}`} className="focus:outline-none">
            <h3 className="font-block uppercase text-base sm:text-lg text-[#5B2302] hover:text-[#3D1600] transition-colors leading-tight line-clamp-2">
              {book.title}
            </h3>
          </Link>
          <p className="font-script text-xl text-[#5B2302]/90">
            by {book.author}
          </p>
        </div>

        {/* CURATOR'S TAKE (Unambiguous, editorial design) */}
        {book.curator_note && (
          <div className="p-3.5 rounded-2xl bg-[#FFFCEB] border border-[#5B2302]/20 space-y-1.5 font-body">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#5B2302]">
              <Sparkles className="w-3 h-3 text-[#5B2302]" />
              <span>Curator’s Take</span>
            </div>
            <p className="text-xs text-[#5B2302]/90 leading-relaxed font-normal">
              {book.curator_note}
            </p>
            <div className="text-[9px] uppercase font-bold tracking-wider text-[#5B2302]/60 pt-0.5 border-t border-[#5B2302]/10">
              Good Company Selection
            </div>
          </div>
        )}

      </div>

      {/* Footer / Schedule & Action */}
      <div className="pt-4 mt-4 border-t border-[#5B2302]/15 flex items-center justify-between text-xs text-[#5B2302] font-body">
        <span className="flex items-center gap-1.5 font-bold text-[11px] text-[#5B2302]/80">
          <Calendar className="w-3.5 h-3.5 text-[#5B2302]" />
          {book.discussion_date
            ? new Date(book.discussion_date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
              })
            : 'Catalog'}
        </span>

        <Link
          href={`/books/${book.id}`}
          className="clean-btn px-3.5 py-1.5 rounded-full bg-[#5B2302] font-extrabold text-[#F6EEE9] hover:bg-[#3D1600] transition-colors text-[11px] uppercase tracking-wider font-body inline-flex items-center gap-1"
        >
          <BookOpen className="w-3 h-3 text-[#FFA5D5]" />
          Guide &rarr;
        </Link>
      </div>
    </div>
  );
}
