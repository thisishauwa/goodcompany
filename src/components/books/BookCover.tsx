'use client';

import React, { useState } from 'react';
import { Book } from '@/types';

interface BookCoverProps {
  book: Book;
  size?: 'sm' | 'md' | 'lg';
  showBookmark?: boolean;
  showBadge?: boolean;
  className?: string;
}

export function BookCover({ book, size = 'md', showBookmark = false, showBadge = false, className = '' }: BookCoverProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-24 h-36 text-[10px]',
    md: 'w-44 h-64 text-xs',
    lg: 'w-60 h-88 text-sm',
  };

  const paletteBackgrounds: Record<string, string> = {
    '#5B2302': 'bg-[#5B2302] text-white',
    '#4E1427': 'bg-[#5B2302] text-white',
    '#C9795F': 'bg-[#C9795F] text-white',
    '#F5D978': 'bg-[#F5D978] text-[#5B2302]',
    '#DFA6A0': 'bg-[#DFA6A0] text-[#5B2302]',
    '#A9B5A0': 'bg-[#A9B5A0] text-[#5B2302]',
    '#FFF9F0': 'bg-[#FFFCF7] text-[#5B2302]',
    '#FFA5D5': 'bg-[#FFA5D5] text-[#5B2302]',
  };

  const bgClass = paletteBackgrounds[book.cover_color] || 'bg-[#5B2302] text-white';
  const hasRealImage = !!book.cover_url && !imageError;

  return (
    <div
      className={`apple-book relative select-none flex flex-col justify-between rounded-[4px_7px_7px_4px] overflow-hidden ${className ? className : sizeClasses[size]} ${bgClass}`}
    >
      {/* Real Cover Image if present */}
      {hasRealImage ? (
        <img
          src={book.cover_url}
          alt={`Cover of ${book.title}`}
          onError={() => setImageError(true)}
          className="absolute inset-0 w-full h-full object-cover z-0 rounded-[4px_7px_7px_4px]"
        />
      ) : (
        /* Typographic Cover Fallback */
        <div className="p-4 flex flex-col justify-between h-full z-1">
          <div className="pl-1">
            <span className="text-[10px] uppercase font-body tracking-widest opacity-80 font-bold line-clamp-1">
              {book.genre}
            </span>
          </div>

          <div className="my-auto pl-1 text-center">
            <h4 className="font-block font-bold text-base leading-tight tracking-tight">
              {book.title}
            </h4>
            <p className="font-body text-xs opacity-90 font-medium mt-2">
              {book.author}
            </p>
          </div>

          <div className="pl-1 flex items-center justify-between text-[9px] opacity-75">
            <span className="font-bold">GOOD COMPANY</span>
            {showBadge && book.is_current && (
              <span className="font-bold uppercase text-[8px] bg-white/20 px-1.5 py-0.5 rounded">
                Current
              </span>
            )}
          </div>
        </div>
      )}

      {/* Refined Silk Grosgrain Bookmark Lapel (Soft Champagne/Ivory with Rose Stitching) */}
      {showBookmark && (
        <div
          className="absolute top-0 right-3.5 z-20 pointer-events-none drop-shadow-[0_2px_4px_rgba(91,35,2,0.25)] flex flex-col items-center"
          title="Good Company Silk Lapel"
        >
          {/* Main ribbon body: warm champagne silk with delicate rose accent */}
          <div className="w-4 h-9 bg-gradient-to-b from-[#FFFDF9] via-[#FAF1F4] to-[#F5E4EB] border-x border-[#5B2302]/25 relative flex items-center justify-center">
            {/* Center blush accent thread */}
            <div className="w-1 h-full bg-[#FFA5D5]/50" />
            {/* Fine dashed edge stitching */}
            <div className="absolute inset-y-0 left-[1px] w-[1px] border-l border-dashed border-[#5B2302]/20" />
            <div className="absolute inset-y-0 right-[1px] w-[1px] border-r border-dashed border-[#5B2302]/20" />
          </div>
          {/* Chevron notched tail */}
          <div
            className="w-4 h-2 bg-[#F5E4EB] border-b border-x border-[#5B2302]/25 -mt-[1px]"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 60%, 0 100%)' }}
          />
        </div>
      )}

      {/* Clean In-Session badge with balanced contrast */}
      {showBadge && hasRealImage && book.is_current && (
        <div className="absolute bottom-2 right-2 z-20">
          <span className="font-body font-bold uppercase text-[9px] bg-[#5B2302] text-[#F6EEE9] px-2 py-0.5 rounded border border-[#FFA5D5]/30">
            Current Read
          </span>
        </div>
      )}

      {/* Apple Books Spine Crease & Hinge Highlight/Shadow Overlay */}
      <div className="apple-book-hinge" />

      {/* Apple Books Paper Edge Trim Depth */}
      <div className="apple-book-edges" />

      {/* Fore-Edge Page Leaves Stack on Right */}
      <div className="real-book-fore-edge" />
    </div>
  );
}
