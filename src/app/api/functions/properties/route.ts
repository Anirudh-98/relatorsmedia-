import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { parseJsonBody, requiredText } from "@/lib/server/requestGuards";

// Other listing fields are accepted but not used here
const propertySchema = z.object({
  title: requiredText("Title", 200),
  propertyType: requiredText("Property type", 60),
  city: requiredText("City", 100),
  price: requiredText("Price", 60),
  name: requiredText("Name", 100),
  phone: requiredText("Phone", 30),
});

export async function POST(req: NextRequest) {
  const parsed = await parseJsonBody(req, propertySchema);
  if ("response" in parsed) {
    return parsed.response;
  }

  const referenceId = `PROP-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  return NextResponse.json({
    success: true,
    message: "Property listing received and processed by Realtors Media Cloud Services",
    referenceId,
    timestamp: new Date().toISOString(),
  });
}
