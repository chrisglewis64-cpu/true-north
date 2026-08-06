import { ContentPageShell } from "@/components/settings/ContentPageShell";

const creed = [
  "You become what you repeatedly do.",
  "Every action is a vote for the person you are becoming.",
  "Character is built quietly.",
  "Discipline is remembered long after motivation fades.",
  "Your standards matter only if they are lived.",
  "Keep heading North.",
] as const;

/**
 * The Creed — read only. No buttons. No distractions.
 */
export function CreedPage() {
  return (
    <ContentPageShell label="The Creed" title="The Creed" immersive>
      <div className="space-y-16 py-4 sm:space-y-20 sm:py-8">
        {creed.map((line) => (
          <p
            key={line}
            className="text-center text-[1.35rem] font-medium leading-snug tracking-tight text-foreground/90 sm:text-[1.5rem]"
          >
            {line}
          </p>
        ))}
      </div>
    </ContentPageShell>
  );
}
