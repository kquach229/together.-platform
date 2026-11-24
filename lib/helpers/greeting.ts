// lib/helpers/greeting.ts
// Single source of truth for occasions: labels, emoji, grouping and card
// headings. Every view (create picker, edit panel, creator view, signing page,
// recipient page) reads from here, so they always match.

export const OCCASION_GROUPS = [
  "Celebrations",
  "Work & achievements",
  "Support & appreciation",
  "Holidays",
] as const;

export type OccasionGroup = (typeof OCCASION_GROUPS)[number];

export interface Occasion {
  /** Stored in the database as Card.occasion. Don't rename existing labels. */
  label: string;
  emoji: string;
  group: OccasionGroup;
  /** Heading text that comes before the recipient's name. */
  lead: string;
  end: "!" | ".";
}

export const OCCASIONS: Occasion[] = [
  // ── Celebrations ──
  {
    label: "Birthday",
    emoji: "🎂",
    group: "Celebrations",
    lead: "Happy Birthday",
    end: "!",
  },
  {
    label: "Anniversary",
    emoji: "💖",
    group: "Celebrations",
    lead: "Happy Anniversary",
    end: "!",
  },
  {
    label: "Wedding",
    emoji: "💍",
    group: "Celebrations",
    lead: "Congratulations on Your Wedding",
    end: "!",
  },
  {
    label: "Engagement",
    emoji: "💎",
    group: "Celebrations",
    lead: "Congratulations on Your Engagement",
    end: "!",
  },
  {
    label: "New Baby",
    emoji: "🍼",
    group: "Celebrations",
    lead: "Congratulations on Your New Baby",
    end: "!",
  },
  {
    label: "Baby Shower",
    emoji: "👶",
    group: "Celebrations",
    lead: "Happy Baby Shower",
    end: "!",
  },
  {
    label: "Bridal Shower",
    emoji: "👰",
    group: "Celebrations",
    lead: "Happy Bridal Shower",
    end: "!",
  },
  {
    label: "Gender Reveal",
    emoji: "🎀",
    group: "Celebrations",
    lead: "Happy Gender Reveal",
    end: "!",
  },
  {
    label: "New Home",
    emoji: "🏠",
    group: "Celebrations",
    lead: "Congratulations on Your New Home",
    end: "!",
  },
  {
    label: "Housewarming",
    emoji: "🏡",
    group: "Celebrations",
    lead: "Happy Housewarming",
    end: "!",
  },
  {
    label: "New Car",
    emoji: "🚗",
    group: "Celebrations",
    lead: "Congratulations on Your New Car",
    end: "!",
  },
  {
    label: "Bon Voyage",
    emoji: "✈️",
    group: "Celebrations",
    lead: "Bon Voyage",
    end: "!",
  },

  // ── Work & achievements ──
  {
    label: "Farewell",
    emoji: "👋",
    group: "Work & achievements",
    lead: "We'll Miss You",
    end: "!",
  },
  {
    label: "Congratulations",
    emoji: "🎊",
    group: "Work & achievements",
    lead: "Congratulations",
    end: "!",
  },
  {
    label: "Graduation",
    emoji: "🎓",
    group: "Work & achievements",
    lead: "Congratulations on Your Graduation",
    end: "!",
  },
  {
    label: "New Job",
    emoji: "💼",
    group: "Work & achievements",
    lead: "Congratulations on Your New Job",
    end: "!",
  },
  {
    label: "Promotion",
    emoji: "📈",
    group: "Work & achievements",
    lead: "Congratulations on Your Promotion",
    end: "!",
  },
  {
    label: "Retirement",
    emoji: "🎖️",
    group: "Work & achievements",
    lead: "Happy Retirement",
    end: "!",
  },
  {
    label: "Work Anniversary",
    emoji: "🏆",
    group: "Work & achievements",
    lead: "Happy Work Anniversary",
    end: "!",
  },
  {
    label: "First Day",
    emoji: "🌅",
    group: "Work & achievements",
    lead: "Good Luck on Your First Day",
    end: "!",
  },
  {
    label: "Welcome to the Team",
    emoji: "🤝",
    group: "Work & achievements",
    lead: "Welcome to the Team",
    end: "!",
  },
  {
    label: "New Business",
    emoji: "🚀",
    group: "Work & achievements",
    lead: "Congratulations on Your New Business",
    end: "!",
  },
  {
    label: "Teacher Appreciation",
    emoji: "🍎",
    group: "Work & achievements",
    lead: "Thank You for Everything",
    end: "!",
  },

  // ── Support & appreciation ──
  {
    label: "Thank You",
    emoji: "🙏",
    group: "Support & appreciation",
    lead: "Thank You",
    end: "!",
  },
  {
    label: "Love & Appreciation",
    emoji: "❤️",
    group: "Support & appreciation",
    lead: "We Appreciate You",
    end: "!",
  },
  {
    label: "Get Well Soon",
    emoji: "❤️‍🩹",
    group: "Support & appreciation",
    lead: "Get Well Soon",
    end: "!",
  },
  {
    label: "Sympathy",
    emoji: "🕊️",
    group: "Support & appreciation",
    lead: "Thinking of You",
    end: ".",
  },
  {
    label: "Thinking of You",
    emoji: "💭",
    group: "Support & appreciation",
    lead: "Thinking of You",
    end: "!",
  },
  {
    label: "Encouragement",
    emoji: "💪",
    group: "Support & appreciation",
    lead: "You've Got This",
    end: "!",
  },
  {
    label: "Good Luck",
    emoji: "🍀",
    group: "Support & appreciation",
    lead: "Good Luck",
    end: "!",
  },
  {
    label: "Miss You",
    emoji: "💌",
    group: "Support & appreciation",
    lead: "We Miss You",
    end: "!",
  },
  {
    label: "Welcome Back",
    emoji: "🤗",
    group: "Support & appreciation",
    lead: "Welcome Back",
    end: "!",
  },
  {
    label: "Apology",
    emoji: "🌿",
    group: "Support & appreciation",
    lead: "We're Sorry",
    end: ".",
  },
  {
    label: "Just Because",
    emoji: "🌟",
    group: "Support & appreciation",
    lead: "This One's for You",
    end: "!",
  },

  // ── Holidays ──
  {
    label: "Holiday",
    emoji: "🎄",
    group: "Holidays",
    lead: "Happy Holidays",
    end: "!",
  },
  {
    label: "Christmas",
    emoji: "🎅",
    group: "Holidays",
    lead: "Merry Christmas",
    end: "!",
  },
  {
    label: "New Year's",
    emoji: "🎆",
    group: "Holidays",
    lead: "Happy New Year",
    end: "!",
  },
  {
    label: "Valentine's Day",
    emoji: "💘",
    group: "Holidays",
    lead: "Happy Valentine's Day",
    end: "!",
  },
  {
    label: "Easter",
    emoji: "🐣",
    group: "Holidays",
    lead: "Happy Easter",
    end: "!",
  },
  {
    label: "Halloween",
    emoji: "🎃",
    group: "Holidays",
    lead: "Happy Halloween",
    end: "!",
  },
  {
    label: "Thanksgiving",
    emoji: "🦃",
    group: "Holidays",
    lead: "Happy Thanksgiving",
    end: "!",
  },
  {
    label: "Mother's Day",
    emoji: "🌸",
    group: "Holidays",
    lead: "Happy Mother's Day",
    end: "!",
  },
  {
    label: "Father's Day",
    emoji: "👔",
    group: "Holidays",
    lead: "Happy Father's Day",
    end: "!",
  },
  {
    label: "St. Patrick's Day",
    emoji: "☘️",
    group: "Holidays",
    lead: "Happy St. Patrick's Day",
    end: "!",
  },
  {
    label: "Fourth of July",
    emoji: "🎇",
    group: "Holidays",
    lead: "Happy Fourth of July",
    end: "!",
  },
  {
    label: "Lunar New Year",
    emoji: "🧧",
    group: "Holidays",
    lead: "Happy Lunar New Year",
    end: "!",
  },
  {
    label: "Diwali",
    emoji: "🪔",
    group: "Holidays",
    lead: "Happy Diwali",
    end: "!",
  },
  {
    label: "Hanukkah",
    emoji: "🕎",
    group: "Holidays",
    lead: "Happy Hanukkah",
    end: "!",
  },
  {
    label: "Eid al-Fitr",
    emoji: "🌙",
    group: "Holidays",
    lead: "Eid Mubarak",
    end: "!",
  },
  {
    label: "Eid al-Adha",
    emoji: "🌙",
    group: "Holidays",
    lead: "Eid Mubarak",
    end: "!",
  },
  {
    label: "Ramadan",
    emoji: "🌙",
    group: "Holidays",
    lead: "Ramadan Mubarak",
    end: "!",
  },
  {
    label: "Passover",
    emoji: "🕯️",
    group: "Holidays",
    lead: "Happy Passover",
    end: "!",
  },
  {
    label: "International Women's Day",
    emoji: "💜",
    group: "Holidays",
    lead: "Happy International Women's Day",
    end: "!",
  },
];

const BY_LABEL = new Map(OCCASIONS.map((o) => [o.label, o]));

/** Emoji used for custom (free-text) occasions. */
export const CUSTOM_EMOJI = "🎉";

/** Keep in sync with the max() on the occasion field in the API routes. */
export const MAX_CUSTOM_OCCASION_LENGTH = 60;

export function isPresetOccasion(label: string): boolean {
  return BY_LABEL.has(label);
}

export function getOccasionEmoji(occasion: string): string {
  return BY_LABEL.get(occasion)?.emoji ?? CUSTOM_EMOJI;
}

/** Collapse whitespace, trim and cap the length of a custom occasion. */
export function normalizeCustomOccasion(input: string): string {
  return input.replace(/\s+/g, " ").trim().slice(0, MAX_CUSTOM_OCCASION_LENGTH);
}

/**
 * "Happy Work Anniversary, Ricky Tan!"
 *
 * Preset occasions use the wording above. Any other occasion string is
 * treated as a custom heading, so "Happy Friendship Day" becomes
 * "Happy Friendship Day, Sam!" (trailing punctuation is stripped first).
 *
 * If the recipient name is still empty (e.g. the create-card live preview
 * before the user has typed it), returns the lead with an ellipsis:
 * "Happy Work Anniversary…"
 */
export function getGreeting(occasion: string, recipientName?: string): string {
  const name = recipientName?.trim();
  const preset = BY_LABEL.get(occasion);

  const lead = preset
    ? preset.lead
    : occasion.replace(/[\s!.,;:]+$/, "") || "Hello";
  const end = preset ? preset.end : "!";

  return name ? `${lead}, ${name}${end}` : `${lead}…`;
}
