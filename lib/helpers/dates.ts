// lib/helpers/dates.ts

// "2026-11-20" -> ISO string for local start or end of that day
export function dateInputToISO(value: string, edge: "start" | "end" = "start") {
  const [y, m, d] = value.split("-").map(Number);
  const date =
    edge === "end"
      ? new Date(y, m - 1, d, 23, 59, 59, 999)
      : new Date(y, m - 1, d);
  return date.toISOString();
}

// Date | ISO string -> "YYYY-MM-DD" in the user's local timezone
export function toDateInputValue(date: Date | string | null): string {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
