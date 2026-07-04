import axios from "axios";
import { jwtDecode } from "jwt-decode";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const routeRoles: { [key: string]: string[] } = {
  "/employee": ["employee", "admin"],
  "/admin": ["admin"],
  "/manager": ["manager", "admin"],
};

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const pathPrefix="/"+path.split("/")[1]
  const allowedRoles: string[] = routeRoles[pathPrefix];
  if (!allowedRoles && path !== "/") {
    // if allowedRoles is empty then it means the path is not listed in routeRoles object which means it is not a protected route so we simply give the access
    return NextResponse.next();
  }
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  if (accessToken) {
    const decodedToken = jwtDecode<{
      role?: string;
      username: string;
    }>(accessToken);
    const userRole = decodedToken.role;
    if (!userRole) {
      return NextResponse.redirect(new URL("/getstarted", request.url)); //this means user is not enrolled in the company so we redirect them to getstarted page
    }

    if (allowedRoles.includes(userRole)) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    console.log("Access token not found in cookie");

    if (!refreshToken) {
      console.log("refresh token not found");
      return NextResponse.redirect(new URL("/", request.url));
    }
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    const refreshResponse = await axios.post(`${backendUrl}/refresh`, null, {
      // we cannot do withCredentials:true here because withCredentials: true is a browser-only axios option — it tells the browser to
      // include cookies on cross-origin requests. since middleware is serverside we manually send cookie in the headers
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });
    if (refreshResponse.data.success) {
      const redirectResponse = NextResponse.redirect(
        new URL(path, request.url),
      );
      // Forward the Set-Cookie headers from the backend so the browser actually stores the new accessToken
      const setCookieHeader = refreshResponse.headers["set-cookie"];
      if (setCookieHeader) {
        setCookieHeader.forEach((cookie: string) => {
          redirectResponse.headers.append("Set-Cookie", cookie); //we are putting the set-cookie header in the response with the cookie we got from express backend. this response is sent to the browser ie tothe redirect url
        });
      }
      return redirectResponse;
    } else if (!refreshResponse.data.success) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}
export const config = {
  matcher: ["/admin/:path*", "/employee/:path*", "/manager/:path*"],
};
