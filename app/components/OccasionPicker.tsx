"use client";

// app/components/OccasionPicker.tsx
// Grouped, searchable occasion picker with a "Custom" option.
// Controlled by the parent: `value` is the final occasion string that gets
// saved (either a preset label or the custom heading text).

import { useState } from "react";
import {
  MAX_CUSTOM_OCCASION_LENGTH,
  OCCASIONS,
  OCCASION_GROUPS,
  getGreeting,
  isPresetOccasion,
  normalizeCustomOccasion,
} from "@/lib/helpers/greeting";

interface Props {
  value: string;
  onChange: (occasion: string) => void;
}

export default function OccasionPicker({ value, onChange }: Props) {
  // If we mount with a non-preset value (e.g. the user went back a step),
  // start in custom mode with that text.
  const startsCustom = value !== "" && !isPresetOccasion(value);

  const [customMode, setCustomMode] = useState(startsCustom);
  const [customText, setCustomText] = useState(startsCustom ? value : "");
  const [search, setSearch] = useState("");

  const query = search.trim().toLowerCase();
  const visibleGroups = OCCASION_GROUPS.map((group) => ({
    group,
    items: OCCASIONS.filter(
      (o) =>
        o.group === group && (!query || o.label.toLowerCase().includes(query)),
    ),
  })).filter((g) => g.items.length > 0);

  const customNormalized = normalizeCustomOccasion(customText);

  return (
    <div className="flex flex-col gap-8">
      {/* Search */}
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search occasions…"
        className="w-full px-4 py-3 border border-[#E8DDD0] rounded-xl text-sm bg-white outline-none focus:border-terracotta transition-colors font-dm-sans placeholder:text-[#C5B8AD]"
      />

      {/* Custom */}
      <div>
        <button
          type="button"
          onClick={() => {
            setCustomMode(true);
            onChange(customNormalized);
          }}
          className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all font-dm-sans cursor-pointer ${
            customMode
              ? "border-terracotta bg-[#FEF3ED] shadow-[0_2px_12px_rgba(212,132,90,0.15)]"
              : "border-[#E8DDD0] bg-white hover:border-terracotta hover:bg-[#FEF3ED]/40"
          }`}
        >
          <span className="text-2xl">✨</span>
          <span>
            <span className="block text-sm font-medium text-[#1A1208]">
              Something else
            </span>
            <span className="block text-xs text-[#8C7B6B] font-light">
              Write your own occasion or heading
            </span>
          </span>
        </button>

        {customMode && (
          <div className="mt-3">
            <input
              type="text"
              autoFocus
              value={customText}
              maxLength={MAX_CUSTOM_OCCASION_LENGTH}
              onChange={(e) => {
                setCustomText(e.target.value);
                onChange(normalizeCustomOccasion(e.target.value));
              }}
              placeholder="e.g. Happy Friendship Day"
              className="w-full px-4 py-3 border border-[#E8DDD0] rounded-xl text-sm bg-white outline-none focus:border-terracotta transition-colors font-dm-sans placeholder:text-[#C5B8AD]"
            />
            <p className="text-xs text-[#8C7B6B] mt-1.5 font-light">
              {customNormalized ? (
                <>
                  Your card will say:{" "}
                  <span className="font-medium text-[#1A1208]">
                    {getGreeting(customNormalized, "Sarah")}
                  </span>
                </>
              ) : (
                "Type the heading you'd like. We'll add the recipient's name after it."
              )}
            </p>
          </div>
        )}
      </div>

      {/* Presets */}
      {visibleGroups.map(({ group, items }) => (
        <div key={group}>
          <div className="text-[11px] font-medium tracking-[1.5px] uppercase text-[#8C7B6B] mb-3">
            {group}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {items.map((o) => {
              const selected = !customMode && value === o.label;
              return (
                <button
                  type="button"
                  key={o.label}
                  onClick={() => {
                    setCustomMode(false);
                    onChange(o.label);
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all font-dm-sans cursor-pointer ${
                    selected
                      ? "border-terracotta bg-[#FEF3ED] shadow-[0_2px_12px_rgba(212,132,90,0.15)]"
                      : "border-[#E8DDD0] bg-white hover:border-terracotta hover:bg-[#FEF3ED]/40"
                  }`}
                >
                  <span className="text-2xl">{o.emoji}</span>
                  <span className="text-xs font-medium text-[#1A1208] leading-relaxed">
                    {o.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {visibleGroups.length === 0 && (
        <p className="text-sm text-[#8C7B6B] font-light">
          No matches. Try "Something else" to write your own.
        </p>
      )}
    </div>
  );
}
