"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ProfileProvider } from "@/context/ProfileContext";
import { AppProvider } from "@/context/AppContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProfileProvider>
        <AppProvider>{children}</AppProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
