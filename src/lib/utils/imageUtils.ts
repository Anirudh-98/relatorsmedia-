/**
 * Helper to ensure image URLs load reliably without CORS errors
 * on both local development (localhost) and production (realtorsmedia.world),
 * and allow html-to-image canvas export without tainting.
 */
export function getSafePhotoUrl(url?: string | null): string {
  if (!url) return "/images/rohan_deshmukh.png";
  if (
    url.startsWith("data:") ||
    url.startsWith("blob:") ||
    url.startsWith("/")
  ) {
    return url;
  }
  // Route any external HTTP/HTTPS images (e.g. Firebase Storage) through our same-origin proxy
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
}
