import { NextRequest, NextResponse } from "next/server";
import { isProxiableImageUrl } from "@/lib/utils/imageUtils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 10_000;
// Raster images only: SVG and HTML would run as a page of this site
const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];

/** Reads the body up to `maxBytes`; returns null when it is larger. */
async function readLimited(response: Response, maxBytes: number): Promise<Uint8Array | null> {
  if (!response.body) return new Uint8Array();
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  // Only this project's Firebase Storage photos are proxied
  if (!isProxiableImageUrl(imageUrl)) {
    return new NextResponse("URL not allowed", { status: 400 });
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        Accept: "image/avif,image/webp,image/png,image/jpeg,image/gif",
        "User-Agent": "RealtorsMediaImageProxy/1.0",
      },
      // A redirect could lead to a host that is not on the allowlist
      redirect: "error",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      return new NextResponse("Failed to fetch image", { status: response.status === 404 ? 404 : 502 });
    }

    const contentType = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
      return new NextResponse("Unsupported image type", { status: 415 });
    }

    if (Number(response.headers.get("content-length") || 0) > MAX_IMAGE_BYTES) {
      return new NextResponse("Image too large", { status: 413 });
    }
    const body = await readLimited(response, MAX_IMAGE_BYTES);
    if (!body) {
      return new NextResponse("Image too large", { status: 413 });
    }

    return new NextResponse(Buffer.from(body), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
        "Content-Security-Policy": "default-src 'none'; sandbox",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
      },
    });
  } catch (error) {
    console.error("Proxy image error:", error);
    return new NextResponse("Error fetching remote image", { status: 502 });
  }
}
