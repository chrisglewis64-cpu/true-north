import {
  MORNING_COMMIT_PATH,
  ONBOARDING_PATH,
  POST_AUTH_REDIRECT,
  WELCOME_PATH,
} from "@/lib/auth/paths";

/**
 * Explicit onboarding stages — only advance forward.
 * welcome → standards → mission → morning_commitment → complete
 */
export type OnboardingStage =
  | "welcome"
  | "standards"
  | "mission"
  | "morning_commitment"
  | "complete";

export type OnboardingProgress = {
  welcomeCompletedAt: string | null;
  standardsCompletedAt: string | null;
  missionCompletedAt: string | null;
  onboardingCompletedAt: string | null;
};

export const EMPTY_ONBOARDING_PROGRESS: OnboardingProgress = {
  welcomeCompletedAt: null,
  standardsCompletedAt: null,
  missionCompletedAt: null,
  onboardingCompletedAt: null,
};

export function resolveOnboardingStage(
  progress: OnboardingProgress
): OnboardingStage {
  if (progress.onboardingCompletedAt) {
    return "complete";
  }
  if (!progress.welcomeCompletedAt) {
    return "welcome";
  }
  if (!progress.standardsCompletedAt) {
    return "standards";
  }
  if (!progress.missionCompletedAt) {
    return "mission";
  }
  return "morning_commitment";
}

/**
 * Canonical path for a stage.
 * Daily morning commitment (after onboarding) is handled separately.
 */
export function pathForOnboardingStage(stage: OnboardingStage): string {
  switch (stage) {
    case "welcome":
      return WELCOME_PATH;
    case "standards":
    case "mission":
    case "morning_commitment":
      return ONBOARDING_PATH;
    case "complete":
      return POST_AUTH_REDIRECT;
  }
}

/**
 * Whether the user may remain on `pathname` for the given stage.
 * Guard redirects only when this returns false.
 */
export function isPathAllowedForStage(
  pathname: string,
  stage: OnboardingStage
): boolean {
  if (stage === "welcome") {
    return pathname === WELCOME_PATH;
  }

  if (
    stage === "standards" ||
    stage === "mission" ||
    stage === "morning_commitment"
  ) {
    return (
      pathname === ONBOARDING_PATH ||
      pathname.startsWith(`${ONBOARDING_PATH}/`)
    );
  }

  // complete — daily morning commit gate may send users to `/`
  return (
    pathname !== WELCOME_PATH &&
    pathname !== ONBOARDING_PATH &&
    !pathname.startsWith(`${ONBOARDING_PATH}/`)
  );
}

/**
 * Wizard step (1–3) for the in-progress onboarding path.
 * 1 = standards, 2 = mission, 3 = morning commitment.
 */
export function wizardStepForStage(stage: OnboardingStage): 1 | 2 | 3 {
  switch (stage) {
    case "welcome":
    case "standards":
      return 1;
    case "mission":
      return 2;
    case "morning_commitment":
    case "complete":
      return 3;
  }
}

export function logOnboardingRedirect(details: {
  userId: string;
  stage: OnboardingStage;
  pathname: string;
  target: string | null;
  reason: string;
}): void {
  console.log("[onboarding-guard]", {
    user: details.userId,
    stage: details.stage,
    pathname: details.pathname,
    redirectTarget: details.target,
    reason: details.reason,
  });
}

/** @deprecated Prefer pathForOnboardingStage — kept for clarity at call sites. */
export function morningCommitPath(): string {
  return MORNING_COMMIT_PATH;
}
