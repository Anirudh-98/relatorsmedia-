/**
 * Realtors Media Cloud Functions Client
 * Seamlessly calls backend cloud function endpoints deployed on Vercel Serverless runtime.
 */

export async function verifyMemberCloudFunction(employeeId: string) {
  const res = await fetch(`/api/functions/verify-member?employeeId=${encodeURIComponent(employeeId)}`);
  if (!res.ok) {
    throw new Error(`Cloud function error: ${res.statusText}`);
  }
  return await res.json();
}

export async function submitPropertyCloudFunction(data: Record<string, any>) {
  const res = await fetch("/api/functions/properties", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Cloud function error: ${res.statusText}`);
  }
  return await res.json();
}

export async function submitLeadCloudFunction(data: Record<string, any>) {
  const res = await fetch("/api/functions/inquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Cloud function error: ${res.statusText}`);
  }
  return await res.json();
}
