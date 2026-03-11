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
  const allowedRoles: string[] = routeRoles[path];
  if (!allowedRoles) {
    // if allowedRoles is empty then it means the path is not listed in routeRoles object which means it is not a protected route so we simply give the access
    return NextResponse.next();
  }
  const token: string | undefined = request.cookies.get("accessToken")?.value;
  if (token) {
    const decodedToken = jwtDecode<{ role: string; username: string }>(token);
    const userRole = decodedToken.role;
    if (allowedRoles.includes(userRole)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    console.log("token not found in cookie");
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
export const config = {
  matcher: ["/admin/:path*", "/employee/:path*", "/manager/:path*"],
};
