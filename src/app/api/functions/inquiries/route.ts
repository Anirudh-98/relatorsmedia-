import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { optionalText, parseJsonBody, requiredText } from "@/lib/server/requestGuards";

const inquirySchema = z.object({
  name: requiredText("Name", 100),
  phone: requiredText("Phone", 30),
  email: optionalText(254),
  propertyName: optionalText(200),
  message: optionalText(2000),
});

export async function POST(req: NextRequest) {
  const parsed = await parseJsonBody(req, inquirySchema);
  if ("response" in parsed) return parsed.response;

  const leadId = `LEAD-${Date.now()}`;

  return NextResponse.json({
    success: true,
    message: "Lead inquiry registered successfully",
    leadId,
    timestamp: new Date().toISOString(),
  });
}
