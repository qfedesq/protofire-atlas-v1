import { NextResponse } from "next/server";

import { getAuth0Client, isAuth0Configured } from "@/lib/auth0";

export async function proxy(request: Request) {
  if (!isAuth0Configured()) {
    return NextResponse.next();
  }

  const auth0 = getAuth0Client();

  if (!auth0) {
    return NextResponse.next();
  }

  return auth0.middleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
