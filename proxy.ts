import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-helpcast-page", request.nextUrl.pathname.startsWith("/helpcast") ? "true" : "false");
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
