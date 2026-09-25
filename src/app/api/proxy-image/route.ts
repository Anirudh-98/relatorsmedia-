import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");

  if (!imageUrl) {
    return new NextResponse("Missing url parameter", {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    const res = await fetch(imageUrl, {
      cache: "no-store",
    });

    if (!res.ok) {
      return new NextResponse(`Failed to fetch image: ${res.statusText}`, {
        status: res.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error: any) {
    return new NextResponse(`Error proxying image: ${error?.message}`, {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
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
