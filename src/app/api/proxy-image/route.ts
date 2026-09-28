import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

// Only hosts that serve the site's own images (Firebase Storage, Google profile photos, our domains).
// An allowlist also rules out requests to the server's own network (localhost, private ranges).
const ALLOWED_HOSTS = [
  "firebasestorage.googleapis.com",
  "storage.googleapis.com",
  "lh3.googleusercontent.com",
  "realtorsmedia.world",
  "www.realtorsmedia.world",
  "realtorsmedia.com",
  "www.realtorsmedia.com",
];
const ALLOWED_HOST_SUFFIXES = [".firebasestorage.app"];

function isAllowedImageUrl(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false;
  }
  if (url.protocol !== "https:" || url.username || url.password || (url.port && url.port !== "443")) return false;
  const host = url.hostname.toLowerCase();
  return ALLOWED_HOSTS.includes(host) || ALLOWED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix));
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

// Proxied bytes are served from our origin: never let them be sniffed or run as a document
const SAFE_HEADERS = {
  ...CORS_HEADERS,
  "X-Content-Type-Options": "nosniff",
  "Content-Security-Policy": "default-src 'none'; sandbox",
};

function errorResponse(message: string, status: number) {
  return new NextResponse(message, { status, headers: SAFE_HEADERS });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return errorResponse("Missing url parameter", 400);
  }

  if (imageUrl.length > 4096 || !isAllowedImageUrl(imageUrl)) {
    return errorResponse("URL not allowed", 400);
  }

  try {
    const res = await fetch(imageUrl, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      return errorResponse("Failed to fetch image", res.status === 404 ? 404 : 502);
    }

    const contentType = (res.headers.get("content-type") || "").toLowerCase();
    // Only raster images are proxied: SVG can carry scripts
    if (!contentType.startsWith("image/") || contentType.startsWith("image/svg")) {
      return errorResponse("Not an image", 415);
    }
    const declaredLength = Number(res.headers.get("content-length") || 0);
    if (declaredLength > MAX_IMAGE_BYTES) {
      return errorResponse("Image too large", 413);
    }
    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_IMAGE_BYTES) {
      return errorResponse("Image too large", 413);
    }

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        ...SAFE_HEADERS,
        "Content-Type": contentType,
        "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("proxy-image error:", error);
    return errorResponse("Error proxying image", 502);
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
