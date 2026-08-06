import { ContentPageShell } from "@/components/settings/ContentPageShell";

const layers = [
  {
    name: "Identity",
    body: "Who you have committed to become. Identity changes slowly — and everything else serves it.",
  },
  {
    name: "Standards",
    body: "The principles you live by. Rarely changed. Your personal code of integrity.",
  },
  {
    name: "Mission",
    body: "The focused campaign of the season. Changes every few months. Gives direction to effort.",
  },
  {
    name: "Bearings",
    body: "Tiny identity corrections for the week. Never more than three. Small disciplines that shape character.",
  },
  {
    name: "Evidence",
    body: "Permanent proof that a standard was lived. Written automatically when you honour identity in the Daily Debrief.",
  },
  {
    name: "Reflection",
    body: "Honest review of the day, week, and season. Truth over performance.",
  },
  {
    name: "Growth",
    body: "The quiet result of alignment repeated. Character formed through practice.",
  },
] as const;

export function PhilosophyPage() {
  return (
    <ContentPageShell label="Philosophy" title="The Philosophy">
      <p className="text-[15px] leading-relaxed text-muted">
        True North is an operating system for identity. Each layer feeds the
        next.
      </p>

      <ol className="mt-10 space-y-0">
        {layers.map((layer, index) => (
          <li key={layer.name} className="border-t border-border py-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
              {layer.name}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted sm:text-base">
              {layer.body}
            </p>
            {index < layers.length - 1 ? (
              <p
                className="mt-6 text-center font-mono text-[11px] text-muted/50"
                aria-hidden
              >
                ↓
              </p>
            ) : null}
          </li>
        ))}
      </ol>

      <p className="mt-4 border-t border-border pt-8 text-[15px] leading-relaxed text-muted">
        Every screen asks one question: Am I becoming the person I committed to
        be?
      </p>
    </ContentPageShell>
  );
}
