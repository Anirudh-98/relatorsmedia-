import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const MAX_JSON_BYTES = 32 * 1024;

/**
 * Parses a JSON request body against `schema`. Returns the data, or a 4xx response to send back.
 * Oversized, malformed and invalid bodies are rejected without echoing internal error details.
 */
export async function parseJsonBody<T extends z.ZodType>(
  req: NextRequest,
  schema: T
): Promise<{ data: z.infer<T> } | { response: NextResponse }> {
  if (Number(req.headers.get("content-length") || 0) > MAX_JSON_BYTES) {
    return { response: NextResponse.json({ error: "Request body too large" }, { status: 413 }) };
  }
  let raw: string;
  try {
    raw = await req.text();
  } catch {
    return { response: NextResponse.json({ error: "Invalid request body" }, { status: 400 }) };
  }
  if (raw.length > MAX_JSON_BYTES) {
    return { response: NextResponse.json({ error: "Request body too large" }, { status: 413 }) };
  }
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return { response: NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) };
  }
  const result = schema.safeParse(body);
  if (!result.success) {
    return {
      response: NextResponse.json(
        { error: result.error.issues[0]?.message || "Invalid request" },
        { status: 400 }
      ),
    };
  }
  return { data: result.data };
}

/** Required, trimmed text field of at most `max` characters. */
export const requiredText = (label: string, max: number) =>
  z.string({ error: `${label} is required` }).trim().min(1, `${label} is required`).max(max, `${label} is too long`);

/** Optional text field of at most `max` characters. */
export const optionalText = (max: number) => z.string().trim().max(max).optional();
