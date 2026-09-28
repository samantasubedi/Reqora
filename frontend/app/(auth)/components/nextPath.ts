/**
 * Safe `?next=` return-to helpers for the auth flow.
 *
 * Only same-app paths are honored (must start with a single `/`) so a
 * crafted login link can never bounce users to an external site.
 */
export function getSafeNext(searchParams: URLSearchParams): string | null {
  const next = searchParams.get("next");
  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return null;
}

export function withNext(href: "/login" | "/register", next: string | null) {
  return next ? `${href}?next=${encodeURIComponent(next)}` : href;
}
