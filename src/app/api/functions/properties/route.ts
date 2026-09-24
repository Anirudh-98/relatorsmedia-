import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, propertyType, city, price, name, phone } = body;

    if (!title || !propertyType || !city || !price || !name || !phone) {
      return NextResponse.json(
        { error: "Missing required property fields" },
        { status: 400 }
      );
    }

    const referenceId = `PROP-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    return NextResponse.json({
      success: true,
      message: "Property listing received and processed by Realtors Media Cloud Services",
      referenceId,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
