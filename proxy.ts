import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  console.log("API ", process.env.NEXT_PUBLIC_API_BASE_URL);
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.startsWith("/auth");
  const isOnboardingRoute = pathname.startsWith("/onboarding");
  const isUserRoute = pathname.startsWith("/user");
  const isTeacherRoute = pathname.startsWith("/admin");
  console.log("token ", token);
  if (!token && (isUserRoute || isTeacherRoute || isOnboardingRoute))
    return NextResponse.redirect(new URL("/auth/login", req.url));

  if (!token) return NextResponse.next();

  let user = null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
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

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/:path*",
    // "/onboarding/:path*",
    "/user/:path*",
    "/admin/:path*",
  ],
};
