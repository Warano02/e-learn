import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.startsWith("/auth");
  const isOnboardingRoute = pathname.startsWith("/onboarding");
  const isUserRoute = pathname.startsWith("/user");
  const isTeacherRoute = pathname.startsWith("/teacher");

  if (!token && (isUserRoute || isTeacherRoute || isOnboardingRoute))
    return NextResponse.redirect(new URL("/auth/login", req.url));

  if (!token) return NextResponse.next();

  let user = null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });

    if (!response.ok) throw new Error("Unauthorized");

    const data = await response.json();
    user = data.user;
  } catch {
    const redirect = NextResponse.redirect(new URL("/auth/login", req.url));
    redirect.cookies.delete("token");
    return redirect;
  }

  if (isAuthRoute) {
    return NextResponse.redirect(new URL("/user/dashboard", req.url));
  }

  if (isOnboardingRoute && user.onboarding === 0) {
    return NextResponse.redirect(new URL("/user/dashboard", req.url));
  }

  if (
    (isUserRoute || isOnboardingRoute) &&
    !["student", "teacher", "admin"].includes(user.role)
  ) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isTeacherRoute && !["teacher", "admin"].includes(user.role)) {
    return NextResponse.redirect(new URL("/user/dashboard", req.url));
  }

  if ((isUserRoute || isTeacherRoute) && user.onboarding > 0) {
    return NextResponse.redirect(
      new URL(`/onboarding/step-${user.onboarding}`, req.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/onboarding/:path*",
    "/user/:path*",
    "/teacher/:path*",
  ],
};
