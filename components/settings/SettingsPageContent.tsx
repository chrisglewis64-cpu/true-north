"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottomNav } from "@/components/navigation/BottomNav";
import { NotificationSettingsSection } from "@/components/settings/NotificationSettingsSection";
import { SectionCard, SectionLabel } from "@/components/ui/SectionCard";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { SIGN_IN_PATH } from "@/lib/auth/paths";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function SettingsPageContent() {
  const router = useRouter();
  const { session } = useTrueNorth();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    if (signingOut) {
      return;
    }

    setSigningOut(true);

    try {
      if (isSupabaseConfigured()) {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
      }
      router.replace(SIGN_IN_PATH);
      router.refresh();
    } catch {
      setSigningOut(false);
    }
  }

  return (
    <>
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-28 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <Link
          href="/review"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground"
        >
          ← Review
        </Link>

        <header className="mb-10 mt-6 animate-fade-in">
          <SectionLabel>Settings</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Configuration.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Keep the system quiet. Configure only what you need.
          </p>
        </header>

        <div className="space-y-10">
          <div className="animate-fade-in [animation-delay:40ms]">
            <NotificationSettingsSection />
          </div>

          <section className="animate-fade-in [animation-delay:100ms]">
            <SectionLabel>Theme</SectionLabel>
            <SectionCard>
              <p className="text-[15px] font-medium text-foreground">
                Appearance
              </p>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">
                Theme controls are coming in a future release. True North remains
                in its calm dark palette for now.
              </p>
            </SectionCard>
          </section>

          <section className="animate-fade-in [animation-delay:160ms]">
            <SectionLabel>Account</SectionLabel>
            <SectionCard className="space-y-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
                  Signed in as
                </p>
                <p className="mt-2 text-[15px] font-medium text-foreground">
                  {session.displayName || "True North user"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void handleSignOut()}
                disabled={signingOut}
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground disabled:opacity-50"
              >
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
            </SectionCard>
          </section>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
