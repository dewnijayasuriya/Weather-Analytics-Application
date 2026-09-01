/**
 * Presentation-only helpers for the comfort score.
 * The score itself is computed by the backend - these functions only
 * decide how to label and colour it in the UI.
 */

export function comfortLabel(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Comfortable";
  if (score >= 55) return "Fair";
  if (score >= 40) return "Poor";
  return "Harsh";
}

export type ComfortTone = "great" | "good" | "ok" | "poor" | "bad";

export function comfortTone(score: number): ComfortTone {
  if (score >= 85) return "great";
  if (score >= 70) return "good";
  if (score >= 55) return "ok";
  if (score >= 40) return "poor";
  return "bad";
}

/** Resolves to the CSS custom property backing each tone. */
export function toneColor(tone: ComfortTone): string {
  switch (tone) {
    case "great":
      return "var(--color-score-great)";
    case "good":
      return "var(--color-score-good)";
    case "ok":
      return "var(--color-score-ok)";
    case "poor":
      return "var(--color-score-poor)";
    case "bad":
      return "var(--color-score-bad)";
  }
}

export function toneTextClass(tone: ComfortTone): string {
  return {
    great: "text-score-great",
    good: "text-score-good",
    ok: "text-score-ok",
    poor: "text-score-poor",
    bad: "text-score-bad",
  }[tone];
}
