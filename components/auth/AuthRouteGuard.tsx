"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";

const AUTH_ROUTES = new Set([
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
]);

type AuthRouteGuardProps = {
  children: React.ReactNode;
};

export function AuthRouteGuard({ children }: AuthRouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoading: authLoading } = useAuth();
  const { profile, isLoading: profileLoading } = useProfile();

  const isAuthRoute = AUTH_ROUTES.has(pathname);
  const isOnboarding = pathname === "/onboarding";
  const needsOnboarding =
    Boolean(user) &&
    !profileLoading &&
    (!profile || !profile.onboardingComplete) &&
    !isAuthRoute &&
    !isOnboarding;
  const shouldLeaveOnboarding =
    Boolean(user) &&
    !profileLoading &&
    Boolean(profile?.onboardingComplete) &&
    isOnboarding;

  useEffect(() => {
    if (authLoading || profileLoading) {
      return;
    }

    if (needsOnboarding) {
      router.replace("/onboarding");
      return;
    }

    if (shouldLeaveOnboarding) {
      router.replace("/");
    }
  }, [
    authLoading,
    profileLoading,
    needsOnboarding,
    router,
    shouldLeaveOnboarding,
  ]);

  if (
    authLoading ||
    profileLoading ||
    needsOnboarding ||
    shouldLeaveOnboarding
  ) {
    return null;
  }

  return children;
}
