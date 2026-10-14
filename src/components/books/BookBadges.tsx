import React from "react";

export const SPICE_LEVEL_METADATA: Record<
  number,
  { label: string; chilis: string; desc: string; color: string }
> = {
  0: {
    label: "Clean / Closed Door",
    chilis: "Clean",
    desc: "Pure plot, zero on-page intimacy / clean romance",
    color: "bg-[#F6EEE9] text-[#5B2302] border-[#5B2302]/20",
  },
  1: {
    label: "Mild",
    chilis: "🌶️",
    desc: "Sweet kisses, romantic tension, closed bedroom door (1/5)",
    color: "bg-[#FFF0EB] text-[#A52A18] border-[#E0533C]/25",
  },
  2: {
    label: "Warm",
    chilis: "🌶️🌶️",
    desc: "Sensual touches, heavy petting, fade-to-black (2/5)",
    color: "bg-[#FFF0EB] text-[#A52A18] border-[#E0533C]/30",
  },
  3: {
    label: "Steamy",
    chilis: "🌶️🌶️🌶️",
    desc: "Detailed open-door intimate scenes with strong emotional connection (3/5)",
    color: "bg-[#FFEBE5] text-[#9E1C0A] border-[#E0533C]/40",
  },
  4: {
    label: "Scorching",
    chilis: "🌶️🌶️🌶️🌶️",
    desc: "Multiple explicit, descriptive open-door intimate encounters (4/5)",
    color: "bg-[#FFE2DA] text-[#8A1405] border-[#E0533C]/50",
  },
  5: {
    label: "Extremely Spicy",
    chilis: "🌶️🌶️🌶️🌶️🌶️",
    desc: "Extremely spicy, maximum heat & explicit romance (5/5)",
    color: "bg-[#FFD7CE] text-[#740E02] border-[#E0533C]/60",
  },
};

export function RatingBadge({
  rating,
  size = "md",
  showMax = false,
}: {
  rating?: number;
  size?: "sm" | "md" | "lg";
  showMax?: boolean;
}) {
  if (rating === undefined || rating === null) return null;

  const sizeClasses = {
    sm: "text-[11px] gap-1",
    md: "text-xs gap-1.5",
    lg: "text-sm gap-1.5",
  }[size];

  return (
    <span
      className={`inline-flex items-center font-body font-semibold text-[#5B2302] select-none ${sizeClasses}`}
      title={`Community Rating: ${rating.toFixed(1)} out of 5`}
    >
      <span className="text-[#D97706] text-xs">★</span>
      <span className="font-bold tracking-tight">{rating.toFixed(1)}</span>
      {showMax && (
        <span className="text-[#5B2302]/50 font-normal text-[10px]">/5</span>
      )}
    </span>
  );
}

export function SpiceBadge({
  level,
  size = "md",
  showLabel = true,
}: {
  level?: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}) {
  if (level === undefined || level === null) return null;

  const meta = SPICE_LEVEL_METADATA[level] || {
    label: `Spice ${level}/5`,
    chilis: "🌶️".repeat(Math.min(5, Math.max(1, level))),
    desc: "Reader spice heat index",
    color: "",
  };

  const sizeClasses = {
    sm: "text-[11px] gap-1",
    md: "text-xs gap-1.5",
    lg: "text-sm gap-1.5",
  }[size];

  // Capitalize first letter properly (e.g. Steamy, Mild, Warm, Scorching)
  const displayLabel = meta.label.charAt(0).toUpperCase() + meta.label.slice(1);

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap font-body font-semibold text-[#8A1405] select-none ${sizeClasses}`}
      title={`Spice Level: ${level}/5 — ${displayLabel} (${meta.desc})`}
    >
      <span className="tracking-tighter select-none whitespace-nowrap">
        {meta.chilis}
      </span>
      {showLabel && (
        <span className="font-semibold text-[#8A1405]/90 tracking-tight whitespace-nowrap">
          {displayLabel}
        </span>
      )}
    </span>
  );
}

/**
 * Simple, compact 5-pepper Spice Rating Picker.
 */
export function SpicePicker({
  value,
  onChange,
}: {
  value: number; // 0 to 5
  onChange: (val: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 h-9 select-none">
      {[1, 2, 3, 4, 5].map((lvl) => {
        const isLit = lvl <= value;
        return (
          <button
            key={lvl}
            type="button"
            onClick={() => onChange(value === lvl ? 0 : lvl)}
            className={`w-8 h-8 rounded-lg border transition-all text-base flex items-center justify-center cursor-pointer ${
              isLit
                ? "bg-[#FFF0EB] border-[#E0533C]/40 opacity-100"
                : "bg-white border-[#5B2302]/15 opacity-35 grayscale hover:opacity-75"
            }`}
            title={`${lvl}/5`}
          >
            🌶️
          </button>
        );
      })}
    </div>
  );
}
