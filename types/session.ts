import type { OnboardingProgress } from "@/lib/onboarding/stages";

/**
 * The current in-memory user session.
 */
export interface UserSession {
  id: string;
  displayName: string;
  email: string | null;
  startedAt: string;
  /** Null until first-time onboarding is finished. */
  onboardingCompletedAt: string | null;
  /** Explicit onboarding stage timestamps (profile-persisted). */
  onboarding: OnboardingProgress;
}
