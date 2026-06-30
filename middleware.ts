import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const defaultAdminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "usmanbaig124@gmail.com")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

function toAdminLogin(request: NextRequest, destination?: string) {
  const url = new URL("/admin/login", request.url);
  if (destination && destination !== "/admin/login") {
    url.searchParams.set("redirectTo", destination);
  }
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  // Only guard /admin routes
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next({ request: { headers: request.headers } });
  }

  // Always allow the admin login page through
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next({ request: { headers: request.headers } });
  }

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: Record<string, unknown>) {
          request.cookies.set({ name, value: "", ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // Get the current user from the server session
  let user = null;
  try {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data.user) {
      user = data.user;
    }
  } catch {
    return toAdminLogin(request, request.nextUrl.pathname);
  }

  if (!user?.email) {
    return toAdminLogin(request, request.nextUrl.pathname);
  }

  const normalizedEmail = user.email.trim().toLowerCase();

  // Fast path: email is in the env-var allow-list — no DB call needed
  if (defaultAdminEmails.includes(normalizedEmail)) {
    return response;
  }

  // Fallback: check admin_profiles table
  try {
    const { data } = await supabase
      .from("admin_profiles")
      .select("role")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (data?.role === "admin" || data?.role === "super_admin") {
      return response;
    }
  } catch {
    // DB unreachable — deny access
  }

  // Authenticated but not an admin — send to homepage
  return NextResponse.redirect(new URL("/", request.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};
