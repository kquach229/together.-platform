// lib/theme.ts
// Single source of truth for card themes. Every view reads colors from here,
// so text is always readable on both light and dark backgrounds.

export const THEME_IDS = [
  // Light
  "warm",
  "peach",
  "butter",
  "mint",
  "sage",
  "ocean",
  "sky",
  "lavender",
  "blush",
  "neutral",
  // Dark
  "midnight",
  "navy",
  "forest",
  "plum",
  "burgundy",
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export interface CardTheme {
  id: ThemeId;
  label: string;
  /** Gradient start / end */
  from: string;
  to: string;
  /** True when the background is dark (text must be light) */
  dark: boolean;
  /** Main headings on the banner */
  heading: string;
  /** Body copy, e.g. the creator's opening message */
  body: string;
  /** Emphasised text, e.g. a name inside a muted sentence */
  strong: string;
  /** Secondary text, e.g. "Organised by" */
  muted: string;
  /** Small accent text, e.g. the occasion badge */
  accent: string;
}

const LIGHT_TEXT = {
  dark: false,
  heading: "#1A1208",
  body: "#3A2F27",
  strong: "#1A1208",
  muted: "#8C7B6B",
  accent: "#D4845A",
};

const DARK_TEXT = {
  dark: true,
  heading: "#FDF8F2",
  body: "rgba(253,248,242,0.85)",
  strong: "#FDF8F2",
  muted: "rgba(253,248,242,0.68)",
  accent: "#E8A27C",
};

function light(
  id: ThemeId,
  label: string,
  from: string,
  to: string,
): CardTheme {
  return { id, label, from, to, ...LIGHT_TEXT };
}

function dark(id: ThemeId, label: string, from: string, to: string): CardTheme {
  return { id, label, from, to, ...DARK_TEXT };
}

export const CARD_THEMES: Record<ThemeId, CardTheme> = {
  // Light
  warm: light("warm", "Warm", "#FEF3ED", "#F5EAD8"),
  peach: light("peach", "Peach", "#FFF1E6", "#FFD9BF"),
  butter: light("butter", "Butter", "#FFFBE6", "#FBEFB5"),
  mint: light("mint", "Mint", "#E9F8F1", "#C5EBDB"),
  sage: light("sage", "Sage", "#EEF3EE", "#D4E8D4"),
  ocean: light("ocean", "Ocean", "#E3F6F8", "#B7E3EA"),
  sky: light("sky", "Sky", "#E6F1FB", "#C8DFF5"),
  lavender: light("lavender", "Lavender", "#F0EBF8", "#E2D4F0"),
  blush: light("blush", "Blush", "#FDEEF2", "#F8D5DF"),
  neutral: light("neutral", "Parchment", "#FDF8F2", "#EDE0CE"),
  // Dark
  midnight: dark("midnight", "Midnight", "#1A1208", "#2E2820"),
  navy: dark("navy", "Navy", "#10213D", "#1F3C6B"),
  forest: dark("forest", "Forest", "#12261B", "#214631"),
  plum: dark("plum", "Plum", "#2A1233", "#50245F"),
  burgundy: dark("burgundy", "Burgundy", "#3A1220", "#64203A"),
};

// Older cards may have been saved with ids that no longer exist.
const LEGACY_IDS: Record<string, ThemeId> = {
  parchment: "neutral",
};

export function isThemeId(id: string): id is ThemeId {
  return (THEME_IDS as readonly string[]).includes(id);
}

/** Always returns a valid theme, falling back to "warm" for unknown ids. */
export function getTheme(id?: string | null): CardTheme {
  if (!id) return CARD_THEMES.warm;
  const resolved = LEGACY_IDS[id] ?? id;
  return isThemeId(resolved) ? CARD_THEMES[resolved] : CARD_THEMES.warm;
}
