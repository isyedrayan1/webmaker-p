import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Protected routes requiring user login
const PROTECTED_PREFIXES = [
  "/overview",
  "/websites",
  "/deployments",
  "/domains",
  "/settings",
];

// Public authentication pages
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const token = request.cookies.get("wm_auth_token")?.value;

  // Allow API routes to handle their own responses
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 1. Check if user is accessing the public landing page or auth page while already logged in
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  if ((pathname === "/" || isAuthRoute) && token) {
    return NextResponse.redirect(new URL("/websites", request.url));
  }

  // 2. Check if user is accessing a protected studio route without session
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes that are public (/api/auth, /api/preview)
     * - static assets (.svg, .png, .jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
