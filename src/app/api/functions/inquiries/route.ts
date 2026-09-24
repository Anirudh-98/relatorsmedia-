import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, propertyName } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and Phone are required for lead inquiry" },
        { status: 400 }
      );
    }

    const leadId = `LEAD-${Date.now()}`;

    return NextResponse.json({
      success: true,
      message: "Lead inquiry registered successfully",
      leadId,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
