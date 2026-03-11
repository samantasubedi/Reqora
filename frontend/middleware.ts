import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const routeRoles: { [key: string]: string[] } = {
  "/employee/dashboard": ["employee"],
  "/admin/dashboard": ["admin"],
  "/manager/dashboard": ["manager"],
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const allowedRoles: string[] = routeRoles["pathname"];
  if (!allowedRoles) {
    // if allowedRoles is empty then it means the path is not listed in routeRoles object which means it is not a protected route so we simply give the access
    return NextResponse.next();
  }
  const token: string = request.cookies.get("accessToken")?.value!;
  const decodedToken = jwtDecode<{ role: string; username: string }>(token);
  const userRole = decodedToken.role;
  if (allowedRoles.includes(userRole)) {
    NextResponse.next();
  } else {
    NextResponse.redirect("/login");
  }
}
export const config = {
  matcher: ["/admin/:path*", "/employee/:path*", "/manager/path*"],
};
