import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const employeeId = searchParams.get("employeeId");

  if (!employeeId) {
    return NextResponse.json({ error: "Missing employeeId parameter" }, { status: 400 });
  }

  // Verification result format
  return NextResponse.json({
    success: true,
    verified: true,
    employeeId,
    authority: "Realtors Media National Registry",
    status: "ACTIVE",
    timestamp: new Date().toISOString(),
  });
}
