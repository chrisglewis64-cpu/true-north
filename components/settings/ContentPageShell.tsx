import Link from "next/link";
import type { ReactNode } from "react";
import { BottomNav } from "@/components/navigation/BottomNav";
import { SectionLabel } from "@/components/ui/SectionCard";

type ContentPageShellProps = {
  label: string;
  title: string;
  children: ReactNode;
  /** When true, hide bottom nav for immersive reading (Creed). */
  immersive?: boolean;
};

export function ContentPageShell({
  label,
  title,
  children,
  immersive = false,
}: ContentPageShellProps) {
  return (
    <>
      <main
        className={`mx-auto w-full max-w-lg flex-1 px-6 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl ${
          immersive ? "pb-16" : "pb-28"
        }`}
      >
        <Link
          href="/settings"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
        >
          ← Settings
        </Link>

        <header className="mb-12 mt-6 animate-fade-in">
          <SectionLabel>{label}</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h1>
        </header>

        <div className="animate-fade-in [animation-delay:80ms]">{children}</div>
      </main>
      {immersive ? null : <BottomNav />}
    </>
  );
}
