/**
 * Helper to ensure image URLs load reliably without CORS errors
 * on both local development (localhost) and production (realtorsmedia.world),
 * and allow html-to-image canvas export without tainting.
 */
export const PLACEHOLDER_PHOTO = "/images/member_placeholder.svg";

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "realtorsmedia-cf89e";
const STORAGE_BUCKETS = Array.from(
  new Set([
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${FIREBASE_PROJECT_ID}.firebasestorage.app`,
    `${FIREBASE_PROJECT_ID}.firebasestorage.app`,
    `${FIREBASE_PROJECT_ID}.appspot.com`,
  ])
);

/**
 * True for download URLs of this project's Firebase Storage buckets: the only
 * remote images the same-origin proxy (/api/proxy-image) will fetch.
 */
export function isProxiableImageUrl(url: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.port) return false;
  return (
    parsed.hostname === "firebasestorage.googleapis.com" &&
    STORAGE_BUCKETS.some((bucket) => parsed.pathname.startsWith(`/v0/b/${bucket}/o/`))
  );
}

export function getSafePhotoUrl(url?: string | null, version?: string | null): string {
  if (!url) return PLACEHOLDER_PHOTO;
  if (
    url.startsWith("data:") ||
    url.startsWith("blob:") ||
    url.startsWith("/")
  ) {
    return url;
  }
  // Route Firebase Storage images through our same-origin proxy
  if (isProxiableImageUrl(url)) {
    const vParam = version ? `&v=${encodeURIComponent(version)}` : "";
    return `/api/proxy-image?url=${encodeURIComponent(url)}${vParam}`;
  }
  return url;
}

/**
 * Pre-fetches a remote image through the proxy and converts it to a base64 Data URL.
 * When an image is an inlined Data URL, html-to-image bypasses its internal cache
 * and guarantees that the downloaded card renders the exact active person's picture.
 */
export async function convertUrlToDataUrl(url: string): Promise<string> {
  if (!url) return "";
  if (url.startsWith("data:")) return url;

  const targetUrl = isProxiableImageUrl(url)
    ? `/api/proxy-image?url=${encodeURIComponent(url)}&t=${Date.now()}`
    : url;

  try {
    const res = await fetch(targetUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
    const blob = await res.blob();

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to convert image to data URL"));
        }
      };
      reader.onerror = () => reject(reader.error || new Error("FileReader error"));
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn("convertUrlToDataUrl error:", err);
    return url;
  }
}
