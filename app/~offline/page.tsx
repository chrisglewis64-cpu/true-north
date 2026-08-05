import Link from "next/link";
import { SectionLabel } from "@/components/ui/SectionCard";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-6 py-16 text-center sm:max-w-xl sm:px-8">
      <SectionLabel>Offline</SectionLabel>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
        True North shell is available.
      </h1>
      <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
        You are offline. Reconnect to sync debriefs, missions, and alignment.
      </p>
      <Link
        href="/operations"
        className="mt-10 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
      >
        Return to Operations →
      </Link>
    </main>
  );
}
