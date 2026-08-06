"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/**
 * Surfaces the browser install prompt when available.
 * Installability still works via the browser menu without this component.
 */
export function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  if (!installEvent || hidden) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-30 px-6">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-4 rounded-2xl border border-border bg-surface px-4 py-3 shadow-lg sm:max-w-xl">
        <p className="text-left text-[14px] leading-snug text-foreground/90">
          Install True North on this device.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setHidden(true)}
            className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={() => {
              void installEvent.prompt().then(() => setHidden(true));
            }}
            className="rounded-xl bg-accent px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-white"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
