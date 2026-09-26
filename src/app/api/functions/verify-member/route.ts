import { NextRequest, NextResponse } from "next/server";

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "realtorsmedia-cf89e";
const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDw0ACPp7URrAl-YqC2ooQUKPA0Y_Mk76c";

export const dynamic = "force-dynamic";

type FirestoreFields = Record<string, { stringValue?: string }>;

// Reads one `idCards` document through the Firestore REST API (the collection is publicly readable)
async function fetchIdCard(id: string): Promise<FirestoreFields | null> {
  const url =
    `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/idCards/` +
    `${encodeURIComponent(id)}?key=${API_KEY}`;
  const res = await fetch(url, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Registry lookup failed (${res.status})`);
  const doc = await res.json();
  return (doc.fields as FirestoreFields) || {};
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const employeeId = searchParams.get("employeeId")?.trim();

  if (!employeeId || employeeId.length > 64 || employeeId.includes("/")) {
    return NextResponse.json({ error: "Missing or invalid employeeId parameter" }, { status: 400 });
  }

  try {
    const fields = (await fetchIdCard(employeeId)) ?? (await fetchIdCard(employeeId.toUpperCase()));
    const status = fields?.status?.stringValue || (fields ? "ACTIVE" : "NOT_FOUND");
    // Same rule as the /verify page: replaced or suspended cards do not verify
    const verified = !!fields && status === "ACTIVE";

    return NextResponse.json({
      success: true,
      verified,
      employeeId: fields?.employeeId?.stringValue || employeeId,
      ...(verified && fields
        ? {
          name: fields.fullName?.stringValue || fields.name?.stringValue || "",
          designation: fields.designation?.stringValue || "",
          cardType: fields.cardType?.stringValue || "member",
        }
        : {}),
      authority: "Realtors Media National Registry",
      status,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("verify-member lookup error:", err);
    return NextResponse.json({ success: false, error: "Verification service unavailable" }, { status: 502 });
  }
}
