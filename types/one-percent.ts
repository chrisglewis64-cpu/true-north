/**
 * The daily 1% improvement — a small, deliberate system upgrade.
 * Set during Debrief Step 3; displayed on Operations the following day.
 */
export interface DailyOnePercent {
  improvement: string;
  setAt: string;
  source: "debrief" | "seed" | "manual";
}
