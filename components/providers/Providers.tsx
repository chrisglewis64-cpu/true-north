"use client";

import { TrueNorthProvider } from "@/context/TrueNorthContext";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TrueNorthProvider>
      {children}
      <PwaInstallPrompt />
    </TrueNorthProvider>
  );
}
