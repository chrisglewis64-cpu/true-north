import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/database/database.types";
import {
  isAuthEntryPath,
  isAuthPublicPath,
  isMorningCommitPath,
  isOnboardingPath,
  MORNING_COMMIT_PATH,
  ONBOARDING_PATH,
  POST_AUTH_REDIRECT,
  SIGN_IN_PATH,
} from "@/lib/auth/paths";
import { resolvePostAuthPath } from "@/lib/auth/post-auth";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/config";

function withSupabaseCookies(
  from: NextResponse,
  to: NextResponse
): NextResponse {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie.name, cookie.value);
  });
  return to;
}

function redirectWithCookies(
  request: NextRequest,
  supabaseResponse: NextResponse,
  pathname: string
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return withSupabaseCookies(supabaseResponse, NextResponse.redirect(url));
}

/**
 * Refreshes the Supabase auth session and enforces:
 * - Unauthenticated → Sign In
 * - Authenticated on Sign In / Create Account → post-auth destination
 * - Incomplete onboarding → /onboarding
 * - Missing today's Morning Commitment → /
 * - Otherwise → allow (Compass / app)
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isPublic = isAuthPublicPath(pathname);

  if (!user && !isPublic) {
    return redirectWithCookies(request, supabaseResponse, SIGN_IN_PATH);
  }

  if (!user) {
    return supabaseResponse;
  }

  // Signed-in users should not linger on auth entry pages.
  if (isAuthEntryPath(pathname)) {
    const destination = await resolvePostAuthPath(supabase, user.id);
    return redirectWithCookies(request, supabaseResponse, destination);
  }

  // API and offline assets stay public even when signed in.
  if (isPublic && !isAuthEntryPath(pathname)) {
    return supabaseResponse;
  }

  const required = await resolvePostAuthPath(supabase, user.id);
  const onOnboarding = isOnboardingPath(pathname);
  const onMorning = isMorningCommitPath(pathname);

  if (required === ONBOARDING_PATH && !onOnboarding) {
    return redirectWithCookies(request, supabaseResponse, ONBOARDING_PATH);
  }

  if (required === MORNING_COMMIT_PATH && !onMorning) {
    return redirectWithCookies(request, supabaseResponse, MORNING_COMMIT_PATH);
  }

  if (required === POST_AUTH_REDIRECT && (onOnboarding || onMorning)) {
    return redirectWithCookies(request, supabaseResponse, POST_AUTH_REDIRECT);
  }

  return supabaseResponse;
}
