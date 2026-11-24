// lib/helpers/greeting.ts
// Single source of truth for card headings, so every view
// (create preview, creator view, signing page, recipient page) matches.

type Greeting = { lead: string; end: "!" | "." };

const GREETINGS: Record<string, Greeting> = {
  Birthday: { lead: "Happy Birthday", end: "!" },
  Farewell: { lead: "We'll Miss You", end: "!" },
  Congratulations: { lead: "Congratulations", end: "!" },
  Wedding: { lead: "Congratulations on Your Wedding", end: "!" },
  "New Baby": { lead: "Congratulations on Your New Baby", end: "!" },
  "Get Well Soon": { lead: "Get Well Soon", end: "!" },
  Graduation: { lead: "Congratulations on Your Graduation", end: "!" },
  "Thank You": { lead: "Thank You", end: "!" },
  Holiday: { lead: "Happy Holidays", end: "!" },
  "Work Anniversary": { lead: "Happy Work Anniversary", end: "!" },
  "Just Because": { lead: "This One's for You", end: "!" },
  Sympathy: { lead: "Thinking of You", end: "." },
};

/**
 * "Happy Work Anniversary, Ricky Tan!"
 *
 * If the recipient name is still empty (e.g. the create-card live preview
 * before the user has typed it), returns the lead with an ellipsis:
 * "Happy Work Anniversary…"
 */
export function getGreeting(occasion: string, recipientName?: string): string {
  const name = recipientName?.trim();
  const greeting = GREETINGS[occasion] ?? { lead: occasion, end: "!" as const };

  return name
    ? `${greeting.lead}, ${name}${greeting.end}`
    : `${greeting.lead}…`;
}
