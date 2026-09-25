/**
 * Helper to ensure image URLs load reliably without CORS errors
 * on both local development (localhost) and production (realtorsmedia.world),
 * and allow html-to-image canvas export without tainting.
 */
export const PLACEHOLDER_PHOTO = "/images/member_placeholder.svg";

export function getSafePhotoUrl(url?: string | null, version?: string | null): string {
  if (!url) return PLACEHOLDER_PHOTO;
  if (
    url.startsWith("data:") ||
    url.startsWith("blob:") ||
    url.startsWith("/")
  ) {
    return url;
  }
  // Route any external HTTP/HTTPS images (e.g. Firebase Storage) through our same-origin proxy
  if (url.startsWith("http://") || url.startsWith("https://")) {
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

  const targetUrl =
    url.startsWith("http://") || url.startsWith("https://")
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
