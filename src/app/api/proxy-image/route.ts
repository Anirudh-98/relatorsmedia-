import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    let targetUrl: URL;
    try {
      targetUrl = new URL(imageUrl);
    } catch {
      return new NextResponse("Invalid URL", { status: 400 });
    }

    if (targetUrl.protocol !== "http:" && targetUrl.protocol !== "https:") {
      return new NextResponse("Invalid protocol", { status: 400 });
    }

    // Fetch the remote image (e.g. from Firebase Storage, Cloud Storage, or CDNs)
    const response = await fetch(targetUrl.toString(), {
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "User-Agent": "RealtorsMediaImageProxy/1.0",
      },
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch image: ${response.status}`, {
        status: response.status,
      });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(Buffer.from(arrayBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    });
  } catch (error: any) {
    console.error("Proxy image error:", error);
    return new NextResponse("Error fetching remote image", { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}
