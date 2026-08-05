import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionCard";
import { BottomNav } from "@/components/navigation/BottomNav";

const reviewLinks = [
  {
    href: "/review/daily",
    label: "Daily Review",
    description: "Reflect on today before the debrief closes the loop.",
  },
  {
    href: "/review/weekly",
    label: "Weekly Review",
    description: "Assess the week and identify course corrections.",
  },
  {
    href: "/review/monthly",
    label: "Monthly Review",
    description: "Evaluate progress against your mission.",
  },
  {
    href: "/review/annual",
    label: "Annual Review",
    description: "A full accounting of the year.",
  },
];

export default function ReviewPage() {
  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <header className="animate-fade-in">
          <SectionLabel>Review</SectionLabel>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Reflection Hub
          </h1>
          <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted">
            Periodic reviews to assess course, capture lessons, and recalibrate.
          </p>
        </header>

        <section className="mt-12 space-y-3 animate-fade-in [animation-delay:80ms]">
          {reviewLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:border-border-subtle sm:px-6"
            >
              <div className="min-w-0 pr-4 text-left">
                <span className="block text-[15px] font-medium text-foreground/90">
                  {link.label}
                </span>
                <span className="mt-1 block text-[14px] text-muted">
                  {link.description}
                </span>
              </div>
              <span aria-hidden className="shrink-0 text-muted">
                →
              </span>
            </Link>
          ))}
        </section>

        <section className="mt-12 animate-fade-in [animation-delay:160ms]">
          <SectionLabel>Preferences</SectionLabel>
          <Link
            href="/settings"
            className="flex items-center justify-between rounded-2xl border border-border bg-surface px-5 py-4 transition-colors hover:border-border-subtle sm:px-6"
          >
            <div>
              <span className="block text-[15px] font-medium text-foreground/90">
                Settings
              </span>
              <span className="mt-1 block text-[14px] text-muted">
                Notification reminders and timing
              </span>
            </div>
            <span aria-hidden className="text-muted">
              →
            </span>
          </Link>
        </section>
      </main>
      <BottomNav />
    </>
  );
}
