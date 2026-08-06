import { NextResponse, type NextRequest } from "next/server";
import { isAuthPublicPath, SIGN_IN_PATH } from "@/lib/auth/paths";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function middleware(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    // Production must never allow anonymous app access without auth configured.
    if (
      process.env.NODE_ENV === "production" &&
      !isAuthPublicPath(request.nextUrl.pathname)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = SIGN_IN_PATH;
      url.search = "";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
