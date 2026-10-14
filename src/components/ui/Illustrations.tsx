import React from 'react';

export function BookStackIllustration({ className = 'w-48 h-48' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Bottom book (Deep Maroon) */}
      <rect x="25" y="142" width="150" height="26" rx="4" fill="#4E1427" stroke="#25211D" strokeWidth="2.5" />
      <path d="M29 146H45V164H29" stroke="#C2D9E8" strokeWidth="2" strokeDasharray="2 3" opacity="0.8" />
      <line x1="45" y1="155" x2="168" y2="155" stroke="#C2D9E8" strokeWidth="1.5" strokeOpacity="0.8" />

      {/* Middle book (Muted Sage) */}
      <g transform="rotate(-3 95 125)">
        <rect x="35" y="112" width="134" height="26" rx="4" fill="#A9B5A0" stroke="#25211D" strokeWidth="2.5" />
        <line x1="42" y1="125" x2="162" y2="125" stroke="#25211D" strokeWidth="1.5" strokeOpacity="0.4" />
        <rect x="42" y="116" width="14" height="18" rx="2" fill="#FFFCF7" stroke="#25211D" strokeWidth="1.5" />
      </g>

      {/* Top book (Butter yellow) */}
      <g transform="rotate(4 95 90)">
        <rect x="44" y="82" width="120" height="24" rx="4" fill="#F5D978" stroke="#25211D" strokeWidth="2.5" />
        {/* Bookmark ribbon hanging down (Powder blue) */}
        <path
          d="M135 84V135L144 126L153 135V84"
          fill="#C2D9E8"
          stroke="#25211D"
          strokeWidth="2"
        />
        <circle cx="58" cy="94" r="3" fill="#25211D" opacity="0.6" />
      </g>

      {/* Teacup perched delicately on top */}
      <g transform="translate(74, 40)">
        {/* Saucer */}
        <ellipse cx="28" cy="38" rx="22" ry="4" fill="#FFFCF7" stroke="#25211D" strokeWidth="2" />
        {/* Cup */}
        <path
          d="M14 18C14 32 20 36 28 36C36 36 42 32 42 18H14Z"
          fill="#FFFCF7"
          stroke="#25211D"
          strokeWidth="2"
        />
        {/* Handle */}
        <path
          d="M42 21C47 21 49 25 49 28C49 32 45 33 41 33"
          stroke="#25211D"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        {/* Gentle steam curl */}
        <path
          d="M23 12C21 8 25 5 23 1"
          stroke="#DFA6A0"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeDasharray="1 1"
        />
        <path
          d="M31 13C33 9 29 6 32 2"
          stroke="#DFA6A0"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeDasharray="1 1"
        />
      </g>

      {/* Small literary star flourish */}
      <path
        d="M168 50L170 56L176 58L170 60L168 66L166 60L160 58L166 56Z"
        fill="#F5D978"
        stroke="#25211D"
        strokeWidth="1.5"
      />
      <circle cx="178" cy="42" r="1.5" fill="#25211D" />
    </svg>
  );
}

/* Hand-drawn Bistro Table & Wine Glasses Illustration (inspired by the maroon poster) */
export function BistroTableWineIllustration({ className = 'w-64 h-64' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Left Bistro Chair */}
      <g stroke="#C2D9E8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        {/* Chair back rounded balloon */}
        <path d="M45 130 C45 60, 95 60, 95 130" fill="none" />
        {/* Lattice pattern */}
        <path d="M52 105 L88 85 M55 85 L85 105 M50 125 L90 70 M50 70 L90 125" strokeWidth="1.5" opacity="0.6" />
        {/* Seat cushion */}
        <ellipse cx="70" cy="140" rx="26" ry="10" fill="#4E1427" />
        {/* Chair legs */}
        <path d="M52 148 C48 180, 42 205, 45 225" />
        <path d="M88 148 C92 180, 98 205, 95 225" />
        <path d="M70 148 L70 215" strokeWidth="2" opacity="0.4" />
      </g>

      {/* Center Bistro Table */}
      <g stroke="#C2D9E8" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Round table surface */}
        <ellipse cx="150" cy="135" rx="72" ry="24" fill="#380C1A" />
        <ellipse cx="150" cy="138" rx="72" ry="24" fill="none" opacity="0.4" strokeWidth="1.5" />

        {/* Center Pedestal Leg */}
        <path d="M150 159 L150 215" strokeWidth="4" />
        {/* Ornate pedestal feet */}
        <path d="M150 215 C135 228, 120 235, 110 240" />
        <path d="M150 215 C165 228, 180 235, 190 240" />
        <path d="M150 215 C146 230, 150 240, 150 245" />

        {/* Stack of books on the table */}
        <path d="M140 125 L185 118 L195 132 L150 140 Z" fill="#F5D978" stroke="#C2D9E8" strokeWidth="2" />
        <path d="M143 118 L180 112 L190 124 L152 130 Z" fill="#FFF9F0" stroke="#C2D9E8" strokeWidth="2" />

        {/* Wine glass 1 */}
        <path d="M98 105 C95 118, 107 118, 105 105 Z" fill="#4E1427" stroke="#C2D9E8" strokeWidth="2" />
        <line x1="101" y1="118" x2="101" y2="128" strokeWidth="2" />
        <ellipse cx="101" cy="129" rx="6" ry="2" fill="#C2D9E8" strokeWidth="1" />

        {/* Wine glass 2 */}
        <path d="M118 100 C115 114, 128 114, 126 100 Z" fill="#4E1427" stroke="#C2D9E8" strokeWidth="2" />
        <line x1="121" y1="114" x2="121" y2="125" strokeWidth="2" />
        <ellipse cx="121" cy="126" rx="6" ry="2" fill="#C2D9E8" strokeWidth="1" />
      </g>

      {/* Right Bistro Chair */}
      <g stroke="#C2D9E8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M205 130 C205 60, 255 60, 255 130" fill="none" />
        <path d="M212 105 L248 85 M215 85 L245 105 M210 125 L250 70 M210 70 L250 125" strokeWidth="1.5" opacity="0.6" />
        <ellipse cx="230" cy="140" rx="26" ry="10" fill="#4E1427" />
        <path d="M212 148 C208 180, 202 205, 205 225" />
        <path d="M248 148 C252 180, 258 205, 255 225" />
        <path d="M230 148 L230 215" strokeWidth="2" opacity="0.4" />
      </g>
    </svg>
  );
}

export function BookmarkFlair({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 3C5 2.44772 5.44772 2 6 2H18C18.5523 2 19 2.44772 19 3V22L12 18L5 22V3Z"
        fill="#4E1427"
        stroke="#25211D"
        strokeWidth="2"
      />
    </svg>
  );
}

export function SquiggleUnderline({ className = 'w-full h-3' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 12" fill="none" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path
        d="M2 9C25 4 48 11 72 7C96 3 120 10 144 6C168 2 188 9 198 7"
        stroke="#C2D9E8"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StarFlair({ className = 'w-4 h-4 text-butter-yellow' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" stroke="#25211D" strokeWidth="1.5" />
    </svg>
  );
}

export function LittleTeacup({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path d="M6 12C6 21 10 24 16 24C22 24 26 21 26 12H6Z" fill="#C2D9E8" stroke="#25211D" strokeWidth="2" />
      <path d="M26 14C29 14 30.5 16 30.5 18C30.5 20.5 28 21.5 25.5 21.5" stroke="#25211D" strokeWidth="2" strokeLinecap="round" />
      <line x1="3" y1="27" x2="29" y2="27" stroke="#25211D" strokeWidth="2" strokeLinecap="round" />
      <path d="M13 7C12 5 14 3 13 1" stroke="#4E1427" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 7C17 5 19 3 18 1" stroke="#4E1427" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
