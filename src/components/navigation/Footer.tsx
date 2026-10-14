import React from "react";
import Link from "next/link";
import { LittleTeacup, StarFlair } from "@/components/ui/Illustrations";

export function Footer() {
  return (
    <footer className="relative mt-auto font-body select-none">
      {/* Organic Layered Wavy Top Edge - Seamless transition from #F6EEE9 page into #3D1600 footer */}
      <div className="w-full overflow-hidden leading-none pointer-events-none -mb-[1px]">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 sm:h-16 md:h-20 block"
          preserveAspectRatio="none"
        >
          {/* Subtle blush accent crest */}
          <path
            d="M0,32 C280,75 520,0 720,38 C920,76 1160,5 1440,32 L1440,120 L0,120 Z"
            fill="#FFA5D5"
            fillOpacity="0.35"
          />
          {/* Warm club maroon wave layer */}
          <path
            d="M0,45 C260,10 500,80 720,48 C940,16 1180,82 1440,45 L1440,120 L0,120 Z"
            fill="#5B2302"
            fillOpacity="0.75"
          />
          {/* Primary deep burgundy wave crest */}
          <path
            d="M0,58 C320,105 540,25 720,62 C900,99 1120,20 1440,58 L1440,120 L0,120 Z"
            fill="#3D1600"
          />
        </svg>
      </div>

      {/* Main Footer Body */}
      <div className="bg-[#3D1600] text-[#F6EEE9] pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-14 border-b border-[#5B2302]/40">
            {/* Brand info */}
            <div className="md:col-span-2 space-y-4">
              <Link
                href="/"
                className="inline-block hover:opacity-90 transition-opacity"
              >
                <img
                  src="/images/light-logo.png"
                  alt="Good Company Book Club"
                  className="h-16 sm:h-20 w-auto object-contain"
                />
              </Link>
              <p className="text-[#FFA5D5] font-script text-3xl sm:text-4xl">
                Good books. Better conversations.
              </p>
              <p className="text-[#F6EEE9]/90 text-sm sm:text-base max-w-lg leading-relaxed font-body">
                A private, thoughtful book club for passionate readers. Monthly
                reads, honest debates, good tea, and warm community.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://instagram.com/readwithgoodcompany"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#5B2302] text-[#FFA5D5] text-sm font-bold border border-[#FFA5D5]/30 hover:border-[#FFA5D5] transition-colors"
                >
                  <StarFlair className="w-4 h-4 text-[#FFA5D5]" />
                  @readwithgoodcompany
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div className="space-y-4">
              <h4 className="font-block text-base sm:text-lg uppercase tracking-wider text-[#FFA5D5]">
                Navigation
              </h4>
              <ul className="space-y-3 text-sm sm:text-base text-[#F6EEE9]/90 font-body font-medium">
                <li>
                  <Link
                    href="/#current-read"
                    className="hover:text-white transition-colors"
                  >
                    What We’re Reading
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#shelf"
                    className="hover:text-white transition-colors"
                  >
                    Our Shelf
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guidelines"
                    className="hover:text-white transition-colors"
                  >
                    Community Guidelines
                  </Link>
                </li>
              </ul>
            </div>

            {/* Join us */}
            <div className="space-y-4">
              <h4 className="font-block text-base sm:text-lg uppercase tracking-wider text-[#FFA5D5]">
                Join Us
              </h4>
              <ul className="space-y-3 text-sm sm:text-base text-[#F6EEE9]/90 font-body font-medium">
                <li>
                  <Link
                    href="/apply"
                    className="hover:text-white transition-colors font-bold text-[#FFA5D5]"
                  >
                    Apply to Join
                  </Link>
                </li>
                <li>
                  <a
                    href="https://instagram.com/readwithgoodcompany"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Follow on Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom copyright & note */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-sm text-[#F6EEE9]/75 gap-4">
            <p>© 2026 Good Company. Good books. Better conversations.</p>
            <p className="font-script text-xl sm:text-2xl text-[#FFA5D5]">
              readwithgoodcompany.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
