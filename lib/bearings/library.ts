import type { Bearing } from "@/types/bearing";

/**
 * Growing system library of Bearings — tiny identity corrections.
 * Users may eventually create their own; this seed is the foundation.
 */
export const SYSTEM_BEARING_LIBRARY: readonly Bearing[] = [
  {
    id: "bearing-rise-immediately",
    statement: "Get out of bed immediately.",
    source: "system",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "bearing-pray-before-phone",
    statement: "Pray before touching your phone.",
    source: "system",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "bearing-make-bed",
    statement: "Make your bed.",
    source: "system",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "bearing-leave-room-cleaner",
    statement: "Leave every room cleaner than you found it.",
    source: "system",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "bearing-water-before-coffee",
    statement: "Drink water before coffee.",
    source: "system",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "bearing-read-one-page",
    statement: "Read one page.",
    source: "system",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "bearing-trolleys",
    statement: "Put shopping trolleys away.",
    source: "system",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "bearing-shoes-away",
    statement: "Put your shoes away.",
    source: "system",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "bearing-speak-deliberately",
    statement: "Speak deliberately.",
    source: "system",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "bearing-smile-first",
    statement: "Smile first.",
    source: "system",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "bearing-five-minutes-outside",
    statement: "Five minutes outside.",
    source: "system",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "bearing-stretch-after-waking",
    statement: "Stretch after waking.",
    source: "system",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "bearing-phone-away-earlier",
    statement: "Put your phone away earlier.",
    source: "system",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "bearing-scripture-before-messages",
    statement: "Read Scripture before checking messages.",
    source: "system",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "bearing-stand-at-alarm",
    statement: "Stand immediately when your alarm sounds.",
    source: "system",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "bearing-inbox-after-prayer",
    statement: "Pray before opening your inbox.",
    source: "system",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "bearing-leave-room-better",
    statement: "Leave every room better than you found it.",
    source: "system",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "bearing-finish-one-thing",
    statement: "Finish one thing you start today.",
    source: "system",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
] as const;

const bearingById = new Map(
  SYSTEM_BEARING_LIBRARY.map((bearing) => [bearing.id, bearing])
);

export function getBearingById(id: string): Bearing | undefined {
  return bearingById.get(id);
}

export function resolveBearings(ids: readonly string[]): Bearing[] {
  return ids
    .map((id) => getBearingById(id))
    .filter((bearing): bearing is Bearing => Boolean(bearing));
}

export function listBearingLibrary(
  customBearings: readonly Bearing[] = []
): Bearing[] {
  return [...SYSTEM_BEARING_LIBRARY, ...customBearings];
}
