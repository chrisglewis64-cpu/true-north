"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottomNav } from "@/components/navigation/BottomNav";
import { SettingsLinkRow } from "@/components/settings/SettingsLinkRow";
import { SectionLabel } from "@/components/ui/SectionCard";
import { useTrueNorth } from "@/context/TrueNorthContext";
import { APP_VERSION, FEEDBACK_HREF } from "@/lib/app-meta";
import { SIGN_IN_PATH } from "@/lib/auth/paths";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function SettingsSection({
  label,
  children,
  delayClass = "",
}: {
  label: string;
  children: React.ReactNode;
  delayClass?: string;
}) {
  return (
    <section className={`animate-fade-in ${delayClass}`}>
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-4 border-t border-border">{children}</div>
    </section>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-border py-4 last:border-0">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-[15px] text-foreground/90">{value}</p>
    </div>
  );
}

/**
 * Field-manual Settings — quiet, premium, intentional.
 */
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
      <main className="mx-auto w-full max-w-lg flex-1 px-6 pb-36 pt-10 sm:max-w-xl sm:px-8 sm:pt-14 lg:max-w-2xl">
        <header className="mb-12 animate-fade-in">
          <SectionLabel>Settings</SectionLabel>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Field manual.
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Become the person you committed to be.
          </p>
        </header>

        <div className="space-y-12">
          <SettingsSection label="Your Account" delayClass="[animation-delay:40ms]">
            <FieldRow
              label="Display Name"
              value={session.displayName || "True North user"}
            />
            <FieldRow label="Email" value={session.email || "—"} />
            <div className="py-4">
              <button
                type="button"
                onClick={() => void handleSignOut()}
                disabled={signingOut}
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground disabled:opacity-50"
              >
                {signingOut ? "Signing out…" : "Sign Out"}
              </button>
            </div>
          </SettingsSection>

          <SettingsSection
            label="About True North"
            delayClass="[animation-delay:100ms]"
          >
            <SettingsLinkRow href="/about" label="Purpose" />
            <SettingsLinkRow href="/philosophy" label="Philosophy" />
            <SettingsLinkRow href="/creed" label="The Creed" />
          </SettingsSection>

          <SettingsSection
            label="Application"
            delayClass="[animation-delay:160ms]"
          >
            <FieldRow label="Version" value={APP_VERSION} />
            <SettingsLinkRow href="/privacy" label="Privacy Policy" />
            <SettingsLinkRow href="/terms" label="Terms" />
            <SettingsLinkRow
              href={FEEDBACK_HREF}
              label="Provide Feedback"
              external
            />
          </SettingsSection>
        </div>
      </main>
      <BottomNav />
    </>
  );
}
