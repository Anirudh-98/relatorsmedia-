import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Per-IP fixed-window rate limits for the API routes.
// Counters live in this server instance's memory, so on a multi-instance deployment each instance
// counts separately; put a shared limiter (e.g. Vercel WAF rate limiting) in front for hard limits.
const WINDOW_MS = 60_000;

const LIMITS: { prefix: string; max: number }[] = [
  // Every ID card preview/export loads its photo through this route
  { prefix: "/api/proxy-image", max: 240 },
  { prefix: "/api/functions/verify-member", max: 60 },
  { prefix: "/api/functions/", max: 20 },
];

const MAX_TRACKED_KEYS = 10_000;
const hits = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function prune(now: number) {
  for (const [key, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(key);
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rule = LIMITS.find((l) => pathname.startsWith(l.prefix));
  if (!rule || request.method === "OPTIONS") return NextResponse.next();

  const now = Date.now();
  if (hits.size > MAX_TRACKED_KEYS) prune(now);

  const key = `${rule.prefix}|${clientIp(request)}`;
  let entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    hits.set(key, entry);
  }
  entry.count++;

  const remaining = Math.max(0, rule.max - entry.count);
  const resetSeconds = Math.ceil((entry.resetAt - now) / 1000);

  if (entry.count > rule.max) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": String(resetSeconds),
          "X-RateLimit-Limit": String(rule.max),
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Limit", String(rule.max));
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  return response;
}

export const config = {
  matcher: "/api/:path*",
};
