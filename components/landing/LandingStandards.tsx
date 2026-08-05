"use client";

import { useProfile } from "@/context/ProfileContext";

export function LandingStandards() {
  const { standardStatements, isLoading } = useProfile();

  if (isLoading) {
    return <p className="text-[15px] text-muted">Loading your standard…</p>;
  }

  if (standardStatements.length === 0) {
    return (
      <p className="text-[15px] leading-relaxed text-muted">
        Your standards will appear here once onboarding is complete.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {standardStatements.map((principle) => (
        <li
          key={principle}
          className="flex gap-3 text-[15px] leading-relaxed text-foreground/90 sm:text-base"
        >
          <span className="shrink-0 text-muted" aria-hidden>
            •
          </span>
          <span>{principle}</span>
        </li>
      ))}
    </ul>
  );
}
