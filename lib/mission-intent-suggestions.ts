export const missionIntentSuggestions = [
  "Today I will keep my word by following through on what I say.",
  "Today I will choose discipline over comfort by doing the hard thing first.",
  "Today I will walk with God by starting my day in prayer.",
  "Today I will put my family first by being fully present at home.",
  "Today I will do what is right, even when no one is watching.",
  "Today I will pursue excellence in everything I do.",
  "Today I will improve every day by learning one thing.",
  "Today I will finish what I start.",
] as const;

export function getRandomSuggestion(exclude?: string): string {
  const pool = exclude
    ? missionIntentSuggestions.filter((s) => s !== exclude)
    : [...missionIntentSuggestions];

  if (pool.length === 0) {
    return missionIntentSuggestions[0];
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

export function getInitialSuggestion(): string {
  return missionIntentSuggestions[0];
}
