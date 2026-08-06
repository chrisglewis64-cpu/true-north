/** Post-auth destination when onboarding and today's commitment are complete. */
export const POST_AUTH_REDIRECT = "/operations";

/** First-time setup wizard. */
export const ONBOARDING_PATH = "/onboarding";

/** Daily Morning Commitment (Who are you today?). */
export const MORNING_COMMIT_PATH = "/";

export const SIGN_IN_PATH = "/sign-in";
export const CREATE_ACCOUNT_PATH = "/create-account";

/** Routes reachable without an authenticated session. */
export const AUTH_PUBLIC_PATHS = [
  SIGN_IN_PATH,
  CREATE_ACCOUNT_PATH,
  "/~offline",
  "/manifest.webmanifest",
  "/sw.js",
] as const;

export function isAuthPublicPath(pathname: string): boolean {
  return AUTH_PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function isMorningCommitPath(pathname: string): boolean {
  return pathname === MORNING_COMMIT_PATH;
}
