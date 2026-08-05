"use client";

import { AuthRouteGuard } from "@/components/auth/AuthRouteGuard";
import { AuthProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { AppProvider } from "@/context/AppContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AuthRouteGuard>
          <AppProvider>{children}</AppProvider>
        </AuthRouteGuard>
      </ProfileProvider>
    </AuthProvider>
  );
}
