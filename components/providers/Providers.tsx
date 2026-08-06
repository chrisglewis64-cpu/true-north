"use client";

import { TrueNorthProvider } from "@/context/TrueNorthContext";
import { OnboardingRouteGuard } from "@/components/onboarding/OnboardingRouteGuard";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TrueNorthProvider>
      <OnboardingRouteGuard>
        {children}
        <PwaInstallPrompt />
      </OnboardingRouteGuard>
    </TrueNorthProvider>
  );
}
